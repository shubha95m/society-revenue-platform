"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

export default function SocietyRegisterPage() {
  const [step, setStep] = useState(1);
  const totalSteps = 5;

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="container mx-auto max-w-2xl py-12">
        <Link href="/register" className="inline-flex items-center text-blue-600 hover:underline mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to registration options
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Register Your Society</CardTitle>
            <CardDescription>
              Step {step} of {totalSteps}
            </CardDescription>
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Basic Information</h3>
                <div className="space-y-2">
                  <Label htmlFor="society-name">Society Name *</Label>
                  <Input id="society-name" placeholder="Green Valley Apartments" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Input id="address" placeholder="123 Main Street" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input id="city" placeholder="Mumbai" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode">PIN Code *</Label>
                    <Input id="pincode" placeholder="400001" />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Society Details */}
            {step === 2 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Society Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="total-flats">Total Flats *</Label>
                    <Input id="total-flats" type="number" placeholder="120" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="total-buildings">Total Buildings *</Label>
                    <Input id="total-buildings" type="number" placeholder="4" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amenities">Amenities (comma separated)</Label>
                  <Input
                    id="amenities"
                    placeholder="Swimming Pool, Gym, Clubhouse, Play Area"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="current-maintenance">Current Maintenance per Flat (₹) *</Label>
                  <Input id="current-maintenance" type="number" placeholder="2500" />
                </div>
              </div>
            )}

            {/* Step 3: Admin Details */}
            {step === 3 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Admin Details</h3>
                <div className="space-y-2">
                  <Label htmlFor="admin-name">Full Name *</Label>
                  <Input id="admin-name" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-role">Role in Society *</Label>
                  <Input id="admin-role" placeholder="Secretary / President / Treasurer" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Email *</Label>
                  <Input id="admin-email" type="email" placeholder="admin@greenvally.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-phone">Phone Number *</Label>
                  <Input id="admin-phone" type="tel" placeholder="+91 98765 43210" />
                </div>
              </div>
            )}

            {/* Step 4: Documents */}
            {step === 4 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Upload Documents</h3>
                <p className="text-sm text-gray-600">
                  Please upload the following documents for verification
                </p>
                <div className="space-y-2">
                  <Label htmlFor="society-reg">Society Registration Certificate *</Label>
                  <Input id="society-reg" type="file" accept=".pdf,.jpg,.png" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-id">Admin ID Proof (Aadhaar/PAN) *</Label>
                  <Input id="admin-id" type="file" accept=".pdf,.jpg,.png" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="society-photo">Society Photo (Optional)</Label>
                  <Input id="society-photo" type="file" accept=".jpg,.png" />
                </div>
              </div>
            )}

            {/* Step 5: Review */}
            {step === 5 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Review & Submit</h3>
                <div className="bg-blue-50 p-4 rounded-lg space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Society Name:</span>
                    <span className="font-semibold">Green Valley Apartments</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Flats:</span>
                    <span className="font-semibold">120</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current Maintenance:</span>
                    <span className="font-semibold">₹2,500/flat</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Admin Email:</span>
                    <span className="font-semibold">admin@greenvally.com</span>
                  </div>
                </div>
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                    <div>
                      <p className="font-semibold text-green-900">What happens next?</p>
                      <ul className="text-sm text-green-800 mt-2 space-y-1">
                        <li>• Our team will verify your documents (1-2 business days)</li>
                        <li>• You'll receive an email with approval status</li>
                        <li>• Once approved, you can start onboarding residents</li>
                        <li>• Start exploring vendor partnerships immediately</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <input type="checkbox" id="terms" className="mt-1" />
                  <Label htmlFor="terms" className="text-sm">
                    I agree to the{" "}
                    <Link href="#" className="text-blue-600 hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="#" className="text-blue-600 hover:underline">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t">
              {step > 1 && (
                <Button variant="outline" onClick={prevStep}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
              )}
              {step < totalSteps ? (
                <Button onClick={nextStep} className="ml-auto">
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button className="ml-auto bg-green-600 hover:bg-green-700">
                  Submit Application
                  <Check className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
