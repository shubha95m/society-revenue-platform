"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Package, Search, CheckCircle, XCircle, Star, Mail, Phone, Download } from "lucide-react";
import { toast } from "sonner";

const vendors = [
  {
    id: "VEN-001",
    name: "Fresh Farms Dairy",
    category: "Daily Essentials",
    service: "Milk Delivery",
    email: "contact@freshfarms.com",
    phone: "+91 98765 11111",
    status: "ACTIVE",
    commission: 10,
    joinedDate: "2023-05-10",
    orders: 156,
    revenue: 234000,
    rating: 4.8,
    reviews: 89,
  },
  {
    id: "VEN-002",
    name: "QuickFix Solutions",
    category: "Home Maintenance",
    service: "Plumbing Services",
    email: "hello@quickfix.com",
    phone: "+91 98765 22222",
    status: "ACTIVE",
    commission: 15,
    joinedDate: "2023-08-20",
    orders: 45,
    revenue: 180000,
    rating: 4.7,
    reviews: 45,
  },
  {
    id: "VEN-003",
    name: "Daily Essentials Co.",
    category: "Daily Essentials",
    service: "Grocery Delivery",
    email: "support@dailyessentials.com",
    phone: "+91 98765 33333",
    status: "ACTIVE",
    commission: 8,
    joinedDate: "2024-01-15",
    orders: 78,
    revenue: 126000,
    rating: 4.6,
    reviews: 62,
  },
  {
    id: "VEN-004",
    name: "Elite Cleaners",
    category: "Home Services",
    service: "Cleaning Services",
    email: "info@elitecleaners.com",
    phone: "+91 98765 44444",
    status: "PENDING",
    commission: 12,
    joinedDate: "2026-02-01",
    orders: 0,
    revenue: 0,
    rating: 0,
    reviews: 0,
  },
  {
    id: "VEN-005",
    name: "Tech Repair Hub",
    category: "Electronics",
    service: "Electronics Repair",
    email: "hello@techrepairhub.com",
    phone: "+91 98765 55555",
    status: "PENDING",
    commission: 20,
    joinedDate: "2026-02-03",
    orders: 0,
    revenue: 0,
    rating: 0,
    reviews: 0,
  },
];

export default function SocietyVendorsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"ALL" | "ACTIVE" | "PENDING">("ALL");
  const [selectedVendor, setSelectedVendor] = useState<typeof vendors[0] | null>(null);

  const handleApprove = (vendor: typeof vendors[0]) => {
    toast.success("Vendor Approved", {
      description: `${vendor.name} has been approved as a society partner.`,
    });
    setSelectedVendor(null);
  };

  const handleReject = (vendor: typeof vendors[0]) => {
    toast.error("Vendor Rejected", {
      description: `${vendor.name}'s partnership request has been rejected.`,
    });
    setSelectedVendor(null);
  };

  const filteredVendors = vendors.filter((vendor) => {
    const matchesStatus = filterStatus === "ALL" || vendor.status === filterStatus;
    const matchesSearch =
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.service.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    const badges = {
      ACTIVE: <Badge className="bg-green-100 text-green-700">Active</Badge>,
      PENDING: <Badge className="bg-yellow-100 text-yellow-700">Pending Approval</Badge>,
      INACTIVE: <Badge className="bg-gray-100 text-gray-700">Inactive</Badge>,
    };
    return badges[status as keyof typeof badges];
  };

  const activeCount = vendors.filter((v) => v.status === "ACTIVE").length;
  const pendingCount = vendors.filter((v) => v.status === "PENDING").length;
  const totalRevenue = vendors.reduce((sum, v) => sum + v.revenue, 0);
  const totalOrders = vendors.reduce((sum, v) => sum + v.orders, 0);

  return (
    <DashboardLayout role="society" societyName="Green Valley" userName="Admin">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Manage Vendors</h1>
            <p className="text-gray-600">View and manage all vendor partnerships</p>
          </div>
          <Button className="flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="py-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Total Vendors</p>
                <p className="text-3xl font-bold">{vendors.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Active Vendors</p>
                <p className="text-3xl font-bold text-green-600">{activeCount}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                <p className="text-3xl font-bold text-blue-600">₹{(totalRevenue / 1000).toFixed(0)}k</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                <p className="text-3xl font-bold">{totalOrders}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="py-4">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant={filterStatus === "ALL" ? "default" : "outline"}
                  onClick={() => setFilterStatus("ALL")}
                >
                  All
                </Button>
                <Button
                  size="sm"
                  variant={filterStatus === "ACTIVE" ? "default" : "outline"}
                  onClick={() => setFilterStatus("ACTIVE")}
                >
                  Active
                </Button>
                <Button
                  size="sm"
                  variant={filterStatus === "PENDING" ? "default" : "outline"}
                  onClick={() => setFilterStatus("PENDING")}
                >
                  Pending ({pendingCount})
                </Button>
              </div>

              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search vendors..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vendors List */}
        <div className="space-y-4">
          {filteredVendors.map((vendor) => (
            <Card key={vendor.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="py-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-lg font-semibold">{vendor.name}</h3>
                      {getStatusBadge(vendor.status)}
                      <Badge variant="outline">{vendor.category}</Badge>
                    </div>

                    <p className="text-sm text-gray-700 mb-3">{vendor.service}</p>

                    <div className="grid md:grid-cols-4 gap-4 text-sm mb-3">
                      <div>
                        <p className="text-gray-600">Commission</p>
                        <p className="font-semibold text-purple-600">{vendor.commission}%</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Total Orders</p>
                        <p className="font-semibold">{vendor.orders}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Revenue Generated</p>
                        <p className="font-semibold text-green-600">₹{(vendor.revenue / 1000).toFixed(0)}k</p>
                      </div>
                      {vendor.rating > 0 && (
                        <div>
                          <p className="text-gray-600">Rating</p>
                          <p className="font-semibold flex items-center">
                            {vendor.rating}
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 ml-1" />
                            <span className="text-gray-500 ml-1">({vendor.reviews})</span>
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-4 text-xs text-gray-600">
                      <span className="flex items-center">
                        <Mail className="h-3 w-3 mr-1" />
                        {vendor.email}
                      </span>
                      <span className="flex items-center">
                        <Phone className="h-3 w-3 mr-1" />
                        {vendor.phone}
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-2 ml-4">
                    <Button size="sm" variant="outline" onClick={() => setSelectedVendor(vendor)}>
                      View Details
                    </Button>
                    {vendor.status === "PENDING" && (
                      <>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleApprove(vendor)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleReject(vendor)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Vendor Detail Modal */}
        <Dialog open={!!selectedVendor} onOpenChange={() => setSelectedVendor(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedVendor?.name}</DialogTitle>
              <DialogDescription>
                Vendor ID: {selectedVendor?.id} • {selectedVendor && getStatusBadge(selectedVendor.status)}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Service Category</p>
                  <p className="font-semibold">{selectedVendor?.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Service Type</p>
                  <p className="font-semibold">{selectedVendor?.service}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold text-sm">{selectedVendor?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-semibold">{selectedVendor?.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Commission Rate</p>
                  <p className="font-semibold text-purple-600">{selectedVendor?.commission}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Joined Date</p>
                  <p className="font-semibold">{selectedVendor?.joinedDate}</p>
                </div>
              </div>

              {selectedVendor?.status === "ACTIVE" && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">Performance Metrics</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Total Orders</p>
                      <p className="text-2xl font-bold">{selectedVendor.orders}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Revenue</p>
                      <p className="text-2xl font-bold text-green-600">₹{(selectedVendor.revenue / 1000).toFixed(0)}k</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Rating</p>
                      <p className="text-2xl font-bold flex items-center">
                        {selectedVendor.rating}
                        <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 ml-1" />
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {selectedVendor?.status === "PENDING" && (
                <div className="flex space-x-3">
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => selectedVendor && handleApprove(selectedVendor)}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve Partnership
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => selectedVendor && handleReject(selectedVendor)}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject Request
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
