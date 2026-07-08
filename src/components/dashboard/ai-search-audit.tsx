"use client";

import { useMemo } from "react";
import {
  Brain,
  Medal,
  MessageSquare,
  Sparkles,
  Search,
  Eye,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import { KpiCard } from "@/components/dashboard/kpi-card";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";

// ─── Interfaces ───────────────────────────────────────────────────────────────

interface AiEngineResult {
  mentioned: boolean;
  position: number;
  sentiment: string;
  context: string;
}

interface AiAuditQuery {
  query: string;
  chatgpt: AiEngineResult;
  gemini: AiEngineResult;
  perplexity: AiEngineResult;
  aiOverview: AiEngineResult;
}

interface AiSummaryStats {
  totalQueries: number;
  mentionedIn: number;
  mentionRate: number;
  top3Positions: number;
  positiveSentiment: number;
  neutralSentiment: number;
  negativeSentiment: number;
  chatgptMentionRate: number;
  geminiMentionRate: number;
  perplexityMentionRate: number;
  aiOverviewMentionRate: number;
  monthOverMonthChange: number;
}

interface AiSearchAuditData {
  queries: AiAuditQuery[];
  summary: AiSummaryStats;
  weeklyTrend: Array<{
    week: string;
    chatgpt: number;
    gemini: number;
    perplexity: number;
    overview: number;
  }>;
}

// ─── Chart Configs ────────────────────────────────────────────────────────────

const lineChartConfig = {
  chatgpt: { label: "ChatGPT", color: "#059669" },
  gemini: { label: "Gemini", color: "#d97706" },
  perplexity: { label: "Perplexity", color: "#0d9488" },
  overview: { label: "AI Overview", color: "#dc2626" },
} satisfies ChartConfig;

const barChartConfig = {
  rate: { label: "Mention Rate", color: "#0d9488" },
} satisfies ChartConfig;

// ─── Colors ───────────────────────────────────────────────────────────────────

const ENGINE_COLORS = {
  chatgpt: "#059669",
  gemini: "#d97706",
  perplexity: "#0d9488",
  overview: "#dc2626",
} as const;

// ─── Sub-components ───────────────────────────────────────────────────────────

function SentimentBadge({ sentiment }: { sentiment: string }) {
  const normalized = sentiment.toLowerCase();
  let classes = "bg-gray-100 text-gray-600 border-gray-200";

  if (normalized === "positive") {
    classes = "bg-emerald-100 text-emerald-700 border-emerald-200";
  } else if (normalized === "neutral") {
    classes = "bg-amber-100 text-amber-700 border-amber-200";
  } else if (normalized === "negative") {
    classes = "bg-red-100 text-red-700 border-red-200";
  }

  return (
    <Badge
      variant="outline"
      className={`text-[10px] px-1.5 py-0 font-medium ${classes}`}
    >
      {sentiment}
    </Badge>
  );
}

function EngineCell({ result }: { result: AiEngineResult }) {
  return (
    <div className="flex flex-col items-start gap-1 min-w-[100px]">
      <div className="flex items-center gap-1.5">
        {result.mentioned ? (
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
        ) : (
          <XCircle className="h-4 w-4 text-red-500 shrink-0" />
        )}
        {result.mentioned && (
          <span className="text-xs text-muted-foreground tabular-nums">
            #{result.position}
          </span>
        )}
      </div>
      <SentimentBadge sentiment={result.sentiment} />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface AiSearchAuditProps {
  data: AiSearchAuditData;
}

export function AiSearchAudit({ data }: AiSearchAuditProps) {
  const { summary, queries, weeklyTrend } = data;

  const barChartData = useMemo(
    () => [
      { engine: "ChatGPT", rate: summary.chatgptMentionRate, fill: ENGINE_COLORS.chatgpt },
      { engine: "Gemini", rate: summary.geminiMentionRate, fill: ENGINE_COLORS.gemini },
      { engine: "Perplexity", rate: summary.perplexityMentionRate, fill: ENGINE_COLORS.perplexity },
      { engine: "AI Overview", rate: summary.aiOverviewMentionRate, fill: ENGINE_COLORS.overview },
    ],
    [
      summary.chatgptMentionRate,
      summary.geminiMentionRate,
      summary.perplexityMentionRate,
      summary.aiOverviewMentionRate,
    ]
  );

  return (
    <div className="space-y-6">
      {/* ── KPI Cards ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <KpiCard
          title="AI Mention Rate"
          value={`${summary.mentionRate}%`}
          icon={Brain}
          change={summary.monthOverMonthChange}
          changeLabel="vs last month"
        />
        <KpiCard
          title="Top-3 Positions"
          value={summary.top3Positions}
          icon={Medal}
          suffix={`of ${summary.totalQueries}`}
        />
        <KpiCard
          title="ChatGPT Rate"
          value={`${summary.chatgptMentionRate}%`}
          icon={MessageSquare}
        />
        <KpiCard
          title="Gemini Rate"
          value={`${summary.geminiMentionRate}%`}
          icon={Sparkles}
        />
        <KpiCard
          title="Perplexity Rate"
          value={`${summary.perplexityMentionRate}%`}
          icon={Search}
        />
        <KpiCard
          title="AI Overview Rate"
          value={`${summary.aiOverviewMentionRate}%`}
          icon={Eye}
        />
      </div>

      {/* ── Charts Row ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Trend Line Chart */}
        <Card className="lg:col-span-2 py-4">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">
              Weekly Mention Rate Trend
            </CardTitle>
            <CardDescription>
              Mention rate across AI engines over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={lineChartConfig} className="h-[280px] w-full">
              <LineChart
                data={weeklyTrend}
                margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="week"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                  domain={[0, 100]}
                  tickFormatter={(v: number) => `${v}%`}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(label) => `Week: ${label}`}
                      formatter={(value: number) => [`${value}%`]}
                    />
                  }
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Line
                  type="monotone"
                  dataKey="chatgpt"
                  stroke="#059669"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="gemini"
                  stroke="#d97706"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="perplexity"
                  stroke="#0d9488"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="overview"
                  stroke="#dc2626"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Per-Engine Mention Rates Horizontal Bar Chart */}
        <Card className="py-4">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">
              Mention Rate by Engine
            </CardTitle>
            <CardDescription>
              Current mention rate per AI platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={barChartConfig} className="h-[280px] w-full">
              <BarChart
                data={barChartData}
                layout="vertical"
                margin={{ top: 8, right: 24, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis
                  type="number"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                  domain={[0, 100]}
                  tickFormatter={(v: number) => `${v}%`}
                />
                <YAxis
                  dataKey="engine"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                  width={80}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value: number) => [`${value}%`, "Mention Rate"]}
                    />
                  }
                />
                <Bar dataKey="rate" radius={[0, 4, 4, 0]} barSize={24}>
                  {barChartData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* ── Query-by-Query Audit Table ────────────────────────────────────── */}
      <Card className="py-4">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">
            Query-by-Query AI Audit
          </CardTitle>
          <CardDescription>
            Detailed breakdown of brand mentions across AI engines for each tracked query
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-h-[480px] overflow-y-auto rounded-md border">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow>
                  <TableHead className="min-w-[200px]">Query</TableHead>
                  <TableHead className="min-w-[120px]">ChatGPT</TableHead>
                  <TableHead className="min-w-[120px]">Gemini</TableHead>
                  <TableHead className="min-w-[120px]">Perplexity</TableHead>
                  <TableHead className="min-w-[120px]">AI Overview</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {queries.map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-medium text-sm">
                      {item.query}
                    </TableCell>
                    <TableCell>
                      <EngineCell result={item.chatgpt} />
                    </TableCell>
                    <TableCell>
                      <EngineCell result={item.gemini} />
                    </TableCell>
                    <TableCell>
                      <EngineCell result={item.perplexity} />
                    </TableCell>
                    <TableCell>
                      <EngineCell result={item.aiOverview} />
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

export type {
  AiSearchAuditData,
  AiSummaryStats,
  AiAuditQuery,
  AiEngineResult,
};