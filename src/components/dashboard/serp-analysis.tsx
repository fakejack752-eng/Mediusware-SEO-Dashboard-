"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Award, Sparkles, FileText, AlertTriangle, Check, X, ExternalLink } from "lucide-react";
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
import { KpiCard } from "@/components/dashboard/kpi-card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";

// ─── Interfaces ─────────────────────────────────────────────────────

interface SerpResult {
  keyword: string;
  position: number;
  url: string;
  title: string;
  type: string;
  wordCount: number;
  backlinks: number;
  featured: boolean;
  peoplesAlso: boolean;
}

interface SerpFeature {
  feature: string;
  total: number;
  owned: number;
  opportunity: number;
}

interface SerpAnalysisData {
  results: SerpResult[];
  features: SerpFeature[];
  contentGapSummary: {
    avgWordCountTop3: number;
    avgWordCountMediusware: number;
    avgBacklinksTop3: number;
    avgBacklinksMediusware: number;
    contentGap: string;
  };
}

// ─── Chart Config ───────────────────────────────────────────────────

const chartConfig: ChartConfig = {
  total: {
    label: "Total",
    color: "hsl(var(--muted))",
  },
  owned: {
    label: "Owned",
    color: "#10b981",
  },
  opportunity: {
    label: "Opportunity",
    color: "#f59e0b",
  },
};

// ─── Helpers ────────────────────────────────────────────────────────

function truncateUrl(url: string, maxLen = 48): string {
  if (url.length <= maxLen) return url;
  return url.slice(0, maxLen - 3) + "...";
}

function isMediusware(url: string): boolean {
  return url.toLowerCase().includes("mediustech.com");
}

function formatNumber(n: number): string {
  return n.toLocaleString();
}

// ─── Component ──────────────────────────────────────────────────────

export function SerpAnalysis({ data }: { data: SerpAnalysisData }) {
  // KPI aggregations
  const totalOwned = useMemo(
    () => data.features.reduce((s, f) => s + f.owned, 0),
    [data.features]
  );
  const totalOpportunity = useMemo(
    () => data.features.reduce((s, f) => s + f.opportunity, 0),
    [data.features]
  );

  return (
    <div className="space-y-6">
      {/* ── KPI Row ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="SERP Features Owned"
          value={totalOwned}
          icon={Award}
        />
        <KpiCard
          title="Feature Opportunities"
          value={totalOpportunity}
          icon={Sparkles}
        />
        <KpiCard
          title="Avg Top-3 Word Count"
          value={formatNumber(data.contentGapSummary.avgWordCountTop3)}
          suffix="words"
          icon={FileText}
        />
        <KpiCard
          title="Content Gap"
          value={data.contentGapSummary.contentGap}
          icon={AlertTriangle}
        />
      </div>

      {/* ── SERP Feature Chart ───────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">SERP Feature Breakdown</CardTitle>
          <CardDescription>
            Total features vs. owned vs. opportunity by feature type
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-72 w-full">
            <BarChart
              data={data.features}
              margin={{ top: 4, right: 8, left: 0, bottom: 24 }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="feature"
                tickLine={false}
                axisLine={false}
                angle={-25}
                textAnchor="end"
                interval={0}
                fontSize={12}
                height={60}
              />
              <YAxis tickLine={false} axisLine={false} fontSize={12} />
              <ChartTooltip
                content={<ChartTooltipContent />}
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="total"
                stackId="a"
                fill="var(--color-total)"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="owned"
                stackId="a"
                fill="var(--color-owned)"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="opportunity"
                stackId="a"
                fill="var(--color-opportunity)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* ── SERP Results Table ───────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">SERP Results</CardTitle>
          <CardDescription>
            Search engine results page breakdown by position
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto max-h-[480px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-16">#</TableHead>
                  <TableHead className="min-w-[180px]">Title</TableHead>
                  <TableHead className="min-w-[200px]">URL</TableHead>
                  <TableHead className="w-28">Type</TableHead>
                  <TableHead className="w-24 text-right">Words</TableHead>
                  <TableHead className="w-24 text-right">Backlinks</TableHead>
                  <TableHead className="w-20 text-center">Featured</TableHead>
                  <TableHead className="w-16 text-center">PAA</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.results.map((r) => {
                  const mediusware = isMediusware(r.url);
                  return (
                    <TableRow
                      key={`${r.keyword}-${r.position}`}
                      className={
                        mediusware
                          ? "bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-950/50"
                          : undefined
                      }
                    >
                      <TableCell className="font-semibold tabular-nums">
                        {r.position}
                      </TableCell>
                      <TableCell className="font-medium max-w-[240px] truncate">
                        <span className="block truncate" title={r.title}>
                          {r.title}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                        <span className="inline-flex items-center gap-1 max-w-[260px] truncate" title={r.url}>
                          <ExternalLink className="h-3 w-3 shrink-0" />
                          {truncateUrl(r.url)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={mediusware ? "default" : "outline"}
                          className={
                            mediusware
                              ? "bg-emerald-600 text-white hover:bg-emerald-700 border-transparent"
                              : "border-muted-foreground/30"
                          }
                        >
                          {r.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatNumber(r.wordCount)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatNumber(r.backlinks)}
                      </TableCell>
                      <TableCell className="text-center">
                        {r.featured ? (
                          <Check className="h-4 w-4 text-emerald-600 mx-auto" />
                        ) : (
                          <X className="h-4 w-4 text-muted-foreground/40 mx-auto" />
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {r.peoplesAlso ? (
                          <Check className="h-4 w-4 text-amber-500 mx-auto" />
                        ) : (
                          <X className="h-4 w-4 text-muted-foreground/40 mx-auto" />
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* ── Content Gap Analysis ─────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Word Count Comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4 text-teal-600" />
              Word Count Comparison
            </CardTitle>
            <CardDescription>
              Avg. Top-3 vs Mediusware content length
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Top-3 bar */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium">Top-3 Average</span>
                <span className="text-sm font-semibold tabular-nums">
                  {formatNumber(data.contentGapSummary.avgWordCountTop3)} words
                </span>
              </div>
              <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-teal-500 transition-all duration-500"
                  style={{ width: "100%" }}
                />
              </div>
            </div>
            {/* Mediusware bar */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                  Mediusware Average
                </span>
                <span className="text-sm font-semibold tabular-nums text-emerald-700 dark:text-emerald-400">
                  {formatNumber(data.contentGapSummary.avgWordCountMediusware)} words
                </span>
              </div>
              <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      100,
                      (data.contentGapSummary.avgWordCountMediusware /
                        data.contentGapSummary.avgWordCountTop3) *
                        100
                    )}%`,
                  }}
                />
              </div>
            </div>
            {/* Gap callout */}
            <div className="flex items-start gap-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 p-3">
              <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
              <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                Content gap: {data.contentGapSummary.contentGap}. Increasing
                word count towards the Top-3 average can improve rankings.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Backlinks Comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Award className="h-4 w-4 text-teal-600" />
              Backlinks Comparison
            </CardTitle>
            <CardDescription>
              Avg. Top-3 vs Mediusware referring domains
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Top-3 bar */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium">Top-3 Average</span>
                <span className="text-sm font-semibold tabular-nums">
                  {formatNumber(data.contentGapSummary.avgBacklinksTop3)} links
                </span>
              </div>
              <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-teal-500 transition-all duration-500"
                  style={{ width: "100%" }}
                />
              </div>
            </div>
            {/* Mediusware bar */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                  Mediusware Average
                </span>
                <span className="text-sm font-semibold tabular-nums text-emerald-700 dark:text-emerald-400">
                  {formatNumber(data.contentGapSummary.avgBacklinksMediusware)} links
                </span>
              </div>
              <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      100,
                      (data.contentGapSummary.avgBacklinksMediusware /
                        data.contentGapSummary.avgBacklinksTop3) *
                        100
                    )}%`,
                  }}
                />
              </div>
            </div>
            {/* Gap callout */}
            <div className="flex items-start gap-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 p-3">
              <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
              <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                Backlink deficit of{" "}
                {formatNumber(
                  data.contentGapSummary.avgBacklinksTop3 -
                    data.contentGapSummary.avgBacklinksMediusware
                )}{" "}
                referring domains. A link-building campaign targeting
                high-authority sites is recommended.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export type { SerpResult, SerpFeature, SerpAnalysisData };