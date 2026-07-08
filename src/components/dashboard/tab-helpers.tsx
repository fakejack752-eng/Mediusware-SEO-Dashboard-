"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, useInView, useSpring, useMotionValue, useTransform, type Variants } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// ── Brand Color Palette ─────────────────────────────────
export const BRAND_TEAL = "#00A99D";
export const BRAND_BLUE = "#0066CC";
export const BRAND_GREEN = "#00CC99";
export const BRAND_PURPLE = "#CC66CC";
export const BRAND_TEAL_LIGHT = "#00C4B7";
export const BRAND_TEAL_DARK = "#008F85";

export const COLORS = [BRAND_TEAL, BRAND_BLUE, BRAND_GREEN, "#d97706", "#dc2626", "#78716c", BRAND_PURPLE, BRAND_TEAL_LIGHT];
export const EMBER = "#d97706";
export const TEAL = BRAND_TEAL;
export const EMERALD = BRAND_GREEN;

// ── Animation Variants (Enhanced) ───────────────────────
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: (i: number = 0) => ({
    opacity: 1,
    transition: { delay: i * 0.05, duration: 0.4 },
  }),
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.85, y: 12 },
  visible: (i: number = 0) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  }),
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

// Bouncy card entrance
export const cardPopIn: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: (i: number = 0) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { delay: i * 0.09, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] },
  }),
};

// ── Animated Number Counter ─────────────────────────────
export function useAnimatedCounter(target: number, duration: number = 900) {
  const [value, setValue] = useState(0);
  const prevTarget = useRef(target);

  useEffect(() => {
    if (target === prevTarget.current) return;
    prevTarget.current = target;

    const startTime = performance.now();
    const startValue = value;
    const diff = target - startValue;

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setValue(Math.round(startValue + diff * eased));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [target, duration]);

  // Trigger animation when first mounting
  useEffect(() => {
    const startTime = performance.now();
    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
    }
    if (target !== 0) requestAnimationFrame(tick);
  }, [target, duration]);

  return value;
}

// ── Animated Spring Value ───────────────────────────────
export function useSpringValue(target: number) {
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { stiffness: 100, damping: 30 });
  const display = useTransform(spring, (v) => Math.round(v));
  const [displayVal, setDisplayVal] = useState(0);

  useEffect(() => {
    motionVal.set(target);
  }, [motionVal, target]);

  useEffect(() => {
    const unsub = display.on("change", (v) => setDisplayVal(v));
    return unsub;
  }, [display]);

  return displayVal;
}

// ── InView Hook ─────────────────────────────────────────
export function useInViewOnce(threshold: number = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: threshold });
  return { ref, isInView };
}

// ── Data Fetch Hook ─────────────────────────────────────
export function useDataFetch(endpoint: string) {
  const [data, setData] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(endpoint);
      const json = await res.json();
      setData(Array.isArray(json) ? json : []);
    } catch { /* empty */ }
    setLoading(false);
  }, [endpoint]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(endpoint);
        const json = await res.json();
        if (!cancelled) setData(Array.isArray(json) ? json : []);
      } catch { /* empty */ }
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [endpoint]);

  return { data, loading, refetch: fetchData };
}

// ── Utility Functions ───────────────────────────────────
export function countBy(arr: Record<string, unknown>[], key: string) {
  const map = new Map<string, number>();
  arr.forEach((r) => { const v = String(r[key] ?? "Unknown"); map.set(v, (map.get(v) ?? 0) + 1); });
  return Array.from(map.entries()).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
}

export function avgNum(arr: Record<string, unknown>[], key: string): number {
  if (!arr.length) return 0;
  const nums = arr.map((r) => Number(r[key]) || 0).filter((n) => n > 0);
  return nums.length ? Math.round(nums.reduce((a, b) => a + b, 0) / nums.length) : 0;
}

export function sumNum(arr: Record<string, unknown>[], key: string): number {
  return arr.reduce((s, r) => s + (Number(r[key]) || 0), 0);
}

export function pctOf(arr: Record<string, unknown>[], key: string, match: (v: unknown) => boolean): number {
  if (!arr.length) return 0;
  return Math.round((arr.filter((r) => match(r[key])).length / arr.length) * 100);
}

// ── Shared Components ──────────────────────────────────
export function EmptyState({ moduleName }: { moduleName: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center justify-center py-24 text-center"
    >
      <motion.div
        initial={{ scale: 0, rotate: -15 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
        className="relative h-20 w-20 rounded-2xl flex items-center justify-center mb-6"
        style={{ background: `linear-gradient(135deg, ${BRAND_TEAL}15, ${BRAND_BLUE}10)` }}
      >
        <Sparkles className="h-8 w-8" style={{ color: BRAND_TEAL }} />
        <motion.div
          className="absolute inset-0 rounded-2xl border-2"
          style={{ borderColor: `${BRAND_TEAL}30` }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.4 }}
        className="text-lg font-semibold mb-2 tracking-tight"
      >
        No data yet
      </motion.h3>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.4 }}
        className="text-sm text-muted-foreground max-w-sm leading-relaxed"
      >
        Switch to the <span className="font-medium text-foreground">Admin Panel</span> and add records to the{" "}
        <span className="font-medium" style={{ color: BRAND_TEAL }}>{moduleName}</span> module to see visualizations here.
      </motion.p>
    </motion.div>
  );
}

export function LoadingSkeleton() {
  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
          >
            <Skeleton className="h-28 rounded-xl" />
          </motion.div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.4 }}>
          <Skeleton className="h-72 rounded-xl" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.4 }}>
          <Skeleton className="h-72 rounded-xl" />
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.4 }}>
        <Skeleton className="h-[400px] rounded-xl" />
      </motion.div>
    </div>
  );
}

// ── Animated Card Wrapper (Enhanced) ────────────────────
export function AnimatedCard({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, isInView } = useInViewOnce();
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28, scale: 0.96 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Animated Table Row (Enhanced) ───────────────────────
export function AnimatedRow({ children, index = 0 }: { children: React.ReactNode; index?: number }) {
  return (
    <motion.tr
      initial={{ opacity: 0, x: -12, scale: 0.98 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="border-b transition-colors hover:bg-muted/50 group"
    >
      {children}
    </motion.tr>
  );
}

// ── Status Badge Colors ─────────────────────────────────
export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    "Published": "bg-teal-100 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400",
    "Approved": "bg-teal-100 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400",
    "Ranking": "bg-teal-100 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400",
    "Top 10": "bg-teal-100 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400",
    "Top 3": "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
    "Improving": "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
    "Positive": "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
    "Rising": "bg-teal-100 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400",
    "In Progress": "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
    "In Review": "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
    "Assigned": "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
    "Spike": "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
    "Mixed": "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
    "Neutral": "bg-stone-100 text-stone-600 dark:bg-stone-800/40 dark:text-stone-400",
    "Not Started": "bg-stone-100 text-stone-600 dark:bg-stone-800/40 dark:text-stone-400",
    "Stable": "bg-stone-100 text-stone-600 dark:bg-stone-800/40 dark:text-stone-400",
    "Idea": "bg-stone-100 text-stone-600 dark:bg-stone-800/40 dark:text-stone-400",
    "Paused": "bg-stone-100 text-stone-600 dark:bg-stone-800/40 dark:text-stone-400",
    "On Hold": "bg-stone-100 text-stone-600 dark:bg-stone-800/40 dark:text-stone-400",
    "Cancelled": "bg-stone-100 text-stone-600 dark:bg-stone-800/40 dark:text-stone-400",
    "Declining": "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400",
    "Falling": "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400",
    "Negative": "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400",
    "Not Mentioned": "bg-stone-100 text-stone-500 dark:bg-stone-800/40 dark:text-stone-500",
    "Monitor": "bg-stone-100 text-stone-600 dark:bg-stone-800/40 dark:text-stone-400",
  };
  return map[status] || "bg-muted text-muted-foreground";
}

export function getPriorityColor(priority: string): string {
  const map: Record<string, string> = {
    "Critical": "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400",
    "Very High": "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400",
    "High": "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
    "Medium": "bg-teal-100 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400",
    "Low": "bg-stone-100 text-stone-500 dark:bg-stone-800/40 dark:text-stone-500",
    "Very Low": "bg-stone-100 text-stone-500 dark:bg-stone-800/40 dark:text-stone-500",
  };
  return map[priority] || "bg-muted text-muted-foreground";
}

// Keep old stagger for backwards compatibility
export const stagger = {
  container: {},
  item: (i: number) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: i * 0.05, duration: 0.3 },
  }),
};