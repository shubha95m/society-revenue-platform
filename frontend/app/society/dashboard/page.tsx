import Link from "next/link";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  Package,
  Building2,
  FileText,
  Vote,
  MessageSquare,
} from "lucide-react";

export default function SocietyAdminDashboard() {
  return (
    <DashboardLayout role="society" societyName="Green Valley" userName="Admin">
      <div className="container mx-auto px-4 py-8">
        {/* Money First - Main Banner */}
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200 mb-8">
          <CardContent className="py-8">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">This Month's Achievement</p>
              <h2 className="text-5xl font-bold text-green-600 mb-2">
                ₹1,42,000 <span className="text-2xl text-gray-600">(47%)</span>
              </h2>
              <p className="text-lg text-gray-700 font-semibold mb-4">
                Maintenance Offset This Month
              </p>
              <p className="text-sm text-gray-600">
                Generated via vendor commissions, amenity rentals, and service marketplace
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Three Key Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Money In */}
          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center text-green-700">
                <TrendingUp className="h-5 w-5 mr-2" />
                Money In
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 mb-4">₹2,80,000</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Vendor commissions:</span>
                  <span className="font-semibold">₹1,10,000 (39%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amenity rentals:</span>
                  <span className="font-semibold">₹70,000 (25%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Maintenance collected:</span>
                  <span className="font-semibold">₹1,00,000 (36%)</span>
                </div>
              </div>
              <Badge className="mt-4 bg-green-100 text-green-700">↑ 12% vs last month</Badge>
            </CardContent>
          </Card>

          {/* Money Out */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center text-red-700">
                <TrendingDown className="h-5 w-5 mr-2" />
                Money Out
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600 mb-4">₹1,38,000</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Salaries:</span>
                  <span className="font-semibold">₹70,000 (51%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Utilities:</span>
                  <span className="font-semibold">₹40,000 (29%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Repairs:</span>
                  <span className="font-semibold">₹28,000 (20%)</span>
                </div>
              </div>
              <Badge className="mt-4 bg-green-100 text-green-700">↓ 5% vs last month</Badge>
            </CardContent>
          </Card>

          {/* Net Impact */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-700">
                <DollarSign className="h-5 w-5 mr-2" />
                Net Impact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600 mb-4">₹1,42,000</div>
              <div className="space-y-3">
                <div className="bg-white p-3 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Surplus this month</p>
                  <p className="text-lg font-semibold">Maintenance reduced by</p>
                  <p className="text-2xl font-bold text-green-600">₹473/flat</p>
                </div>
                <div className="text-sm">
                  <span className="text-gray-600">Year-to-date savings:</span>
                  <span className="font-semibold ml-2">₹9,80,000</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions Needed & Stats */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Actions Needed */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Actions Needed</span>
                <Badge variant="destructive">7</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-orange-600 mr-3" />
                    <div>
                      <p className="font-semibold">3 residents waiting approval</p>
                      <p className="text-sm text-gray-600">Pending verification</p>
                    </div>
                  </div>
                  <Button size="sm">Review</Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center">
                    <Package className="h-5 w-5 text-purple-600 mr-3" />
                    <div>
                      <p className="font-semibold">2 vendor requests pending</p>
                      <p className="text-sm text-gray-600">New partnership proposals</p>
                    </div>
                  </div>
                  <Button size="sm">Review</Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <Vote className="h-5 w-5 text-blue-600 mr-3" />
                    <div>
                      <p className="font-semibold">1 active vote</p>
                      <p className="text-sm text-gray-600">Solar panel installation - ending in 2 days</p>
                    </div>
                  </div>
                  <Button size="sm">View</Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-green-600 mr-3" />
                    <div>
                      <p className="font-semibold">1 expense proposal awaiting approval</p>
                      <p className="text-sm text-gray-600">Lift maintenance - ₹45,000</p>
                    </div>
                  </div>
                  <Button size="sm">Review</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resident Engagement */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Resident Engagement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">Active residents:</span>
                    <span className="font-semibold">78/120 (65%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: "65%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">Service adoption:</span>
                    <span className="font-semibold">52%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: "52%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">Voting participation:</span>
                    <span className="font-semibold">68%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: "68%" }} />
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600 mb-2">Top engagement drivers:</p>
                  <ul className="text-sm space-y-1">
                    <li>• Milk delivery service (89 active subscribers)</li>
                    <li>• Plumbing on-demand (45 bookings this month)</li>
                    <li>• Clubhouse bookings (12 events)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-4 gap-4">
          <Link href="/society/residents">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="py-6 text-center">
                <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <p className="font-semibold">Manage Residents</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/society/vendors">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="py-6 text-center">
                <Package className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <p className="font-semibold">Manage Vendors</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/society/ledger">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="py-6 text-center">
                <FileText className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <p className="font-semibold">Financial Ledger</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/society/reports">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="py-6 text-center">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                <p className="font-semibold">Reports & Analytics</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
