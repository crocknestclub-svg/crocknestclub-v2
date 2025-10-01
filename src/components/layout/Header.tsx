"use client";
import { Button } from "@/components/ui/button";
import { LucideShoppingCart, LucideSearch } from "lucide-react";
import React, { useEffect, useState } from 'react';

export default function Header() {
  const [notifs, setNotifs] = useState<unknown[]>([]);
  const [pushEnabled, setPushEnabled] = useState(false);
  useEffect(() => {
    const es = new EventSource('/api/notifications/stream');
    const onNotify = (e: MessageEvent) => {
      try { setNotifs(n => [JSON.parse(e.data), ...n].slice(0, 5)); } catch {}
    };
    es.addEventListener('notify', onNotify as EventListener);
    return () => es.close();
  }, []);

  const subscribePush = async () => {
    try {
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;
      const reg = await navigator.serviceWorker.ready;
      const res = await fetch('/api/notifications/push/key');
      const { key } = await res.json();
      if (!key) return;
      const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToUint8Array(key) });
      await fetch('/api/notifications/push/subscribe', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(sub) });
      setPushEnabled(true);
    } catch {}
  };

  function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
  return (
    <header className="w-full px-4 py-2 flex items-center justify-between bg-white shadow-sm sticky top-0 z-50">
      <div className="font-bold text-xl tracking-tight">CROCKNESTCLUB</div>
      <div className="flex gap-2 items-center">
        <Button variant="ghost" size="icon"><LucideSearch /></Button>
        <Button variant="ghost" size="icon"><LucideShoppingCart /></Button>
        <div className="relative">
          <Button variant="outline" className="ml-2">Notifications ({notifs.length})</Button>
          {notifs.length > 0 && (
            <div className="absolute right-0 mt-2 w-64 bg-white border rounded shadow-lg p-2">
              {notifs.map((n, i) => {
                // Safely assert n is an object with optional title/message
                const notif = n as { title?: string; message?: string };
                return (
                  <div key={i} className="text-xs border-b py-1 last:border-none">
                    {(notif.title ?? 'Update')}: {notif.message ?? JSON.stringify(n)}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <Button onClick={subscribePush} variant="outline" className="ml-2">{pushEnabled ? 'Push Enabled' : 'Enable Push'}</Button>
        <Button variant="outline" className="ml-2">Sign In</Button>
      </div>
    </header>
  );
}
