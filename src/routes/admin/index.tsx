import { createFileRoute } from "@tanstack/react-router";
import AdminLogin from "@/pages/admin/Login";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "SA7TEC Admin" },
      { name: "description", content: "Private SA7TEC content administration area." },
      { name: "robots", content: "noindex,nofollow" },
      { property: "og:title", content: "SA7TEC Admin" },
      { property: "og:description", content: "Private SA7TEC content administration area." },
    ],
  }),
  component: AdminLogin,
});
