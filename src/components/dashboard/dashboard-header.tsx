"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Activity, RefreshCw, Calendar, Download } from "lucide-react";
import { useMemo } from "react";

export function DashboardHeader() {
  const lastUpdated = useMemo(() => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  return (
    <header className="border-b bg-background">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                  SEO Intelligence Dashboard
                </h1>
                <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] px-1.5">
                  LIVE
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Mediusware — Single Source of Truth for SEO, Content & Competitive Intelligence
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-md">
              <Calendar className="h-3.5 w-3.5" />
              <span className="tabular-nums">{lastUpdated}</span>
            </div>
            <Separator orientation="vertical" className="hidden sm:block h-6" />
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Activity className="h-3.5 w-3.5 text-emerald-500" />
              <span>Updated weekly</span>
            </div>
            <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Export</span>
            </Button>
            <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
              <RefreshCw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}