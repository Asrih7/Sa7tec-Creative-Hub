import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { ThemeProvider } from "@/lib/theme";
import { LanguageProvider } from "@/lib/i18n";
import { ContentProvider } from "@/lib/content-store";
import { AuthProvider } from "@/lib/admin-auth";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "SA7TEC | Digital Product Studio" },
      {
        name: "description",
        content:
          "SA7TEC builds premium mobile apps, games, AI products, SaaS platforms and custom software.",
      },
      { name: "author", content: "SA7TEC" },
      { name: "robots", content: "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" },
      { name: "theme-color", content: "#030507" },
      { property: "og:site_name", content: "SA7TEC" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "SA7TEC | Digital Product Studio" },
      {
        property: "og:description",
        content: "SA7TEC builds mobile apps, games, AI products, SaaS platforms and custom software.",
      },
      { property: "og:url", content: "https://sa7tec.com/" },
      { property: "og:image", content: "https://sa7tec.com/opengraph.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "SA7TEC | Digital Product Studio" },
      {
        name: "twitter:description",
        content: "SA7TEC builds mobile apps, games, AI products, SaaS platforms and custom software.",
      },
      { name: "twitter:image", content: "https://sa7tec.com/opengraph.jpg" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "canonical", href: "https://sa7tec.com/" },
      { rel: "manifest", href: "/site.webmanifest" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800;900&family=Noto+Sans+Arabic:wght@400;500;600;700;800&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

/** The site stores all content in browser storage, so render after hydration. */
function ClientOnly({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[var(--s7-bg)] text-[var(--s7-fg)]">
        <p className="text-sm uppercase tracking-[0.25em]">Loading experience…</p>
      </div>
    );
  }
  return <>{children}</>;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <ClientOnly>
        <ThemeProvider>
          <LanguageProvider>
            <ContentProvider>
              <AuthProvider>
                <TooltipProvider>
                  {/* Required: nested routes render here. */}
                  <Outlet />
                  <Toaster />
                </TooltipProvider>
              </AuthProvider>
            </ContentProvider>
          </LanguageProvider>
        </ThemeProvider>
      </ClientOnly>
    </QueryClientProvider>
  );
}
