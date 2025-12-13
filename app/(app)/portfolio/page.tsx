"use client"

import { Input } from "@/components/ui/input"
import { Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CompanyCard } from "@/components/portfolio/company-card"
import { AddCompanyModal } from "@/components/portfolio/add-company-modal"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"

interface Company {
    id: string
    name: string
    industry: string
    stage: string
    website: string
    status: 'active' | 'watch' | 'warning'
    last_activity: string
}

export default function PortfolioPage() {
    const [companies, setCompanies] = useState<Company[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchCompanies() {
            const { data, error } = await supabase
                .from('companies')
                .select('*')

            if (error) {
                console.error('Error fetching companies:', error)
            } else {
                // Map database fields to UI fields if necessary, or ensure DB columns match
                // Assuming DB has snake_case 'last_activity' which matches interface above
                // If DB uses camelCase, we might need mapping. 
                // For now, type assertion or mapping:
                const mappedData = (data || []).map(item => ({
                    ...item,
                    lastActivity: item.last_activity || 'Just now', // Ensure fallback
                    status: item.status || 'active'
                }))
                setCompanies(mappedData as any)
            }
            setLoading(false)
        }

        fetchCompanies()
    }, [])

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        Portfolio
                    </h1>
                    <p className="text-muted-foreground">Manage and track your portfolio companies.</p>
                </div>
                <AddCompanyModal />
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row items-center gap-4 bg-card/30 p-4 rounded-xl border border-white/5">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search companies..."
                        className="pl-8 bg-background/50 border-white/5"
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    <Button variant="secondary" size="sm" className="bg-[#8B8CFF]/10 text-[#8B8CFF] hover:bg-[#8B8CFF]/20 border border-[#8B8CFF]/20">All</Button>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-white">High Activity</Button>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-white">Warnings</Button>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-white">Inactive</Button>
                    <Button variant="outline" size="icon" className="ml-auto md:ml-2">
                        <Filter className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {loading ? (
                    <div className="col-span-full flex items-center justify-center p-12 text-muted-foreground">
                        Loading companies...
                    </div>
                ) : companies.length === 0 ? (
                    <div className="col-span-full flex items-center justify-center p-12 text-muted-foreground">
                        No companies found or database connection error.
                    </div>
                ) : (
                    companies.map((company) => (
                        <CompanyCard
                            key={company.id}
                            {...company}
                            lastActivity={company.last_activity || 'Unknown'} // Handle mapping
                        />
                    ))
                )}
            </div>
        </div>
    )
}
