import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, Activity, Bell, Globe, Linkedin } from "lucide-react"

export default function DashboardPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                    Dashboard
                </h1>
                <div className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-sm font-medium border border-emerald-500/20">
                    Last updated: Just now
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <KpiCard
                    title="Active Startups"
                    value="24"
                    change="+2 new"
                    icon={<Globe className="h-4 w-4" />}
                    trend="up"
                />
                <KpiCard
                    title="Critical Warnings"
                    value="3"
                    change="Needs attention"
                    icon={<Bell className="h-4 w-4 text-amber-500" />}
                    trend="down"
                />
                <KpiCard
                    title="Website Changes"
                    value="12"
                    change="Past 24h"
                    icon={<Activity className="h-4 w-4 text-purple-400" />}
                    trend="neutral"
                />
                <KpiCard
                    title="Founder Posts"
                    value="156"
                    change="+12%"
                    icon={<Linkedin className="h-4 w-4 text-blue-400" />}
                    trend="up"
                />
            </div>

            {/* Charts Placeholder */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 bg-card/50">
                    <CardHeader>
                        <CardTitle>Activity Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
                        Chart: Distribution (Needs Recharts)
                    </CardContent>
                </Card>
                <Card className="col-span-3 bg-card/50">
                    <CardHeader>
                        <CardTitle>Top Warnings</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
                        List: Warnings Progress
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

function KpiCard({ title, value, change, icon, trend }: { title: string, value: string, change: string, icon: React.ReactNode, trend: 'up' | 'down' | 'neutral' }) {
    return (
        <Card className="bg-card/50 backdrop-blur border-white/5 hover:border-[#F1C086]/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                    {trend === 'up' && <ArrowUpRight className="mr-1 h-3 w-3 text-emerald-500" />}
                    {trend === 'down' && <ArrowUpRight className="mr-1 h-3 w-3 text-red-500 rotate-90" />}
                    <span className={trend === 'up' ? "text-emerald-500" : trend === 'down' ? "text-red-500" : ""}>
                        {change}
                    </span>
                </div>
            </CardContent>
        </Card>
    )
}
