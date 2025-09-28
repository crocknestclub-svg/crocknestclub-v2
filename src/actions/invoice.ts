import PDFDocument from 'pdfkit';
import fs from 'fs';

export async function generateInvoice({
  orderId,
  user,
  products,
  total,
  address,
}: {
  orderId: string;
  user: { name: string; email: string };
  products: Array<{ name: string; price: number; quantity: number }>;
  total: number;
  address: string;
}) {
  const doc = new PDFDocument();
  const filePath = `./invoices/invoice_${orderId}.pdf`;
  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(20).text('Invoice', { align: 'center' });
  doc.moveDown();
  doc.text(`Order ID: ${orderId}`);
  doc.text(`Customer: ${user.name} (${user.email})`);
  doc.text(`Address: ${address}`);
  doc.moveDown();
  doc.text('Products:');
  products.forEach(p => {
    doc.text(`${p.name} x${p.quantity} - ₹${p.price * p.quantity}`);
  });
  doc.moveDown();
  doc.text(`Total: ₹${total}`);
  doc.end();
  return filePath;
}
