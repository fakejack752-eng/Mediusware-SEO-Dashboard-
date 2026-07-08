"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Search, TrendingUp, Target, ArrowUpCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis, Cell, Scatter, ScatterChart, ZAxis } from "recharts";
import { useDataFetch, EmptyState, LoadingSkeleton, COLORS, countBy, avgNum, fadeInUp, AnimatedCard, AnimatedRow, getStatusColor } from "@/components/dashboard/tab-helpers";

export function KeywordIntelTab() {
  const { data, loading } = useDataFetch("/api/keyword-intel");

  const kpis = useMemo(() => ({
    total: data.length,
    avgVolume: avgNum(data, "volume"),
    avgKd: avgNum(data, "kd"),
    highPriority: data.filter((r) => Number(r.priorityScore) >= 70).length,
  }), [data]);

  const scatterData = useMemo(
    () =>
      data
        .map((r) => ({
          x: Number(r.volume) || 0,
          y: Number(r.kd) || 0,
          z: Number(r.priorityScore) || 1,
          name: String(r.keyword),
        }))
        .sort((a, b) => b.x - a.x)
        .slice(0, 50),
    [data],
  );

  const intentData = useMemo(() => countBy(data, "intent"), [data]);

  const top10 = useMemo(
    () => [...data].sort((a, b) => (Number(b.priorityScore) || 0) - (Number(a.priorityScore) || 0)).slice(0, 10),
    [data],
  );

  const scatterConfig: ChartConfig = {
    volume: { label: "Volume", color: "#059669" },
    kd: { label: "KD", color: "#d97706" },
    priorityScore: { label: "Priority", color: "#059669" },
  };

  const intentConfig: ChartConfig = {
    value: { label: "Count", color: "#0d9488" },
  };

  if (loading) return <LoadingSkeleton />;
  if (!data.length) return <EmptyState moduleName="Keyword Intelligence" />;

  return (
    <motion.div className="space-y-6" variants={fadeInUp} initial="hidden" animate="visible">
      {/* ── KPI Grid ─────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={fadeInUp} custom={0}>
          <KpiCard title="Total Keywords" value={kpis.total} icon={Search} accentColor="emerald" />
        </motion.div>
        <motion.div variants={fadeInUp} custom={1}>
          <KpiCard title="Avg Volume" value={kpis.avgVolume.toLocaleString()} icon={TrendingUp} accentColor="teal" />
        </motion.div>
        <motion.div variants={fadeInUp} custom={2}>
          <KpiCard title="Avg KD" value={kpis.avgKd} icon={Target} accentColor="amber" />
        </motion.div>
        <motion.div variants={fadeInUp} custom={3}>
          <KpiCard title="High Priority" value={kpis.highPriority} icon={ArrowUpCircle} accentColor="stone" />
        </motion.div>
      </div>

      {/* ── Charts Grid ──────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AnimatedCard delay={0.25}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Volume vs Difficulty</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={scatterConfig} className="h-72 w-full">
                <ScatterChart margin={{ left: 10, right: 10 }}>
                  <XAxis type="number" dataKey="x" name="Volume" tick={{ fontSize: 11 }} />
                  <YAxis type="number" dataKey="y" name="KD" tick={{ fontSize: 11 }} />
                  <ZAxis type="number" dataKey="z" range={[40, 400]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Scatter data={scatterData} fill="#059669" />
                </ScatterChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </AnimatedCard>

        <AnimatedCard delay={0.35}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Intent Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={intentConfig} className="h-72 w-full">
                <BarChart data={intentData}>
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {intentData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </AnimatedCard>
      </div>

      {/* ── Top Priority Table ───────────────────────────── */}
      <AnimatedCard delay={0.45}>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Top Priority Keywords</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-96 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent sticky top-0 bg-background z-10">
                    <TableHead>Keyword</TableHead>
                    <TableHead>Cluster</TableHead>
                    <TableHead className="tabular-nums">Volume</TableHead>
                    <TableHead className="tabular-nums">KD</TableHead>
                    <TableHead>Intent</TableHead>
                    <TableHead className="tabular-nums">Priority</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {top10.map((r, i) => (
                    <AnimatedRow key={r.id as number} index={i}>
                      <TableCell className="text-sm font-medium">{String(r.keyword)}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{String(r.cluster || "—")}</TableCell>
                      <TableCell className="tabular-nums text-sm">{Number(r.volume).toLocaleString()}</TableCell>
                      <TableCell className="tabular-nums text-sm">{Number(r.kd)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">{String(r.intent)}</Badge>
                      </TableCell>
                      <TableCell className="tabular-nums text-sm">{Number(r.priorityScore)}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={`text-xs ${getStatusColor(String(r.status))}`}>
                          {String(r.status)}
                        </Badge>
                      </TableCell>
                    </AnimatedRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </AnimatedCard>
    </motion.div>
  );
}