"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";

export function DiscountCalculator() {
  const { toast } = useToast();
  const [originalPrice, setOriginalPrice] = useState<string>("150");
  const [discountPct, setDiscountPct] = useState<string>("25");
  const [couponPct, setCouponPct] = useState<string>("10");
  const [taxPct, setTaxPct] = useState<string>("5");

  const original = parseFloat(originalPrice) || 0;
  const dPct = parseFloat(discountPct) || 0;
  const cPct = parseFloat(couponPct) || 0;
  const tPct = parseFloat(taxPct) || 0;

  // Primary discount
  const primaryDiscount = (original * dPct) / 100;
  const afterPrimary = original - primaryDiscount;

  // Additional coupon applied to discounted price
  const couponDiscount = (afterPrimary * cPct) / 100;
  const afterCoupon = afterPrimary - couponDiscount;

  // Tax applied to discounted total
  const taxAmount = (afterCoupon * tPct) / 100;
  const finalPrice = afterCoupon + taxAmount;

  const totalSaved = original - (finalPrice - taxAmount);
  const netSavingsRatio = original > 0 ? (totalSaved / original) * 100 : 0;

  const handleCopy = () => {
    const text = `Flectool Discount Report:
Original Price: $${original.toFixed(2)}
Main Discount: ${dPct}% (-$${primaryDiscount.toFixed(2)})
Coupon Discount: ${cPct}% (-$${couponDiscount.toFixed(2)})
Estimated Tax: ${tPct}% (+$${taxAmount.toFixed(2)})
Total Savings: $${totalSaved.toFixed(2)} (${netSavingsRatio.toFixed(1)}% off)
Final Payable Price: $${finalPrice.toFixed(2)}`;
    navigator.clipboard.writeText(text);
    toast("Discount calculation copied to clipboard!", "success");
  };

  const handleReset = () => {
    setOriginalPrice("150");
    setDiscountPct("25");
    setCouponPct("0");
    setTaxPct("0");
    toast("Reset discount calculator", "info");
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Inputs */}
      <div className="p-6 rounded-2xl glass-card space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Original Retail Price"
            type="number"
            min="0"
            value={originalPrice}
            onChange={(e) => setOriginalPrice(e.target.value)}
            placeholder="e.g. 150"
          />
          <Input
            label="Discount Percentage (%)"
            type="number"
            min="0"
            max="100"
            value={discountPct}
            onChange={(e) => setDiscountPct(e.target.value)}
            placeholder="e.g. 25"
          />
        </div>

        {/* Quick Discount Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-[var(--muted-foreground)] font-medium">Popular Discounts:</span>
          {["10", "15", "20", "25", "30", "50", "70"].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setDiscountPct(p)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                discountPct === p
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
              }`}
            >
              {p}%
            </button>
          ))}
        </div>

        {/* Optional Add-ons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[var(--border)]">
          <Input
            label="Extra Coupon / Promo (%)"
            type="number"
            min="0"
            max="100"
            value={couponPct}
            onChange={(e) => setCouponPct(e.target.value)}
            placeholder="Optional (e.g. 10)"
          />
          <Input
            label="Sales Tax (%)"
            type="number"
            min="0"
            max="100"
            value={taxPct}
            onChange={(e) => setTaxPct(e.target.value)}
            placeholder="Optional (e.g. 5)"
          />
        </div>
      </div>

      {/* Results Display */}
      <div className="p-6 rounded-2xl glass-card border border-indigo-500/20 space-y-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-[var(--muted-foreground)]">
              Final Price to Pay
            </span>
            <div className="text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">
              ${finalPrice.toFixed(2)}
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs uppercase font-bold tracking-wider text-[var(--muted-foreground)]">
              Total Money Saved
            </span>
            <div className="text-2xl font-bold text-[var(--primary)] tabular-nums">
              ${totalSaved.toFixed(2)}
              <span className="text-xs font-semibold ml-1 text-[var(--muted-foreground)]">
                ({netSavingsRatio.toFixed(0)}% off)
              </span>
            </div>
          </div>
        </div>

        {/* Detailed Receipt Breakdown */}
        <div className="space-y-2 pt-3 border-t border-[var(--border)] text-xs">
          <div className="flex justify-between py-1 text-[var(--muted-foreground)]">
            <span>Original Price:</span>
            <span className="line-through tabular-nums">${original.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-1 text-emerald-600 dark:text-emerald-400">
            <span>Primary Discount ({dPct}%):</span>
            <span className="tabular-nums">-${primaryDiscount.toFixed(2)}</span>
          </div>
          {cPct > 0 && (
            <div className="flex justify-between py-1 text-emerald-600 dark:text-emerald-400">
              <span>Extra Coupon ({cPct}%):</span>
              <span className="tabular-nums">-${couponDiscount.toFixed(2)}</span>
            </div>
          )}
          {tPct > 0 && (
            <div className="flex justify-between py-1 text-[var(--muted-foreground)]">
              <span>Sales Tax ({tPct}%):</span>
              <span className="tabular-nums">+${taxAmount.toFixed(2)}</span>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-[var(--border)]">
          <Button variant="ghost" size="sm" onClick={handleReset}>
            Reset
          </Button>
          <Button variant="primary" size="sm" onClick={handleCopy}>
            Copy Summary
          </Button>
        </div>
      </div>
    </div>
  );
}
