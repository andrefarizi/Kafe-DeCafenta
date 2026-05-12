-- ============================================================
-- SEED DATA
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Seed: 4 kategori utama
INSERT INTO categories (id, name) VALUES
    (gen_random_uuid()::text, 'Nasi'),
    (gen_random_uuid()::text, 'Mie'),
    (gen_random_uuid()::text, 'Snack'),
    (gen_random_uuid()::text, 'Minuman');

-- Seed: contoh menu per kategori
INSERT INTO menus (id, "categoryId", name, description, price, "updatedAt")
SELECT gen_random_uuid()::text, id, 'Nasi Goreng Spesial', 'Nasi goreng dengan telur, ayam, dan sayuran segar', 25000, NOW()
FROM categories WHERE name = 'Nasi';

INSERT INTO menus (id, "categoryId", name, description, price, "updatedAt")
SELECT gen_random_uuid()::text, id, 'Nasi Uduk', 'Nasi uduk dengan lauk komplit dan sambal kacang', 20000, NOW()
FROM categories WHERE name = 'Nasi';

INSERT INTO menus (id, "categoryId", name, description, price, "updatedAt")
SELECT gen_random_uuid()::text, id, 'Mie Goreng', 'Mie goreng dengan campuran sayuran dan bumbu khas', 22000, NOW()
FROM categories WHERE name = 'Mie';

INSERT INTO menus (id, "categoryId", name, description, price, "updatedAt")
SELECT gen_random_uuid()::text, id, 'Mie Rebus', 'Mie rebus kuah kaldu ayam hangat', 20000, NOW()
FROM categories WHERE name = 'Mie';

INSERT INTO menus (id, "categoryId", name, description, price, "updatedAt")
SELECT gen_random_uuid()::text, id, 'Kentang Goreng', 'Kentang goreng crispy dengan saus pilihan', 15000, NOW()
FROM categories WHERE name = 'Snack';

INSERT INTO menus (id, "categoryId", name, description, price, "updatedAt")
SELECT gen_random_uuid()::text, id, 'Es Teh Manis', 'Teh manis dingin segar', 8000, NOW()
FROM categories WHERE name = 'Minuman';

INSERT INTO menus (id, "categoryId", name, description, price, "updatedAt")
SELECT gen_random_uuid()::text, id, 'Jus Alpukat', 'Jus alpukat segar dengan susu dan madu', 18000, NOW()
FROM categories WHERE name = 'Minuman';

-- Seed: 6 meja contoh
INSERT INTO tables (id, name, "tableCode") VALUES
    (gen_random_uuid()::text, 'Meja 1', 'TBL-01'),
    (gen_random_uuid()::text, 'Meja 2', 'TBL-02'),
    (gen_random_uuid()::text, 'Meja 3', 'TBL-03'),
    (gen_random_uuid()::text, 'Meja 4', 'TBL-04'),
    (gen_random_uuid()::text, 'Meja 5', 'TBL-05'),
    (gen_random_uuid()::text, 'Meja VIP', 'TBL-VIP');

-- ============================================================
-- SEED DATA: DUMMY USERS FOR OWNER AND KASIR
-- ============================================================

DO $$ 
DECLARE
    v_abbil_id TEXT := gen_random_uuid()::text;
    v_davina_id TEXT := gen_random_uuid()::text;
BEGIN
    -- Insert Abbil (Owner)
    INSERT INTO "User" (id, name, email, password, role, "createdAt", "updatedAt")
    VALUES (v_abbil_id, 'Abbil', 'abbil@owner.com', '$2b$12$j0JnpWUT6bqYSxJtVE/Eq.V0SUYsu5scO1Ug//A/mhm6YT8IwP2QK', CAST('OWNER' AS "Role"), NOW(), NOW());

    INSERT INTO staff_details (id, "userId", phone, "staffNumber", "workStatus", "joinedAt")
    VALUES (gen_random_uuid()::text, v_abbil_id, '081234567890', 'OWN-001', CAST('aktif' AS "WorkStatus"), NOW());

    -- Insert Davina (Kasir)
    INSERT INTO "User" (id, name, email, password, role, "createdAt", "updatedAt")
    VALUES (v_davina_id, 'Davina', 'davina@kasir.com', '$2b$12$j0JnpWUT6bqYSxJtVE/Eq.V0SUYsu5scO1Ug//A/mhm6YT8IwP2QK', CAST('KASIR' AS "Role"), NOW(), NOW());

    INSERT INTO staff_details (id, "userId", phone, "staffNumber", "workStatus", "joinedAt")
    VALUES (gen_random_uuid()::text, v_davina_id, '089876543210', 'KSR-001', CAST('aktif' AS "WorkStatus"), NOW());
END $$;
