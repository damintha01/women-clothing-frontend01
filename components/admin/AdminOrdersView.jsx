"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { LKR } from "@/lib/shop-data";
import { useAdminOrders } from "@/lib/admin/use-admin-orders";
import { OrderStatusControl } from "./OrderStatusControl";

const STATUS_FILTERS = ["", "pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "refunded"];

export function AdminOrdersView() {
  const searchParams = useSearchParams();
  const highlight = searchParams.get("highlight");
  const [status, setStatus] = useState("");
  const { orders, isLoading, mutatingId, updateStatus, refundOrder } = useAdminOrders(status || undefined);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Orders</h1>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border border-border bg-transparent px-3 py-2 text-sm outline-none"
        >
          {STATUS_FILTERS.map((s) => (
            <option key={s} value={s}>
              {s ? s : "All statuses"}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <p className="mt-8 text-muted-foreground">Loading…</p>
      ) : (
        <div className="mt-8 space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className={`border p-5 ${order.id === highlight ? "border-accent" : "border-border"} bg-card`}
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="font-medium">{order.orderNumber}</p>
                  <p className="text-xs text-muted-foreground">{order.email}</p>
                </div>
                <p className="text-sm">{LKR(order.total)}</p>
                <OrderStatusControl
                  order={order}
                  mutating={mutatingId === order.id}
                  onStatusChange={(next) => updateStatus(order.id, next)}
                  onRefund={() => refundOrder(order.id)}
                />
              </div>
            </div>
          ))}
          {orders.length === 0 && <p className="text-muted-foreground">No orders found.</p>}
        </div>
      )}
    </div>
  );
}
