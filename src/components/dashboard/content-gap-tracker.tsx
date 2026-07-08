"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
  ReferenceLine,
  TooltipProps,
} from "recharts";
import { PieChart, TrendingUp, Target, AlertTriangle, Layers } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { KpiCard } from "@/components/dashboard/kpi-card";

// ─── Interfaces ────────────────────────────────────────────────────────────────

interface ContentGap {
  cluster: string;
  topic: string;
  volume: number;
  kd: number;
  competitorCoverage: number;
  yourCoverage: number;
  gapScore: number;
  estimatedImpact: string;
}

interface MissingService {
  service: string;
  relatedKeywords: number;
  searchVolume: number;
  competitorPages: number;
  status: string;
  priority: string;
}

interface ClusterCoverage {
  cluster: string;
  totalTopics: number;
  covered: number;
  inProgress: number;
  missing: number;
  coveragePct: number;
}

export interface ContentGapsData {
  gaps: ContentGap[];
  missingServices: MissingService[];
  clusterCoverage: ClusterCoverage[];
  summary: {
    totalGaps: number;
    criticalGaps: number;
    highImpact: number;
    clusterCoverage: number;
    estimatedTrafficOpportunity: number;
  };
}

// ─── Props ─────────────────────────────────────────────────────────────────────

interface ContentGapTrackerProps {
  data: ContentGapsData;
}

// ─── Chart Configs ─────────────────────────────────────────────────────────────

const coverageChartConfig = {
  coverage: {
    label: "Coverage %",
    color: "var(--color-emerald-500)",
  },
} satisfies ChartConfig;

const clusterStackConfig = {
  covered: {
    label: "Covered",
    color: "var(--color-emerald-500)",
  },
  inProgress: {
    label: "In Progress",
    color: "var(--color-amber-500)",
  },
  missing: {
    label: "Missing",
    color: "var(--color-gray-400)",
  },
} satisfies ChartConfig;

// ─── Custom Tooltip for Stacked Bar ────────────────────────────────────────────

function StackedBarTooltipContent({
  active,
  payload,
  label,
}: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;

  return (
    <div className="border-border/50 bg-background grid min-w-[10rem] items-start gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl">
      <div className="font-medium text-foreground">{label}</div>
      <div className="grid gap-1">
        {payload.map((item) => (
          <div key={item.name} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-1.5">
              <div
                className="h-2 w-2 shrink-0 rounded-[2px]"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-muted-foreground">{item.name}</span>
            </div>
            <span className="font-mono font-medium tabular-nums text-foreground">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function ContentGapTracker({ data }: ContentGapTrackerProps) {
  // Sort gaps by gapScore descending
  const sortedGaps = useMemo(
    () => [...data.gaps].sort((a, b) => b.gapScore - a.gapScore),
    [data.gaps]
  );

  // Cluster coverage chart data — for horizontal bar chart
  const coverageChartData = useMemo(
    () =>
      data.clusterCoverage
        .slice()
        .sort((a, b) => b.coveragePct - a.coveragePct)
        .map((c) => ({
          cluster: c.cluster,
          coverage: c.coveragePct,
        })),
    [data.clusterCoverage]
  );

  // Stacked bar data
  const stackedBarData = useMemo(
    () =>
      data.clusterCoverage.map((c) => ({
        cluster: c.cluster,
        covered: c.covered,
        inProgress: c.inProgress,
        missing: c.missing,
      })),
    [data.clusterCoverage]
  );

  return (
    <div className="space-y-6">
      {/* ── KPI Cards ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <KpiCard
          title="Total Content Gaps"
          value={data.summary.totalGaps}
          icon={Target}
        />
        <KpiCard
          title="Critical Gaps"
          value={data.summary.criticalGaps}
          icon={AlertTriangle}
        />
        <KpiCard
          title="High Impact Opportunities"
          value={data.summary.highImpact}
          icon={Layers}
        />
        <KpiCard
          title="Cluster Coverage"
          value={`${data.summary.clusterCoverage}%`}
          icon={PieChart}
        />
        <KpiCard
          title="Est. Traffic Opportunity"
          value={data.summary.estimatedTrafficOpportunity.toLocaleString()}
          suffix="visits/mo"
          icon={TrendingUp}
        />
      </div>

      {/* ── Charts Row ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Cluster Coverage Horizontal Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Cluster Coverage</CardTitle>
            <CardDescription>
              Coverage percentage by topic cluster
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={coverageChartConfig} className="h-[300px] w-full">
              <BarChart
                data={coverageChartData}
                layout="vertical"
                margin={{ top: 4, right: 20, left: 0, bottom: 4 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                />
                <YAxis
                  type="category"
                  dataKey="cluster"
                  width={120}
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  tick={{ fontSize: 12 }}
                  tickFormatter={(v: number) => `${v}%`}
                  tickLine={false}
                  axisLine={false}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value: number) => [`${value}%`, "Coverage"]}
                    />
                  }
                />
                <ReferenceLine
                  x={50}
                  stroke="var(--color-amber-400)"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  label={{
                    value: "50%",
                    position: "top",
                    fill: "var(--color-amber-500)",
                    fontSize: 11,
                  }}
                />
                <Bar
                  dataKey="coverage"
                  radius={[0, 4, 4, 0]}
                  maxBarSize={20}
                >
                  {coverageChartData.map((entry, index) => (
                    <Cell
                      key={`cov-${index}`}
                      fill={
                        entry.coverage >= 70
                          ? "var(--color-emerald-500)"
                          : entry.coverage >= 40
                            ? "var(--color-amber-500)"
                            : "var(--color-red-500)"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Stacked Bar Chart — Content Gaps by Cluster */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Content Gaps by Cluster</CardTitle>
            <CardDescription>
              Topic status breakdown per cluster
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={clusterStackConfig} className="h-[300px] w-full">
              <BarChart
                data={stackedBarData}
                layout="vertical"
                margin={{ top: 4, right: 20, left: 0, bottom: 4 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                />
                <YAxis
                  type="category"
                  dataKey="cluster"
                  width={120}
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <XAxis
                  type="number"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <ChartTooltip content={<StackedBarTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar
                  dataKey="covered"
                  stackId="clusterStack"
                  fill="var(--color-emerald-500)"
                  radius={[0, 0, 0, 0]}
                  maxBarSize={24}
                />
                <Bar
                  dataKey="inProgress"
                  stackId="clusterStack"
                  fill="var(--color-amber-500)"
                  radius={[0, 0, 0, 0]}
                  maxBarSize={24}
                />
                <Bar
                  dataKey="missing"
                  stackId="clusterStack"
                  fill="var(--color-gray-400)"
                  radius={[0, 4, 4, 0]}
                  maxBarSize={24}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* ── Content Gaps Table ─────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Content Gap Details</CardTitle>
          <CardDescription>
            All identified content gaps sorted by gap score (highest first)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-h-96 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Topic</TableHead>
                  <TableHead>Cluster</TableHead>
                  <TableHead className="text-right tabular-nums">Volume</TableHead>
                  <TableHead className="text-right tabular-nums">KD</TableHead>
                  <TableHead className="text-right tabular-nums">
                    Competitor
                  </TableHead>
                  <TableHead className="text-right tabular-nums">Your</TableHead>
                  <TableHead className="text-right tabular-nums">
                    Gap Score
                  </TableHead>
                  <TableHead>Impact</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedGaps.map((gap, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium max-w-[200px] truncate">
                      {gap.topic}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-normal">
                        {gap.cluster}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {gap.volume.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {gap.kd}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {gap.competitorCoverage}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {gap.yourCoverage}
                    </TableCell>
                    <TableCell className="text-right">
                      <GapScoreBadge score={gap.gapScore} />
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="font-normal text-xs"
                      >
                        {gap.estimatedImpact}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* ── Missing Services Table ─────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Missing Service Pages</CardTitle>
          <CardDescription>
            Services your competitors cover that you don&apos;t
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-h-96 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead className="text-right tabular-nums">
                    Keywords
                  </TableHead>
                  <TableHead className="text-right tabular-nums">
                    Search Volume
                  </TableHead>
                  <TableHead className="text-right tabular-nums">
                    Competitor Pages
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.missingServices.map((service, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium max-w-[200px] truncate">
                      {service.service}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {service.relatedKeywords.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {service.searchVolume.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {service.competitorPages}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={service.status} />
                    </TableCell>
                    <TableCell>
                      <PriorityBadge priority={service.priority} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Helper Badge Components ───────────────────────────────────────────────────

function GapScoreBadge({ score }: { score: number }) {
  const colorClass =
    score > 85
      ? "border-red-200 bg-red-100 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400"
      : score >= 70
        ? "border-amber-200 bg-amber-100 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400"
        : "border-gray-200 bg-gray-100 text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400";

  return (
    <Badge variant="outline" className={`font-mono font-semibold tabular-nums ${colorClass}`}>
      {score}
    </Badge>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, string> = {
    "No Page":
      "border-red-200 bg-red-100 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400",
    Outdated:
      "border-amber-200 bg-amber-100 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400",
    "Thin Content":
      "border-orange-200 bg-orange-100 text-orange-700 dark:border-orange-800 dark:bg-orange-950 dark:text-orange-400",
  };

  return (
    <Badge
      variant="outline"
      className={`font-normal ${config[status] ?? "border-gray-200 bg-gray-100 text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"}`}
    >
      {status}
    </Badge>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const config: Record<string, string> = {
    Critical:
      "border-red-200 bg-red-100 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400",
    High:
      "border-amber-200 bg-amber-100 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400",
    Medium:
      "border-gray-200 bg-gray-100 text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400",
  };

  return (
    <Badge
      variant="outline"
      className={`font-normal ${config[priority] ?? "border-gray-200 bg-gray-100 text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"}`}
    >
      {priority}
    </Badge>
  );
}