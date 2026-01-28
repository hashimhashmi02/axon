import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Suspense } from "react";

const Layout = ({ children }: { children: React.ReactNode; }) => {
    return (
        <SidebarProvider>
            <Suspense fallback={null}>
                <AppSidebar />
            </Suspense>
            <SidebarInset className="bg-accent/20">
                {children}

            </SidebarInset>

        </SidebarProvider>
    )
}

export default Layout;