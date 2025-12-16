"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Globe, Linkedin } from "lucide-react"
import Link from "next/link"

interface CompanyCardProps {
    id: string
    name: string
    website_url?: string
    linkedin_company_url?: string
    sector: string
    stage: string

}

export function CompanyCard({ id, name, website_url, linkedin_company_url, sector, stage }: Omit<CompanyCardProps, 'status'>) {
    return (
        <Link href={`/portfolio/${id}`}>
            <Card className="h-full bg-card/50 backdrop-blur border-white/5 hover:border-[#F1C086]/50 hover:shadow-[0_0_20px_rgba(139,140,255,0.1)] transition-all duration-300 group cursor-pointer relative overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold bg-[#F1C086]/10 text-[#F1C086]">
                            {name.charAt(0)}
                        </div>
                        <div>
                            <CardTitle className="text-base font-semibold text-white group-hover:text-[#F1C086] transition-colors">
                                {name}
                            </CardTitle>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                        <Badge variant="outline" className="text-xs font-normal border-[#F1C086]/10 text-[#F1C086]">
                            {stage}
                        </Badge>
                        <Badge variant="outline" className="text-xs font-normal border-[#F1C086]/10 text-[#F1C086]">
                            {sector}
                        </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-auto">
                        <div
                            className="flex items-center gap-1 hover:text-[#F1C086] transition-colors cursor-pointer z-10"
                            title={website_url}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (website_url) window.open(website_url.startsWith('http') ? website_url : `https://${website_url}`, '_blank');
                            }}
                        >
                            <Globe className="w-3 h-3" /> Website
                        </div>
                        <div
                            className="flex items-center gap-1 hover:text-[#F1C086] transition-colors cursor-pointer z-10"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (linkedin_company_url) window.open(linkedin_company_url, '_blank');
                            }}
                        >
                            <Linkedin className="w-3 h-3" /> LinkedIn
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}
