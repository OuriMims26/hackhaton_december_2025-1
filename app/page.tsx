import Link from "next/link";
import { ArrowRight, BarChart3, Globe, Bell, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/ui/logo";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0E0E10] text-white overflow-hidden flex flex-col items-center justify-center relative">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-purple-900/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-orange-900/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Nav */}
      <nav className="absolute top-0 w-full p-6 flex justify-between items-center max-w-7xl mx-auto z-10">
        <Logo />
        <Link href="/dashboard">
          <Button variant="ghost" className="text-white hover:text-primary hover:bg-white/5">
            Sign In
          </Button>
        </Link>
      </nav>

      {/* Hero */}
      <main className="z-10 flex flex-col items-center text-center max-w-4xl px-4 mt-20">
        <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-gray-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Live VC Intelligence
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8B8CFF] to-[#F6D9A3]">
            OurInvest
          </span>
          <br />
          <span className="text-white">VC Intelligence Platform</span>
        </h1>

        <p className="text-xl text-gray-400 mb-10 max-w-2xl leading-relaxed">
          The premium dashboard for tracking startups, website changes, LinkedIn activity, and smart warnings in real-time.
        </p>

        <Link href="/dashboard">
          <Button
            size="lg"
            className="rounded-full px-8 py-6 text-lg font-medium bg-gradient-to-r from-[#F1C086] to-[#F6B88C] text-[#0E0E10] hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(241,192,134,0.3)]"
          >
            Get Started <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </Link>
      </main>

      {/* Features Grid */}
      <div className="mt-24 px-4 w-full max-w-7xl z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-20">
        <FeatureCard
          icon={<BarChart3 className="w-6 h-6 text-[#F1C086]" />}
          title="Portfolio Analytics"
          description="Real-time tracking of portfolio performance and metrics."
        />
        <FeatureCard
          icon={<Globe className="w-6 h-6 text-[#8B8CFF]" />}
          title="Website Monitoring"
          description="Detect changes in pricing, teams, and landing pages."
        />
        <FeatureCard
          icon={<Bell className="w-6 h-6 text-emerald-400" />}
          title="LinkedIn Tracking"
          description="Monitor founder activity and hiring announcements."
        />
        <FeatureCard
          icon={<ShieldAlert className="w-6 h-6 text-amber-400" />}
          title="Smart Warnings"
          description="Get alerted on risks, pivots, or silent periods."
        />
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <Card className="bg-[#1A1A1A]/50 border-white/10 backdrop-blur-sm hover:border-[#F1C086]/50 hover:shadow-[0_0_20px_rgba(241,192,134,0.1)] transition-all duration-300 group">
      <CardHeader>
        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-2 group-hover:bg-white/10 transition-colors">
          {icon}
        </div>
        <CardTitle className="text-white text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-400 text-sm leading-relaxed">
          {description}
        </p>
      </CardContent>
    </Card>
  )
}
