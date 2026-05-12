-- ============================================================
--  CAFE WEB APP — PostgreSQL Schema v2 (Fixed)
--  Disesuaikan dengan schema NextAuth/Prisma dari teman
--  Standar RDBMS: FK, CHECK, INDEX, TRIGGER, VIEW
-- ============================================================

-- ============================================================
-- CATATAN INTEGRASI
-- Tabel berikut sudah ada dari schema teman (JANGAN dibuat ulang):
--   public."User"              → tabel utama user (id: text)
--   public."Account"           → OAuth provider
--   public."Session"           → session login
--   public."VerificationToken" → email verification
--   public._prisma_migrations  → internal Prisma
--
-- Schema ini HANYA menambahkan tabel bisnis cafe.
-- Semua FK ke user menggunakan tipe TEXT menyesuaikan "User".id
-- ============================================================

-- ============================================================
-- ENUM TYPES
-- (Role sudah ada di schema teman, tidak dibuat ulang)
-- ============================================================

CREATE TYPE work_status    AS ENUM ('aktif', 'non_aktif');
CREATE TYPE order_type     AS ENUM ('dine_in_app', 'dine_in_kasir');
CREATE TYPE order_status   AS ENUM ('masuk', 'dimasak', 'siap_diambil', 'selesai', 'dibatalkan');
CREATE TYPE payment_method AS ENUM ('cash', 'ewallet');
CREATE TYPE table_status   AS ENUM ('tersedia', 'dipakai');

-- ============================================================
-- STAFF_DETAILS
-- Data tambahan khusus untuk user ber-role KASIR dan OWNER
-- ============================================================

CREATE TABLE staff_details (
    id           TEXT        PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id      TEXT        NOT NULL,
    phone        VARCHAR(20),
    staff_number VARCHAR(20) NOT NULL,
    work_status  work_status NOT NULL DEFAULT 'aktif',
    joined_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_staff_user
        FOREIGN KEY (user_id)
        REFERENCES public."User"(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT uq_staff_user_id UNIQUE (user_id),
    CONSTRAINT uq_staff_number  UNIQUE (staff_number)
);

CREATE INDEX idx_staff_work_status ON staff_details(work_status);

-- ============================================================
-- CATEGORIES
-- ============================================================

CREATE TABLE categories (
    id         TEXT        PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name       VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_category_name UNIQUE (name)
);

-- Seed: 4 kategori utama
INSERT INTO categories (name) VALUES
    ('Nasi'),
    ('Mie'),
    ('Snack'),
    ('Minuman');

-- ============================================================
-- MENUS
-- ============================================================

CREATE TABLE menus (
    id           TEXT           PRIMARY KEY DEFAULT gen_random_uuid()::text,
    category_id  TEXT           NOT NULL,
    name         VARCHAR(100)   NOT NULL,
    description  TEXT,
    price        NUMERIC(10, 2) NOT NULL,
    image_url    TEXT,
    is_available BOOLEAN        NOT NULL DEFAULT TRUE,
    avg_rating   NUMERIC(3, 2)  NOT NULL DEFAULT 0.00,
    created_at   TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ    NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_menu_category
        FOREIGN KEY (category_id)
        REFERENCES categories(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT chk_menu_price      CHECK (price >= 0),
    CONSTRAINT chk_menu_avg_rating CHECK (avg_rating BETWEEN 0 AND 5)
);

CREATE INDEX idx_menus_category_id  ON menus(category_id);
CREATE INDEX idx_menus_is_available ON menus(is_available);

-- Seed: contoh menu per kategori
INSERT INTO menus (category_id, name, description, price)
SELECT id, 'Nasi Goreng Spesial', 'Nasi goreng dengan telur, ayam, dan sayuran segar', 25000
FROM categories WHERE name = 'Nasi';

INSERT INTO menus (category_id, name, description, price)
SELECT id, 'Nasi Uduk', 'Nasi uduk dengan lauk komplit dan sambal kacang', 20000
FROM categories WHERE name = 'Nasi';

INSERT INTO menus (category_id, name, description, price)
SELECT id, 'Mie Goreng', 'Mie goreng dengan campuran sayuran dan bumbu khas', 22000
FROM categories WHERE name = 'Mie';

INSERT INTO menus (category_id, name, description, price)
SELECT id, 'Mie Rebus', 'Mie rebus kuah kaldu ayam hangat', 20000
FROM categories WHERE name = 'Mie';

INSERT INTO menus (category_id, name, description, price)
SELECT id, 'Kentang Goreng', 'Kentang goreng crispy dengan saus pilihan', 15000
FROM categories WHERE name = 'Snack';

INSERT INTO menus (category_id, name, description, price)
SELECT id, 'Es Teh Manis', 'Teh manis dingin segar', 8000
FROM categories WHERE name = 'Minuman';

INSERT INTO menus (category_id, name, description, price)
SELECT id, 'Jus Alpukat', 'Jus alpukat segar dengan susu dan madu', 18000
FROM categories WHERE name = 'Minuman';

-- ============================================================
-- REVIEWS
-- Satu user hanya boleh review satu menu sekali
-- ============================================================

CREATE TABLE reviews (
    id         TEXT        PRIMARY KEY DEFAULT gen_random_uuid()::text,
    menu_id    TEXT        NOT NULL,
    user_id    TEXT        NOT NULL,
    rating     SMALLINT    NOT NULL,
    comment    TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_review_menu
        FOREIGN KEY (menu_id)
        REFERENCES menus(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_review_user
        FOREIGN KEY (user_id)
        REFERENCES public."User"(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT chk_review_rating       CHECK (rating BETWEEN 1 AND 5),
    CONSTRAINT uq_review_per_user_menu UNIQUE (menu_id, user_id)
);

CREATE INDEX idx_reviews_menu_id ON reviews(menu_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);

-- ============================================================
-- TRIGGER: auto-update avg_rating
-- FIX: pisah fungsi INSERT/UPDATE dan DELETE agar RETURN benar
-- ============================================================

CREATE OR REPLACE FUNCTION fn_update_avg_rating_on_write()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE menus
    SET
        avg_rating = COALESCE((
            SELECT ROUND(AVG(rating)::NUMERIC, 2)
            FROM reviews
            WHERE menu_id = NEW.menu_id
        ), 0.00),
        updated_at = NOW()
    WHERE id = NEW.menu_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION fn_update_avg_rating_on_delete()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE menus
    SET
        avg_rating = COALESCE((
            SELECT ROUND(AVG(rating)::NUMERIC, 2)
            FROM reviews
            WHERE menu_id = OLD.menu_id
        ), 0.00),
        updated_at = NOW()
    WHERE id = OLD.menu_id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_avg_rating_write
AFTER INSERT OR UPDATE ON reviews
FOR EACH ROW EXECUTE FUNCTION fn_update_avg_rating_on_write();

CREATE TRIGGER trg_avg_rating_delete
AFTER DELETE ON reviews
FOR EACH ROW EXECUTE FUNCTION fn_update_avg_rating_on_delete();

-- ============================================================
-- TABLES (Meja Cafe)
-- ============================================================

CREATE TABLE tables (
    id         TEXT         PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name       VARCHAR(50)  NOT NULL,
    table_code VARCHAR(20)  NOT NULL,
    status     table_status NOT NULL DEFAULT 'tersedia',
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_table_code UNIQUE (table_code)
);

CREATE INDEX idx_tables_status ON tables(status);

-- Seed: 6 meja contoh
INSERT INTO tables (name, table_code) VALUES
    ('Meja 1', 'TBL-01'),
    ('Meja 2', 'TBL-02'),
    ('Meja 3', 'TBL-03'),
    ('Meja 4', 'TBL-04'),
    ('Meja 5', 'TBL-05'),
    ('Meja VIP', 'TBL-VIP');

-- ============================================================
-- CARTS
-- Keranjang sementara, dihapus setelah order dibuat
-- ============================================================

CREATE TABLE carts (
    id       TEXT        PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id  TEXT        NOT NULL,
    menu_id  TEXT        NOT NULL,
    quantity INT         NOT NULL DEFAULT 1,
    notes    TEXT,
    added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_cart_user
        FOREIGN KEY (user_id)
        REFERENCES public."User"(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_cart_menu
        FOREIGN KEY (menu_id)
        REFERENCES menus(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT chk_cart_quantity CHECK (quantity > 0),
    CONSTRAINT uq_cart_user_menu UNIQUE (user_id, menu_id)
);

CREATE INDEX idx_carts_user_id ON carts(user_id);

-- ============================================================
-- ORDERS
-- ============================================================

CREATE TABLE orders (
    id             TEXT           PRIMARY KEY DEFAULT gen_random_uuid()::text,
    order_code     VARCHAR(30)    NOT NULL,
    user_id        TEXT,
    kasir_id       TEXT,
    table_id       TEXT,
    customer_name  VARCHAR(100),
    order_type     order_type     NOT NULL,
    status         order_status   NOT NULL DEFAULT 'masuk',
    payment_method payment_method NOT NULL,
    total_price    NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    is_paid        BOOLEAN        NOT NULL DEFAULT FALSE,
    notes          TEXT,
    ordered_at     TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ    NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_order_code UNIQUE (order_code),

    CONSTRAINT fk_order_user
        FOREIGN KEY (user_id)
        REFERENCES public."User"(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    CONSTRAINT fk_order_kasir
        FOREIGN KEY (kasir_id)
        REFERENCES public."User"(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    CONSTRAINT fk_order_table
        FOREIGN KEY (table_id)
        REFERENCES tables(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    CONSTRAINT chk_order_total_price CHECK (total_price >= 0),

    -- Minimal salah satu identitas pelanggan harus ada
    CONSTRAINT chk_order_customer_identity
        CHECK (user_id IS NOT NULL OR customer_name IS NOT NULL)
);

CREATE INDEX idx_orders_user_id    ON orders(user_id);
CREATE INDEX idx_orders_kasir_id   ON orders(kasir_id);
CREATE INDEX idx_orders_status     ON orders(status);
CREATE INDEX idx_orders_ordered_at ON orders(ordered_at);
CREATE INDEX idx_orders_is_paid    ON orders(is_paid);

-- Fungsi generate order_code otomatis: ORD-YYYYMMDD-0001
CREATE OR REPLACE FUNCTION fn_generate_order_code()
RETURNS TEXT AS $$
DECLARE
    v_today TEXT := TO_CHAR(NOW(), 'YYYYMMDD');
    v_seq   INT;
BEGIN
    SELECT COUNT(*) + 1
    INTO v_seq
    FROM orders
    WHERE order_code LIKE 'ORD-' || v_today || '-%';

    RETURN 'ORD-' || v_today || '-' || LPAD(v_seq::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- ORDER_ITEMS
-- ============================================================

CREATE TABLE order_items (
    id           TEXT           PRIMARY KEY DEFAULT gen_random_uuid()::text,
    order_id     TEXT           NOT NULL,
    menu_id      TEXT           NOT NULL,
    quantity     INT            NOT NULL,
    custom_notes TEXT,
    unit_price   NUMERIC(10, 2) NOT NULL,
    subtotal     NUMERIC(10, 2) GENERATED ALWAYS AS (quantity * unit_price) STORED,

    CONSTRAINT fk_item_order
        FOREIGN KEY (order_id)
        REFERENCES orders(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_item_menu
        FOREIGN KEY (menu_id)
        REFERENCES menus(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT chk_item_quantity   CHECK (quantity > 0),
    CONSTRAINT chk_item_unit_price CHECK (unit_price >= 0)
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_menu_id  ON order_items(menu_id);

-- ============================================================
-- INVOICES
-- ============================================================

CREATE TABLE invoices (
    id             TEXT           PRIMARY KEY DEFAULT gen_random_uuid()::text,
    order_id       TEXT           NOT NULL,
    invoice_number VARCHAR(30)    NOT NULL,
    total_amount   NUMERIC(10, 2) NOT NULL,
    cash_amount    NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    ewallet_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    issued_at      TIMESTAMPTZ    NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_invoice_order_id UNIQUE (order_id),
    CONSTRAINT uq_invoice_number   UNIQUE (invoice_number),

    CONSTRAINT fk_invoice_order
        FOREIGN KEY (order_id)
        REFERENCES orders(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT chk_invoice_total   CHECK (total_amount   >= 0),
    CONSTRAINT chk_invoice_cash    CHECK (cash_amount    >= 0),
    CONSTRAINT chk_invoice_ewallet CHECK (ewallet_amount >= 0),

    -- Split pembayaran harus sama dengan total
    CONSTRAINT chk_invoice_payment_split
        CHECK (ROUND(cash_amount + ewallet_amount, 2) = ROUND(total_amount, 2))
);

CREATE INDEX idx_invoices_order_id  ON invoices(order_id);
CREATE INDEX idx_invoices_issued_at ON invoices(issued_at);

-- ============================================================
-- VIEWS
-- ============================================================

-- FIX: alias kolom di GROUP BY supaya tidak ambigu
CREATE VIEW v_order_summary AS
SELECT
    o.id,
    o.order_code,
    COALESCE(o.customer_name, u.name) AS customer_name,
    u.name                            AS user_name,
    k.name                            AS kasir_name,
    t.name                            AS table_name,
    o.order_type,
    o.status,
    o.payment_method,
    o.total_price,
    o.is_paid,
    o.ordered_at,
    COUNT(oi.id)                      AS total_items
FROM orders o
LEFT JOIN public."User" u  ON u.id = o.user_id
LEFT JOIN public."User" k  ON k.id = o.kasir_id
LEFT JOIN tables t         ON t.id = o.table_id
LEFT JOIN order_items oi   ON oi.order_id = o.id
GROUP BY
    o.id,
    o.order_code,
    o.customer_name,
    u.name,
    k.name,
    t.name,
    o.order_type,
    o.status,
    o.payment_method,
    o.total_price,
    o.is_paid,
    o.ordered_at;

-- Pendapatan harian untuk grafik owner
CREATE VIEW v_daily_revenue AS
SELECT
    DATE(o.ordered_at)                                       AS order_date,
    SUM(o.total_price)                                       AS total_revenue,
    SUM(CASE WHEN o.payment_method = 'cash'
             THEN o.total_price ELSE 0 END)                  AS cash_revenue,
    SUM(CASE WHEN o.payment_method = 'ewallet'
             THEN o.total_price ELSE 0 END)                  AS ewallet_revenue,
    COUNT(o.id)                                              AS total_orders,
    COUNT(CASE WHEN o.payment_method = 'cash'    THEN 1 END) AS cash_orders,
    COUNT(CASE WHEN o.payment_method = 'ewallet' THEN 1 END) AS ewallet_orders
FROM orders o
WHERE o.status  = 'selesai'
  AND o.is_paid = TRUE
GROUP BY DATE(o.ordered_at)
ORDER BY order_date DESC;

-- Menu favorit berdasarkan histori pembelian
CREATE VIEW v_menu_favorites AS
SELECT
    m.id,
    m.name           AS menu_name,
    c.name           AS category_name,
    m.avg_rating,
    SUM(oi.quantity) AS total_ordered
FROM order_items oi
JOIN menus      m ON m.id = oi.menu_id
JOIN categories c ON c.id = m.category_id
JOIN orders     o ON o.id = oi.order_id
WHERE o.status = 'selesai'
GROUP BY m.id, m.name, c.name, m.avg_rating
ORDER BY total_ordered DESC;
