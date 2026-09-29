"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";

interface CourseRow {
  id: string;
  name: string;
  credits: number;
  gradePoint: number;
}

export function CgpaCalculator() {
  const { toast } = useToast();
  const [scale, setScale] = useState<"10" | "4">("10");
  const [courses, setCourses] = useState<CourseRow[]>([
    { id: "1", name: "Data Structures", credits: 4, gradePoint: 9 },
    { id: "2", name: "Computer Networks", credits: 3, gradePoint: 8 },
    { id: "3", name: "Operating Systems", credits: 4, gradePoint: 10 },
    { id: "4", name: "Database Management", credits: 3, gradePoint: 9 },
    { id: "5", name: "Mathematics III", credits: 4, gradePoint: 8 },
  ]);

  const addCourse = () => {
    const newId = (courses.length + 1).toString();
    setCourses([...courses, { id: newId, name: `Course ${newId}`, credits: 3, gradePoint: scale === "10" ? 8 : 3.0 }]);
  };

  const removeCourse = (id: string) => {
    if (courses.length <= 1) {
      toast("You must have at least one course", "error");
      return;
    }
    setCourses(courses.filter((c) => c.id !== id));
  };

  const updateCourse = (id: string, field: keyof CourseRow, value: string | number) => {
    setCourses(
      courses.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  // Calculations
  const totalCredits = courses.reduce((acc, c) => acc + (Number(c.credits) || 0), 0);
  const totalWeightedPoints = courses.reduce(
    (acc, c) => acc + (Number(c.credits) || 0) * (Number(c.gradePoint) || 0),
    0
  );
  const cgpa = totalCredits > 0 ? totalWeightedPoints / totalCredits : 0;
  const percentage = scale === "10" ? (cgpa * 9.5).toFixed(1) : ((cgpa / 4.0) * 100).toFixed(1);

  const handleReset = () => {
    setCourses([
      { id: "1", name: "Course 1", credits: 4, gradePoint: scale === "10" ? 9 : 3.5 },
      { id: "2", name: "Course 2", credits: 3, gradePoint: scale === "10" ? 8 : 3.0 },
      { id: "3", name: "Course 3", credits: 4, gradePoint: scale === "10" ? 10 : 4.0 },
    ]);
    toast("Reset course list", "info");
  };

  const handleCopy = () => {
    const text = `Flectool CGPA Report:
Overall CGPA: ${cgpa.toFixed(2)} / ${scale}.0
Equivalent Percentage: ${percentage}%
Total Credits: ${totalCredits}
Courses Tracked: ${courses.length}`;
    navigator.clipboard.writeText(text);
    toast("CGPA report copied to clipboard!", "success");
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Header Controls: Scale Toggle & Add Course */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl glass-card">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[var(--muted-foreground)]">Grading System:</span>
          <div className="flex bg-[var(--muted)] p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setScale("10")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                scale === "10"
                  ? "bg-[var(--card)] text-[var(--primary)] shadow-xs"
                  : "text-[var(--muted-foreground)]"
              }`}
            >
              10.0 Scale
            </button>
            <button
              type="button"
              onClick={() => setScale("4")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                scale === "4"
                  ? "bg-[var(--card)] text-[var(--primary)] shadow-xs"
                  : "text-[var(--muted-foreground)]"
              }`}
            >
              4.0 Scale
            </button>
          </div>
        </div>

        <Button variant="secondary" size="sm" onClick={addCourse}>
          + Add Subject / Course
        </Button>
      </div>

      {/* Courses List Table */}
      <div className="rounded-2xl glass-card overflow-hidden">
        <div className="p-4 bg-[var(--muted)] border-b border-[var(--border)] grid grid-cols-12 gap-3 text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-wider">
          <div className="col-span-6 sm:col-span-6">Subject / Course Name</div>
          <div className="col-span-3 sm:col-span-3">Credits</div>
          <div className="col-span-2 sm:col-span-2">Grade ({scale}.0)</div>
          <div className="col-span-1 text-right">Del</div>
        </div>

        <div className="divide-y divide-[var(--border)] p-2 space-y-1">
          {courses.map((course, index) => (
            <div key={course.id} className="grid grid-cols-12 gap-3 items-center p-2 rounded-xl hover:bg-[var(--muted)] transition-colors">
              <div className="col-span-6 sm:col-span-6">
                <input
                  type="text"
                  value={course.name}
                  onChange={(e) => updateCourse(course.id, "name", e.target.value)}
                  placeholder={`Subject ${index + 1}`}
                  className="w-full text-xs font-medium bg-transparent border-b border-[var(--border)] focus:border-indigo-500 py-1 outline-none"
                />
              </div>

              <div className="col-span-3 sm:col-span-3">
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={course.credits}
                  onChange={(e) => updateCourse(course.id, "credits", parseFloat(e.target.value) || 0)}
                  className="w-full text-xs font-semibold bg-[var(--card)] border border-[var(--border)] rounded-lg px-2.5 py-1 outline-none focus:border-indigo-500"
                />
              </div>

              <div className="col-span-2 sm:col-span-2">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max={scale}
                  value={course.gradePoint}
                  onChange={(e) => updateCourse(course.id, "gradePoint", parseFloat(e.target.value) || 0)}
                  className="w-full text-xs font-semibold bg-[var(--card)] border border-[var(--border)] rounded-lg px-2.5 py-1 outline-none focus:border-indigo-500"
                />
              </div>

              <div className="col-span-1 text-right">
                <button
                  type="button"
                  onClick={() => removeCourse(course.id)}
                  className="text-[var(--muted-foreground)] hover:text-rose-500 transition-colors p-1"
                  aria-label="Remove course"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CGPA Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl glass-card text-center sm:text-left border border-indigo-500/20">
          <span className="text-xs uppercase font-bold tracking-wider text-[var(--muted-foreground)]">
            Cumulative CGPA
          </span>
          <div className="text-3xl font-extrabold text-[var(--primary)] mt-1 tabular-nums">
            {cgpa.toFixed(2)}
            <span className="text-sm font-normal text-[var(--muted-foreground)]"> / {scale}.0</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-card text-center sm:text-left">
          <span className="text-xs uppercase font-bold tracking-wider text-[var(--muted-foreground)]">
            Equivalent Percentage
          </span>
          <div className="text-3xl font-extrabold text-[var(--foreground)] mt-1 tabular-nums">
            {percentage}%
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-card text-center sm:text-left">
          <span className="text-xs uppercase font-bold tracking-wider text-[var(--muted-foreground)]">
            Total Earned Credits
          </span>
          <div className="text-3xl font-extrabold text-[var(--foreground)] mt-1 tabular-nums">
            {totalCredits}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-2">
        <Button variant="ghost" size="sm" onClick={handleReset}>
          Reset
        </Button>
        <div className="flex gap-2">
          <Button variant="primary" size="sm" onClick={handleCopy}>
            Copy CGPA Summary
          </Button>
        </div>
      </div>
    </div>
  );
}
