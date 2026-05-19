const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
console.log(Object.keys(prisma._runtimeDataModel.models.Table.fields).includes('layoutSlot'));
prisma.$disconnect();
