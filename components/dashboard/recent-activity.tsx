"use client"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"

interface RecentActivityItem {
    name: string
    change: string
    narrative: string
    type: string
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
                    // Map types to filter keys
                    let filterType = 'website'
                    if (item.severity >= 7) filterType = 'alert' // 'alert' matches user code 'Warnings' filter key
                    // If we had a source field, we'd map 'linkedin' too. 
                    // For now, let's assume some heuristics or just map standard types.
                    // Schema has 'change_type'. 
                    // Let's assume: 
                    // 'TEAM', 'TRACTION' -> LinkedIn (often) or keep as website if unknown.
                    // For this demo, let's map 'TEAM' to linkedin.
                    if (item.source === 'linkedin') filterType = 'linkedin'

                    return {
                        name: (item.companies as any)?.name || 'Unknown',
                        change: new Date(item.detected_at).toLocaleDateString(),
                        narrative: item.summary,
                        type: filterType
                    }
                })
                setActivities(mapped)
            }
            setLoading(false)
        }

        fetchActivities()
    }, []) // Verify if we want to re-fetch on filter change or just filter client side. 
    // The user code suggests client side filtering of a fetched list, or fetching based on filter.
    // Given "filteredCompanies" in user code implies client side usually, but purely client side on 5 items is small.
    // Let's do client side filtering on the 5 items fetched? Or fetch more?
    // Let's fetch more (20) and filter client side for better UX.

    const filteredCompanies = activeFilter === 'all'
        ? activities
        : activities.filter(a => a.type === activeFilter)

    return (
        <div className="bg-[#1A1A1A] border border-white/20 rounded-xl p-6 h-[600px] flex flex-col">
            <div className="flex items-center justify-between mb-6 shrink-0">
                <h2 className="text-white text-lg">Activité récente</h2>
                <button onClick={onNavigateToActivities} className="text-[#6B7280] text-sm hover:text-white transition-colors">Voir tout</button>
            </div>

            {/* Tabs horizontaux */}
            <div className="flex gap-2 mb-6 p-1 bg-white/5 rounded-lg border border-white/10 overflow-x-auto shrink-0">
                <button
                    onClick={() => setActiveFilter('all')}
                    className={`flex-1 px-4 py-2.5 rounded-lg transition-all whitespace-nowrap ${activeFilter === 'all'
                        ? 'bg-gradient-to-r from-[#F1C086] to-[#F6B88C] text-white shadow-lg shadow-[#F1C086]/20'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                >
                    All
                </button>
                <button
                    onClick={() => setActiveFilter('linkedin')}
                    className={`flex-1 px-4 py-2.5 rounded-lg transition-all whitespace-nowrap ${activeFilter === 'linkedin'
                        ? 'bg-gradient-to-r from-[#F1C086] to-[#F6B88C] text-white shadow-lg shadow-[#F1C086]/20'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                >
                    LinkedIn
                </button>
                <button
                    onClick={() => setActiveFilter('website')}
                    className={`flex-1 px-4 py-2.5 rounded-lg transition-all whitespace-nowrap ${activeFilter === 'website'
                        ? 'bg-gradient-to-r from-[#F1C086] to-[#F6B88C] text-white shadow-lg shadow-[#F1C086]/20'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                >
                    Website
                </button>
                <button
                    onClick={() => setActiveFilter('alert')}
                    className={`flex-1 px-4 py-2.5 rounded-lg transition-all whitespace-nowrap ${activeFilter === 'alert'
                        ? 'bg-gradient-to-r from-[#F1C086] to-[#F6B88C] text-white shadow-lg shadow-[#F1C086]/20'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
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
                <div className="space-y-4 overflow-y-auto pr-1">
                    {filteredCompanies.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-gray-500">Aucune activité récente</div>
                    ) : (
                        filteredCompanies.map((company, index) => (
                            <div
                                key={index}
                                className="bg-[#1A1A1A] border border-white/20 rounded-xl p-4 hover:border-white/40 transition-all cursor-pointer"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="font-semibold text-[#f1c086]">{company.name}</div>
                                    <div className="text-[#6B7280] text-sm">{company.change}</div>
                                </div>
                                <div className="text-white text-sm leading-relaxed font-extrabold line-clamp-2">
                                    {company.narrative}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    )
}
