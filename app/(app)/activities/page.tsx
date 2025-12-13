"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Globe, Linkedin, ShieldAlert, ExternalLink } from "lucide-react"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"

interface Activity {
    id: string
    type: 'linkedin' | 'website' | 'warning'
    company: string
    title: string
    description: string
    created_at: string
    time?: string // Optional UI helper
}

export default function ActivitiesPage() {
    const [activities, setActivities] = useState<Activity[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchActivities() {
            // Fetch detected changes from Supabase
            // Note: asking for companies(name) assumes foreign key setup allows generic join
            const { data, error } = await supabase
                .from('detected_changes')
                .select(`
                    id,
                    change_type,
                    summary,
                    ai_analysis,
                    severity,
                    detected_at,
                    companies (
                        name
                    )
                `)
                .order('detected_at', { ascending: false })

            if (error) {
                console.error('Error fetching activities:', error)
            } else {
                const mapped = (data || []).map(item => {
                    const companyName = (item.companies as any)?.name || 'Unknown Company'

                    // Determine type based on severity or change_type
                    // High severity = warning
                    // Otherwise typically 'website' change based on the table definition
                    let type: 'website' | 'warning' | 'linkedin' = 'website'
                    if (item.severity >= 7) {
                        type = 'warning'
                    }

                    return {
                        id: item.id,
                        type,
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
    }, [])

    return (
        <div className="flex flex-col gap-6 h-[calc(100vh-8rem)]">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        Activity Feed
                    </h1>
                    <p className="text-muted-foreground">Real-time updates from your portfolio.</p>
                </div>
            </div>

            <Tabs defaultValue="all" className="w-full h-full flex flex-col">
                <TabsList className="w-full justify-start bg-transparent border-b border-white/10 rounded-none p-0 h-auto">
                    <TabsTrigger value="all" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#F1C086] data-[state=active]:text-[#F1C086] rounded-none px-6 py-3">All Activity</TabsTrigger>
                    <TabsTrigger value="linkedin" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#8B8CFF] data-[state=active]:text-[#8B8CFF] rounded-none px-6 py-3">LinkedIn</TabsTrigger>
                    <TabsTrigger value="website" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 data-[state=active]:text-emerald-500 rounded-none px-6 py-3">Website Changes</TabsTrigger>
                    <TabsTrigger value="warnings" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-amber-500 data-[state=active]:text-amber-500 rounded-none px-6 py-3">Warnings</TabsTrigger>
                </TabsList>

                <div className="mt-6 flex-1 overflow-hidden relative">
                    <ScrollArea className="h-full pr-4">
                        <div className="flex flex-col gap-4 pb-20">
                            {loading ? (
                                <div className="text-center text-muted-foreground p-8">Loading activities...</div>
                            ) : activities.length === 0 ? (
                                <div className="text-center text-muted-foreground p-8">No activities found.</div>
                            ) : (
                                activities.map((activity) => (
                                    <ActivityItem
                                        key={activity.id}
                                        type={activity.type}
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

function ActivityItem({ type, company, title, description, time }: { type: 'linkedin' | 'website' | 'warning', company: string, title: string, description: string, time: string }) {
    const icon = {
        linkedin: <Linkedin className="w-5 h-5 text-[#8B8CFF]" />,
        website: <Globe className="w-5 h-5 text-emerald-500" />,
        warning: <ShieldAlert className="w-5 h-5 text-amber-500" />
    }[type]

    const colorClass = {
        linkedin: "border-[#8B8CFF]/20 bg-[#8B8CFF]/5 hover:border-[#8B8CFF]/50",
        website: "border-emerald-500/20 bg-emerald-500/5 hover:border-emerald-500/50",
        warning: "border-amber-500/20 bg-amber-500/5 hover:border-amber-500/50"
    }[type]

    return (
        <Card className={`border ${colorClass} transition-colors backdrop-blur-sm`}>
            <CardContent className="p-4 flex gap-4 items-start">
                <div className="p-3 rounded-xl bg-background/50 border border-white/5">
                    {icon}
                </div>
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-semibold text-white">{title}</h3>
                            <p className="text-sm text-[#F1C086] font-medium">{company}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">{time}</span>
                    </div>
                    <p className="text-sm text-gray-400 mt-1 leading-relaxed">
                        {description}
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                        <Badge variant="secondary" className="bg-white/5 hover:bg-white/10 text-xs">
                            View Details <ExternalLink className="w-3 h-3 ml-1" />
                        </Badge>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
