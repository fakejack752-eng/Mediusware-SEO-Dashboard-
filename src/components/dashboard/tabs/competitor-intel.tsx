"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Users, Shield, Globe, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { KpiCard } from "@/components/dashboard/kpi-card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis, Pie, PieChart, Cell } from "recharts";
import {
  useDataFetch,
  EmptyState,
  LoadingSkeleton,
  COLORS,
  countBy,
  avgNum,
  sumNum,
  fadeInUp,
  AnimatedCard,
  AnimatedRow,
  getPriorityColor,
} from "@/components/dashboard/tab-helpers";

export function CompetitorIntelTab() {
  const { data, loading } = useDataFetch("/api/competitor-intel");

  const kpis = useMemo(
    () => ({
      total: data.length,
      uniqueCompetitors: new Set(data.map((r) => String(r.competitor))).size,
      avgDa: avgNum(data, "estDa"),
      totalTraffic: sumNum(data, "estTraffic"),
    }),
    [data],
  );

  const topCompetitors = useMemo(() => {
    const map = new Map<string, number>();
    data.forEach((r) => {
      const c = String(r.competitor);
      map.set(c, (map.get(c) ?? 0) + (Number(r.estTraffic) || 0));
    });
    return Array.from(map.entries())
      .map(([name, traffic]) => ({ name, traffic }))
      .sort((a, b) => b.traffic - a.traffic)
      .slice(0, 10);
  }, [data]);

  const contentTypeData = useMemo(() => countBy(data, "contentType").slice(0, 8), [data]);

  const last10 = useMemo(() => [...data].reverse().slice(0, 10), [data]);

  const trafficConfig: ChartConfig = {
    traffic: { label: "Est. Traffic", color: "#00A99D" },
  };

  const typeConfig: ChartConfig = Object.fromEntries(
    contentTypeData.map((entry, i) => [entry.name, { label: entry.name, color: COLORS[i % COLORS.length] }]),
  ) as ChartConfig;

  if (loading) return <LoadingSkeleton />;
  if (!data.length) return <EmptyState moduleName="Competitor Intelligence" />;

  return (
    <div className="space-y-6">
      {/* ── KPI Grid ─────────────────────────────────────── */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <KpiCard
          title="Total Entries"
          value={kpis.total}
          icon={Users}
          accentColor="teal"
        />
        <KpiCard
          title="Unique Competitors"
          value={kpis.uniqueCompetitors}
          icon={Users}
          accentColor="blue"
        />
        <KpiCard
          title="Avg DA"
          value={kpis.avgDa}
          icon={Shield}
          accentColor="green"
        />
        <KpiCard
          title="Total Est. Traffic"
          value={kpis.totalTraffic.toLocaleString()}
          icon={Globe}
          accentColor="amber"
        />
      </motion.div>

      {/* ── Charts Grid ──────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AnimatedCard delay={0.25}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Top 10 by Est. Traffic</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={trafficConfig} className="h-72 w-full">
                <BarChart data={topCompetitors} layout="vertical" margin={{ left: 20 }}>
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 11 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="traffic"
                    fill="var(--color-traffic)"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </AnimatedCard>

        <AnimatedCard delay={0.35}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Content Type Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={typeConfig} className="h-72 w-full">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                  <ChartLegend content={<ChartLegendContent nameKey="name" />} />
                  <Pie
                    data={contentTypeData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    innerRadius={50}
                  >
                    {contentTypeData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </AnimatedCard>
      </div>

      {/* ── Recent Entries Table ─────────────────────────── */}
      <AnimatedCard delay={0.45}>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Recent Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-96 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent sticky top-0 bg-background z-10">
                    <TableHead>Competitor</TableHead>
                    <TableHead>Domain</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Keyword</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead className="w-20 tabular-nums">DA</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {last10.map((r, i) => (
                    <AnimatedRow key={r.id as number} index={i}>
                      <TableCell className="text-sm font-medium">
                        {String(r.competitor)}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {String(r.domain || "—")}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {String(r.contentType || "—")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm max-w-[180px] truncate">
                        {String(r.targetKeyword || "—")}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={`text-xs ${getPriorityColor(String(r.priority))}`}
                        >
                          {String(r.priority)}
                        </Badge>
                      </TableCell>
                      <TableCell className="tabular-nums text-sm">
                        {Number(r.estDa)}
                      </TableCell>
                    </AnimatedRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </AnimatedCard>
    </div>
  );
}