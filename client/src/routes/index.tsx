import { createFileRoute } from "@tanstack/react-router";
import Home from "@/pages/Home";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SA7TEC | Mobile Apps, Games, AI & SaaS Product Studio" },
      {
        name: "description",
        content:
          "SA7TEC designs and builds mobile apps, games, AI products, SaaS platforms and custom software for ambitious teams worldwide.",
      },
      { property: "og:title", content: "SA7TEC | Digital Product Studio" },
      {
        property: "og:description",
        content:
          "Premium strategy, design and engineering for mobile apps, games, AI and SaaS products.",
      },
    ],
  }),
  component: Home,
});
