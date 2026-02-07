"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Bell, Search, Eye } from "lucide-react";

const notices = [
  {
    id: "NOT-001",
    title: "Water Supply Interruption",
    category: "MAINTENANCE",
    priority: "HIGH",
    content: "Water supply will be interrupted on 10th Jan from 10 AM to 2 PM for tank cleaning. Please store water in advance. The maintenance team will ensure minimal disruption.",
    createdDate: "2026-02-05",
    isRead: false,
  },
  {
    id: "NOT-002",
    title: "New Vendor Partnership - Milk Delivery",
    category: "ANNOUNCEMENT",
    priority: "MEDIUM",
    content: "We're excited to partner with Fresh Farms Dairy. Residents can now get fresh milk delivery at 10% discount. Visit the Services section to subscribe.",
    createdDate: "2026-02-04",
    isRead: true,
  },
  {
    id: "NOT-003",
    title: "Annual General Meeting",
    category: "EVENT",
    priority: "HIGH",
    content: "AGM scheduled for 15th Jan at 6 PM in the clubhouse. All members are requested to attend. Agenda: Financial review, vendor proposals, and society improvements.",
    createdDate: "2026-02-02",
    isRead: true,
  },
  {
    id: "NOT-004",
    title: "Maintenance Dues Reminder",
    category: "ALERT",
    priority: "HIGH",
    content: "This is a reminder that maintenance dues for February 2026 are due by 5th Feb. Please clear any pending payments to avoid late fees.",
    createdDate: "2026-01-31",
    isRead: true,
  },
  {
    id: "NOT-005",
    title: "Clubhouse Available for Booking",
    category: "ANNOUNCEMENT",
    priority: "LOW",
    content: "The society clubhouse is now available for booking. Residents can book the clubhouse for events at discounted rates. Visit Amenities section.",
    createdDate: "2026-01-28",
    isRead: true,
  },
];

export default function ResidentNoticesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNotice, setSelectedNotice] = useState<typeof notices[0] | null>(null);

  const filteredNotices = notices.filter((notice) =>
    notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notice.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notice.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const unreadCount = notices.filter((n) => !n.isRead).length;

  return (
    <DashboardLayout role="resident" societyName="Green Valley" userName="John Doe">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <h1 className="text-3xl font-bold">Society Notices</h1>
            {unreadCount > 0 && (
              <Badge className="bg-red-500">
                {unreadCount} New
              </Badge>
            )}
          </div>
          <p className="text-gray-600">Important updates and announcements from society</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
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
                <p className="text-sm text-gray-600 mb-1">Unread</p>
                <p className="text-3xl font-bold text-red-600">{unreadCount}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">This Month</p>
                <p className="text-3xl font-bold">{notices.filter(n => n.createdDate.startsWith("2026-02")).length}</p>
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
                placeholder="Search notices..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notices List */}
        <div className="space-y-4">
          {filteredNotices.map((notice) => (
            <Card
              key={notice.id}
              className={`hover:shadow-lg transition-shadow cursor-pointer border-l-4 ${getCategoryColor(notice.category)} ${!notice.isRead ? "bg-blue-50" : ""}`}
              onClick={() => setSelectedNotice(notice)}
            >
              <CardContent className="py-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {!notice.isRead && <Bell className="h-5 w-5 text-blue-600" />}
                      <h3 className="text-lg font-semibold">{notice.title}</h3>
                      {getPriorityBadge(notice.priority)}
                      <Badge variant="outline">{notice.category}</Badge>
                    </div>
                    <p className="text-sm text-gray-700 mb-3 line-clamp-2">{notice.content}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-600">
                      <span>Posted: {notice.createdDate}</span>
                      <span>•</span>
                      <span className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        Click to read full notice
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredNotices.length === 0 && (
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-gray-500">
                <Bell className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No notices found matching your search</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notice Detail Modal */}
        <Dialog open={!!selectedNotice} onOpenChange={() => setSelectedNotice(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-3">
                <span>{selectedNotice?.title}</span>
                {selectedNotice && getPriorityBadge(selectedNotice.priority)}
              </DialogTitle>
              <DialogDescription>
                Category: {selectedNotice?.category} • Posted: {selectedNotice?.createdDate}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-800 leading-relaxed">{selectedNotice?.content}</p>
              </div>

              <div className="text-sm text-gray-600">
                <p>This notice was posted by Society Administration.</p>
                <p>For any questions, please contact the society office.</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
