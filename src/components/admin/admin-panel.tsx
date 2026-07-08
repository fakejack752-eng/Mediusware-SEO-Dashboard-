"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Database, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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

export function AdminPanel({ moduleId }: AdminPanelProps) {
  const config = getModuleConfig(moduleId);
  const [data, setData] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [submitting, setSubmitting] = useState(false);

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
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      const res = await fetch(`${config.apiEndpoint}?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Record deleted");
        fetchData();
      } else {
        toast.error("Failed to delete record");
      }
    } catch {
      toast.error("Failed to delete record");
    }
  };

  const handleSubmit = async () => {
    if (!config) return;
    const requiredField = config.fields.find(f => f.required && !formData[f.key] && formData[f.key] !== 0 && formData[f.key] !== false);
    if (requiredField) {
      toast.error(`${requiredField.label} is required`);
      return;
    }
    setSubmitting(true);
    try {
      const url = editId ? config.apiEndpoint : config.apiEndpoint;
      const method = editId ? "PUT" : "POST";
      const body = editId ? { id: editId, ...formData } : formData;
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        toast.success(editId ? "Record updated" : "Record added");
        setDialogOpen(false);
        fetchData();
      } else {
        toast.error("Failed to save record");
      }
    } catch {
      toast.error("Failed to save record");
    } finally {
      setSubmitting(false);
    }
  };

  if (!config) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        Module not found
      </div>
    );
  }

  const visibleFields = config.fields.filter((f) => f.showInTable !== false).slice(0, 10);
  const hiddenFields = config.fields.filter((f) => f.showInTable === false || config.fields.indexOf(f) >= 10);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight">{config.label}</h2>
          <p className="text-sm text-muted-foreground">{config.description}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="tabular-nums">
            {data.length} records
          </Badge>
          <Button onClick={openCreate} size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" />
            Add Record
          </Button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <Card>
          <CardContent className="p-4 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </CardContent>
        </Card>
      ) : data.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <Database className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-1">No records yet</h3>
          <p className="text-sm text-muted-foreground mb-4 max-w-sm">
            Add your first {config.label.toLowerCase()} record to start tracking data.
          </p>
          <Button onClick={openCreate} size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" />
            Add Record
          </Button>
        </motion.div>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {visibleFields.map((f) => (
                    <TableHead key={f.key} className={f.tableWidth}>
                      {f.label}
                    </TableHead>
                  ))}
                  {hiddenFields.length > 0 && (
                    <TableHead className="w-10">More</TableHead>
                  )}
                  <TableHead className="w-24 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {data.map((record, idx) => (
                    <motion.tr
                      key={record.id as number}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.02, duration: 0.2 }}
                      className="border-b transition-colors hover:bg-muted/50"
                    >
                      {visibleFields.map((f) => (
                        <TableCell key={f.key} className="tabular-nums">
                          {f.type === "select" || f.type === "boolean" ? (
                            <Badge variant="outline" className="text-xs whitespace-nowrap">
                              {formatCellValue(record[f.key], f)}
                            </Badge>
                          ) : (
                            <span className="text-sm truncate block max-w-[200px]">
                              {formatCellValue(record[f.key], f)}
                            </span>
                          )}
                        </TableCell>
                      ))}
                      {hiddenFields.length > 0 && (
                        <TableCell>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="text-xs text-muted-foreground cursor-default">+{hiddenFields.length}</span>
                              </TooltipTrigger>
                              <TooltipContent side="left" className="max-w-xs">
                                <div className="space-y-1">
                                  {hiddenFields.map((f) => (
                                    <div key={f.key} className="flex justify-between gap-4 text-xs">
                                      <span className="text-muted-foreground">{f.label}:</span>
                                      <span className="font-medium tabular-nums">{formatCellValue(record[f.key], f)}</span>
                                    </div>
                                  ))}
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                      )}
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
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
                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
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
        </Card>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editId ? "Edit Record" : "Add Record"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
            {config.fields.map((field) => (
              <div
                key={field.key}
                className={field.type === "textarea" ? "sm:col-span-2" : ""}
              >
                <Label htmlFor={field.key} className="text-sm mb-1.5 block">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                {field.type === "select" && field.options && (
                  <Select
                    value={String(formData[field.key] ?? "")}
                    onValueChange={(v) =>
                      setFormData((p) => ({ ...p, [field.key]: v }))
                    }
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
                  <div className="flex items-center gap-2 h-9">
                    <Switch
                      id={field.key}
                      checked={!!formData[field.key]}
                      onCheckedChange={(v) =>
                        setFormData((p) => ({ ...p, [field.key]: v }))
                      }
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
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, [field.key]: e.target.value }))
                    }
                    rows={3}
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
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, [field.key]: e.target.value }))
                    }
                    className={field.width}
                  />
                )}
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={submitting} className="gap-1.5">
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {editId ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}