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
import { AlertCircle, CheckCircle2, Clock, FileText, Plus } from "lucide-react";
import { toast } from "sonner";

const complaints = [
  {
    id: "CMP-2026-001",
    title: "Lift not working in Tower B",
    category: "Maintenance",
    priority: "HIGH",
    status: "IN_PROGRESS",
    createdDate: "2026-02-05",
    updatedDate: "2026-02-06",
    description: "The lift in Tower B has been out of order since yesterday. Residents on higher floors are facing difficulty.",
    assignedTo: "Maintenance Team",
    timeline: [
      { date: "2026-02-05", status: "RAISED", note: "Complaint raised by resident" },
      { date: "2026-02-05", status: "ACKNOWLEDGED", note: "Acknowledged by society admin" },
      { date: "2026-02-06", status: "IN_PROGRESS", note: "Technician assigned, parts ordered" },
    ],
  },
  {
    id: "CMP-2026-002",
    title: "Water leakage in parking area",
    category: "Maintenance",
    priority: "MEDIUM",
    status: "RESOLVED",
    createdDate: "2026-01-28",
    updatedDate: "2026-02-01",
    resolvedDate: "2026-02-01",
    description: "There is continuous water leakage near parking slot P-45.",
    assignedTo: "Plumbing Team",
    timeline: [
      { date: "2026-01-28", status: "RAISED", note: "Complaint raised by resident" },
      { date: "2026-01-29", status: "ACKNOWLEDGED", note: "Acknowledged by society admin" },
      { date: "2026-01-30", status: "IN_PROGRESS", note: "Plumber inspected the issue" },
      { date: "2026-02-01", status: "RESOLVED", note: "Pipe repaired, issue fixed" },
    ],
  },
  {
    id: "CMP-2026-003",
    title: "Milk delivery timing issue",
    category: "Vendor Service",
    priority: "LOW",
    status: "ACKNOWLEDGED",
    createdDate: "2026-02-04",
    updatedDate: "2026-02-04",
    description: "Milk is being delivered after 8 AM instead of 7 AM as per SLA.",
    assignedTo: "Vendor Relations",
    timeline: [
      { date: "2026-02-04", status: "RAISED", note: "Complaint raised by resident" },
      { date: "2026-02-04", status: "ACKNOWLEDGED", note: "Forwarded to vendor" },
    ],
  },
];

export default function ComplaintsPage() {
  const [showNewComplaintForm, setShowNewComplaintForm] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<typeof complaints[0] | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "Maintenance",
    priority: "MEDIUM",
    description: "",
  });

  const handleSubmitComplaint = () => {
    if (!formData.title || !formData.description) {
      toast.error("Missing Information", {
        description: "Please fill in all required fields.",
      });
      return;
    }

    toast.success("Complaint Registered!", {
      description: "Your complaint has been submitted. You'll receive updates shortly.",
    });
    setShowNewComplaintForm(false);
    setFormData({ title: "", category: "Maintenance", priority: "MEDIUM", description: "" });
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      RAISED: <Badge className="bg-orange-100 text-orange-700">Raised</Badge>,
      ACKNOWLEDGED: <Badge className="bg-blue-100 text-blue-700">Acknowledged</Badge>,
      IN_PROGRESS: <Badge className="bg-purple-100 text-purple-700">In Progress</Badge>,
      RESOLVED: <Badge className="bg-green-100 text-green-700">Resolved</Badge>,
      CLOSED: <Badge className="bg-gray-100 text-gray-700">Closed</Badge>,
    };
    return badges[status as keyof typeof badges];
  };

  const getPriorityBadge = (priority: string) => {
    const badges = {
      LOW: <Badge variant="outline" className="border-green-300 text-green-700">Low</Badge>,
      MEDIUM: <Badge variant="outline" className="border-yellow-300 text-yellow-700">Medium</Badge>,
      HIGH: <Badge variant="outline" className="border-red-300 text-red-700">High</Badge>,
    };
    return badges[priority as keyof typeof badges];
  };

  const activeComplaints = complaints.filter(c => c.status !== "RESOLVED" && c.status !== "CLOSED");
  const resolvedComplaints = complaints.filter(c => c.status === "RESOLVED" || c.status === "CLOSED");

  return (
    <DashboardLayout role="resident" societyName="Green Valley" userName="John Doe">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Complaints & Issues</h1>
            <p className="text-gray-600">Raise and track your complaints</p>
          </div>
          <Button onClick={() => setShowNewComplaintForm(true)} className="flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Raise Complaint
          </Button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="py-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Total Complaints</p>
                <p className="text-3xl font-bold">{complaints.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Active</p>
                <p className="text-3xl font-bold text-orange-600">{activeComplaints.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Resolved</p>
                <p className="text-3xl font-bold text-green-600">{resolvedComplaints.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Avg Resolution</p>
                <p className="text-3xl font-bold">3.2 days</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Complaints */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Active Complaints</h2>
          <div className="space-y-4">
            {activeComplaints.map((complaint) => (
              <Card key={complaint.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedComplaint(complaint)}>
                <CardContent className="py-6">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold">{complaint.title}</h3>
                        {getStatusBadge(complaint.status)}
                        {getPriorityBadge(complaint.priority)}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">ID: {complaint.id}</p>
                      <p className="text-sm text-gray-700">{complaint.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span className="flex items-center">
                      <FileText className="h-4 w-4 mr-1" />
                      {complaint.category}
                    </span>
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      Created: {complaint.createdDate}
                    </span>
                    <span>Assigned to: {complaint.assignedTo}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Resolved Complaints */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Resolved Complaints</h2>
          <div className="space-y-4">
            {resolvedComplaints.map((complaint) => (
              <Card key={complaint.id} className="hover:shadow-lg transition-shadow cursor-pointer opacity-75" onClick={() => setSelectedComplaint(complaint)}>
                <CardContent className="py-6">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold">{complaint.title}</h3>
                        {getStatusBadge(complaint.status)}
                        {getPriorityBadge(complaint.priority)}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">ID: {complaint.id}</p>
                    </div>
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span className="flex items-center">
                      <FileText className="h-4 w-4 mr-1" />
                      {complaint.category}
                    </span>
                    <span>Resolved on: {complaint.resolvedDate}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* New Complaint Form Modal */}
        <Dialog open={showNewComplaintForm} onOpenChange={setShowNewComplaintForm}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Raise a New Complaint</DialogTitle>
              <DialogDescription>
                Fill in the details below. Society admin will review and assign it to the relevant team.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Complaint Title *</Label>
                <Input
                  id="title"
                  placeholder="Brief description of the issue"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <select
                    id="category"
                    className="w-full border rounded-md p-2"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option>Maintenance</option>
                    <option>Vendor Service</option>
                    <option>Amenity</option>
                    <option>Staff</option>
                    <option>Security</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="priority">Priority *</Label>
                  <select
                    id="priority"
                    className="w-full border rounded-md p-2"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Detailed Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Explain the issue in detail. Include location, timing, and any other relevant information."
                  rows={5}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="bg-blue-50 p-3 rounded-lg flex items-start">
                <AlertCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-1">Resolution Timeline</p>
                  <ul className="text-xs space-y-1">
                    <li>• High Priority: 24-48 hours</li>
                    <li>• Medium Priority: 3-5 days</li>
                    <li>• Low Priority: 5-7 days</li>
                  </ul>
                </div>
              </div>

              <Button className="w-full" size="lg" onClick={handleSubmitComplaint}>
                Submit Complaint
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Complaint Detail Modal */}
        <Dialog open={!!selectedComplaint} onOpenChange={() => setSelectedComplaint(null)}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>{selectedComplaint?.title}</span>
                {selectedComplaint && getStatusBadge(selectedComplaint.status)}
              </DialogTitle>
              <DialogDescription>
                ID: {selectedComplaint?.id} • Category: {selectedComplaint?.category} • Priority: {selectedComplaint?.priority}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Description */}
              <div>
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-sm text-gray-700">{selectedComplaint?.description}</p>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Created Date</p>
                  <p className="font-semibold">{selectedComplaint?.createdDate}</p>
                </div>
                <div>
                  <p className="text-gray-600">Last Updated</p>
                  <p className="font-semibold">{selectedComplaint?.updatedDate}</p>
                </div>
                <div>
                  <p className="text-gray-600">Assigned To</p>
                  <p className="font-semibold">{selectedComplaint?.assignedTo}</p>
                </div>
                {selectedComplaint?.resolvedDate && (
                  <div>
                    <p className="text-gray-600">Resolved Date</p>
                    <p className="font-semibold text-green-600">{selectedComplaint.resolvedDate}</p>
                  </div>
                )}
              </div>

              {/* Timeline */}
              <div>
                <h4 className="font-semibold mb-3">Status Timeline</h4>
                <div className="space-y-4">
                  {selectedComplaint?.timeline.map((item, index) => (
                    <div key={index} className="flex items-start">
                      <div className="flex flex-col items-center mr-4">
                        <div className={`h-3 w-3 rounded-full ${index === selectedComplaint.timeline.length - 1 ? "bg-blue-600" : "bg-green-600"}`} />
                        {index < selectedComplaint.timeline.length - 1 && (
                          <div className="w-0.5 h-12 bg-gray-300 my-1" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{item.status.replace("_", " ")}</p>
                        <p className="text-xs text-gray-600 mb-1">{item.date}</p>
                        <p className="text-sm text-gray-700">{item.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
