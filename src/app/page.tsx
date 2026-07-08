"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { MarketIntelligence } from "@/components/dashboard/market-intelligence";
import { CompetitorIntelligence } from "@/components/dashboard/competitor-intelligence";
import { KeywordIntelligence } from "@/components/dashboard/keyword-intelligence";
import { SerpAnalysis } from "@/components/dashboard/serp-analysis";
import { AiSearchAudit } from "@/components/dashboard/ai-search-audit";
import { ContentPipeline } from "@/components/dashboard/content-pipeline";
import { PerformanceDashboard } from "@/components/dashboard/performance-dashboard";
import { ContentGapTracker } from "@/components/dashboard/content-gap-tracker";
import { SeoChatbot } from "@/components/dashboard/seo-chatbot";
import { Skeleton } from "@/components/ui/skeleton";
import {
  TrendingUp,
  Users,
  Search,
  BarChart3,
  Brain,
  FileText,
  Activity,
  Target,
} from "lucide-react";

interface DashboardData {
  marketIntelligence: import("@/components/dashboard/market-intelligence").MarketIntelligenceData;
  competitorIntelligence: import("@/components/dashboard/competitor-intelligence").CompetitorIntelligenceData;
  keywordIntelligence: import("@/components/dashboard/keyword-intelligence").KeywordIntelligenceData;
  serpAnalysis: import("@/components/dashboard/serp-analysis").SerpAnalysisData;
  aiSearchAudit: import("@/components/dashboard/ai-search-audit").AiSearchAuditData;
  contentPipeline: import("@/components/dashboard/content-pipeline").ContentPipelineData;
  performance: import("@/components/dashboard/performance-dashboard").PerformanceData;
  contentGaps: import("@/components/dashboard/content-gap-tracker").ContentGapsData;
  lastUpdated: string;
}

const tabs = [
  { id: "market", label: "Market Intelligence", icon: TrendingUp, shortLabel: "Market" },
  { id: "competitor", label: "Competitor Intelligence", icon: Users, shortLabel: "Competitor" },
  { id: "keyword", label: "Keyword Intelligence", icon: Search, shortLabel: "Keywords" },
  { id: "serp", label: "SERP Analysis", icon: BarChart3, shortLabel: "SERP" },
  { id: "ai-audit", label: "AI Search Audit", icon: Brain, shortLabel: "AI Audit" },
  { id: "pipeline", label: "Content Pipeline", icon: FileText, shortLabel: "Pipeline" },
  { id: "performance", label: "Performance", icon: Activity, shortLabel: "Perf" },
  { id: "gaps", label: "Content Gaps", icon: Target, shortLabel: "Gaps" },
] as const;

function DashboardSkeleton() {
  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-[350px] rounded-xl" />
        <Skeleton className="h-[350px] rounded-xl" />
      </div>
      <Skeleton className="h-[400px] rounded-xl" />
    </div>
  );
}

export default function Home() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [activeTab, setActiveTab] = useState("market");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/seo-dashboard");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <DashboardHeader />

      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0 mb-6">
            <TabsList className="w-fit min-w-max inline-flex">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="gap-1.5 px-3 text-xs sm:text-sm"
                >
                  <tab.icon className="h-3.5 w-3.5 shrink-0" />
                  <span className="hidden md:inline">{tab.label}</span>
                  <span className="md:hidden">{tab.shortLabel}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {isLoading && <DashboardSkeleton />}

          {data && (
            <>
              <TabsContent value="market" className="mt-0">
                <MarketIntelligence data={data.marketIntelligence} />
              </TabsContent>
              <TabsContent value="competitor" className="mt-0">
                <CompetitorIntelligence data={data.competitorIntelligence} />
              </TabsContent>
              <TabsContent value="keyword" className="mt-0">
                <KeywordIntelligence data={data.keywordIntelligence} />
              </TabsContent>
              <TabsContent value="serp" className="mt-0">
                <SerpAnalysis data={data.serpAnalysis} />
              </TabsContent>
              <TabsContent value="ai-audit" className="mt-0">
                <AiSearchAudit data={data.aiSearchAudit} />
              </TabsContent>
              <TabsContent value="pipeline" className="mt-0">
                <ContentPipeline data={data.contentPipeline} />
              </TabsContent>
              <TabsContent value="performance" className="mt-0">
                <PerformanceDashboard data={data.performance} />
              </TabsContent>
              <TabsContent value="gaps" className="mt-0">
                <ContentGapTracker data={data.contentGaps} />
              </TabsContent>
            </>
          )}
        </Tabs>
      </main>

      <footer className="border-t bg-background py-4">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>© 2025 Mediusware. SEO Intelligence Dashboard — Updated weekly with evidence.</p>
          <p className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Data as of {data?.lastUpdated ? new Date(data.lastUpdated).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
          </p>
        </div>
      </footer>

      <SeoChatbot />
    </div>
  );
}