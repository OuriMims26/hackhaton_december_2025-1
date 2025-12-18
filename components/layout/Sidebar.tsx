"use client"

import { Home, PieChart, Activity, Settings } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
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
    // {
    //     title: "Settings",
    //     url: "/dashboard",
    //     icon: Settings,
    // },
]

export function AppSidebar() {
    const pathname = usePathname()

    return (
        <Sidebar collapsible="icon">
            <SidebarContent>
                <SidebarGroup className="space-y-4">
                    <div className="h-16 flex items-center justify-left">
                        <Logo iconOnly={false} className="transition-all" href="/dashboard" />
                    </div>
                    <SidebarGroupContent>
                        <SidebarMenu className="space-y-2">
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={pathname === item.url || pathname.startsWith(item.url + "/")}
                                        tooltip={item.title}
                                        className="data-[active=true]:bg-gradient-to-r data-[active=true]:from-[#F1C086] data-[active=true]:to-[#F6B88C] data-[active=true]:text-[#0E0E10] hover:bg-[#F1C086]/10 hover:text-[#F1C086] transition-all duration-200 group-data-[collapsible=icon]:!justify-center group-data-[collapsible=icon]:[&>span]:hidden group-data-[collapsible=icon]:!gap-0"
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
        </Sidebar>
    )
}
