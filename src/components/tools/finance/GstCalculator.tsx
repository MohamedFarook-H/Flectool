"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";

export function GstCalculator() {
  const { toast } = useToast();
  const [amount, setAmount] = useState<string>("10000");
  const [gstRate, setGstRate] = useState<string>("18");
  const [isInclusive, setIsInclusive] = useState<boolean>(false);

  const rawAmount = parseFloat(amount) || 0;
  const rate = parseFloat(gstRate) || 0;

  let basePrice = 0;
  let taxAmount = 0;
  let totalPrice = 0;

  if (isInclusive) {
    // Entered amount already includes GST
    // Total = Base + (Base * rate / 100) = Base * (1 + rate / 100)
    // Base = Total / (1 + rate / 100)
    totalPrice = rawAmount;
    basePrice = rate > 0 ? rawAmount / (1 + rate / 100) : rawAmount;
    taxAmount = totalPrice - basePrice;
  } else {
    // Entered amount is exclusive of GST
    basePrice = rawAmount;
    taxAmount = (basePrice * rate) / 100;
    totalPrice = basePrice + taxAmount;
  }

  const cgst = taxAmount / 2;
  const sgst = taxAmount / 2;

  const handleCopy = () => {
    const text = `Flectool GST Report (${isInclusive ? "Inclusive" : "Exclusive"}):
Base Net Amount: ${basePrice.toFixed(2)}
GST Rate: ${rate}%
Total Tax: ${taxAmount.toFixed(2)}
  • CGST (Central): ${cgst.toFixed(2)}
  • SGST (State): ${sgst.toFixed(2)}
Final Gross Price: ${totalPrice.toFixed(2)}`;
    navigator.clipboard.writeText(text);
    toast("GST breakdown copied to clipboard!", "success");
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Mode Toggle: Exclusive vs Inclusive */}
      <div className="flex bg-[var(--muted)] p-1 rounded-2xl max-w-md mx-auto">
        <button
          type="button"
          onClick={() => setIsInclusive(false)}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            !isInclusive
              ? "bg-[var(--card)] text-[var(--primary)] shadow-xs"
              : "text-[var(--muted-foreground)]"
          }`}
        >
          GST Exclusive (Add Tax)
        </button>
        <button
          type="button"
          onClick={() => setIsInclusive(true)}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            isInclusive
              ? "bg-[var(--card)] text-[var(--primary)] shadow-xs"
              : "text-[var(--muted-foreground)]"
          }`}
        >
          GST Inclusive (Remove Tax)
        </button>
      </div>

      {/* Input & Slabs */}
      <div className="p-6 rounded-2xl glass-card space-y-4">
        <Input
          label={isInclusive ? "Total Price (Including GST)" : "Initial Price (Excluding GST)"}
          type="number"
          min="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="e.g. 10000"
        />

        {/* GST Rate Preset Buttons */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[var(--foreground)]">
            GST Rate Slab:
          </label>
          <div className="grid grid-cols-5 gap-2">
            {["5", "12", "18", "28"].map((slab) => (
              <button
                key={slab}
                type="button"
                onClick={() => setGstRate(slab)}
                className={`py-2 rounded-xl text-xs font-bold transition-all ${
                  gstRate === slab
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
                }`}
              >
                {slab}%
              </button>
            ))}
            <div className="relative">
              <input
                type="number"
                min="0"
                max="100"
                value={gstRate}
                onChange={(e) => setGstRate(e.target.value)}
                placeholder="Custom"
                className="w-full h-full py-2 px-2 text-center rounded-xl text-xs font-bold bg-[var(--muted)] border border-[var(--border)] outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Results Card */}
      <div className="p-6 rounded-2xl glass-card border border-indigo-500/20 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-[var(--muted-foreground)]">
              {isInclusive ? "Net Price (Pre-Tax)" : "Total Price (With Tax)"}
            </span>
            <div className="text-4xl font-extrabold text-[var(--primary)] mt-1 tabular-nums">
              {(isInclusive ? basePrice : totalPrice).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
          </div>
          <Button variant="primary" size="sm" onClick={handleCopy}>
            Copy Breakdown
          </Button>
        </div>

        {/* Detailed Breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center sm:text-left">
          <div className="p-3 rounded-xl bg-[var(--muted)]">
            <span className="text-[10px] uppercase font-bold text-[var(--muted-foreground)]">Base Price</span>
            <div className="text-sm font-bold tabular-nums text-[var(--foreground)] mt-0.5">
              {basePrice.toFixed(2)}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[var(--muted)]">
            <span className="text-[10px] uppercase font-bold text-[var(--muted-foreground)]">Total Tax ({rate}%)</span>
            <div className="text-sm font-bold tabular-nums text-amber-500 mt-0.5">
              {taxAmount.toFixed(2)}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[var(--muted)]">
            <span className="text-[10px] uppercase font-bold text-[var(--muted-foreground)]">CGST (50%)</span>
            <div className="text-sm font-bold tabular-nums text-[var(--primary)] mt-0.5">
              {cgst.toFixed(2)}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[var(--muted)]">
            <span className="text-[10px] uppercase font-bold text-[var(--muted-foreground)]">SGST (50%)</span>
            <div className="text-sm font-bold tabular-nums text-cyan-500 mt-0.5">
              {sgst.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
