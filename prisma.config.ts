// Prisma v7 Config - database URL harus di sini, bukan di schema.prisma
// Docs: https://pris.ly/d/config-datasource

import { defineConfig } from "prisma/config";
import "dotenv/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL!,
    directUrl: process.env.DIRECT_URL,
  },
  migrations: {
    seed: 'npx tsx prisma/seed.ts',
  },
});
