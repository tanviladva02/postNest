import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, category, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Please provide your name, email address, and message.' },
        { status: 400 }
      );
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    // Log the contact submission
    console.log(`[Contact Form Submission] From: ${name} (${email}) | Subject: ${subject || 'General'} | Category: ${category || 'General'}`);
    console.log(`Message: ${message}`);

    return NextResponse.json({
      success: true,
      message: 'Thank you for reaching out! A member of the PostNest editorial team will review your message and respond within 24 business hours.',
    });
  } catch (error: any) {
    console.error('Contact API Error:', error);
    return NextResponse.json(
      { error: 'Something went wrong processing your message. Please try again.' },
      { status: 500 }
    );
  }
}
