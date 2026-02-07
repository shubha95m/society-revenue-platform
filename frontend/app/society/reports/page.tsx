"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Download, Calendar, DollarSign, Users, Package } from "lucide-react";

export default function SocietyReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<"THIS_MONTH" | "LAST_MONTH" | "THIS_YEAR">("THIS_MONTH");

  return (
    <DashboardLayout role="society" societyName="Green Valley" userName="Admin">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Reports & Analytics</h1>
            <p className="text-gray-600">Financial reports and performance metrics</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Custom Date Range
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>

        {/* Period Selector */}
        <div className="flex space-x-2 mb-8">
          <Button
            variant={selectedPeriod === "THIS_MONTH" ? "default" : "outline"}
            onClick={() => setSelectedPeriod("THIS_MONTH")}
          >
            This Month
          </Button>
          <Button
            variant={selectedPeriod === "LAST_MONTH" ? "default" : "outline"}
            onClick={() => setSelectedPeriod("LAST_MONTH")}
          >
            Last Month
          </Button>
          <Button
            variant={selectedPeriod === "THIS_YEAR" ? "default" : "outline"}
            onClick={() => setSelectedPeriod("THIS_YEAR")}
          >
            This Year
          </Button>
        </div>

        {/* Financial Overview */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Financial Overview</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center text-green-700">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Total Income
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-green-600 mb-4">₹2,80,000</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Vendor Commissions:</span>
                    <span className="font-semibold">₹1,10,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amenity Rentals:</span>
                    <span className="font-semibold">₹70,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Maintenance:</span>
                    <span className="font-semibold">₹1,00,000</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center text-red-700">
                  <TrendingDown className="h-5 w-5 mr-2" />
                  Total Expenses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-red-600 mb-4">₹1,38,000</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Salaries:</span>
                    <span className="font-semibold">₹70,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Utilities:</span>
                    <span className="font-semibold">₹40,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Repairs:</span>
                    <span className="font-semibold">₹28,000</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-700">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Net Surplus
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-blue-600 mb-4">₹1,42,000</p>
                <div className="space-y-2">
                  <div className="bg-white p-3 rounded-lg">
                    <p className="text-sm text-gray-600">Per Flat Savings</p>
                    <p className="text-2xl font-bold text-green-600">₹473</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Vendor Performance */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Top Performing Vendors</h2>
          <Card>
            <CardContent className="py-6">
              <div className="space-y-4">
                {[
                  { name: "Fresh Farms Dairy", orders: 156, revenue: 234000, commission: 23400 },
                  { name: "QuickFix Plumbing", orders: 45, revenue: 180000, commission: 27000 },
                  { name: "Daily Essentials", orders: 78, revenue: 126000, commission: 10080 },
                ].map((vendor, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold">{vendor.name}</h4>
                      <p className="text-sm text-gray-600">{vendor.orders} orders</p>
                    </div>
                    <div className="text-right mr-8">
                      <p className="text-sm text-gray-600">Revenue</p>
                      <p className="font-semibold">₹{(vendor.revenue / 1000).toFixed(0)}k</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Commission</p>
                      <p className="font-semibold text-green-600">₹{(vendor.commission / 1000).toFixed(1)}k</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resident Engagement */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Resident Engagement</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Participation Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">Active Residents</span>
                      <span className="font-semibold">78/120 (65%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-blue-600 h-3 rounded-full" style={{ width: "65%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">Service Adoption</span>
                      <span className="font-semibold">52%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-green-600 h-3 rounded-full" style={{ width: "52%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">Voting Participation</span>
                      <span className="font-semibold">68%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-purple-600 h-3 rounded-full" style={{ width: "68%" }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Most Popular Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { service: "Milk Delivery", users: 89, percentage: 74 },
                    { service: "Plumbing On-Demand", users: 45, percentage: 38 },
                    { service: "Grocery Delivery", users: 38, percentage: 32 },
                  ].map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-semibold">{item.service}</span>
                        <span className="text-sm text-gray-600">{item.users} users</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: `${item.percentage}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Monthly Trend */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Monthly Trend (Last 6 Months)</h2>
          <Card>
            <CardContent className="py-6">
              <div className="h-64 flex items-end justify-around space-x-2">
                {[
                  { month: "Sep", income: 240000, expense: 150000 },
                  { month: "Oct", income: 255000, expense: 145000 },
                  { month: "Nov", income: 268000, expense: 142000 },
                  { month: "Dec", income: 275000, expense: 140000 },
                  { month: "Jan", income: 280000, expense: 138000 },
                  { month: "Feb", income: 280000, expense: 138000 },
                ].map((data, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div className="w-full flex space-x-1 items-end h-48">
                      <div
                        className="flex-1 bg-green-500 rounded-t"
                        style={{ height: `${(data.income / 300000) * 100}%` }}
                        title={`Income: ₹${data.income}`}
                      />
                      <div
                        className="flex-1 bg-red-500 rounded-t"
                        style={{ height: `${(data.expense / 300000) * 100}%` }}
                        title={`Expense: ₹${data.expense}`}
                      />
                    </div>
                    <p className="text-xs text-gray-600 mt-2">{data.month}</p>
                  </div>
                ))}
              </div>
              <div className="flex justify-center space-x-6 mt-6">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded mr-2" />
                  <span className="text-sm">Income</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-500 rounded mr-2" />
                  <span className="text-sm">Expense</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
