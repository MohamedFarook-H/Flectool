"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";

export function EmiCalculator() {
  const { toast } = useToast();
  const [loanAmount, setLoanAmount] = useState<string>("500000");
  const [interestRate, setInterestRate] = useState<string>("8.5");
  const [tenure, setTenure] = useState<string>("5");
  const [tenureType, setTenureType] = useState<"years" | "months">("years");

  const P = parseFloat(loanAmount) || 0;
  const annualRate = parseFloat(interestRate) || 0;
  const rawTenure = parseFloat(tenure) || 0;
  const N = tenureType === "years" ? rawTenure * 12 : rawTenure;

  // Monthly interest rate
  const R = annualRate / (12 * 100);

  // EMI = [P x R x (1+R)^N]/[(1+R)^N-1]
  let emi = 0;
  let totalPayment = 0;
  let totalInterest = 0;

  if (P > 0 && R > 0 && N > 0) {
    const factor = Math.pow(1 + R, N);
    emi = (P * R * factor) / (factor - 1);
    totalPayment = emi * N;
    totalInterest = totalPayment - P;
  } else if (P > 0 && R === 0 && N > 0) {
    emi = P / N;
    totalPayment = P;
    totalInterest = 0;
  }

  const principalRatio = totalPayment > 0 ? (P / totalPayment) * 100 : 50;
  const interestRatio = totalPayment > 0 ? (totalInterest / totalPayment) * 100 : 50;

  const handleCopy = () => {
    const summary = `Flectool Loan EMI Report:
Principal Loan: ${P.toLocaleString()}
Annual Interest: ${annualRate}%
Tenure: ${tenure} ${tenureType}
Monthly EMI: ${Math.round(emi).toLocaleString()}
Total Interest: ${Math.round(totalInterest).toLocaleString()}
Total Repayment: ${Math.round(totalPayment).toLocaleString()}`;
    navigator.clipboard.writeText(summary);
    toast("EMI calculation copied to clipboard!", "success");
  };

  const handleReset = () => {
    setLoanAmount("500000");
    setInterestRate("8.5");
    setTenure("5");
    setTenureType("years");
    toast("Reset EMI calculator values", "info");
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Inputs & Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 rounded-2xl glass-card">
        <Input
          label="Loan Amount"
          type="number"
          min="1000"
          value={loanAmount}
          onChange={(e) => setLoanAmount(e.target.value)}
          placeholder="e.g. 500000"
        />
        <Input
          label="Interest Rate (% p.a.)"
          type="number"
          step="0.1"
          min="0.1"
          max="50"
          value={interestRate}
          onChange={(e) => setInterestRate(e.target.value)}
          placeholder="e.g. 8.5"
        />
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold text-[var(--foreground)]">
              Loan Tenure
            </label>
            <div className="flex bg-[var(--muted)] p-0.5 rounded-lg text-[10px] font-bold">
              <button
                type="button"
                onClick={() => setTenureType("years")}
                className={`px-2 py-0.5 rounded-md ${
                  tenureType === "years" ? "bg-[var(--card)] text-[var(--primary)]" : "text-[var(--muted-foreground)]"
                }`}
              >
                Yr
              </button>
              <button
                type="button"
                onClick={() => setTenureType("months")}
                className={`px-2 py-0.5 rounded-md ${
                  tenureType === "months" ? "bg-[var(--card)] text-[var(--primary)]" : "text-[var(--muted-foreground)]"
                }`}
              >
                Mo
              </button>
            </div>
          </div>
          <input
            type="number"
            min="1"
            max={tenureType === "years" ? "40" : "480"}
            value={tenure}
            onChange={(e) => setTenure(e.target.value)}
            placeholder={tenureType === "years" ? "5" : "60"}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] p-2.5 text-sm outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Quick Loan Presets */}
      <div className="flex flex-wrap items-center gap-2 px-1">
        <span className="text-xs text-[var(--muted-foreground)] font-medium">Common Types:</span>
        <button
          type="button"
          onClick={() => { setLoanAmount("3000000"); setInterestRate("8.5"); setTenure("20"); setTenureType("years"); }}
          className="px-2.5 py-1 rounded-lg text-xs bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--muted)] font-semibold"
        >
          Home Loan (20Y @ 8.5%)
        </button>
        <button
          type="button"
          onClick={() => { setLoanAmount("800000"); setInterestRate("9.0"); setTenure("5"); setTenureType("years"); }}
          className="px-2.5 py-1 rounded-lg text-xs bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--muted)] font-semibold"
        >
          Car Loan (5Y @ 9.0%)
        </button>
        <button
          type="button"
          onClick={() => { setLoanAmount("200000"); setInterestRate("12.5"); setTenure("3"); setTenureType("years"); }}
          className="px-2.5 py-1 rounded-lg text-xs bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--muted)] font-semibold"
        >
          Personal Loan (3Y @ 12.5%)
        </button>
      </div>

      {/* Calculation Output Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl glass-card border border-indigo-500/20">
        {/* Left: Summary Metrics */}
        <div className="space-y-4">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-[var(--muted-foreground)]">
              Monthly EMI Repayment
            </span>
            <div className="text-4xl font-extrabold text-[var(--primary)] mt-1 tabular-nums">
              {Math.round(emi).toLocaleString()}
              <span className="text-xs font-normal text-[var(--muted-foreground)] ml-1.5">/ month</span>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-[var(--border)] text-xs">
            <div className="flex justify-between py-1">
              <span className="text-[var(--muted-foreground)]">Principal Amount:</span>
              <span className="font-bold tabular-nums text-[var(--foreground)]">
                {P.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[var(--muted-foreground)]">Total Interest Payable:</span>
              <span className="font-bold tabular-nums text-rose-500">
                {Math.round(totalInterest).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between py-1 border-t border-[var(--border)] font-semibold">
              <span className="text-[var(--foreground)]">Total Payment (Principal + Interest):</span>
              <span className="font-extrabold tabular-nums text-[var(--foreground)]">
                {Math.round(totalPayment).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Visual Principal vs Interest Ratio */}
        <div className="flex flex-col justify-center space-y-3 p-4 rounded-xl bg-[var(--muted)]">
          <span className="text-xs font-semibold text-[var(--muted-foreground)]">Breakdown Comparison</span>
          {/* Proportion bar */}
          <div className="w-full h-4 rounded-full bg-[var(--muted)] overflow-hidden flex">
            <div
              className="bg-indigo-600 h-full transition-all duration-300"
              style={{ width: `${principalRatio}%` }}
              title={`Principal: ${principalRatio.toFixed(1)}%`}
            />
            <div
              className="bg-rose-500 h-full transition-all duration-300"
              style={{ width: `${interestRatio}%` }}
              title={`Interest: ${interestRatio.toFixed(1)}%`}
            />
          </div>

          <div className="flex justify-between text-xs font-medium">
            <span className="flex items-center gap-1.5 text-[var(--primary)]">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
              Principal ({principalRatio.toFixed(1)}%)
            </span>
            <span className="flex items-center gap-1.5 text-rose-500">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              Interest ({interestRatio.toFixed(1)}%)
            </span>
          </div>

          <p className="text-[11px] text-[var(--muted-foreground)] pt-1">
            Interest constitutes {interestRatio.toFixed(1)}% of your total loan outlay over {N} months.
          </p>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-2">
        <Button variant="ghost" size="sm" onClick={handleReset}>
          Reset
        </Button>
        <Button variant="primary" size="sm" onClick={handleCopy}>
          Copy EMI Report
        </Button>
      </div>
    </div>
  );
}
