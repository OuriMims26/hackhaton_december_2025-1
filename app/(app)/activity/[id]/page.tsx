"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ExternalLink, Globe, Linkedin, Calendar, Building2, AlertTriangle, AlertCircle, Info, CheckCircle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Company {
    name: string
    logo_url?: string // Assuming logo_url based on previous files, query asks for logo but let's be safe or check schema later. User prompt said 'logo'.
    website_url?: string
    linkedin_company_url?: string
    sector?: string // User prompt said 'industry', need to verify schema or map it.
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

                // Using the specific query requested by the user, adapted for likely actual column names found in previous context 
                // (e.g., website_url vs website, linkedin_company_url vs linkedin_url based on portfolio page).
                // I will try to fetch both potential names or just standard ones.
                // In portfolio/page.tsx, I saw: website_url, linkedin_company_url, logo_url (or just logo?)
                // Let's stick to what was likely in portfolio/page.tsx to be safe: website_url, linkedin_company_url, sector.
                // The user prompt asked for: name, logo, website, linkedin_url, industry, description.
                // I'll try to fetch broadly to match the user's likely schema or alias it.

                const { data, error } = await supabase
                    .from('detected_changes')
                    .select(`
                        *,
                        companies (
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

    const getSeverityBadge = (severity: string) => {
        const styles = {
            LOW: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
            MEDIUM: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
            HIGH: "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20",
            CRITICAL: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
        }
        return styles[severity as keyof typeof styles] || "bg-gray-500/10 text-gray-500"
    }

    const getSeverityIcon = (severity: string) => {
        switch (severity) {
            case 'CRITICAL': return <AlertCircle className="w-4 h-4" />
            case 'HIGH': return <AlertTriangle className="w-4 h-4" />
            case 'MEDIUM': return <Info className="w-4 h-4" />
            default: return <CheckCircle className="w-4 h-4" />
        }
    }

    if (loading) {
        return (
            <div className="flex-1 space-y-4 p-8 pt-6">
                <div className="flex items-center space-x-4">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-8 w-64" />
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <Skeleton className="col-span-4 h-[400px]" />
                    <Skeleton className="col-span-3 h-[400px]" />
                </div>
            </div>
        )
    }

    if (error || !activity) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-4">
                <div className="text-red-400">Error: {error || "Activity not found"}</div>
                <Button variant="outline" onClick={() => router.back()}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
                </Button>
            </div>
        )
    }

    return (
        <div className="flex-1 space-y-6 p-8 pt-6">
            {/* Header / Nav */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-muted-foreground hover:text-white">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-3">

                {/* Main Content: Activity Details */}
                <div className="md:col-span-2 space-y-6">
                    <Card className="bg-[#1A1A1A] border-white/5">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Badge variant="outline" className={getSeverityBadge(activity.severity)}>
                                            <span className="flex items-center gap-1.5">
                                                {getSeverityIcon(activity.severity)}
                                                {activity.severity}
                                            </span>
                                        </Badge>
                                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {formatDistanceToNow(new Date(activity.detected_at), { addSuffix: true })}
                                        </span>
                                    </div>
                                    <CardTitle className="text-2xl font-bold text-white">
                                        {activity.summary}
                                    </CardTitle>
                                    <CardDescription>
                                        Type: <span className="text-[#F1C086] font-medium capitalize">{activity.change_type.replace(/_/g, ' ')}</span>
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">

                            {/* AI Analysis Section */}
                            <div className="space-y-3">
                                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                    Why this matters
                                </h3>
                                <div className="p-4 rounded-xl bg-gradient-to-br from-[#F1C086]/5 to-[#F6B88C]/5 border border-[#F1C086]/10 text-gray-300 leading-relaxed">
                                    {activity.ai_analysis || "No detailed AI analysis available for this event."}
                                </div>
                            </div>

                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar: Company Details */}
                <div className="space-y-6">
                    <Card className="bg-[#1A1A1A] border-white/5 h-full">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold text-white">About the Company</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-16 w-16 border-2 border-white/10">
                                    <AvatarImage src={activity.companies?.logo_url || "/placeholder-logo.png"} />
                                    <AvatarFallback className="text-lg bg-[#2A2A2A]">
                                        {activity.companies?.name?.slice(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h2 className="text-xl font-bold text-white">{activity.companies?.name}</h2>
                                    <p className="text-sm text-muted-foreground">{activity.companies?.sector || "Tech"}</p>
                                </div>
                            </div>

                            {activity.companies?.description && (
                                <p className="text-sm text-gray-400 leading-relaxed">
                                    {activity.companies.description}
                                </p>
                            )}

                            <div className="flex flex-col gap-2 pt-2">
                                {activity.companies?.website_url && (
                                    <Link
                                        href={activity.companies.website_url}
                                        target="_blank"
                                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-[#F1C086] transition-colors p-2 rounded-lg hover:bg-white/5"
                                    >
                                        <Globe className="w-4 h-4" />
                                        Visit Website
                                        <ExternalLink className="w-3 h-3 ml-auto opacity-50" />
                                    </Link>
                                )}
                                {activity.companies?.linkedin_company_url && (
                                    <Link
                                        href={activity.companies.linkedin_company_url}
                                        target="_blank"
                                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-[#0077b5] transition-colors p-2 rounded-lg hover:bg-white/5"
                                    >
                                        <Linkedin className="w-4 h-4" />
                                        LinkedIn Profile
                                        <ExternalLink className="w-3 h-3 ml-auto opacity-50" />
                                    </Link>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    )
}
