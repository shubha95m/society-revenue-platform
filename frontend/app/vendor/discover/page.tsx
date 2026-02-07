"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Building2, Search, MapPin, Users, TrendingUp, Send, Package, Target, DollarSign, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const publishedRequirements = [
  {
    id: "REQ-PUB-001",
    society: "Green Valley Apartments",
    location: "Andheri West, Mumbai",
    distance: "2.8 km",
    service: "Laundry Service",
    category: "Home Services",
    description: "Pick and drop laundry service for residents. Proven demand from poll results.",
    budget: "₹150-200/kg",
    interestedResidents: 52,
    expectedVolume: "800-1000 kg/month",
    flats: 120,
    occupancy: 65,
    publishedDate: "2026-02-03",
    pollResult: "78% residents approved",
  },
  {
    id: "REQ-PUB-002",
    society: "Green Valley Apartments",
    location: "Andheri West, Mumbai",
    distance: "2.8 km",
    service: "Car Wash Service",
    category: "Home Services",
    description: "Weekly car washing service at resident doorstep. High demand confirmed via community poll.",
    budget: "₹250-350/wash",
    interestedResidents: 38,
    expectedVolume: "150-180 washes/month",
    flats: 120,
    occupancy: 65,
    publishedDate: "2026-02-05",
    pollResult: "68% residents approved",
  },
  {
    id: "REQ-PUB-003",
    society: "Sunrise Apartments",
    location: "Bandra East, Mumbai",
    distance: "5.5 km",
    service: "Grocery Delivery",
    category: "Daily Essentials",
    description: "Daily grocery delivery with fresh vegetables, fruits, and pantry items.",
    budget: "₹500-800/month per subscriber",
    interestedResidents: 72,
    expectedVolume: "70-80 active subscribers",
    flats: 180,
    occupancy: 88,
    publishedDate: "2026-02-04",
    pollResult: "72% residents approved",
  },
];

const societies = [
  {
    id: "SOC-001",
    name: "Palm Grove Society",
    location: "Andheri West, Mumbai",
    distance: "3.2 km",
    flats: 200,
    occupancy: 85,
    activeVendors: 8,
    avgSpend: 45000,
    lookingFor: ["Plumbing", "Electrical", "Cleaning"],
  },
  {
    id: "SOC-002",
    name: "Royal Heights",
    location: "Bandra East, Mumbai",
    distance: "5.1 km",
    flats: 150,
    occupancy: 92,
    activeVendors: 6,
    avgSpend: 38000,
    lookingFor: ["Plumbing", "Carpentry", "Pest Control"],
  },
];

export default function VendorDiscoverPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"requirements" | "societies">("requirements");
  const [selectedRequirement, setSelectedRequirement] = useState<typeof publishedRequirements[0] | null>(null);
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [proposalData, setProposalData] = useState({
    pricing: "",
    description: "",
    experience: "",
    deliveryTime: "",
  });

  const handleSubmitProposal = () => {
    if (!proposalData.pricing || !proposalData.description) {
      toast.error("Missing Information", {
        description: "Please fill in pricing and proposal description.",
      });
      return;
    }

    toast.success("Proposal Submitted!", {
      description: `Your proposal for "${selectedRequirement?.service}" has been sent to ${selectedRequirement?.society}.`,
    });
    setShowProposalForm(false);
    setSelectedRequirement(null);
    setProposalData({ pricing: "", description: "", experience: "", deliveryTime: "" });
  };

  const handleSendProposal = (req: typeof publishedRequirements[0]) => {
    setSelectedRequirement(req);
    setShowProposalForm(true);
  };

  const filteredRequirements = publishedRequirements.filter((req) =>
    req.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.society.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout role="vendor" societyName="QuickFix Solutions" userName="Vendor Admin">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Discover Opportunities</h1>
          <p className="text-gray-600">Find societies actively looking for your services</p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex space-x-2 mb-8">
          <Button
            variant={viewMode === "requirements" ? "default" : "outline"}
            onClick={() => setViewMode("requirements")}
            className="flex items-center"
          >
            <Target className="h-4 w-4 mr-2" />
            Active Requirements ({publishedRequirements.length})
          </Button>
          <Button
            variant={viewMode === "societies" ? "default" : "outline"}
            onClick={() => setViewMode("societies")}
            className="flex items-center"
          >
            <Building2 className="h-4 w-4 mr-2" />
            Browse Societies ({societies.length})
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
                <p className="text-sm text-gray-600 mb-1">Potential Reach</p>
                <p className="text-3xl font-bold text-purple-600">
                  {publishedRequirements.reduce((sum, r) => sum + r.interestedResidents, 0)}
                </p>
                <p className="text-xs text-gray-500 mt-1">interested residents</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Total Households</p>
                <p className="text-3xl font-bold">
                  {publishedRequirements.reduce((sum, r) => sum + r.flats, 0)}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Avg Approval</p>
                <p className="text-3xl font-bold text-green-600">73%</p>
                <p className="text-xs text-gray-500 mt-1">poll approval rate</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="py-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={viewMode === "requirements" ? "Search by service or society..." : "Search societies..."}
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Published Requirements View */}
        {viewMode === "requirements" && (
          <div className="space-y-6">
            {filteredRequirements.map((req) => (
              <Card key={req.id} className="hover:shadow-xl transition-shadow border-l-4 border-l-green-500">
                <CardContent className="py-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4 flex-1">
                      <Package className="h-10 w-10 text-green-600 mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-2xl font-bold">{req.service}</h3>
                          <Badge className="bg-green-100 text-green-700">Active Requirement</Badge>
                          <Badge variant="outline">{req.category}</Badge>
                        </div>

                        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
                          <Building2 className="h-4 w-4" />
                          <span className="font-semibold">{req.society}</span>
                          <span>•</span>
                          <MapPin className="h-4 w-4" />
                          <span>{req.location}</span>
                          <span>•</span>
                          <span className="text-blue-600">{req.distance} away</span>
                        </div>

                        <p className="text-gray-700 mb-4">{req.description}</p>

                        <div className="grid md:grid-cols-4 gap-6 mb-4">
                          <div className="bg-green-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-600 mb-1">Poll Result</p>
                            <p className="font-semibold text-green-700">{req.pollResult}</p>
                          </div>
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-600 mb-1">Interested Residents</p>
                            <p className="text-2xl font-bold text-blue-600">{req.interestedResidents}</p>
                          </div>
                          <div className="bg-purple-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-600 mb-1">Expected Volume</p>
                            <p className="font-semibold text-purple-700">{req.expectedVolume}</p>
                          </div>
                          <div className="bg-yellow-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-600 mb-1">Budget Range</p>
                            <p className="font-semibold text-yellow-700">{req.budget}</p>
                          </div>
                        </div>

                        <div className="bg-gray-50 p-3 rounded-lg mb-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Total Flats</p>
                              <p className="font-semibold">{req.flats}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Occupancy</p>
                              <p className="font-semibold">{req.occupancy}%</p>
                            </div>
                          </div>
                        </div>

                        <Button
                          size="lg"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleSendProposal(req)}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Submit Proposal
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredRequirements.length === 0 && (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center text-gray-500">
                    <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No requirements found matching your search</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Societies View (Original) */}
        {viewMode === "societies" && (
          <div className="grid md:grid-cols-2 gap-6">
            {societies.map((society) => (
              <Card key={society.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="py-6">
                  <div className="flex items-start space-x-3 mb-4">
                    <Building2 className="h-8 w-8 text-purple-600 mt-1" />
                    <div>
                      <h3 className="text-xl font-semibold mb-1">{society.name}</h3>
                      <p className="text-sm text-gray-600 flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {society.location} • {society.distance}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Total Flats</p>
                      <p className="text-2xl font-bold">{society.flats}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Avg Monthly Spend</p>
                      <p className="text-2xl font-bold text-green-600">₹{(society.avgSpend / 1000).toFixed(0)}k</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-semibold mb-2">Looking for services:</p>
                    <div className="flex flex-wrap gap-2">
                      {society.lookingFor.map((service, index) => (
                        <Badge key={index} variant="outline">{service}</Badge>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full">
                    <Send className="h-4 w-4 mr-2" />
                    Send Connection Request
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Proposal Form Modal */}
        <Dialog open={showProposalForm} onOpenChange={setShowProposalForm}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Submit Proposal for {selectedRequirement?.service}</DialogTitle>
              <DialogDescription>
                {selectedRequirement?.society} • {selectedRequirement?.interestedResidents} residents interested
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Requirement Details:</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-600">Budget Range</p>
                    <p className="font-semibold">{selectedRequirement?.budget}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Expected Volume</p>
                    <p className="font-semibold">{selectedRequirement?.expectedVolume}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Poll Result</p>
                    <p className="font-semibold text-green-600">{selectedRequirement?.pollResult}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Total Flats</p>
                    <p className="font-semibold">{selectedRequirement?.flats}</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <Label htmlFor="pricing">Your Pricing * </Label>
                <Input
                  id="pricing"
                  placeholder="e.g., ₹180/kg or ₹300/wash"
                  value={proposalData.pricing}
                  onChange={(e) => setProposalData({ ...proposalData, pricing: e.target.value })}
                />
                <p className="text-xs text-gray-500 mt-1">Suggested range: {selectedRequirement?.budget}</p>
              </div>

              <div>
                <Label htmlFor="description">Proposal Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Explain your service offering, what makes you unique, and how you'll meet their requirements..."
                  rows={5}
                  value={proposalData.description}
                  onChange={(e) => setProposalData({ ...proposalData, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="experience">Your Experience</Label>
                  <Input
                    id="experience"
                    placeholder="e.g., 5+ years, 20 societies"
                    value={proposalData.experience}
                    onChange={(e) => setProposalData({ ...proposalData, experience: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="deliveryTime">Delivery/Response Time</Label>
                  <Input
                    id="deliveryTime"
                    placeholder="e.g., Same day, Within 2 hours"
                    value={proposalData.deliveryTime}
                    onChange={(e) => setProposalData({ ...proposalData, deliveryTime: e.target.value })}
                  />
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">What Happens Next?</h4>
                <ul className="text-sm space-y-1">
                  <li><CheckCircle className="h-4 w-4 inline text-green-600 mr-1" /> Your proposal will be sent to society admin</li>
                  <li><CheckCircle className="h-4 w-4 inline text-green-600 mr-1" /> Admin will review all proposals</li>
                  <li><CheckCircle className="h-4 w-4 inline text-green-600 mr-1" /> If shortlisted, admin will contact you for discussion</li>
                  <li><CheckCircle className="h-4 w-4 inline text-green-600 mr-1" /> After agreement, formal contract will be signed</li>
                </ul>
              </div>

              <Button className="w-full" size="lg" onClick={handleSubmitProposal}>
                <Send className="h-4 w-4 mr-2" />
                Submit Proposal to {selectedRequirement?.society}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
