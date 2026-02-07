import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Star, TrendingDown, Search, ArrowLeft } from "lucide-react";

const services = [
  {
    id: 1,
    name: "Daily Milk Delivery",
    vendor: "Fresh Farms Dairy",
    category: "Daily Essentials",
    marketPrice: 60,
    societyPrice: 54,
    savings: 6,
    savingsPercent: 10,
    rating: 4.8,
    totalBookings: 156,
    image: "🥛",
  },
  {
    id: 2,
    name: "Newspaper Delivery",
    vendor: "Times Group",
    category: "Daily Essentials",
    marketPrice: 300,
    societyPrice: 270,
    savings: 30,
    savingsPercent: 10,
    rating: 4.6,
    totalBookings: 98,
    image: "📰",
  },
  {
    id: 3,
    name: "Plumbing Services",
    vendor: "QuickFix Solutions",
    category: "Home Maintenance",
    marketPrice: 500,
    societyPrice: 400,
    savings: 100,
    savingsPercent: 20,
    rating: 4.7,
    totalBookings: 45,
    image: "🔧",
  },
  {
    id: 4,
    name: "House Cleaning",
    vendor: "SparkleClean",
    category: "Home Services",
    marketPrice: 800,
    societyPrice: 680,
    savings: 120,
    savingsPercent: 15,
    rating: 4.9,
    totalBookings: 67,
    image: "🧹",
  },
  {
    id: 5,
    name: "Electrician Services",
    vendor: "BrightSpark Electric",
    category: "Home Maintenance",
    marketPrice: 600,
    societyPrice: 480,
    savings: 120,
    savingsPercent: 20,
    rating: 4.5,
    totalBookings: 34,
    image: "⚡",
  },
  {
    id: 6,
    name: "Grocery Delivery",
    vendor: "FreshMart",
    category: "Daily Essentials",
    marketPrice: 0,
    societyPrice: 0,
    savings: 50,
    savingsPercent: 5,
    rating: 4.4,
    totalBookings: 89,
    image: "🛒",
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Link href="/resident/dashboard" className="inline-flex items-center text-blue-600 hover:underline mb-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold">Service Marketplace</h1>
          <p className="text-gray-600">Browse society-approved services at discounted rates</p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Search & Filter */}
        <Card className="mb-8">
          <CardContent className="py-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search services..."
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline">All Categories</Button>
                <Button variant="outline">Sort by Savings</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card key={service.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-4xl">{service.image}</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    Save {service.savingsPercent}%
                  </Badge>
                </div>
                <CardTitle className="text-lg">{service.name}</CardTitle>
                <CardDescription>{service.vendor}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Pricing */}
                  {service.marketPrice > 0 && (
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Market Price:</span>
                        <span className="line-through text-gray-500">₹{service.marketPrice}</span>
                      </div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Society Price:</span>
                        <span className="font-semibold">₹{service.societyPrice}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-blue-200">
                        <span className="text-sm font-semibold text-green-600 flex items-center">
                          <TrendingDown className="h-4 w-4 mr-1" />
                          You Save
                        </span>
                        <span className="font-bold text-green-600">₹{service.savings}</span>
                      </div>
                    </div>
                  )}
                  {service.marketPrice === 0 && (
                    <div className="bg-blue-50 p-3 rounded-lg text-center">
                      <span className="text-sm font-semibold text-green-600">
                        Avg savings: ₹{service.savings}/order
                      </span>
                    </div>
                  )}

                  {/* Rating & Bookings */}
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center text-gray-600">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                      {service.rating} rating
                    </span>
                    <span className="text-gray-600">{service.totalBookings} bookings</span>
                  </div>

                  {/* CTA */}
                  <Link href={`/resident/services/${service.id}`}>
                    <Button className="w-full">
                      View Details & Book
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info Banner */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardContent className="py-6">
            <h3 className="font-semibold mb-2">Why use society-approved services?</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>✓ Pre-verified vendors with quality guarantee</li>
              <li>✓ Exclusive discounts negotiated by your society</li>
              <li>✓ Society earns commission on every booking</li>
              <li>✓ Priority support and faster resolution</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
