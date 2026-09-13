import { prisma } from '../lib/prisma';

async function main() {
  console.log('Migrating database schema for Google OAuth...');

  try {
    // 1. Add googleId column if it doesn't exist
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "googleId" TEXT;
    `);
    console.log('✓ Added googleId column to User table');

    // 2. Make passwordHash optional (nullable)
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "User" ALTER COLUMN "passwordHash" DROP NOT NULL;
    `);
    console.log('✓ Made passwordHash nullable for Google OAuth users');

    // 3. Create unique index on googleId if it doesn't exist
    await prisma.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "User_googleId_key" ON "User"("googleId");
    `);
    console.log('✓ Created unique index on googleId');

    console.log('SUCCESS: Database migration complete!');
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
