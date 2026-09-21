"use client";
import { RequireOwner } from "@/components/auth/RequireOwner";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }) {
  return (
    <div data-admin-theme className="min-h-screen bg-background text-foreground">
      <RequireOwner>
        <div className="flex flex-col lg:flex-row">
          <AdminSidebar />
          <main className="flex-1 p-6 lg:p-10">{children}</main>
        </div>
      </RequireOwner>
    </div>
  );
}
