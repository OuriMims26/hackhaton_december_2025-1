import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/Sidebar"
import { Header } from "@/components/layout/Header"

export default function AppLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <SidebarProvider>
            <AppLayoutContent>{children}</AppLayoutContent>
        </SidebarProvider>
    )
}

function AppLayoutContent({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen w-full bg-background">
            <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#F1C086]/20 via-[#F6B88C]/5 to-transparent blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
            <AppSidebar />
            <SidebarInset className="flex flex-col bg-transparent overflow-hidden relative">
                <Header />
                <main className="flex-1 flex flex-col gap-4 p-4 lg:gap-6 lg:p-6 overflow-hidden">
                    {children}
                </main>
            </SidebarInset>
        </div>
    )
}
