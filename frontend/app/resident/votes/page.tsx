"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle, XCircle, MinusCircle, Clock, TrendingDown } from "lucide-react";
import { toast } from "sonner";

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

export default function VotesPage() {
  const [selectedProposal, setSelectedProposal] = useState<typeof proposals[0] | null>(null);
  const [hasVoted, setHasVoted] = useState(false);

  const handleVote = (choice: "YES" | "NO" | "ABSTAIN") => {
    setHasVoted(true);
    toast.success("Vote Submitted!", {
      description: `Your vote "${choice}" has been recorded successfully.`,
    });
    setSelectedProposal(null);
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      ACTIVE: <Badge className="bg-green-100 text-green-700">Active</Badge>,
      PASSED: <Badge className="bg-blue-100 text-blue-700">Passed</Badge>,
      REJECTED: <Badge className="bg-red-100 text-red-700">Rejected</Badge>,
      INVALID: <Badge className="bg-gray-100 text-gray-700">Invalid (Quorum not met)</Badge>,
    };
    return badges[status as keyof typeof badges];
  };

  const calculatePercentage = (votes: number, total: number) => {
    return total > 0 ? Math.round((votes / total) * 100) : 0;
  };

  return (
    <DashboardLayout role="resident" societyName="Green Valley" userName="John Doe">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Active Votes</h1>
          <p className="text-gray-600">Your voice matters. Vote on important society decisions.</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="py-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Active Proposals</p>
                <p className="text-3xl font-bold">2</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Your Participation</p>
                <p className="text-3xl font-bold">8/10</p>
                <p className="text-xs text-green-600 mt-1">80% this year</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Impact Achieved</p>
                <p className="text-3xl font-bold text-green-600">₹350</p>
                <p className="text-xs text-gray-600 mt-1">Savings/month from passed proposals</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Proposals List */}
        <div className="space-y-6">
          {proposals.map((proposal) => {
            const yesPercent = calculatePercentage(proposal.currentVotes.yes, proposal.currentVotes.total);
            const noPercent = calculatePercentage(proposal.currentVotes.no, proposal.currentVotes.total);
            const abstainPercent = calculatePercentage(proposal.currentVotes.abstain, proposal.currentVotes.total);
            const turnoutPercent = calculatePercentage(proposal.currentVotes.total, proposal.currentVotes.eligible);

            return (
              <Card key={proposal.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-xl">{proposal.title}</CardTitle>
                    {getStatusBadge(proposal.status)}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {proposal.status === "ACTIVE" ? `Ends in ${proposal.daysLeft} days` : "Voting ended"}
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
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-3">
                    {proposal.status === "ACTIVE" && !hasVoted && (
                      <>
                        <Button
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => setSelectedProposal(proposal)}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Vote Now
                        </Button>
                        <Button variant="outline" onClick={() => setSelectedProposal(proposal)}>
                          View Details
                        </Button>
                      </>
                    )}
                    {proposal.status === "ACTIVE" && hasVoted && (
                      <Button variant="outline" disabled>
                        <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                        You've Voted
                      </Button>
                    )}
                    {proposal.status !== "ACTIVE" && (
                      <Button variant="outline" onClick={() => setSelectedProposal(proposal)}>
                        View Results
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Voting Detail Modal */}
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
                    <p className="font-semibold text-green-900">Financial Impact</p>
                    <p className="text-sm text-green-800">{selectedProposal?.impactStatement}</p>
                  </div>
                </div>
              </div>

              {selectedProposal?.status === "ACTIVE" && !hasVoted && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-3">Cast Your Vote</h4>
                    <div className="grid grid-cols-3 gap-3">
                      <Button
                        className="h-20 flex flex-col bg-green-600 hover:bg-green-700"
                        onClick={() => handleVote("YES")}
                      >
                        <CheckCircle className="h-6 w-6 mb-2" />
                        <span>Vote Yes</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-20 flex flex-col border-red-300 hover:bg-red-50"
                        onClick={() => handleVote("NO")}
                      >
                        <XCircle className="h-6 w-6 mb-2 text-red-600" />
                        <span>Vote No</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-20 flex flex-col"
                        onClick={() => handleVote("ABSTAIN")}
                      >
                        <MinusCircle className="h-6 w-6 mb-2" />
                        <span>Abstain</span>
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
