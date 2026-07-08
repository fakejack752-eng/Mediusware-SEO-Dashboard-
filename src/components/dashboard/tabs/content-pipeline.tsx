"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { FileText, CheckCircle, Loader, Layers, Clock } from "lucide-react";
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
  TEAL,
  countBy,
  avgNum,
  fadeInUp,
  AnimatedCard,
  AnimatedRow,
  getStatusColor,
  getPriorityColor,
} from "@/components/dashboard/tab-helpers";

export function ContentPipelineTab() {
  const { data, loading } = useDataFetch("/api/content-pipeline");

  const kpis = useMemo(
    () => ({
      total: data.length,
      published: data.filter((r) => String(r.status) === "Published").length,
      inProgress: data.filter(
        (r) => String(r.status) === "In Progress" || String(r.status) === "In Review"
      ).length,
      avgWordCount: avgNum(data, "wordCountTarget"),
    }),
    [data]
  );

  const statusData = useMemo(() => countBy(data, "status"), [data]);
  const clusterData = useMemo(() => countBy(data, "cluster").slice(0, 10), [data]);
  const last10 = useMemo(() => [...data].reverse().slice(0, 10), [data]);

  const statusConfig: ChartConfig = { value: { label: "Count", color: "#00A99D" } };
  const clusterConfig: ChartConfig = { value: { label: "Items", color: TEAL } };

  if (loading) return <LoadingSkeleton />;
  if (!data.length) return <EmptyState moduleName="Content Pipeline" />;

  return (
    <div className="space-y-6">
      {/* ── KPI Grid ─────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {(
          [
            { title: "Total Items", value: kpis.total, icon: FileText, accent: "teal" as const },
            { title: "Published", value: kpis.published, icon: CheckCircle, accent: "blue" as const },
            { title: "In Progress", value: kpis.inProgress, icon: Loader, accent: "green" as const },
            { title: "Avg Word Count", value: kpis.avgWordCount.toLocaleString(), icon: Layers, accent: "amber" as const },
          ] as const
        ).map((kpi, i) => (
          <motion.div key={kpi.title} custom={i} variants={fadeInUp} initial="hidden" animate="visible">
            <KpiCard title={kpi.title} value={kpi.value} icon={kpi.icon} accentColor={kpi.accent} />
          </motion.div>
        ))}
      </div>

      {/* ── Charts Grid ──────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Status Pipeline — Donut Chart */}
        <AnimatedCard delay={0.25}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Status Pipeline</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={statusConfig} className="h-64 w-full">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                  <ChartLegend content={<ChartLegendContent nameKey="name" />} />
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={85}
                    innerRadius={50}
                  >
                    {statusData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </AnimatedCard>

        {/* Items by Cluster — Horizontal Bar Chart */}
        <AnimatedCard delay={0.35}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Items by Cluster</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={clusterConfig} className="h-64 w-full">
                <BarChart data={clusterData} layout="vertical" margin={{ left: 10 }}>
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 11 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill={TEAL} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </AnimatedCard>
      </div>

      {/* ── Recent Items Table ───────────────────────── */}
      <AnimatedCard delay={0.4}>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Recent Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-96 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent sticky top-0 bg-background z-10">
                    <TableHead>Title</TableHead>
                    <TableHead>Cluster</TableHead>
                    <TableHead>Writer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead className="tabular-nums">Words</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {last10.map((r, i) => (
                    <AnimatedRow key={r.id as number} index={i}>
                      <TableCell className="text-sm font-medium max-w-[200px] truncate">
                        {String(r.title)}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {String(r.cluster || "—")}
                      </TableCell>
                      <TableCell className="text-sm">{String(r.writer || "—")}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={`text-xs ${getStatusColor(String(r.status))}`}>
                          {String(r.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-xs ${getPriorityColor(String(r.priority))}`}>
                          {String(r.priority)}
                        </Badge>
                      </TableCell>
                      <TableCell className="tabular-nums text-sm">
                        {Number(r.wordCountTarget).toLocaleString()}
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