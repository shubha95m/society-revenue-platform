import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, CheckCircle, TrendingDown, Users, Building2 } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Reduce Society Maintenance by
          <span className="text-blue-600"> 30–70%</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Ethical revenue streams. Zero ads. Transparent governance.
          <br />
          No data selling. Opt-in monetization only.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="text-lg">
            Calculate Your Society Savings
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button size="lg" variant="outline" className="text-lg">
            See How It Works
          </Button>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <TrendingDown className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Society Earns</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Vendor aggregation, asset monetization, service marketplace generate revenue
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>Residents Save</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Maintenance charges reduced by 30-70% through collective income
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Building2 className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>Vendors Benefit</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Predictable demand, larger customer base, scale faster
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Trust & Ethics */}
      <section className="container mx-auto px-4 py-16 bg-white rounded-lg my-8">
        <h2 className="text-3xl font-bold text-center mb-12">Trust & Ethics</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { title: "No Ads", desc: "Zero advertising. No spam." },
            { title: "No Data Sale", desc: "Your data is never sold." },
            { title: "Opt-In Only", desc: "Residents choose what they use." },
            { title: "Transparent Ledger", desc: "Every rupee tracked and public." },
          ].map((item) => (
            <div key={item.title} className="text-center">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Reduce Your Maintenance?</h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="text-lg">
            Onboard Your Society
          </Button>
          <Button size="lg" variant="outline" className="text-lg">
            Join as Vendor
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t mt-16 py-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-sm text-gray-600">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Product</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="hover:text-blue-600">How It Works</Link></li>
                <li><Link href="#" className="hover:text-blue-600">For Societies</Link></li>
                <li><Link href="#" className="hover:text-blue-600">For Vendors</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Resources</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="hover:text-blue-600">FAQ</Link></li>
                <li><Link href="#" className="hover:text-blue-600">Support</Link></li>
                <li><Link href="#" className="hover:text-blue-600">API Docs</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="hover:text-blue-600">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-blue-600">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-blue-600">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Company</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="hover:text-blue-600">About Us</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-gray-600">
            © 2026 Society Revenue Platform. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
