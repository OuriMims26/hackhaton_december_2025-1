import { ExternalLink, Linkedin, ThumbsUp, MessageSquare, Share2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface LinkedinItemProps {
    id: string
    content: string
    date: string
    url?: string
    metrics?: {
        likes: number
        comments: number
        shares: number
    }
    sentiment?: string
    author?: {
        name: string
        role: string
    }
}

export function LinkedinItem({ id, content, date, url, metrics, sentiment, author }: LinkedinItemProps) {

    const getSentimentColor = (sentiment?: string) => {
        switch (sentiment?.toLowerCase()) {
            case 'positive': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
            case 'negative': return 'bg-red-500/10 text-red-500 border-red-500/20'
            case 'neutral': return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
            default: return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
        }
    }

    return (
        <div className="bg-[#1A1A1A] border border-white/20 rounded-xl p-5 hover:border-white/40 transition-all group flex flex-col gap-4">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#0077b5]/10 flex items-center justify-center border border-[#0077b5]/20">
                        <Linkedin className="w-4 h-4 text-[#0077b5]" />
                    </div>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            {author && <span className="text-sm font-medium text-white">{author.name}</span>}
                            <span className="text-sm text-gray-400">• {date}</span>
                        </div>
                        {author && <span className="text-xs text-gray-500">{author.role}</span>}
                    </div>
                </div>
                {sentiment && (
                    <Badge variant="outline" className={`${getSentimentColor(sentiment)} border`}>
                        {sentiment}
                    </Badge>
                )}
            </div>

            {/* Content */}
            <div className="text-white text-sm leading-relaxed whitespace-pre-wrap line-clamp-4">
                {content}
            </div>

            {/* Footer / Metrics */}
            <div className="flex items-center justify-between pt-2 border-t border-white/10 mt-auto">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>{metrics?.likes || 0}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{metrics?.comments || 0}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                        <Share2 className="w-3.5 h-3.5" />
                        <span>{metrics?.shares || 0}</span>
                    </div>
                </div>

                {url && (
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-[#0077b5] hover:underline"
                    >
                        View Post <ExternalLink className="w-3 h-3" />
                    </a>
                )}
            </div>
        </div>
    )
}
