import { createFileRoute } from "@tanstack/react-router";
import AdminDashboard from "@/pages/admin/Dashboard";
import { RequireAuth } from "@/lib/admin-auth";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({
    meta: [
      { title: "SA7TEC Admin Dashboard" },
      { name: "description", content: "Edit SA7TEC site content, media and submissions." },
      { name: "robots", content: "noindex,nofollow" },
      { property: "og:title", content: "SA7TEC Admin Dashboard" },
      { property: "og:description", content: "Edit SA7TEC site content, media and submissions." },
    ],
  }),
  component: () => (
    <RequireAuth>
      <AdminDashboard />
    </RequireAuth>
  ),
});
