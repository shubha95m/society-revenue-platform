import Link from "next/link";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Building2,
  TrendingUp,
  DollarSign,
  Package,
  Star,
  CheckCircle,
  Clock,
} from "lucide-react";

export default function VendorDashboard() {
  return (
    <DashboardLayout role="vendor" societyName="QuickFix Solutions" userName="Vendor Admin">
      <div className="container mx-auto px-4 py-8">
        {/* Scale Banner */}
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 mb-8">
          <CardContent className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Your Current Reach</p>
                <h2 className="text-3xl font-bold text-purple-600 mb-2">
                  3 societies, 426 households
                </h2>
                <p className="text-sm text-gray-600">
                  <TrendingUp className="h-4 w-4 inline mr-1 text-green-600" />
                  12% growth in orders this month
                </p>
              </div>
              <Building2 className="h-16 w-16 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">342</div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <Badge className="mt-2 bg-green-100 text-green-700">+12%</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Commission Earned</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹34,500</div>
              <p className="text-sm text-gray-600">After deductions</p>
              <Badge className="mt-2 bg-green-100 text-green-700">+8%</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Average Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold flex items-center">
                4.7
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 ml-1" />
              </div>
              <p className="text-sm text-gray-600">From 215 reviews</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">SLA Compliance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">96%</div>
              <p className="text-sm text-gray-600">On-time completion</p>
              <Badge className="mt-2 bg-green-100 text-green-700">Excellent</Badge>
            </CardContent>
          </Card>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Pending Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Pending Orders
                </span>
                <Badge variant="destructive">5 New</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold">Plumbing Repair</h4>
                      <p className="text-sm text-gray-600">Green Valley - A-304</p>
                    </div>
                    <Badge className="bg-orange-100 text-orange-700">Pending</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Kitchen sink leaking issue. Needs immediate attention.
                  </p>
                  <div className="flex space-x-2">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Accept
                    </Button>
                    <Button size="sm" variant="outline">
                      Reject
                    </Button>
                    <Button size="sm" variant="ghost">
                      Details
                    </Button>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold">Bathroom Faucet Installation</h4>
                      <p className="text-sm text-gray-600">Sunrise Apartments - B-102</p>
                    </div>
                    <Badge className="bg-orange-100 text-orange-700">Pending</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    New faucet installation in master bathroom.
                  </p>
                  <div className="flex space-x-2">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Accept
                    </Button>
                    <Button size="sm" variant="outline">
                      Reject
                    </Button>
                    <Button size="sm" variant="ghost">
                      Details
                    </Button>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  View All Orders
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Active Contracts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="h-5 w-5 mr-2" />
                Active Contracts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold">Green Valley Apartments</h4>
                      <p className="text-sm text-gray-600">120 flats • Mumbai</p>
                    </div>
                    <Badge className="bg-green-100 text-green-700">Active</Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Commission:</span>
                      <span className="font-semibold">10%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Orders this month:</span>
                      <span className="font-semibold">156</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rating:</span>
                      <span className="font-semibold flex items-center">
                        4.8 <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 ml-1" />
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold">Sunrise Apartments</h4>
                      <p className="text-sm text-gray-600">180 flats • Mumbai</p>
                    </div>
                    <Badge className="bg-green-100 text-green-700">Active</Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Commission:</span>
                      <span className="font-semibold">12%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Orders this month:</span>
                      <span className="font-semibold">124</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rating:</span>
                      <span className="font-semibold flex items-center">
                        4.6 <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 ml-1" />
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold">Ocean View Residency</h4>
                      <p className="text-sm text-gray-600">96 flats • Mumbai</p>
                    </div>
                    <Badge className="bg-green-100 text-green-700">Active</Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Commission:</span>
                      <span className="font-semibold">10%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Orders this month:</span>
                      <span className="font-semibold">62</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rating:</span>
                      <span className="font-semibold flex items-center">
                        4.7 <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 ml-1" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Discover New Societies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Discover New Societies</span>
              <Button>Search Societies</Button>
            </CardTitle>
            <CardDescription>
              3 new societies in your area match your services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">Palm Grove Society</h4>
                <p className="text-sm text-gray-600 mb-3">
                  200 flats • Andheri West, Mumbai
                </p>
                <Button variant="outline" className="w-full" size="sm">
                  Send Connection Request
                </Button>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">Royal Heights</h4>
                <p className="text-sm text-gray-600 mb-3">
                  150 flats • Bandra East, Mumbai
                </p>
                <Button variant="outline" className="w-full" size="sm">
                  Send Connection Request
                </Button>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">Lakeside Apartments</h4>
                <p className="text-sm text-gray-600 mb-3">
                  180 flats • Powai, Mumbai
                </p>
                <Button variant="outline" className="w-full" size="sm">
                  Send Connection Request
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
