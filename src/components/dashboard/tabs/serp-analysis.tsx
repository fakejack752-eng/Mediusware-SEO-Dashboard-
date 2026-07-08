"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Eye, BarChart3, CheckCircle, TrendingUp, Sparkles } from "lucide-react";
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
  EMERALD,
  countBy,
  avgNum,
  fadeInUp,
  AnimatedCard,
  AnimatedRow,
  getStatusColor,
} from "@/components/dashboard/tab-helpers";

export function SerpAnalysisTab() {
  const { data, loading } = useDataFetch("/api/serp-analysis");

  const kpis = useMemo(
    () => ({
      total: data.length,
      avgRank: avgNum(data, "rank"),
      featuredPct: data.length
        ? Math.round(
            (data.filter(
              (r) => r.featuredSnippet === true || r.featuredSnippet === "true"
            ).length /
              data.length) *
              100
          )
        : 0,
      opportunities: data.filter(
        (r) => r.formatOpportunity && r.formatOpportunity !== "None"
      ).length,
    }),
    [data]
  );

  const rankBuckets = useMemo(() => {
    const b: Record<string, number> = {
      "1-3": 0,
      "4-10": 0,
      "11-20": 0,
      "21-50": 0,
      "51+": 0,
    };
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

  const contentTypeData = useMemo(
    () => countBy(data, "contentType").slice(0, 8),
    [data]
  );

  const last10 = useMemo(
    () => [...data].reverse().slice(0, 10),
    [data]
  );

  const rankConfig: ChartConfig = {
    value: { label: "Count", color: EMERALD },
  };

  const typeConfig: ChartConfig = {
    value: { label: "Count", color: "#0d9488" },
  };

  if (loading) return <LoadingSkeleton />;
  if (!data.length) return <EmptyState moduleName="SERP Analysis" />;

  return (
    <motion.div
      className="space-y-6"
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
    >
      {/* ── KPI Grid ──────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={fadeInUp} custom={0}>
          <KpiCard
            title="Total Tracked"
            value={kpis.total}
            icon={Eye}
            accentColor="emerald"
          />
        </motion.div>
        <motion.div variants={fadeInUp} custom={1}>
          <KpiCard
            title="Avg Rank"
            value={kpis.avgRank}
            icon={BarChart3}
            accentColor="teal"
          />
        </motion.div>
        <motion.div variants={fadeInUp} custom={2}>
          <KpiCard
            title="Featured Snippet %"
            value={kpis.featuredPct}
            suffix="%"
            icon={CheckCircle}
            accentColor="amber"
          />
        </motion.div>
        <motion.div variants={fadeInUp} custom={3}>
          <KpiCard
            title="Opportunities"
            value={kpis.opportunities}
            icon={TrendingUp}
            accentColor="stone"
          />
        </motion.div>
      </div>

      {/* ── Charts Grid ───────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AnimatedCard delay={0.25}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Rank Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={rankConfig} className="h-64 w-full">
                <BarChart data={rankBuckets}>
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="value"
                    fill="var(--color-value)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </AnimatedCard>

        <AnimatedCard delay={0.35}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Content Type Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={typeConfig} className="h-64 w-full">
                <PieChart>
                  <ChartTooltip
                    content={<ChartTooltipContent nameKey="name" />}
                  />
                  <ChartLegend
                    content={<ChartLegendContent nameKey="name" />}
                  />
                  <Pie
                    data={contentTypeData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={85}
                    innerRadius={45}
                  >
                    {contentTypeData.map((_, i) => (
                      <Cell
                        key={i}
                        fill={COLORS[i % COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </AnimatedCard>
      </div>

      {/* ── Recent Analysis Table ─────────────────────── */}
      <AnimatedCard delay={0.4}>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Recent Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-96 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent sticky top-0 bg-background z-10">
                    <TableHead>Keyword</TableHead>
                    <TableHead className="tabular-nums">Rank</TableHead>
                    <TableHead>Domain</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {last10.map((r, i) => {
                    const isFeatured =
                      r.featuredSnippet === true ||
                      r.featuredSnippet === "true";
                    return (
                      <AnimatedRow key={r.id as number} index={i}>
                        <TableCell className="text-sm font-medium">
                          {String(r.keyword)}
                        </TableCell>
                        <TableCell className="tabular-nums text-sm">
                          {Number(r.rank)}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground max-w-[180px] truncate">
                          {String(r.rankingUrlDomain)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {String(r.contentType || "—")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {isFeatured ? (
                            <CheckCircle className="h-4 w-4 text-emerald-600" />
                          ) : (
                            <span className="text-muted-foreground text-xs">
                              —
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {String(r.action || "—")}
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
    </motion.div>
  );
}