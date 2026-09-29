"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

interface SubjectRow {
  id: string;
  name: string;
  obtained: number;
  maximum: number;
}

export function MarksCalculator() {
  const { toast } = useToast();
  const [subjects, setSubjects] = useState<SubjectRow[]>([
    { id: "1", name: "Mathematics", obtained: 92, maximum: 100 },
    { id: "2", name: "Physics", obtained: 85, maximum: 100 },
    { id: "3", name: "Chemistry", obtained: 78, maximum: 100 },
    { id: "4", name: "Computer Science", obtained: 95, maximum: 100 },
    { id: "5", name: "English", obtained: 88, maximum: 100 },
  ]);

  const addSubject = () => {
    const id = (subjects.length + 1).toString();
    setSubjects([...subjects, { id, name: `Subject ${id}`, obtained: 75, maximum: 100 }]);
  };

  const removeSubject = (id: string) => {
    if (subjects.length <= 1) {
      toast("Must have at least one subject", "error");
      return;
    }
    setSubjects(subjects.filter((s) => s.id !== id));
  };

  const updateSubject = (id: string, field: keyof SubjectRow, value: string | number) => {
    setSubjects(
      subjects.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  // Calculations
  const totalObtained = subjects.reduce((acc, s) => acc + (Number(s.obtained) || 0), 0);
  const totalMax = subjects.reduce((acc, s) => acc + (Number(s.maximum) || 0), 0);
  const aggregatePct = totalMax > 0 ? (totalObtained / totalMax) * 100 : 0;

  // Academic Division
  let division = "Fail";
  let divisionColor = "text-rose-500";
  if (aggregatePct >= 75) {
    division = "Distinction (First Class with Distinction)";
    divisionColor = "text-emerald-500";
  } else if (aggregatePct >= 60) {
    division = "First Division";
    divisionColor = "text-[var(--primary)]";
  } else if (aggregatePct >= 50) {
    division = "Second Division";
    divisionColor = "text-amber-500";
  } else if (aggregatePct >= 40) {
    division = "Third Division";
    divisionColor = "text-yellow-500";
  }

  const handleReset = () => {
    setSubjects([
      { id: "1", name: "Subject 1", obtained: 80, maximum: 100 },
      { id: "2", name: "Subject 2", obtained: 85, maximum: 100 },
      { id: "3", name: "Subject 3", obtained: 90, maximum: 100 },
    ]);
    toast("Reset marks list", "info");
  };

  const handleCopy = () => {
    const text = `Flectool Marks Breakdown:
Total Score: ${totalObtained} / ${totalMax}
Percentage: ${aggregatePct.toFixed(2)}%
Academic Division: ${division}
Subjects: ${subjects.length}`;
    navigator.clipboard.writeText(text);
    toast("Marks report copied to clipboard!", "success");
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Top action bar */}
      <div className="flex items-center justify-between p-4 rounded-2xl glass-card">
        <span className="text-xs font-semibold text-[var(--muted-foreground)]">
          Subjects Tracked: {subjects.length}
        </span>
        <Button variant="secondary" size="sm" onClick={addSubject}>
          + Add Subject
        </Button>
      </div>

      {/* Subjects Table */}
      <div className="rounded-2xl glass-card overflow-hidden">
        <div className="p-4 bg-[var(--muted)] border-b border-[var(--border)] grid grid-cols-12 gap-3 text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-wider">
          <div className="col-span-5">Subject Name</div>
          <div className="col-span-3">Marks Obtained</div>
          <div className="col-span-3">Maximum Marks</div>
          <div className="col-span-1 text-right">Del</div>
        </div>

        <div className="divide-y divide-[var(--border)] p-2 space-y-1">
          {subjects.map((sub, idx) => (
            <div key={sub.id} className="grid grid-cols-12 gap-3 items-center p-2 rounded-xl hover:bg-[var(--muted)] transition-colors">
              <div className="col-span-5">
                <input
                  type="text"
                  value={sub.name}
                  onChange={(e) => updateSubject(sub.id, "name", e.target.value)}
                  placeholder={`Subject ${idx + 1}`}
                  className="w-full text-xs font-medium bg-transparent border-b border-[var(--border)] focus:border-indigo-500 py-1 outline-none"
                />
              </div>

              <div className="col-span-3">
                <input
                  type="number"
                  min="0"
                  max={sub.maximum}
                  value={sub.obtained}
                  onChange={(e) => updateSubject(sub.id, "obtained", parseFloat(e.target.value) || 0)}
                  className="w-full text-xs font-semibold bg-[var(--card)] border border-[var(--border)] rounded-lg px-2.5 py-1 outline-none focus:border-indigo-500"
                />
              </div>

              <div className="col-span-3">
                <input
                  type="number"
                  min="1"
                  value={sub.maximum}
                  onChange={(e) => updateSubject(sub.id, "maximum", parseFloat(e.target.value) || 0)}
                  className="w-full text-xs font-semibold bg-[var(--card)] border border-[var(--border)] rounded-lg px-2.5 py-1 outline-none focus:border-indigo-500"
                />
              </div>

              <div className="col-span-1 text-right">
                <button
                  type="button"
                  onClick={() => removeSubject(sub.id)}
                  className="text-[var(--muted-foreground)] hover:text-rose-500 transition-colors p-1"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Aggregate Report Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl glass-card text-center sm:text-left border border-indigo-500/20">
          <span className="text-xs uppercase font-bold tracking-wider text-[var(--muted-foreground)]">
            Aggregate Percentage
          </span>
          <div className="text-3xl font-extrabold text-[var(--primary)] mt-1 tabular-nums">
            {aggregatePct.toFixed(2)}%
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-card text-center sm:text-left">
          <span className="text-xs uppercase font-bold tracking-wider text-[var(--muted-foreground)]">
            Total Score
          </span>
          <div className="text-3xl font-extrabold text-[var(--foreground)] mt-1 tabular-nums">
            {totalObtained}
            <span className="text-sm font-normal text-[var(--muted-foreground)]"> / {totalMax}</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-card text-center sm:text-left">
          <span className="text-xs uppercase font-bold tracking-wider text-[var(--muted-foreground)]">
            Result Standing
          </span>
          <div className={`text-base font-bold mt-2 ${divisionColor} line-clamp-1`}>
            {division}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <Button variant="ghost" size="sm" onClick={handleReset}>
          Reset
        </Button>
        <Button variant="primary" size="sm" onClick={handleCopy}>
          Copy Marks Breakdown
        </Button>
      </div>
    </div>
  );
}
