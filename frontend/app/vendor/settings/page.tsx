"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Building2, Mail, Phone, MapPin, Bell, Lock, CreditCard } from "lucide-react";
import { toast } from "sonner";

export default function VendorSettingsPage() {
  const [businessData, setBusinessData] = useState({
    businessName: "QuickFix Solutions",
    contactPerson: "Rajesh Kumar",
    email: "hello@quickfix.com",
    phone: "+91 98765 22222",
    address: "Shop 12, Market Complex, Andheri West, Mumbai - 400058",
    description: "Professional plumbing services for residential societies. 24/7 emergency service with 2-hour response time guarantee.",
    categories: "Plumbing, Emergency Repairs",
    experience: "10+ years",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: true,
    newOrderAlerts: true,
    paymentNotifications: true,
    reviewNotifications: true,
    marketingEmails: false,
  });

  const [bankDetails, setBankDetails] = useState({
    accountName: "QuickFix Solutions Pvt Ltd",
    accountNumber: "1234567890",
    ifsc: "HDFC0001234",
    bankName: "HDFC Bank",
    branch: "Andheri West",
  });

  const handleSaveProfile = () => {
    toast.success("Profile Updated", {
      description: "Your business profile has been saved successfully.",
    });
  };

  const handleSaveNotifications = () => {
    toast.success("Preferences Saved", {
      description: "Your notification preferences have been updated.",
    });
  };

  const handleSaveBankDetails = () => {
    toast.success("Bank Details Updated", {
      description: "Your payout information has been saved.",
    });
  };

  const handleChangePassword = () => {
    toast.success("Password Changed", {
      description: "Your password has been updated successfully.",
    });
  };

  return (
    <DashboardLayout role="vendor" societyName="QuickFix Solutions" userName="Vendor Admin">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Business Settings</h1>
          <p className="text-gray-600">Manage your vendor account and preferences</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Settings */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="h-5 w-5 mr-2" />
                  Business Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    id="businessName"
                    value={businessData.businessName}
                    onChange={(e) => setBusinessData({ ...businessData, businessName: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="contactPerson">Contact Person</Label>
                  <Input
                    id="contactPerson"
                    value={businessData.contactPerson}
                    onChange={(e) => setBusinessData({ ...businessData, contactPerson: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={businessData.email}
                      onChange={(e) => setBusinessData({ ...businessData, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={businessData.phone}
                      onChange={(e) => setBusinessData({ ...businessData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Business Address</Label>
                  <Textarea
                    id="address"
                    rows={2}
                    value={businessData.address}
                    onChange={(e) => setBusinessData({ ...businessData, address: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="description">Business Description</Label>
                  <Textarea
                    id="description"
                    rows={3}
                    value={businessData.description}
                    onChange={(e) => setBusinessData({ ...businessData, description: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="categories">Service Categories</Label>
                    <Input
                      id="categories"
                      value={businessData.categories}
                      onChange={(e) => setBusinessData({ ...businessData, categories: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="experience">Experience</Label>
                    <Input
                      id="experience"
                      value={businessData.experience}
                      onChange={(e) => setBusinessData({ ...businessData, experience: e.target.value })}
                    />
                  </div>
                </div>

                <Button onClick={handleSaveProfile}>Save Business Profile</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Bank Details for Payouts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="accountName">Account Holder Name</Label>
                  <Input
                    id="accountName"
                    value={bankDetails.accountName}
                    onChange={(e) => setBankDetails({ ...bankDetails, accountName: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="accountNumber">Account Number</Label>
                    <Input
                      id="accountNumber"
                      value={bankDetails.accountNumber}
                      onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="ifsc">IFSC Code</Label>
                    <Input
                      id="ifsc"
                      value={bankDetails.ifsc}
                      onChange={(e) => setBankDetails({ ...bankDetails, ifsc: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input
                      id="bankName"
                      value={bankDetails.bankName}
                      onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="branch">Branch</Label>
                    <Input
                      id="branch"
                      value={bankDetails.branch}
                      onChange={(e) => setBankDetails({ ...bankDetails, branch: e.target.value })}
                    />
                  </div>
                </div>

                <Button onClick={handleSaveBankDetails}>Save Bank Details</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">Email Notifications</p>
                      <p className="text-sm text-gray-600">Receive updates via email</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.emailNotifications}
                      onChange={(e) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          emailNotifications: e.target.checked,
                        })
                      }
                      className="w-5 h-5"
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">SMS Notifications</p>
                      <p className="text-sm text-gray-600">Receive updates via SMS</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.smsNotifications}
                      onChange={(e) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          smsNotifications: e.target.checked,
                        })
                      }
                      className="w-5 h-5"
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">New Order Alerts</p>
                      <p className="text-sm text-gray-600">Instant alerts for new orders</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.newOrderAlerts}
                      onChange={(e) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          newOrderAlerts: e.target.checked,
                        })
                      }
                      className="w-5 h-5"
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">Payment Notifications</p>
                      <p className="text-sm text-gray-600">Alerts for payout processing</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.paymentNotifications}
                      onChange={(e) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          paymentNotifications: e.target.checked,
                        })
                      }
                      className="w-5 h-5"
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">Review Notifications</p>
                      <p className="text-sm text-gray-600">Alerts when customers leave reviews</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.reviewNotifications}
                      onChange={(e) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          reviewNotifications: e.target.checked,
                        })
                      }
                      className="w-5 h-5"
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">Marketing Emails</p>
                      <p className="text-sm text-gray-600">Tips and growth opportunities</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.marketingEmails}
                      onChange={(e) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          marketingEmails: e.target.checked,
                        })
                      }
                      className="w-5 h-5"
                    />
                  </div>
                </div>

                <Button onClick={handleSaveNotifications}>Save Preferences</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="h-5 w-5 mr-2" />
                  Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" />
                </div>

                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" />
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" />
                </div>

                <Button onClick={handleChangePassword}>Change Password</Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Business Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Business Name</p>
                  <p className="font-semibold">{businessData.businessName}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-gray-600">Member Since</p>
                  <p className="font-semibold">May 2023</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-gray-600">Active Contracts</p>
                  <p className="font-semibold text-green-600">3 Societies</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="font-semibold">342</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-gray-600">Average Rating</p>
                  <p className="font-semibold">4.7 ⭐</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Profile Verified</span>
                  <span className="text-green-600 font-semibold">✓ Yes</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Bank Verified</span>
                  <span className="text-green-600 font-semibold">✓ Yes</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Documents</span>
                  <span className="text-green-600 font-semibold">✓ Complete</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-red-700">Danger Zone</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">
                  Deactivating your account will pause all active contracts. Contact support to reactivate.
                </p>
                <Button variant="destructive" className="w-full">
                  Deactivate Account
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
