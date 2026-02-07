"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, ThumbsUp, Clock, CheckCircle, Package } from "lucide-react";
import { toast } from "sonner";

const myRequests = [
  {
    id: "REQ-001",
    service: "Grocery Delivery",
    description: "Daily grocery delivery service with fresh vegetables and fruits",
    category: "Daily Essentials",
    requestedDate: "2026-02-05",
    status: "UNDER_REVIEW",
    upvotes: 45,
    hasVoted: true,
  },
  {
    id: "REQ-002",
    service: "Car Wash Service",
    description: "Weekly car washing service at doorstep",
    category: "Home Services",
    requestedDate: "2026-02-01",
    status: "APPROVED",
    upvotes: 32,
    hasVoted: true,
    pollStatus: "Poll created - 68% residents interested",
  },
  {
    id: "REQ-003",
    service: "Laundry Service",
    description: "Pick and drop laundry service",
    category: "Home Services",
    requestedDate: "2026-01-28",
    status: "REJECTED",
    upvotes: 12,
    hasVoted: false,
    rejectionReason: "Not enough resident interest (only 15%)",
  },
];

const communityRequests = [
  {
    id: "REQ-004",
    service: "Vegetable Delivery",
    description: "Fresh organic vegetables daily",
    category: "Daily Essentials",
    requestedBy: "Priya S. (A-205)",
    requestedDate: "2026-02-06",
    status: "UNDER_REVIEW",
    upvotes: 23,
    hasVoted: false,
  },
  {
    id: "REQ-005",
    service: "Electrician On-Demand",
    description: "24/7 emergency electrical repairs",
    category: "Home Maintenance",
    requestedBy: "Raj M. (B-301)",
    requestedDate: "2026-02-04",
    status: "UNDER_REVIEW",
    upvotes: 38,
    hasVoted: false,
  },
  {
    id: "REQ-006",
    service: "Pet Grooming",
    description: "Monthly pet grooming service",
    category: "Pet Services",
    requestedBy: "Anita K. (A-102)",
    requestedDate: "2026-02-03",
    status: "UNDER_REVIEW",
    upvotes: 15,
    hasVoted: true,
  },
];

export default function RequestServicePage() {
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [formData, setFormData] = useState({
    service: "",
    category: "Daily Essentials",
    description: "",
    expectedBudget: "",
  });

  const handleSubmitRequest = () => {
    if (!formData.service || !formData.description) {
      toast.error("Missing Information", {
        description: "Please fill in service name and description.",
      });
      return;
    }

    toast.success("Service Request Submitted!", {
      description: "Your request has been sent to society admin for review.",
    });
    setShowRequestForm(false);
    setFormData({ service: "", category: "Daily Essentials", description: "", expectedBudget: "" });
  };

  const handleUpvote = (requestId: string) => {
    toast.success("Vote Recorded", {
      description: "Thank you for supporting this service request!",
    });
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      UNDER_REVIEW: <Badge className="bg-yellow-100 text-yellow-700">Under Review</Badge>,
      APPROVED: <Badge className="bg-green-100 text-green-700">Approved</Badge>,
      REJECTED: <Badge className="bg-red-100 text-red-700">Rejected</Badge>,
      POLL_CREATED: <Badge className="bg-blue-100 text-blue-700">Poll Active</Badge>,
    };
    return badges[status as keyof typeof badges];
  };

  return (
    <DashboardLayout role="resident" societyName="Green Valley" userName="John Doe">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Request New Service</h1>
            <p className="text-gray-600">Suggest services you'd like to see in our society</p>
          </div>
          <Button onClick={() => setShowRequestForm(true)} className="flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Request Service
          </Button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="py-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">My Requests</p>
                <p className="text-3xl font-bold">{myRequests.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Approved</p>
                <p className="text-3xl font-bold text-green-600">
                  {myRequests.filter(r => r.status === "APPROVED").length}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Under Review</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {myRequests.filter(r => r.status === "UNDER_REVIEW").length}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Total Community Requests</p>
                <p className="text-3xl font-bold">{communityRequests.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* My Requests */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">My Service Requests</h2>
          <div className="space-y-4">
            {myRequests.map((request) => (
              <Card key={request.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="py-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Package className="h-5 w-5 text-purple-600" />
                        <h3 className="text-lg font-semibold">{request.service}</h3>
                        {getStatusBadge(request.status)}
                        <Badge variant="outline">{request.category}</Badge>
                      </div>

                      <p className="text-sm text-gray-700 mb-3">{request.description}</p>

                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          Requested: {request.requestedDate}
                        </span>
                        <span className="flex items-center">
                          <ThumbsUp className="h-4 w-4 mr-1 text-blue-600" />
                          {request.upvotes} residents interested
                        </span>
                      </div>

                      {request.pollStatus && (
                        <div className="mt-3 bg-blue-50 p-3 rounded-lg">
                          <p className="text-sm font-semibold text-blue-800">✓ {request.pollStatus}</p>
                        </div>
                      )}

                      {request.status === "REJECTED" && request.rejectionReason && (
                        <div className="mt-3 bg-red-50 p-3 rounded-lg">
                          <p className="text-sm text-red-800">Reason: {request.rejectionReason}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Community Requests */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Community Service Requests</h2>
          <p className="text-gray-600 mb-4">Support requests from other residents by upvoting</p>
          <div className="space-y-4">
            {communityRequests.map((request) => (
              <Card key={request.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="py-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Package className="h-5 w-5 text-purple-600" />
                        <h3 className="text-lg font-semibold">{request.service}</h3>
                        {getStatusBadge(request.status)}
                        <Badge variant="outline">{request.category}</Badge>
                      </div>

                      <p className="text-sm text-gray-700 mb-3">{request.description}</p>

                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <span>Requested by: {request.requestedBy}</span>
                        <span>•</span>
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {request.requestedDate}
                        </span>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Button
                          size="sm"
                          variant={request.hasVoted ? "default" : "outline"}
                          onClick={() => !request.hasVoted && handleUpvote(request.id)}
                          disabled={request.hasVoted}
                        >
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          {request.hasVoted ? "Voted" : "Upvote"} ({request.upvotes})
                        </Button>
                        {request.upvotes >= 30 && (
                          <span className="text-sm text-green-600 font-semibold">
                            <CheckCircle className="h-4 w-4 inline mr-1" />
                            High interest! Admin will review soon
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Request Form Modal */}
        <Dialog open={showRequestForm} onOpenChange={setShowRequestForm}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Request New Service</DialogTitle>
              <DialogDescription>
                Suggest a service you'd like to see in our society. Other residents can upvote your request.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="service">Service Name *</Label>
                <Input
                  id="service"
                  placeholder="e.g., Organic Vegetable Delivery"
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <select
                  id="category"
                  className="w-full border rounded-md p-2"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="Daily Essentials">Daily Essentials</option>
                  <option value="Home Maintenance">Home Maintenance</option>
                  <option value="Home Services">Home Services</option>
                  <option value="Health & Wellness">Health & Wellness</option>
                  <option value="Pet Services">Pet Services</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <Label htmlFor="description">Service Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the service and why it would benefit the society..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="expectedBudget">Expected Budget (Optional)</Label>
                <Input
                  id="expectedBudget"
                  placeholder="e.g., ₹500/month or ₹200/service"
                  value={formData.expectedBudget}
                  onChange={(e) => setFormData({ ...formData, expectedBudget: e.target.value })}
                />
                <p className="text-xs text-gray-500 mt-1">Help admin understand your budget expectations</p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">What happens next?</h4>
                <ul className="text-sm space-y-1">
                  <li>✓ Your request will be visible to all residents</li>
                  <li>✓ Other residents can upvote if interested</li>
                  <li>✓ Society admin will review based on community interest</li>
                  <li>✓ If approved, admin will create a poll for formal voting</li>
                  <li>✓ If poll passes, admin will publish requirement for vendors</li>
                </ul>
              </div>

              <Button className="w-full" size="lg" onClick={handleSubmitRequest}>
                <Plus className="h-4 w-4 mr-2" />
                Submit Service Request
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
