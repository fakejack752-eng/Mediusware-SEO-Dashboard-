"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { type LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useAnimatedCounter } from "./tab-helpers";

interface KpiCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: LucideIcon;
  prefix?: string;
  suffix?: string;
  className?: string;
  animated?: boolean;
  accentColor?: "emerald" | "teal" | "amber" | "stone";
}

const accentMap = {
  emerald: "from-emerald-500/10 to-transparent group-hover:from-emerald-500/20",
  teal: "from-teal-500/10 to-transparent group-hover:from-teal-500/20",
  amber: "from-amber-500/10 to-transparent group-hover:from-amber-500/20",
  stone: "from-stone-500/10 to-transparent group-hover:from-stone-500/20",
};

const iconBgMap = {
  emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
  teal: "bg-teal-50 text-teal-600 dark:bg-teal-950/40 dark:text-teal-400",
  amber: "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
  stone: "bg-stone-50 text-stone-600 dark:bg-stone-800/40 dark:text-stone-400",
};

export function KpiCard({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  prefix,
  suffix,
  className,
  animated = true,
  accentColor = "emerald",
}: KpiCardProps) {
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;
  const isNeutral = change !== undefined && change === 0;
  const numericValue = typeof value === "number" ? value : parseInt(String(value), 10);
  const shouldAnimate = animated && !isNaN(numericValue) && String(value) === String(numericValue);
  const animatedValue = useAnimatedCounter(shouldAnimate ? numericValue : 0);
  const displayValue = shouldAnimate ? animatedValue : value;

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={cn("group relative rounded-xl border bg-card p-4 overflow-hidden", className)}
    >
      {/* Subtle gradient background on hover */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl",
        accentMap[accentColor]
      )} />

      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest">{title}</p>
          {Icon && (
            <motion.div
              whileHover={{ rotate: 8, scale: 1.1 }}
              className={cn("h-8 w-8 rounded-lg flex items-center justify-center transition-colors", iconBgMap[accentColor])}
            >
              <Icon className="h-4 w-4" />
            </motion.div>
          )}
        </div>
        <div className="flex items-baseline gap-1">
          {prefix && <span className="text-xs text-muted-foreground">{prefix}</span>}
          <motion.p
            className="text-2xl font-bold tabular-nums tracking-tight"
            initial={animated ? { opacity: 0, y: 8 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {displayValue}
          </motion.p>
          {suffix && <span className="text-xs text-muted-foreground">{suffix}</span>}
        </div>
        {change !== undefined && (
          <motion.div
            className="flex items-center gap-1.5 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {isPositive && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4, type: "spring" }}>
                <TrendingUp className="h-3 w-3 text-emerald-600" />
              </motion.div>
            )}
            {isNegative && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4, type: "spring" }}>
                <TrendingDown className="h-3 w-3 text-red-500" />
              </motion.div>
            )}
            {isNeutral && <Minus className="h-3 w-3 text-muted-foreground" />}
            <span
              className={cn(
                "text-[11px] font-semibold tabular-nums",
                isPositive && "text-emerald-600",
                isNegative && "text-red-500",
                isNeutral && "text-muted-foreground"
              )}
            >
              {isPositive ? "+" : ""}
              {change}%
            </span>
            {changeLabel && <span className="text-[11px] text-muted-foreground">{changeLabel}</span>}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}