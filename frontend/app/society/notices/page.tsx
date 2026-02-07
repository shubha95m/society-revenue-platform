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
import { Bell, Plus, Edit, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";

const notices = [
  {
    id: "NOT-001",
    title: "Water Supply Interruption",
    category: "MAINTENANCE",
    priority: "HIGH",
    content: "Water supply will be interrupted on 10th Jan from 10 AM to 2 PM for tank cleaning. Please store water in advance.",
    createdBy: "Admin",
    createdDate: "2026-02-05",
    status: "PUBLISHED",
    views: 89,
  },
  {
    id: "NOT-002",
    title: "New Vendor Partnership - Milk Delivery",
    category: "ANNOUNCEMENT",
    priority: "MEDIUM",
    content: "We're excited to partner with Fresh Farms Dairy. Residents can now get fresh milk delivery at 10% discount.",
    createdBy: "Admin",
    createdDate: "2026-02-04",
    status: "PUBLISHED",
    views: 102,
  },
  {
    id: "NOT-003",
    title: "Annual General Meeting",
    category: "EVENT",
    priority: "HIGH",
    content: "AGM scheduled for 15th Jan at 6 PM in the clubhouse. All members are requested to attend. Agenda: Financial review, vendor proposals, and society improvements.",
    createdBy: "Admin",
    createdDate: "2026-02-02",
    status: "PUBLISHED",
    views: 95,
  },
  {
    id: "NOT-004",
    title: "Clubhouse Renovation Update",
    category: "ANNOUNCEMENT",
    priority: "LOW",
    content: "Clubhouse renovation work will begin next week. Expected completion in 15 days.",
    createdBy: "Admin",
    createdDate: "2026-02-01",
    status: "DRAFT",
    views: 0,
  },
];

export default function SocietyNoticesPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<typeof notices[0] | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "ANNOUNCEMENT",
    priority: "MEDIUM",
    content: "",
  });

  const handleCreateNotice = () => {
    if (!formData.title || !formData.content) {
      toast.error("Missing Information", {
        description: "Please fill in title and content.",
      });
      return;
    }

    toast.success("Notice Published!", {
      description: "Notice has been sent to all residents.",
    });
    setShowCreateForm(false);
    setFormData({ title: "", category: "ANNOUNCEMENT", priority: "MEDIUM", content: "" });
  };

  const handleDelete = (notice: typeof notices[0]) => {
    toast.success("Notice Deleted", {
      description: `${notice.title} has been deleted.`,
    });
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      PUBLISHED: <Badge className="bg-green-100 text-green-700">Published</Badge>,
      DRAFT: <Badge className="bg-gray-100 text-gray-700">Draft</Badge>,
      ARCHIVED: <Badge className="bg-blue-100 text-blue-700">Archived</Badge>,
    };
    return badges[status as keyof typeof badges];
  };

  const getPriorityBadge = (priority: string) => {
    const badges = {
      HIGH: <Badge variant="outline" className="border-red-300 text-red-700">High Priority</Badge>,
      MEDIUM: <Badge variant="outline" className="border-yellow-300 text-yellow-700">Medium</Badge>,
      LOW: <Badge variant="outline" className="border-green-300 text-green-700">Low</Badge>,
    };
    return badges[priority as keyof typeof badges];
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      MAINTENANCE: "border-l-orange-500",
      ANNOUNCEMENT: "border-l-blue-500",
      EVENT: "border-l-purple-500",
      ALERT: "border-l-red-500",
    };
    return colors[category] || "border-l-gray-500";
  };

  const publishedNotices = notices.filter((n) => n.status === "PUBLISHED");
  const draftNotices = notices.filter((n) => n.status === "DRAFT");

  return (
    <DashboardLayout role="society" societyName="Green Valley" userName="Admin">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Society Notices</h1>
            <p className="text-gray-600">Create and manage notices for residents</p>
          </div>
          <Button onClick={() => setShowCreateForm(true)} className="flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Create Notice
          </Button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="py-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Total Notices</p>
                <p className="text-3xl font-bold">{notices.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Published</p>
                <p className="text-3xl font-bold text-green-600">{publishedNotices.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Drafts</p>
                <p className="text-3xl font-bold text-gray-600">{draftNotices.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Total Views</p>
                <p className="text-3xl font-bold">{notices.reduce((sum, n) => sum + n.views, 0)}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Published Notices */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Published Notices</h2>
          <div className="space-y-4">
            {publishedNotices.map((notice) => (
              <Card key={notice.id} className={`hover:shadow-lg transition-shadow border-l-4 ${getCategoryColor(notice.category)}`}>
                <CardContent className="py-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold">{notice.title}</h3>
                        {getStatusBadge(notice.status)}
                        {getPriorityBadge(notice.priority)}
                      </div>
                      <p className="text-sm text-gray-700 mb-3">{notice.content}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-600">
                        <span>Category: {notice.category}</span>
                        <span>•</span>
                        <span>Created: {notice.createdDate}</span>
                        <span>•</span>
                        <span className="flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          {notice.views} views
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <Button size="sm" variant="outline" onClick={() => setSelectedNotice(notice)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(notice)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Draft Notices */}
        {draftNotices.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Drafts</h2>
            <div className="space-y-4">
              {draftNotices.map((notice) => (
                <Card key={notice.id} className="hover:shadow-lg transition-shadow opacity-75">
                  <CardContent className="py-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold">{notice.title}</h3>
                          {getStatusBadge(notice.status)}
                        </div>
                        <p className="text-sm text-gray-700 mb-3">{notice.content}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-600">
                          <span>Category: {notice.category}</span>
                          <span>•</span>
                          <span>Created: {notice.createdDate}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <Button size="sm" onClick={() => setSelectedNotice(notice)}>
                          Publish
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setSelectedNotice(notice)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(notice)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Create Notice Form */}
        <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Notice</DialogTitle>
              <DialogDescription>
                This notice will be sent to all residents
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Notice Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter notice title"
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
                    <option value="ANNOUNCEMENT">Announcement</option>
                    <option value="MAINTENANCE">Maintenance</option>
                    <option value="EVENT">Event</option>
                    <option value="ALERT">Alert</option>
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
                <Label htmlFor="content">Notice Content *</Label>
                <Textarea
                  id="content"
                  placeholder="Enter the full notice content..."
                  rows={6}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                />
              </div>

              <div className="flex space-x-3">
                <Button className="flex-1" size="lg" onClick={handleCreateNotice}>
                  <Bell className="h-4 w-4 mr-2" />
                  Publish Notice
                </Button>
                <Button variant="outline" className="flex-1" size="lg" onClick={handleCreateNotice}>
                  Save as Draft
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
