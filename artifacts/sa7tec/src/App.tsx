import { Suspense, lazy } from "react";
import { HelmetProvider } from "react-helmet-async";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { ContentProvider } from "@/lib/content-store";
import { AuthProvider, RequireAuth } from "@/lib/admin-auth";
import { LanguageProvider } from "@/lib/i18n";
import { ThemeProvider } from "@/lib/theme";

const Home = lazy(() => import("@/pages/Home"));
const Contact = lazy(() => import("@/pages/Contact"));
const AdminLogin = lazy(() => import("@/pages/admin/Login"));
const AdminDashboard = lazy(() => import("@/pages/admin/Dashboard"));

const queryClient = new QueryClient();

function Router() {
  const adminEnabled = import.meta.env.VITE_ENABLE_ADMIN !== "false";

  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full flex items-center justify-center bg-[var(--s7-bg)] text-[var(--s7-fg)]">
          <p className="text-sm uppercase tracking-[0.25em]">Loading experience…</p>
        </div>
      }
    >
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/contact" component={Contact} />

        {adminEnabled && <Route path="/admin" component={AdminLogin} />}
        {adminEnabled && (
          <Route path="/admin/dashboard">
            <RequireAuth>
              <AdminDashboard />
            </RequireAuth>
          </Route>
        )}

        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
      <ThemeProvider>
        <LanguageProvider>
          <ContentProvider>
            <AuthProvider>
              <TooltipProvider>
                <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}> 
                  <Router />
                </WouterRouter>
                <Toaster />
              </TooltipProvider>
            </AuthProvider>
          </ContentProvider>
        </LanguageProvider>
      </ThemeProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;
