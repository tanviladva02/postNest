import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const companies = await prisma.company.findMany({ where: { userId: user.id } });
  return NextResponse.json({ companies });
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { id, companyName, category, website, logo, description } = body;

    if (!companyName) return NextResponse.json({ error: 'Company Name is required' }, { status: 400 });

    const slug = companyName.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');

    let company;
    if (id) {
      company = await prisma.company.update({
        where: { id },
        data: { companyName, category, website, logo, description },
      });
    } else {
      company = await prisma.company.create({
        data: {
          userId: user.id,
          companyName,
          slug: `${slug}-${Date.now().toString().slice(-4)}`,
          category,
          website,
          logo,
          description,
        },
      });
    }

    return NextResponse.json({ success: true, company });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed saving company profile' }, { status: 500 });
  }
}
