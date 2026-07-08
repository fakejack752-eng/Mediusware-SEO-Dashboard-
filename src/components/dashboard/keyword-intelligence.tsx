"use client";

import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts";
import {
  Search,
  Target,
  ArrowUpCircle,
  Eye,
  Gauge,
  Lightbulb,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowUpDown,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { KpiCard } from "@/components/dashboard/kpi-card";

// ── Types ────────────────────────────────────────────────────────────────────

interface KeywordData {
  keyword: string;
  volume: number;
  kd: number;
  cpc: number;
  intent: string;
  currentRank: number;
  bestRank: number;
  priority: number;
  trend: string;
}

interface KeywordIntelligenceData {
  keywords: KeywordData[];
  summary: {
    total: number;
    highPriority: number;
    opportunity: number;
    ranking: number;
    notRanking: number;
    avgKd: number;
    avgVolume: number;
  };
}

interface KeywordIntelligenceProps {
  data: KeywordIntelligenceData;
}

// ── Chart configs ────────────────────────────────────────────────────────────

const intentChartConfig = {
  Commercial: { label: "Commercial", color: "#0d9488" },
  Transactional: { label: "Transactional", color: "#f59e0b" },
  Informational: { label: "Informational", color: "#10b981" },
} satisfies ChartConfig;

const priorityChartConfig = {
  priority: { label: "Priority Score", color: "#0d9488" },
} satisfies ChartConfig;

const scatterConfig = {
  low: { label: "Low Priority", color: "#9ca3af" },
  medium: { label: "Medium Priority", color: "#f59e0b" },
  high: { label: "High Priority", color: "#0d9488" },
} satisfies ChartConfig;

// ── Sort helpers ─────────────────────────────────────────────────────────────

type SortKey = keyof KeywordData;
type SortDir = "asc" | "desc";

function sortKeywords(
  keywords: KeywordData[],
  key: SortKey,
  dir: SortDir
): KeywordData[] {
  return [...keywords].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    if (typeof aVal === "number" && typeof bVal === "number") {
      return dir === "asc" ? aVal - bVal : bVal - aVal;
    }
    return dir === "asc"
      ? String(aVal).localeCompare(String(bVal))
      : String(bVal).localeCompare(String(aVal));
  });
}

// ── Sub-components ───────────────────────────────────────────────────────────

function TrendIcon({ trend }: { trend: string }) {
  switch (trend) {
    case "up":
      return <TrendingUp className="h-4 w-4 text-emerald-600" />;
    case "down":
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    default:
      return <Minus className="h-4 w-4 text-muted-foreground" />;
  }
}

function KdBadge({ value }: { value: number }) {
  let colorClass: string;
  if (value < 40) {
    colorClass = "bg-emerald-100 text-emerald-700 border-emerald-200";
  } else if (value < 60) {
    colorClass = "bg-yellow-100 text-yellow-700 border-yellow-200";
  } else if (value < 80) {
    colorClass = "bg-orange-100 text-orange-700 border-orange-200";
  } else {
    colorClass = "bg-red-100 text-red-700 border-red-200";
  }
  return (
    <Badge variant="outline" className={colorClass}>
      {value}
    </Badge>
  );
}

function IntentBadge({ intent }: { intent: string }) {
  const styles: Record<string, string> = {
    Commercial: "bg-teal-100 text-teal-700 border-teal-200",
    Transactional: "bg-amber-100 text-amber-700 border-amber-200",
    Informational: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Navigational: "bg-stone-100 text-stone-700 border-stone-200",
  };
  return (
    <Badge variant="outline" className={styles[intent] ?? "bg-muted text-muted-foreground border-muted"}>
      {intent}
    </Badge>
  );
}

function SortableHeader({
  label,
  sortKey,
  currentSort,
  currentDir,
  onSort,
}: {
  label: string;
  sortKey: SortKey;
  currentSort: SortKey | null;
  currentDir: SortDir;
  onSort: (key: SortKey) => void;
}) {
  const isActive = currentSort === sortKey;
  return (
    <button
      onClick={() => onSort(sortKey)}
      className="flex items-center gap-1 hover:text-foreground transition-colors"
    >
      {label}
      <ArrowUpDown
        className={`h-3.5 w-3.5 transition-colors ${
          isActive
            ? "text-foreground"
            : "text-muted-foreground/50"
        }`}
      />
    </button>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

export function KeywordIntelligence({ data }: KeywordIntelligenceProps) {
  const [sortKey, setSortKey] = useState<SortKey | null>("priority");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  // ── Derived data ─────────────────────────────────────────────────────────

  // Intent distribution for bar chart
  const intentData = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const kw of data.keywords) {
      counts[kw.intent] = (counts[kw.intent] || 0) + 1;
    }
    return Object.entries(counts)
      .map(([intent, count]) => ({ intent, count }))
      .sort((a, b) => b.count - a.count);
  }, [data.keywords]);

  // Top 10 keywords by priority for bar chart
  const topPriorityData = useMemo(() => {
    return [...data.keywords]
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 10)
      .map((kw) => ({
        keyword: kw.keyword.length > 18 ? kw.keyword.slice(0, 16) + "…" : kw.keyword,
        priority: kw.priority,
        kd: kw.kd,
      }));
  }, [data.keywords]);

  // Scatter data: volume vs KD, colored by priority
  const scatterData = useMemo(() => {
    return data.keywords.map((kw) => ({
      x: kw.volume,
      y: kw.kd,
      z: kw.priority * 4 + 20,
      priority: kw.priority >= 70 ? "high" : kw.priority >= 40 ? "medium" : "low",
      keyword: kw.keyword,
    }));
  }, [data.keywords]);

  // Sorted table data
  const sortedKeywords = useMemo(() => {
    if (!sortKey) return data.keywords;
    return sortKeywords(data.keywords, sortKey, sortDir);
  }, [data.keywords, sortKey, sortDir]);

  return (
    <div className="space-y-6">
      {/* ── KPI Cards ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KpiCard
          title="Total Keywords"
          value={data.summary.total}
          icon={Search}
        />
        <KpiCard
          title="High Priority"
          value={data.summary.highPriority}
          icon={Target}
        />
        <KpiCard
          title="Ranking Top 50"
          value={data.summary.ranking}
          icon={ArrowUpCircle}
        />
        <KpiCard
          title="Avg Search Volume"
          value={data.summary.avgVolume.toLocaleString()}
          icon={Eye}
        />
        <KpiCard
          title="Avg KD"
          value={data.summary.avgKd.toFixed(1)}
          icon={Gauge}
        />
        <KpiCard
          title="Opportunity Keywords"
          value={data.summary.opportunity}
          icon={Lightbulb}
        />
      </div>

      {/* ── Charts Row ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Search Intent Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Search Intent Distribution</CardTitle>
            <CardDescription>Keyword count by search intent category</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={intentChartConfig} className="h-[280px] w-full">
              <BarChart data={intentData} margin={{ top: 8, right: 8, bottom: 8, left: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="intent"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                  allowDecimals={false}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={60}>
                  {intentData.map((entry, index) => {
                    const colors: Record<string, string> = {
                      Commercial: "#0d9488",
                      Transactional: "#f59e0b",
                      Informational: "#10b981",
                      Navigational: "#78716c",
                    };
                    return (
                      <Cell
                        key={`cell-${index}`}
                        fill={colors[entry.intent] ?? "#9ca3af"}
                      />
                    );
                  })}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Volume vs Keyword Difficulty Scatter */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Volume vs Keyword Difficulty</CardTitle>
            <CardDescription>Bubble size represents priority score</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={scatterConfig} className="h-[280px] w-full">
              <ScatterChart margin={{ top: 8, right: 8, bottom: 8, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="Volume"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                  label={{
                    value: "Volume",
                    position: "insideBottom",
                    offset: -4,
                    fontSize: 11,
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="KD"
                  domain={[0, 100]}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                  label={{
                    value: "KD",
                    angle: -90,
                    position: "insideLeft",
                    style: { textAnchor: "middle" },
                    fontSize: 11,
                  }}
                />
                <ZAxis
                  type="number"
                  dataKey="z"
                  range={[40, 300]}
                  name="Priority"
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value: number, name: string, item: { payload: { keyword: string } }) => {
                        return (
                          <span className="text-foreground font-mono text-xs tabular-nums">
                            {item.payload.keyword}: {name} = {value.toLocaleString()}
                          </span>
                        );
                      }}
                    />
                  }
                />
                <Scatter data={scatterData} fillOpacity={0.75}>
                  {scatterData.map((entry, index) => {
                    const colors: Record<string, string> = {
                      high: "#0d9488",
                      medium: "#f59e0b",
                      low: "#9ca3af",
                    };
                    return (
                      <Cell
                        key={`scatter-${index}`}
                        fill={colors[entry.priority] ?? "#9ca3af"}
                      />
                    );
                  })}
                </Scatter>
                <ChartLegend content={<ChartLegendContent nameKey="priority" />} />
              </ScatterChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* ── Top Keywords by Priority (Bar Chart) ──────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Top 10 Keywords by Priority</CardTitle>
          <CardDescription>Highest priority keywords requiring attention</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={priorityChartConfig} className="h-[260px] w-full">
            <BarChart
              data={topPriorityData}
              layout="vertical"
              margin={{ top: 4, right: 16, bottom: 4, left: 0 }}
            >
              <CartesianGrid horizontal={false} strokeDasharray="3 3" />
              <XAxis
                type="number"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
                domain={[0, 100]}
              />
              <YAxis
                type="category"
                dataKey="keyword"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11 }}
                width={120}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="priority" radius={[0, 6, 6, 0]} maxBarSize={28}>
                {topPriorityData.map((entry, index) => {
                  let color = "#0d9488";
                  if (entry.priority < 40) color = "#f59e0b";
                  else if (entry.priority < 60) color = "#10b981";
                  return <Cell key={`bar-${index}`} fill={color} />;
                })}
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* ── Keyword Table ──────────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">All Keywords</CardTitle>
          <CardDescription>
            Click any column header to sort • {data.keywords.length} keywords total
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-h-96 overflow-y-auto rounded-md border">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow>
                  <TableHead className="min-w-[160px]">
                    <SortableHeader
                      label="Keyword"
                      sortKey="keyword"
                      currentSort={sortKey}
                      currentDir={sortDir}
                      onSort={handleSort}
                    />
                  </TableHead>
                  <TableHead className="text-right min-w-[80px]">
                    <SortableHeader
                      label="Volume"
                      sortKey="volume"
                      currentSort={sortKey}
                      currentDir={sortDir}
                      onSort={handleSort}
                    />
                  </TableHead>
                  <TableHead className="text-center min-w-[70px]">
                    <SortableHeader
                      label="KD"
                      sortKey="kd"
                      currentSort={sortKey}
                      currentDir={sortDir}
                      onSort={handleSort}
                    />
                  </TableHead>
                  <TableHead className="text-right min-w-[70px]">
                    <SortableHeader
                      label="CPC"
                      sortKey="cpc"
                      currentSort={sortKey}
                      currentDir={sortDir}
                      onSort={handleSort}
                    />
                  </TableHead>
                  <TableHead className="text-center min-w-[110px]">
                    <SortableHeader
                      label="Intent"
                      sortKey="intent"
                      currentSort={sortKey}
                      currentDir={sortDir}
                      onSort={handleSort}
                    />
                  </TableHead>
                  <TableHead className="text-center min-w-[90px]">
                    <SortableHeader
                      label="Curr. Rank"
                      sortKey="currentRank"
                      currentSort={sortKey}
                      currentDir={sortDir}
                      onSort={handleSort}
                    />
                  </TableHead>
                  <TableHead className="text-center min-w-[80px]">
                    <SortableHeader
                      label="Best Rank"
                      sortKey="bestRank"
                      currentSort={sortKey}
                      currentDir={sortDir}
                      onSort={handleSort}
                    />
                  </TableHead>
                  <TableHead className="text-center min-w-[80px]">
                    <SortableHeader
                      label="Priority"
                      sortKey="priority"
                      currentSort={sortKey}
                      currentDir={sortDir}
                      onSort={handleSort}
                    />
                  </TableHead>
                  <TableHead className="text-center min-w-[70px]">
                    <SortableHeader
                      label="Trend"
                      sortKey="trend"
                      currentSort={sortKey}
                      currentDir={sortDir}
                      onSort={handleSort}
                    />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedKeywords.map((kw, i) => (
                  <TableRow key={`${kw.keyword}-${i}`}>
                    <TableCell className="font-medium text-foreground">
                      {kw.keyword}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {kw.volume.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-center">
                      <KdBadge value={kw.kd} />
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      ${kw.cpc.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-center">
                      <IntentBadge intent={kw.intent} />
                    </TableCell>
                    <TableCell
                      className={`text-center tabular-nums font-medium ${
                        kw.currentRank <= 10
                          ? "text-emerald-600"
                          : kw.currentRank <= 50
                          ? "text-amber-600"
                          : "text-red-500"
                      }`}
                    >
                      #{kw.currentRank}
                    </TableCell>
                    <TableCell className="text-center tabular-nums text-muted-foreground">
                      #{kw.bestRank}
                    </TableCell>
                    <TableCell className="text-center tabular-nums font-semibold">
                      {kw.priority}
                    </TableCell>
                    <TableCell className="text-center">
                      <TrendIcon trend={kw.trend} />
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

// ── Re-export types for external use ─────────────────────────────────────────

export type { KeywordData, KeywordIntelligenceData };