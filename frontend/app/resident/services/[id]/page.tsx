"use client";

import { useState } from "react";
import { use } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, Star, TrendingDown, CheckCircle, Clock, MapPin } from "lucide-react";
import { toast } from "sonner";

const services = {
  "1": {
    id: "1",
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
    description: "Get farm-fresh milk delivered to your doorstep every morning before 7 AM. Our milk is sourced from local dairy farms and tested for quality daily.",
    features: [
      "Fresh milk delivered by 7 AM",
      "Quality tested daily",
      "Sourced from local farms",
      "Flexible subscription (daily, alternate days, weekly)",
      "Easy pause/resume",
    ],
    sla: "Delivery before 7 AM, 7 days a week",
    reviews: [
      { name: "Priya S.", flat: "A-205", rating: 5, comment: "Best milk quality! Never missed a delivery.", date: "2 days ago" },
      { name: "Raj M.", flat: "B-301", rating: 5, comment: "Very fresh and timely delivery.", date: "5 days ago" },
      { name: "Anita K.", flat: "A-102", rating: 4, comment: "Good service, wish they had more variety.", date: "1 week ago" },
    ],
  },
  "3": {
    id: "3",
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
    description: "Professional plumbing services for all your needs. From emergency repairs to installations, our experienced plumbers are available 24/7.",
    features: [
      "24/7 emergency service",
      "2-hour response time guarantee",
      "Experienced and certified plumbers",
      "All spare parts included",
      "90-day warranty on repairs",
    ],
    sla: "Response within 2 hours for emergency, same-day for regular bookings",
    reviews: [
      { name: "Suresh R.", flat: "C-404", rating: 5, comment: "Fixed my leaking tap within an hour! Very professional.", date: "1 day ago" },
      { name: "Meena D.", flat: "A-301", rating: 4, comment: "Good work, but took a bit longer than expected.", date: "3 days ago" },
      { name: "Vikram P.", flat: "B-205", rating: 5, comment: "Excellent service. Very reasonable pricing.", date: "1 week ago" },
    ],
  },
};

export default function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const service = services[id as keyof typeof services];
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingType, setBookingType] = useState<"oneTime" | "subscription">("oneTime");

  if (!service) {
    return <div>Service not found</div>;
  }

  const handleBooking = () => {
    toast.success("Booking Confirmed!", {
      description: `Your ${service.name} booking has been confirmed. The vendor will contact you shortly.`,
    });
    setShowBookingForm(false);
  };

  return (
    <DashboardLayout role="resident" societyName="Green Valley" userName="John Doe">
      <div className="container mx-auto px-4 py-8">
        <Link href="/resident/services" className="inline-flex items-center text-blue-600 hover:underline mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Services
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Service Header */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <span className="text-6xl">{service.image}</span>
                    <div>
                      <h1 className="text-3xl font-bold mb-2">{service.name}</h1>
                      <p className="text-gray-600 mb-2">By {service.vendor}</p>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                          {service.rating} rating
                        </span>
                        <span className="text-gray-600">{service.totalBookings} bookings</span>
                        <Badge>{service.category}</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Pricing */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Market Price</p>
                      <p className="text-2xl line-through text-gray-500">₹{service.marketPrice}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Society Price</p>
                      <p className="text-3xl font-bold text-blue-600">₹{service.societyPrice}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center pt-3 border-t border-blue-200">
                    <TrendingDown className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-lg font-semibold text-green-600">
                      You Save ₹{service.savings} ({service.savingsPercent}%)
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About This Service</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{service.description}</p>
                <h4 className="font-semibold mb-2">What's Included:</h4>
                <ul className="space-y-2">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* SLA */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Service Level Agreement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{service.sla}</p>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardHeader>
                <CardTitle>Resident Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {service.reviews.map((review, index) => (
                    <div key={index} className="border-b last:border-0 pb-4 last:pb-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold">{review.name}</p>
                          <p className="text-sm text-gray-600">{review.flat}</p>
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                          <span className="font-semibold">{review.rating}</span>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-1">{review.comment}</p>
                      <p className="text-xs text-gray-500">{review.date}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Book This Service</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">You'll Save</p>
                  <p className="text-3xl font-bold text-green-600">₹{service.savings}</p>
                  <p className="text-sm text-gray-600">compared to market rate</p>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => setShowBookingForm(true)}
                >
                  Book Now
                </Button>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 inline text-green-600 mr-1" />
                    Society-approved vendor
                  </p>
                  <p className="text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 inline text-green-600 mr-1" />
                    {service.totalBookings}+ happy customers
                  </p>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2 text-sm">Why book through society?</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>✓ Pre-verified vendor</li>
                    <li>✓ Exclusive discount</li>
                    <li>✓ Priority support</li>
                    <li>✓ Society earns commission</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Booking Form Modal */}
        <Dialog open={showBookingForm} onOpenChange={setShowBookingForm}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Book {service.name}</DialogTitle>
              <DialogDescription>
                Fill in the details below to complete your booking
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Booking Type */}
              <div>
                <Label>Booking Type</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <Button
                    variant={bookingType === "oneTime" ? "default" : "outline"}
                    onClick={() => setBookingType("oneTime")}
                    className="h-auto py-3"
                  >
                    <div className="text-center">
                      <p className="font-semibold">One-Time</p>
                      <p className="text-xs">Single service</p>
                    </div>
                  </Button>
                  <Button
                    variant={bookingType === "subscription" ? "default" : "outline"}
                    onClick={() => setBookingType("subscription")}
                    className="h-auto py-3"
                  >
                    <div className="text-center">
                      <p className="font-semibold">Subscription</p>
                      <p className="text-xs">Recurring</p>
                    </div>
                  </Button>
                </div>
              </div>

              {/* Date/Time */}
              {bookingType === "oneTime" && (
                <>
                  <div>
                    <Label htmlFor="date">Preferred Date</Label>
                    <Input id="date" type="date" />
                  </div>
                  <div>
                    <Label htmlFor="time">Preferred Time</Label>
                    <Input id="time" type="time" />
                  </div>
                </>
              )}

              {bookingType === "subscription" && (
                <div>
                  <Label htmlFor="frequency">Frequency</Label>
                  <select id="frequency" className="w-full border rounded-md p-2">
                    <option>Daily</option>
                    <option>Alternate Days</option>
                    <option>Weekly</option>
                  </select>
                </div>
              )}

              {/* Special Instructions */}
              <div>
                <Label htmlFor="instructions">Special Instructions (Optional)</Label>
                <Textarea
                  id="instructions"
                  placeholder="Any specific requirements or notes for the vendor..."
                  rows={3}
                />
              </div>

              {/* Price Summary */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Service Price:</span>
                  <span className="font-semibold">₹{service.societyPrice}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span className="text-sm">You Save:</span>
                  <span className="font-semibold">₹{service.savings}</span>
                </div>
              </div>

              {/* Submit */}
              <Button className="w-full" size="lg" onClick={handleBooking}>
                Confirm Booking
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
