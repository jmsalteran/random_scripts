import { PrismaClient } from "@prisma/client";
import { FraudManager } from "./fraud-manager";

async function main() {
  const prisma = new PrismaClient();
  try {
    const rows: any[] = await prisma.$queryRaw`
      SELECT * FROM "Transaction"
      WHERE status = 'CREATED'
      AND type = 'USD_BANK_DEPOSIT'
      ORDER BY RANDOM()
      LIMIT 1
    `;

    const tx = rows?.[0];
    if (!tx) {
      console.log('No transaction found');
      return;
    }

    const fraudManager = new FraudManager();
    const event = await fraudManager.onTransaction(tx.id);
    console.log(event);
    await prisma.transaction.update({
      where: { id: tx.id },
      data: {
        status: "COMPLETED",
      }
    });
  } finally {
    await prisma.$disconnect();
  }
}

main();