import { Suspense } from "react";
import { AdminOrdersView } from "@/components/admin/AdminOrdersView";

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={<p className="text-muted-foreground">Loading…</p>}>
      <AdminOrdersView />
    </Suspense>
  );
}
