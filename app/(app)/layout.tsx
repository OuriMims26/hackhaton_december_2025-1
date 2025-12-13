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
            <AppSidebar />
            <SidebarInset className="flex flex-col bg-background/50 backdrop-blur-3xl">
                <Header />
                <main className="flex-1 flex flex-col gap-4 p-4 lg:gap-6 lg:p-6 overflow-hidden">
                    {children}
                </main>
            </SidebarInset>
        </div>
    )
}
