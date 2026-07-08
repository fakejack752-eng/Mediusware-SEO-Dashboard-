"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Target, CheckCircle, Globe, TrendingUp, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis, Cell } from "recharts";
import {
  useDataFetch,
  EmptyState,
  LoadingSkeleton,
  EMBER,
  countBy,
  fadeInUp,
  AnimatedCard,
  AnimatedRow,
  getPriorityColor,
  getStatusColor,
} from "@/components/dashboard/tab-helpers";

const PRIORITY_CELL_COLORS: Record<string, string> = {
  Critical: "#dc2626",
  High: "#d97706",
  Medium: "#0d9488",
  Low: "#78716c",
};

export function ContentGapTab() {
  const { data, loading } = useDataFetch("/api/content-gap");

  const kpis = useMemo(
    () => ({
      total: data.length,
      serviceLinePct: data.length
        ? Math.round(
            (data.filter(
              (r) => r.serviceLineSupported === true || r.serviceLineSupported === "true"
            ).length /
              data.length) *
              100
          )
        : 0,
      competitorCovPct: data.length
        ? Math.round(
            (data.filter(
              (r) => r.competitorCoverage === true || r.competitorCoverage === "true"
            ).length /
              data.length) *
              100
          )
        : 0,
      highPriority: data.filter(
        (r) => String(r.priority) === "Critical" || String(r.priority) === "High"
      ).length,
    }),
    [data]
  );

  const clusterData = useMemo(() => countBy(data, "cluster").slice(0, 10), [data]);
  const priorityData = useMemo(() => countBy(data, "priority"), [data]);
  const last10 = useMemo(() => [...data].reverse().slice(0, 10), [data]);

  const clusterConfig: ChartConfig = {
    value: { label: "Gaps", color: "#059669" },
  };
  const priorityConfig: ChartConfig = {
    value: { label: "Count", color: EMBER },
  };

  if (loading) return <LoadingSkeleton />;
  if (!data.length) return <EmptyState moduleName="Content Gap Tracker" />;

  return (
    <motion.div className="space-y-6" variants={fadeInUp} initial="hidden" animate="visible">
      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={fadeInUp} custom={0}>
          <KpiCard
            title="Total Gaps"
            value={kpis.total}
            icon={Target}
            accentColor="emerald"
          />
        </motion.div>
        <motion.div variants={fadeInUp} custom={1}>
          <KpiCard
            title="Service Line %"
            value={kpis.serviceLinePct}
            suffix="%"
            icon={CheckCircle}
            accentColor="teal"
          />
        </motion.div>
        <motion.div variants={fadeInUp} custom={2}>
          <KpiCard
            title="Competitor Coverage %"
            value={kpis.competitorCovPct}
            suffix="%"
            icon={Globe}
            accentColor="amber"
          />
        </motion.div>
        <motion.div variants={fadeInUp} custom={3}>
          <KpiCard
            title="High Priority"
            value={kpis.highPriority}
            icon={AlertTriangle}
            accentColor="stone"
          />
        </motion.div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AnimatedCard delay={0.25}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Gaps by Cluster</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={clusterConfig} className="h-64 w-full">
                <BarChart data={clusterData} layout="vertical" margin={{ left: 10 }}>
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={120}
                    tick={{ fontSize: 11 }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="value"
                    fill="var(--color-value)"
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
              <CardTitle className="text-sm font-medium">Priority Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={priorityConfig} className="h-64 w-full">
                <BarChart data={priorityData}>
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {priorityData.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={PRIORITY_CELL_COLORS[entry.name] ?? "#78716c"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </AnimatedCard>
      </div>

      {/* Recent Gaps Table */}
      <AnimatedCard delay={0.4}>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Recent Gaps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-96 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent sticky top-0 bg-background z-10">
                    <TableHead>Cluster</TableHead>
                    <TableHead>Missing Subtopic</TableHead>
                    <TableHead>Demand</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {last10.map((r, i) => (
                    <AnimatedRow key={r.id as number} index={i}>
                      <TableCell className="text-sm font-medium">
                        {String(r.cluster)}
                      </TableCell>
                      <TableCell className="text-sm max-w-[200px] truncate">
                        {String(r.missingSubtopic)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {String(r.demand)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={`text-xs ${getPriorityColor(String(r.priority))}`}
                        >
                          {String(r.priority)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {String(r.suggestedType || "—")}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={`text-xs ${getStatusColor(String(r.status))}`}
                        >
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