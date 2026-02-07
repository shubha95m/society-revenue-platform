"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Users, Search, CheckCircle, XCircle, Clock, Mail, Phone, Home, Download } from "lucide-react";
import { toast } from "sonner";

const residents = [
  {
    id: "RES-001",
    name: "John Doe",
    flat: "A-304",
    tower: "A",
    email: "john.doe@email.com",
    phone: "+91 98765 43210",
    status: "ACTIVE",
    joinedDate: "2024-06-15",
    maintenance: { current: 2500, status: "PAID", dueDate: "2026-02-05" },
    servicesUsed: 8,
  },
  {
    id: "RES-002",
    name: "Priya Sharma",
    flat: "A-205",
    tower: "A",
    email: "priya.s@email.com",
    phone: "+91 98765 43211",
    status: "ACTIVE",
    joinedDate: "2024-03-20",
    maintenance: { current: 2500, status: "PAID", dueDate: "2026-02-05" },
    servicesUsed: 12,
  },
  {
    id: "RES-003",
    name: "Raj Malhotra",
    flat: "B-301",
    tower: "B",
    email: "raj.m@email.com",
    phone: "+91 98765 43212",
    status: "ACTIVE",
    joinedDate: "2024-08-10",
    maintenance: { current: 2500, status: "OVERDUE", dueDate: "2026-01-05" },
    servicesUsed: 5,
  },
  {
    id: "RES-004",
    name: "Anita Kumar",
    flat: "A-102",
    tower: "A",
    email: "anita.k@email.com",
    phone: "+91 98765 43213",
    status: "PENDING",
    joinedDate: "2026-02-01",
    maintenance: { current: 2500, status: "PENDING", dueDate: "2026-02-05" },
    servicesUsed: 0,
  },
  {
    id: "RES-005",
    name: "Vikram Patel",
    flat: "C-404",
    tower: "C",
    email: "vikram.p@email.com",
    phone: "+91 98765 43214",
    status: "ACTIVE",
    joinedDate: "2023-11-05",
    maintenance: { current: 2500, status: "PAID", dueDate: "2026-02-05" },
    servicesUsed: 15,
  },
];

export default function SocietyResidentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"ALL" | "ACTIVE" | "PENDING">("ALL");
  const [selectedResident, setSelectedResident] = useState<typeof residents[0] | null>(null);

  const handleApprove = (resident: typeof residents[0]) => {
    toast.success("Resident Approved", {
      description: `${resident.name} has been approved and granted access.`,
    });
    setSelectedResident(null);
  };

  const handleReject = (resident: typeof residents[0]) => {
    toast.error("Resident Rejected", {
      description: `${resident.name}'s application has been rejected.`,
    });
    setSelectedResident(null);
  };

  const filteredResidents = residents.filter((res) => {
    const matchesStatus = filterStatus === "ALL" || res.status === filterStatus;
    const matchesSearch =
      res.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.flat.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.email.toLowerCase().includes(searchTerm.toLowerCase());
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

  const getMaintenanceBadge = (status: string) => {
    const badges = {
      PAID: <Badge className="bg-green-100 text-green-700">Paid</Badge>,
      OVERDUE: <Badge className="bg-red-100 text-red-700">Overdue</Badge>,
      PENDING: <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>,
    };
    return badges[status as keyof typeof badges];
  };

  const activeCount = residents.filter((r) => r.status === "ACTIVE").length;
  const pendingCount = residents.filter((r) => r.status === "PENDING").length;

  return (
    <DashboardLayout role="society" societyName="Green Valley" userName="Admin">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Manage Residents</h1>
            <p className="text-gray-600">View and manage all society residents</p>
          </div>
          <Button className="flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Export List
          </Button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="py-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Total Residents</p>
                <p className="text-3xl font-bold">{residents.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Active</p>
                <p className="text-3xl font-bold text-green-600">{activeCount}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Pending Approval</p>
                <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Occupancy</p>
                <p className="text-3xl font-bold">{Math.round((activeCount / 120) * 100)}%</p>
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
                  Pending
                </Button>
              </div>

              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by name, flat, or email..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Residents List */}
        <div className="space-y-4">
          {filteredResidents.map((resident) => (
            <Card key={resident.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="py-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-lg font-semibold">{resident.name}</h3>
                      {getStatusBadge(resident.status)}
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 text-sm mb-3">
                      <div className="flex items-center text-gray-700">
                        <Home className="h-4 w-4 mr-2 text-blue-600" />
                        <span>Flat {resident.flat} (Tower {resident.tower})</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Mail className="h-4 w-4 mr-2 text-blue-600" />
                        <span>{resident.email}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Phone className="h-4 w-4 mr-2 text-blue-600" />
                        <span>{resident.phone}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <span>Joined: {resident.joinedDate}</span>
                      <span>Services Used: {resident.servicesUsed}</span>
                      <div className="flex items-center space-x-2">
                        <span>Maintenance:</span>
                        {getMaintenanceBadge(resident.maintenance.status)}
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2 ml-4">
                    <Button size="sm" variant="outline" onClick={() => setSelectedResident(resident)}>
                      View Details
                    </Button>
                    {resident.status === "PENDING" && (
                      <>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleApprove(resident)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleReject(resident)}
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

        {/* Resident Detail Modal */}
        <Dialog open={!!selectedResident} onOpenChange={() => setSelectedResident(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedResident?.name}</DialogTitle>
              <DialogDescription>
                Resident ID: {selectedResident?.id} • {selectedResident && getStatusBadge(selectedResident.status)}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Flat Number</p>
                  <p className="font-semibold">{selectedResident?.flat}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tower</p>
                  <p className="font-semibold">{selectedResident?.tower}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold">{selectedResident?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-semibold">{selectedResident?.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Joined Date</p>
                  <p className="font-semibold">{selectedResident?.joinedDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Services Used</p>
                  <p className="font-semibold">{selectedResident?.servicesUsed}</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Maintenance Details</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Current Amount</p>
                    <p className="font-semibold">₹{selectedResident?.maintenance.current}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Status</p>
                    <div>{selectedResident && getMaintenanceBadge(selectedResident.maintenance.status)}</div>
                  </div>
                  <div>
                    <p className="text-gray-600">Due Date</p>
                    <p className="font-semibold">{selectedResident?.maintenance.dueDate}</p>
                  </div>
                </div>
              </div>

              {selectedResident?.status === "PENDING" && (
                <div className="flex space-x-3">
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => selectedResident && handleApprove(selectedResident)}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve Resident
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => selectedResident && handleReject(selectedResident)}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject Application
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
