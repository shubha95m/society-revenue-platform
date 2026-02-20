"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  Package,
  Building2,
  FileText,
  Vote,
  MessageSquare,
} from "lucide-react";
import { societyApi, type SocietyDashboardData } from "@/lib/api/society";
import { useAuthStore } from "@/lib/store/auth";
import { UserRole } from "@/lib/types";

export default function SocietyAdminDashboard() {
  const user = useAuthStore((state) => state.user);
  const [dashboardData, setDashboardData] = useState<SocietyDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      setIsLoading(true);
      setError(null);

      const response = await societyApi.getDashboard();

      if (response.success && response.data) {
        setDashboardData(response.data);
      } else {
        setError(response.error?.message || "Failed to load dashboard");
      }

      setIsLoading(false);
    };

    fetchDashboard();
  }, []);

  if (isLoading) {
    return (
      <ProtectedRoute allowedRoles={[UserRole.SOCIETY_ADMIN]}>
        <DashboardLayout role="society" societyName="Loading..." userName={user?.name || "Admin"}>
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading dashboard...</p>
              </div>
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute allowedRoles={[UserRole.SOCIETY_ADMIN]}>
        <DashboardLayout role="society" societyName="Error" userName={user?.name || "Admin"}>
          <div className="container mx-auto px-4 py-8">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  // Calculate derived values from API data
  const totalRevenue = dashboardData?.stats.totalRevenue || 0;
  const revenuePerFlat = dashboardData?.society.totalUnits
    ? (totalRevenue / dashboardData.society.totalUnits).toFixed(0)
    : 0;

  return (
    <ProtectedRoute allowedRoles={[UserRole.SOCIETY_ADMIN]}>
      <DashboardLayout
        role="society"
        societyName={dashboardData?.society.name || "Society"}
        userName={user?.name || "Admin"}
      >
        <div className="container mx-auto px-4 py-8">
          {/* Money First - Main Banner */}
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200 mb-8">
            <CardContent className="py-8">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Total Revenue Generated</p>
                <h2 className="text-5xl font-bold text-green-600 mb-2">
                  ₹{totalRevenue.toLocaleString()}
                </h2>
                <p className="text-lg text-gray-700 font-semibold mb-4">
                  From Completed Orders
                </p>
                <p className="text-sm text-gray-600">
                  ₹{revenuePerFlat} per flat • {dashboardData?.stats.totalOrders || 0} total orders
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Key Stats Grid */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-blue-700">
                  <Users className="h-5 w-5 mr-2" />
                  Residents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {dashboardData?.stats.totalResidents || 0}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Total residents in society
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-purple-700">
                  <Package className="h-5 w-5 mr-2" />
                  Active Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">
                  {dashboardData?.stats.activeServices || 0}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Services available to residents
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-green-700">
                  <FileText className="h-5 w-5 mr-2" />
                  Total Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {dashboardData?.stats.totalOrders || 0}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  All-time orders
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-orange-700">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Total Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">
                  ₹{totalRevenue.toLocaleString()}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  From completed orders
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Society Information */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="h-5 w-5 mr-2" />
                Society Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Society Name</p>
                  <p className="font-semibold">{dashboardData?.society.name || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="font-semibold">{dashboardData?.society.address || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Units</p>
                  <p className="font-semibold">{dashboardData?.society.totalUnits || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Revenue per Unit</p>
                  <p className="font-semibold text-green-600">₹{revenuePerFlat}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Getting Started - Show only when no data */}
          {dashboardData?.stats.totalResidents === 0 && (
            <Card className="mb-8 border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-900">
                  <Building2 className="h-5 w-5 mr-2" />
                  Welcome! Let's Get Started
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-lg border border-blue-200">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white font-bold">
                          1
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="font-semibold text-gray-900">Update Society Details</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Add complete information about your society, including address, total flats, and amenities.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-white rounded-lg border border-blue-200">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white font-bold">
                          2
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="font-semibold text-gray-900">Invite Residents</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Start inviting residents to join the platform and access services.
                        </p>
                        <Link href="/society/residents">
                          <Button size="sm" className="mt-2">Manage Residents</Button>
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-white rounded-lg border border-blue-200">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white font-bold">
                          3
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="font-semibold text-gray-900">Partner with Vendors</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Add vendor services to generate revenue from resident bookings.
                        </p>
                        <Link href="/society/vendors">
                          <Button size="sm" className="mt-2">Manage Vendors</Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Links */}
          <div className="grid md:grid-cols-4 gap-4">
            <Link href="/society/residents">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="py-6 text-center">
                  <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <p className="font-semibold">Manage Residents</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/society/vendors">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="py-6 text-center">
                  <Package className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <p className="font-semibold">Manage Vendors</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/society/ledger">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="py-6 text-center">
                  <FileText className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <p className="font-semibold">Financial Ledger</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/society/reports">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="py-6 text-center">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                  <p className="font-semibold">Reports & Analytics</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}