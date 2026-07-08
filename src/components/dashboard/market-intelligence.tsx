"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar, ResponsiveContainer } from "recharts";
import { TrendingUp, Zap, Radio, BarChart3 } from "lucide-react";

export interface MarketIntelligenceData {
  trends: Array<{
    month: string;
    softwareDevelopment: number;
    itConsulting: number;
    digitalTransformation: number;
    customSoftware: number;
    nearshore: number;
  }>;
  socialMentions: Array<{
    platform: string;
    mentions: number;
    sentiment: number;
    topSub: string;
    change: number;
  }>;
  industryReports: Array<{
    title: string;
    source: string;
    date: string;
    relevance: number;
    summary: string;
  }>;
  kpis: {
    trendDirection: string;
    marketGrowth: number;
    topicVelocity: number;
    shareOfVoice: number;
  };
}

const trendsChartConfig: ChartConfig = {
  softwareDevelopment: {
    label: "Software Development",
    color: "#059669",
  },
  itConsulting: {
    label: "IT Consulting",
    color: "#0d9488",
  },
  digitalTransformation: {
    label: "Digital Transformation",
    color: "#d97706",
  },
  customSoftware: {
    label: "Custom Software",
    color: "#dc2626",
  },
  nearshore: {
    label: "Nearshore",
    color: "#7c3aed",
  },
};

const socialChartConfig: ChartConfig = {
  mentions: {
    label: "Mentions",
    color: "#059669",
  },
  sentiment: {
    label: "Sentiment",
    color: "#d97706",
  },
};

interface MarketIntelligenceProps {
  data: MarketIntelligenceData;
}

function getRelevanceColor(relevance: number) {
  if (relevance >= 80) return "bg-emerald-100 text-emerald-800 border-emerald-200";
  if (relevance >= 60) return "bg-teal-100 text-teal-800 border-teal-200";
  if (relevance >= 40) return "bg-amber-100 text-amber-800 border-amber-200";
  return "bg-muted text-muted-foreground border-border";
}

function getRelevanceLabel(relevance: number) {
  if (relevance >= 80) return "High";
  if (relevance >= 60) return "Medium-High";
  if (relevance >= 40) return "Medium";
  return "Low";
}

export function MarketIntelligence({ data }: MarketIntelligenceProps) {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Trend Direction"
          value={data.kpis.trendDirection}
          icon={TrendingUp}
        />
        <KpiCard
          title="Market Growth"
          value={data.kpis.marketGrowth}
          suffix="%"
          change={data.kpis.marketGrowth}
          changeLabel="vs last quarter"
          icon={Zap}
        />
        <KpiCard
          title="Topic Velocity"
          value={data.kpis.topicVelocity}
          suffix="/wk"
          icon={Radio}
        />
        <KpiCard
          title="Share of Voice"
          value={data.kpis.shareOfVoice}
          suffix="%"
          icon={BarChart3}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Google Trends Line Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Google Trends Analysis</CardTitle>
            <CardDescription className="text-xs">
              Search interest over time across 5 key topics
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <ChartContainer config={trendsChartConfig} className="h-[300px] w-full">
              <LineChart data={data.trends} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  className="text-xs"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  className="text-xs tabular-nums"
                />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Line
                  type="monotone"
                  dataKey="softwareDevelopment"
                  stroke="var(--color-softwareDevelopment)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="itConsulting"
                  stroke="var(--color-itConsulting)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="digitalTransformation"
                  stroke="var(--color-digitalTransformation)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="customSoftware"
                  stroke="var(--color-customSoftware)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="nearshore"
                  stroke="var(--color-nearshore)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Social Mentions Bar Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Social Media Mentions</CardTitle>
            <CardDescription className="text-xs">
              Mentions volume and sentiment score by platform
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <ChartContainer config={socialChartConfig} className="h-[300px] w-full">
              <BarChart data={data.socialMentions} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="platform"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  className="text-xs"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  className="text-xs tabular-nums"
                />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar
                  dataKey="mentions"
                  fill="var(--color-mentions)"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                />
                <Bar
                  dataKey="sentiment"
                  fill="var(--color-sentiment)"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Industry Reports */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Industry Reports & Insights</CardTitle>
          <CardDescription className="text-xs">
            Curated reports relevant to Mediusware&apos;s market positioning
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="max-h-[400px]">
            <div className="space-y-3 pr-4">
              {data.industryReports.map((report, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-2 rounded-lg border p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium leading-snug text-foreground">
                        {report.title}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 mt-1.5">
                        <span className="text-xs text-muted-foreground">{report.source}</span>
                        <span className="text-xs text-muted-foreground/50">·</span>
                        <span className="text-xs tabular-nums text-muted-foreground">{report.date}</span>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={`shrink-0 text-[10px] ${getRelevanceColor(report.relevance)}`}
                    >
                      {getRelevanceLabel(report.relevance)} · {report.relevance}%
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {report.summary}
                  </p>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}