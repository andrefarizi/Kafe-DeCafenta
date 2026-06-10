import { PrismaClient } from '@prisma/client';
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = "postgresql://postgres.goywggoripypfxwhqrej:%40Alfa1305000@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  const result = await prisma.menu.updateMany({
    where: {
      stock: null,
    },
    data: {
      stock: 1,
    },
  });
  console.log(`Updated ${result.count} menus to have a default stock of 1.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
