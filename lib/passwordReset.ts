import { prisma } from '@/lib/prisma';
import { randomUUID } from 'crypto';

export interface OtpRecord {
  id: string;
  email: string;
  otp: string;
  expiresAt: Date;
  used: boolean;
  attempts: number;
  createdAt: Date;
}

export async function getRecentActiveOtp(email: string, withinSeconds: number = 45): Promise<OtpRecord | null> {
  const cleanEmail = email.trim().toLowerCase();
  const cutoff = new Date(Date.now() - withinSeconds * 1000);

  try {
    if ((prisma as any).passwordResetOtp) {
      return await (prisma as any).passwordResetOtp.findFirst({
        where: {
          email: cleanEmail,
          createdAt: { gte: cutoff },
        },
      });
    }
  } catch (e) {
    // Fallback to raw query
  }

  // Raw SQL fallback
  try {
    const results: any[] = await prisma.$queryRaw`
      SELECT id, email, otp, "expiresAt", used, attempts, "createdAt"
      FROM "PasswordResetOtp"
      WHERE email = ${cleanEmail} AND "createdAt" >= ${cutoff}
      ORDER BY "createdAt" DESC
      LIMIT 1
    `;
    return results[0] || null;
  } catch (err) {
    console.error('[OTP Query Error]', err);
    return null;
  }
}

export async function invalidateAllOtps(email: string): Promise<void> {
  const cleanEmail = email.trim().toLowerCase();

  try {
    if ((prisma as any).passwordResetOtp) {
      await (prisma as any).passwordResetOtp.updateMany({
        where: { email: cleanEmail, used: false },
        data: { used: true },
      });
      return;
    }
  } catch (e) {
    // Fallback to raw query
  }

  try {
    await prisma.$executeRaw`
      UPDATE "PasswordResetOtp"
      SET used = true
      WHERE email = ${cleanEmail} AND used = false
    `;
  } catch (err) {
    console.error('[OTP Invalidate Error]', err);
  }
}

export async function createResetOtp(email: string, otp: string, expiresAt: Date): Promise<OtpRecord | null> {
  const cleanEmail = email.trim().toLowerCase();
  const id = randomUUID();
  const now = new Date();

  try {
    if ((prisma as any).passwordResetOtp) {
      return await (prisma as any).passwordResetOtp.create({
        data: {
          id,
          email: cleanEmail,
          otp,
          expiresAt,
          used: false,
          attempts: 0,
        },
      });
    }
  } catch (e) {
    // Fallback to raw query
  }

  try {
    await prisma.$executeRaw`
      INSERT INTO "PasswordResetOtp" (id, email, otp, "expiresAt", used, attempts, "createdAt")
      VALUES (${id}, ${cleanEmail}, ${otp}, ${expiresAt}, false, 0, ${now})
    `;
    return {
      id,
      email: cleanEmail,
      otp,
      expiresAt,
      used: false,
      attempts: 0,
      createdAt: now,
    };
  } catch (err) {
    console.error('[OTP Insert Error]', err);
    return null;
  }
}

export async function getLatestActiveOtp(email: string): Promise<OtpRecord | null> {
  const cleanEmail = email.trim().toLowerCase();

  try {
    if ((prisma as any).passwordResetOtp) {
      return await (prisma as any).passwordResetOtp.findFirst({
        where: {
          email: cleanEmail,
          used: false,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    }
  } catch (e) {
    // Fallback to raw query
  }

  try {
    const results: any[] = await prisma.$queryRaw`
      SELECT id, email, otp, "expiresAt", used, attempts, "createdAt"
      FROM "PasswordResetOtp"
      WHERE email = ${cleanEmail} AND used = false
      ORDER BY "createdAt" DESC
      LIMIT 1
    `;
    return results[0] || null;
  } catch (err) {
    console.error('[OTP Query Error]', err);
    return null;
  }
}

export async function incrementOtpAttempts(id: string): Promise<number> {
  try {
    if ((prisma as any).passwordResetOtp) {
      const updated = await (prisma as any).passwordResetOtp.update({
        where: { id },
        data: { attempts: { increment: 1 } },
        select: { attempts: true },
      });
      return updated.attempts;
    }
  } catch (e) {
    // Fallback to raw query
  }

  try {
    const results: any[] = await prisma.$queryRaw`
      UPDATE "PasswordResetOtp"
      SET attempts = attempts + 1
      WHERE id = ${id}
      RETURNING attempts
    `;
    return results[0]?.attempts || 1;
  } catch (err) {
    console.error('[OTP Increment Error]', err);
    return 1;
  }
}

export async function markOtpUsed(id: string): Promise<void> {
  try {
    if ((prisma as any).passwordResetOtp) {
      await (prisma as any).passwordResetOtp.update({
        where: { id },
        data: { used: true },
      });
      return;
    }
  } catch (e) {
    // Fallback to raw query
  }

  try {
    await prisma.$executeRaw`
      UPDATE "PasswordResetOtp"
      SET used = true
      WHERE id = ${id}
    `;
  } catch (err) {
    console.error('[OTP Mark Used Error]', err);
  }
}
