"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle, XCircle, MinusCircle, Clock, TrendingDown, Package, Send } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

const proposals = [
  {
    id: 1,
    title: "Should we hire ABC Plumbing Services?",
    category: "VENDOR",
    description: "ABC Plumbing Services offers 24/7 emergency services with a 2-hour response time guarantee. They have excellent reviews from 3 other societies in Mumbai.",
    impactStatement: "This will reduce maintenance by ₹120/flat/month through bulk pricing",
    proposedBy: "Managing Committee",
    votingEndDate: "2026-01-10",
    daysLeft: 2,
    quorum: 50,
    approvalThreshold: 66,
    currentVotes: {
      yes: 156,
      no: 32,
      abstain: 12,
      total: 200,
      eligible: 120,
    },
    status: "ACTIVE",
    details: "ABC Plumbing has been serving residential societies for 10+ years. Current rate: ₹500/visit. Proposed society rate: ₹400/visit.",
  },
  {
    id: 2,
    title: "Install solar panels on rooftop?",
    category: "EXPENSE",
    description: "Install a 50kW solar panel system on the society rooftop. Initial investment of ₹25 lakh with government subsidy of ₹10 lakh.",
    impactStatement: "Expected savings of ₹200/flat/month after 6 months ROI period",
    proposedBy: "Green Initiative Committee",
    votingEndDate: "2026-01-15",
    daysLeft: 5,
    quorum: 50,
    approvalThreshold: 75,
    currentVotes: {
      yes: 89,
      no: 18,
      abstain: 8,
      total: 115,
      eligible: 120,
    },
    status: "ACTIVE",
    details: "Estimated energy generation: 75,000 kWh/year. Current electricity bill: ₹3.5 lakh/month. Projected savings: ₹24,000/month.",
  },
  {
    id: 3,
    title: "Service Request: Grocery Delivery Service",
    category: "SERVICE_REQUIREMENT",
    description: "Daily grocery delivery service with fresh vegetables and fruits. Requested by residents with 58 upvotes.",
    impactStatement: "Estimated monthly volume: 150-200 orders. Budget: ₹500-800/month per household",
    proposedBy: "John Doe (A-304)",
    votingEndDate: "2026-02-08",
    daysLeft: 1,
    quorum: 50,
    approvalThreshold: 60,
    currentVotes: {
      yes: 86,
      no: 12,
      abstain: 4,
      total: 102,
      eligible: 120,
    },
    status: "ACTIVE",
    details: "This service was requested by residents and has received strong community support. If approved, it will be published to vendor marketplace for proposals.",
    interestedResidents: 58,
    estimatedBudget: "₹500-800/month",
  },
  {
    id: 4,
    title: "Service Request: Electrician On-Demand",
    category: "SERVICE_REQUIREMENT",
    description: "24/7 emergency electrical repairs with fast response time.",
    impactStatement: "38 residents interested. Budget: ₹500/visit",
    proposedBy: "Raj M. (B-301)",
    votingEndDate: "2026-02-06",
    daysLeft: 0,
    quorum: 50,
    approvalThreshold: 60,
    currentVotes: {
      yes: 78,
      no: 8,
      abstain: 6,
      total: 92,
      eligible: 120,
    },
    status: "PASSED",
    details: "Emergency electrician service available 24/7. Residents have expressed strong interest in having a reliable electrician on-call.",
    interestedResidents: 38,
    estimatedBudget: "₹500/visit",
  },
  {
    id: 5,
    title: "Approve new newspaper vendor contract",
    category: "VENDOR",
    description: "Switch to Times Group for newspaper delivery. They offer better rates and digital access.",
    impactStatement: "Save ₹30/month per household compared to current vendor",
    proposedBy: "Resident - Flat A-205",
    votingEndDate: "2026-01-08",
    daysLeft: 0,
    quorum: 50,
    approvalThreshold: 66,
    currentVotes: {
      yes: 98,
      no: 12,
      abstain: 5,
      total: 115,
      eligible: 120,
    },
    status: "PASSED",
    details: "Current vendor: Local vendor (₹300/month). Proposed vendor: Times Group (₹270/month). Includes digital access to Times app.",
  },
];

export default function SocietyVotesPage() {
  const [selectedProposal, setSelectedProposal] = useState<typeof proposals[0] | null>(null);
  const [markedAsDone, setMarkedAsDone] = useState<number[]>([]);

  const handleMarkPollDone = (proposal: typeof proposals[0]) => {
    setMarkedAsDone([...markedAsDone, proposal.id]);
    toast.success("Poll Marked as Done!", {
      description: `"${proposal.title}" is now approved and available in Publish Requirement page.`,
    });
    setSelectedProposal(null);
  };

  const getStatusBadge = (status: string, proposalId?: number) => {
    if (proposalId && markedAsDone.includes(proposalId)) {
      return <Badge className="bg-purple-100 text-purple-700">Approved - Ready to Publish</Badge>;
    }

    const badges = {
      ACTIVE: <Badge className="bg-green-100 text-green-700">Active</Badge>,
      PASSED: <Badge className="bg-blue-100 text-blue-700">Passed</Badge>,
      REJECTED: <Badge className="bg-red-100 text-red-700">Rejected</Badge>,
      INVALID: <Badge className="bg-gray-100 text-gray-700">Invalid (Quorum not met)</Badge>,
    };
    return badges[status as keyof typeof badges];
  };

  const getCategoryBadge = (category: string) => {
    const badges = {
      VENDOR: <Badge variant="outline">Vendor Selection</Badge>,
      EXPENSE: <Badge variant="outline">Major Expense</Badge>,
      SERVICE_REQUIREMENT: <Badge variant="outline" className="border-purple-300 text-purple-700">Service Requirement</Badge>,
    };
    return badges[category as keyof typeof badges];
  };

  const calculatePercentage = (votes: number, total: number) => {
    return total > 0 ? Math.round((votes / total) * 100) : 0;
  };

  const activePolls = proposals.filter(p => p.status === "ACTIVE");
  const completedPolls = proposals.filter(p => p.status === "PASSED" || p.status === "REJECTED");
  const serviceRequirementPolls = proposals.filter(p => p.category === "SERVICE_REQUIREMENT");
  const passedServicePolls = serviceRequirementPolls.filter(p => p.status === "PASSED" && !markedAsDone.includes(p.id));

  return (
    <DashboardLayout role="society" societyName="Green Valley" userName="Admin">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Manage Polls & Votes</h1>
          <p className="text-gray-600">Monitor voting progress and manage poll results</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="py-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Active Polls</p>
                <p className="text-3xl font-bold text-green-600">{activePolls.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Completed Polls</p>
                <p className="text-3xl font-bold">{completedPolls.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Service Requirement Polls</p>
                <p className="text-3xl font-bold text-purple-600">{serviceRequirementPolls.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Ready to Publish</p>
                <p className="text-3xl font-bold text-blue-600">{passedServicePolls.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alert for passed service requirement polls */}
        {passedServicePolls.length > 0 && (
          <Card className="mb-6 border-purple-200 bg-purple-50">
            <CardContent className="py-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-purple-900 mb-2 flex items-center">
                    <Package className="h-5 w-5 mr-2" />
                    Service Requirement Polls Ready for Action
                  </h3>
                  <p className="text-sm text-purple-800">
                    {passedServicePolls.length} poll{passedServicePolls.length > 1 ? 's have' : ' has'} passed and can be marked as done to publish requirements to vendor marketplace.
                  </p>
                </div>
                <Link href="/society/publish-requirement">
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Send className="h-4 w-4 mr-2" />
                    Go to Publish
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Active Polls */}
        {activePolls.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Active Polls</h2>
            <div className="space-y-6">
              {activePolls.map((proposal) => {
                const yesPercent = calculatePercentage(proposal.currentVotes.yes, proposal.currentVotes.total);
                const noPercent = calculatePercentage(proposal.currentVotes.no, proposal.currentVotes.total);
                const abstainPercent = calculatePercentage(proposal.currentVotes.abstain, proposal.currentVotes.total);
                const turnoutPercent = calculatePercentage(proposal.currentVotes.total, proposal.currentVotes.eligible);

                return (
                  <Card key={proposal.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <CardTitle className="text-xl">{proposal.title}</CardTitle>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(proposal.status, proposal.id)}
                          {getCategoryBadge(proposal.category)}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          Ends in {proposal.daysLeft} days
                        </span>
                        <span>Proposed by: {proposal.proposedBy}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 mb-4">{proposal.description}</p>

                      {/* Impact Statement */}
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                        <div className="flex items-start">
                          <TrendingDown className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                          <div>
                            <p className="font-semibold text-green-900">Impact</p>
                            <p className="text-sm text-green-800">{proposal.impactStatement}</p>
                          </div>
                        </div>
                      </div>

                      {/* Voting Progress */}
                      <div className="space-y-3 mb-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">Yes ({proposal.currentVotes.yes} votes)</span>
                            <span className="font-semibold">{yesPercent}%</span>
                          </div>
                          <Progress value={yesPercent} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">No ({proposal.currentVotes.no} votes)</span>
                            <span className="font-semibold">{noPercent}%</span>
                          </div>
                          <Progress value={noPercent} className="h-2 [&>div]:bg-red-500" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">Abstain ({proposal.currentVotes.abstain} votes)</span>
                            <span className="font-semibold">{abstainPercent}%</span>
                          </div>
                          <Progress value={abstainPercent} className="h-2 [&>div]:bg-gray-400" />
                        </div>
                      </div>

                      {/* Quorum & Threshold */}
                      <div className="flex gap-4 text-sm mb-4">
                        <div>
                          <span className="text-gray-600">Turnout: </span>
                          <span className={`font-semibold ${turnoutPercent >= proposal.quorum ? "text-green-600" : "text-orange-600"}`}>
                            {turnoutPercent}% {turnoutPercent >= proposal.quorum ? "✓" : `(need ${proposal.quorum}%)`}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Approval needed: </span>
                          <span className="font-semibold">{proposal.approvalThreshold}%</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Current Approval: </span>
                          <span className={`font-semibold ${yesPercent >= proposal.approvalThreshold ? "text-green-600" : "text-gray-600"}`}>
                            {yesPercent}% {yesPercent >= proposal.approvalThreshold ? "✓" : ""}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex space-x-3">
                        <Button variant="outline" onClick={() => setSelectedProposal(proposal)}>
                          View Details
                        </Button>
                        <Button variant="outline">
                          View Voting History
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Completed Polls */}
        {completedPolls.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Completed Polls</h2>
            <div className="space-y-6">
              {completedPolls.map((proposal) => {
                const yesPercent = calculatePercentage(proposal.currentVotes.yes, proposal.currentVotes.total);
                const noPercent = calculatePercentage(proposal.currentVotes.no, proposal.currentVotes.total);
                const abstainPercent = calculatePercentage(proposal.currentVotes.abstain, proposal.currentVotes.total);
                const turnoutPercent = calculatePercentage(proposal.currentVotes.total, proposal.currentVotes.eligible);
                const isPassed = yesPercent >= proposal.approvalThreshold && turnoutPercent >= proposal.quorum;
                const isServiceRequirement = proposal.category === "SERVICE_REQUIREMENT";
                const canMarkDone = isServiceRequirement && isPassed && !markedAsDone.includes(proposal.id);

                return (
                  <Card key={proposal.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <CardTitle className="text-xl">{proposal.title}</CardTitle>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(proposal.status, proposal.id)}
                          {getCategoryBadge(proposal.category)}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          Voting ended
                        </span>
                        <span>Proposed by: {proposal.proposedBy}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 mb-4">{proposal.description}</p>

                      {/* Voting Progress */}
                      <div className="space-y-3 mb-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">Yes ({proposal.currentVotes.yes} votes)</span>
                            <span className="font-semibold">{yesPercent}%</span>
                          </div>
                          <Progress value={yesPercent} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">No ({proposal.currentVotes.no} votes)</span>
                            <span className="font-semibold">{noPercent}%</span>
                          </div>
                          <Progress value={noPercent} className="h-2 [&>div]:bg-red-500" />
                        </div>
                      </div>

                      {/* Final Result */}
                      <div className="flex gap-4 text-sm mb-4">
                        <div>
                          <span className="text-gray-600">Final Turnout: </span>
                          <span className="font-semibold">{turnoutPercent}%</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Final Approval: </span>
                          <span className="font-semibold">{yesPercent}%</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Result: </span>
                          <span className={`font-semibold ${isPassed ? "text-green-600" : "text-red-600"}`}>
                            {isPassed ? "PASSED ✓" : "FAILED"}
                          </span>
                        </div>
                      </div>

                      {/* Service Requirement specific info */}
                      {isServiceRequirement && (
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                          <div className="flex items-start">
                            <Package className="h-5 w-5 text-purple-600 mr-2 mt-0.5" />
                            <div className="flex-1">
                              <p className="font-semibold text-purple-900">Service Requirement Details</p>
                              <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-purple-800">
                                <div>
                                  <span className="text-gray-600">Interested Residents: </span>
                                  <span className="font-semibold">{proposal.interestedResidents}</span>
                                </div>
                                <div>
                                  <span className="text-gray-600">Budget: </span>
                                  <span className="font-semibold">{proposal.estimatedBudget}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Mark as Done for Service Requirements */}
                      {canMarkDone && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                          <p className="text-sm text-blue-800 mb-3">
                            ✓ This poll has passed! Mark it as done to publish the requirement to vendor marketplace.
                          </p>
                          <Button
                            className="bg-blue-600 hover:bg-blue-700"
                            onClick={() => handleMarkPollDone(proposal)}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Mark Poll Done & Approve for Publishing
                          </Button>
                        </div>
                      )}

                      {markedAsDone.includes(proposal.id) && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                          <p className="text-sm text-green-800 mb-3">
                            ✓ This requirement is now approved and ready to publish to vendors!
                          </p>
                          <Link href="/society/publish-requirement">
                            <Button className="bg-green-600 hover:bg-green-700">
                              <Send className="h-4 w-4 mr-2" />
                              Go to Publish Requirement Page
                            </Button>
                          </Link>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex space-x-3">
                        <Button variant="outline" onClick={() => setSelectedProposal(proposal)}>
                          View Full Results
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Poll Detail Modal */}
        <Dialog open={!!selectedProposal} onOpenChange={() => setSelectedProposal(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedProposal?.title}</DialogTitle>
              <DialogDescription>
                Category: {selectedProposal?.category} • Proposed by {selectedProposal?.proposedBy}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-sm text-gray-700">{selectedProposal?.description}</p>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-2">Details</h4>
                <p className="text-sm text-gray-700">{selectedProposal?.details}</p>
              </div>

              <Separator />

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start">
                  <TrendingDown className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                  <div>
                    <p className="font-semibold text-green-900">Impact</p>
                    <p className="text-sm text-green-800">{selectedProposal?.impactStatement}</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-2">Voting Statistics</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Total Votes: </span>
                    <span className="font-semibold">{selectedProposal?.currentVotes.total}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Eligible Voters: </span>
                    <span className="font-semibold">{selectedProposal?.currentVotes.eligible}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Turnout: </span>
                    <span className="font-semibold">
                      {selectedProposal && calculatePercentage(selectedProposal.currentVotes.total, selectedProposal.currentVotes.eligible)}%
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Approval Rate: </span>
                    <span className="font-semibold">
                      {selectedProposal && calculatePercentage(selectedProposal.currentVotes.yes, selectedProposal.currentVotes.total)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
