import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(_req: NextRequest, { params }: { params: { orderId: string } }) {
  const { orderId } = params;
  const filePath = path.resolve(process.cwd(), `./invoices/invoice_${orderId}.pdf`);
  if (!fs.existsSync(filePath)) {
    return new NextResponse('Not Found', { status: 404 });
  }
  const file = fs.readFileSync(filePath);
  return new NextResponse(file, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="invoice_${orderId}.pdf"`,
    },
  });
}


