"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";

type Mode = "between" | "addsubtract";

function daysBetween(a: Date, b: Date): number {
  const msPerDay = 86_400_000;
  return Math.round(Math.abs(b.getTime() - a.getTime()) / msPerDay);
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function businessDaysBetween(start: Date, end: Date): number {
  let count = 0;
  const d = new Date(start);
  while (d <= end) {
    const day = d.getDay();
    if (day !== 0 && day !== 6) count++;
    d.setDate(d.getDate() + 1);
  }
  return count;
}

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export function DateCalculator() {
  const { toast } = useToast();
  const [mode, setMode] = useState<Mode>("between");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [offsetDays, setOffsetDays] = useState("30");
  const [offsetDirection, setOffsetDirection] = useState<"add" | "subtract">("add");
  const [excludeWeekends, setExcludeWeekends] = useState(false);

  const handleCalculate = () => {
    if (mode === "between") {
      if (!startDate || !endDate) {
        toast("Please select both dates", "error");
        return;
      }
      const a = new Date(startDate);
      const b = new Date(endDate);
      const total = daysBetween(a, b);
      const weeks = Math.floor(total / 7);
      const remainingDays = total % 7;
      const business = businessDaysBetween(
        a < b ? a : b,
        a < b ? b : a
      );

      toast(
        `${total} days total (${weeks} weeks ${remainingDays} days)${excludeWeekends ? `, ${business} business days` : ""}`,
        "success"
      );
    } else {
      if (!startDate) {
        toast("Please select a start date", "error");
        return;
      }
      const days = parseInt(offsetDays) || 0;
      const actualDays = offsetDirection === "subtract" ? -days : days;
      const result = addDays(new Date(startDate), actualDays);
      toast(
        `${offsetDirection === "add" ? "Added" : "Subtracted"} ${days} days: ${formatDate(result)}`,
        "success"
      );
    }
  };

  const handleCopy = () => {
    let text = "";
    if (mode === "between" && startDate && endDate) {
      const a = new Date(startDate);
      const b = new Date(endDate);
      const total = daysBetween(a, b);
      text = `Days between ${formatDate(a)} and ${formatDate(b)}: ${total} days`;
    } else if (mode === "addsubtract" && startDate) {
      const days = parseInt(offsetDays) || 0;
      const actualDays = offsetDirection === "subtract" ? -days : days;
      const result = addDays(new Date(startDate), actualDays);
      text = `${offsetDirection === "add" ? "+" : "-"}${days} days from ${formatDate(new Date(startDate))} = ${formatDate(result)}`;
    }
    if (text) {
      navigator.clipboard.writeText(text);
      toast("Result copied to clipboard!", "success");
    }
  };

  // Compute live result
  let liveResult = "";
  if (mode === "between" && startDate && endDate) {
    const a = new Date(startDate);
    const b = new Date(endDate);
    const total = daysBetween(a, b);
    const weeks = Math.floor(total / 7);
    const remainingDays = total % 7;
    const business = businessDaysBetween(a < b ? a : b, a < b ? b : a);
    liveResult = `${total} days (${weeks}w ${remainingDays}d)${excludeWeekends ? ` — ${business} business days` : ""}`;
  } else if (mode === "addsubtract" && startDate) {
    const days = parseInt(offsetDays) || 0;
    const actualDays = offsetDirection === "subtract" ? -days : days;
    const result = addDays(new Date(startDate), actualDays);
    liveResult = formatDate(result);
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Mode tabs */}
      <div className="grid grid-cols-2 gap-1 bg-[var(--muted)] p-1.5 rounded-2xl">
        <button
          type="button"
          onClick={() => setMode("between")}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
            mode === "between"
              ? "bg-[var(--card)] text-[var(--primary)] shadow-xs"
              : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          }`}
        >
          Days Between Dates
        </button>
        <button
          type="button"
          onClick={() => setMode("addsubtract")}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
            mode === "addsubtract"
              ? "bg-[var(--card)] text-[var(--primary)] shadow-xs"
              : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          }`}
        >
          Add / Subtract Days
        </button>
      </div>

      {/* Between mode */}
      {mode === "between" && (
        <div className="p-6 rounded-2xl glass-card space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Input
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] cursor-pointer">
            <input
              type="checkbox"
              checked={excludeWeekends}
              onChange={(e) => setExcludeWeekends(e.target.checked)}
              className="rounded accent-indigo-600"
            />
            Exclude weekends (business days only)
          </label>
        </div>
      )}

      {/* Add/Subtract mode */}
      {mode === "addsubtract" && (
        <div className="p-6 rounded-2xl glass-card space-y-4">
          <Input
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--foreground)]">
                Direction
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setOffsetDirection("add")}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                    offsetDirection === "add"
                      ? "bg-indigo-600 text-white"
                      : "bg-[var(--muted)] text-[var(--muted-foreground)]"
                  }`}
                >
                  Add (+)
                </button>
                <button
                  type="button"
                  onClick={() => setOffsetDirection("subtract")}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                    offsetDirection === "subtract"
                      ? "bg-indigo-600 text-white"
                      : "bg-[var(--muted)] text-[var(--muted-foreground)]"
                  }`}
                >
                  Subtract (−)
                </button>
              </div>
            </div>
            <Input
              label="Number of Days"
              type="number"
              min="0"
              value={offsetDays}
              onChange={(e) => setOffsetDays(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Live result */}
      {liveResult && (
        <div className="p-5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-[var(--muted-foreground)]">
              Result
            </span>
            <div className="text-2xl font-extrabold text-[var(--primary)] mt-1 tabular-nums">
              {liveResult}
            </div>
          </div>
          <Button variant="primary" size="sm" onClick={handleCopy}>
            Copy Result
          </Button>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3">
        <Button variant="primary" size="md" className="flex-1" onClick={handleCalculate}>
          Calculate
        </Button>
        <Button
          variant="ghost"
          size="md"
          onClick={() => {
            setStartDate("");
            setEndDate("");
            setOffsetDays("30");
            setExcludeWeekends(false);
            toast("Reset all values", "info");
          }}
        >
          Reset
        </Button>
      </div>
    </div>
  );
}
