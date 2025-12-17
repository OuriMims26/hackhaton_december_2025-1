"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { LinkedinItem } from "@/components/dashboard/linkedin-item"
import { Input } from "@/components/ui/input"
import { Search, ChevronDown, Linkedin } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface LinkedinPost {
    id: string
    post_url: string
    post_content: string
    post_date: string
    likes_count: number
    comments_count: number
    shares_count: number
    sentiment: string
}

interface LinkedinFeedProps {
    companyId?: string
    showHeader?: boolean
}

export function LinkedinFeed({ companyId, showHeader = true }: LinkedinFeedProps) {
    const [posts, setPosts] = useState<LinkedinPost[]>([])
    const [loading, setLoading] = useState(true)
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
        async function fetchPosts() {
            setLoading(true)

            let query = supabase
                .from('linkedin_posts')
                .select('*')
                .order('post_date', { ascending: false })

            if (companyId) {
                query = query.eq('company_id', companyId)
            }

            const { data, error } = await query

            if (error) {
                console.error('Error fetching linkedin posts:', error)
            } else {
                setPosts(data as LinkedinPost[])
            }
            setLoading(false)
        }
        fetchPosts()
    }, [companyId])

    const filteredPosts = posts.filter(post => {
        // Search Filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            const match = post.post_content?.toLowerCase().includes(query)
            if (!match) return false
        }

        // Date Filter
        if (dateFilter !== 'all') {
            const date = new Date(post.post_date)
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
        <div className="flex flex-col gap-6 h-full">
            <div className="flex flex-col gap-4">
                {showHeader && (
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-[#0077b5]/10 flex items-center justify-center border border-[#0077b5]/20">
                                <Linkedin className="w-4 h-4 text-[#0077b5]" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                                    LinkedIn Feed
                                </h1>
                                <p className="text-muted-foreground text-sm">Recent posts from your company page.</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search posts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-muted-foreground focus-visible:ring-[#0077b5]"
                        />
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger className="h-9 px-3 min-w-[140px] rounded-md bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#0077b5] hover:bg-white/10 transition-colors cursor-pointer flex items-center justify-between outline-none">
                            {getDateFilterLabel(dateFilter)}
                            <ChevronDown className="w-4 h-4 opacity-50" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-[#1A1A1A] border-white/10 text-white min-w-[140px]">
                            {['all', '1w', '1m', '3m', '6m'].map((filter) => (
                                <DropdownMenuItem
                                    key={filter}
                                    className="focus:bg-white/10 focus:text-white cursor-pointer"
                                    onClick={() => setDateFilter(filter)}
                                >
                                    {getDateFilterLabel(filter)}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <div className="flex-1 relative min-h-0 bg-[#0E0E10] border border-white/10 rounded-2xl p-6">
                <ScrollArea className="h-full pr-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
                        {loading ? (
                            <div className="col-span-full text-center text-muted-foreground p-8">Loading posts...</div>
                        ) : filteredPosts.length === 0 ? (
                            <div className="col-span-full text-center text-muted-foreground p-8">No posts found.</div>
                        ) : (
                            filteredPosts.map((post) => (
                                <LinkedinItem
                                    key={post.id}
                                    id={post.id}
                                    content={post.post_content}
                                    date={new Date(post.post_date).toLocaleDateString()}
                                    url={post.post_url}
                                    metrics={{
                                        likes: post.likes_count,
                                        comments: post.comments_count,
                                        shares: post.shares_count
                                    }}
                                    sentiment={post.sentiment}
                                />
                            ))
                        )}
                    </div>
                </ScrollArea>
            </div>
        </div>
    )
}
