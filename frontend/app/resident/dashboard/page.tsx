import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TrendingDown,
  Home,
  Package,
  Vote,
  MessageSquare,
  Bell,
  DollarSign,
  Calendar,
} from "lucide-react";

export default function ResidentDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold">Society Revenue Platform</h1>
            <span className="text-sm text-gray-500">A-304 | Green Valley</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost">Profile</Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Savings Banner */}
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200 mb-8">
          <CardContent className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Your Potential Savings</p>
                <h2 className="text-3xl font-bold text-green-600 mb-2">
                  ₹380<span className="text-lg text-gray-600">/month</span>
                </h2>
                <p className="text-sm text-gray-600">
                  if adoption reaches 70% (currently at 52%)
                </p>
              </div>
              <TrendingDown className="h-16 w-16 text-green-600" />
            </div>
          </CardContent>
        </Card>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column - Flat Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Home className="h-5 w-5 mr-2" />
                Your Flat
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Flat Number:</span>
                <span className="font-semibold">A-304</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Building:</span>
                <span className="font-semibold">Tower A</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Current Maintenance:</span>
                <span className="font-semibold">₹2,500</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Due Date:</span>
                <span className="font-semibold text-orange-600">5th Jan 2026</span>
              </div>
              <div className="flex justify-between border-t pt-3">
                <span className="text-gray-600">Society Savings:</span>
                <span className="font-semibold text-green-600">₹473/flat</span>
              </div>
              <Button className="w-full" size="lg">
                Pay Maintenance
              </Button>
            </CardContent>
          </Card>

          {/* Middle Column - Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Link href="/resident/services">
                  <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center">
                    <Package className="h-6 w-6 mb-2" />
                    <span className="text-sm">Browse Services</span>
                  </Button>
                </Link>
                <Link href="/resident/amenities">
                  <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center">
                    <Calendar className="h-6 w-6 mb-2" />
                    <span className="text-sm">Book Amenity</span>
                  </Button>
                </Link>
                <Link href="/resident/votes">
                  <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center">
                    <Vote className="h-6 w-6 mb-2" />
                    <span className="text-sm">Active Votes</span>
                  </Button>
                </Link>
                <Link href="/resident/complaints">
                  <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center">
                    <MessageSquare className="h-6 w-6 mb-2" />
                    <span className="text-sm">Complaints</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Right Column - Savings Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                This Month's Savings
              </CardTitle>
              <CardDescription>How ₹473 was achieved</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Vendor commissions:</span>
                <span className="font-semibold text-green-600">₹190</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amenity rentals:</span>
                <span className="font-semibold text-green-600">₹145</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Utility optimization:</span>
                <span className="font-semibold text-green-600">₹138</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-lg">
                <span className="font-semibold">Total Savings:</span>
                <span className="font-bold text-green-600">₹473</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Votes */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Active Votes</CardTitle>
            <CardDescription>2 proposals need your attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">Should we hire ABC Plumbing Services?</h3>
                  <span className="text-sm text-orange-600 font-semibold">Ends in 2 days</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Impact: This will reduce maintenance by ₹120/flat/month
                </p>
                <div className="flex space-x-3">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    Vote Yes
                  </Button>
                  <Button size="sm" variant="outline">
                    Vote No
                  </Button>
                  <Button size="sm" variant="ghost">
                    View Details
                  </Button>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">Install solar panels on rooftop?</h3>
                  <span className="text-sm text-orange-600 font-semibold">Ends in 5 days</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Impact: Expected savings of ₹200/flat/month after 6 months
                </p>
                <div className="flex space-x-3">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    Vote Yes
                  </Button>
                  <Button size="sm" variant="outline">
                    Vote No
                  </Button>
                  <Button size="sm" variant="ghost">
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Notices */}
        <Card>
          <CardHeader>
            <CardTitle>Society Notices</CardTitle>
            <CardDescription>Latest 3 announcements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <div className="flex justify-between items-start">
                  <h4 className="font-semibold">Water Supply Interruption</h4>
                  <span className="text-xs text-gray-500">2 hours ago</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Water supply will be interrupted on 10th Jan from 10 AM to 2 PM for tank cleaning.
                </p>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <div className="flex justify-between items-start">
                  <h4 className="font-semibold">New Vendor Partnership - Milk Delivery</h4>
                  <span className="text-xs text-gray-500">1 day ago</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Fresh milk delivery service now available at 10% discount for society members.
                </p>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <div className="flex justify-between items-start">
                  <h4 className="font-semibold">Annual General Meeting</h4>
                  <span className="text-xs text-gray-500">3 days ago</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  AGM scheduled for 15th Jan at 6 PM in the clubhouse. All members requested to attend.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
