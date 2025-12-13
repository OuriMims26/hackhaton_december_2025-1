"use client"

import { Home, PieChart, Activity, Settings } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    SidebarFooter,
} from "@/components/ui/sidebar"
import { Logo } from "@/components/ui/logo"

// Menu items
const items = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: Home,
    },
    {
        title: "Portfolio",
        url: "/portfolio",
        icon: PieChart,
    },
    {
        title: "Activities",
        url: "/activities",
        icon: Activity,
    },
    {
        title: "Settings",
        url: "/#settings",
        icon: Settings,
    },
]

export function AppSidebar() {
    const pathname = usePathname()

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className="h-16 flex items-center justify-center border-b border-sidebar-border">
                <div className="w-full flex items-center gap-2 px-2 overflow-hidden">
                    <Logo iconOnly={false} className="transition-all" />
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Menu</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={pathname === item.url || pathname.startsWith(item.url + "/")}
                                        tooltip={item.title}
                                    >
                                        <Link href={item.url}>
                                            <item.icon className="!w-5 !h-5" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="border-t border-sidebar-border p-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground truncate">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Systems Normal</span>
                </div>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
