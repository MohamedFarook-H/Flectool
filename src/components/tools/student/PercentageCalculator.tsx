"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";

type Mode = "marks" | "valueOf" | "change" | "difference";

export function PercentageCalculator() {
  const { toast } = useToast();
  const [mode, setMode] = useState<Mode>("marks");

  // Mode 1: Marks %
  const [marksObtained, setMarksObtained] = useState<string>("425");
  const [marksTotal, setMarksTotal] = useState<string>("500");

  // Mode 2: Value of %
  const [percentValue, setPercentValue] = useState<string>("15");
  const [totalNumber, setTotalNumber] = useState<string>("1200");

  // Mode 3: Percentage Change
  const [initialValue, setInitialValue] = useState<string>("80");
  const [finalValue, setFinalValue] = useState<string>("100");

  // Calculations
  const calcMarks = () => {
    const ob = parseFloat(marksObtained) || 0;
    const tot = parseFloat(marksTotal) || 0;
    if (tot === 0) return { pct: 0, valid: false };
    return { pct: (ob / tot) * 100, valid: true };
  };

  const calcValueOf = () => {
    const p = parseFloat(percentValue) || 0;
    const tot = parseFloat(totalNumber) || 0;
    return { result: (p / 100) * tot };
  };

  const calcChange = () => {
    const init = parseFloat(initialValue) || 0;
    const fin = parseFloat(finalValue) || 0;
    if (init === 0) return { changePct: 0, isIncrease: true, valid: false };
    const diff = fin - init;
    const pct = (diff / Math.abs(init)) * 100;
    return { changePct: Math.abs(pct), isIncrease: diff >= 0, valid: true };
  };

  const marksResult = calcMarks();
  const valueOfResult = calcValueOf();
  const changeResult = calcChange();

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast("Calculation copied to clipboard!", "success");
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Mode Navigation Tabs */}
      <div className="grid grid-cols-3 gap-1 bg-[var(--muted)] p-1.5 rounded-2xl">
        <button
          type="button"
          onClick={() => setMode("marks")}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
            mode === "marks"
              ? "bg-[var(--card)] text-[var(--primary)] shadow-xs"
              : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          }`}
        >
          Exam Marks %
        </button>
        <button
          type="button"
          onClick={() => setMode("valueOf")}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
            mode === "valueOf"
              ? "bg-[var(--card)] text-[var(--primary)] shadow-xs"
              : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          }`}
        >
          What is X% of Y?
        </button>
        <button
          type="button"
          onClick={() => setMode("change")}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
            mode === "change"
              ? "bg-[var(--card)] text-[var(--primary)] shadow-xs"
              : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          }`}
        >
          % Change (Increase / Drop)
        </button>
      </div>

      {/* Tab 1: Marks % */}
      {mode === "marks" && (
        <div className="p-6 rounded-2xl glass-card space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Marks Obtained"
              type="number"
              value={marksObtained}
              onChange={(e) => setMarksObtained(e.target.value)}
              placeholder="e.g. 425"
            />
            <Input
              label="Total Maximum Marks"
              type="number"
              value={marksTotal}
              onChange={(e) => setMarksTotal(e.target.value)}
              placeholder="e.g. 500"
            />
          </div>

          <div className="p-5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-[var(--muted-foreground)]">
                Calculated Percentage
              </span>
              <div className="text-4xl font-extrabold text-[var(--primary)] mt-1 tabular-nums">
                {marksResult.valid ? `${marksResult.pct.toFixed(2)}%` : "0.00%"}
              </div>
              <p className="text-xs text-[var(--muted-foreground)] mt-1">
                Formula: ({marksObtained} / {marksTotal}) × 100
              </p>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() => handleCopy(`${marksObtained}/${marksTotal} = ${marksResult.pct.toFixed(2)}%`)}
            >
              Copy Result
            </Button>
          </div>
        </div>
      )}

      {/* Tab 2: What is X% of Y? */}
      {mode === "valueOf" && (
        <div className="p-6 rounded-2xl glass-card space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Percentage (%)"
              type="number"
              value={percentValue}
              onChange={(e) => setPercentValue(e.target.value)}
              placeholder="e.g. 15"
            />
            <Input
              label="Total Value / Number"
              type="number"
              value={totalNumber}
              onChange={(e) => setTotalNumber(e.target.value)}
              placeholder="e.g. 1200"
            />
          </div>

          <div className="p-5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-[var(--muted-foreground)]">
                Result
              </span>
              <div className="text-4xl font-extrabold text-[var(--primary)] mt-1 tabular-nums">
                {valueOfResult.result.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-[var(--muted-foreground)] mt-1">
                {percentValue}% of {totalNumber} = {valueOfResult.result.toFixed(2)}
              </p>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() => handleCopy(`${percentValue}% of ${totalNumber} is ${valueOfResult.result}`)}
            >
              Copy Result
            </Button>
          </div>
        </div>
      )}

      {/* Tab 3: % Increase or Decrease */}
      {mode === "change" && (
        <div className="p-6 rounded-2xl glass-card space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Initial / Old Value"
              type="number"
              value={initialValue}
              onChange={(e) => setInitialValue(e.target.value)}
              placeholder="e.g. 80"
            />
            <Input
              label="Final / New Value"
              type="number"
              value={finalValue}
              onChange={(e) => setFinalValue(e.target.value)}
              placeholder="e.g. 100"
            />
          </div>

          <div className="p-5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-[var(--muted-foreground)]">
                Percentage Change
              </span>
              <div className="text-4xl font-extrabold mt-1 tabular-nums flex items-baseline gap-2">
                <span className={changeResult.isIncrease ? "text-emerald-500" : "text-rose-500"}>
                  {changeResult.isIncrease ? "+" : "-"}{changeResult.changePct.toFixed(2)}%
                </span>
                <span className="text-xs font-semibold uppercase text-[var(--muted-foreground)]">
                  {changeResult.isIncrease ? "Increase" : "Decrease"}
                </span>
              </div>
              <p className="text-xs text-[var(--muted-foreground)] mt-1">
                Difference: {Math.abs(parseFloat(finalValue) - parseFloat(initialValue)).toFixed(2)}
              </p>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() =>
                handleCopy(
                  `From ${initialValue} to ${finalValue} is a ${changeResult.changePct.toFixed(2)}% ${
                    changeResult.isIncrease ? "increase" : "decrease"
                  }`
                )
              }
            >
              Copy Result
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
