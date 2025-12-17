"use client"

import { ActivityFeed } from "@/components/dashboard/activity-feed"
import { LinkedinFeed } from "@/components/dashboard/linkedin-feed"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { ArrowLeft, ExternalLink, Activity, Linkedin, Globe, AlertTriangle, CheckCircle2, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { EditCompanyModal } from "@/components/portfolio/edit-company-modal"

// --- Types ---
interface Company {
    id: string
    name: string
    website_url: string
    linkedin_company_url?: string
    sector: string
    stage: string
    description?: string
    logo_url?: string
}

interface DetectedChange {
    id: string
    change_type: 'TEAM' | 'PRICING' | 'PRODUCT' | 'FUNDING' | 'OTHER'
    severity: number
    narrative: string
    detected_at: string
    source?: 'linkedin' | 'website' | 'news'
}

export default function CompanyDetailsPage() {
    const params = useParams()
    const router = useRouter()
    const id = params?.id as string

    const [company, setCompany] = useState<Company | null>(null)
    const [changes, setChanges] = useState<DetectedChange[]>([])
    const [loading, setLoading] = useState(true)
    const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d')
    const [editModalOpen, setEditModalOpen] = useState(false)

    const fetchData = async () => {
        if (!id) return

        setLoading(true)

        // 1. Fetch Company Details
        const { data: companyData, error: companyError } = await supabase
            .from('companies')
            .select('*')
            .eq('id', id)
            .single()

        if (companyError) {
            console.error("Error fetching company:", companyError)
        } else {
            setCompany(companyData)
        }

        // 2. Fetch Detected Changes
        const { data: changesData, error: changesError } = await supabase
            .from('detected_changes')
            .select('*')
            .eq('company_id', id)
            .order('detected_at', { ascending: false })
            .limit(20)

        if (changesError) {
            console.error("Error fetching changes:", JSON.stringify(changesError, null, 2))
            // Fallback: Check if no data is an option
        } else {
            // Need to add 'source' if it doesn't exist in DB, infer from type
            const processedChanges = (changesData || []).map((change: any) => ({
                ...change,
                source: change.change_type === 'TEAM' ? 'linkedin' : 'website' // Simple inference
            }))
            setChanges(processedChanges)
        }

        setLoading(false)
    }

    useEffect(() => {
        fetchData()
    }, [id, supabase])

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading company intelligence...</div>
    }

    if (!company) {
        return <div className="p-8 text-center text-gray-500">Company not found.</div>
    }

    // Derived State
    const linkedinActivities = changes.filter(c => c.source === 'linkedin' || c.change_type === 'TEAM')
    const websiteActivities = changes.filter(c => c.source === 'website' || c.change_type !== 'TEAM')

    // AI Insight Mock (using real data structure)
    const recentHighSev = changes.find(c => c.severity > 7)
    const aiInsight = recentHighSev
        ? `Critical alert detected: ${recentHighSev.narrative}. Immediate attention recommended.`
        : "Steady growth patterns detected across all monitored channels. No critical anomalies in the last 30 days."

    return (
        <div className="flex flex-col gap-8 pb-12">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <Link href="/portfolio" className="text-gray-500 hover:text-white transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <h1 className="text-3xl font-bold text-white">{company.name}</h1>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400 pl-8">
                        <span>{company.stage}</span>
                        <span>•</span>
                        <span>{company.sector}</span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditModalOpen(true)}
                    >
                        Edit
                    </Button>
                    <Button variant="default" size="sm" className="bg-[#F1C086] text-black hover:bg-[#F1C086]/90">Generate Report</Button>
                </div>
            </div>

            {/* Main Grid Layout (Reference Design) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* AI Analysis Section (Span 2) */}
                <div className="lg:col-span-2 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2 text-[#8B8CFF]">
                            <Activity className="w-5 h-5" />
                            <span className="font-semibold">AI Analysis</span>
                        </div>
                        <div className="flex p-1 bg-black/20 rounded-lg border border-white/5">
                            {(['7d', '30d', '90d'] as const).map((range) => (
                                <button
                                    key={range}
                                    onClick={() => setTimeRange(range)}
                                    className={`px-3 py-1 text-xs rounded-md transition-all ${timeRange === range ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                                >
                                    {range}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 mb-6">
                        <p className="text-lg text-gray-200 leading-relaxed">
                            "{aiInsight}"
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-[#8B8CFF]/10 text-[#8B8CFF] border-[#8B8CFF]/20">Growth Signal</Badge>
                        <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Hiring Spree</Badge>
                    </div>
                </div>

                {/* Monitoring Status (Span 1) */}
                <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6">
                    <h3 className="text-gray-400 text-sm font-medium mb-6">Live Monitoring</h3>
                    <div className="space-y-6">
                        {/* LinkedIn */}
                        <div
                            className="flex items-center justify-between p-3 rounded-xl hover:bg-[#0077b5]/10 transition-all cursor-pointer group"
                            onClick={() => company.linkedin_company_url && window.open(company.linkedin_company_url, '_blank')}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#0077b5]/10 flex items-center justify-center border border-[#0077b5]/20 group-hover:border-[#0077b5]/50 transition-colors">
                                    <Linkedin className="w-5 h-5 text-[#0077b5]" />
                                </div>
                                <div>
                                    <div className="text-white font-medium group-hover:text-[#0077b5] transition-colors">LinkedIn</div>
                                    <div className="text-xs text-gray-500">Connected</div>
                                </div>
                            </div>
                            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        </div>

                        {/* Website */}
                        <div
                            className="flex items-center justify-between p-3 rounded-xl hover:bg-orange-500/10 transition-all cursor-pointer group"
                            onClick={() => company.website_url && window.open(company.website_url, '_blank')}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center border border-orange-500/20 group-hover:border-orange-500/50 transition-colors">
                                    <Globe className="w-5 h-5 text-orange-500" />
                                </div>
                                <div>
                                    <div className="text-white font-medium group-hover:text-orange-500 transition-colors">Website</div>
                                    <div className="text-xs text-gray-500">Active crawling</div>
                                </div>
                            </div>
                            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        </div>

                        {/* News (Non-clickable for now, but styled for consistency) */}
                        <div className="flex items-center justify-between p-3 rounded-xl hover:bg-purple-500/10 transition-all group">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20 group-hover:border-purple-500/50 transition-colors">
                                    <AlertTriangle className="w-5 h-5 text-purple-500" />
                                </div>
                                <div>
                                    <div className="text-white font-medium group-hover:text-purple-500 transition-colors">News & PR</div>
                                    <div className="text-xs text-gray-500">Scanning</div>
                                </div>
                            </div>
                            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        </div>
                    </div>
                </div>

                {/* Unified Activity Feed (Span 3 - Full Width) */}
                <div className="lg:col-span-3 bg-[#0E0E10] border border-white/10 rounded-2xl p-6 max-h-[600px] overflow-y-auto">
                    <ActivityFeed companyId={id} showHeader={false} />
                </div>

                {/* LinkedIn Feed (Span 3 - Full Width) */}
                <div className="lg:col-span-3 max-h-[700px] overflow-y-auto">
                    <LinkedinFeed companyId={id} />
                </div>

            </div>

            <EditCompanyModal
                company={company}
                open={editModalOpen}
                onOpenChange={setEditModalOpen}
                onUpdate={() => {
                    fetchData(); // Refresh data after update
                    router.refresh(); // Refresh server components if any (though here mostly client)
                }}
            />
        </div>
    )
}
