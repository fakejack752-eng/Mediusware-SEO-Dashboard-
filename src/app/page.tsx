"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import {
  TrendingUp, Users, Search, Eye, Brain, FileText, BarChart3, Target,
  LayoutDashboard, Settings2,
} from "lucide-react";
import { AdminPanel } from "@/components/admin/admin-panel";
import { SeoChatbot } from "@/components/dashboard/seo-chatbot";
import { Toaster } from "@/components/ui/sonner";
import { modules } from "@/lib/module-config";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load dashboard tabs to reduce initial bundle
const MarketIntelTab = dynamic(
  () => import("@/components/dashboard/dashboard-tabs").then(m => ({ default: m.MarketIntelTab })),
  { loading: () => <TabSkeleton /> }
);
const CompetitorIntelTab = dynamic(
  () => import("@/components/dashboard/dashboard-tabs").then(m => ({ default: m.CompetitorIntelTab })),
  { loading: () => <TabSkeleton /> }
);
const KeywordIntelTab = dynamic(
  () => import("@/components/dashboard/dashboard-tabs").then(m => ({ default: m.KeywordIntelTab })),
  { loading: () => <TabSkeleton /> }
);
const SerpAnalysisTab = dynamic(
  () => import("@/components/dashboard/dashboard-tabs").then(m => ({ default: m.SerpAnalysisTab })),
  { loading: () => <TabSkeleton /> }
);
const AiAuditTab = dynamic(
  () => import("@/components/dashboard/dashboard-tabs").then(m => ({ default: m.AiAuditTab })),
  { loading: () => <TabSkeleton /> }
);
const ContentPipelineTab = dynamic(
  () => import("@/components/dashboard/dashboard-tabs").then(m => ({ default: m.ContentPipelineTab })),
  { loading: () => <TabSkeleton /> }
);
const PerformanceTab = dynamic(
  () => import("@/components/dashboard/dashboard-tabs").then(m => ({ default: m.PerformanceTab })),
  { loading: () => <TabSkeleton /> }
);
const ContentGapTab = dynamic(
  () => import("@/components/dashboard/dashboard-tabs").then(m => ({ default: m.ContentGapTab })),
  { loading: () => <TabSkeleton /> }
);

function TabSkeleton() {
  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-[300px] rounded-xl" />
        <Skeleton className="h-[300px] rounded-xl" />
      </div>
      <Skeleton className="h-[400px] rounded-xl" />
    </div>
  );
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  TrendingUp, Users, Search, Eye, Brain, FileText, BarChart3, Target,
};

const DASHBOARD_TABS: { moduleId: string; component: React.ComponentType }[] = [
  { moduleId: "market-intel", component: MarketIntelTab },
  { moduleId: "competitor-intel", component: CompetitorIntelTab },
  { moduleId: "keyword-intel", component: KeywordIntelTab },
  { moduleId: "serp-analysis", component: SerpAnalysisTab },
  { moduleId: "ai-audit", component: AiAuditTab },
  { moduleId: "content-pipeline", component: ContentPipelineTab },
  { moduleId: "performance", component: PerformanceTab },
  { moduleId: "content-gap", component: ContentGapTab },
];

function ModuleIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICON_MAP[name];
  return Icon ? <Icon className={className} /> : <BarChart3 className={className} />;
}

export default function Home() {
  const [view, setView] = useState<"dashboard" | "admin">("dashboard");
  const [tab, setTab] = useState(modules[0].id);

  const ActiveDashboardTab = DASHBOARD_TABS.find(t => t.moduleId === tab)?.component;

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      {/* Top Navigation Bar */}
      <div className="border-b bg-background sticky top-0 z-40">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 flex items-center h-14 gap-4">
          <span className="font-bold text-lg shrink-0">Mediusware</span>

          {/* View Toggle */}
          <div className="flex items-center bg-muted rounded-lg p-[3px]">
            <button
              onClick={() => setView("dashboard")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                view === "dashboard"
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Dashboard</span>
            </button>
            <button
              onClick={() => setView("admin")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                view === "admin"
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Settings2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Admin Panel</span>
            </button>
          </div>

          {/* Module Tabs */}
          <div className="flex-1 overflow-x-auto">
            <div className="flex gap-0.5">
              {modules.map((mod) => (
                <button
                  key={mod.id}
                  onClick={() => setTab(mod.id)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all shrink-0 ${
                    tab === mod.id
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <ModuleIcon name={mod.icon} className="h-3.5 w-3.5" />
                  <span className="hidden lg:inline">{mod.label}</span>
                  <span className="lg:hidden">{mod.label.split(" ")[0]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {view === "dashboard" ? (
            <motion.div
              key="dashboard-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {ActiveDashboardTab && <ActiveDashboardTab key={tab} />}
            </motion.div>
          ) : (
            <motion.div
              key="admin-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6"
            >
              <AdminPanel moduleId={tab} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background py-4 mt-auto">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>&copy; 2025 Mediusware. SEO Intelligence Dashboard</p>
          <p className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Live data from database
          </p>
        </div>
      </footer>

      <SeoChatbot />
      <Toaster position="bottom-right" richColors />
    </div>
  );
}