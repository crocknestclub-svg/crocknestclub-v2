import { NextRequest, NextResponse } from 'next/server';
import { assertAdmin } from '@/src/lib/adminAuth';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    await assertAdmin(req);
    const { to, subject, text } = await req.json();
    if (!to || !subject || !text) return NextResponse.json({ ok: false, error: 'Missing fields' }, { status: 400 });
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });
    await transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, text });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ ok: false, error: (error as Error).message }, { status: (error as unknown as { status: number }).status || 500 });
  }
}


