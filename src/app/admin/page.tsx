"use client";
import { useSession } from "next-auth/react";
import { useState } from "react";

const tabs = [
  { key: "overview", label: "Dashboard Overview" },
  { key: "orders", label: "Order Processing" },
  { key: "products", label: "Product Management" },
  { key: "inventory", label: "Inventory Tracking" },
  { key: "analytics", label: "Analytics & Metrics" },
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
        {tab === "settings" && <AdminSettings />}
      </div>
    </div>
  );
}

function Overview() {
  // TODO: Real-time metrics, revenue analytics, order volume, inventory alerts
  return <div>Dashboard overview with metrics and alerts.</div>;
}
function OrderProcessing() {
  // TODO: Workflow automation, shipping integration, return automation, communication templates
  return <div>Order processing features.</div>;
}
function ProductManagement() {
  // TODO: Bulk operations, advanced tracking, SEO tools, performance analytics
  return <div>Product management features.</div>;
}
function InventoryTracking() {
  // TODO: Inventory tracking, low stock notifications
  return <div>Inventory tracking features.</div>;
}
function AnalyticsMetrics() {
  // TODO: Real-time metrics, revenue analytics, conversion tracking
  return <div>Analytics and metrics features.</div>;
}
function AdminSettings() {
  // TODO: Multi-level roles, permission control, audit trails
  return <div>Admin settings and RBAC features.</div>;
}
