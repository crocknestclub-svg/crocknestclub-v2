import fs from 'fs';
import path from 'path';

const LOG_DIR = path.resolve(process.cwd(), './logs');
const LOG_FILE = path.join(LOG_DIR, 'payments.log');

function ensureLogFile() {
  if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });
  if (!fs.existsSync(LOG_FILE)) fs.writeFileSync(LOG_FILE, '');
}

export function logPaymentEvent(event: {
  type: string;
  orderId?: string;
  paymentRequestId?: string;
  paymentId?: string;
  status?: string;
  amount?: number;
  metadata?: Record<string, unknown>;
}) {
  try {
    ensureLogFile();
    const line = JSON.stringify({
      ts: new Date().toISOString(),
      ...event,
    });
    fs.appendFileSync(LOG_FILE, line + '\n', { encoding: 'utf-8' });
  } catch {
    // no-op
  }
}


