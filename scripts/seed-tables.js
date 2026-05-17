/**
 * Seed script: Mengisi data meja (tables) ke database.
 * Jalankan dengan: node scripts/seed-tables.js
 * 
 * Membuat 12 meja: Meja 1 s/d Meja 12
 * dengan kode MJ01–MJ12, semua status awal 'tersedia'.
 */

const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('ERROR: DATABASE_URL tidak ditemukan di file .env');
  process.exit(1);
}

const pool = new Pool({ connectionString });

// Data 12 meja sesuai denah di halaman /kasir/kelola-meja
const mejaData = [
  { name: 'Meja 1',  tableCode: 'MJ01' },
  { name: 'Meja 2',  tableCode: 'MJ02' },
  { name: 'Meja 3',  tableCode: 'MJ03' },
  { name: 'Meja 4',  tableCode: 'MJ04' },
  { name: 'Meja 5',  tableCode: 'MJ05' },
  { name: 'Meja 6',  tableCode: 'MJ06' },
  { name: 'Meja 7',  tableCode: 'MJ07' },
  { name: 'Meja 8',  tableCode: 'MJ08' },
  { name: 'Meja 9',  tableCode: 'MJ09' },
  { name: 'Meja 10', tableCode: 'MJ10' },
  { name: 'Meja 11', tableCode: 'MJ11' },
  { name: 'Meja 12', tableCode: 'MJ12' },
];

async function seedTables() {
  const client = await pool.connect();
  try {
    console.log('\n🔗 Terhubung ke database...\n');

    // Cek berapa meja yang sudah ada
    const { rows: existing } = await client.query('SELECT COUNT(*) as cnt FROM tables');
    const existingCount = parseInt(existing[0].cnt);
    console.log(`📋 Meja yang sudah ada di database: ${existingCount}`);

    if (existingCount > 0) {
      console.log('⚠️  Meja sudah ada! Menampilkan data yang ada:\n');
      const { rows } = await client.query(
        'SELECT name, "tableCode", status FROM tables ORDER BY "tableCode" ASC'
      );
      console.table(rows);
      console.log('\n✅ Tidak perlu seed ulang. Jika ingin reset, hapus dulu data meja yang ada.\n');
      return;
    }

    // Sisipkan semua meja baru
    console.log('🌱 Menyisipkan data meja baru...\n');
    let inserted = 0;

    for (const meja of mejaData) {
      // Generate CUID-like ID (pakai timestamp + random untuk sederhana)
      const id = `table_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      
      await client.query(
        `INSERT INTO tables (id, name, "tableCode", status, "createdAt")
         VALUES ($1, $2, $3, 'tersedia', NOW())
         ON CONFLICT ("tableCode") DO NOTHING`,
        [id, meja.name, meja.tableCode]
      );
      inserted++;
      // Delay kecil agar ID tidak sama
      await new Promise(r => setTimeout(r, 2));
    }

    console.log(`✅ Berhasil menyisipkan ${inserted} meja!\n`);

    // Tampilkan hasil
    const { rows: result } = await client.query(
      'SELECT name, "tableCode", status FROM tables ORDER BY "tableCode" ASC'
    );
    console.log('📋 Data meja yang tersimpan:');
    console.table(result);

  } catch (error) {
    console.error('\n❌ ERROR saat seed:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

seedTables()
  .then(() => {
    console.log('🎉 Seed selesai!\n');
    process.exit(0);
  })
  .catch(() => process.exit(1));
