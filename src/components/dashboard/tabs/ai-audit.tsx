"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Brain, Target, BarChart3, TrendingUp, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis, Cell } from "recharts";
import { useDataFetch, EmptyState, LoadingSkeleton, fadeInUp, AnimatedCard, AnimatedRow, getStatusColor } from "@/components/dashboard/tab-helpers";

const SENTIMENT_COLORS: Record<string, string> = {
  Positive: "#00CC99",
  Negative: "#dc2626",
  Neutral: "#78716c",
  Mixed: "#00A99D",
  "Not Mentioned": "#a8a29e",
};

const ALL_SENTIMENTS = ["Positive", "Negative", "Neutral", "Mixed", "Not Mentioned"];

export function AiAuditTab() {
  const { data, loading } = useDataFetch("/api/ai-audit");

  const kpis = useMemo(() => {
    const mentioned = data.filter(
      (r) => r.brandMentioned === true || r.brandMentioned === "true"
    );
    return {
      total: data.length,
      mentionRate: data.length
        ? Math.round((mentioned.length / data.length) * 100)
        : 0,
      avgPosition: mentioned.length
        ? Math.round(
            mentioned.reduce((s, r) => s + (Number(r.position) || 0), 0) /
              mentioned.length
          )
        : 0,
      positivePct: data.length
        ? Math.round(
            (data.filter((r) => String(r.sentiment) === "Positive").length /
              data.length) *
              100
          )
        : 0,
    };
  }, [data]);

  const mentionByPlatform = useMemo(() => {
    const platforms = new Set(data.map((r) => String(r.aiPlatform)));
    return Array.from(platforms).map((p) => {
      const items = data.filter((r) => String(r.aiPlatform) === p);
      const mentioned = items.filter(
        (r) => r.brandMentioned === true || r.brandMentioned === "true"
      );
      return {
        name: p,
        value: items.length
          ? Math.round((mentioned.length / items.length) * 100)
          : 0,
      };
    });
  }, [data]);

  const sentimentData = useMemo(() => {
    return ALL_SENTIMENTS.map((s) => ({
      name: s,
      value: data.filter((r) => String(r.sentiment) === s).length,
    }));
  }, [data]);

  const last10 = useMemo(() => [...data].reverse().slice(0, 10), [data]);

  const mentionConfig: ChartConfig = {
    value: { label: "Mention Rate %", color: "#00A99D" },
  };

  const sentimentConfig: ChartConfig = {
    Positive: { label: "Positive", color: "#00CC99" },
    Negative: { label: "Negative", color: "#dc2626" },
    Neutral: { label: "Neutral", color: "#78716c" },
    Mixed: { label: "Mixed", color: "#00A99D" },
    "Not Mentioned": { label: "Not Mentioned", color: "#a8a29e" },
  };

  if (loading) return <LoadingSkeleton />;
  if (!data.length) return <EmptyState moduleName="AI Search Audit" />;

  return (
    <div className="space-y-6">
      {/* KPI Grid */}
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
      >
        <KpiCard
          title="Total Queries"
          value={kpis.total}
          icon={Brain}
          accentColor="teal"
        />
        <KpiCard
          title="Mention Rate"
          value={kpis.mentionRate}
          suffix="%"
          icon={Target}
          accentColor="blue"
        />
        <KpiCard
          title="Avg Position"
          value={kpis.avgPosition}
          icon={BarChart3}
          accentColor="green"
        />
        <KpiCard
          title="Positive Sentiment"
          value={kpis.positivePct}
          suffix="%"
          icon={TrendingUp}
          accentColor="amber"
        />
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AnimatedCard delay={0.25}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Mention Rate by Platform
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={mentionConfig} className="h-64 w-full">
                <BarChart data={mentionByPlatform}>
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
                Sentiment Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={sentimentConfig} className="h-64 w-full">
                <BarChart data={sentimentData}>
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {sentimentData.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={
                          SENTIMENT_COLORS[entry.name] ??
                          sentimentConfig[
                            entry.name as keyof typeof sentimentConfig
                          ]?.color ??
                          "#78716c"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </AnimatedCard>
      </div>

      {/* Recent Queries Table */}
      <AnimatedCard delay={0.4}>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Recent Queries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-96 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent sticky top-0 bg-background z-10">
                    <TableHead>Query</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Mentioned</TableHead>
                    <TableHead className="tabular-nums">Position</TableHead>
                    <TableHead>Sentiment</TableHead>
                    <TableHead>Gap</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {last10.map((r, i) => {
                    const isMentioned =
                      r.brandMentioned === true ||
                      r.brandMentioned === "true";
                    const sentiment = String(r.sentiment ?? "Unknown");

                    return (
                      <AnimatedRow key={r.id as number} index={i}>
                        <TableCell className="text-sm font-medium max-w-[200px] truncate">
                          {String(r.query)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {String(r.aiPlatform)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {isMentioned ? (
                            <CheckCircle className="h-4 w-4 text-emerald-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                        </TableCell>
                        <TableCell className="tabular-nums text-sm">
                          {isMentioned ? Number(r.position) || "—" : "—"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={`text-xs ${getStatusColor(sentiment)}`}
                          >
                            {sentiment}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground max-w-[180px] truncate">
                          {String(r.gap || "—")}
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
    </div>
  );
}