"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { type LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: LucideIcon;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function KpiCard({ title, value, change, changeLabel, icon: Icon, prefix, suffix, className }: KpiCardProps) {
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;
  const isNeutral = change !== undefined && change === 0;

  return (
    <Card className={cn("py-4", className)}>
      <CardContent className="p-4 pt-0">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
          {Icon && (
            <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
              <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="flex items-baseline gap-1.5">
          {prefix && <span className="text-sm text-muted-foreground">{prefix}</span>}
          <p className="text-2xl font-bold tabular-nums tracking-tight">{value}</p>
          {suffix && <span className="text-sm text-muted-foreground">{suffix}</span>}
        </div>
        {change !== undefined && (
          <div className="flex items-center gap-1.5 mt-1.5">
            {isPositive && <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />}
            {isNegative && <TrendingDown className="h-3.5 w-3.5 text-red-500" />}
            {isNeutral && <Minus className="h-3.5 w-3.5 text-muted-foreground" />}
            <span
              className={cn(
                "text-xs font-medium tabular-nums",
                isPositive && "text-emerald-600",
                isNegative && "text-red-500",
                isNeutral && "text-muted-foreground"
              )}
            >
              {isPositive ? "+" : ""}
              {change}%
            </span>
            {changeLabel && <span className="text-xs text-muted-foreground">{changeLabel}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}