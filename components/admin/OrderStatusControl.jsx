"use client";

const STATUSES = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "refunded"];

export function OrderStatusControl({ order, onStatusChange, onRefund, mutating }) {
  return (
    <div className="flex items-center gap-3">
      <select
        value={order.status}
        onChange={(e) => onStatusChange(e.target.value)}
        disabled={mutating}
        className="border border-border bg-transparent px-2 py-1.5 text-xs uppercase tracking-widest outline-none"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      {order.paymentStatus === "paid" && (
        <button onClick={onRefund} disabled={mutating} className="text-xs text-destructive">
          Refund
        </button>
      )}
    </div>
  );
}
