import { cn } from "@/lib/utils";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/api";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Route,
  Fan,
  Lightbulb,
  Zap,
  AlertTriangle,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

/**
 * Role labels for display
 */
const ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.Admin]: "Admin",
  [UserRole.Operator]: "Operator",
};

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Tunnels", href: "/tunnels", icon: Route },
  // { label: "Fans", href: "/equipment/fans", icon: Fan },
  // { label: "Lights", href: "/equipment/lights", icon: Lightbulb },
  // { label: "Electricity", href: "/electricity", icon: Zap },
  { label: "Fault Tickets", href: "/tickets", icon: AlertTriangle },
  // { label: "Settings", href: "/settings", icon: Settings, adminOnly: true },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const filteredNavItems = navItems.filter(
    (item) => !item.adminOnly || isAdmin
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="p-1.5 bg-primary/20 rounded-lg">
                <Route className="h-6 w-6 text-primary" />
              </div>
              <div>
                <span className="font-semibold text-sidebar-foreground">
                  TunnelOS
                </span>
                <span className="text-xs text-sidebar-foreground/60 block">
                  Control System
                </span>
              </div>
            </Link>
            <button
              className="lg:hidden p-2 hover:bg-sidebar-accent rounded-lg"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5 text-sidebar-foreground" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-industrial">
            {filteredNavItems.map((item) => {
              const isActive = location.pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-primary"
                      : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5",
                      isActive ? "text-sidebar-primary" : ""
                    )}
                  />
                  {item.label}
                  {isActive && (
                    <ChevronRight className="h-4 w-4 ml-auto opacity-50" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-sm font-medium text-primary">
                  {user?.email?.[0].toUpperCase() || "U"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  {user?.email}
                </p>
                <p className="text-xs text-sidebar-foreground/60">
                  {user?.roles?.map((r) => ROLE_LABELS[r]).join(", ") || "User"}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-30 flex items-center px-4 lg:px-6">
          <button
            className="lg:hidden p-2 -ml-2 hover:bg-muted rounded-lg mr-4"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Breadcrumb could go here */}
          <div className="flex-1" />

          {/* Status indicators */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-status-operational animate-pulse" />
              <span className="text-muted-foreground hidden sm:inline">
                System Online
              </span>
            </div>
            <div className="text-xs text-muted-foreground font-mono hidden md:block">
              {new Date().toLocaleTimeString()}
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 p-4 lg:p-6 overflow-auto scrollbar-industrial">
          {children}
        </div>
      </main>
    </div>
  );
}
