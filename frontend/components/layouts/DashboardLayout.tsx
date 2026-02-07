import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Bell, Home, Package, Users, FileText, Vote, MessageSquare, TrendingUp, Settings, LogOut, Plus, Target } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: "resident" | "vendor" | "society" | "admin";
  societyName?: string;
  userName?: string;
}

const navigationByRole = {
  resident: [
    { name: "Dashboard", href: "/resident/dashboard", icon: Home },
    { name: "Services", href: "/resident/services", icon: Package },
    { name: "Request Service", href: "/resident/request-service", icon: Plus },
    { name: "Amenities", href: "/resident/amenities", icon: Home },
    { name: "Votes", href: "/resident/votes", icon: Vote },
    { name: "Complaints", href: "/resident/complaints", icon: MessageSquare },
    { name: "Notices", href: "/resident/notices", icon: Bell },
  ],
  vendor: [
    { name: "Dashboard", href: "/vendor/dashboard", icon: Home },
    { name: "Orders", href: "/vendor/orders", icon: Package },
    { name: "Contracts", href: "/vendor/contracts", icon: FileText },
    { name: "Discover", href: "/vendor/discover", icon: TrendingUp },
    { name: "Earnings", href: "/vendor/earnings", icon: TrendingUp },
  ],
  society: [
    { name: "Dashboard", href: "/society/dashboard", icon: Home },
    { name: "Residents", href: "/society/residents", icon: Users },
    { name: "Vendors", href: "/society/vendors", icon: Package },
    { name: "Service Requests", href: "/society/service-requests", icon: Plus },
    { name: "Publish Requirement", href: "/society/publish-requirement", icon: Target },
    { name: "Ledger", href: "/society/ledger", icon: FileText },
    { name: "Reports", href: "/society/reports", icon: TrendingUp },
    { name: "Votes", href: "/society/votes", icon: Vote },
    { name: "Complaints", href: "/society/complaints", icon: MessageSquare },
    { name: "Notices", href: "/society/notices", icon: Bell },
  ],
  admin: [
    { name: "Dashboard", href: "/admin/dashboard", icon: Home },
    { name: "Societies", href: "/admin/societies", icon: Users },
    { name: "Vendors", href: "/admin/vendors", icon: Package },
    { name: "Analytics", href: "/admin/analytics", icon: TrendingUp },
  ],
};

const roleLabels = {
  resident: "Resident Portal",
  vendor: "Vendor Portal",
  society: "Society Admin Portal",
  admin: "Platform Admin",
};

export default function DashboardLayout({ children, role, societyName, userName }: DashboardLayoutProps) {
  const navigation = navigationByRole[role];
  const roleLabel = roleLabels[role];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-xl font-bold text-blue-600 hover:text-blue-700">
              SRP
            </Link>
            <div className="hidden md:block">
              <span className="text-sm text-gray-500">{roleLabel}</span>
              {societyName && (
                <span className="text-sm text-gray-500 ml-2">• {societyName}</span>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            <div className="hidden md:flex items-center space-x-2">
              <div className="text-right">
                <p className="text-sm font-semibold">{userName || "User"}</p>
                <p className="text-xs text-gray-500">{roleLabel}</p>
              </div>
            </div>
            <Link href="/login">
              <Button variant="ghost" size="icon">
                <LogOut className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:block w-64 bg-white border-r min-h-[calc(100vh-73px)] sticky top-[73px]">
          <nav className="p-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Icon className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Mobile Bottom Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-40">
          <div className="flex justify-around py-2">
            {navigation.slice(0, 5).map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex flex-col items-center px-3 py-2 text-xs"
                >
                  <Icon className="h-5 w-5 text-gray-600 mb-1" />
                  <span className="text-gray-600">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-73px)] pb-20 md:pb-0">
          {children}
        </main>
      </div>
    </div>
  );
}
