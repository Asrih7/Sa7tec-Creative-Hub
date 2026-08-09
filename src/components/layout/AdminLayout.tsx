import { ReactNode } from "react";
import { Link, useLocation } from "@/lib/nav";
import { LayoutDashboard, LogOut, Hexagon } from "lucide-react";
import { useAuth } from "@/lib/admin-auth";
import { useLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export function AdminLayout({ children }: { children: ReactNode }) {
  const [location, setLocation] = useLocation();
  const { logout } = useAuth();
  const { t } = useLanguage();

  const handleLogout = () => {
    logout();
    setLocation("/admin");
  };

  const navItems = [
    { name: t("admin.dashboard"), path: "/admin/dashboard", icon: LayoutDashboard },
    { name: t("admin.back_to_site"), path: "/", icon: Hexagon },
  ];

  return (
    <div className="min-h-screen flex bg-zinc-950 text-slate-100 selection:bg-primary/30">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-zinc-900 border-r border-zinc-800 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-zinc-800">
          <Link href="/admin/dashboard" className="flex items-center gap-2 text-white">
            <Hexagon className="w-5 h-5 text-primary" />
            <span className="font-display font-bold tracking-tight">{t("admin.title")}</span>
          </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-4">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="p-4 border-t border-zinc-800">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-zinc-400 hover:text-white hover:bg-zinc-800"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            {t("admin.log_out")}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 flex items-center justify-between px-8 border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-sm z-10 sticky top-0">
          <h1 className="font-display font-semibold text-lg">{t("admin.control_panel")}</h1>
          <div className="flex items-center gap-4">
            <LanguageSwitcher variant="admin" />
            <span className="text-sm text-zinc-500 hidden md:inline">{t("admin.logged_in_as")}</span>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
