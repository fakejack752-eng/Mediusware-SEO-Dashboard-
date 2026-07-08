"use client";

import React, { useMemo } from "react";
import {
  CheckCircle,
  Loader,
  FileEdit,
  TrendingUp,
  FileText,
  Layers,
} from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";

// ─── Types ───────────────────────────────────────────────────────────────────

interface ContentItem {
  id: number;
  topic: string;
  cluster: string;
  writer: string;
  status: string;
  priority: string;
  publishDate: string | null;
  wordCount: number;
  targetKeywords: number;
  rankingKeywords: number;
  organicTraffic: number;
}

export interface ContentPipelineData {
  items: ContentItem[];
  summary: {
    published: number;
    inReview: number;
    inProgress: number;
    assigned: number;
    drafting: number;
    approved: number;
    idea: number;
    totalTrafficGenerated: number;
    avgWordsPublished: number;
  };
}

// ─── Constants ───────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<string, string> = {
  Published: "#059669",
  "In Review": "#d97706",
  "In Progress": "#0d9488",
  Assigned: "#7c3aed",
  Drafting: "#dc2626",
  Approved: "#ea580c",
  Idea: "#94a3b8",
};

const STATUS_VARIANT: Record<string, string> = {
  Published: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800",
  "In Review": "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800",
  "In Progress": "bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-950/50 dark:text-teal-300 dark:border-teal-800",
  Assigned: "bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-950/50 dark:text-violet-300 dark:border-violet-800",
  Drafting: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-950/50 dark:text-orange-300 dark:border-orange-800",
  Approved: "bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-950/50 dark:text-cyan-300 dark:border-cyan-800",
  Idea: "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-950/50 dark:text-gray-300 dark:border-gray-800",
};

const PRIORITY_VARIANT: Record<string, string> = {
  High: "bg-red-100 text-red-800 border-red-200 dark:bg-red-950/50 dark:text-red-300 dark:border-red-800",
  Medium: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800",
  Low: "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-950/50 dark:text-gray-400 dark:border-gray-800",
};

const CLUSTER_COLORS = [
  "#059669",
  "#0d9488",
  "#d97706",
  "#ea580c",
  "#7c3aed",
  "#dc2626",
  "#0891b2",
  "#65a30d",
  "#c026d3",
  "#ca8a04",
];

const pieChartConfig: ChartConfig = {
  value: { label: "Items" },
  Published: { label: "Published", color: "#059669" },
  "In Review": { label: "In Review", color: "#d97706" },
  "In Progress": { label: "In Progress", color: "#0d9488" },
  Assigned: { label: "Assigned", color: "#7c3aed" },
  Drafting: { label: "Drafting", color: "#dc2626" },
  Approved: { label: "Approved", color: "#ea580c" },
  Idea: { label: "Idea", color: "#94a3b8" },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

// ─── Component ───────────────────────────────────────────────────────────────

interface ContentPipelineProps {
  data: ContentPipelineData;
}

export function ContentPipeline({ data }: ContentPipelineProps) {
  const { items, summary } = data;

  // ── Pie chart data ──
  const pieData = useMemo(() => {
    const entries: { name: string; value: number }[] = [
      { name: "Published", value: summary.published },
      { name: "In Review", value: summary.inReview },
      { name: "In Progress", value: summary.inProgress },
      { name: "Assigned", value: summary.assigned },
      { name: "Drafting", value: summary.drafting },
      { name: "Approved", value: summary.approved },
      { name: "Idea", value: summary.idea },
    ];
    return entries.filter((e) => e.value > 0);
  }, [summary]);

  // ── Bar chart data (content by cluster) ──
  const clusterData = useMemo(() => {
    const map = new Map<string, number>();
    items.forEach((item) => {
      map.set(item.cluster, (map.get(item.cluster) ?? 0) + 1);
    });
    return Array.from(map.entries())
      .map(([cluster, count]) => ({ cluster, count }))
      .sort((a, b) => b.count - a.count);
  }, [items]);

  const barChartConfig = useMemo<ChartConfig>(() => {
    const cfg: ChartConfig = { count: { label: "Articles" } };
    clusterData.forEach((d, i) => {
      cfg[d.cluster] = { label: d.cluster, color: CLUSTER_COLORS[i % CLUSTER_COLORS.length] };
    });
    return cfg;
  }, [clusterData]);

  return (
    <div className="space-y-6">
      {/* ─── KPI Cards ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KpiCard
          title="Published"
          value={summary.published}
          icon={CheckCircle}
          className="border-emerald-200/60 dark:border-emerald-900/40"
        />
        <KpiCard
          title="In Progress"
          value={summary.inProgress + summary.drafting}
          icon={Loader}
          className="border-teal-200/60 dark:border-teal-900/40"
        />
        <KpiCard
          title="In Review"
          value={summary.inReview + summary.approved}
          icon={FileEdit}
          className="border-amber-200/60 dark:border-amber-900/40"
        />
        <KpiCard
          title="Traffic Generated"
          value={formatNumber(summary.totalTrafficGenerated)}
          icon={TrendingUp}
          className="border-emerald-200/60 dark:border-emerald-900/40"
        />
        <KpiCard
          title="Avg Word Count"
          value={summary.avgWordsPublished.toLocaleString()}
          icon={FileText}
          className="border-teal-200/60 dark:border-teal-900/40"
        />
        <KpiCard
          title="Total Pipeline"
          value={items.length}
          icon={Layers}
          className="border-amber-200/60 dark:border-amber-900/40"
        />
      </div>

      {/* ─── Charts Row ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie / Donut Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Status Distribution</CardTitle>
            <CardDescription>Content items grouped by pipeline stage</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={pieChartConfig} className="mx-auto aspect-square max-h-[320px] w-full">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent nameKey="status" hideLabel />} />
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={110}
                  strokeWidth={2}
                  stroke="hsl(var(--background))"
                >
                  {pieData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={STATUS_COLORS[entry.name] ?? "#94a3b8"}
                    />
                  ))}
                </Pie>
                <ChartLegend
                  content={<ChartLegendContent nameKey="name" />}
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Bar Chart – Content by Cluster */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Content by Cluster</CardTitle>
            <CardDescription>Number of articles per topic cluster</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={barChartConfig} className="aspect-[4/3] w-full max-h-[320px]">
              <BarChart
                data={clusterData}
                margin={{ top: 4, right: 16, left: 0, bottom: 40 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="cluster"
                  tickLine={false}
                  axisLine={false}
                  angle={-35}
                  textAnchor="end"
                  interval={0}
                  fontSize={11}
                />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: "hsl(var(--muted))", opacity: 0.5 }}
                  content={<ChartTooltipContent />}
                />
                <Bar
                  dataKey="count"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={48}
                >
                  {clusterData.map((entry, i) => (
                    <Cell
                      key={entry.cluster}
                      fill={CLUSTER_COLORS[i % CLUSTER_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* ─── Pipeline Table ────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Content Pipeline</CardTitle>
          <CardDescription>
            All content items with status, priority, and performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="max-h-[500px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-6">Topic</TableHead>
                  <TableHead>Cluster</TableHead>
                  <TableHead>Writer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead className="min-w-[180px]">Word Count</TableHead>
                  <TableHead className="min-w-[130px]">Keywords</TableHead>
                  <TableHead>Traffic</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => {
                  const wordProgress = item.targetKeywords > 0
                    ? Math.min(100, Math.round((item.wordCount / (item.targetKeywords * 150)) * 100))
                    : 0;

                  return (
                    <TableRow key={item.id}>
                      {/* Topic */}
                      <TableCell className="pl-6 font-medium max-w-[220px] truncate">
                        <span className="block truncate" title={item.topic}>
                          {item.topic}
                        </span>
                        {item.publishDate && (
                          <span className="text-xs text-muted-foreground">
                            {new Date(item.publishDate).toLocaleDateString()}
                          </span>
                        )}
                      </TableCell>

                      {/* Cluster */}
                      <TableCell>
                        <Badge variant="outline" className="font-normal">
                          {item.cluster}
                        </Badge>
                      </TableCell>

                      {/* Writer */}
                      <TableCell className="text-muted-foreground">
                        {item.writer}
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={STATUS_VARIANT[item.status] ?? ""}
                        >
                          {item.status}
                        </Badge>
                      </TableCell>

                      {/* Priority */}
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={PRIORITY_VARIANT[item.priority] ?? ""}
                        >
                          {item.priority}
                        </Badge>
                      </TableCell>

                      {/* Word Count */}
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-medium tabular-nums">
                              {item.wordCount.toLocaleString()}
                            </span>
                            <span className="text-muted-foreground">
                              target: {(item.targetKeywords * 150).toLocaleString()}
                            </span>
                          </div>
                          <Progress value={wordProgress} className="h-1.5" />
                        </div>
                      </TableCell>

                      {/* Keywords */}
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-xs">
                          <span className="font-medium text-emerald-700 dark:text-emerald-400 tabular-nums">
                            {item.rankingKeywords}
                          </span>
                          <span className="text-muted-foreground">/</span>
                          <span className="text-muted-foreground tabular-nums">
                            {item.targetKeywords}
                          </span>
                          <span className="text-muted-foreground ml-0.5">ranking</span>
                        </div>
                      </TableCell>

                      {/* Traffic */}
                      <TableCell className="font-medium tabular-nums">
                        {item.organicTraffic > 0
                          ? formatNumber(item.organicTraffic)
                          : "—"}
                      </TableCell>
                    </TableRow>
                  );
                })}

                {items.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                      No content items in the pipeline.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}