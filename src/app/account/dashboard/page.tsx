"use client";
import { useState } from "react";
import { Tabs, Tab } from "../../../components/ui/tabs";
import OrderHistory from "./OrderHistory";
import ProfileManagement from "./ProfileManagement";
import AddressBook from "./AddressBook";
import Wishlist from "./Wishlist";
import NotificationPreferences from "./NotificationPreferences";

export default function DashboardPage() {
  const [tab, setTab] = useState("orders");
  return (
    <div className="max-w-2xl mx-auto mt-10 p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">User Dashboard</h2>
      <Tabs value={tab} onValueChange={setTab} className="mb-6">
        <Tab value="orders" label="Order History" />
        <Tab value="profile" label="Profile" />
        <Tab value="address" label="Address Book" />
        <Tab value="wishlist" label="Wishlist" />
        <Tab value="notifications" label="Notifications" />
      </Tabs>
      {tab === "orders" && <OrderHistory />}
      {tab === "profile" && <ProfileManagement />}
      {tab === "address" && <AddressBook />}
      {tab === "wishlist" && <Wishlist />}
      {tab === "notifications" && <NotificationPreferences />}
    </div>
  );
}
