"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, Clock, MapPin, Users, Dumbbell, Waves, UtensilsCrossed, PartyPopper, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const amenities = [
  {
    id: "1",
    name: "Clubhouse",
    icon: "🏛️",
    description: "Multi-purpose hall for events and gatherings",
    capacity: "100 people",
    price: "₹2,000/day",
    availableSlots: ["Morning (9 AM - 1 PM)", "Evening (5 PM - 10 PM)", "Full Day (9 AM - 10 PM)"],
    features: ["Air Conditioned", "Audio System", "Projector", "Kitchen Access", "Parking"],
  },
  {
    id: "2",
    name: "Swimming Pool",
    icon: "🏊",
    description: "Olympic-size swimming pool with separate kids section",
    capacity: "50 people",
    price: "Free for residents",
    availableSlots: ["Morning (6 AM - 9 AM)", "Evening (5 PM - 9 PM)"],
    features: ["Life Guard", "Changing Rooms", "Lockers", "Pool Equipment"],
  },
  {
    id: "3",
    name: "Gymnasium",
    icon: "💪",
    description: "Fully equipped modern gym with cardio and strength equipment",
    capacity: "30 people",
    price: "Free for residents",
    availableSlots: ["Morning (5 AM - 11 AM)", "Evening (4 PM - 11 PM)"],
    features: ["Trainer Available", "Cardio Equipment", "Weights", "Yoga Mats", "Locker Room"],
  },
  {
    id: "4",
    name: "Badminton Court",
    icon: "🏸",
    description: "Professional badminton court with wooden flooring",
    capacity: "4 people per slot",
    price: "₹200/hour",
    availableSlots: ["Morning (6 AM - 12 PM)", "Evening (4 PM - 10 PM)"],
    features: ["Good Lighting", "Wooden Floor", "Rackets Available", "Shuttlecocks Available"],
  },
  {
    id: "5",
    name: "Party Hall",
    icon: "🎉",
    description: "Elegant party hall for celebrations",
    capacity: "75 people",
    price: "₹3,500/day",
    availableSlots: ["Full Day (9 AM - 11 PM)"],
    features: ["Decorated", "Sound System", "Catering Allowed", "DJ Setup", "Photography Allowed"],
  },
  {
    id: "6",
    name: "Kids Play Area",
    icon: "🎪",
    description: "Safe and fun play area for children",
    capacity: "Unlimited",
    price: "Free for residents",
    availableSlots: ["All Day (6 AM - 9 PM)"],
    features: ["Slides", "Swings", "Climbing Equipment", "Soft Ground", "Shaded Area"],
  },
];

const myBookings = [
  {
    id: "BK-001",
    amenity: "Clubhouse",
    date: "2026-02-15",
    slot: "Evening (5 PM - 10 PM)",
    status: "CONFIRMED",
    amount: "₹2,000",
    purpose: "Birthday Party",
  },
  {
    id: "BK-002",
    amenity: "Badminton Court",
    date: "2026-02-10",
    slot: "Morning (8 AM - 9 AM)",
    status: "COMPLETED",
    amount: "₹200",
    purpose: "Weekend Sports",
  },
];

export default function AmenitiesPage() {
  const [selectedAmenity, setSelectedAmenity] = useState<typeof amenities[0] | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingData, setBookingData] = useState({
    date: "",
    slot: "",
    guests: "",
    purpose: "",
  });

  const handleBooking = () => {
    if (!bookingData.date || !bookingData.slot) {
      toast.error("Missing Information", {
        description: "Please select date and time slot.",
      });
      return;
    }

    toast.success("Booking Confirmed!", {
      description: `Your ${selectedAmenity?.name} booking has been confirmed for ${bookingData.date}.`,
    });
    setShowBookingForm(false);
    setBookingData({ date: "", slot: "", guests: "", purpose: "" });
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      CONFIRMED: <Badge className="bg-green-100 text-green-700">Confirmed</Badge>,
      PENDING: <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>,
      COMPLETED: <Badge className="bg-blue-100 text-blue-700">Completed</Badge>,
      CANCELLED: <Badge className="bg-red-100 text-red-700">Cancelled</Badge>,
    };
    return badges[status as keyof typeof badges];
  };

  return (
    <DashboardLayout role="resident" societyName="Green Valley" userName="John Doe">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Society Amenities</h1>
          <p className="text-gray-600">Book amenities for your use and convenience</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="py-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Total Amenities</p>
                <p className="text-3xl font-bold">{amenities.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">My Active Bookings</p>
                <p className="text-3xl font-bold text-green-600">
                  {myBookings.filter(b => b.status === "CONFIRMED").length}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">This Month Bookings</p>
                <p className="text-3xl font-bold">{myBookings.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Available Amenities */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Available Amenities</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {amenities.map((amenity) => (
              <Card key={amenity.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="text-center mb-4">
                    <span className="text-6xl">{amenity.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-center">{amenity.name}</h3>
                  <p className="text-sm text-gray-600 text-center mb-4">{amenity.description}</p>

                  <Separator className="my-4" />

                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex items-center text-gray-700">
                      <Users className="h-4 w-4 mr-2 text-blue-600" />
                      <span>Capacity: {amenity.capacity}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Clock className="h-4 w-4 mr-2 text-blue-600" />
                      <span>{amenity.availableSlots.length} time slots</span>
                    </div>
                    <div className="flex items-center font-semibold text-green-600">
                      <span className="mr-2">💰</span>
                      <span>{amenity.price}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button
                      className="w-full"
                      onClick={() => {
                        setSelectedAmenity(amenity);
                        setShowBookingForm(true);
                      }}
                    >
                      Book Now
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setSelectedAmenity(amenity)}
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* My Bookings */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">My Bookings</h2>
          <div className="space-y-4">
            {myBookings.map((booking) => (
              <Card key={booking.id}>
                <CardContent className="py-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold">{booking.amenity}</h3>
                        {getStatusBadge(booking.status)}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">Booking ID: {booking.id}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-700 mb-2">
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {booking.date}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {booking.slot}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">Purpose: {booking.purpose}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">{booking.amount}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Amenity Detail Modal */}
        <Dialog open={!!selectedAmenity && !showBookingForm} onOpenChange={() => setSelectedAmenity(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <span className="text-4xl mr-3">{selectedAmenity?.icon}</span>
                {selectedAmenity?.name}
              </DialogTitle>
              <DialogDescription>{selectedAmenity?.description}</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Capacity</p>
                  <p className="font-semibold">{selectedAmenity?.capacity}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pricing</p>
                  <p className="font-semibold text-green-600">{selectedAmenity?.price}</p>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-2">Available Time Slots</h4>
                <div className="space-y-2">
                  {selectedAmenity?.availableSlots.map((slot, index) => (
                    <div key={index} className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-2 text-blue-600" />
                      <span>{slot}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-2">Features & Facilities</h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedAmenity?.features.map((feature, index) => (
                    <div key={index} className="flex items-start text-sm">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={() => setShowBookingForm(true)}
              >
                Book This Amenity
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Booking Form Modal */}
        <Dialog open={showBookingForm} onOpenChange={(open) => {
          setShowBookingForm(open);
          if (!open) setSelectedAmenity(null);
        }}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Book {selectedAmenity?.name}</DialogTitle>
              <DialogDescription>
                Select your preferred date and time slot
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="date">Booking Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={bookingData.date}
                  onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <Label htmlFor="slot">Time Slot *</Label>
                <select
                  id="slot"
                  className="w-full border rounded-md p-2"
                  value={bookingData.slot}
                  onChange={(e) => setBookingData({ ...bookingData, slot: e.target.value })}
                >
                  <option value="">Select a slot</option>
                  {selectedAmenity?.availableSlots.map((slot, index) => (
                    <option key={index} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="guests">Expected Guests (Optional)</Label>
                <Input
                  id="guests"
                  type="number"
                  placeholder="Number of people"
                  value={bookingData.guests}
                  onChange={(e) => setBookingData({ ...bookingData, guests: e.target.value })}
                />
                <p className="text-xs text-gray-500 mt-1">Max capacity: {selectedAmenity?.capacity}</p>
              </div>

              <div>
                <Label htmlFor="purpose">Purpose (Optional)</Label>
                <Input
                  id="purpose"
                  placeholder="e.g., Birthday Party, Sports Practice"
                  value={bookingData.purpose}
                  onChange={(e) => setBookingData({ ...bookingData, purpose: e.target.value })}
                />
              </div>

              {/* Booking Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Booking Summary</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amenity:</span>
                    <span className="font-semibold">{selectedAmenity?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-semibold text-green-600">{selectedAmenity?.price}</span>
                  </div>
                </div>
              </div>

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
