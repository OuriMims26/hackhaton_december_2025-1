import { Globe, Linkedin, ShieldAlert } from "lucide-react"

interface ActivityItemProps {
    source: string
    severity: number
    company: string
    title: string
    description: string
    time: string
}

export function ActivityItem({ source, severity, company, title, description, time }: ActivityItemProps) {
    // Logic moved here as requested
    const isLinkedin = source === 'linkedin'
    // If source isn't exactly linkedin, we default to website icon

    // Warning logic: severity >= 7
    const isWarning = severity >= 7

    const icon = isLinkedin
        ? <Linkedin className="w-5 h-5 text-[#8B8CFF]" />
        : <Globe className="w-5 h-5 text-emerald-500" />

    const warningIcon = isWarning ? <ShieldAlert className="w-5 h-5 text-amber-500" /> : null


    return (
        <div className="bg-[#1A1A1A] border border-white/20 rounded-xl p-4 hover:border-white/40 transition-all cursor-pointer relative">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    {icon}
                    <div className="font-semibold text-[#f1c086]">{company}</div>
                </div>
                <div className="text-[#6B7280] text-sm">{time}</div>
            </div>
            <div className="text-white text-sm leading-relaxed font-extrabold line-clamp-2 pr-6">
                {title}
            </div>
            {warningIcon && (
                <div className="absolute bottom-3 right-3">
                    {warningIcon}
                </div>
            )}
        </div>
    )
}
