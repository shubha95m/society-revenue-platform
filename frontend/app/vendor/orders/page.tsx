"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Package, Search, CheckCircle, XCircle, Clock, MapPin, Phone, Home } from "lucide-react";
import { toast } from "sonner";

const orders = [
  {
    id: "ORD-2026-001",
    customer: "John Doe",
    flat: "A-304",
    society: "Green Valley",
    service: "Plumbing Repair",
    description: "Kitchen sink leaking issue. Needs immediate attention.",
    date: "2026-02-06",
    time: "10:00 AM - 12:00 PM",
    phone: "+91 98765 43210",
    status: "PENDING",
    amount: 500,
  },
  {
    id: "ORD-2026-002",
    customer: "Priya Sharma",
    flat: "A-205",
    society: "Green Valley",
    service: "Bathroom Faucet Installation",
    description: "New faucet installation in master bathroom.",
    date: "2026-02-06",
    time: "2:00 PM - 4:00 PM",
    phone: "+91 98765 43211",
    status: "PENDING",
    amount: 400,
  },
  {
    id: "ORD-2026-003",
    customer: "Raj Malhotra",
    flat: "B-301",
    society: "Green Valley",
    service: "Pipe Replacement",
    description: "Replace corroded bathroom pipes.",
    date: "2026-02-05",
    time: "11:00 AM - 1:00 PM",
    phone: "+91 98765 43212",
    status: "IN_PROGRESS",
    amount: 800,
  },
  {
    id: "ORD-2026-004",
    customer: "Anita Kumar",
    flat: "C-102",
    society: "Sunrise Apartments",
    service: "Drain Cleaning",
    description: "Kitchen drain blocked, needs cleaning.",
    date: "2026-02-04",
    time: "9:00 AM - 11:00 AM",
    phone: "+91 98765 43213",
    status: "COMPLETED",
    amount: 300,
    rating: 5,
  },
  {
    id: "ORD-2026-005",
    customer: "Vikram Patel",
    flat: "C-404",
    society: "Green Valley",
    service: "Water Heater Repair",
    description: "Geyser not heating water properly.",
    date: "2026-02-03",
    time: "3:00 PM - 5:00 PM",
    phone: "+91 98765 43214",
    status: "COMPLETED",
    amount: 600,
    rating: 4,
  },
];

export default function VendorOrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"ALL" | "PENDING" | "IN_PROGRESS" | "COMPLETED">("ALL");
  const [selectedOrder, setSelectedOrder] = useState<typeof orders[0] | null>(null);

  const handleAccept = (order: typeof orders[0]) => {
    toast.success("Order Accepted", {
      description: `Order ${order.id} has been accepted. Customer will be notified.`,
    });
    setSelectedOrder(null);
  };

  const handleReject = (order: typeof orders[0]) => {
    toast.error("Order Rejected", {
      description: `Order ${order.id} has been rejected.`,
    });
    setSelectedOrder(null);
  };

  const handleComplete = (order: typeof orders[0]) => {
    toast.success("Order Completed", {
      description: `Order ${order.id} marked as completed. Payment will be processed.`,
    });
    setSelectedOrder(null);
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = filterStatus === "ALL" || order.status === filterStatus;
    const matchesSearch =
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.flat.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.service.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    const badges = {
      PENDING: <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>,
      IN_PROGRESS: <Badge className="bg-blue-100 text-blue-700">In Progress</Badge>,
      COMPLETED: <Badge className="bg-green-100 text-green-700">Completed</Badge>,
      REJECTED: <Badge className="bg-red-100 text-red-700">Rejected</Badge>,
    };
    return badges[status as keyof typeof badges];
  };

  const pendingCount = orders.filter((o) => o.status === "PENDING").length;
  const inProgressCount = orders.filter((o) => o.status === "IN_PROGRESS").length;
  const completedCount = orders.filter((o) => o.status === "COMPLETED").length;
  const totalRevenue = orders.filter((o) => o.status === "COMPLETED").reduce((sum, o) => sum + o.amount, 0);

  return (
    <DashboardLayout role="vendor" societyName="QuickFix Solutions" userName="Vendor Admin">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">My Orders</h1>
          <p className="text-gray-600">Manage your service orders</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="py-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">In Progress</p>
                <p className="text-3xl font-bold text-blue-600">{inProgressCount}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Completed</p>
                <p className="text-3xl font-bold text-green-600">{completedCount}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Revenue</p>
                <p className="text-3xl font-bold">₹{(totalRevenue / 1000).toFixed(1)}k</p>
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
                  variant={filterStatus === "PENDING" ? "default" : "outline"}
                  onClick={() => setFilterStatus("PENDING")}
                >
                  Pending ({pendingCount})
                </Button>
                <Button
                  size="sm"
                  variant={filterStatus === "IN_PROGRESS" ? "default" : "outline"}
                  onClick={() => setFilterStatus("IN_PROGRESS")}
                >
                  In Progress
                </Button>
                <Button
                  size="sm"
                  variant={filterStatus === "COMPLETED" ? "default" : "outline"}
                  onClick={() => setFilterStatus("COMPLETED")}
                >
                  Completed
                </Button>
              </div>

              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search orders..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="py-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-lg font-semibold">{order.service}</h3>
                      {getStatusBadge(order.status)}
                    </div>

                    <p className="text-sm text-gray-700 mb-3">{order.description}</p>

                    <div className="grid md:grid-cols-4 gap-4 text-sm mb-3">
                      <div className="flex items-center text-gray-700">
                        <Home className="h-4 w-4 mr-2 text-blue-600" />
                        <div>
                          <p className="font-semibold">{order.customer}</p>
                          <p className="text-xs">{order.flat}, {order.society}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Clock className="h-4 w-4 mr-2 text-blue-600" />
                        <div>
                          <p className="font-semibold">{order.date}</p>
                          <p className="text-xs">{order.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Phone className="h-4 w-4 mr-2 text-blue-600" />
                        <p>{order.phone}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Amount</p>
                        <p className="text-xl font-bold text-green-600">₹{order.amount}</p>
                      </div>
                    </div>

                    <div className="text-xs text-gray-600">
                      Order ID: {order.id}
                    </div>
                  </div>

                  <div className="flex space-x-2 ml-4">
                    <Button size="sm" variant="outline" onClick={() => setSelectedOrder(order)}>
                      View Details
                    </Button>
                    {order.status === "PENDING" && (
                      <>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleAccept(order)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleReject(order)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
                    {order.status === "IN_PROGRESS" && (
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => handleComplete(order)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Mark Complete
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Detail Modal */}
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedOrder?.service}</DialogTitle>
              <DialogDescription>
                Order ID: {selectedOrder?.id} • {selectedOrder && getStatusBadge(selectedOrder.status)}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Service Description</h4>
                <p className="text-sm text-gray-700">{selectedOrder?.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Customer Name</p>
                  <p className="font-semibold">{selectedOrder?.customer}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-semibold">{selectedOrder?.flat}, {selectedOrder?.society}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-semibold">{selectedOrder?.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Amount</p>
                  <p className="text-xl font-semibold text-green-600">₹{selectedOrder?.amount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-semibold">{selectedOrder?.date}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Time Slot</p>
                  <p className="font-semibold">{selectedOrder?.time}</p>
                </div>
              </div>

              {selectedOrder?.status === "COMPLETED" && selectedOrder.rating && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="font-semibold mb-1">Customer Rating</p>
                  <p className="text-2xl font-bold text-green-600">{selectedOrder.rating} ⭐</p>
                </div>
              )}

              {selectedOrder?.status === "PENDING" && (
                <div className="flex space-x-3">
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => selectedOrder && handleAccept(selectedOrder)}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Accept Order
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => selectedOrder && handleReject(selectedOrder)}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject Order
                  </Button>
                </div>
              )}

              {selectedOrder?.status === "IN_PROGRESS" && (
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => selectedOrder && handleComplete(selectedOrder)}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark as Completed
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
