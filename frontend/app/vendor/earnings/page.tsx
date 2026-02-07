"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp, Calendar, Download, Building2 } from "lucide-react";

export default function VendorEarningsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<"THIS_MONTH" | "LAST_MONTH" | "THIS_YEAR">("THIS_MONTH");

  const earnings = {
    thisMonth: {
      gross: 234000,
      commission: 23400,
      net: 210600,
      orders: 156,
      avgOrderValue: 1500,
    },
    lastMonth: {
      gross: 218000,
      commission: 21800,
      net: 196200,
      orders: 145,
      avgOrderValue: 1503,
    },
    thisYear: {
      gross: 2450000,
      commission: 245000,
      net: 2205000,
      orders: 1634,
      avgOrderValue: 1500,
    },
  };

  const selectedData = earnings[selectedPeriod === "THIS_MONTH" ? "thisMonth" : selectedPeriod === "LAST_MONTH" ? "lastMonth" : "thisYear"];

  const breakdown = [
    { society: "Green Valley", orders: 156, gross: 234000, commission: 23400, net: 210600 },
    { society: "Sunrise Apartments", orders: 124, gross: 186000, commission: 22320, net: 163680 },
    { society: "Ocean View", orders: 62, gross: 93000, commission: 9300, net: 83700 },
  ];

  return (
    <DashboardLayout role="vendor" societyName="QuickFix Solutions" userName="Vendor Admin">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Earnings & Payouts</h1>
            <p className="text-gray-600">Track your revenue and commission details</p>
          </div>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
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

        {/* Main Earnings Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-700">
                <DollarSign className="h-5 w-5 mr-2" />
                Gross Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-blue-600 mb-2">
                ₹{(selectedData.gross / 1000).toFixed(1)}k
              </p>
              <p className="text-sm text-gray-600">Total service value</p>
            </CardContent>
          </Card>

          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center text-red-700">
                <TrendingUp className="h-5 w-5 mr-2" />
                Platform Commission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-red-600 mb-2">
                ₹{(selectedData.commission / 1000).toFixed(1)}k
              </p>
              <p className="text-sm text-gray-600">
                {((selectedData.commission / selectedData.gross) * 100).toFixed(1)}% of gross
              </p>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center text-green-700">
                <DollarSign className="h-5 w-5 mr-2" />
                Net Earnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-green-600 mb-2">
                ₹{(selectedData.net / 1000).toFixed(1)}k
              </p>
              <p className="text-sm text-gray-600">Your take-home</p>
            </CardContent>
          </Card>
        </div>

        {/* Additional Metrics */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Order Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Orders</span>
                  <span className="text-2xl font-bold">{selectedData.orders}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Order Value</span>
                  <span className="text-2xl font-bold text-blue-600">₹{selectedData.avgOrderValue}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Orders/Day (avg)</span>
                  <span className="text-2xl font-bold">
                    {selectedPeriod === "THIS_YEAR"
                      ? Math.floor(selectedData.orders / 365)
                      : Math.floor(selectedData.orders / 30)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Payout Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Next Payout</p>
                  <p className="text-2xl font-bold text-green-600">₹2,10,600</p>
                  <p className="text-xs text-gray-500 mt-1">Processing on: Feb 10, 2026</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Payout Details:</p>
                  <ul className="text-sm space-y-1">
                    <li>• Payouts processed on 10th of every month</li>
                    <li>• Direct bank transfer (2-3 business days)</li>
                    <li>• Includes all completed orders from previous month</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Society-wise Breakdown */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Earnings by Society (This Month)</h2>
          <div className="space-y-4">
            {breakdown.map((item, index) => (
              <Card key={index}>
                <CardContent className="py-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <Building2 className="h-8 w-8 text-purple-600" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{item.society}</h3>
                        <p className="text-sm text-gray-600">{item.orders} orders completed</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-8 text-center">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Gross</p>
                        <p className="font-semibold text-blue-600">₹{(item.gross / 1000).toFixed(0)}k</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Commission</p>
                        <p className="font-semibold text-red-600">-₹{(item.commission / 1000).toFixed(1)}k</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Net</p>
                        <p className="font-semibold text-green-600">₹{(item.net / 1000).toFixed(0)}k</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Monthly Trend */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Earnings Trend (Last 6 Months)</h2>
          <Card>
            <CardContent className="py-6">
              <div className="h-64 flex items-end justify-around space-x-2">
                {[
                  { month: "Sep", gross: 198000, net: 178200 },
                  { month: "Oct", gross: 205000, net: 184500 },
                  { month: "Nov", gross: 212000, net: 190800 },
                  { month: "Dec", gross: 218000, net: 196200 },
                  { month: "Jan", gross: 225000, net: 202500 },
                  { month: "Feb", gross: 234000, net: 210600 },
                ].map((data, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div className="w-full flex space-x-1 items-end h-48">
                      <div
                        className="flex-1 bg-blue-500 rounded-t"
                        style={{ height: `${(data.gross / 250000) * 100}%` }}
                        title={`Gross: ₹${data.gross}`}
                      />
                      <div
                        className="flex-1 bg-green-500 rounded-t"
                        style={{ height: `${(data.net / 250000) * 100}%` }}
                        title={`Net: ₹${data.net}`}
                      />
                    </div>
                    <p className="text-xs text-gray-600 mt-2">{data.month}</p>
                  </div>
                ))}
              </div>
              <div className="flex justify-center space-x-6 mt-6">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-500 rounded mr-2" />
                  <span className="text-sm">Gross Revenue</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded mr-2" />
                  <span className="text-sm">Net Earnings</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
