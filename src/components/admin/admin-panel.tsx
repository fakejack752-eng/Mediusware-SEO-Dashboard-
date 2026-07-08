"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Plus, Pencil, Trash2, Database, Loader2, Search, X,
  ChevronDown, ArrowUpDown, Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getModuleConfig, type FieldConfig } from "@/lib/module-config";
import { getStatusColor, getPriorityColor } from "@/components/dashboard/tab-helpers";
import { cn } from "@/lib/utils";

interface AdminPanelProps {
  moduleId: string;
}

function formatCellValue(value: unknown, field: FieldConfig): string {
  if (value === null || value === undefined || value === "") return "—";
  if (field.type === "boolean") return value ? "Yes" : "No";
  if (field.type === "number" && field.key === "ctr") return `${Number(value).toFixed(2)}%`;
  if (field.type === "number" && field.key === "conversionRate") return `${Number(value).toFixed(2)}%`;
  if (field.type === "number" && field.key === "cpc") return `$${Number(value).toFixed(2)}`;
  if (field.type === "number") return Number(value).toLocaleString();
  return String(value);
}

function getBadgeVariant(field: FieldConfig, value: string): { className: string; text: string } | null {
  if (field.type === "boolean") {
    return {
      className: value === "Yes" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800" : "bg-stone-100 text-stone-500 dark:bg-stone-800/40 dark:text-stone-400 border-stone-200 dark:border-stone-700",
      text: value,
    };
  }
  if (field.type === "select") {
    const statusKeys = ["status", "sentiment", "searchVolumeTrend", "signalType", "demand"];
    if (statusKeys.some(k => field.key.includes(k)) || field.key === "status") {
      const cls = field.key === "priority" || field.key === "demand"
        ? getPriorityColor(value)
        : getStatusColor(value);
      if (cls !== "bg-muted text-muted-foreground") {
        return { className: cls, text: value };
      }
    }
    return { className: "bg-muted/80 text-muted-foreground border-transparent", text: value };
  }
  return null;
}

export function AdminPanel({ moduleId }: AdminPanelProps) {
  const config = getModuleConfig(moduleId);
  const [data, setData] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<string>("id");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const fetchData = useCallback(async () => {
    if (!config) return;
    setLoading(true);
    try {
      const res = await fetch(config.apiEndpoint);
      const json = await res.json();
      setData(Array.isArray(json) ? json : []);
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [config]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filteredData = useMemo(() => {
    let result = data;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((r) =>
        config?.fields.some((f) =>
          String(r[f.key] ?? "").toLowerCase().includes(q)
        )
      );
    }
    result = [...result].sort((a, b) => {
      const aVal = a[sortField] ?? "";
      const bVal = b[sortField] ?? "";
      const aNum = Number(aVal);
      const bNum = Number(bVal);
      if (!isNaN(aNum) && !isNaN(bNum)) {
        return sortDir === "asc" ? aNum - bNum : bNum - aNum;
      }
      return sortDir === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
    return result;
  }, [data, search, sortField, sortDir, config]);

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const openCreate = () => {
    setEditId(null);
    const initial: Record<string, unknown> = {};
    config?.fields.forEach((f) => {
      if (f.type === "boolean") initial[f.key] = false;
      else if (f.type === "number") initial[f.key] = 0;
      else initial[f.key] = "";
    });
    setFormData(initial);
    setDialogOpen(true);
  };

  const openEdit = (record: Record<string, unknown>) => {
    setEditId(record.id as number);
    const copy: Record<string, unknown> = {};
    config?.fields.forEach((f) => {
      copy[f.key] = record[f.key] ?? (f.type === "boolean" ? false : f.type === "number" ? 0 : "");
    });
    setFormData(copy);
    setDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!config) return;
    try {
      const res = await fetch(`${config.apiEndpoint}?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Record deleted");
        fetchData();
      } else {
        toast.error("Failed to delete");
      }
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleSubmit = async () => {
    if (!config) return;
    const requiredField = config.fields.find(
      (f) => f.required && !formData[f.key] && formData[f.key] !== 0 && formData[f.key] !== false
    );
    if (requiredField) {
      toast.error(`${requiredField.label} is required`);
      return;
    }
    setSubmitting(true);
    try {
      const method = editId ? "PUT" : "POST";
      const body = editId ? { id: editId, ...formData } : formData;
      const res = await fetch(config.apiEndpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        toast.success(editId ? "Record updated" : "Record created");
        setDialogOpen(false);
        fetchData();
      } else {
        toast.error("Failed to save");
      }
    } catch {
      toast.error("Failed to save");
    } finally {
      setSubmitting(false);
    }
  };

  if (!config) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">Module not found</div>
    );
  }

  const visibleFields = config.fields.filter((f) => f.showInTable !== false).slice(0, 10);
  const hiddenFields = config.fields.filter((f) => f.showInTable === false || config.fields.indexOf(f) >= 10);

  return (
    <div className="space-y-5">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
      >
        <div>
          <h2 className="text-xl font-bold tracking-tight">{config.label}</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{config.description}</p>
        </div>
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Badge variant="secondary" className="tabular-nums px-3 py-1">
              {data.length} records
            </Badge>
          </motion.div>
          <Button onClick={openCreate} size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Record</span>
          </Button>
        </div>
      </motion.div>

      {/* Search & Filters */}
      {data.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex items-center gap-3"
        >
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search records..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 rounded-md flex items-center justify-center hover:bg-muted"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
          {search && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-muted-foreground"
            >
              {filteredData.length} of {data.length} shown
            </motion.p>
          )}
        </motion.div>
      )}

      {/* Content */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-11 w-full rounded-lg" />
          ))}
        </div>
      ) : data.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex flex-col items-center justify-center py-24 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
            className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center mb-4"
          >
            <Database className="h-6 w-6 text-muted-foreground" />
          </motion.div>
          <h3 className="text-base font-semibold mb-1">No records yet</h3>
          <p className="text-sm text-muted-foreground mb-5 max-w-sm">
            Add your first {config.label.toLowerCase()} record to start tracking data.
          </p>
          <Button onClick={openCreate} size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" />
            Add First Record
          </Button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border bg-card overflow-hidden"
        >
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  {visibleFields.map((f) => (
                    <TableHead
                      key={f.key}
                      className={`${f.tableWidth} cursor-pointer select-none group/head`}
                      onClick={() => toggleSort(f.key)}
                    >
                      <div className="flex items-center gap-1">
                        <span className="text-[11px] uppercase tracking-wider font-semibold">{f.label}</span>
                        <ArrowUpDown className={cn(
                          "h-3 w-3 opacity-0 group-hover/head:opacity-40 transition-opacity",
                          sortField === f.key && "opacity-100 !text-foreground"
                        )} />
                      </div>
                    </TableHead>
                  ))}
                  {hiddenFields.length > 0 && <TableHead className="w-10" />}
                  <TableHead className="w-24 text-right">
                    <span className="text-[11px] uppercase tracking-wider font-semibold">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence mode="popLayout">
                  {filteredData.map((record, idx) => (
                    <motion.tr
                      key={record.id as number}
                      layout
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 8, height: 0 }}
                      transition={{ delay: idx * 0.02, duration: 0.25 }}
                      className="border-b transition-colors hover:bg-muted/40 group/row"
                    >
                      {visibleFields.map((f) => {
                        const badge = getBadgeVariant(f, formatCellValue(record[f.key], f));
                        return (
                          <TableCell key={f.key} className="tabular-nums py-3">
                            {badge ? (
                              <span className={cn("inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border", badge.className)}>
                                {badge.text}
                              </span>
                            ) : (
                              <span className="text-sm truncate block max-w-[200px]">
                                {formatCellValue(record[f.key], f)}
                              </span>
                            )}
                          </TableCell>
                        );
                      })}
                      {hiddenFields.length > 0 && (
                        <TableCell>
                          <TooltipProvider delayDuration={200}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge variant="outline" className="text-[10px] cursor-default hover:bg-muted">
                                  +{hiddenFields.length}
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent side="left" className="max-w-xs">
                                <div className="space-y-1.5">
                                  {hiddenFields.map((f) => (
                                    <div key={f.key} className="flex justify-between gap-6 text-xs">
                                      <span className="text-muted-foreground">{f.label}</span>
                                      <span className="font-medium tabular-nums">{formatCellValue(record[f.key], f)}</span>
                                    </div>
                                  ))}
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                      )}
                      <TableCell className="text-right py-3">
                        <div className="flex items-center justify-end gap-0.5 opacity-0 group-hover/row:opacity-100 transition-opacity duration-200">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => openEdit(record)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                            onClick={() => handleDelete(record.id as number)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
        </motion.div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg">{editId ? "Edit Record" : "New Record"}</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              {config.label} — {editId ? "Update the fields below" : "Fill in the details to create a new entry"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
            {config.fields.map((field, fieldIdx) => (
              <motion.div
                key={field.key}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: fieldIdx * 0.03, duration: 0.25 }}
                className={field.type === "textarea" ? "sm:col-span-2" : ""}
              >
                <Label htmlFor={field.key} className="text-xs font-medium mb-1.5 block text-muted-foreground uppercase tracking-wider">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-0.5">*</span>}
                </Label>
                {field.type === "select" && field.options && (
                  <Select
                    value={String(formData[field.key] ?? "")}
                    onValueChange={(v) => setFormData((p) => ({ ...p, [field.key]: v }))}
                  >
                    <SelectTrigger className={field.width}>
                      <SelectValue placeholder={field.placeholder || `Select ${field.label.toLowerCase()}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {field.type === "boolean" && (
                  <div className="flex items-center gap-2.5 h-9">
                    <Switch
                      id={field.key}
                      checked={!!formData[field.key]}
                      onCheckedChange={(v) => setFormData((p) => ({ ...p, [field.key]: v }))}
                    />
                    <span className="text-sm text-muted-foreground">
                      {formData[field.key] ? "Yes" : "No"}
                    </span>
                  </div>
                )}
                {field.type === "textarea" && (
                  <Textarea
                    id={field.key}
                    placeholder={field.placeholder}
                    value={String(formData[field.key] ?? "")}
                    onChange={(e) => setFormData((p) => ({ ...p, [field.key]: e.target.value }))}
                    rows={3}
                    className="text-sm"
                  />
                )}
                {field.type === "number" && (
                  <Input
                    id={field.key}
                    type="number"
                    step={field.key === "ctr" || field.key === "conversionRate" || field.key === "cpc" ? "0.01" : "1"}
                    placeholder={field.placeholder}
                    value={formData[field.key] === 0 ? 0 : formData[field.key] ?? ""}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        [field.key]: e.target.value === "" ? 0 : Number(e.target.value),
                      }))
                    }
                    className={field.width}
                  />
                )}
                {(field.type === "text" || field.type === "date") && (
                  <Input
                    id={field.key}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={String(formData[field.key] ?? "")}
                    onChange={(e) => setFormData((p) => ({ ...p, [field.key]: e.target.value }))}
                    className={field.width}
                  />
                )}
              </motion.div>
            ))}
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setDialogOpen(false)} className="text-sm">
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={submitting} className="gap-1.5 text-sm">
              {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {editId ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

