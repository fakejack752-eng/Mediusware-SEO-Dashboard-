"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KpiCard } from "@/components/dashboard/kpi-card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";
import {
  Users,
  Search,
  Link,
  Shield,
  UserPlus,
  Target,
  DollarSign,
  BarChart3,
} from "lucide-react";

export interface PerformanceData {
  organicTraffic: Array<{
    month: string;
    visitors: number;
    sessions: number;
    pageViews: number;
  }>;
  rankings: Array<{
    month: string;
    top3: number;
    top10: number;
    top20: number;
    top50: number;
  }>;
  ctr: Array<{
    month: string;
    position1to3: number;
    position4to10: number;
    position11to20: number;
    position21to50: number;
  }>;
  conversions: Array<{
    month: string;
    leads: number;
    formSubmissions: number;
    demoRequests: number;
    mqls: number;
    sqls: number;
  }>;
  kpis: {
    totalOrganicTraffic: number;
    trafficGrowth: number;
    avgPosition: number;
    positionChange: number;
    totalKeywords: number;
    keywordGrowth: number;
    totalBacklinks: number;
    backlinkGrowth: number;
    domainAuthority: number;
    authorityChange: number;
    totalLeads: number;
    leadGrowth: number;
    conversionRate: number;
    conversionChange: number;
    organicRevenue: number;
    revenueGrowth: number;
  };
}

interface PerformanceDashboardProps {
  data: PerformanceData;
}

const trafficChartConfig: ChartConfig = {
  visitors: {
    label: "Visitors",
    color: "#059669",
  },
  sessions: {
    label: "Sessions",
    color: "#0d9488",
  },
};

const rankingsChartConfig: ChartConfig = {
  top3: {
    label: "Top 3",
    color: "#059669",
  },
  top10: {
    label: "Top 4-10",
    color: "#0d9488",
  },
  top20: {
    label: "Top 11-20",
    color: "#d97706",
  },
  top50: {
    label: "Top 21-50",
    color: "#ea580c",
  },
};

const ctrChartConfig: ChartConfig = {
  position1to3: {
    label: "Pos 1-3",
    color: "#059669",
  },
  position4to10: {
    label: "Pos 4-10",
    color: "#0d9488",
  },
  position11to20: {
    label: "Pos 11-20",
    color: "#d97706",
  },
  position21to50: {
    label: "Pos 21-50",
    color: "#94a3b8",
  },
};

const conversionsChartConfig: ChartConfig = {
  leads: {
    label: "Leads",
    color: "#059669",
  },
  mqls: {
    label: "MQLs",
    color: "#d97706",
  },
  sqls: {
    label: "SQLs",
    color: "#dc2626",
  },
};

function ChartCard({
  title,
  icon: Icon,
  config,
  children,
  className,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  config: ChartConfig;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader className="pb-2 pt-5 px-5">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <ChartContainer config={config} className="h-[280px] w-full">
          {children as React.ReactElement}
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function PerformanceDashboard({ data }: PerformanceDashboardProps) {
  const { kpis } = data;

  return (
    <div className="space-y-6">
      {/* KPI Cards Grid */}
      <section aria-label="Key Performance Indicators">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            title="Organic Traffic"
            value={kpis.totalOrganicTraffic.toLocaleString()}
            change={kpis.trafficGrowth}
            changeLabel="vs last period"
            icon={Users}
          />
          <KpiCard
            title="Avg Position"
            value={kpis.avgPosition}
            change={-kpis.positionChange}
            changeLabel="vs last period"
            icon={BarChart3}
          />
          <KpiCard
            title="Total Keywords"
            value={kpis.totalKeywords.toLocaleString()}
            change={kpis.keywordGrowth}
            changeLabel="vs last period"
            icon={Search}
          />
          <KpiCard
            title="Backlinks"
            value={kpis.totalBacklinks.toLocaleString()}
            change={kpis.backlinkGrowth}
            changeLabel="vs last period"
            icon={Link}
          />
          <KpiCard
            title="Domain Authority"
            value={kpis.domainAuthority}
            change={kpis.authorityChange}
            changeLabel="vs last period"
            icon={Shield}
          />
          <KpiCard
            title="Total Leads"
            value={kpis.totalLeads.toLocaleString()}
            change={kpis.leadGrowth}
            changeLabel="vs last period"
            icon={UserPlus}
          />
          <KpiCard
            title="Conversion Rate"
            value={`${kpis.conversionRate}%`}
            change={kpis.conversionChange}
            changeLabel="vs last period"
            icon={Target}
          />
          <KpiCard
            title="Organic Revenue"
            value={`$${kpis.organicRevenue.toLocaleString()}`}
            change={kpis.revenueGrowth}
            changeLabel="vs last period"
            icon={DollarSign}
          />
        </div>
      </section>

      {/* Charts Grid */}
      <section aria-label="Performance Charts">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Organic Traffic Area Chart */}
          <ChartCard
            title="Organic Traffic"
            icon={Users}
            config={trafficChartConfig}
          >
            <AreaChart
              data={data.organicTraffic}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                className="text-[10px]"
                interval={1}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                className="text-[10px]"
                tickFormatter={(v: number) =>
                  v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)
                }
              />
              <ChartTooltip
                content={<ChartTooltipContent />}
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Area
                type="monotone"
                dataKey="visitors"
                stroke="#059669"
                fill="#059669"
                fillOpacity={0.15}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
              <Area
                type="monotone"
                dataKey="sessions"
                stroke="#0d9488"
                fill="#0d9488"
                fillOpacity={0.1}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
            </AreaChart>
          </ChartCard>

          {/* Rankings Stacked Area Chart */}
          <ChartCard
            title="Ranking Distribution"
            icon={Search}
            config={rankingsChartConfig}
          >
            <AreaChart
              data={data.rankings}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                className="text-[10px]"
                interval={1}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                className="text-[10px]"
              />
              <ChartTooltip
                content={<ChartTooltipContent />}
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Area
                type="monotone"
                dataKey="top50"
                stroke="#ea580c"
                fill="#ea580c"
                fillOpacity={0.2}
                strokeWidth={1.5}
                dot={false}
                stackId="rankings"
              />
              <Area
                type="monotone"
                dataKey="top20"
                stroke="#d97706"
                fill="#d97706"
                fillOpacity={0.2}
                strokeWidth={1.5}
                dot={false}
                stackId="rankings"
              />
              <Area
                type="monotone"
                dataKey="top10"
                stroke="#0d9488"
                fill="#0d9488"
                fillOpacity={0.2}
                strokeWidth={1.5}
                dot={false}
                stackId="rankings"
              />
              <Area
                type="monotone"
                dataKey="top3"
                stroke="#059669"
                fill="#059669"
                fillOpacity={0.2}
                strokeWidth={1.5}
                dot={false}
                stackId="rankings"
              />
            </AreaChart>
          </ChartCard>

          {/* CTR Line Chart */}
          <ChartCard
            title="Click-Through Rate by Position"
            icon={Target}
            config={ctrChartConfig}
          >
            <LineChart
              data={data.ctr}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                className="text-[10px]"
                interval={1}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                className="text-[10px]"
                tickFormatter={(v: number) => `${v}%`}
                domain={[0, "auto"]}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value: number) => `${value}%`}
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Line
                type="monotone"
                dataKey="position1to3"
                stroke="#059669"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
              <Line
                type="monotone"
                dataKey="position4to10"
                stroke="#0d9488"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
              <Line
                type="monotone"
                dataKey="position11to20"
                stroke="#d97706"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
              <Line
                type="monotone"
                dataKey="position21to50"
                stroke="#94a3b8"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
                strokeDasharray="4 3"
              />
            </LineChart>
          </ChartCard>

          {/* Conversions Bar Chart */}
          <ChartCard
            title="Conversions"
            icon={UserPlus}
            config={conversionsChartConfig}
          >
            <BarChart
              data={data.conversions}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                className="text-[10px]"
                interval={1}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                className="text-[10px]"
              />
              <ChartTooltip
                content={<ChartTooltipContent />}
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="leads"
                fill="#059669"
                stackId="conversions"
              />
              <Bar
                dataKey="mqls"
                fill="#d97706"
                stackId="conversions"
              />
              <Bar
                dataKey="sqls"
                fill="#dc2626"
                radius={[2, 2, 0, 0]}
                stackId="conversions"
              />
            </BarChart>
          </ChartCard>
        </div>
      </section>
    </div>
  );
}