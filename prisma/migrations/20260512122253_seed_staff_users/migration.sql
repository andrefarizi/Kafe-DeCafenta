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