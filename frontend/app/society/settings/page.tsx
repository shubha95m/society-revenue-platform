"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Building2, Users, Bell, Lock, CreditCard } from "lucide-react";
import { toast } from "sonner";

export default function SocietySettingsPage() {
  const [societyData, setSocietyData] = useState({
    name: "Green Valley Apartments",
    address: "123 Main Street, Andheri West, Mumbai - 400058",
    totalFlats: "120",
    registrationNumber: "REG-2023-001234",
    contactPerson: "Society Admin",
    email: "admin@greenvalley.com",
    phone: "+91 98765 00000",
    maintenanceAmount: "2500",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: true,
    residentAlerts: true,
    vendorAlerts: true,
    paymentReminders: true,
    votingNotifications: true,
    complaintsAlerts: true,
  });

  const handleSaveSocietyProfile = () => {
    toast.success("Society Profile Updated", {
      description: "Society information has been saved successfully.",
    });
  };

  const handleSaveNotifications = () => {
    toast.success("Preferences Saved", {
      description: "Your notification preferences have been updated.",
    });
  };

  const handleChangePassword = () => {
    toast.success("Password Changed", {
      description: "Your password has been updated successfully.",
    });
  };

  return (
    <DashboardLayout role="society" societyName="Green Valley" userName="Admin">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Society Settings</h1>
          <p className="text-gray-600">Manage your society configuration and preferences</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Settings */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="h-5 w-5 mr-2" />
                  Society Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Society Name</Label>
                  <Input
                    id="name"
                    value={societyData.name}
                    onChange={(e) => setSocietyData({ ...societyData, name: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    rows={2}
                    value={societyData.address}
                    onChange={(e) => setSocietyData({ ...societyData, address: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="totalFlats">Total Flats</Label>
                    <Input
                      id="totalFlats"
                      value={societyData.totalFlats}
                      onChange={(e) => setSocietyData({ ...societyData, totalFlats: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="registrationNumber">Registration Number</Label>
                    <Input
                      id="registrationNumber"
                      value={societyData.registrationNumber}
                      disabled
                    />
                  </div>
                </div>

                <Separator />

                <div>
                  <Label htmlFor="contactPerson">Admin Contact Person</Label>
                  <Input
                    id="contactPerson"
                    value={societyData.contactPerson}
                    onChange={(e) => setSocietyData({ ...societyData, contactPerson: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Admin Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={societyData.email}
                      onChange={(e) => setSocietyData({ ...societyData, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Admin Phone</Label>
                    <Input
                      id="phone"
                      value={societyData.phone}
                      onChange={(e) => setSocietyData({ ...societyData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <Separator />

                <div>
                  <Label htmlFor="maintenanceAmount">Monthly Maintenance (per flat)</Label>
                  <Input
                    id="maintenanceAmount"
                    type="number"
                    value={societyData.maintenanceAmount}
                    onChange={(e) => setSocietyData({ ...societyData, maintenanceAmount: e.target.value })}
                  />
                  <p className="text-xs text-gray-500 mt-1">Current: ₹{societyData.maintenanceAmount}/month</p>
                </div>

                <Button onClick={handleSaveSocietyProfile}>Save Society Profile</Button>
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
                      <p className="font-semibold">Resident Registration Alerts</p>
                      <p className="text-sm text-gray-600">New resident approvals</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.residentAlerts}
                      onChange={(e) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          residentAlerts: e.target.checked,
                        })
                      }
                      className="w-5 h-5"
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">Vendor Partnership Requests</p>
                      <p className="text-sm text-gray-600">New vendor applications</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.vendorAlerts}
                      onChange={(e) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          vendorAlerts: e.target.checked,
                        })
                      }
                      className="w-5 h-5"
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">Payment Reminders</p>
                      <p className="text-sm text-gray-600">Maintenance payment alerts</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.paymentReminders}
                      onChange={(e) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          paymentReminders: e.target.checked,
                        })
                      }
                      className="w-5 h-5"
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">Voting Notifications</p>
                      <p className="text-sm text-gray-600">Active voting updates</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.votingNotifications}
                      onChange={(e) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          votingNotifications: e.target.checked,
                        })
                      }
                      className="w-5 h-5"
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">Complaint Alerts</p>
                      <p className="text-sm text-gray-600">New resident complaints</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.complaintsAlerts}
                      onChange={(e) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          complaintsAlerts: e.target.checked,
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
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Society Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Total Flats</p>
                  <p className="text-2xl font-bold">{societyData.totalFlats}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-gray-600">Active Residents</p>
                  <p className="text-2xl font-bold text-green-600">78</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-gray-600">Occupancy</p>
                  <p className="text-2xl font-bold">65%</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-gray-600">Active Vendors</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Financial Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Monthly Revenue</p>
                  <p className="text-2xl font-bold text-green-600">₹2.8L</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-gray-600">Monthly Expenses</p>
                  <p className="text-2xl font-bold text-red-600">₹1.38L</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-gray-600">Net Surplus</p>
                  <p className="text-2xl font-bold text-blue-600">₹1.42L</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-gray-600">Savings per Flat</p>
                  <p className="text-2xl font-bold text-green-600">₹473</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Platform Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Account Status</span>
                  <span className="text-green-600 font-semibold">✓ Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Member Since</span>
                  <span className="font-semibold">May 2023</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Platform Fee</span>
                  <span className="font-semibold">5%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
