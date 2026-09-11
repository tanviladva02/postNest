import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Standard Email Regex (RFC 5322 compliant simplified)
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

// International Phone Format: Allows +, parentheses, spaces, dashes, digits; requires 7-20 characters with at least 7 digits
const PHONE_REGEX = /^\+?[0-9\s\-().]{7,20}$/;

interface ContactRequestBody {
  name: unknown;
  email: unknown;
  phone: unknown;
  subject: unknown;
  message: unknown;
}

interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  sanitizedData?: {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
  };
}

/**
 * Validates and sanitizes the contact submission payload.
 */
function validateContactPayload(body: ContactRequestBody): ValidationResult {
  const errors: Record<string, string> = {};

  // 1. Name Validation (Required)
  const rawName = typeof body.name === 'string' ? body.name.trim() : '';
  if (!rawName) {
    errors.name = 'Full name is required.';
  } else if (rawName.length < 2 || rawName.length > 100) {
    errors.name = 'Name must be between 2 and 100 characters.';
  }

  // 2. Email Validation (Required)
  const rawEmail = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  if (!rawEmail) {
    errors.email = 'Email address is required.';
  } else if (rawEmail.length > 255) {
    errors.email = 'Email address is too long (maximum 255 characters).';
  } else if (!EMAIL_REGEX.test(rawEmail)) {
    errors.email = 'Please provide a valid email address (e.g. name@company.com).';
  }

  // 3. Phone Validation (Required: 12 digits with country code, 10 digits without)
  const rawPhone = typeof body.phone === 'string' ? body.phone.trim() : '';
  if (!rawPhone) {
    errors.phone = 'Phone number is required.';
  } else {
    const allowedPhoneChars = /^\+?[0-9\s\-().]+$/;
    if (!allowedPhoneChars.test(rawPhone)) {
      errors.phone = 'Phone number contains invalid characters.';
    } else {
      const digitsOnly = rawPhone.replace(/\D/g, '');
      const hasCountryCodePrefix = rawPhone.startsWith('+');

      if (hasCountryCodePrefix) {
        if (digitsOnly.length !== 12) {
          errors.phone = `Phone number with country code must contain 12 digits (e.g. +91 98765 43210). Currently: ${digitsOnly.length} digits.`;
        }
      } else {
        if (digitsOnly.length !== 10 && digitsOnly.length !== 12) {
          errors.phone = `Phone number must be 10 digits (or 12 digits if including country code, e.g. 919876543210). Currently: ${digitsOnly.length} digits.`;
        }
      }
    }
  }

  // 4. Subject Validation (Required)
  const rawSubject = typeof body.subject === 'string' ? body.subject.trim() : '';
  if (!rawSubject) {
    errors.subject = 'Subject is required.';
  } else if (rawSubject.length < 3 || rawSubject.length > 200) {
    errors.subject = 'Subject must be between 3 and 200 characters.';
  }

  // 5. Message Validation (Required)
  const rawMessage = typeof body.message === 'string' ? body.message.trim() : '';
  if (!rawMessage) {
    errors.message = 'Message content is required.';
  } else if (rawMessage.length < 10) {
    errors.message = 'Message must be at least 10 characters long to provide sufficient detail.';
  } else if (rawMessage.length > 5000) {
    errors.message = 'Message exceeds maximum length of 5000 characters.';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors };
  }

  return {
    isValid: true,
    errors: {},
    sanitizedData: {
      name: rawName,
      email: rawEmail,
      phone: rawPhone,
      subject: rawSubject,
      message: rawMessage,
    },
  };
}

export async function POST(req: NextRequest) {
  try {
    let body: ContactRequestBody;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid JSON request payload.',
        },
        { status: 400 }
      );
    }

    // Perform validation
    const validation = validateContactPayload(body);
    if (!validation.isValid || !validation.sanitizedData) {
      return NextResponse.json(
        {
          success: false,
          error: 'Please fix the errors in your submission.',
          errors: validation.errors,
        },
        { status: 422 }
      );
    }

    const { name, email, phone, subject, message } = validation.sanitizedData;

    // Extract client metadata for audit & forensics
    const forwardedFor = req.headers.get('x-forwarded-for');
    const ipAddress = forwardedFor ? forwardedFor.split(',')[0].trim() : req.headers.get('x-real-ip') || null;
    const userAgent = req.headers.get('user-agent') || null;

    // Persist into database
    const savedInquiry = await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone,
        subject,
        message,
        status: 'UNREAD',
        ipAddress,
        userAgent,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        subject: true,
        createdAt: true,
      },
    });

    console.info(`[ContactForm] Stored new inquiry ${savedInquiry.id} from ${name} (${email}, ${phone})`);

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you for reaching out! Your message has been received and our team will get back to you shortly.',
        data: {
          id: savedInquiry.id,
          createdAt: savedInquiry.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('[ContactForm Error]:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'An unexpected error occurred while processing your request. Please try again later.',
      },
      { status: 500 }
    );
  }
}
