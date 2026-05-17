const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('No DATABASE_URL in environment. Set DATABASE_URL and rerun.');
  process.exit(2);
}

const pool = new Pool({ connectionString });

async function inspect() {
  const client = await pool.connect();
  try {
    console.log('Connected. Running quick inspection...\n');

    // Counts
    const { rows: orderCount } = await client.query("SELECT COUNT(*) as cnt FROM orders");
    const { rows: oiCount } = await client.query("SELECT COUNT(*) as cnt FROM order_items");
    const { rows: menuCount } = await client.query("SELECT COUNT(*) as cnt FROM menus");

    console.log('orders count:', orderCount[0].cnt);
    console.log('order_items count:', oiCount[0].cnt);
    console.log('menus count:', menuCount[0].cnt);

      const { rows: orderCols } = await client.query("SELECT column_name FROM information_schema.columns WHERE table_name='orders' ORDER BY ordinal_position");
      console.log('\norders table columns:');
      console.table(orderCols.map(r => r.column_name));

      const { rows: oiCols } = await client.query("SELECT column_name FROM information_schema.columns WHERE table_name='order_items' ORDER BY ordinal_position");
      console.log('\norder_items table columns:');
      console.table(oiCols.map(r => r.column_name));
    // Sample orders with orderedAt
    const { rows: sampleOrders } = await client.query('SELECT id, "orderCode" as "orderCode", "totalPrice" as "totalPrice", "paymentMethod" as "paymentMethod", "orderedAt" as "orderedAt" FROM orders ORDER BY "orderedAt" DESC LIMIT 5');
    console.log('\nSample recent orders:');
    console.table(sampleOrders);

    // Sample order_items join menu
    const { rows: sampleItems } = await client.query('SELECT oi.id, oi."orderId" as "orderId", oi."menuId" as "menuId", oi.quantity, oi."unitPrice" as "unitPrice", m.name as menu_name FROM order_items oi LEFT JOIN menus m ON oi."menuId" = m.id ORDER BY oi.id DESC LIMIT 10');
    console.log('\nSample order items (with menu names):');
    console.table(sampleItems);

    // Check if any orders exist for a specific month/year (current month)
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth() + 1;
    const start = new Date(y, m-1, 1).toISOString();
    const end = new Date(y, m, 1).toISOString();

    const { rows: monthOrders } = await client.query('SELECT COUNT(*) as cnt FROM orders WHERE "orderedAt" >= $1 AND "orderedAt" < $2', [start, end]);
    console.log(`\nOrders in current month (${y}-${m}):`, monthOrders[0].cnt);

  } finally {
    client.release();
    await pool.end();
  }
}

inspect().catch((e) => {
  console.error('Error inspecting DB:', e.message || e);
  process.exit(1);
});
