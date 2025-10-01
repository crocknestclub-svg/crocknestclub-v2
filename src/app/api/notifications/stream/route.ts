
const streams = new Set<ReadableStreamDefaultController>();

export async function GET() {
  const stream = new ReadableStream({
    start(controller) {
      streams.add(controller);
      controller.enqueue(new TextEncoder().encode(`event: ping\ndata: connected\n\n`));
    },
    cancel(controller) {
      streams.delete(controller);
    }
  });
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    }
  });
}

export function broadcast(data: unknown) {
  const payload = `event: notify\ndata: ${JSON.stringify(data)}\n\n`;
  const bytes = new TextEncoder().encode(payload);
  streams.forEach(c => {
    try { c.enqueue(bytes); } catch {}
  });
}


