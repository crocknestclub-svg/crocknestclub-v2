"use client";
import { useSession } from "next-auth/react";
import { useState } from "react";

const tabs = [
  { key: "overview", label: "Dashboard Overview" },
  { key: "orders", label: "Order Processing" },
  { key: "products", label: "Product Management" },
  { key: "inventory", label: "Inventory Tracking" },
  { key: "analytics", label: "Analytics & Metrics" },
  { key: "revenue", label: "Revenue & Conversion" },
  { key: "settings", label: "Admin Settings" },
];

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [tab, setTab] = useState("overview");

  if (status === "loading") return <div>Loading...</div>;
  if (!session || session.user?.role !== "ADMIN") return <div>Access denied.</div>;

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-3xl font-bold mb-6">Admin Dashboard</h2>
      <div className="flex gap-2 mb-6 border-b">
        {tabs.map(t => (
          <button
            key={t.key}
            className={`px-4 py-2 text-sm font-medium rounded-t ${tab === t.key ? "bg-gray-100" : "hover:bg-gray-50"}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div>
        {tab === "overview" && <Overview />}
        {tab === "orders" && <OrderProcessing />}
        {tab === "products" && <ProductManagement />}
        {tab === "inventory" && <InventoryTracking />}
        {tab === "analytics" && <AnalyticsMetrics />}
        {tab === "revenue" && <RevenueConversion />}
        {tab === "settings" && <AdminSettings />}
      </div>
    </div>
  );
}

function Overview() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<{ ordersCount: number; recentRevenue: number; lowStock: unknown[] } | null>(null);
  const fetchMetrics = async () => {
    try {
      const res = await fetch('/api/admin/metrics');
      const data = await res.json();
      setMetrics(data.metrics);
    } finally {
      setLoading(false);
    }
  };
  useState(() => {
    fetchMetrics();
    const id = setInterval(fetchMetrics, 10000);
    return () => clearInterval(id);
  });
  if (loading) return <div>Loading metrics...</div>;
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 border rounded">
          <div className="text-sm text-gray-500">Orders</div>
          <div className="text-2xl font-bold">{metrics?.ordersCount ?? 0}</div>
        </div>
        <div className="p-4 border rounded">
          <div className="text-sm text-gray-500">Recent Revenue</div>
          <div className="text-2xl font-bold">₹{metrics?.recentRevenue ?? 0}</div>
        </div>
        <div className="p-4 border rounded">
          <div className="text-sm text-gray-500">Low Stock Alerts</div>
          <div className="text-2xl font-bold">{metrics?.lowStock?.length ?? 0}</div>
        </div>
      </div>
      {metrics?.lowStock?.length ? (
        <div>
          <h3 className="font-semibold mb-2">Low Stock Variants</h3>
          <ul className="list-disc pl-5">
            {metrics.lowStock.map((v) => {
              // Assume v is { id: string|number, name: string, inventory: number }
              const variant = v as { id: string | number; name: string; inventory: number };
              return (
                <li key={variant.id}>
                  {variant.name} — {variant.inventory}
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
function OrderProcessing() {
  const [orderId, setOrderId] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const act = async (action: 'pack'|'ship'|'deliver') => {
    const res = await fetch('/api/admin/orders/workflow', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ orderId, action }) });
    const data = await res.json();
    setResult(data.ok ? `${action} -> ${data.order.status}` : `Error: ${data.error}`);
  };
  const ship = async () => {
    const res = await fetch('/api/admin/shipping', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ orderId, provider: 'MockShip', trackingNumber: 'TRK123' }) });
    const data = await res.json();
    setResult(data.ok ? `Shipped with ${data.shipment.provider}` : `Error: ${data.error}`);
  };
  const approveReturn = async () => {
    const res = await fetch('/api/admin/returns/approve', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ orderId }) });
    const data = await res.json();
    setResult(data.ok ? `Return approved: ${data.order.status}` : `Error: ${data.error}`);
  };
  const sendComm = async () => {
    const res = await fetch('/api/admin/communications', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ to: 'test@example.com', subject: 'Order Update', text: `Update for order ${orderId}` }) });
    const data = await res.json();
    setResult(data.ok ? `Communication sent` : `Error: ${data.error}`);
  };
  return (
    <div>
      <div className="mb-2">Order ID:</div>
      <input className="border rounded px-2 py-1 w-full" value={orderId} onChange={e => setOrderId(e.target.value)} placeholder="orderId" />
      <div className="flex gap-2 mt-3">
        <button className="px-3 py-2 bg-gray-100 rounded" onClick={() => act('pack')}>Mark Packed</button>
        <button className="px-3 py-2 bg-gray-100 rounded" onClick={ship}>Create Shipment</button>
        <button className="px-3 py-2 bg-gray-100 rounded" onClick={() => act('deliver')}>Mark Delivered</button>
        <button className="px-3 py-2 bg-gray-100 rounded" onClick={approveReturn}>Approve Return</button>
        <button className="px-3 py-2 bg-gray-100 rounded" onClick={sendComm}>Send Communication</button>
      </div>
      {result && <div className="mt-2 text-sm text-gray-700">{result}</div>}
    </div>
  );
}
function ProductManagement() {
  const [ids, setIds] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const bulkPublish = async () => {
    try {
      const productIds = ids.split(',').map(s => s.trim()).filter(Boolean);
      const res = await fetch('/api/admin/products/bulk-publish', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productIds }) });
      const data = await res.json();
      if (data.ok) setResult(`Published ${data.count} products`);
      else setResult(`Error: ${data.error}`);
    } catch (e) {
      setResult(`Error: ${(e as Error).message}`);
    }
  };
  return (
    <div>
      <div className="mb-2">Bulk publish products (comma-separated IDs):</div>
      <input className="border rounded px-2 py-1 w-full" value={ids} onChange={e => setIds(e.target.value)} placeholder="prodId1, prodId2" />
      <button className="mt-2 px-3 py-2 bg-black text-white rounded" onClick={bulkPublish}>Publish</button>
      {result && <div className="mt-2 text-sm text-gray-700">{result}</div>}
    </div>
  );
}
function InventoryTracking() {
  // TODO: Inventory tracking, low stock notifications
  return <div>Inventory tracking features.</div>;
}
function AnalyticsMetrics() {
  const [logs, setLogs] = useState<unknown[]>([]);
  const loadLogs = async () => {
    const res = await fetch('/api/admin/logs');
    const data = await res.json();
    setLogs(data.logs || []);
  };
  useState(() => {
    loadLogs();
  });
  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Recent Audit Logs</h3>
        <button className="px-3 py-2 bg-gray-100 rounded" onClick={loadLogs}>Refresh</button>
      </div>
      <ul className="mt-3 space-y-2">
        {(logs as { id: string; createdAt: string; query: string }[]).map(l => (
          <li key={l.id} className="text-sm text-gray-700">
            {new Date(l.createdAt).toLocaleString()} — {l.query}
          </li>
        ))}
      </ul>
    </div>
  );
}

function RevenueConversion() {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [data, setData] = useState<unknown>(null);
  const load = async () => {
    const url = new URL('/api/admin/revenue', window.location.origin);
    if (start) url.searchParams.set('start', start);
    if (end) url.searchParams.set('end', end);
    const res = await fetch(url.toString());
    const json = await res.json();
    setData(json);
  };
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
        <input type="date" className="border rounded px-2 py-1" value={start} onChange={e => setStart(e.target.value)} />
        <input type="date" className="border rounded px-2 py-1" value={end} onChange={e => setEnd(e.target.value)} />
      </div>
      <button className="px-3 py-2 bg-black text-white rounded" onClick={load}>Load</button>
      {(() => {
        if (!data || typeof data !== 'object' || data === null) return null;
        // Type assertion to expected shape
        const { revenue, ordersCount, conversion } = data as {
          revenue?: number | string;
          ordersCount?: number;
          conversion?: number | null;
        };
        return (
          <div className="mt-4 space-y-2">
            <div>
              Revenue: ₹
              {typeof revenue === 'number' || typeof revenue === 'string'
                ? revenue
                : 'N/A'}
            </div>
            <div>
              Orders: 
              {typeof ordersCount === 'number'
                ? ordersCount
                : 'N/A'}
            </div>
            <div>
              Conversion: 
              {conversion === null || typeof conversion === 'undefined'
                ? 'N/A'
                : typeof conversion === 'number'
                  ? (conversion * 100).toFixed(2) + '%'
                  : 'N/A'}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
function AdminSettings() {
  return <div>Admin settings and RBAC features are enforced server-side.</div>;
}
