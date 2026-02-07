"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { TrendingUp, TrendingDown, Download, Filter, Search } from "lucide-react";

const transactions = [
  {
    id: "TXN-2026-001",
    date: "2026-02-05",
    type: "INCOME",
    category: "Vendor Commission",
    description: "Commission from Fresh Farms Dairy - Milk Delivery (156 orders)",
    amount: 23400,
    vendor: "Fresh Farms Dairy",
  },
  {
    id: "TXN-2026-002",
    date: "2026-02-04",
    type: "INCOME",
    category: "Amenity Rental",
    description: "Clubhouse booking by Resident A-205 for birthday party",
    amount: 2000,
    resident: "A-205",
  },
  {
    id: "TXN-2026-003",
    date: "2026-02-03",
    type: "EXPENSE",
    category: "Salary",
    description: "Monthly salary - Security Guard (Ramesh Kumar)",
    amount: 18000,
    staff: "Ramesh Kumar",
  },
  {
    id: "TXN-2026-004",
    date: "2026-02-03",
    type: "INCOME",
    category: "Maintenance",
    description: "Maintenance collection - Flat A-304",
    amount: 2500,
    resident: "A-304",
  },
  {
    id: "TXN-2026-005",
    date: "2026-02-02",
    type: "EXPENSE",
    category: "Utility",
    description: "Electricity bill for common areas - January 2026",
    amount: 35000,
    utility: "MSEB",
  },
  {
    id: "TXN-2026-006",
    date: "2026-02-01",
    type: "INCOME",
    category: "Vendor Commission",
    description: "Commission from QuickFix Plumbing (45 bookings)",
    amount: 18000,
    vendor: "QuickFix Solutions",
  },
  {
    id: "TXN-2026-007",
    date: "2026-01-31",
    type: "EXPENSE",
    category: "Repair",
    description: "Lift maintenance - Tower B",
    amount: 28000,
    contractor: "Elite Elevators",
  },
  {
    id: "TXN-2026-008",
    date: "2026-01-30",
    type: "INCOME",
    category: "Amenity Rental",
    description: "Swimming pool membership fees - January",
    amount: 15000,
  },
  {
    id: "TXN-2026-009",
    date: "2026-01-29",
    type: "EXPENSE",
    category: "Salary",
    description: "Monthly salary - Housekeeping staff (3 members)",
    amount: 42000,
  },
  {
    id: "TXN-2026-010",
    date: "2026-01-28",
    type: "INCOME",
    category: "Vendor Commission",
    description: "Commission from Daily Essentials Vendor",
    amount: 12600,
    vendor: "Daily Essentials Co.",
  },
];

export default function FinancialLedgerPage() {
  const [filterType, setFilterType] = useState<"ALL" | "INCOME" | "EXPENSE">("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTransactions = transactions.filter((txn) => {
    const matchesType = filterType === "ALL" || txn.type === filterType;
    const matchesSearch =
      txn.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const totalIncome = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpense;

  const getTypeBadge = (type: string) => {
    return type === "INCOME" ? (
      <Badge className="bg-green-100 text-green-700">Income</Badge>
    ) : (
      <Badge className="bg-red-100 text-red-700">Expense</Badge>
    );
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Vendor Commission": "text-purple-600",
      "Amenity Rental": "text-blue-600",
      "Maintenance": "text-green-600",
      "Salary": "text-orange-600",
      "Utility": "text-yellow-600",
      "Repair": "text-red-600",
    };
    return colors[category] || "text-gray-600";
  };

  return (
    <DashboardLayout role="society" societyName="Green Valley" userName="Admin">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Financial Ledger</h1>
            <p className="text-gray-600">Complete financial transaction history</p>
          </div>
          <Button className="flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="py-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Total Income</p>
                <p className="text-3xl font-bold text-green-600">
                  ₹{(totalIncome / 1000).toFixed(1)}k
                </p>
                <p className="text-xs text-gray-500 mt-1">This month</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="py-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Total Expense</p>
                <p className="text-3xl font-bold text-red-600">
                  ₹{(totalExpense / 1000).toFixed(1)}k
                </p>
                <p className="text-xs text-gray-500 mt-1">This month</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="py-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Net Balance</p>
                <p className={`text-3xl font-bold ${netBalance >= 0 ? "text-green-600" : "text-red-600"}`}>
                  ₹{(netBalance / 1000).toFixed(1)}k
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {netBalance >= 0 ? "Surplus" : "Deficit"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="py-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Transactions</p>
                <p className="text-3xl font-bold">{transactions.length}</p>
                <p className="text-xs text-gray-500 mt-1">This month</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="py-4">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-600" />
                <span className="text-sm font-semibold">Filter:</span>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant={filterType === "ALL" ? "default" : "outline"}
                    onClick={() => setFilterType("ALL")}
                  >
                    All
                  </Button>
                  <Button
                    size="sm"
                    variant={filterType === "INCOME" ? "default" : "outline"}
                    onClick={() => setFilterType("INCOME")}
                    className={filterType === "INCOME" ? "bg-green-600 hover:bg-green-700" : ""}
                  >
                    Income
                  </Button>
                  <Button
                    size="sm"
                    variant={filterType === "EXPENSE" ? "default" : "outline"}
                    onClick={() => setFilterType("EXPENSE")}
                    className={filterType === "EXPENSE" ? "bg-red-600 hover:bg-red-700" : ""}
                  >
                    Expense
                  </Button>
                </div>
              </div>

              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search transactions..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transactions List */}
        <Card>
          <CardHeader>
            <CardTitle>
              Transactions ({filteredTransactions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredTransactions.map((txn) => (
                <div
                  key={txn.id}
                  className="flex items-start justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-semibold">{txn.description}</h4>
                      {getTypeBadge(txn.type)}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>ID: {txn.id}</span>
                      <span>•</span>
                      <span>{txn.date}</span>
                      <span>•</span>
                      <span className={getCategoryColor(txn.category)}>
                        {txn.category}
                      </span>
                    </div>
                    {(txn.vendor || txn.resident || txn.staff) && (
                      <p className="text-xs text-gray-500 mt-1">
                        {txn.vendor && `Vendor: ${txn.vendor}`}
                        {txn.resident && `Resident: ${txn.resident}`}
                        {txn.staff && `Staff: ${txn.staff}`}
                      </p>
                    )}
                  </div>
                  <div className="text-right ml-4">
                    <div className="flex items-center">
                      {txn.type === "INCOME" ? (
                        <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                      )}
                      <span
                        className={`text-xl font-bold ${
                          txn.type === "INCOME" ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {txn.type === "INCOME" ? "+" : "-"}₹{txn.amount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredTransactions.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No transactions found matching your filters</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
