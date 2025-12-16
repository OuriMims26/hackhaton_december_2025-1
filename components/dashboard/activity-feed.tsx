"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { ActivityItem } from "@/components/dashboard/activity-item"

interface Activity {
    id: string
    source: string
    severity: number
    company: string
    title: string
    description: string
    created_at: string
    time?: string
}

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"

interface ActivityFeedProps {
    companyId?: string
    showHeader?: boolean
}

export function ActivityFeed({ companyId, showHeader = true }: ActivityFeedProps) {
    const [activities, setActivities] = useState<Activity[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [dateFilter, setDateFilter] = useState('all')

    const getDateFilterLabel = (value: string) => {
        switch (value) {
            case '1w': return 'Last Week'
            case '1m': return 'Last Month'
            case '3m': return 'Last 3 Months'
            case '6m': return 'Last 6 Months'
            default: return 'All Time'
        }
    }

    useEffect(() => {
        async function fetchActivities() {
            setLoading(true)
            // Fetch detected changes from Supabase
            let query = supabase
                .from('detected_changes')
                .select(`
                    id,
                    change_type,
                    summary,
                    ai_analysis,
                    severity,
                    detected_at,
                    source,
                    companies (
                        name
                    )
                `)
                .order('detected_at', { ascending: false })

            if (companyId) {
                query = query.eq('company_id', companyId)
            }

            const { data, error } = await query

            if (error) {
                console.error('Error fetching activities:', error)
            } else {
                const mapped = (data || []).map(item => {
                    const companyName = (item.companies as any)?.name || 'Unknown Company'

                    return {
                        id: item.id,
                        source: (item as any).source || 'website',
                        severity: item.severity,
                        company: companyName,
                        title: item.summary || 'Detected Change',
                        description: item.ai_analysis || item.summary || 'No description available',
                        created_at: item.detected_at,
                        time: new Date(item.detected_at).toLocaleDateString()
                    }
                })
                setActivities(mapped as any)
            }
            setLoading(false)
        }
        fetchActivities()
    }, [companyId])

    const filteredActivities = activities.filter(activity => {
        // Tab Filter
        if (activeTab === 'warnings' && activity.severity < 7) return false
        if (activeTab === 'linkedin' && activity.source !== 'linkedin') return false
        if (activeTab === 'website' && activity.source === 'linkedin') return false

        // Search Filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            const match =
                activity.company.toLowerCase().includes(query) ||
                activity.title.toLowerCase().includes(query) ||
                activity.description.toLowerCase().includes(query)
            if (!match) return false
        }

        // Date Filter
        if (dateFilter !== 'all') {
            const date = new Date(activity.created_at)
            const now = new Date()
            let cutoff = new Date()

            switch (dateFilter) {
                case '1w':
                    cutoff.setDate(now.getDate() - 7)
                    break
                case '1m':
                    cutoff.setMonth(now.getMonth() - 1)
                    break
                case '3m':
                    cutoff.setMonth(now.getMonth() - 3)
                    break
                case '6m':
                    cutoff.setMonth(now.getMonth() - 6)
                    break
                default:
                    return true
            }

            if (date < cutoff) return false
        }

        return true
    })

    return (
        // For portfolio we might want flexible height, but for main page 100vh-8rem. 
        // I will use h-full and let container control it or provide a prop.
        // For now, I'll stick to h-full and let parent constrain.
        <div className="flex flex-col gap-6 h-full">
            <div className="flex flex-col gap-4">
                {showHeader && (
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                                Activity Feed
                            </h1>
                            <p className="text-muted-foreground">Real-time updates from your portfolio.</p>
                        </div>
                    </div>
                )}

                <div className="flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search activities..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-muted-foreground focus-visible:ring-[#F1C086]"
                        />
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger className="h-9 px-3 min-w-[140px] rounded-md bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#F1C086] hover:bg-white/10 transition-colors cursor-pointer flex items-center justify-between outline-none">
                            {getDateFilterLabel(dateFilter)}
                            <ChevronDown className="w-4 h-4 opacity-50" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-[#1A1A1A] border-white/10 text-white min-w-[140px]">
                            <DropdownMenuItem
                                className="focus:bg-white/10 focus:text-white cursor-pointer"
                                onClick={() => setDateFilter('all')}
                            >
                                All Time
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="focus:bg-white/10 focus:text-white cursor-pointer"
                                onClick={() => setDateFilter('1w')}
                            >
                                Last Week
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="focus:bg-white/10 focus:text-white cursor-pointer"
                                onClick={() => setDateFilter('1m')}
                            >
                                Last Month
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="focus:bg-white/10 focus:text-white cursor-pointer"
                                onClick={() => setDateFilter('3m')}
                            >
                                Last 3 Months
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="focus:bg-white/10 focus:text-white cursor-pointer"
                                onClick={() => setDateFilter('6m')}
                            >
                                Last 6 Months
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-1 flex flex-col min-h-0">
                <TabsList className="w-full justify-start bg-transparent border-b border-white/10 rounded-none p-0 h-auto shrink-0">
                    <TabsTrigger value="all" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#F1C086] data-[state=active]:text-[#F1C086] rounded-none px-6 py-3">All Activity</TabsTrigger>
                    <TabsTrigger value="linkedin" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#8B8CFF] data-[state=active]:text-[#8B8CFF] rounded-none px-6 py-3">LinkedIn</TabsTrigger>
                    <TabsTrigger value="website" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 data-[state=active]:text-emerald-500 rounded-none px-6 py-3">Website Changes</TabsTrigger>
                    <TabsTrigger value="warnings" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-amber-500 data-[state=active]:text-amber-500 rounded-none px-6 py-3">Warnings</TabsTrigger>
                </TabsList>

                <div className="mt-6 flex-1 relative min-h-0">
                    <ScrollArea className="h-full pr-4">
                        <div className="flex flex-col gap-4 pb-20">
                            {loading ? (
                                <div className="text-center text-muted-foreground p-8">Loading activities...</div>
                            ) : filteredActivities.length === 0 ? (
                                <div className="text-center text-muted-foreground p-8">No activities found matching your criteria.</div>
                            ) : (
                                filteredActivities.map((activity) => (
                                    <ActivityItem
                                        key={activity.id}
                                        id={activity.id}
                                        source={activity.source}
                                        severity={activity.severity}
                                        company={activity.company}
                                        title={activity.title}
                                        description={activity.description}
                                        time={activity.time || activity.created_at}
                                    />
                                ))
                            )}
                        </div>
                    </ScrollArea>
                </div>
            </Tabs>
        </div>
    )
}
