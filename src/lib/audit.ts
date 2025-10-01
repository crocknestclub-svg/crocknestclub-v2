import { prisma } from '@/src/lib/prisma';

export async function logAudit(event: { actorId?: string; action: string; target?: string; metadata?: Record<string, unknown> }) {
  // If Audit model doesn't exist, reuse SearchEvent as a placeholder
  try {
    await prisma.searchEvent.create({
      data: {
        userId: event.actorId,
        query: `audit:${event.action}:${event.target || ''}`,
        resultsCount: 1,
      },
    });
  } catch {}
}


