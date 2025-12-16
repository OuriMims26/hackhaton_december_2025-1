"use client"

import { ActivityItem } from "@/components/dashboard/activity-item"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"

interface RecentActivityItem {
    name: string
    change: string
    narrative: string
    source: string
    severity: number
    description: string
    time: string
}

export function RecentActivity() {
    const router = useRouter()
    const [activeFilter, setActiveFilter] = useState('all')
    const [activities, setActivities] = useState<RecentActivityItem[]>([])
    const [loading, setLoading] = useState(true)

    const onNavigateToActivities = () => {
        router.push('/activities')
    }

    useEffect(() => {
        async function fetchActivities() {
            setLoading(true)
            // Base query
            let query = supabase
                .from('detected_changes')
                .select(`
            id,
            summary,
            ai_analysis,
            severity,
            change_type,
            detected_at,
            source,
            companies (
                name
            )
        `)
                .order('detected_at', { ascending: false })
                .limit(4)

            const { data, error } = await query

            if (error) {
                console.error('Error fetching dashboard activities:', error)
            } else {
                const mapped = (data || []).map(item => {
                    const companyName = (item.companies as any)?.name || 'Unknown'

                    return {
                        id: item.id,
                        name: companyName,
                        change: new Date(item.detected_at).toLocaleDateString(),
                        narrative: item.summary,
                        description: item.ai_analysis || item.summary,
                        source: item.source || 'website',
                        severity: item.severity || 0,
                        time: new Date(item.detected_at).toLocaleDateString()
                    }
                })
                setActivities(mapped as any)
            }
            setLoading(false)
        }

        fetchActivities()
    }, [])

    const filteredCompanies = activeFilter === 'all'
        ? activities
        : activities.filter(a => {
            if (activeFilter === 'warning') return a.severity >= 7
            if (activeFilter === 'linkedin') return a.source === 'linkedin'
            if (activeFilter === 'website') return a.source !== 'linkedin'
            return true
        })

    return (
        <div className="bg-[#1A1A1A] border border-white/20 rounded-xl p-6 h-[550px] flex flex-col">
            <div className="flex items-center justify-between mb-6 shrink-0">
                <h2 className="text-white text-lg">Recent Activity</h2>
                <button onClick={onNavigateToActivities} className="text-[#6B7280] text-sm hover:text-white transition-colors">See all</button>
            </div>

            {/* Tabs horizontaux */}
            <div className="flex gap-1 mb-6 p-1 shrink-0">
                <button
                    onClick={() => setActiveFilter('all')}
                    className={`flex-1 flex items-center justify-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium outline-none transition-all ring-sidebar-ring focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 ${activeFilter === 'all'
                        ? 'bg-[#F1C086]/10 text-[#F1C086] shadow-sm'
                        : 'text-muted-foreground hover:bg-[#F1C086]/10 hover:text-[#F1C086]'
                        }`}
                >
                    All
                </button>
                <button
                    onClick={() => setActiveFilter('linkedin')}
                    className={`flex-1 flex items-center justify-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium outline-none transition-all ring-sidebar-ring focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 ${activeFilter === 'linkedin'
                        ? 'bg-[#F1C086]/10 text-[#F1C086] shadow-sm'
                        : 'text-muted-foreground hover:bg-[#F1C086]/10 hover:text-[#F1C086]'
                        }`}
                >
                    LinkedIn
                </button>
                <button
                    onClick={() => setActiveFilter('website')}
                    className={`flex-1 flex items-center justify-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium outline-none transition-all ring-sidebar-ring focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 ${activeFilter === 'website'
                        ? 'bg-[#F1C086]/10 text-[#F1C086] shadow-sm'
                        : 'text-muted-foreground hover:bg-[#F1C086]/10 hover:text-[#F1C086]'
                        }`}
                >
                    Website
                </button>
                <button
                    onClick={() => setActiveFilter('warning')}
                    className={`flex-1 flex items-center justify-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium outline-none transition-all ring-sidebar-ring focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 ${activeFilter === 'warning'
                        ? 'bg-[#F1C086]/10 text-[#F1C086] shadow-sm'
                        : 'text-muted-foreground hover:bg-[#F1C086]/10 hover:text-[#F1C086]'
                        }`}
                >
                    Warnings
                </button>
            </div>

            {loading ? (
                <div className="flex-1 flex justify-center items-center">
                    <Loader2 className="w-8 h-8 text-[#F1C086] animate-spin" />
                </div>
            ) : (
                <div className="space-y-1 overflow-y-auto pr-1">
                    {filteredCompanies.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-gray-500">Aucune activité récente</div>
                    ) : (
                        filteredCompanies.map((company: any, index) => (
                            <ActivityItem
                                key={index}
                                id={company.id}
                                source={company.source}
                                severity={company.severity}
                                company={company.name}
                                title={company.narrative}
                                description={company.description}
                                time={company.time}
                            />
                        ))
                    )}
                </div>
            )}
        </div>
    )
}
