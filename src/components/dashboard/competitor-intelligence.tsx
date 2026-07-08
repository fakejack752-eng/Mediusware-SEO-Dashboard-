"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { KpiCard } from "@/components/dashboard/kpi-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis, Cell } from "recharts";
import { Users, Shield, Globe, Trophy, Share2, Link2, FileText, Hash } from "lucide-react";

export interface CompetitorIntelligenceData {
  competitors: Array<{
    name: string;
    domain: string;
    authority: number;
    organicTraffic: number;
    backlinks: number;
    keywords: number;
    contentPieces: number;
    monthlyGrowth: number;
  }>;
  blogs: Array<{
    competitor: string;
    title: string;
    publishedDate: string;
    shares: number;
    backlinks: number;
    wordCount: number;
    rankingKeywords: number;
  }>;
  keywords: Array<{
    keyword: string;
    competitor: string;
    position: number;
    volume: number;
    kd: number;
  }>;
  backlinkComparison: Array<{
    name: string;
    backlinks: number;
    referringDomains: number;
  }>;
}

interface CompetitorIntelligenceProps {
  data: CompetitorIntelligenceData;
}

const backlinkChartConfig = {
  backlinks: {
    label: "Backlinks",
    color: "hsl(160, 84%, 39%)",
  },
  referringDomains: {
    label: "Referring Domains",
    color: "hsl(174, 72%, 46%)",
  },
} as const;

function formatNumber(num: number): string {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return num.toLocaleString();
}

export function CompetitorIntelligence({ data }: CompetitorIntelligenceProps) {
  const topAuthority = Math.max(...data.competitors.map((c) => c.authority));
  const avgTraffic = Math.round(
    data.competitors.reduce((sum, c) => sum + c.organicTraffic, 0) / data.competitors.length
  );

  const barColors = [
    "hsl(160, 84%, 39%)",
    "hsl(174, 72%, 46%)",
    "hsl(152, 69%, 45%)",
    "hsl(168, 76%, 42%)",
    "hsl(162, 63%, 41%)",
    "hsl(170, 70%, 44%)",
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Competitors Tracked"
          value={data.competitors.length}
          icon={Users}
        />
        <KpiCard
          title="Top Competitor Authority"
          value={topAuthority}
          icon={Shield}
          suffix="DA"
        />
        <KpiCard
          title="Avg Competitor Traffic"
          value={avgTraffic.toLocaleString()}
          icon={Globe}
        />
        <KpiCard
          title="Your Growth Rank"
          value="#1"
          change={8.4}
          icon={Trophy}
        />
      </div>

      {/* Competitor Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle>Competitor Comparison</CardTitle>
          <CardDescription>
            Side-by-side SEO metrics for all tracked competitors
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-6">Name</TableHead>
                  <TableHead className="text-right">DA</TableHead>
                  <TableHead className="text-right">Organic Traffic</TableHead>
                  <TableHead className="text-right">Backlinks</TableHead>
                  <TableHead className="text-right">Keywords</TableHead>
                  <TableHead className="text-right">Content</TableHead>
                  <TableHead className="text-right pr-6">Growth</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.competitors.map((competitor) => {
                  const isYou = competitor.name === "Mediusware (You)";
                  return (
                    <TableRow
                      key={competitor.domain}
                      className={isYou ? "bg-emerald-50 dark:bg-emerald-950/20 hover:bg-emerald-100 dark:hover:bg-emerald-950/30" : ""}
                    >
                      <TableCell className="pl-6">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-medium text-sm">
                            {competitor.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {competitor.domain}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium tabular-nums">
                        {competitor.authority}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatNumber(competitor.organicTraffic)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatNumber(competitor.backlinks)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatNumber(competitor.keywords)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {competitor.contentPieces}
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <Badge
                          variant={competitor.monthlyGrowth >= 0 ? "default" : "destructive"}
                          className={
                            competitor.monthlyGrowth >= 0
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-950/50 border-transparent"
                              : ""
                          }
                        >
                          {competitor.monthlyGrowth >= 0 ? "+" : ""}
                          {competitor.monthlyGrowth}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Backlink Comparison Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Backlink Comparison</CardTitle>
          <CardDescription>
            Total backlinks and referring domains across competitors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={backlinkChartConfig} className="h-[300px] w-full">
            <BarChart
              data={data.backlinkComparison}
              layout="vertical"
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <XAxis type="number" tickFormatter={formatNumber} />
              <YAxis
                type="category"
                dataKey="name"
                width={130}
                tick={{ fontSize: 12 }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="backlinks"
                fill="var(--color-backlinks)"
                radius={[0, 4, 4, 0]}
                maxBarSize={24}
              >
                {data.backlinkComparison.map((_, index) => (
                  <Cell
                    key={`backlinks-${index}`}
                    fill={barColors[index % barColors.length]}
                  />
                ))}
              </Bar>
              <Bar
                dataKey="referringDomains"
                fill="var(--color-referringDomains)"
                radius={[0, 4, 4, 0]}
                maxBarSize={24}
                opacity={0.6}
              >
                {data.backlinkComparison.map((_, index) => (
                  <Cell
                    key={`referring-${index}`}
                    fill={barColors[index % barColors.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Recent Competitor Blog Posts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Competitor Blog Posts</CardTitle>
          <CardDescription>
            Latest content published by tracked competitors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {data.blogs.map((blog, index) => (
              <Card
                key={index}
                className="py-0 gap-0 hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-3">
                  <CardDescription className="text-xs font-medium uppercase tracking-wider">
                    {blog.competitor}
                  </CardDescription>
                  <CardTitle className="text-sm leading-snug font-semibold line-clamp-2">
                    {blog.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                    <FileText className="h-3.5 w-3.5" />
                    <span>{blog.wordCount.toLocaleString()} words</span>
                    <span className="text-border">|</span>
                    <span>{blog.publishedDate}</span>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Share2 className="h-3.5 w-3.5" />
                      <span className="font-medium tabular-nums">
                        {formatNumber(blog.shares)}
                      </span>
                      <span className="text-muted-foreground/70">shares</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Link2 className="h-3.5 w-3.5" />
                      <span className="font-medium tabular-nums">
                        {blog.backlinks}
                      </span>
                      <span className="text-muted-foreground/70">BL</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Hash className="h-3.5 w-3.5" />
                      <span className="font-medium tabular-nums">
                        {blog.rankingKeywords}
                      </span>
                      <span className="text-muted-foreground/70">KW</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}