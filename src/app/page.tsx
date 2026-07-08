"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import Image from "next/image";
import {
  TrendingUp, Users, Search, Eye, Brain, FileText, BarChart3, Target,
  LayoutDashboard, Settings2,
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
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: i * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <Skeleton className="h-28 rounded-xl" />
          </motion.div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <Skeleton className="h-72 rounded-xl" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
          <Skeleton className="h-72 rounded-xl" />
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
        <Skeleton className="h-[400px] rounded-xl" />
      </motion.div>
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
  initial: { opacity: 0, y: 12, scale: 0.99 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -8, scale: 0.99, transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] } },
};

export default function Home() {
  const [view, setView] = useState<"dashboard" | "admin">("dashboard");
  const [tab, setTab] = useState(modules[0].id);
  const ActiveDashboardTab = DASHBOARD_TABS.find(t => t.moduleId === tab)?.component;

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      {/* Top Navigation Bar */}
      <header className="border-b bg-background/90 backdrop-blur-xl sticky top-0 z-40 brand-shimmer">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 flex items-center h-14 gap-4">
          {/* Logo with brand colors */}
          <motion.div
            initial={{ opacity: 0, x: -20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.05 }}
            className="flex items-center gap-2.5 shrink-0 cursor-pointer group"
            onClick={() => setView("dashboard")}
          >
            <motion.div
              whileHover={{ scale: 1.05, rotate: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="relative"
              style={{ animation: "float 4s ease-in-out infinite" }}
            >
              <Image
                src="/logo.png"
                alt="Mediusware"
                width={32}
                height={32}
                className="rounded-md"
                priority
              />
              <motion.div
                className="absolute -inset-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `linear-gradient(135deg, #00A99D20, #0066CC10)` }}
              />
            </motion.div>
            <span
              className="font-bold text-base tracking-tight hidden sm:block"
              style={{ color: "#0066CC" }}
            >
              mediusware
            </span>
          </motion.div>

          {/* Divider */}
          <div className="h-5 w-px bg-border/60 hidden sm:block" />

          {/* View Toggle */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 300, damping: 25 }}
            className="flex items-center bg-muted/70 rounded-lg p-[3px] border border-transparent"
          >
            {(["dashboard", "admin"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-300 ${
                  view === v
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {view === v && (
                  <motion.div
                    layoutId="view-toggle"
                    className="absolute inset-0 bg-background shadow-sm rounded-md border border-border/50"
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
              {modules.map((mod, i) => {
                const isActive = tab === mod.id;
                return (
                  <motion.button
                    key={mod.id}
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setTab(mod.id)}
                    initial={{ opacity: 0, y: -12, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                      delay: 0.2 + i * 0.04,
                      type: "spring",
                      stiffness: 300,
                      damping: 25,
                    }}
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.96 }}
                    className={`relative inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors duration-200 shrink-0 ${
                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="module-tab"
                        className="absolute inset-0 rounded-md"
                        style={{
                          background: `linear-gradient(135deg, #00A99D12, #0066CC08)`,
                          boxShadow: isActive ? "0 0 0 1px #00A99D30" : "none",
                        }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-1.5">
                      <ModuleIcon
                        name={mod.icon}
                        className={`h-3.5 w-3.5 transition-colors duration-200 ${
                          isActive ? "" : ""
                        }`}
                        // @ts-expect-error -- dynamic style for brand color
                        style={isActive ? { color: "#00A99D" } : undefined}
                      />
                      <span className="hidden lg:inline">{mod.label}</span>
                      <span className="lg:hidden">{mod.label.split(" ")[0]}</span>
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </nav>
        </div>
        {/* Bottom accent line */}
        <motion.div
          className="h-px w-full"
          style={{
            background: `linear-gradient(90deg, transparent 0%, #00A99D30 20%, #0066CC20 80%, transparent 100%)`,
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {view === "dashboard" ? (
            <motion.div
              key={`dashboard-${tab}`}
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
      <motion.footer
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="border-t bg-background/90 backdrop-blur-md py-3 mt-auto"
      >
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p className="font-medium flex items-center gap-2">
            <span>&copy; 2025</span>
            <span style={{ color: "#0066CC" }} className="font-semibold">mediusware</span>
            <span>SEO Intelligence Dashboard</span>
          </p>
          <p className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span
                className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                style={{ backgroundColor: "#00A99D" }}
              />
              <span
                className="relative inline-flex rounded-full h-2 w-2"
                style={{ backgroundColor: "#00A99D" }}
              />
            </span>
            Live data from database
          </p>
        </div>
      </motion.footer>

      <SeoChatbot />
      <Toaster position="bottom-right" richColors />
    </div>
  );
}