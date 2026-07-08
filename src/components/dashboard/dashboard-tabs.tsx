"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp, Users, Search, Eye, Brain, FileText, BarChart3, Target,
  Globe, Shield, Layers, CheckCircle, Loader, ArrowUpCircle, Database,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { KpiCard } from "@/components/dashboard/kpi-card";
import {
  ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Bar, BarChart, XAxis, YAxis, Pie, PieChart, Cell, Scatter, ScatterChart, ZAxis,
  Line, LineChart, CartesianGrid,
} from "recharts";

// ── Shared helpers ──────────────────────────────────────
const COLORS = ["#059669", "#0d9488", "#d97706", "#dc2626", "#78716c", "#ea580c", "#16a34a", "#14b8a6"];

function useDataFetch(endpoint: string) {
  const [data, setData] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(endpoint);
        const json = await res.json();
        if (!cancelled) setData(Array.isArray(json) ? json : []);
      } catch { /* empty */ }
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [endpoint]);
  return { data, loading };
}

function countBy(arr: Record<string, unknown>[], key: string) {
  const map = new Map<string, number>();
  arr.forEach((r) => { const v = String(r[key] ?? "Unknown"); map.set(v, (map.get(v) ?? 0) + 1); });
  return Array.from(map.entries()).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
}

function avgNum(arr: Record<string, unknown>[], key: string): number {
  if (!arr.length) return 0;
  const nums = arr.map((r) => Number(r[key]) || 0).filter((n) => n > 0);
  return nums.length ? Math.round(nums.reduce((a, b) => a + b, 0) / nums.length) : 0;
}

function sumNum(arr: Record<string, unknown>[], key: string): number {
  return arr.reduce((s, r) => s + (Number(r[key]) || 0), 0);
}

function EmptyState({ moduleName }: { moduleName: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
        <Database className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-1">No data yet</h3>
      <p className="text-sm text-muted-foreground max-w-sm">
        Switch to the Admin Panel and add records to the {moduleName} module to see visualizations here.
      </p>
    </motion.div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Skeleton className="h-72 rounded-xl" />
        <Skeleton className="h-72 rounded-xl" />
      </div>
    </div>
  );
}

function TableWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Card>
      <div className="max-h-96 overflow-y-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent sticky top-0 bg-background z-10">
              {children}
            </TableRow>
          </TableHeader>
        </Table>
      </div>
    </Card>
  );
}

const stagger = { container: {}, item: (i: number) => ({ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: i * 0.05, duration: 0.3 } }) };

// ── 1. Market Intelligence ──────────────────────────────
export function MarketIntelTab() {
  const { data, loading } = useDataFetch("/api/market-intel");
  const kpis = useMemo(() => {
    const topics = new Set(data.map((r) => String(r.topicTheme)));
    const bySource = countBy(data, "sourcePlatform");
    return {
      total: data.length,
      avgRelevance: avgNum(data, "relevanceScore"),
      uniqueTopics: topics.size,
      topSource: bySource[0]?.name ?? "—",
    };
  }, [data]);
  const sourceData = useMemo(() => countBy(data, "sourcePlatform").slice(0, 8), [data]);
  const sentimentData = useMemo(() => countBy(data, "sentiment"), [data]);
  const last10 = useMemo(() => [...data].reverse().slice(0, 10), [data]);

  const sourceConfig: ChartConfig = { value: { label: "Signals", color: "#059669" } };
  const sentimentConfig: ChartConfig = {
    Positive: { label: "Positive", color: "#059669" },
    Negative: { label: "Negative", color: "#dc2626" },
    Neutral: { label: "Neutral", color: "#78716c" },
    Mixed: { label: "Mixed", color: "#d97706" },
  };

  if (loading) return <LoadingSkeleton />;
  if (!data.length) return <EmptyState moduleName="Market Intelligence" />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Total Signals", value: kpis.total, icon: TrendingUp },
          { title: "Avg Relevance", value: kpis.avgRelevance, suffix: "/100", icon: Target },
          { title: "Unique Topics", value: kpis.uniqueTopics, icon: Layers },
          { title: "Top Source", value: kpis.topSource, icon: Globe },
        ].map((kpi, i) => (
          <motion.div key={kpi.title} {...stagger.item(i)}>
            <KpiCard title={kpi.title} value={kpi.value} icon={kpi.icon} suffix={kpi.suffix} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.25 }}>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Signals by Source</CardTitle></CardHeader>
            <CardContent>
              <ChartContainer config={sourceConfig} className="h-64 w-full">
                <BarChart data={sourceData} layout="vertical" margin={{ left: 20 }}>
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 11 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill="var(--color-value)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Sentiment Distribution</CardTitle></CardHeader>
            <CardContent>
              <ChartContainer config={sentimentConfig} className="h-64 w-full">
                <BarChart data={sentimentData}>
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {sentimentData.map((entry) => (
                      <Cell key={entry.name} fill={sentimentConfig[entry.name as keyof typeof sentimentConfig]?.color ?? "#78716c"} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Recent Signals</CardTitle></CardHeader>
          <CardContent>
            <div className="max-h-96 overflow-y-auto">
              <Table>
                <TableHeader><TableRow className="hover:bg-transparent sticky top-0 bg-background z-10">
                  <TableHead className="w-28">Date</TableHead><TableHead>Source</TableHead><TableHead>Topic</TableHead><TableHead>Signal</TableHead><TableHead>Sentiment</TableHead><TableHead className="w-24 tabular-nums">Relevance</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {last10.map((r, i) => (
                    <motion.tr key={r.id as number} {...stagger.item(i * 0.03)} className="border-b transition-colors hover:bg-muted/50">
                      <TableCell className="text-xs tabular-nums">{String(r.date)}</TableCell>
                      <TableCell><Badge variant="outline" className="text-xs">{String(r.sourcePlatform)}</Badge></TableCell>
                      <TableCell className="text-sm max-w-[200px] truncate">{String(r.topicTheme)}</TableCell>
                      <TableCell><Badge variant="secondary" className="text-xs">{String(r.signalType)}</Badge></TableCell>
                      <TableCell><Badge variant="outline" className="text-xs">{String(r.sentiment)}</Badge></TableCell>
                      <TableCell className="tabular-nums text-sm">{Number(r.relevanceScore)}</TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

// ── 2. Competitor Intelligence ─────────────────────────
export function CompetitorIntelTab() {
  const { data, loading } = useDataFetch("/api/competitor-intel");
  const kpis = useMemo(() => ({
    total: data.length,
    uniqueCompetitors: new Set(data.map((r) => String(r.competitor))).size,
    avgDa: avgNum(data, "estDa"),
    totalTraffic: sumNum(data, "estTraffic"),
  }), [data]);
  const topCompetitors = useMemo(() => {
    const map = new Map<string, number>();
    data.forEach((r) => { const c = String(r.competitor); map.set(c, (map.get(c) ?? 0) + (Number(r.estTraffic) || 0)); });
    return Array.from(map.entries()).map(([name, traffic]) => ({ name, traffic })).sort((a, b) => b.traffic - a.traffic).slice(0, 10);
  }, [data]);
  const contentTypeData = useMemo(() => countBy(data, "contentType").slice(0, 8), [data]);
  const last10 = useMemo(() => [...data].reverse().slice(0, 10), [data]);

  const trafficConfig: ChartConfig = { traffic: { label: "Est. Traffic", color: "#0d9488" } };
  const typeConfig: ChartConfig = { value: { label: "Count", color: "#059669" } };

  if (loading) return <LoadingSkeleton />;
  if (!data.length) return <EmptyState moduleName="Competitor Intelligence" />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Total Entries", value: kpis.total, icon: Users },
          { title: "Unique Competitors", value: kpis.uniqueCompetitors, icon: Users },
          { title: "Avg DA", value: kpis.avgDa, icon: Shield },
          { title: "Total Est. Traffic", value: kpis.totalTraffic.toLocaleString(), icon: Globe },
        ].map((kpi, i) => (
          <motion.div key={kpi.title} {...stagger.item(i)}>
            <KpiCard title={kpi.title} value={kpi.value} icon={kpi.icon} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.25 }}>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Top 10 by Est. Traffic</CardTitle></CardHeader>
            <CardContent>
              <ChartContainer config={trafficConfig} className="h-72 w-full">
                <BarChart data={topCompetitors} layout="vertical" margin={{ left: 20 }}>
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 11 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="traffic" fill="var(--color-traffic)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Content Type Distribution</CardTitle></CardHeader>
            <CardContent>
              <ChartContainer config={typeConfig} className="h-72 w-full">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                  <ChartLegend content={<ChartLegendContent nameKey="name" />} />
                  <Pie data={contentTypeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} innerRadius={50}>
                    {contentTypeData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Recent Entries</CardTitle></CardHeader>
          <CardContent>
            <div className="max-h-96 overflow-y-auto">
              <Table>
                <TableHeader><TableRow className="hover:bg-transparent sticky top-0 bg-background z-10">
                  <TableHead>Competitor</TableHead><TableHead>Domain</TableHead><TableHead>Type</TableHead><TableHead>Target Keyword</TableHead><TableHead>Priority</TableHead><TableHead className="w-20 tabular-nums">DA</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {last10.map((r, i) => (
                    <motion.tr key={r.id as number} {...stagger.item(i * 0.03)} className="border-b transition-colors hover:bg-muted/50">
                      <TableCell className="text-sm font-medium">{String(r.competitor)}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{String(r.domain || "—")}</TableCell>
                      <TableCell><Badge variant="outline" className="text-xs">{String(r.contentType || "—")}</Badge></TableCell>
                      <TableCell className="text-sm max-w-[180px] truncate">{String(r.targetKeyword || "—")}</TableCell>
                      <TableCell><Badge variant="secondary" className="text-xs">{String(r.priority)}</Badge></TableCell>
                      <TableCell className="tabular-nums text-sm">{Number(r.estDa)}</TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

// ── 3. Keyword Intelligence ────────────────────────────
export function KeywordIntelTab() {
  const { data, loading } = useDataFetch("/api/keyword-intel");
  const kpis = useMemo(() => ({
    total: data.length,
    avgVolume: avgNum(data, "volume"),
    avgKd: avgNum(data, "kd"),
    highPriority: data.filter((r) => Number(r.priorityScore) >= 70).length,
  }), [data]);
  const scatterData = useMemo(() => data.map((r) => ({ x: Number(r.volume) || 0, y: Number(r.kd) || 0, z: Number(r.priorityScore) || 1, name: String(r.keyword) })).sort((a, b) => b.x - a.x).slice(0, 50), [data]);
  const intentData = useMemo(() => countBy(data, "intent"), [data]);
  const last10 = useMemo(() => [...data].sort((a, b) => (Number(b.priorityScore) || 0) - (Number(a.priorityScore) || 0)).slice(0, 10), [data]);

  const scatterConfig: ChartConfig = { keyword: { label: "Keyword", color: "#059669" } };
  const intentConfig: ChartConfig = { value: { label: "Count", color: "#d97706" } };

  if (loading) return <LoadingSkeleton />;
  if (!data.length) return <EmptyState moduleName="Keyword Intelligence" />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Total Keywords", value: kpis.total, icon: Search },
          { title: "Avg Volume", value: kpis.avgVolume.toLocaleString(), icon: TrendingUp },
          { title: "Avg KD", value: kpis.avgKd, icon: Target },
          { title: "High Priority", value: kpis.highPriority, icon: ArrowUpCircle },
        ].map((kpi, i) => (
          <motion.div key={kpi.title} {...stagger.item(i)}>
            <KpiCard title={kpi.title} value={kpi.value} icon={kpi.icon} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.25 }}>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Volume vs Difficulty</CardTitle></CardHeader>
            <CardContent>
              <ChartContainer config={scatterConfig} className="h-72 w-full">
                <ScatterChart margin={{ left: 10, right: 10 }}>
                  <XAxis type="number" dataKey="x" name="Volume" tick={{ fontSize: 11 }} />
                  <YAxis type="number" dataKey="y" name="KD" tick={{ fontSize: 11 }} />
                  <ZAxis type="number" dataKey="z" range={[40, 400]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Scatter data={scatterData} fill="var(--color-keyword)" />
                </ScatterChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Intent Distribution</CardTitle></CardHeader>
            <CardContent>
              <ChartContainer config={intentConfig} className="h-72 w-full">
                <BarChart data={intentData}>
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {intentData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Top Priority Keywords</CardTitle></CardHeader>
          <CardContent>
            <div className="max-h-96 overflow-y-auto">
              <Table>
                <TableHeader><TableRow className="hover:bg-transparent sticky top-0 bg-background z-10">
                  <TableHead>Keyword</TableHead><TableHead>Cluster</TableHead><TableHead className="tabular-nums">Volume</TableHead><TableHead className="tabular-nums">KD</TableHead><TableHead>Intent</TableHead><TableHead className="tabular-nums">Priority</TableHead><TableHead>Status</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {last10.map((r, i) => (
                    <motion.tr key={r.id as number} {...stagger.item(i * 0.03)} className="border-b transition-colors hover:bg-muted/50">
                      <TableCell className="text-sm font-medium">{String(r.keyword)}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{String(r.cluster || "—")}</TableCell>
                      <TableCell className="tabular-nums text-sm">{Number(r.volume).toLocaleString()}</TableCell>
                      <TableCell className="tabular-nums text-sm">{Number(r.kd)}</TableCell>
                      <TableCell><Badge variant="outline" className="text-xs">{String(r.intent)}</Badge></TableCell>
                      <TableCell className="tabular-nums text-sm">{Number(r.priorityScore)}</TableCell>
                      <TableCell><Badge variant="secondary" className="text-xs">{String(r.status)}</Badge></TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

// ── 4. SERP Analysis ──────────────────────────────────
export function SerpAnalysisTab() {
  const { data, loading } = useDataFetch("/api/serp-analysis");
  const kpis = useMemo(() => ({
    total: data.length,
    avgRank: avgNum(data, "rank"),
    featuredPct: data.length ? Math.round((data.filter((r) => r.featuredSnippet === true || r.featuredSnippet === "true").length / data.length) * 100) : 0,
    opportunities: data.filter((r) => String(r.formatOpportunity) && String(r.formatOpportunity) !== "None").length,
  }), [data]);
  const rankBuckets = useMemo(() => {
    const b = { "1-3": 0, "4-10": 0, "11-20": 0, "21-50": 0, "51+": 0 };
    data.forEach((r) => {
      const rank = Number(r.rank) || 0;
      if (rank <= 3) b["1-3"]++;
      else if (rank <= 10) b["4-10"]++;
      else if (rank <= 20) b["11-20"]++;
      else if (rank <= 50) b["21-50"]++;
      else b["51+"]++;
    });
    return Object.entries(b).map(([name, value]) => ({ name, value }));
  }, [data]);
  const contentTypeData = useMemo(() => countBy(data, "contentType").slice(0, 8), [data]);
  const last10 = useMemo(() => [...data].reverse().slice(0, 10), [data]);

  const rankConfig: ChartConfig = { value: { label: "Count", color: "#059669" } };
  const typeConfig: ChartConfig = { value: { label: "Count", color: "#0d9488" } };

  if (loading) return <LoadingSkeleton />;
  if (!data.length) return <EmptyState moduleName="SERP Analysis" />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Total Tracked", value: kpis.total, icon: Eye },
          { title: "Avg Rank", value: kpis.avgRank, icon: BarChart3 },
          { title: "Featured Snippet %", value: kpis.featuredPct, suffix: "%", icon: CheckCircle },
          { title: "Opportunities", value: kpis.opportunities, icon: TrendingUp },
        ].map((kpi, i) => (
          <motion.div key={kpi.title} {...stagger.item(i)}>
            <KpiCard title={kpi.title} value={kpi.value} icon={kpi.icon} suffix={kpi.suffix} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.25 }}>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Rank Distribution</CardTitle></CardHeader>
            <CardContent>
              <ChartContainer config={rankConfig} className="h-64 w-full">
                <BarChart data={rankBuckets}>
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill="var(--color-value)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Content Type Distribution</CardTitle></CardHeader>
            <CardContent>
              <ChartContainer config={typeConfig} className="h-64 w-full">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                  <ChartLegend content={<ChartLegendContent nameKey="name" />} />
                  <Pie data={contentTypeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={85} innerRadius={45}>
                    {contentTypeData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Recent Analysis</CardTitle></CardHeader>
          <CardContent>
            <div className="max-h-96 overflow-y-auto">
              <Table>
                <TableHeader><TableRow className="hover:bg-transparent sticky top-0 bg-background z-10">
                  <TableHead>Keyword</TableHead><TableHead className="tabular-nums">Rank</TableHead><TableHead>Domain</TableHead><TableHead>Type</TableHead><TableHead>Featured</TableHead><TableHead>Action</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {last10.map((r, i) => (
                    <motion.tr key={r.id as number} {...stagger.item(i * 0.03)} className="border-b transition-colors hover:bg-muted/50">
                      <TableCell className="text-sm font-medium">{String(r.keyword)}</TableCell>
                      <TableCell className="tabular-nums text-sm">{Number(r.rank)}</TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-[180px] truncate">{String(r.rankingUrlDomain)}</TableCell>
                      <TableCell><Badge variant="outline" className="text-xs">{String(r.contentType || "—")}</Badge></TableCell>
                      <TableCell>{r.featuredSnippet === true || r.featuredSnippet === "true" ? <CheckCircle className="h-4 w-4 text-emerald-600" /> : <span className="text-muted-foreground text-xs">—</span>}</TableCell>
                      <TableCell><Badge variant="secondary" className="text-xs">{String(r.action || "—")}</Badge></TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

// ── 5. AI Search Audit ────────────────────────────────
export function AiAuditTab() {
  const { data, loading } = useDataFetch("/api/ai-audit");
  const kpis = useMemo(() => {
    const mentioned = data.filter((r) => r.brandMentioned === true || r.brandMentioned === "true");
    return {
      total: data.length,
      mentionRate: data.length ? Math.round((mentioned.length / data.length) * 100) : 0,
      avgPosition: mentioned.length ? Math.round(mentioned.reduce((s, r) => s + (Number(r.position) || 0), 0) / mentioned.length) : 0,
      positivePct: data.length ? Math.round((data.filter((r) => String(r.sentiment) === "Positive").length / data.length) * 100) : 0,
    };
  }, [data]);
  const mentionByPlatform = useMemo(() => {
    const platforms = new Set(data.map((r) => String(r.aiPlatform)));
    return Array.from(platforms).map((p) => {
      const items = data.filter((r) => String(r.aiPlatform) === p);
      const mentioned = items.filter((r) => r.brandMentioned === true || r.brandMentioned === "true");
      return { name: p, value: items.length ? Math.round((mentioned.length / items.length) * 100) : 0 };
    });
  }, [data]);
  const sentimentByPlatform = useMemo(() => {
    const platforms = new Set(data.map((r) => String(r.aiPlatform)));
    const sentiments = ["Positive", "Neutral", "Negative", "Mixed", "Not Mentioned"];
    return sentiments.map((s) => {
      const count = data.filter((r) => String(r.sentiment) === s).length;
      return { name: s, value: count };
    });
  }, [data]);
  const last10 = useMemo(() => [...data].reverse().slice(0, 10), [data]);

  const mentionConfig: ChartConfig = { value: { label: "Mention Rate %", color: "#059669" } };
  const sentimentConfig: ChartConfig = {
    Positive: { label: "Positive", color: "#059669" },
    Negative: { label: "Negative", color: "#dc2626" },
    Neutral: { label: "Neutral", color: "#78716c" },
    Mixed: { label: "Mixed", color: "#d97706" },
    "Not Mentioned": { label: "Not Mentioned", color: "#a8a29e" },
  };

  if (loading) return <LoadingSkeleton />;
  if (!data.length) return <EmptyState moduleName="AI Search Audit" />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Total Queries", value: kpis.total, icon: Brain },
          { title: "Mention Rate", value: kpis.mentionRate, suffix: "%", icon: Target },
          { title: "Avg Position", value: kpis.avgPosition, icon: BarChart3 },
          { title: "Positive Sentiment", value: kpis.positivePct, suffix: "%", icon: TrendingUp },
        ].map((kpi, i) => (
          <motion.div key={kpi.title} {...stagger.item(i)}>
            <KpiCard title={kpi.title} value={kpi.value} icon={kpi.icon} suffix={kpi.suffix} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.25 }}>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Mention Rate by Platform</CardTitle></CardHeader>
            <CardContent>
              <ChartContainer config={mentionConfig} className="h-64 w-full">
                <BarChart data={mentionByPlatform}>
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill="var(--color-value)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Sentiment Distribution</CardTitle></CardHeader>
            <CardContent>
              <ChartContainer config={sentimentConfig} className="h-64 w-full">
                <BarChart data={sentimentByPlatform}>
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {sentimentByPlatform.map((entry) => (
                      <Cell key={entry.name} fill={sentimentConfig[entry.name as keyof typeof sentimentConfig]?.color ?? "#78716c"} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Recent Queries</CardTitle></CardHeader>
          <CardContent>
            <div className="max-h-96 overflow-y-auto">
              <Table>
                <TableHeader><TableRow className="hover:bg-transparent sticky top-0 bg-background z-10">
                  <TableHead>Query</TableHead><TableHead>Platform</TableHead><TableHead>Mentioned</TableHead><TableHead className="tabular-nums">Position</TableHead><TableHead>Sentiment</TableHead><TableHead>Gap</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {last10.map((r, i) => (
                    <motion.tr key={r.id as number} {...stagger.item(i * 0.03)} className="border-b transition-colors hover:bg-muted/50">
                      <TableCell className="text-sm font-medium max-w-[200px] truncate">{String(r.query)}</TableCell>
                      <TableCell><Badge variant="outline" className="text-xs">{String(r.aiPlatform)}</Badge></TableCell>
                      <TableCell>{r.brandMentioned === true || r.brandMentioned === "true" ? <CheckCircle className="h-4 w-4 text-emerald-600" /> : <span className="text-muted-foreground text-xs">No</span>}</TableCell>
                      <TableCell className="tabular-nums text-sm">{Number(r.position) || "—"}</TableCell>
                      <TableCell><Badge variant="outline" className="text-xs">{String(r.sentiment)}</Badge></TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-[180px] truncate">{String(r.gap || "—")}</TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

// ── 6. Content Pipeline ───────────────────────────────
export function ContentPipelineTab() {
  const { data, loading } = useDataFetch("/api/content-pipeline");
  const kpis = useMemo(() => ({
    total: data.length,
    published: data.filter((r) => String(r.status) === "Published").length,
    inProgress: data.filter((r) => String(r.status) === "In Progress" || String(r.status) === "In Review").length,
    avgWordCount: avgNum(data, "wordCountTarget"),
  }), [data]);
  const statusData = useMemo(() => countBy(data, "status"), [data]);
  const clusterData = useMemo(() => countBy(data, "cluster").slice(0, 10), [data]);
  const last10 = useMemo(() => [...data].reverse().slice(0, 10), [data]);

  const statusConfig: ChartConfig = { value: { label: "Count", color: "#059669" } };
  const clusterConfig: ChartConfig = { value: { label: "Items", color: "#0d9488" } };

  if (loading) return <LoadingSkeleton />;
  if (!data.length) return <EmptyState moduleName="Content Pipeline" />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Total Items", value: kpis.total, icon: FileText },
          { title: "Published", value: kpis.published, icon: CheckCircle },
          { title: "In Progress", value: kpis.inProgress, icon: Loader },
          { title: "Avg Word Count", value: kpis.avgWordCount.toLocaleString(), icon: Layers },
        ].map((kpi, i) => (
          <motion.div key={kpi.title} {...stagger.item(i)}>
            <KpiCard title={kpi.title} value={kpi.value} icon={kpi.icon} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.25 }}>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Status Distribution</CardTitle></CardHeader>
            <CardContent>
              <ChartContainer config={statusConfig} className="h-64 w-full">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                  <ChartLegend content={<ChartLegendContent nameKey="name" />} />
                  <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={85} innerRadius={50}>
                    {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Items by Cluster</CardTitle></CardHeader>
            <CardContent>
              <ChartContainer config={clusterConfig} className="h-64 w-full">
                <BarChart data={clusterData} layout="vertical" margin={{ left: 10 }}>
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 11 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill="var(--color-value)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Recent Items</CardTitle></CardHeader>
          <CardContent>
            <div className="max-h-96 overflow-y-auto">
              <Table>
                <TableHeader><TableRow className="hover:bg-transparent sticky top-0 bg-background z-10">
                  <TableHead>Title</TableHead><TableHead>Cluster</TableHead><TableHead>Writer</TableHead><TableHead>Status</TableHead><TableHead>Priority</TableHead><TableHead className="tabular-nums">Words</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {last10.map((r, i) => (
                    <motion.tr key={r.id as number} {...stagger.item(i * 0.03)} className="border-b transition-colors hover:bg-muted/50">
                      <TableCell className="text-sm font-medium max-w-[200px] truncate">{String(r.title)}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{String(r.cluster || "—")}</TableCell>
                      <TableCell className="text-sm">{String(r.writer || "—")}</TableCell>
                      <TableCell><Badge variant="secondary" className="text-xs">{String(r.status)}</Badge></TableCell>
                      <TableCell><Badge variant="outline" className="text-xs">{String(r.priority)}</Badge></TableCell>
                      <TableCell className="tabular-nums text-sm">{Number(r.wordCountTarget).toLocaleString()}</TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

// ── 7. Performance Dashboard ──────────────────────────
export function PerformanceTab() {
  const { data, loading } = useDataFetch("/api/performance");
  const kpis = useMemo(() => ({
    totalPages: new Set(data.map((r) => String(r.page))).size,
    totalClicks: sumNum(data, "clicks"),
    avgCtr: data.length ? (data.reduce((s, r) => s + (Number(r.ctr) || 0), 0) / data.length).toFixed(2) : "0",
    totalLeads: sumNum(data, "leads"),
    totalConversions: sumNum(data, "conversions"),
  }), [data]);
  const clicksBySource = useMemo(() => {
    const map = new Map<string, number>();
    data.forEach((r) => { const s = String(r.trafficSource || "Other"); map.set(s, (map.get(s) ?? 0) + (Number(r.clicks) || 0)); });
    return Array.from(map.entries()).map(([name, clicks]) => ({ name, clicks })).sort((a, b) => b.clicks - a.clicks);
  }, [data]);
  const weekTrend = useMemo(() => {
    const map = new Map<string, { week: string; avgRank: number; clicks: number }>();
    data.forEach((r) => {
      const w = String(r.weekOf);
      if (!map.has(w)) map.set(w, { week: w, avgRank: 0, clicks: 0 });
      const entry = map.get(w)!;
      entry.clicks += Number(r.clicks) || 0;
    });
    // Compute avg rank per week
    const countMap = new Map<string, number[]>();
    data.forEach((r) => {
      const w = String(r.weekOf);
      if (!countMap.has(w)) countMap.set(w, []);
      countMap.get(w)!.push(Number(r.rank) || 0);
    });
    countMap.forEach((ranks, w) => {
      const entry = map.get(w)!;
      entry.avgRank = Math.round(ranks.reduce((a, b) => a + b, 0) / ranks.length);
    });
    return Array.from(map.values()).sort((a, b) => a.week.localeCompare(b.week));
  }, [data]);
  const last10 = useMemo(() => [...data].reverse().slice(0, 10), [data]);

  const sourceConfig: ChartConfig = { clicks: { label: "Clicks", color: "#059669" } };
  const trendConfig: ChartConfig = { avgRank: { label: "Avg Rank", color: "#d97706" }, clicks: { label: "Clicks", color: "#059669" } };

  if (loading) return <LoadingSkeleton />;
  if (!data.length) return <EmptyState moduleName="Performance" />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          { title: "Total Pages", value: kpis.totalPages, icon: FileText },
          { title: "Total Clicks", value: kpis.totalClicks.toLocaleString(), icon: TrendingUp },
          { title: "Avg CTR", value: kpis.avgCtr, suffix: "%", icon: Target },
          { title: "Total Leads", value: kpis.totalLeads.toLocaleString(), icon: Users },
          { title: "Conversions", value: kpis.totalConversions.toLocaleString(), icon: CheckCircle },
        ].map((kpi, i) => (
          <motion.div key={kpi.title} {...stagger.item(i)}>
            <KpiCard title={kpi.title} value={kpi.value} icon={kpi.icon} suffix={kpi.suffix} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.25 }}>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Clicks by Traffic Source</CardTitle></CardHeader>
            <CardContent>
              <ChartContainer config={sourceConfig} className="h-64 w-full">
                <BarChart data={clicksBySource}>
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="clicks" fill="var(--color-clicks)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Rank Trend by Week</CardTitle></CardHeader>
            <CardContent>
              <ChartContainer config={trendConfig} className="h-64 w-full">
                <LineChart data={weekTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Line type="monotone" dataKey="avgRank" stroke="var(--color-avgRank)" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="clicks" stroke="var(--color-clicks)" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Recent Performance</CardTitle></CardHeader>
          <CardContent>
            <div className="max-h-96 overflow-y-auto">
              <Table>
                <TableHeader><TableRow className="hover:bg-transparent sticky top-0 bg-background z-10">
                  <TableHead>Page</TableHead><TableHead>Keyword</TableHead><TableHead className="tabular-nums">Rank</TableHead><TableHead className="tabular-nums">Clicks</TableHead><TableHead className="tabular-nums">CTR</TableHead><TableHead className="tabular-nums">Leads</TableHead><TableHead>Source</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {last10.map((r, i) => (
                    <motion.tr key={r.id as number} {...stagger.item(i * 0.03)} className="border-b transition-colors hover:bg-muted/50">
                      <TableCell className="text-sm font-medium max-w-[160px] truncate">{String(r.page)}</TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-[140px] truncate">{String(r.keyword || "—")}</TableCell>
                      <TableCell className="tabular-nums text-sm">{Number(r.rank)}</TableCell>
                      <TableCell className="tabular-nums text-sm">{Number(r.clicks).toLocaleString()}</TableCell>
                      <TableCell className="tabular-nums text-sm">{Number(r.ctr).toFixed(2)}%</TableCell>
                      <TableCell className="tabular-nums text-sm">{Number(r.leads)}</TableCell>
                      <TableCell><Badge variant="outline" className="text-xs">{String(r.trafficSource || "—")}</Badge></TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

// ── 8. Content Gap Tracker ────────────────────────────
export function ContentGapTab() {
  const { data, loading } = useDataFetch("/api/content-gap");
  const kpis = useMemo(() => ({
    total: data.length,
    serviceLinePct: data.length ? Math.round((data.filter((r) => r.serviceLineSupported === true || r.serviceLineSupported === "true").length / data.length) * 100) : 0,
    competitorCovPct: data.length ? Math.round((data.filter((r) => r.competitorCoverage === true || r.competitorCoverage === "true").length / data.length) * 100) : 0,
    highPriority: data.filter((r) => String(r.priority) === "Critical" || String(r.priority) === "High").length,
  }), [data]);
  const clusterData = useMemo(() => countBy(data, "cluster").slice(0, 10), [data]);
  const statusData = useMemo(() => countBy(data, "status"), [data]);
  const last10 = useMemo(() => [...data].reverse().slice(0, 10), [data]);

  const clusterConfig: ChartConfig = { value: { label: "Gaps", color: "#059669" } };
  const statusConfig: ChartConfig = { value: { label: "Count", color: "#d97706" } };

  if (loading) return <LoadingSkeleton />;
  if (!data.length) return <EmptyState moduleName="Content Gap Tracker" />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Total Gaps", value: kpis.total, icon: Target },
          { title: "Service Line %", value: kpis.serviceLinePct, suffix: "%", icon: CheckCircle },
          { title: "Competitor Cov %", value: kpis.competitorCovPct, suffix: "%", icon: Globe },
          { title: "High Priority", value: kpis.highPriority, icon: TrendingUp },
        ].map((kpi, i) => (
          <motion.div key={kpi.title} {...stagger.item(i)}>
            <KpiCard title={kpi.title} value={kpi.value} icon={kpi.icon} suffix={kpi.suffix} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.25 }}>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Gaps by Cluster</CardTitle></CardHeader>
            <CardContent>
              <ChartContainer config={clusterConfig} className="h-64 w-full">
                <BarChart data={clusterData} layout="vertical" margin={{ left: 10 }}>
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 11 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill="var(--color-value)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Gaps by Status</CardTitle></CardHeader>
            <CardContent>
              <ChartContainer config={statusConfig} className="h-64 w-full">
                <BarChart data={statusData}>
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill="var(--color-value)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Recent Gaps</CardTitle></CardHeader>
          <CardContent>
            <div className="max-h-96 overflow-y-auto">
              <Table>
                <TableHeader><TableRow className="hover:bg-transparent sticky top-0 bg-background z-10">
                  <TableHead>Cluster</TableHead><TableHead>Missing Subtopic</TableHead><TableHead>Demand</TableHead><TableHead>Priority</TableHead><TableHead>Type</TableHead><TableHead>Status</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {last10.map((r, i) => (
                    <motion.tr key={r.id as number} {...stagger.item(i * 0.03)} className="border-b transition-colors hover:bg-muted/50">
                      <TableCell className="text-sm font-medium">{String(r.cluster)}</TableCell>
                      <TableCell className="text-sm max-w-[200px] truncate">{String(r.missingSubtopic)}</TableCell>
                      <TableCell><Badge variant="outline" className="text-xs">{String(r.demand)}</Badge></TableCell>
                      <TableCell><Badge variant="secondary" className="text-xs">{String(r.priority)}</Badge></TableCell>
                      <TableCell className="text-xs text-muted-foreground">{String(r.suggestedType || "—")}</TableCell>
                      <TableCell><Badge variant="outline" className="text-xs">{String(r.status)}</Badge></TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}