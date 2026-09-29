"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";

export function SipCalculator() {
  const { toast } = useToast();
  const [monthlyInvestment, setMonthlyInvestment] = useState<string>("5000");
  const [returnRate, setReturnRate] = useState<string>("12");
  const [years, setYears] = useState<string>("10");

  const P = parseFloat(monthlyInvestment) || 0;
  const annualReturn = parseFloat(returnRate) || 0;
  const nYears = parseFloat(years) || 0;

  const totalMonths = nYears * 12;
  const i = annualReturn / (12 * 100);

  // M = P × ({[1 + i]^n - 1} / i) × (1 + i)
  let maturityValue = 0;
  let investedAmount = 0;
  let estimatedReturns = 0;

  if (P > 0 && totalMonths > 0) {
    investedAmount = P * totalMonths;
    if (i > 0) {
      maturityValue = P * ((Math.pow(1 + i, totalMonths) - 1) / i) * (1 + i);
      estimatedReturns = maturityValue - investedAmount;
    } else {
      maturityValue = investedAmount;
      estimatedReturns = 0;
    }
  }

  const investedRatio = maturityValue > 0 ? (investedAmount / maturityValue) * 100 : 50;
  const returnsRatio = maturityValue > 0 ? (estimatedReturns / maturityValue) * 100 : 50;

  const handleCopy = () => {
    const text = `Flectool SIP Wealth Report:
Monthly Contribution: ${P.toLocaleString()}
Expected Annual Rate: ${annualReturn}%
Time Horizon: ${nYears} Years
Total Capital Invested: ${Math.round(investedAmount).toLocaleString()}
Estimated Wealth Gains: ${Math.round(estimatedReturns).toLocaleString()}
Total Corpus Value: ${Math.round(maturityValue).toLocaleString()}`;
    navigator.clipboard.writeText(text);
    toast("SIP calculation copied to clipboard!", "success");
  };

  const handleReset = () => {
    setMonthlyInvestment("5000");
    setReturnRate("12");
    setYears("10");
    toast("Reset SIP calculator", "info");
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Inputs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 rounded-2xl glass-card">
        <Input
          label="Monthly Investment"
          type="number"
          min="100"
          value={monthlyInvestment}
          onChange={(e) => setMonthlyInvestment(e.target.value)}
          placeholder="e.g. 5000"
        />
        <Input
          label="Expected Annual Return (%)"
          type="number"
          step="0.5"
          min="1"
          max="35"
          value={returnRate}
          onChange={(e) => setReturnRate(e.target.value)}
          placeholder="e.g. 12"
        />
        <Input
          label="Time Period (Years)"
          type="number"
          min="1"
          max="40"
          value={years}
          onChange={(e) => setYears(e.target.value)}
          placeholder="e.g. 10"
        />
      </div>

      {/* Quick Tenure Presets */}
      <div className="flex items-center gap-2 px-1">
        <span className="text-xs text-[var(--muted-foreground)] font-medium">Time Horizon:</span>
        {["3", "5", "10", "15", "20"].map((y) => (
          <button
            key={y}
            type="button"
            onClick={() => setYears(y)}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              years === y
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
            }`}
          >
            {y} Years
          </button>
        ))}
      </div>

      {/* Output Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl glass-card border border-indigo-500/20">
        <div className="space-y-4">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-[var(--muted-foreground)]">
              Total Maturity Corpus
            </span>
            <div className="text-4xl font-extrabold text-[var(--primary)] mt-1 tabular-nums">
              {Math.round(maturityValue).toLocaleString()}
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-[var(--border)] text-xs">
            <div className="flex justify-between py-1">
              <span className="text-[var(--muted-foreground)]">Invested Capital:</span>
              <span className="font-bold tabular-nums text-[var(--foreground)]">
                {Math.round(investedAmount).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[var(--muted-foreground)]">Estimated Returns:</span>
              <span className="font-bold tabular-nums text-emerald-500">
                +{Math.round(estimatedReturns).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Visual Chart */}
        <div className="flex flex-col justify-center space-y-3 p-4 rounded-xl bg-[var(--muted)]">
          <span className="text-xs font-semibold text-[var(--muted-foreground)]">Wealth Composition</span>
          <div className="w-full h-4 rounded-full bg-[var(--muted)] overflow-hidden flex">
            <div
              className="bg-[var(--muted-foreground)] h-full transition-all duration-300"
              style={{ width: `${investedRatio}%` }}
              title={`Invested: ${investedRatio.toFixed(1)}%`}
            />
            <div
              className="bg-emerald-500 h-full transition-all duration-300"
              style={{ width: `${returnsRatio}%` }}
              title={`Returns: ${returnsRatio.toFixed(1)}%`}
            />
          </div>

          <div className="flex justify-between text-xs font-medium">
            <span className="flex items-center gap-1.5 text-[var(--muted-foreground)]">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--muted-foreground)]" />
              Principal ({investedRatio.toFixed(1)}%)
            </span>
            <span className="flex items-center gap-1.5 text-emerald-500">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              Gains ({returnsRatio.toFixed(1)}%)
            </span>
          </div>

          <p className="text-[11px] text-[var(--muted-foreground)] pt-1">
            *Projections are educational mathematical estimates of compound interest. Actual market returns vary.
          </p>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-2">
        <Button variant="ghost" size="sm" onClick={handleReset}>
          Reset
        </Button>
        <Button variant="primary" size="sm" onClick={handleCopy}>
          Copy SIP Report
        </Button>
      </div>
    </div>
  );
}
