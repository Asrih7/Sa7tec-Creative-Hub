import { createFileRoute } from "@tanstack/react-router";
import Contact from "@/pages/Contact";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact SA7TEC | Start Your Product Project" },
      {
        name: "description",
        content:
          "Tell SA7TEC about your mobile app, game, AI or SaaS idea and get a tailored plan, timeline and quote.",
      },
      { property: "og:title", content: "Contact SA7TEC" },
      {
        property: "og:description",
        content: "Share your project brief with the SA7TEC product studio team.",
      },
    ],
  }),
  component: Contact,
});
