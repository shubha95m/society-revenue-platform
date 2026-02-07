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
import { Package, Plus, Building2, Users, Send, Eye, Edit } from "lucide-react";
import { toast } from "sonner";

const publishedRequirements = [
  {
    id: "PUB-001",
    service: "Laundry Service",
    category: "Home Services",
    description: "Pick and drop laundry service for residents. Expected volume: 50-60 residents interested.",
    budget: "₹150-200/kg",
    publishedDate: "2026-02-03",
    status: "ACTIVE",
    views: 45,
    proposals: 8,
    interestedResidents: 52,
    expectedMonthlyVolume: "800-1000 kg",
  },
  {
    id: "PUB-002",
    service: "Car Wash Service",
    category: "Home Services",
    description: "Weekly car washing service at resident doorstep. Poll showed 68% approval.",
    budget: "₹250-350/wash",
    publishedDate: "2026-02-05",
    status: "ACTIVE",
    views: 32,
    proposals: 5,
    interestedResidents: 38,
    expectedMonthlyVolume: "150-180 washes",
  },
];

const approvedPolls = [
  {
    id: "POLL-003",
    service: "Grocery Delivery",
    description: "Daily grocery delivery service with fresh vegetables and fruits",
    category: "Daily Essentials",
    pollResult: "72% approved",
    interestedResidents: 58,
    estimatedBudget: "₹500-800/month",
  },
  {
    id: "POLL-004",
    service: "Electrician On-Demand",
    description: "24/7 emergency electrical repairs",
    category: "Home Maintenance",
    pollResult: "65% approved",
    interestedResidents: 42,
    estimatedBudget: "₹500/visit",
  },
];

export default function PublishRequirementPage() {
  const [showPublishForm, setShowPublishForm] = useState(false);
  const [selectedPoll, setSelectedPoll] = useState<typeof approvedPolls[0] | null>(null);
  const [formData, setFormData] = useState({
    service: "",
    category: "",
    description: "",
    budget: "",
    expectedVolume: "",
    requirements: "",
  });

  const handlePublish = () => {
    if (!formData.service || !formData.description || !formData.budget) {
      toast.error("Missing Information", {
        description: "Please fill in all required fields.",
      });
      return;
    }

    toast.success("Requirement Published!", {
      description: "Your requirement is now visible to all vendors in the marketplace.",
    });
    setShowPublishForm(false);
    setSelectedPoll(null);
    setFormData({ service: "", category: "", description: "", budget: "", expectedVolume: "", requirements: "" });
  };

  const handlePublishFromPoll = (poll: typeof approvedPolls[0]) => {
    setFormData({
      service: poll.service,
      category: poll.category,
      description: poll.description,
      budget: poll.estimatedBudget,
      expectedVolume: `${poll.interestedResidents} residents`,
      requirements: "",
    });
    setSelectedPoll(poll);
    setShowPublishForm(true);
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      ACTIVE: <Badge className="bg-green-100 text-green-700">Active</Badge>,
      CLOSED: <Badge className="bg-gray-100 text-gray-700">Closed</Badge>,
    };
    return badges[status as keyof typeof badges];
  };

  return (
    <DashboardLayout role="society" societyName="Green Valley" userName="Admin">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Publish Vendor Requirements</h1>
            <p className="text-gray-600">Publish approved service requirements to vendor marketplace</p>
          </div>
          <Button onClick={() => setShowPublishForm(true)} className="flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Publish New Requirement
          </Button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="py-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Active Requirements</p>
                <p className="text-3xl font-bold text-green-600">{publishedRequirements.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Total Views</p>
                <p className="text-3xl font-bold">
                  {publishedRequirements.reduce((sum, r) => sum + r.views, 0)}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Vendor Proposals</p>
                <p className="text-3xl font-bold text-blue-600">
                  {publishedRequirements.reduce((sum, r) => sum + r.proposals, 0)}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Approved Polls</p>
                <p className="text-3xl font-bold text-purple-600">{approvedPolls.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Approved Polls Ready to Publish */}
        {approvedPolls.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Approved Polls - Ready to Publish</h2>
            <p className="text-gray-600 mb-4">These polls have been approved by residents. Publish them to attract vendors.</p>
            <div className="space-y-4">
              {approvedPolls.map((poll) => (
                <Card key={poll.id} className="border-green-200 bg-green-50">
                  <CardContent className="py-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Package className="h-6 w-6 text-green-600" />
                          <h3 className="text-xl font-semibold">{poll.service}</h3>
                          <Badge className="bg-green-100 text-green-700">Poll Approved</Badge>
                          <Badge variant="outline">{poll.category}</Badge>
                        </div>

                        <p className="text-sm text-gray-700 mb-3">{poll.description}</p>

                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-xs text-gray-600">Poll Result</p>
                            <p className="font-semibold text-green-600">{poll.pollResult}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Interested Residents</p>
                            <p className="font-semibold">{poll.interestedResidents}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Budget Range</p>
                            <p className="font-semibold">{poll.estimatedBudget}</p>
                          </div>
                        </div>
                      </div>

                      <Button
                        className="ml-4 bg-green-600 hover:bg-green-700"
                        onClick={() => handlePublishFromPoll(poll)}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Publish to Vendors
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Published Requirements */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Active Published Requirements</h2>
          <div className="space-y-4">
            {publishedRequirements.map((requirement) => (
              <Card key={requirement.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="py-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <Package className="h-6 w-6 text-purple-600" />
                        <h3 className="text-xl font-semibold">{requirement.service}</h3>
                        {getStatusBadge(requirement.status)}
                        <Badge variant="outline">{requirement.category}</Badge>
                      </div>

                      <p className="text-sm text-gray-700 mb-4">{requirement.description}</p>

                      <div className="grid md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-600">Budget Range</p>
                          <p className="font-semibold text-green-600">{requirement.budget}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Expected Volume</p>
                          <p className="font-semibold">{requirement.expectedMonthlyVolume}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Marketplace Views</p>
                          <p className="font-semibold flex items-center">
                            <Eye className="h-4 w-4 mr-1 text-blue-600" />
                            {requirement.views}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Vendor Proposals</p>
                          <p className="font-semibold text-blue-600">{requirement.proposals} received</p>
                        </div>
                      </div>

                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-semibold text-blue-800">
                              <Building2 className="h-4 w-4 inline mr-1" />
                              {requirement.interestedResidents} residents interested
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button size="sm">
                              View Proposals ({requirement.proposals})
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Publish Form Modal */}
        <Dialog open={showPublishForm} onOpenChange={setShowPublishForm}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Publish Vendor Requirement</DialogTitle>
              <DialogDescription>
                This will be visible to all vendors in the marketplace. Vendors can submit proposals.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="service">Service Name *</Label>
                <Input
                  id="service"
                  placeholder="e.g., Grocery Delivery Service"
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
                  <option value="">Select category</option>
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
                  placeholder="Detailed description of what service you're looking for..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="budget">Budget Range *</Label>
                  <Input
                    id="budget"
                    placeholder="e.g., ₹500-800/month"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="expectedVolume">Expected Volume *</Label>
                  <Input
                    id="expectedVolume"
                    placeholder="e.g., 50 residents, 200kg/month"
                    value={formData.expectedVolume}
                    onChange={(e) => setFormData({ ...formData, expectedVolume: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="requirements">Specific Requirements (Optional)</Label>
                <Textarea
                  id="requirements"
                  placeholder="Any specific requirements: delivery timings, quality standards, certifications needed, etc."
                  rows={3}
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                />
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">What Vendors Will See:</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Society</p>
                    <p className="font-semibold">Green Valley Apartments</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Location</p>
                    <p className="font-semibold">Andheri West, Mumbai</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Total Flats</p>
                    <p className="font-semibold">120</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Occupancy</p>
                    <p className="font-semibold">65%</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">What Happens Next?</h4>
                <ul className="text-sm space-y-1">
                  <li>✓ Vendors will see your requirement in marketplace</li>
                  <li>✓ Interested vendors will submit proposals with pricing</li>
                  <li>✓ You'll review proposals and select vendors to interview</li>
                  <li>✓ After negotiation, finalize contract terms</li>
                </ul>
              </div>

              <Button className="w-full" size="lg" onClick={handlePublish}>
                <Send className="h-4 w-4 mr-2" />
                Publish to Vendor Marketplace
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
