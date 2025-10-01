"use server";

import { prisma } from "../lib/prisma";
import { Resend } from "resend";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  if (resend) {
    await resend.emails.send({ from: process.env.RESEND_FROM ?? "no-reply@crocknestclub.com", to, subject, html });
    return;
  }
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });
  await transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, html });
}

export async function registerUser({ name, email, password }: { name: string; email: string; password: string }) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error("Email already registered");

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { name, email, passwordHash } });

  const token = await prisma.verificationToken.create({
    data: {
      userId: user.id,
      token: crypto.randomUUID(),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24h
    },
  });

  const link = `${APP_URL}/verify?token=${encodeURIComponent(token.token)}`;
  await sendEmail({
    to: email,
    subject: "Verify your CROCKNESTCLUB account",
    html: `<p>Hi ${name ?? "there"},</p><p>Please verify your email by clicking the link below:</p><p><a href="${link}">Verify Email</a></p>`,
  });

  return { ok: true } as const;
}

export async function verifyEmail(token: string) {
  const record = await prisma.verificationToken.findUnique({ where: { token } });
  if (!record || record.expiresAt < new Date()) throw new Error("Invalid or expired token");
  if (!record.userId) throw new Error("Invalid token");

  await prisma.user.update({ where: { id: record.userId }, data: { emailVerified: new Date() } });
  await prisma.verificationToken.delete({ where: { token } });
  return { ok: true } as const;
}

export async function requestPasswordReset(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { ok: true } as const; // do not leak existence
  const token = await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      token: crypto.randomUUID(),
      expiresAt: new Date(Date.now() + 1000 * 60 * 30), // 30m
    },
  });
  const link = `${APP_URL}/reset-password?token=${encodeURIComponent(token.token)}`;
  await sendEmail({
    to: email,
    subject: "Reset your CROCKNESTCLUB password",
    html: `<p>Reset your password by clicking the link below (valid for 30 minutes):</p><p><a href="${link}">Reset Password</a></p>`,
  });
  return { ok: true } as const;
}

export async function resetPassword({ token, password }: { token: string; password: string }) {
  const record = await prisma.passwordResetToken.findUnique({ where: { token } });
  if (!record || record.expiresAt < new Date() || !record.userId) throw new Error("Invalid or expired token");
  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.update({ where: { id: record.userId }, data: { passwordHash } });
  await prisma.passwordResetToken.delete({ where: { token } });
  return { ok: true } as const;
}


