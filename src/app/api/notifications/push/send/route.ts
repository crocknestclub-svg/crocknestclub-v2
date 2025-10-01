import { NextRequest, NextResponse } from 'next/server';
import webPush from 'web-push';
import { assertAdmin } from '@/src/lib/adminAuth';
import { getSubscriptions } from '@/src/app/api/notifications/push/subscribe/route';

export async function POST(req: NextRequest) {
  try {
    await assertAdmin(req);
    const { title, message } = await req.json();
    const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
    const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;
    const VAPID_SUBJECT = process.env.VAPID_SUBJECT || 'mailto:admin@example.com';
    if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
      return NextResponse.json({ ok: false, error: 'VAPID keys not configured' }, { status: 500 });
    }
    webPush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
    const subs = await getSubscriptions();
    await Promise.all(
      (subs as Array<{ endpoint: string; keys: { p256dh: string; auth: string } }>)
        .map((sub) =>
          webPush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: {
                p256dh: sub.keys?.p256dh,
                auth: sub.keys?.auth,
              },
            },
            JSON.stringify({ title, message })
          )
        )
    );
    return NextResponse.json({ ok: true, sent: subs.length });
  } catch (e) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 500 });
  }
}


