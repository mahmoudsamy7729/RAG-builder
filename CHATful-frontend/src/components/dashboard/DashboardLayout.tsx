import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
}

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar />
        
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Header */}
          <header className="h-14 border-b border-border bg-card flex items-center px-4 sticky top-0 z-40">
            <SidebarTrigger className="mr-4" />
            {title && (
              <h1 className="text-lg font-semibold">{title}</h1>
            )}
          </header>

          {/* Main content */}
          <main className="flex-1 bg-secondary/30">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
