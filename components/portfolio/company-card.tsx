"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Globe, Linkedin } from "lucide-react"
import Link from "next/link"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface CompanyCardProps {
    id: string
    name: string
    website_url?: string
    linkedin_company_url?: string
    sector: string
    stage: string
    logo_url?: string
}

export function CompanyCard({ id, name, website_url, linkedin_company_url, sector, stage, logo_url }: Omit<CompanyCardProps, 'status'>) {
    return (
        <Link href={`/portfolio/${id}`}>
            <Card className="h-full bg-card/50 backdrop-blur border-white/5 hover:border-[#F1C086]/50 hover:shadow-[0_0_20px_rgba(139,140,255,0.1)] transition-all duration-300 group cursor-pointer relative overflow-hidden">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                    <div className="flex items-start gap-3">
                        <Avatar className="w-12 h-12 rounded-lg border border-white/10 flex-shrink-0">
                            <AvatarImage src={logo_url} className="object-cover" />
                            <AvatarFallback className="rounded-lg bg-[#F1C086]/10 text-[#F1C086] text-lg font-bold">
                                {name.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle className="text-base font-semibold text-white group-hover:text-[#F1C086] transition-colors leading-tight mt-1">
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
