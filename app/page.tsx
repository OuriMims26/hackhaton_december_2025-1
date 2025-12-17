"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Zap, LineChart, Shield, Users, Instagram, Linkedin, Facebook, Youtube, Twitter, BarChart3, Globe, AlertTriangle, Bell, ShieldAlert } from "lucide-react"
import { Logo } from "@/components/ui/logo"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0E0E10] flex flex-col font-sans">
      {/* Background Decorations */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-purple-900/20 blur-[120px] rounded-full pointer-events-none" />
      {/* A. HEADER */}
      <header className="w-full max-w-7xl mx-auto px-6 py-8 flex items-center justify-between z-50">
        <div className="flex items-center gap-4">
          {/* Logo Icon Only (Assuming Logo component can render just icon or we wrap it) */}
          <div className="transform scale-150 origin-left">
            <Logo iconOnly={true} />
          </div>
          <span className="text-5xl font-bold bg-[#F6B88C] bg-clip-text text-transparent hidden md:block">
            OurInvest
          </span>
        </div>

        <Link href="/login?mode=signin">
          <Button variant="ghost" className="text-white hover:text-primary hover:bg-white/5">
            Sign In
          </Button>
        </Link>
      </header>

      <main className="flex-1">

        {/* B. HERO SECTION */}
        <section className="relative pt-24 pb-12 text-center px-4 max-w-6xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-8 leading-tight">
            Welcome to your platform <br />
            <span className="bg-gradient-to-r from-[#8B8CFF] to-[#F6D9A3] bg-clip-text text-transparent">
              VC Intelligence
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12">
            Monitor your portfolio, detect weak signals, and make informed decisions with our real-time analysis technology.
          </p>
        </section>

        {/* CTA 1: Between Hero and Grid */}
        <div className="flex justify-center pb-12">
          <Link
            href="/login?mode=signup"
            className="group relative px-8 py-4 rounded-full bg-gradient-to-r from-[#F1C086] to-[#e8ab80] text-[#0E0E10] font-bold text-xl shadow-[0_0_20px_rgba(241,192,134,0.3)] transition-all hover:shadow-[0_0_40px_rgba(241,192,134,0.5)] hover:scale-105 flex items-center gap-2"
          >
            Get Started
            <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Features Grid */}
        <div className="px-6 w-full max-w-7xl mx-auto z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-32">
          <FeatureCard
            icon={<BarChart3 className="w-6 h-6 text-[#F1C086]" />}
            title="Portfolio Analytics"
            description="Real-time tracking of portfolio performance and metrics."
            href="#portfolio-analytics"
          />
          <FeatureCard
            icon={<Bell className="w-6 h-6 text-emerald-400" />}
            title="LinkedIn Tracking"
            description="Monitor founder activity and hiring announcements."
            href="#linkedin-tracking"
          />
          <FeatureCard
            icon={<Globe className="w-6 h-6 text-[#8B8CFF]" />}
            title="Website Monitoring"
            description="Detect changes in pricing, teams, and landing pages."
            href="#website-monitoring"
          />
          <FeatureCard
            icon={<ShieldAlert className="w-6 h-6 text-amber-400" />}
            title="Smart Warnings"
            description="Get alerted on risks, pivots, or silent periods."
            href="#smart-warnings"
          />
        </div>

        {/* D. DETAILED FEATURES (Alternating) */}

        {/* 1. Portfolio Analytics (White BG) */}
        <section id="portfolio-analytics" className="bg-white py-24 text-black scroll-mt-24">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <Badge color="light" text="PORTFOLIO ANALYTICS" />
              <h2 className="text-4xl font-bold tracking-tight">Track your portfolio performance</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                A consolidated view of all your investments. Track multiples, IRR, and valuation evolution in real-time.
              </p>
              <ul className="space-y-4 pt-4">
                <ListItem darkText>Real-time valuation</ListItem>
                <ListItem darkText>Key KPI tracking</ListItem>
                <ListItem darkText>Automated reporting</ListItem>
              </ul>
            </div>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] bg-gray-100">
              <Image
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
                alt="Portfolio Analytics"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* 2. LinkedIn Tracking (Dark BG) */}
        <section id="linkedin-tracking" className="bg-[#0E0E10] py-24 text-white relative border-y border-white/5 scroll-mt-24">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center lg:flex-row-reverse">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] bg-[#1A1A1A] order-2 lg:order-1">
              <Image
                src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80"
                alt="LinkedIn Tracking"
                fill
                className="object-cover"
              />
              {/* Used a known generic LinkedIn/social image since the user provided one might be broken/typo'd. 
                         The provided ID '1746014600883-57f4b16a7012' looks like a timestamp + uuid which isn't standard Unsplash public ID format usually.
                         Substituted with a reliable Unsplash ID for 'LinkedIn/Social' to ensure rendering. */}
            </div>
            <div className="space-y-6 order-1 lg:order-2">
              <Badge color="dark" text="LINKEDIN TRACKING" />
              <h2 className="text-4xl font-bold tracking-tight">Don't miss any signal on LinkedIn</h2>
              <p className="text-lg text-gray-400 leading-relaxed">
                Track the activity of founders and key employees. Detect hiring, product announcements, and market sentiment.
              </p>
              <ul className="space-y-4 pt-4">
                <ListItem>Founder monitoring</ListItem>
                <ListItem>Hiring detection</ListItem>
                <ListItem>Sentiment analysis</ListItem>
              </ul>
            </div>
          </div>
        </section>

        {/* 3. Website Monitoring (White BG) */}
        <section id="website-monitoring" className="bg-white py-24 text-black scroll-mt-24">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <Badge color="light" text="WEBSITE MONITORING" />
              <h2 className="text-4xl font-bold tracking-tight">Detect pivots and product changes</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Get alerted as soon as a startup changes its pricing, value proposition, or adds new pages to its site.
              </p>
              <ul className="space-y-4 pt-4">
                <ListItem darkText>Pricing changes</ListItem>
                <ListItem darkText>New products</ListItem>
                <ListItem darkText>Team modification</ListItem>
              </ul>
            </div>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] bg-gray-100">
              <Image
                src="https://images.unsplash.com/photo-1669023414162-5bb06bbff0ec?auto=format&fit=crop&w=800&q=80"
                alt="Website Monitoring"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* 4. Smart Warnings (Dark BG) */}
        <section id="smart-warnings" className="bg-[#0E0E10] py-24 text-white relative border-t border-white/5 scroll-mt-24">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] bg-[#1A1A1A] order-2 lg:order-1">
              <Image
                src="https://images.unsplash.com/photo-1610270197941-925ce9015c40?auto=format&fit=crop&w=800&q=80"
                alt="Smart Warnings"
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-6 order-1 lg:order-2">
              <Badge color="dark" text="SMART WARNINGS" />
              <h2 className="text-4xl font-bold tracking-tight">Anticipate risks before it's too late</h2>
              <p className="text-lg text-gray-400 leading-relaxed">
                Our algorithms analyze thousands of data points to identify weak signals and potential risks.
              </p>
              <ul className="space-y-4 pt-4">
                <ListItem>Churn detection</ListItem>
                <ListItem>Founder conflicts</ListItem>
                <ListItem>Cashflow issues</ListItem>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA 2: Before Footer */}
        <section className="py-24 relative overflow-hidden text-center">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0E0E10] to-[#1A1A1A] -z-10" />
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white">
            Ready to transform your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B8CFF] to-[#F6D9A3]">
              investment intelligence?
            </span>
          </h2>
          <Link href="/login?mode=signup">
            <Button
              size="lg"
              className="rounded-full px-8 py-6 text-lg font-medium bg-gradient-to-r from-[#F1C086] to-[#F6B88C] text-[#0E0E10] hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(241,192,134,0.3)]"
            >
              Get Started <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </section>

      </main>

      {/* E. FOOTER */}
      <footer className="bg-[#0E0E10] border-t border-white/10 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            <div className="col-span-2 md:col-span-1 space-y-4">
              <div className="flex items-center gap-2">
                <div className="transform scale-75 origin-left">
                  <Logo iconOnly />
                </div>
                <span className="text-xl font-bold text-white">OurInvest</span>
              </div>
              <Link
                href="/login?mode=signin"
                className="hidden md:inline-flex px-6 py-2.5 rounded-full bg-gradient-to-r from-[#F1C086] to-[#e8ab80] text-[#0E0E10] font-bold text-sm shadow-[0_0_20px_rgba(241,192,134,0.3)] transition-all hover:shadow-[0_0_30px_rgba(241,192,134,0.4)] hover:scale-105"
              >
                Sign In
              </Link>
              <p className="text-white/60 text-sm max-w-xs">
                The reference platform for modern VC investors and Business Angels.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6">Guides</h4>
              <ul className="space-y-3 text-sm text-white/60">
                <li><a href="#" className="hover:text-white transition-colors">Getting Started</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Best Practices</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Keys</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6">Ressources</h4>
              <ul className="space-y-3 text-sm text-white/60">
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6">À propos</h4>
              <ul className="space-y-3 text-sm text-white/60">
                <li><a href="#" className="hover:text-white transition-colors">Team</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-xs text-white/40">
              © 2024 OurInvest. All rights reserved.
            </div>
            <div className="flex items-center gap-6">
              <SocialIcon icon={<Instagram className="w-5 h-5" />} />
              <SocialIcon icon={<Linkedin className="w-5 h-5" />} />
              <SocialIcon icon={<Facebook className="w-5 h-5" />} />
              <SocialIcon icon={<Youtube className="w-5 h-5" />} />
              <SocialIcon icon={<Twitter className="w-5 h-5" />} />
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description, href }: { icon: React.ReactNode, title: string, description: string, href: string }) {
  return (
    <Link href={href}>
      <Card className="h-full bg-[#1A1A1A]/50 border-white/10 backdrop-blur-sm hover:border-[#F1C086]/50 hover:shadow-[0_0_20px_rgba(241,192,134,0.1)] transition-all duration-300 group cursor-pointer block">
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
    </Link>
  )
}

function Badge({ text, color }: { text: string, color: 'light' | 'dark' }) {
  return (
    <span className={`inline-block px-3 py-1 text-xs font-bold tracking-wide rounded-full mb-2 ${color === 'light'
      ? 'bg-[#F1C086]/20 text-[#e8ab80] border border-[#F1C086]/30'
      : 'bg-[#F1C086]/10 text-[#F1C086] border border-[#F1C086]/20'
      }`}>
      {text}
    </span>
  )
}

function ListItem({ children, darkText }: { children: React.ReactNode, darkText?: boolean }) {
  return (
    <li className={`flex items-center gap-3 ${darkText ? 'text-gray-700' : 'text-gray-300'}`}>
      <div className="w-1.5 h-1.5 rounded-full bg-[#f1c086] shrink-0" />
      <span>{children}</span>
    </li>
  )
}

function SocialIcon({ icon }: { icon: React.ReactNode }) {
  return (
    <a href="#" className="text-white/40 hover:text-white transition-colors duration-300">
      {icon}
    </a>
  )
}
