"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { FileText, TrendingUp, Target, Users, CheckCircle, Eye, ArrowUp, ArrowDown, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, type ChartConfig } from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis, Line, LineChart, CartesianGrid } from "recharts";
import { useDataFetch, EmptyState, LoadingSkeleton, sumNum, avgNum, fadeInUp, AnimatedCard, AnimatedRow } from "@/components/dashboard/tab-helpers";

export function PerformanceTab() {
  const { data, loading } = useDataFetch("/api/performance");

  const kpis = useMemo(() => {
    const totalPages = new Set(data.map((r) => String(r.page))).size;
    const totalClicks = sumNum(data, "clicks");
    const avgCtr = data.length
      ? (data.reduce((s, r) => s + (Number(r.ctr) || 0), 0) / data.length).toFixed(2)
      : "0";
    const totalLeads = sumNum(data, "leads");
    const totalConversions = sumNum(data, "conversions");
    return { totalPages, totalClicks, avgCtr, totalLeads, totalConversions };
  }, [data]);

  const clicksBySource = useMemo(() => {
    const map = new Map<string, number>();
    data.forEach((r) => {
      const source = String(r.trafficSource || "Other");
      map.set(source, (map.get(source) ?? 0) + (Number(r.clicks) || 0));
    });
    return Array.from(map.entries())
      .map(([name, clicks]) => ({ name, clicks }))
      .sort((a, b) => b.clicks - a.clicks);
  }, [data]);

  const weekTrend = useMemo(() => {
    const weekMap = new Map<string, { week: string; ranks: number[]; clicks: number }>();
    data.forEach((r) => {
      const w = String(r.weekOf);
      if (!weekMap.has(w)) weekMap.set(w, { week: w, ranks: [], clicks: 0 });
      const entry = weekMap.get(w)!;
      entry.ranks.push(Number(r.rank) || 0);
      entry.clicks += Number(r.clicks) || 0;
    });
    return Array.from(weekMap.values())
      .map(({ week, ranks, clicks }) => ({
        week,
        avgRank: ranks.length ? Math.round(ranks.reduce((a, b) => a + b, 0) / ranks.length) : 0,
        clicks,
      }))
      .sort((a, b) => a.week.localeCompare(b.week));
  }, [data]);

  const last10 = useMemo(() => [...data].reverse().slice(0, 10), [data]);

  const sourceConfig: ChartConfig = { clicks: { label: "Clicks", color: "#00A99D" } };
  const trendConfig: ChartConfig = {
    avgRank: { label: "Avg Rank", color: "#d97706" },
    clicks: { label: "Clicks", color: "#00A99D" },
  };

  if (loading) return <LoadingSkeleton />;
  if (!data.length) return <EmptyState moduleName="Performance" />;

  return (
    <div className="space-y-6">
      {/* ── KPI Grid ─────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          { title: "Total Pages", value: kpis.totalPages, icon: FileText, accentColor: "teal" as const },
          { title: "Total Clicks", value: kpis.totalClicks.toLocaleString(), icon: TrendingUp, accentColor: "blue" as const },
          { title: "Avg CTR", value: kpis.avgCtr, suffix: "%", icon: Target, accentColor: "green" as const },
          { title: "Total Leads", value: kpis.totalLeads.toLocaleString(), icon: Users, accentColor: "amber" as const },
          { title: "Conversions", value: kpis.totalConversions.toLocaleString(), icon: CheckCircle, accentColor: "teal" as const },
        ].map((kpi, i) => (
          <motion.div key={kpi.title} variants={fadeInUp} custom={i} initial="hidden" animate="visible">
            <KpiCard
              title={kpi.title}
              value={kpi.value}
              icon={kpi.icon}
              suffix={kpi.suffix}
              accentColor={kpi.accentColor}
            />
          </motion.div>
        ))}
      </div>

      {/* ── Charts Grid ──────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AnimatedCard delay={0.25}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Clicks by Traffic Source</CardTitle>
            </CardHeader>
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
        </AnimatedCard>

        <AnimatedCard delay={0.35}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Weekly Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={trendConfig} className="h-64 w-full">
                <LineChart data={weekTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Line
                    type="monotone"
                    dataKey="avgRank"
                    stroke="var(--color-avgRank)"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="clicks"
                    stroke="var(--color-clicks)"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </AnimatedCard>
      </div>

      {/* ── Recent Performance Table ─────────────────────── */}
      <AnimatedCard delay={0.4}>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Recent Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-96 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent sticky top-0 bg-background z-10">
                    <TableHead>Page</TableHead>
                    <TableHead>Keyword</TableHead>
                    <TableHead className="tabular-nums">Rank</TableHead>
                    <TableHead className="tabular-nums">Clicks</TableHead>
                    <TableHead className="tabular-nums">CTR</TableHead>
                    <TableHead className="tabular-nums">Leads</TableHead>
                    <TableHead>Source</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {last10.map((r, i) => {
                    const rankChange = Number(r.rankChange) || 0;
                    return (
                      <AnimatedRow key={r.id as number} index={i}>
                        <TableCell className="text-sm font-medium max-w-[160px] truncate">
                          {String(r.page)}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground max-w-[140px] truncate">
                          {String(r.keyword || "—")}
                        </TableCell>
                        <TableCell className="tabular-nums text-sm">
                          <span className="inline-flex items-center gap-1">
                            {Number(r.rank)}
                            {rankChange < 0 && (
                              <ArrowUp className="h-3 w-3 text-emerald-500" />
                            )}
                            {rankChange > 0 && (
                              <ArrowDown className="h-3 w-3 text-red-500" />
                            )}
                            {rankChange === 0 && (
                              <Minus className="h-3 w-3 text-muted-foreground" />
                            )}
                          </span>
                        </TableCell>
                        <TableCell className="tabular-nums text-sm">
                          {Number(r.clicks).toLocaleString()}
                        </TableCell>
                        <TableCell className="tabular-nums text-sm">
                          {Number(r.ctr).toFixed(2)}%
                        </TableCell>
                        <TableCell className="tabular-nums text-sm">
                          {Number(r.leads)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {String(r.trafficSource || "—")}
                          </Badge>
                        </TableCell>
                      </AnimatedRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </AnimatedCard>
    </div>
  );
}