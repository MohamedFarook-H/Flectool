"use client";

import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

type Category = "length" | "weight" | "temperature" | "area" | "volume" | "speed" | "data" | "time";

interface Unit {
  label: string;
  toBase: (v: number) => number;
  fromBase: (v: number) => number;
}

const CATEGORIES: Record<Category, { label: string; units: Unit[] }> = {
  length: {
    label: "Length",
    units: [
      { label: "Kilometer (km)", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      { label: "Meter (m)", toBase: (v) => v, fromBase: (v) => v },
      { label: "Centimeter (cm)", toBase: (v) => v / 100, fromBase: (v) => v * 100 },
      { label: "Millimeter (mm)", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      { label: "Mile (mi)", toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
      { label: "Yard (yd)", toBase: (v) => v * 0.9144, fromBase: (v) => v / 0.9144 },
      { label: "Foot (ft)", toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
      { label: "Inch (in)", toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
    ],
  },
  weight: {
    label: "Weight",
    units: [
      { label: "Kilogram (kg)", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      { label: "Gram (g)", toBase: (v) => v, fromBase: (v) => v },
      { label: "Milligram (mg)", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      { label: "Metric Ton (t)", toBase: (v) => v * 1_000_000, fromBase: (v) => v / 1_000_000 },
      { label: "Pound (lb)", toBase: (v) => v * 453.592, fromBase: (v) => v / 453.592 },
      { label: "Ounce (oz)", toBase: (v) => v * 28.3495, fromBase: (v) => v / 28.3495 },
    ],
  },
  temperature: {
    label: "Temperature",
    units: [
      { label: "Celsius (°C)", toBase: (v) => v, fromBase: (v) => v },
      { label: "Fahrenheit (°F)", toBase: (v) => ((v - 32) * 5) / 9, fromBase: (v) => (v * 9) / 5 + 32 },
      { label: "Kelvin (K)", toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
    ],
  },
  area: {
    label: "Area",
    units: [
      { label: "Square Meter (m²)", toBase: (v) => v, fromBase: (v) => v },
      { label: "Square Kilometer (km²)", toBase: (v) => v * 1_000_000, fromBase: (v) => v / 1_000_000 },
      { label: "Square Foot (ft²)", toBase: (v) => v * 0.092903, fromBase: (v) => v / 0.092903 },
      { label: "Square Mile (mi²)", toBase: (v) => v * 2_589_988, fromBase: (v) => v / 2_589_988 },
      { label: "Acre", toBase: (v) => v * 4046.86, fromBase: (v) => v / 4046.86 },
      { label: "Hectare (ha)", toBase: (v) => v * 10_000, fromBase: (v) => v / 10_000 },
    ],
  },
  volume: {
    label: "Volume",
    units: [
      { label: "Liter (L)", toBase: (v) => v, fromBase: (v) => v },
      { label: "Milliliter (mL)", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      { label: "Cubic Meter (m³)", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      { label: "Gallon (US)", toBase: (v) => v * 3.78541, fromBase: (v) => v / 3.78541 },
      { label: "Cup (US)", toBase: (v) => v * 0.236588, fromBase: (v) => v / 0.236588 },
      { label: "Fluid Ounce (US)", toBase: (v) => v * 0.0295735, fromBase: (v) => v / 0.0295735 },
    ],
  },
  speed: {
    label: "Speed",
    units: [
      { label: "Meters/sec (m/s)", toBase: (v) => v, fromBase: (v) => v },
      { label: "Kilometers/hour (km/h)", toBase: (v) => v / 3.6, fromBase: (v) => v * 3.6 },
      { label: "Miles/hour (mph)", toBase: (v) => v * 0.44704, fromBase: (v) => v / 0.44704 },
      { label: "Knot (kn)", toBase: (v) => v * 0.514444, fromBase: (v) => v / 0.514444 },
      { label: "Feet/sec (ft/s)", toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
    ],
  },
  data: {
    label: "Data",
    units: [
      { label: "Byte (B)", toBase: (v) => v, fromBase: (v) => v },
      { label: "Kilobyte (KB)", toBase: (v) => v * 1024, fromBase: (v) => v / 1024 },
      { label: "Megabyte (MB)", toBase: (v) => v * 1024 ** 2, fromBase: (v) => v / 1024 ** 2 },
      { label: "Gigabyte (GB)", toBase: (v) => v * 1024 ** 3, fromBase: (v) => v / 1024 ** 3 },
      { label: "Terabyte (TB)", toBase: (v) => v * 1024 ** 4, fromBase: (v) => v / 1024 ** 4 },
      { label: "Petabyte (PB)", toBase: (v) => v * 1024 ** 5, fromBase: (v) => v / 1024 ** 5 },
    ],
  },
  time: {
    label: "Time",
    units: [
      { label: "Second (s)", toBase: (v) => v, fromBase: (v) => v },
      { label: "Minute (min)", toBase: (v) => v * 60, fromBase: (v) => v / 60 },
      { label: "Hour (hr)", toBase: (v) => v * 3600, fromBase: (v) => v / 3600 },
      { label: "Day (d)", toBase: (v) => v * 86400, fromBase: (v) => v / 86400 },
      { label: "Week (wk)", toBase: (v) => v * 604800, fromBase: (v) => v / 604800 },
      { label: "Month (30 days)", toBase: (v) => v * 2_592_000, fromBase: (v) => v / 2_592_000 },
      { label: "Year (365 days)", toBase: (v) => v * 31_536_000, fromBase: (v) => v / 31_536_000 },
    ],
  },
};

export function UnitConverter() {
  const { toast } = useToast();
  const [category, setCategory] = useState<Category>("length");
  const [fromUnit, setFromUnit] = useState(0);
  const [toUnit, setToUnit] = useState(1);
  const [inputValue, setInputValue] = useState("1");

  const cat = CATEGORIES[category];
  const from = cat.units[fromUnit];
  const to = cat.units[toUnit];

  const convert = useCallback(
    (value: string): string => {
      const num = parseFloat(value);
      if (isNaN(num)) return "";
      const baseValue = from.toBase(num);
      const result = to.fromBase(baseValue);
      if (Math.abs(result) < 0.000001 && result !== 0) {
        return result.toExponential(6);
      }
      return parseFloat(result.toPrecision(10)).toString();
    },
    [from, to]
  );

  const result = convert(inputValue);

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    if (result) setInputValue(result);
  };

  const handleCopy = () => {
    if (!result) return;
    const text = `${inputValue} ${from.label} = ${result} ${to.label}`;
    navigator.clipboard.writeText(text);
    toast("Conversion copied to clipboard!", "success");
  };

  const handleCategoryChange = (newCat: Category) => {
    setCategory(newCat);
    setFromUnit(0);
    setToUnit(1);
    setInputValue("1");
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Category tabs */}
      <div className="flex flex-wrap gap-1 bg-[var(--muted)] p-1.5 rounded-2xl">
        {(Object.keys(CATEGORIES) as Category[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => handleCategoryChange(key)}
            className={`flex-1 min-w-[calc(25%-4px)] py-2 px-2 rounded-xl text-xs font-bold transition-all ${
              category === key
                ? "bg-[var(--card)] text-[var(--primary)] shadow-xs"
                : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            }`}
          >
            {CATEGORIES[key].label}
          </button>
        ))}
      </div>

      {/* Converter */}
      <div className="p-6 rounded-2xl glass-card space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-4 items-end">
          {/* From */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[var(--foreground)]">From</label>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 text-sm outline-none focus:border-indigo-500"
              placeholder="Enter value"
            />
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(Number(e.target.value))}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] p-2.5 text-sm outline-none focus:border-indigo-500"
            >
              {cat.units.map((u, i) => (
                <option key={i} value={i}>{u.label}</option>
              ))}
            </select>
          </div>

          {/* Swap */}
          <button
            type="button"
            onClick={handleSwap}
            className="p-3 rounded-xl border border-[var(--border)] hover:bg-[var(--muted)] transition-colors mx-auto"
            title="Swap units"
          >
            ⇄
          </button>

          {/* To */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[var(--foreground)]">To</label>
            <div className="w-full rounded-xl border border-[var(--border)] bg-[var(--muted)] p-3 text-sm font-bold text-[var(--foreground)] min-h-[42px] flex items-center">
              {result || "—"}
            </div>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(Number(e.target.value))}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] p-2.5 text-sm outline-none focus:border-indigo-500"
            >
              {cat.units.map((u, i) => (
                <option key={i} value={i}>{u.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Result display */}
      {result && (
        <div className="p-5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-[var(--muted-foreground)]">
              Result
            </span>
            <div className="text-2xl font-extrabold text-[var(--primary)] mt-1 tabular-nums">
              {inputValue} {from.label} = {result} {to.label}
            </div>
          </div>
          <Button variant="primary" size="sm" onClick={handleCopy}>
            Copy Result
          </Button>
        </div>
      )}
    </div>
  );
}
