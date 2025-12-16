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
                // Note: We need to make sure we get the company ID if we want to link to it
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

    return (
        <div className="flex-1 p-6 md:p-8 max-w-[1600px] mx-auto w-full space-y-4 animate-in fade-in duration-500">
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

                <div className="w-full p-8 ">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wider flex items-center gap-2 border ${sev.bg} ${sev.color} ${sev.border}`}>
                                {sev.icon}
                                {activity.severity} SEVERITY
                            </div>
                            <span className="text-muted-foreground text-sm flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5" />
                                {timeAgo(activity.detected_at)}
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-extrabold text-[#F1C086] leading-tight drop-shadow-sm">
                            {activity.summary}
                        </h1>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">

                {/* Main Content Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Primary Insight Card */}
                    <Card className="bg-[#0E0E10]/50 backdrop-blur-xl border-white/10 shadow-2xl relative overflow-hidden group">
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
                            <div className="p-6 rounded-2xl bg-white/5 border border-white/5 text-lg text-gray-200 leading-relaxed font-light">
                                {activity.ai_analysis || "Our AI detected this change but hasn't generated a deep analysis yet. This usually indicates a standard operational update."}
                            </div>

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

                {/* Sidebar Column */}
                <div className="space-y-6">
                    {/* Entity Card */}
                    <Card className="bg-[#0E0E10] border-white/10 h-full">
                        <CardHeader className="pb-4 border-b border-white/5">
                            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                                <Building className="w-4 h-4" />
                                Affected Entity
                            </h3>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-6">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-16 w-16 border-2 border-white/10 shadow-lg ring-2 ring-[#F1C086]/20">
                                    <AvatarImage src={activity.companies?.logo_url || "/placeholder-logo.png"} className="object-cover" />
                                    <AvatarFallback className="text-xl font-bold bg-[#1A1A1A] text-[#F1C086]">
                                        {activity.companies?.name?.slice(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <Link href={activity.companies?.id ? `/portfolio/${activity.companies.id}` : '#'} className="hover:underline decoration-[#F1C086]/50 underline-offset-4">
                                        <h2 className="text-xl font-bold text-white">{activity.companies?.name}</h2>
                                    </Link>
                                    <Badge variant="secondary" className="mt-1 bg-white/5 text-gray-400 hover:bg-white/10">
                                        {activity.companies?.sector || "Technology"}
                                    </Badge>
                                </div>
                            </div>

                            {activity.companies?.description && (
                                <p className="text-sm text-gray-400 leading-relaxed border-l-2 border-white/10 pl-4">
                                    {activity.companies.description}
                                </p>
                            )}

                            <div className="flex flex-col gap-2 pt-2">
                                {activity.companies?.website_url && (
                                    <Link
                                        href={activity.companies.website_url}
                                        target="_blank"
                                        className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-black/20 text-gray-400 group-hover:text-emerald-500 transition-colors">
                                                <Globe className="w-4 h-4" />
                                            </div>
                                            <span className="text-sm font-medium text-gray-300 group-hover:text-white">Website</span>
                                        </div>
                                        <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-emerald-500" />
                                    </Link>
                                )}
                                <Link
                                    href={activity.companies?.linkedin_company_url || "#"}
                                    target="_blank"
                                    className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-[#0077b5]/10 hover:border-[#0077b5]/30 transition-all group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-black/20 text-gray-400 group-hover:text-[#0077b5] transition-colors">
                                            <Linkedin className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-300 group-hover:text-white">LinkedIn</span>
                                    </div>
                                    <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-[#0077b5]" />
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
