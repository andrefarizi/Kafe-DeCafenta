const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Tambah 6 meja baru agar total 12 (sesuai desain Figma)
const newTables = [
  { name: 'Meja 6',  tableCode: 'TBL-06' },
  { name: 'Meja 7',  tableCode: 'TBL-07' },
  { name: 'Meja 8',  tableCode: 'TBL-08' },
  { name: 'Meja 9',  tableCode: 'TBL-09' },
  { name: 'Meja 10', tableCode: 'TBL-10' },
  { name: 'Meja 11', tableCode: 'TBL-11' },
];

async function run() {
  const client = await pool.connect();
  try {
    console.log('\n🌱 Menambahkan 6 meja baru...\n');

    for (const t of newTables) {
      const id = 'tbl_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
      await client.query(
        'INSERT INTO tables (id, name, "tableCode", status, "createdAt") VALUES ($1, $2, $3, \'tersedia\', NOW()) ON CONFLICT ("tableCode") DO NOTHING',
        [id, t.name, t.tableCode]
      );
      await new Promise(r => setTimeout(r, 5));
      console.log('✅ Ditambahkan:', t.name, '(' + t.tableCode + ')');
    }

    // Tampilkan semua meja sekarang
    const { rows } = await client.query(
      'SELECT name, "tableCode", status FROM tables ORDER BY "tableCode" ASC'
    );
    console.log('\n📋 Semua meja di database (' + rows.length + ' total):');
    console.table(rows);
  } finally {
    client.release();
    await pool.end();
  }
}

run()
  .then(() => { console.log('\n🎉 Selesai!\n'); process.exit(0); })
  .catch(e => { console.error(e); process.exit(1); });
