"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Package, ThumbsUp, CheckCircle, XCircle, Vote, Search } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

const serviceRequests = [
  {
    id: "REQ-001",
    service: "Grocery Delivery",
    description: "Daily grocery delivery service with fresh vegetables and fruits",
    category: "Daily Essentials",
    requestedBy: "John Doe (A-304)",
    requestedDate: "2026-02-05",
    status: "PENDING",
    upvotes: 45,
    estimatedBudget: "₹500-800/month",
    comments: 12,
  },
  {
    id: "REQ-002",
    service: "Car Wash Service",
    description: "Weekly car washing service at doorstep",
    category: "Home Services",
    requestedBy: "Priya S. (A-205)",
    requestedDate: "2026-02-01",
    status: "POLL_CREATED",
    upvotes: 32,
    estimatedBudget: "₹300/wash",
    pollId: "POLL-001",
    pollResult: "68% approval",
  },
  {
    id: "REQ-004",
    service: "Vegetable Delivery",
    description: "Fresh organic vegetables daily",
    category: "Daily Essentials",
    requestedBy: "Priya S. (A-205)",
    requestedDate: "2026-02-06",
    status: "PENDING",
    upvotes: 23,
    estimatedBudget: "₹400-600/month",
  },
  {
    id: "REQ-005",
    service: "Electrician On-Demand",
    description: "24/7 emergency electrical repairs",
    category: "Home Maintenance",
    requestedBy: "Raj M. (B-301)",
    requestedDate: "2026-02-04",
    status: "PENDING",
    upvotes: 38,
    estimatedBudget: "₹500/visit",
  },
  {
    id: "REQ-006",
    service: "Pet Grooming",
    description: "Monthly pet grooming service",
    category: "Pet Services",
    requestedBy: "Anita K. (A-102)",
    requestedDate: "2026-02-03",
    status: "REJECTED",
    upvotes: 15,
    estimatedBudget: "₹800/session",
    rejectionReason: "Low resident interest (12.5%)",
  },
  {
    id: "REQ-003",
    service: "Laundry Service",
    description: "Pick and drop laundry service",
    category: "Home Services",
    requestedBy: "Vikram P. (C-404)",
    requestedDate: "2026-01-28",
    status: "PUBLISHED",
    upvotes: 52,
    estimatedBudget: "₹200/kg",
    publishedDate: "2026-02-03",
  },
];

export default function ServiceRequestsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"ALL" | "PENDING" | "POLL_CREATED" | "PUBLISHED">("ALL");
  const [selectedRequest, setSelectedRequest] = useState<typeof serviceRequests[0] | null>(null);

  const handleCreatePoll = (request: typeof serviceRequests[0]) => {
    toast.success("Poll Created", {
      description: `Poll for "${request.service}" has been created. Residents can now vote.`,
    });
    setSelectedRequest(null);
  };

  const handleReject = (request: typeof serviceRequests[0]) => {
    toast.error("Request Rejected", {
      description: `Service request for "${request.service}" has been rejected.`,
    });
    setSelectedRequest(null);
  };

  const handlePublishRequirement = (request: typeof serviceRequests[0]) => {
    toast.success("Requirement Published", {
      description: `"${request.service}" requirement is now visible to all vendors.`,
    });
    setSelectedRequest(null);
  };

  const filteredRequests = serviceRequests.filter((req) => {
    const matchesStatus = filterStatus === "ALL" || req.status === filterStatus;
    const matchesSearch =
      req.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.requestedBy.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    const badges = {
      PENDING: <Badge className="bg-yellow-100 text-yellow-700">Pending Review</Badge>,
      POLL_CREATED: <Badge className="bg-blue-100 text-blue-700">Poll Active</Badge>,
      PUBLISHED: <Badge className="bg-green-100 text-green-700">Published to Vendors</Badge>,
      REJECTED: <Badge className="bg-red-100 text-red-700">Rejected</Badge>,
    };
    return badges[status as keyof typeof badges];
  };

  const pendingCount = serviceRequests.filter(r => r.status === "PENDING").length;
  const pollCount = serviceRequests.filter(r => r.status === "POLL_CREATED").length;
  const publishedCount = serviceRequests.filter(r => r.status === "PUBLISHED").length;

  return (
    <DashboardLayout role="society" societyName="Green Valley" userName="Admin">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Service Requests from Residents</h1>
          <p className="text-gray-600">Review and manage service requests from your community</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="py-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Pending Review</p>
                <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Active Polls</p>
                <p className="text-3xl font-bold text-blue-600">{pollCount}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Published</p>
                <p className="text-3xl font-bold text-green-600">{publishedCount}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Total Requests</p>
                <p className="text-3xl font-bold">{serviceRequests.length}</p>
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
                  variant={filterStatus === "POLL_CREATED" ? "default" : "outline"}
                  onClick={() => setFilterStatus("POLL_CREATED")}
                >
                  Polls Active
                </Button>
                <Button
                  size="sm"
                  variant={filterStatus === "PUBLISHED" ? "default" : "outline"}
                  onClick={() => setFilterStatus("PUBLISHED")}
                >
                  Published
                </Button>
              </div>

              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search service requests..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Requests List */}
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <Card key={request.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="py-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <Package className="h-6 w-6 text-purple-600" />
                      <h3 className="text-xl font-semibold">{request.service}</h3>
                      {getStatusBadge(request.status)}
                      <Badge variant="outline">{request.category}</Badge>
                    </div>

                    <p className="text-sm text-gray-700 mb-3">{request.description}</p>

                    <div className="grid md:grid-cols-3 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-gray-600">Requested By</p>
                        <p className="font-semibold">{request.requestedBy}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Community Interest</p>
                        <p className="font-semibold flex items-center">
                          <ThumbsUp className="h-4 w-4 mr-1 text-blue-600" />
                          {request.upvotes} residents ({Math.round((request.upvotes / 120) * 100)}%)
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Estimated Budget</p>
                        <p className="font-semibold">{request.estimatedBudget}</p>
                      </div>
                    </div>

                    {request.status === "POLL_CREATED" && (
                      <div className="bg-blue-50 p-3 rounded-lg mb-3">
                        <p className="text-sm font-semibold text-blue-800">
                          <Vote className="h-4 w-4 inline mr-1" />
                          Poll Active: {request.pollResult}
                        </p>
                      </div>
                    )}

                    {request.status === "PUBLISHED" && (
                      <div className="bg-green-50 p-3 rounded-lg mb-3">
                        <p className="text-sm font-semibold text-green-800">
                          <CheckCircle className="h-4 w-4 inline mr-1" />
                          Published to vendor marketplace on {request.publishedDate}
                        </p>
                      </div>
                    )}

                    {request.status === "REJECTED" && (
                      <div className="bg-red-50 p-3 rounded-lg mb-3">
                        <p className="text-sm text-red-800">Reason: {request.rejectionReason}</p>
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => setSelectedRequest(request)}>
                        View Details
                      </Button>
                      {request.status === "PENDING" && request.upvotes >= 25 && (
                        <>
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700"
                            onClick={() => handleCreatePoll(request)}
                          >
                            <Vote className="h-4 w-4 mr-1" />
                            Create Poll
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(request)}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                      {request.status === "POLL_CREATED" && (
                        <Link href="/society/votes">
                          <Button size="sm" variant="outline">
                            View Poll Results
                          </Button>
                        </Link>
                      )}
                      {request.status === "PENDING" && request.upvotes < 25 && (
                        <span className="text-sm text-gray-600 flex items-center">
                          Need {25 - request.upvotes} more upvotes to create poll
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Request Detail Modal */}
        <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedRequest?.service}</DialogTitle>
              <DialogDescription>
                Request ID: {selectedRequest?.id} • {selectedRequest && getStatusBadge(selectedRequest.status)}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Service Description</h4>
                <p className="text-sm text-gray-700">{selectedRequest?.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Requested By</p>
                  <p className="font-semibold">{selectedRequest?.requestedBy}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Category</p>
                  <p className="font-semibold">{selectedRequest?.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Requested Date</p>
                  <p className="font-semibold">{selectedRequest?.requestedDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Estimated Budget</p>
                  <p className="font-semibold">{selectedRequest?.estimatedBudget}</p>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Community Interest</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-blue-600">{selectedRequest?.upvotes}</p>
                    <p className="text-sm text-gray-600">residents interested</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-blue-600">
                      {selectedRequest && Math.round((selectedRequest.upvotes / 120) * 100)}%
                    </p>
                    <p className="text-sm text-gray-600">of society</p>
                  </div>
                </div>
              </div>

              {selectedRequest?.status === "PENDING" && selectedRequest.upvotes >= 25 && (
                <div className="space-y-3">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">✓ Sufficient Interest Received</h4>
                    <p className="text-sm text-gray-700">
                      This request has received strong community support. You can now:
                    </p>
                    <ul className="text-sm mt-2 space-y-1">
                      <li>• Create a formal poll for resident voting</li>
                      <li>• If poll passes (≥60%), publish requirement to vendors</li>
                      <li>• Vendors will send proposals with pricing</li>
                    </ul>
                  </div>

                  <div className="flex space-x-3">
                    <Button
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                      onClick={() => selectedRequest && handleCreatePoll(selectedRequest)}
                    >
                      <Vote className="h-4 w-4 mr-2" />
                      Create Poll for Voting
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={() => selectedRequest && handleReject(selectedRequest)}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject Request
                    </Button>
                  </div>
                </div>
              )}

              {selectedRequest?.status === "POLL_CREATED" && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Poll Status</h4>
                  <p className="text-sm mb-2">Current Result: {selectedRequest.pollResult}</p>
                  <Link href="/society/votes">
                    <Button className="w-full">View Full Poll Results</Button>
                  </Link>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
