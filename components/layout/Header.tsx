"use client"

import { Bell, Search } from "lucide-react"
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
import { useEffect, useState } from "react"

export function Header() {
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const [initials, setInitials] = useState("OM")

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

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/')
        router.refresh()
    }

    return (
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between bg-transparent px-6 backdrop-blur-md transition-all">
            <div className="flex items-center gap-4">
                <SidebarTrigger className="-ml-2 hover:bg-[#F1C086]/10 hover:text-[#F1C086]" />
                <div className="relative hidden md:block w-96">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search startups, founders, or alerts..."
                        className="pl-8 bg-secondary/50 border-white/5 focus-visible:ring-primary/50"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-primary">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background" />
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-9 w-9 rounded-full ring-2 ring-white/10">
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
        </header>
    )
}
