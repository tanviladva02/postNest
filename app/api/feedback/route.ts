import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

const VALID_TYPES = ['FEEDBACK', 'REVIEW', 'SUGGESTION', 'ISSUE', 'BUG'];

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized. Please login to submit feedback.' }, { status: 401 });
    }

    const body = await req.json();
    const { type, rating, subject, message } = body;

    // Validate type
    const feedbackType = (type || 'FEEDBACK').toUpperCase();
    if (!VALID_TYPES.includes(feedbackType)) {
      return NextResponse.json(
        { error: `Invalid category type. Must be one of: ${VALID_TYPES.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate message
    if (!message || typeof message !== 'string' || message.trim().length < 5) {
      return NextResponse.json(
        { error: 'Please provide a detailed description (at least 5 characters).' },
        { status: 400 }
      );
    }

    // Validate rating if provided
    let numRating: number | null = null;
    if (rating !== undefined && rating !== null && rating !== '') {
      const parsedRating = parseInt(String(rating), 10);
      if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
        return NextResponse.json({ error: 'Rating must be between 1 and 5 stars.' }, { status: 400 });
      }
      numRating = parsedRating;
    }

    // Create Feedback record in DB
    const feedback = await prisma.feedback.create({
      data: {
        userId: user.id,
        type: feedbackType,
        rating: numRating,
        subject: subject ? String(subject).trim().slice(0, 150) : null,
        message: message.trim(),
        status: 'PENDING',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Thank you! Your feedback has been submitted successfully.',
      feedback,
    });
  } catch (error: any) {
    console.error('Submit feedback error:', error);
    return NextResponse.json({ error: error.message || 'Failed to submit feedback.' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Admins can see all feedback, normal users see their own
    const whereCondition = user.role === 'ADMIN' ? {} : { userId: user.id };

    const feedbacks = await prisma.feedback.findMany({
      where: whereCondition,
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true,
            username: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      feedbacks,
    });
  } catch (error: any) {
    console.error('Fetch feedback error:', error);
    return NextResponse.json({ error: 'Failed to fetch feedback history' }, { status: 500 });
  }
}
