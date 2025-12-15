"use client"

import Link from "next/link"
import { ArrowLeft, Globe, Linkedin, MoreHorizontal, Share2, TrendingUp, AlertTriangle, CheckCircle2, Building2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function CompanyDetailsPage({ params }: { params: { id: string } }) {
    // Mock data for the ID
    const company = {
        name: "TechVision AI",
        tagline: "Generative AI for Enterprise Workflows",
        valuation: "$125M",
        growth: "+15%",
        status: "Active Portfolio",
        industry: "Artificial Intelligence",
        website: "techvision.ai",
        founded: "2023"
    }

    return (
        <div className="p-8 space-y-8 min-h-full">

            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/portfolio" className="text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-white/10">
                        <Building2 className="w-8 h-8 text-indigo-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">{company.name}</h1>
                        <div className="flex items-center gap-3 text-sm text-gray-400 mt-1">
                            <span>{company.tagline}</span>
                            <span className="w-1 h-1 rounded-full bg-gray-600" />
                            <Link href="#" className="hover:text-[#F1C086] transition-colors">{company.website}</Link>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
                        <Share2 className="w-4 h-4 mr-2" /> Share
                    </Button>
                    <Button className="bg-[#F1C086] text-black hover:bg-[#e8ab80]">
                        Edit Details
                    </Button>
                </div>
            </div>

            {/* TABS */}
            <div className="border-b border-white/10 flex gap-8">
                <button className="h-10 text-[#F1C086] font-medium border-b-2 border-[#F1C086] text-sm px-2">
                    Overview
                </button>
                <button className="h-10 text-gray-400 font-medium hover:text-white text-sm px-2 transition-colors">
                    Team
                </button>
                <button className="h-10 text-gray-400 font-medium hover:text-white text-sm px-2 transition-colors">
                    Technology
                </button>
                <button className="h-10 text-gray-400 font-medium hover:text-white text-sm px-2 transition-colors">
                    Documents
                </button>
            </div>

            {/* OVERVIEW CONTENT GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* 1. AI Analysis Section (Span 2) */}
                <div className="col-span-1 lg:col-span-2 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-50">
                        <TrendingUp className="w-24 h-24 text-white/5" />
                    </div>

                    <div className="flex items-center justify-between mb-8 relative z-10">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <span className="w-2 h-6 bg-[#F1C086] rounded-full" />
                            AI Growth Analysis
                        </h3>
                        <div className="flex gap-2 p-1 bg-black/20 rounded-lg backdrop-blur-sm border border-white/5">
                            <button className="px-3 py-1 text-xs font-medium rounded-md bg-[#F1C086] text-black shadow-lg">1M</button>
                            <button className="px-3 py-1 text-xs font-medium rounded-md text-gray-400 hover:bg-white/5 transition-colors">3M</button>
                            <button className="px-3 py-1 text-xs font-medium rounded-md text-gray-400 hover:bg-white/5 transition-colors">YTD</button>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-8">
                        <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl">
                            <div className="text-xs text-emerald-300 font-medium mb-1">Growth Score</div>
                            <div className="text-2xl font-bold text-white">8.5<span className="text-sm text-emerald-400/60 ml-1">/10</span></div>
                        </div>
                        <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl">
                            <div className="text-xs text-blue-300 font-medium mb-1">Market Sentiment</div>
                            <div className="text-2xl font-bold text-white">Positive</div>
                        </div>
                        <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-xl">
                            <div className="text-xs text-purple-300 font-medium mb-1">Eng. Velocity</div>
                            <div className="text-2xl font-bold text-white">High</div>
                        </div>
                    </div>

                    <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-5 relative">
                        <div className="absolute top-4 left-4">
                            <div className="relative">
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping absolute" />
                                <div className="w-2 h-2 bg-blue-400 rounded-full relative" />
                            </div>
                        </div>
                        <p className="pl-6 text-sm text-gray-300 leading-relaxed italic">
                            "TechVision AI shows strong indicators of product-market fit expansion. Recent LinkedIn activity suggests a hiring spree in Engineering, correlating with the launch of their Enterprise API. Website traffic up 22% MoM."
                        </p>
                    </div>
                </div>

                {/* 2. Monitoring Status (Span 1) */}
                <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-white">Health Score</h3>
                        <MoreHorizontal className="w-5 h-5 text-gray-500 cursor-pointer hover:text-white" />
                    </div>

                    <div className="flex items-center justify-center py-8 relative">
                        <svg className="w-40 h-40 transform -rotate-90">
                            <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/5" />
                            <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray="440" strokeDashoffset="44" className="text-emerald-500" strokeLinecap="round" />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                            <span className="text-4xl font-bold text-white">92</span>
                            <span className="text-xs text-emerald-400 font-medium">Excellent</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                            <div className="flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                <span className="text-sm text-gray-300">Website Uptime</span>
                            </div>
                            <span className="text-xs font-mono text-emerald-400">100%</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                            <div className="flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                <span className="text-sm text-gray-300">Social Activity</span>
                            </div>
                            <span className="text-xs font-mono text-emerald-400">Active</span>
                        </div>
                    </div>
                </div>

                {/* 3. Recent LinkedIn Posts (Span 2) */}
                <div className="col-span-1 lg:col-span-2 space-y-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Linkedin className="w-5 h-5 text-[#0077b5]" />
                        Recent Key Activity
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Post 1 */}
                        <div className="bg-[#1A1A1A] border border-white/10 rounded-xl p-5 hover:border-[#F1C086]/30 transition-colors group">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-700" />
                                    <div>
                                        <p className="text-sm font-bold text-white">Sarah Chen</p>
                                        <p className="text-xs text-gray-500">CTO @ TechVision</p>
                                    </div>
                                </div>
                                <span className="text-xs text-gray-500">2h ago</span>
                            </div>
                            <p className="text-sm text-gray-300 line-clamp-2 mb-4">
                                Excited to announce that we just shipped our new Enterprise API! This unlocks massive scale for our customers. #AI #Enterprise
                            </p>
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-[10px] font-medium text-amber-500">
                                    Product Launch
                                </span>
                                <span className="px-2 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-[10px] font-medium text-blue-500">
                                    Positive
                                </span>
                            </div>
                        </div>

                        {/* Post 2 */}
                        <div className="bg-[#1A1A1A] border border-white/10 rounded-xl p-5 hover:border-[#F1C086]/30 transition-colors group">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-700" />
                                    <div>
                                        <p className="text-sm font-bold text-white">Join Us</p>
                                        <p className="text-xs text-gray-500">TechVision Careers</p>
                                    </div>
                                </div>
                                <span className="text-xs text-gray-500">1d ago</span>
                            </div>
                            <p className="text-sm text-gray-300 line-clamp-2 mb-4">
                                We are hiring specific roles in our London office! Looking for Senior ML Engineers. Apply now!
                            </p>
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-1 rounded bg-purple-500/10 border border-purple-500/20 text-[10px] font-medium text-purple-500">
                                    Hiring
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. Website Changes (Span 1) */}
                <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <Globe className="w-5 h-5 text-gray-400" />
                            Website Radar
                        </h3>
                        <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 text-[10px] font-bold border border-purple-500/20">
                            3 New
                        </span>
                    </div>

                    <div className="space-y-4">
                        {/* Change Item */}
                        <div className="p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                                <span className="text-xs font-bold text-gray-200">Pricing Page</span>
                                <span className="text-[10px] text-gray-500 ml-auto">Today</span>
                            </div>
                            <p className="text-xs text-gray-400">
                                New "Enterprise" tier added with "Contact Sales" CTA.
                            </p>
                        </div>

                        {/* Change Item */}
                        <div className="p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                                <span className="text-xs font-bold text-gray-200">Team Page</span>
                                <span className="text-[10px] text-gray-500 ml-auto">2d ago</span>
                            </div>
                            <p className="text-xs text-gray-400">
                                Added 3 new members to "Advisory Board".
                            </p>
                        </div>
                    </div>

                    <Button variant="ghost" className="w-full mt-4 text-xs text-gray-500 hover:text-white hover:bg-white/5">
                        View All Changes
                    </Button>
                </div>

            </div>
        </div>
    )
}
