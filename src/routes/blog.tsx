import { createFileRoute } from "@tanstack/react-router";
import Blog from "@/pages/Blog";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Journal | SA7TEC" },
      { name: "description", content: "Notes, case studies and product thinking from SA7TEC." },
    ],
  }),
  component: Blog,
});
