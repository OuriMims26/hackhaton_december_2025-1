"use client"

import { Bell, Search, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SidebarTrigger } from "@/components/ui/sidebar"

import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useEffect, useState, useRef } from "react"


export function Header() {
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const [initials, setInitials] = useState("OM")

    // Search State
    const [searchQuery, setSearchQuery] = useState("")
    const [searchResults, setSearchResults] = useState<{
        companies: any[],
        activities: any[]
    }>({ companies: [], activities: [] })
    const [isSearching, setIsSearching] = useState(false)
    const [showResults, setShowResults] = useState(false)
    const searchRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        async function getUser() {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                setUser(user)
                // Derive initials
                const fullName = user.user_metadata?.full_name
                if (fullName) {
                    const parts = fullName.split(' ')
                    if (parts.length >= 2) {
                        setInitials(`${parts[0][0]}${parts[1][0]}`.toUpperCase())
                    } else if (parts.length === 1) {
                        setInitials(parts[0].slice(0, 2).toUpperCase())
                    }
                } else if (user.email) {
                    setInitials(user.email.slice(0, 2).toUpperCase())
                }
            }
        }
        getUser()
    }, [])

    // Click outside to close search
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    // Debounced Search
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (!searchQuery.trim()) {
                setSearchResults({ companies: [], activities: [] })
                setIsSearching(false)
                return
            }

            setIsSearching(true)
            setShowResults(true)

            try {
                const query = searchQuery.trim()

                // Search Companies
                const { data: companies } = await supabase
                    .from('companies')
                    .select('id, name')
                    .ilike('name', `%${query}%`)
                    .limit(3)

                // Search Activities
                // Note: Searching on company name inside activities via Supabase join filter can be complex.
                // We will fetch more items matching summary OR fetch based on companies matching, then client side filter if needed to be perfect,
                // but standard OR filter on joined table requires correct syntax.
                // For now, sticking to summary as requested + trying to include company name matches via separate check or broader fetch?
                // User said: "must only work on the company name and the summary".
                // Simplest robust way: Select matches on summary.
                // AND Select matches where company name matches.
                // Supabase doesn't easily support OR across parent/child in one simple string query without exact known relation names.
                // Let's try to rely on summary for now and add explicit company name search if possible, or just fetch recent and filter JS (reliable but limited).
                // Actually, let's try the .or syntax with the join notation if Supabase supports it, otherwise fallback.
                // Let's stick to just summary for now to be safe on errors, and remove ai_analysis.
                // Wait, user explicitly asked for company name. 
                // Let's fetch where company name matches query first, get those IDs, then fetch activities? Too many requests.
                // Let's try: summary.ilike.%q%

                const companyIds = (companies || []).map(c => c.id)

                let activityQuery = supabase
                    .from('detected_changes')
                    .select(`
                        id,
                        summary,
                        detected_at,
                        companies!inner(name)
                    `)

                if (companyIds.length > 0) {
                    // Search by summary OR by company ID (if we found matching companies)
                    // Using .or with company_id.in is the cleanest way
                    activityQuery = activityQuery.or(`summary.ilike.%${query}%,company_id.in.(${companyIds.join(',')})`)
                } else {
                    activityQuery = activityQuery.ilike('summary', `%${query}%`)
                }

                const { data: activities } = await activityQuery
                    .order('detected_at', { ascending: false })
                    .limit(3)

                const mappedActivities = (activities || []).map(a => ({
                    ...a,
                    company_name: (a.companies as any)?.name || 'Unknown'
                }))

                setSearchResults({
                    companies: companies || [],
                    activities: mappedActivities
                })

            } catch (error) {
                console.error("Search error:", error)
            } finally {
                setIsSearching(false)
            }
        }, 300) // 300ms debounce

        return () => clearTimeout(timer)
    }, [searchQuery])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/')
        router.refresh()
    }

    const handleCompanyClick = (id: string) => {
        // Navigate or filter logic
        // For now, let's assume we go to portfolio page? 
        // Or if the user wants filtering, we might need a specific route logic.
        // Given request: "text displayed ... separation ... company only name"
        // I will just navigate to portfolio for companies, and maybe activities page for activities?
        // But the user didn't specify navigation, just display.
        // I'll make it log for now or assume activity navigation.
    }

    return (
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between bg-transparent px-6 backdrop-blur-md transition-all">
            <div className="flex items-center gap-4">
                <SidebarTrigger className="-ml-2 hover:bg-[#F1C086]/10 hover:text-[#F1C086]" />
                <div className="relative hidden md:block w-96" ref={searchRef}>
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search startups, founders, or alerts..."
                        className="pl-8 bg-secondary/50 border-white/5 focus-visible:ring-primary/50 relative z-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => {
                            if (searchQuery) setShowResults(true)
                        }}
                    />

                    {/* Search Results Dropdown */}
                    {showResults && (searchQuery.trim().length > 0) && (
                        <div className="absolute top-11 left-0 w-full bg-[#1A1A1A] border border-white/10 rounded-xl shadow-2xl p-2 z-50 overflow-hidden text-sm">
                            {isSearching ? (
                                <div className="p-4 flex items-center justify-center text-muted-foreground text-xs gap-2">
                                    <Loader2 className="w-3 h-3 animate-spin" /> Searching...
                                </div>
                            ) : (searchResults.companies.length === 0 && searchResults.activities.length === 0) ? (
                                <div className="p-4 text-center text-muted-foreground text-xs">
                                    No results found.
                                </div>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    {/* Companies Section */}
                                    {searchResults.companies.length > 0 && (
                                        <div className="mb-2">
                                            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                                Companies
                                            </div>
                                            {searchResults.companies.map((c) => (
                                                <div
                                                    key={c.id}
                                                    className="px-2 py-2 hover:bg-white/5 rounded-md cursor-pointer text-white font-medium transition-colors"
                                                    onClick={() => {
                                                        setShowResults(false)
                                                        setSearchQuery('')
                                                        router.push('/portfolio/' + c.id)
                                                    }}
                                                >
                                                    {c.name}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Activities Section */}
                                    {searchResults.activities.length > 0 && (
                                        <div>
                                            {searchResults.companies.length > 0 && <div className="h-px bg-white/5 my-2" />}
                                            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                                Activities
                                            </div>
                                            {searchResults.activities.map((a) => (
                                                <div
                                                    key={a.id}
                                                    className="px-2 py-2 hover:bg-white/5 rounded-md cursor-pointer transition-colors group"
                                                    onClick={() => {
                                                        setShowResults(false)
                                                        setSearchQuery('')
                                                        router.push('/activities/' + a.id)
                                                    }}
                                                >
                                                    <div className="flex items-center justify-between mb-0.5">
                                                        <span className="text-[#F1C086] font-medium text-xs">{a.company_name}</span>
                                                        <span className="text-muted-foreground text-[10px]">{new Date(a.detected_at).toLocaleDateString()}</span>
                                                    </div>
                                                    <div className="text-white/80 line-clamp-1 text-xs group-hover:text-white">
                                                        {a.summary}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-primary">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background" />
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-9 w-9 rounded-full ring-2 ring-white/10" suppressHydrationWarning>
                            <Avatar className="h-9 w-9">
                                <AvatarImage src="/avatar-placeholder.png" alt="@user" />
                                <AvatarFallback className="bg-gradient-to-br from-[#F1C086] to-[#F6B88C] text-[#0E0E10] font-bold">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">
                                    {user?.user_metadata?.full_name || 'User'}
                                </p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    {user?.email || ''}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Profile</DropdownMenuItem>
                        <DropdownMenuItem>Settings</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="text-red-500 focus:text-red-500 cursor-pointer"
                            onClick={handleLogout}
                        >
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header >
    )
}
