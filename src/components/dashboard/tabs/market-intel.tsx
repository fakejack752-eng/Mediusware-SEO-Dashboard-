"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Target, Layers, Globe, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { KpiCard } from "@/components/dashboard/kpi-card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis, Cell, Pie, PieChart } from "recharts";
import {
  useDataFetch,
  EmptyState,
  LoadingSkeleton,
  COLORS,
  EMERALD,
  TEAL,
  EMBER,
  countBy,
  avgNum,
  fadeInUp,
  AnimatedCard,
  AnimatedRow,
  getStatusColor,
  getPriorityColor,
  staggerContainer,
} from "@/components/dashboard/tab-helpers";

const accentCycle = ["emerald", "teal", "amber", "stone"] as const;

const sentimentColors: Record<string, string> = {
  Positive: "#059669",
  Negative: "#dc2626",
  Neutral: "#78716c",
  Mixed: "#d97706",
};

export function MarketIntelTab() {
  const { data, loading } = useDataFetch("/api/market-intel");

  const kpis = useMemo(() => {
    const topics = new Set(data.map((r) => String(r.topicTheme)));
    const bySource = countBy(data, "sourcePlatform");
    return {
      total: data.length,
      avgRelevance: avgNum(data, "relevanceScore"),
      uniqueTopics: topics.size,
      topSource: bySource[0]?.name ?? "—",
    };
  }, [data]);

  const sourceData = useMemo(
    () => countBy(data, "sourcePlatform").slice(0, 8),
    [data],
  );

  const sentimentData = useMemo(() => countBy(data, "sentiment"), [data]);

  const last10 = useMemo(() => [...data].reverse().slice(0, 10), [data]);

  const sourceConfig: ChartConfig = {
    value: { label: "Signals", color: EMERALD },
  };

  const sentimentConfig: ChartConfig = {
    Positive: { label: "Positive", color: "#059669" },
    Negative: { label: "Negative", color: "#dc2626" },
    Neutral: { label: "Neutral", color: "#78716c" },
    Mixed: { label: "Mixed", color: "#d97706" },
  };

  if (loading) return <LoadingSkeleton />;
  if (!data.length) return <EmptyState moduleName="Market Intelligence" />;

  return (
    <motion.div
      className="space-y-6"
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
    >
      {/* KPI Grid */}
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {[
          { title: "Total Signals", value: kpis.total, icon: TrendingUp },
          {
            title: "Avg Relevance",
            value: kpis.avgRelevance,
            suffix: "/100",
            icon: Target,
          },
          { title: "Unique Topics", value: kpis.uniqueTopics, icon: Layers },
          { title: "Top Source", value: kpis.topSource, icon: Globe },
        ].map((kpi, i) => (
          <motion.div key={kpi.title} variants={fadeInUp} custom={i}>
            <KpiCard
              title={kpi.title}
              value={kpi.value}
              icon={kpi.icon}
              suffix={kpi.suffix}
              animated
              accentColor={accentCycle[i]}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AnimatedCard delay={0.25}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Signals by Source
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={sourceConfig} className="h-64 w-full">
                <BarChart data={sourceData} layout="vertical" margin={{ left: 20 }}>
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={100}
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
              <CardTitle className="text-sm font-medium">
                Sentiment Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={sentimentConfig}
                className="h-64 w-full"
              >
                <PieChart>
                  <ChartTooltip
                    content={<ChartTooltipContent nameKey="name" />}
                  />
                  <Pie
                    data={sentimentData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={85}
                    innerRadius={50}
                  >
                    {sentimentData.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={
                          sentimentConfig[
                            entry.name as keyof typeof sentimentConfig
                          ]?.color ?? "#78716c"
                        }
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </AnimatedCard>
      </div>

      {/* Recent Signals Table */}
      <AnimatedCard delay={0.4}>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Recent Signals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-96 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent sticky top-0 bg-background z-10">
                    <TableHead className="text-[11px] uppercase tracking-wider font-semibold">
                      Date
                    </TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wider font-semibold">
                      Source
                    </TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wider font-semibold">
                      Topic
                    </TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wider font-semibold">
                      Signal
                    </TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wider font-semibold">
                      Sentiment
                    </TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wider font-semibold w-24 tabular-nums">
                      Relevance
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {last10.map((r, i) => (
                    <AnimatedRow key={String(r.id)} index={i}>
                      <TableCell className="text-sm tabular-nums">
                        {String(r.date)}
                      </TableCell>
                      <TableCell className="text-sm">
                        <Badge variant="outline" className="text-xs">
                          {String(r.sourcePlatform)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm max-w-[200px] truncate">
                        {String(r.topicTheme)}
                      </TableCell>
                      <TableCell className="text-sm">
                        <Badge
                          variant="secondary"
                          className={`text-xs ${getStatusColor(String(r.searchVolumeTrend))}`}
                        >
                          {String(r.signalType)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        <Badge
                          variant="outline"
                          className={`text-xs ${getStatusColor(String(r.sentiment))}`}
                        >
                          {String(r.sentiment)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm tabular-nums">
                        {Number(r.relevanceScore)}
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