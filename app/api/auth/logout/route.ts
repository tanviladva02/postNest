import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const response = NextResponse.redirect(new URL('/', req.url));
  response.cookies.delete('pn_token');
  return response;
}

export async function POST(req: Request) {
  const response = NextResponse.redirect(new URL('/', req.url));
  response.cookies.delete('pn_token');
  return response;
}
