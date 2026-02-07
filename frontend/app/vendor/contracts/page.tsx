"use client";

import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Star, Calendar, DollarSign, TrendingUp, Download } from "lucide-react";

const contracts = [
  {
    id: "CON-001",
    society: "Green Valley Apartments",
    location: "Andheri West, Mumbai",
    flats: 120,
    status: "ACTIVE",
    commission: 10,
    startDate: "2023-05-10",
    endDate: "2025-05-10",
    ordersThisMonth: 156,
    revenueThisMonth: 234000,
    rating: 4.8,
    reviews: 89,
  },
  {
    id: "CON-002",
    society: "Sunrise Apartments",
    location: "Bandra East, Mumbai",
    flats: 180,
    status: "ACTIVE",
    commission: 12,
    startDate: "2023-08-20",
    endDate: "2025-08-20",
    ordersThisMonth: 124,
    revenueThisMonth: 186000,
    rating: 4.6,
    reviews: 62,
  },
  {
    id: "CON-003",
    society: "Ocean View Residency",
    location: "Juhu, Mumbai",
    flats: 96,
    status: "ACTIVE",
    commission: 10,
    startDate: "2024-01-15",
    endDate: "2026-01-15",
    ordersThisMonth: 62,
    revenueThisMonth: 93000,
    rating: 4.7,
    reviews: 45,
  },
];

export default function VendorContractsPage() {
  const getStatusBadge = (status: string) => {
    const badges = {
      ACTIVE: <Badge className="bg-green-100 text-green-700">Active</Badge>,
      EXPIRING: <Badge className="bg-yellow-100 text-yellow-700">Expiring Soon</Badge>,
      EXPIRED: <Badge className="bg-red-100 text-red-700">Expired</Badge>,
    };
    return badges[status as keyof typeof badges];
  };

  const totalSocieties = contracts.length;
  const totalFlats = contracts.reduce((sum, c) => sum + c.flats, 0);
  const totalRevenue = contracts.reduce((sum, c) => sum + c.revenueThisMonth, 0);
  const avgRating = (contracts.reduce((sum, c) => sum + c.rating, 0) / contracts.length).toFixed(1);

  return (
    <DashboardLayout role="vendor" societyName="QuickFix Solutions" userName="Vendor Admin">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Contracts</h1>
            <p className="text-gray-600">Active society partnerships</p>
          </div>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Contracts
          </Button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="py-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Total Societies</p>
                <p className="text-3xl font-bold">{totalSocieties}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Total Reach</p>
                <p className="text-3xl font-bold text-purple-600">{totalFlats}</p>
                <p className="text-xs text-gray-500 mt-1">households</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Monthly Revenue</p>
                <p className="text-3xl font-bold text-green-600">₹{(totalRevenue / 1000).toFixed(0)}k</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Avg Rating</p>
                <p className="text-3xl font-bold">{avgRating}</p>
                <p className="text-xs text-gray-500 mt-1">across all societies</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contracts List */}
        <div className="space-y-4">
          {contracts.map((contract) => (
            <Card key={contract.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="py-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <Building2 className="h-6 w-6 text-purple-600" />
                      <h3 className="text-xl font-semibold">{contract.society}</h3>
                      {getStatusBadge(contract.status)}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{contract.location} • {contract.flats} flats</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-4 gap-6 mb-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Commission Rate</p>
                    <p className="text-2xl font-bold text-purple-600">{contract.commission}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Orders This Month</p>
                    <p className="text-2xl font-bold">{contract.ordersThisMonth}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Revenue This Month</p>
                    <p className="text-2xl font-bold text-green-600">₹{(contract.revenueThisMonth / 1000).toFixed(0)}k</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Your Rating</p>
                    <p className="text-2xl font-bold flex items-center">
                      {contract.rating}
                      <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 ml-1" />
                      <span className="text-sm text-gray-500 ml-2">({contract.reviews})</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Start: {contract.startDate}
                    </span>
                    <span>•</span>
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      End: {contract.endDate}
                    </span>
                    <span>•</span>
                    <span>Contract ID: {contract.id}</span>
                  </div>
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Performance Summary */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Performance Summary</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center text-green-700">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Total Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-green-600 mb-2">₹{(totalRevenue / 1000).toFixed(0)}k</p>
                <p className="text-sm text-gray-600">This month across all societies</p>
              </CardContent>
            </Card>

            <Card className="border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center text-purple-700">
                  <Building2 className="h-5 w-5 mr-2" />
                  Market Reach
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-purple-600 mb-2">{totalFlats}</p>
                <p className="text-sm text-gray-600">Households across {totalSocieties} societies</p>
              </CardContent>
            </Card>

            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-700">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Growth Potential
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-blue-600 mb-2">+15%</p>
                <p className="text-sm text-gray-600">Projected growth next quarter</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
