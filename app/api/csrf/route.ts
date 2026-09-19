import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { generateCsrfToken } from '@/lib/csrf';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized: Session required to generate CSRF token.' },
        { status: 401 }
      );
    }

    const csrfToken = generateCsrfToken(user.id, 'web-publish');

    return NextResponse.json({
      success: true,
      csrfToken,
    });
  } catch (error: any) {
    console.error('Error generating Anti-CSRF token:', error);
    return NextResponse.json(
      { error: 'Failed to issue security token.' },
      { status: 500 }
    );
  }
}
