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
  accentColor?: "teal" | "blue" | "green" | "amber" | "purple" | "stone";
}

const accentMap = {
  teal: "from-teal-500/10 to-transparent group-hover:from-teal-500/20",
  blue: "from-blue-500/10 to-transparent group-hover:from-blue-500/20",
  green: "from-emerald-500/10 to-transparent group-hover:from-emerald-500/20",
  amber: "from-amber-500/10 to-transparent group-hover:from-amber-500/20",
  purple: "from-purple-500/10 to-transparent group-hover:from-purple-500/20",
  stone: "from-stone-500/10 to-transparent group-hover:from-stone-500/20",
};

const iconBgMap = {
  teal: "bg-teal-50 text-teal-600 dark:bg-teal-950/40 dark:text-teal-400",
  blue: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
  green: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
  amber: "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
  purple: "bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400",
  stone: "bg-stone-50 text-stone-600 dark:bg-stone-800/40 dark:text-stone-400",
};

const iconHoverMap = {
  teal: "group-hover:shadow-teal-500/20 group-hover:shadow-lg",
  blue: "group-hover:shadow-blue-500/20 group-hover:shadow-lg",
  green: "group-hover:shadow-emerald-500/20 group-hover:shadow-lg",
  amber: "group-hover:shadow-amber-500/20 group-hover:shadow-lg",
  purple: "group-hover:shadow-purple-500/20 group-hover:shadow-lg",
  stone: "group-hover:shadow-stone-500/20 group-hover:shadow-lg",
};

const borderAccentMap = {
  teal: "group-hover:border-teal-500/30",
  blue: "group-hover:border-blue-500/30",
  green: "group-hover:border-emerald-500/30",
  amber: "group-hover:border-amber-500/30",
  purple: "group-hover:border-purple-500/30",
  stone: "group-hover:border-stone-500/30",
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
  accentColor = "teal",
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
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={cn(
        "group relative rounded-xl border bg-card p-4 overflow-hidden cursor-default transition-colors duration-300",
        borderAccentMap[accentColor],
        className
      )}
    >
      {/* Subtle gradient background on hover */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl",
        accentMap[accentColor]
      )} />

      {/* Animated corner glow on hover */}
      <motion.div
        className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl"
        style={{
          background: accentColor === "teal" ? "#00A99D15" :
                     accentColor === "blue" ? "#0066CC15" :
                     accentColor === "green" ? "#00CC9915" :
                     accentColor === "purple" ? "#CC66CC15" :
                     "#d9770615"
        }}
      />

      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest">{title}</p>
          {Icon && (
            <motion.div
              whileHover={{ rotate: 12, scale: 1.15 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className={cn(
                "h-8 w-8 rounded-lg flex items-center justify-center transition-all duration-300",
                iconBgMap[accentColor],
                iconHoverMap[accentColor]
              )}
            >
              <Icon className="h-4 w-4" />
            </motion.div>
          )}
        </div>
        <div className="flex items-baseline gap-1">
          {prefix && <span className="text-xs text-muted-foreground">{prefix}</span>}
          <motion.p
            className="text-2xl font-bold tabular-nums tracking-tight"
            initial={animated ? { opacity: 0, y: 12, scale: 0.9 } : false}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {displayValue}
          </motion.p>
          {suffix && <span className="text-xs text-muted-foreground">{suffix}</span>}
        </div>
        {change !== undefined && (
          <motion.div
            className="flex items-center gap-1.5 mt-2.5"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {isPositive && (
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 400, damping: 15 }}
                className="h-5 w-5 rounded-full bg-teal-50 dark:bg-teal-950/40 flex items-center justify-center"
              >
                <TrendingUp className="h-3 w-3 text-teal-600 dark:text-teal-400" />
              </motion.div>
            )}
            {isNegative && (
              <motion.div
                initial={{ scale: 0, rotate: 45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 400, damping: 15 }}
                className="h-5 w-5 rounded-full bg-red-50 dark:bg-red-950/40 flex items-center justify-center"
              >
                <TrendingDown className="h-3 w-3 text-red-500" />
              </motion.div>
            )}
            {isNeutral && (
              <div className="h-5 w-5 rounded-full bg-stone-100 dark:bg-stone-800/40 flex items-center justify-center">
                <Minus className="h-3 w-3 text-stone-400" />
              </div>
            )}
            <span
              className={cn(
                "text-[11px] font-bold tabular-nums",
                isPositive && "text-teal-600 dark:text-teal-400",
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