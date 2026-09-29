"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";

export function AttendanceCalculator() {
  const { toast } = useToast();
  const [totalClasses, setTotalClasses] = useState<string>("40");
  const [attendedClasses, setAttendedClasses] = useState<string>("32");
  const [targetPercentage, setTargetPercentage] = useState<string>("75");

  const total = parseInt(totalClasses, 10) || 0;
  const attended = parseInt(attendedClasses, 10) || 0;
  const target = parseFloat(targetPercentage) || 75;

  const isValid = total > 0 && attended >= 0 && attended <= total && target > 0 && target <= 100;

  const currentPercentage = total > 0 ? (attended / total) * 100 : 0;
  const formattedCurrent = currentPercentage.toFixed(1);

  // If attended is below target: classes needed to attend
  // (attended + x) / (total + x) >= target / 100
  // 100 * attended + 100 * x >= target * total + target * x
  // x * (100 - target) >= target * total - 100 * attended
  // x >= (target * total - 100 * attended) / (100 - target)
  let classesNeeded = 0;
  if (target < 100 && currentPercentage < target) {
    const raw = (target * total - 100 * attended) / (100 - target);
    classesNeeded = Math.max(0, Math.ceil(raw));
  } else if (target === 100 && currentPercentage < 100) {
    classesNeeded = -1; // impossible if already missed one
  }

  // If attended is above or equal target: classes can afford to miss
  // attended / (total + y) >= target / 100
  // 100 * attended >= target * total + target * y
  // y * target <= 100 * attended - target * total
  // y <= (100 * attended - target * total) / target
  let classesCanMiss = 0;
  if (currentPercentage >= target && target > 0) {
    const raw = (100 * attended - target * total) / target;
    classesCanMiss = Math.max(0, Math.floor(raw));
  }

  const handleReset = () => {
    setTotalClasses("40");
    setAttendedClasses("32");
    setTargetPercentage("75");
    toast("Reset to default values", "info");
  };

  const handleCopy = () => {
    const summary = `Flectool Attendance Report:
Current Attendance: ${formattedCurrent}% (${attended}/${total} classes)
Target Threshold: ${target}%
Status: ${
      currentPercentage >= target
        ? `On track! You can safely miss ${classesCanMiss} upcoming class${classesCanMiss === 1 ? "" : "es"}.`
        : `Behind goal. You must attend the next ${classesNeeded} consecutive class${classesNeeded === 1 ? "" : "es"}.`
    }`;
    navigator.clipboard.writeText(summary);
    toast("Attendance summary copied to clipboard!", "success");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Attendance Calculator — Flectool",
          text: `My current attendance is ${formattedCurrent}%. Calculate yours on Flectool!`,
          url: window.location.href,
        });
      } catch {
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Interactive Inputs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 rounded-2xl glass-card">
        <Input
          label="Total Classes Held"
          type="number"
          min="1"
          value={totalClasses}
          onChange={(e) => setTotalClasses(e.target.value)}
          placeholder="e.g. 40"
        />
        <Input
          label="Classes Attended"
          type="number"
          min="0"
          max={totalClasses}
          value={attendedClasses}
          onChange={(e) => setAttendedClasses(e.target.value)}
          placeholder="e.g. 32"
          error={attended > total ? "Attended cannot exceed total" : undefined}
        />
        <Input
          label="Target Attendance %"
          type="number"
          min="1"
          max="100"
          value={targetPercentage}
          onChange={(e) => setTargetPercentage(e.target.value)}
          placeholder="e.g. 75"
        />
      </div>

      {/* Target Presets Pills */}
      <div className="flex items-center gap-2 px-1">
        <span className="text-xs text-[var(--muted-foreground)] font-medium">Quick Target Presets:</span>
        {["70", "75", "80", "85", "90"].map((pct) => (
          <button
            key={pct}
            type="button"
            onClick={() => setTargetPercentage(pct)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              targetPercentage === pct
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
            }`}
          >
            {pct}%
          </button>
        ))}
      </div>

      {/* Live Results Display */}
      {isValid ? (
        <div className="p-6 rounded-2xl glass-card border border-indigo-500/20 space-y-6">
          {/* Top gauge summary */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <span className="text-xs uppercase font-bold tracking-wider text-[var(--muted-foreground)]">
                Current Attendance
              </span>
              <div className="text-4xl font-extrabold tracking-tight tabular-nums flex items-baseline gap-1 mt-0.5">
                <span
                  className={
                    currentPercentage >= target
                      ? "text-emerald-500"
                      : currentPercentage >= target - 5
                      ? "text-amber-500"
                      : "text-rose-500"
                  }
                >
                  {formattedCurrent}%
                </span>
                <span className="text-sm font-normal text-[var(--muted-foreground)]">
                  ({attended} of {total} classes)
                </span>
              </div>
            </div>

            <div className="text-right">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                  currentPercentage >= target
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                    : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30"
                }`}
              >
                {currentPercentage >= target ? "✓ Above Target" : "⚠ Below Target"}
              </span>
            </div>
          </div>

          {/* Progress Bar Gauge */}
          <div className="space-y-1.5">
            <div className="w-full h-3 rounded-full bg-[var(--muted)] overflow-hidden relative">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  currentPercentage >= target
                    ? "bg-emerald-500"
                    : currentPercentage >= target - 5
                    ? "bg-amber-500"
                    : "bg-rose-500"
                }`}
                style={{ width: `${Math.min(100, currentPercentage)}%` }}
              />
              {/* Target marker line */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-[var(--foreground)] z-10"
                style={{ left: `${target}%` }}
                title={`Target: ${target}%`}
              />
            </div>
            <div className="flex justify-between text-[11px] text-[var(--muted-foreground)] font-mono">
              <span>0%</span>
              <span className="text-[var(--primary)] font-semibold">Goal: {target}%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Actionable Strategy Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              className={`p-4 rounded-xl border ${
                classesCanMiss > 0
                  ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40"
                  : "bg-[var(--muted)] border-[var(--border)]"
              }`}
            >
              <div className="text-xs font-semibold text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] mb-1">
                Safe Bunk Allowance
              </div>
              <div className="text-2xl font-black text-[var(--foreground)] tabular-nums">
                {classesCanMiss}{" "}
                <span className="text-sm font-normal text-[var(--muted-foreground)]">
                  {classesCanMiss === 1 ? "class" : "classes"}
                </span>
              </div>
              <p className="text-xs text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] mt-1">
                {classesCanMiss > 0
                  ? `You can skip up to ${classesCanMiss} consecutive class${classesCanMiss === 1 ? "" : "es"} and still stay above ${target}%.`
                  : "You cannot miss any classes without dropping below your target percentage."}
              </p>
            </div>

            <div
              className={`p-4 rounded-xl border ${
                classesNeeded > 0
                  ? "bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800/40"
                  : "bg-[var(--muted)] border-[var(--border)]"
              }`}
            >
              <div className="text-xs font-semibold text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] mb-1">
                Classes Needed to Recover
              </div>
              <div className="text-2xl font-black text-[var(--foreground)] tabular-nums">
                {classesNeeded === -1 ? "N/A" : classesNeeded}{" "}
                <span className="text-sm font-normal text-[var(--muted-foreground)]">
                  {classesNeeded === 1 ? "class" : "classes"}
                </span>
              </div>
              <p className="text-xs text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] mt-1">
                {classesNeeded > 0
                  ? `You need to attend the next ${classesNeeded} consecutive class${classesNeeded === 1 ? "" : "es"} without absence to reach ${target}%.`
                  : "You have already met or exceeded your target threshold."}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-end gap-3 pt-3 border-t border-[var(--border)]">
            <Button variant="ghost" size="sm" onClick={handleReset}>
              Reset
            </Button>
            <Button variant="secondary" size="sm" onClick={handleShare}>
              Share
            </Button>
            <Button variant="primary" size="sm" onClick={handleCopy}>
              Copy Summary
            </Button>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center rounded-2xl glass-card text-[var(--muted-foreground)] space-y-2">
          <p className="text-sm font-medium">Please enter valid class numbers to calculate attendance.</p>
          <p className="text-xs text-[var(--muted-foreground)]">Ensure attended classes does not exceed total classes.</p>
        </div>
      )}
    </div>
  );
}
