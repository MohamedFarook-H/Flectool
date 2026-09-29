"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";

export function AgeCalculator() {
  const { toast } = useToast();
  const todayStr = new Date().toISOString().split("T")[0];

  const [dob, setDob] = useState<string>("2000-05-15");
  const [targetDate, setTargetDate] = useState<string>(todayStr);

  const birth = new Date(dob);
  const target = new Date(targetDate);
  const isValid = !isNaN(birth.getTime()) && !isNaN(target.getTime()) && target >= birth;

  let years = 0;
  let months = 0;
  let days = 0;
  let totalDays = 0;
  let nextBirthdayDays = 0;
  let nextBirthdayWeekday = "";

  if (isValid) {
    const diffTime = target.getTime() - birth.getTime();
    totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    let y = target.getFullYear() - birth.getFullYear();
    let m = target.getMonth() - birth.getMonth();
    let d = target.getDate() - birth.getDate();

    if (d < 0) {
      m -= 1;
      const prevMonthLastDay = new Date(target.getFullYear(), target.getMonth(), 0).getDate();
      d += prevMonthLastDay;
    }
    if (m < 0) {
      y -= 1;
      m += 12;
    }

    years = y;
    months = m;
    days = d;

    // Next birthday calculation
    let nextBday = new Date(target.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBday < target) {
      nextBday = new Date(target.getFullYear() + 1, birth.getMonth(), birth.getDate());
    }
    const nextDiffTime = nextBday.getTime() - target.getTime();
    nextBirthdayDays = Math.ceil(nextDiffTime / (1000 * 60 * 60 * 24));
    nextBirthdayWeekday = nextBday.toLocaleDateString("en-US", { weekday: "long" });
  }

  const handleCopy = () => {
    const text = `Flectool Age Report:
Exact Age: ${years} years, ${months} months, and ${days} days
Total Days Lived: ${totalDays.toLocaleString()} days
Next Birthday: In ${nextBirthdayDays} days (on a ${nextBirthdayWeekday})`;
    navigator.clipboard.writeText(text);
    toast("Age summary copied to clipboard!", "success");
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Date Pickers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6 rounded-2xl glass-card">
        <Input
          label="Date of Birth"
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
        />
        <Input
          label="Age as of Date"
          type="date"
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
        />
      </div>

      {isValid ? (
        <div className="space-y-6">
          {/* Main Age Card */}
          <div className="p-6 rounded-2xl glass-card border border-indigo-500/20 text-center sm:text-left space-y-4">
            <span className="text-xs uppercase font-bold tracking-wider text-[var(--muted-foreground)]">
              Chronological Age
            </span>
            <div className="flex flex-wrap items-baseline justify-center sm:justify-start gap-4">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl sm:text-5xl font-extrabold text-[var(--primary)] tabular-nums">
                  {years}
                </span>
                <span className="text-xs font-semibold text-[var(--muted-foreground)] uppercase">Years</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl sm:text-5xl font-extrabold text-[var(--foreground)] tabular-nums">
                  {months}
                </span>
                <span className="text-xs font-semibold text-[var(--muted-foreground)] uppercase">Months</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl sm:text-5xl font-extrabold text-[var(--foreground)] tabular-nums">
                  {days}
                </span>
                <span className="text-xs font-semibold text-[var(--muted-foreground)] uppercase">Days</span>
              </div>
            </div>
          </div>

          {/* Secondary Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Next Birthday */}
            <div className="p-5 rounded-2xl glass-card space-y-1">
              <span className="text-xs font-semibold text-[var(--muted-foreground)]">Upcoming Birthday</span>
              <div className="text-2xl font-black text-[var(--foreground)] tabular-nums">
                {nextBirthdayDays === 0 ? "🎉 Today is your Birthday!" : `${nextBirthdayDays} days away`}
              </div>
              <p className="text-xs text-[var(--muted-foreground)]">
                Falls on a <span className="font-semibold text-[var(--primary)]">{nextBirthdayWeekday}</span>
              </p>
            </div>

            {/* Total Days */}
            <div className="p-5 rounded-2xl glass-card space-y-1">
              <span className="text-xs font-semibold text-[var(--muted-foreground)]">Total Lifetime Days</span>
              <div className="text-2xl font-black text-[var(--foreground)] tabular-nums">
                {totalDays.toLocaleString()}
                <span className="text-xs font-normal text-[var(--muted-foreground)] ml-1.5">days</span>
              </div>
              <p className="text-xs text-[var(--muted-foreground)]">
                ≈ {Math.floor(totalDays / 7).toLocaleString()} weeks or {(totalDays * 24).toLocaleString()} hours
              </p>
            </div>
          </div>

          {/* Action row */}
          <div className="flex justify-end pt-2">
            <Button variant="primary" size="sm" onClick={handleCopy}>
              Copy Age Report
            </Button>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center rounded-2xl glass-card text-[var(--muted-foreground)]">
          <p className="text-sm font-medium">Please enter a valid Date of Birth before the target date.</p>
        </div>
      )}
    </div>
  );
}
