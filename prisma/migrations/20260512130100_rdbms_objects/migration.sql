-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

CREATE OR REPLACE FUNCTION fn_update_avg_rating_on_write()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE menus
    SET
        "avgRating" = COALESCE((
            SELECT ROUND(AVG(rating)::NUMERIC, 2)
            FROM reviews
            WHERE "menuId" = NEW."menuId"
        ), 0.00),
        "updatedAt" = NOW()
    WHERE id = NEW."menuId";
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION fn_update_avg_rating_on_delete()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE menus
    SET
        "avgRating" = COALESCE((
            SELECT ROUND(AVG(rating)::NUMERIC, 2)
            FROM reviews
            WHERE "menuId" = OLD."menuId"
        ), 0.00),
        "updatedAt" = NOW()
    WHERE id = OLD."menuId";
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_avg_rating_write
AFTER INSERT OR UPDATE ON reviews
FOR EACH ROW EXECUTE FUNCTION fn_update_avg_rating_on_write();

CREATE TRIGGER trg_avg_rating_delete
AFTER DELETE ON reviews
FOR EACH ROW EXECUTE FUNCTION fn_update_avg_rating_on_delete();

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
    WHERE "orderCode" LIKE 'ORD-' || v_today || '-%';

    RETURN 'ORD-' || v_today || '-' || LPAD(v_seq::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- VIEWS
-- ============================================================

CREATE VIEW v_order_summary AS
SELECT
    o.id,
    o."orderCode",
    COALESCE(o."customerName", u.name) AS customer_name,
    u.name                            AS user_name,
    k.name                            AS kasir_name,
    t.name                            AS table_name,
    o."orderType",
    o.status,
    o."paymentMethod",
    o."totalPrice",
    o."isPaid",
    o."orderedAt",
    COUNT(oi.id)                      AS total_items
FROM orders o
LEFT JOIN public."User" u  ON u.id = o."userId"
LEFT JOIN public."User" k  ON k.id = o."kasirId"
LEFT JOIN tables t         ON t.id = o."tableId"
LEFT JOIN order_items oi   ON oi."orderId" = o.id
GROUP BY
    o.id,
    o."orderCode",
    o."customerName",
    u.name,
    k.name,
    t.name,
    o."orderType",
    o.status,
    o."paymentMethod",
    o."totalPrice",
    o."isPaid",
    o."orderedAt";

CREATE VIEW v_daily_revenue AS
SELECT
    DATE(o."orderedAt")                                      AS order_date,
    SUM(o."totalPrice")                                      AS total_revenue,
    SUM(CASE WHEN o."paymentMethod" = 'cash'
             THEN o."totalPrice" ELSE 0 END)                 AS cash_revenue,
    SUM(CASE WHEN o."paymentMethod" = 'ewallet'
             THEN o."totalPrice" ELSE 0 END)                 AS ewallet_revenue,
    COUNT(o.id)                                              AS total_orders,
    COUNT(CASE WHEN o."paymentMethod" = 'cash'    THEN 1 END) AS cash_orders,
    COUNT(CASE WHEN o."paymentMethod" = 'ewallet' THEN 1 END) AS ewallet_orders
FROM orders o
WHERE o.status  = 'selesai'
  AND o."isPaid" = TRUE
GROUP BY DATE(o."orderedAt")
ORDER BY order_date DESC;

CREATE VIEW v_menu_favorites AS
SELECT
    m.id,
    m.name           AS menu_name,
    c.name           AS category_name,
    m."avgRating",
    SUM(oi.quantity) AS total_ordered
FROM order_items oi
JOIN menus      m ON m.id = oi."menuId"
JOIN categories c ON c.id = m."categoryId"
JOIN orders     o ON o.id = oi."orderId"
WHERE o.status = 'selesai'
GROUP BY m.id, m.name, c.name, m."avgRating"
ORDER BY total_ordered DESC;
