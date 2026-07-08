"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import {
  TrendingUp, Users, Search, Eye, Brain, FileText, BarChart3, Target,
  LayoutDashboard, Settings2, Sparkles,
} from "lucide-react";
import { AdminPanel } from "@/components/admin/admin-panel";
import { SeoChatbot } from "@/components/dashboard/seo-chatbot";
import { Toaster } from "@/components/ui/sonner";
import { modules } from "@/lib/module-config";
import { Skeleton } from "@/components/ui/skeleton";

const MarketIntelTab = dynamic(
  () => import("@/components/dashboard/tabs/market-intel").then(m => ({ default: m.MarketIntelTab })),
  { ssr: false, loading: () => <TabSkeleton /> }
);
const CompetitorIntelTab = dynamic(
  () => import("@/components/dashboard/tabs/competitor-intel").then(m => ({ default: m.CompetitorIntelTab })),
  { ssr: false, loading: () => <TabSkeleton /> }
);
const KeywordIntelTab = dynamic(
  () => import("@/components/dashboard/tabs/keyword-intel").then(m => ({ default: m.KeywordIntelTab })),
  { ssr: false, loading: () => <TabSkeleton /> }
);
const SerpAnalysisTab = dynamic(
  () => import("@/components/dashboard/tabs/serp-analysis").then(m => ({ default: m.SerpAnalysisTab })),
  { ssr: false, loading: () => <TabSkeleton /> }
);
const AiAuditTab = dynamic(
  () => import("@/components/dashboard/tabs/ai-audit").then(m => ({ default: m.AiAuditTab })),
  { ssr: false, loading: () => <TabSkeleton /> }
);
const ContentPipelineTab = dynamic(
  () => import("@/components/dashboard/tabs/content-pipeline").then(m => ({ default: m.ContentPipelineTab })),
  { ssr: false, loading: () => <TabSkeleton /> }
);
const PerformanceTab = dynamic(
  () => import("@/components/dashboard/tabs/performance").then(m => ({ default: m.PerformanceTab })),
  { ssr: false, loading: () => <TabSkeleton /> }
);
const ContentGapTab = dynamic(
  () => import("@/components/dashboard/tabs/content-gap").then(m => ({ default: m.ContentGapTab })),
  { ssr: false, loading: () => <TabSkeleton /> }
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
        <Skeleton className="h-72 rounded-xl" />
        <Skeleton className="h-72 rounded-xl" />
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

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit: { opacity: 0, y: -4, transition: { duration: 0.15 } },
};

export default function Home() {
  const [view, setView] = useState<"dashboard" | "admin">("dashboard");
  const [tab, setTab] = useState(modules[0].id);
  const ActiveDashboardTab = DASHBOARD_TABS.find(t => t.moduleId === tab)?.component;

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      {/* Top Navigation Bar */}
      <header className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 flex items-center h-14 gap-4">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2.5 shrink-0"
          >
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <Sparkles className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-bold text-base tracking-tight">Mediusware</span>
          </motion.div>

          {/* View Toggle */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="flex items-center bg-muted/80 rounded-lg p-[3px]"
          >
            {(["dashboard", "admin"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                  view === v
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {view === v && (
                  <motion.div
                    layoutId="view-toggle"
                    className="absolute inset-0 bg-background shadow-sm rounded-md"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  {v === "dashboard" ? (
                    <LayoutDashboard className="h-3.5 w-3.5" />
                  ) : (
                    <Settings2 className="h-3.5 w-3.5" />
                  )}
                  <span className="hidden sm:inline">{v === "dashboard" ? "Dashboard" : "Admin Panel"}</span>
                </span>
              </button>
            ))}
          </motion.div>

          {/* Module Tabs */}
          <nav className="flex-1 overflow-x-auto scrollbar-none">
            <div className="flex gap-0.5" role="tablist">
              {modules.map((mod, i) => (
                <motion.button
                  key={mod.id}
                  role="tab"
                  aria-selected={tab === mod.id}
                  onClick={() => setTab(mod.id)}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.03 }}
                  className={`relative inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors duration-200 shrink-0 ${
                    tab === mod.id
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab === mod.id && (
                    <motion.div
                      layoutId="module-tab"
                      className="absolute inset-0 bg-muted rounded-md"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    <ModuleIcon name={mod.icon} className="h-3.5 w-3.5" />
                    <span className="hidden lg:inline">{mod.label}</span>
                    <span className="lg:hidden">{mod.label.split(" ")[0]}</span>
                  </span>
                </motion.button>
              ))}
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {view === "dashboard" ? (
            <motion.div
              key="dashboard-view"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {ActiveDashboardTab && <ActiveDashboardTab key={tab} />}
            </motion.div>
          ) : (
            <motion.div
              key="admin-view"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6"
            >
              <AdminPanel moduleId={tab} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background/80 backdrop-blur-md py-3 mt-auto">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p className="font-medium">&copy; 2025 Mediusware. SEO Intelligence Dashboard</p>
          <p className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            Live data from database
          </p>
        </div>
      </footer>

      <SeoChatbot />
      <Toaster position="bottom-right" richColors />
    </div>
  );
}