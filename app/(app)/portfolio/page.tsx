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
    sector: string
    stage: string
    website_url?: string
    linkedin_company_url?: string
    status: 'active' | 'watch' | 'warning'
    last_activity: string
}

export default function PortfolioPage() {
    const [companies, setCompanies] = useState<Company[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'watch' | 'warning'>('all')

    useEffect(() => {
        async function fetchCompanies() {
            const { data, error } = await supabase
                .from('companies')
                .select('*')

            if (error) {
                console.error('Error fetching companies:', error)
            } else {
                // Map database fields to UI fields if necessary, or ensure DB columns match
                const mappedData = (data || []).map(item => ({
                    ...item,
                    website_url: item.website_url,
                    linkedin_company_url: item.linkedin_company_url,
                    sector: item.sector,
                    status: item.status || 'active'
                }))
                setCompanies(mappedData as any)
            }
            setLoading(false)
        }

        fetchCompanies()
    }, [])

    const filteredCompanies = companies.filter(company => {
        const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (company.sector && company.sector.toLowerCase().includes(searchQuery.toLowerCase()))
        const matchesStatus = statusFilter === 'all' || company.status === statusFilter
        return matchesSearch && matchesStatus
    })

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
                        className="pl-8 bg-background/50 border-white/5 focus:border-[#F1C086]/50 transition-colors"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setStatusFilter('all')}
                        className={`transition-all ${statusFilter === 'all' ? 'bg-white/10 text-white' : 'text-muted-foreground hover:text-white'}`}
                    >
                        All
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setStatusFilter('watch')}
                        className={`transition-all ${statusFilter === 'watch' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' : 'text-muted-foreground hover:text-blue-500'}`}
                    >
                        Watch
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setStatusFilter('warning')}
                        className={`transition-all ${statusFilter === 'warning' ? 'bg-[#F1C086]/10 text-[#F1C086] border border-[#F1C086]/20' : 'text-muted-foreground hover:text-[#F1C086]'}`}
                    >
                        Warnings
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setStatusFilter('active')}
                        className={`transition-all ${statusFilter === 'active' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'text-muted-foreground hover:text-emerald-500'}`}
                    >
                        Active
                    </Button>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {loading ? (
                    <div className="col-span-full flex items-center justify-center p-12 text-muted-foreground">
                        Loading companies...
                    </div>
                ) : filteredCompanies.length === 0 ? (
                    <div className="col-span-full flex items-center justify-center p-12 text-muted-foreground">
                        No companies found.
                    </div>
                ) : (
                    filteredCompanies.map((company) => (
                        <CompanyCard
                            key={company.id}
                            {...company}
                        />
                    ))
                )}
            </div>
        </div>
    )
}
