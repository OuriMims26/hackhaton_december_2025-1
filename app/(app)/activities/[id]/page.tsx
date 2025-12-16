"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ExternalLink, Globe, Linkedin, Calendar, AlertTriangle, AlertCircle, Info, CheckCircle, Sparkles, Building, Activity as ActivityIcon } from "lucide-react"

import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

function timeAgo(dateString: string) {
    const date = new Date(dateString)
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    let interval = seconds / 31536000
    if (interval > 1) return Math.floor(interval) + " years ago"
    interval = seconds / 2592000
    if (interval > 1) return Math.floor(interval) + " months ago"
    interval = seconds / 86400
    if (interval > 1) return Math.floor(interval) + " days ago"
    interval = seconds / 3600
    if (interval > 1) return Math.floor(interval) + " hours ago"
    interval = seconds / 60
    if (interval > 1) return Math.floor(interval) + " minutes ago"
    return Math.floor(seconds) + " seconds ago"
}

interface Company {
    id?: string
    name: string
    logo_url?: string
    website_url?: string
    linkedin_company_url?: string
    sector?: string
    description?: string
}

interface Activity {
    id: string
    change_type: string
    summary: string
    source?: string
    ai_analysis?: string | null
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
    detected_at: string
    companies: Company
}

export default function ActivityDetailPage() {
    const params = useParams()
    const router = useRouter()
    const [activity, setActivity] = useState<Activity | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchActivity() {
            try {
                if (!params.id) return

                // Fetch activity with company details
                const { data, error } = await supabase
                    .from('detected_changes')
                    .select(`
                        *,
                        companies (
                            id,
                            name,
                            logo_url,
                            website_url,
                            linkedin_company_url,
                            sector,
                            description
                        )
                    `)
                    .eq('id', params.id)
                    .single()

                if (error) throw error
                setActivity(data)
            } catch (err: any) {
                console.error("Error fetching activity:", err)
                setError("Failed to load activity details.")
            } finally {
                setLoading(false)
            }
        }

        fetchActivity()
    }, [params.id])

    const getSeverityDetails = (severity: string) => {
        switch (severity) {
            case 'CRITICAL':
                return {
                    color: "text-red-500",
                    bg: "bg-red-500/10",
                    border: "border-red-500/20",
                    icon: <AlertCircle className="w-4 h-4" />
                }
            case 'HIGH':
                return {
                    color: "text-orange-500",
                    bg: "bg-orange-500/10",
                    border: "border-orange-500/20",
                    icon: <AlertTriangle className="w-4 h-4" />
                }
            case 'MEDIUM':
                return {
                    color: "text-yellow-500",
                    bg: "bg-yellow-500/10",
                    border: "border-yellow-500/20",
                    icon: <Info className="w-4 h-4" />
                }
            default: // LOW
                return {
                    color: "text-emerald-500",
                    bg: "bg-emerald-500/10",
                    border: "border-emerald-500/20",
                    icon: <CheckCircle className="w-4 h-4" />
                }
        }
    }

    const getSourceDetails = (source?: string) => {
        if (source === 'linkedin') {
            return {
                icon: <Linkedin className="w-3.5 h-3.5 text-[#0077b5]" />,
                label: 'LinkedIn',
                style: 'bg-[#0077b5]/10 border-[#0077b5]/20 text-[#0077b5]'
            }
        }
        return {
            icon: <Globe className="w-3.5 h-3.5 text-emerald-500" />,
            label: 'Website',
            style: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
        }
    }

    if (loading) {
        return (
            <div className="flex-1 space-y-6 p-8 max-w-7xl mx-auto w-full animate-pulse">
                <div className="flex items-center space-x-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-8 w-64" />
                </div>
                <div className="grid gap-8 lg:grid-cols-3">
                    <Skeleton className="lg:col-span-2 h-[500px] rounded-2xl" />
                    <Skeleton className="h-[400px] rounded-2xl" />
                </div>
            </div>
        )
    }

    if (error || !activity) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-6">
                <div className="p-4 rounded-full bg-red-500/10 text-red-500">
                    <AlertTriangle className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-semibold text-white">Unable to load details</h2>
                <p className="text-muted-foreground">{error || "Activity not found"}</p>
                <Button variant="outline" onClick={() => router.back()} className="border-white/10 hover:bg-white/5">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
                </Button>
            </div>
        )
    }

    const sev = getSeverityDetails(activity.severity)
    const sourceDetails = getSourceDetails(activity.source)

    return (
        <div className="flex-1 px-6 md:px-8 pb-8 pt-0 max-w-[1600px] mx-auto w-full space-y-4 animate-in fade-in duration-500">
            {/* Navigation & Header */}
            <div className="space-y-1">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.back()}
                    className="text-muted-foreground hover:text-white -ml-2 group"
                >
                    <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    Back to Feed
                </Button>

                <div className="w-full border-white/5 shadow-2xl">
                    <div className="flex flex-col md:flex-row items-start gap-6 md:gap-10">
                        {/* Title & Metadata (Left Side) */}
                        <div className="space-y-4 flex-1">
                            <div className="flex items-center gap-3">
                                {/* Severity Badge Removed */}
                                <div className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wider flex items-center gap-2 border ${sourceDetails.style}`}>
                                    {sourceDetails.icon}
                                    {sourceDetails.label.toUpperCase()}
                                </div>
                                <span className="text-muted-foreground text-sm flex items-center gap-1.5 ml-1">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {timeAgo(activity.detected_at)}
                                </span>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-extrabold text-[#F1C086] leading-tight drop-shadow-sm">
                                {activity.summary}
                            </h1>
                        </div>

                        {/* Company Header Block (Right Side) */}
                        <Link
                            href={activity.companies?.id ? `/portfolio/${activity.companies.id}` : '#'}
                            className="group flex items-center gap-4 shrink-0 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#F1C086]/30 transition-all shadow-lg hover:shadow-[#F1C086]/10"
                        >
                            <Avatar className="h-16 w-16 border-2 border-[#F1C086]/20 bg-[#1A1A1A] group-hover:border-[#F1C086] transition-colors">
                                <AvatarImage src={activity.companies?.logo_url} className="object-cover" />
                                <AvatarFallback className="text-2xl font-bold bg-[#1A1A1A] text-[#F1C086]">
                                    {activity.companies?.name?.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col pr-2">
                                <h2 className="text-2xl font-bold text-white group-hover:text-[#F1C086] transition-colors">
                                    {activity.companies?.name}
                                </h2>
                                <Badge variant="secondary" className="mt-1.5 bg-white/5 text-gray-400 group-hover:text-[#F1C086] group-hover:bg-[#F1C086]/10 w-fit rounded-md font-normal text-xs transition-colors border border-white/5 group-hover:border-[#F1C086]/20">
                                    {activity.companies?.sector || "Technology"}
                                </Badge>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="w-full space-y-6">
                {/* Primary Insight Card */}
                <Card className="bg-[#0E0E10]/50 backdrop-blur-xl border-white/10 shadow-2xl relative overflow-hidden group w-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#F1C086]/5 via-transparent to-transparent opacity-50" />

                    <CardHeader className="relative">
                        <div className="bg-[#05060A] px-4 py-3 rounded-xl inline-flex items-center gap-2 border border-white/5 mb-4 shadow-lg w-fit">
                            <Sparkles className="w-5 h-5 text-[#8B8CFF]" />
                            <span className="font-extrabold tracking-wider text-sm uppercase bg-clip-text text-transparent bg-gradient-to-r from-[#8B8CFF] to-[#F6D9A3]">
                                AI Analysis
                            </span>
                        </div>
                        <CardTitle className="text-xl text-white font-light leading-relaxed">
                            Understanding the impact
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="relative space-y-6">
                        {(() => {
                            let parsed = null;
                            const text = typeof activity.ai_analysis === 'string' ? activity.ai_analysis : "";

                            try {
                                // 1. Attempt JSON Parse
                                if (text.trim().startsWith('{')) {
                                    parsed = JSON.parse(text);
                                }
                            } catch (e) {
                                // Not JSON
                            }

                            // 2. If no JSON parsed, try Regex extraction for formatted strings
                            if (!parsed && text) {
                                // Regex to capture sections based on emojis (using [\s\S] for multi-line matching)
                                const reasoningMatch = text.match(/(?:📊 ANALYSE\s*:)?\s*([\s\S]*?)(?=\s*🌍 IMPACT MARCHÉ|$)/);
                                const impactMatch = text.match(/🌍 IMPACT MARCHÉ\s*:\s*([\s\S]*?)(?=\s*🔍 PREUVES|$)/);
                                const evidenceMatch = text.match(/🔍 PREUVES\s*(?:\(Diff\))?\s*:\s*([\s\S]*)/);

                                let evidenceObj = null;
                                if (evidenceMatch) {
                                    const evText = evidenceMatch[1];
                                    const oldMatch = evText.match(/🔴 Avant\s*:\s*([\s\S]*?)(?=\s*🟢 Après|$)/);
                                    const newMatch = evText.match(/🟢 Après\s*:\s*([\s\S]*)/);
                                    evidenceObj = {
                                        old: oldMatch ? oldMatch[1].trim() : null,
                                        new: newMatch ? newMatch[1].trim() : null
                                    };
                                }

                                parsed = {
                                    reasoning: reasoningMatch ? reasoningMatch[1].trim() : text,
                                    market_implication: impactMatch ? impactMatch[1].trim() : null,
                                    evidence: evidenceObj
                                };
                            }

                            // 3. Render
                            if (parsed) {
                                return (
                                    <div className="space-y-4">
                                        {/* Reasoning Card */}
                                        <div className="p-5 rounded-2xl bg-white/5 border border-white/5 text-lg text-gray-200 leading-relaxed font-light">
                                            <h4 className="text-[#F1C086] font-semibold text-sm uppercase tracking-wider mb-2">Analysis & Reasoning</h4>
                                            {parsed.reasoning || "No detailed analysis available."}
                                        </div>

                                        {/* Market Implication Card */}
                                        {parsed.market_implication && (
                                            <div className="p-5 rounded-2xl bg-white/5 border border-white/5 text-lg text-gray-200 leading-relaxed font-light">
                                                <h4 className="text-[#8B8CFF] font-semibold text-sm uppercase tracking-wider mb-2">Market Implication</h4>
                                                {parsed.market_implication}
                                            </div>
                                        )}

                                        {/* Evidence Grid (Before / After) */}
                                        {parsed.evidence && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200">
                                                    <h4 className="text-red-400 font-bold text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-red-500" />
                                                        Before
                                                    </h4>
                                                    <p className="font-mono text-sm">{parsed.evidence.old || "N/A"}</p>
                                                </div>
                                                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-200">
                                                    <h4 className="text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                                        After
                                                    </h4>
                                                    <p className="font-mono text-sm">{parsed.evidence.new || "N/A"}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            }

                            // Fallback for completely empty content
                            return (
                                <div className="space-y-4">
                                    <div className="p-5 rounded-2xl bg-white/5 border border-white/5 text-lg text-gray-200 leading-relaxed font-light">
                                        <h4 className="text-[#F1C086] font-semibold text-sm uppercase tracking-wider mb-2">Analysis & Reasoning</h4>
                                        {activity.ai_analysis || "Our AI detected this change but hasn't generated a deep analysis yet. This usually indicates a standard operational update."}
                                    </div>
                                </div>
                            );
                        })()}

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-black/20 border border-white/5">
                                <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">Change Type</span>
                                <span className="text-white font-medium capitalize flex items-center gap-2">
                                    <ActivityIcon className="w-4 h-4 text-emerald-500" />
                                    {activity.change_type.replace(/_/g, ' ').toLowerCase()}
                                </span>
                            </div>
                            <div className="p-4 rounded-xl bg-black/20 border border-white/5">
                                <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">Detection Source</span>
                                <span className="text-white font-medium capitalize flex items-center gap-2">
                                    <Globe className="w-4 h-4 text-blue-500" />
                                    Automated Monitor
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div >
    )
}
