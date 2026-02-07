import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, Package } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="container mx-auto max-w-4xl py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Join Society Revenue Platform</h1>
          <p className="text-gray-600 text-lg">
            Choose your account type to get started
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Society Admin */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle>Society Admin</CardTitle>
              <CardDescription>
                Register your residential society
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600 mb-6">
                <li>• Manage society operations</li>
                <li>• Onboard residents</li>
                <li>• Approve vendors</li>
                <li>• Track financials</li>
              </ul>
              <Link href="/register/society">
                <Button className="w-full" size="lg">
                  Register Society
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Resident */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle>Resident</CardTitle>
              <CardDescription>
                Join your society as a resident
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600 mb-6">
                <li>• Book services</li>
                <li>• Pay maintenance</li>
                <li>• Vote on proposals</li>
                <li>• Track savings</li>
              </ul>
              <Link href="/register/resident">
                <Button className="w-full" size="lg">
                  Register as Resident
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Vendor */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle>Vendor</CardTitle>
              <CardDescription>
                Offer services to societies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600 mb-6">
                <li>• Discover societies</li>
                <li>• Manage orders</li>
                <li>• Track earnings</li>
                <li>• Grow your business</li>
              </ul>
              <Link href="/register/vendor">
                <Button className="w-full" size="lg">
                  Register as Vendor
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline font-semibold">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
