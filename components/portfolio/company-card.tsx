"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Globe, Linkedin, ShieldAlert } from "lucide-react"
import Link from "next/link"

interface CompanyCardProps {
    id: string
    name: string
    industry: string
    stage: string
    website: string
    status: 'active' | 'watch' | 'warning'
    lastActivity: string
}

export function CompanyCard({ id, name, industry, stage, website, status, lastActivity }: CompanyCardProps) {
    return (
        <Link href={`/portfolio/${id}`}>
            <Card className="h-full bg-card/50 backdrop-blur border-white/5 hover:border-[#8B8CFF]/50 hover:shadow-[0_0_20px_rgba(139,140,255,0.1)] transition-all duration-300 group cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold
              ${status === 'warning' ? 'bg-amber-500/10 text-amber-500' :
                                status === 'watch' ? 'bg-blue-500/10 text-blue-500' :
                                    'bg-emerald-500/10 text-emerald-500'}`}>
                            {name.charAt(0)}
                        </div>
                        <div>
                            <CardTitle className="text-base font-semibold text-white group-hover:text-[#8B8CFF] transition-colors">
                                {name}
                            </CardTitle>
                            <p className="text-xs text-muted-foreground">{industry}</p>
                        </div>
                    </div>
                    {status === 'warning' && (
                        <ShieldAlert className="h-5 w-5 text-amber-500 animate-pulse" />
                    )}
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                        <Badge variant="outline" className="text-xs font-normal border-white/10 text-gray-400">
                            {stage}
                        </Badge>
                        <Badge variant="outline" className="text-xs font-normal border-white/10 text-gray-400">
                            {lastActivity}
                        </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-auto">
                        <div className="flex items-center gap-1 hover:text-white transition-colors" title={website}>
                            <Globe className="w-3 h-3" /> Website
                        </div>
                        <div className="flex items-center gap-1 hover:text-white transition-colors">
                            <Linkedin className="w-3 h-3" /> LinkedIn
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}
