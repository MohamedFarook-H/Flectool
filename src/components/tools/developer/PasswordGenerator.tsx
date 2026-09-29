"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

export function PasswordGenerator() {
  const { toast } = useToast();
  const [password, setPassword] = useState<string>("");
  const [length, setLength] = useState<number>(18);
  const [includeUpper, setIncludeUpper] = useState<boolean>(true);
  const [includeLower, setIncludeLower] = useState<boolean>(true);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(true);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState<boolean>(false);

  const generate = () => {
    let upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let lower = "abcdefghijklmnopqrstuvwxyz";
    let numbers = "0123456789";
    let symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    if (excludeAmbiguous) {
      upper = upper.replace(/[OI]/g, "");
      lower = lower.replace(/[ol]/g, "");
      numbers = numbers.replace(/[01]/g, "");
    }

    let charset = "";
    if (includeUpper) charset += upper;
    if (includeLower) charset += lower;
    if (includeNumbers) charset += numbers;
    if (includeSymbols) charset += symbols;

    if (!charset) {
      toast("Please select at least one character type", "error");
      return;
    }

    const randomValues = new Uint32Array(length);
    crypto.getRandomValues(randomValues);

    let result = "";
    for (let i = 0; i < length; i++) {
      result += charset[randomValues[i] % charset.length];
    }
    setPassword(result);
  };

  useEffect(() => {
    generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [length, includeUpper, includeLower, includeNumbers, includeSymbols, excludeAmbiguous]);

  // Calculate entropy and crack resistance
  let poolSize = 0;
  if (includeUpper) poolSize += 26;
  if (includeLower) poolSize += 26;
  if (includeNumbers) poolSize += 10;
  if (includeSymbols) poolSize += 26;
  const entropy = Math.round(length * (poolSize > 0 ? Math.log2(poolSize) : 0));

  let strengthLabel = "Weak";
  let strengthColor = "bg-rose-500";
  let crackEstimate = "A few seconds";

  if (entropy > 85) {
    strengthLabel = "Extremely Strong";
    strengthColor = "bg-emerald-500";
    crackEstimate = "Centuries / Billions of years";
  } else if (entropy > 65) {
    strengthLabel = "Strong";
    strengthColor = "bg-teal-500";
    crackEstimate = "Thousands of years";
  } else if (entropy > 45) {
    strengthLabel = "Moderate";
    strengthColor = "bg-amber-500";
    crackEstimate = "A few days to months";
  }

  const handleCopy = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    toast("Password copied to clipboard!", "success");
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Generated Password Box */}
      <div className="p-6 rounded-2xl glass-card border border-indigo-500/20 space-y-4">
        <div className="relative flex items-center justify-between gap-3 p-4 rounded-xl bg-[var(--muted)] border border-[var(--border)]">
          <span className="font-mono text-base sm:text-lg text-[var(--foreground)] break-all tracking-wider select-all">
            {password || "Select character sets"}
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={generate}
              className="p-2 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--primary)] hover:bg-[var(--muted)] transition-colors"
              title="Generate new password"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                <path d="M8 16H3v5" />
              </svg>
            </button>
            <Button variant="primary" size="sm" onClick={handleCopy}>
              Copy
            </Button>
          </div>
        </div>

        {/* Strength Meter Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-[var(--muted-foreground)] font-medium">Strength: <strong className="text-[var(--foreground)]">{strengthLabel}</strong> ({entropy} bits)</span>
            <span className="text-[var(--muted-foreground)]">Crack Time: {crackEstimate}</span>
          </div>
          <div className="w-full h-2 rounded-full bg-[var(--muted)] overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${strengthColor}`}
              style={{ width: `${Math.min(100, (entropy / 100) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Configuration Sliders & Toggles */}
      <div className="p-6 rounded-2xl glass-card space-y-6">
        {/* Length Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold text-[var(--foreground)]">
              Password Length: <span className="font-bold text-[var(--primary)]">{length} characters</span>
            </label>
          </div>
          <input
            type="range"
            min="8"
            max="64"
            value={length}
            onChange={(e) => setLength(parseInt(e.target.value, 10))}
            className="w-full accent-indigo-600 h-2 bg-[var(--muted)] rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-[var(--muted-foreground)] font-mono">
            <span>8 chars (Min)</span>
            <span>24 chars</span>
            <span>64 chars (Max)</span>
          </div>
        </div>

        {/* Character Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[var(--border)] text-xs">
          <label className="flex items-center gap-2.5 p-3 rounded-xl bg-[var(--muted)] cursor-pointer">
            <input
              type="checkbox"
              checked={includeUpper}
              onChange={(e) => setIncludeUpper(e.target.checked)}
              className="rounded accent-indigo-600 w-4 h-4 cursor-pointer"
            />
            <span className="font-medium text-[var(--foreground)]">Uppercase Letters (A-Z)</span>
          </label>

          <label className="flex items-center gap-2.5 p-3 rounded-xl bg-[var(--muted)] cursor-pointer">
            <input
              type="checkbox"
              checked={includeLower}
              onChange={(e) => setIncludeLower(e.target.checked)}
              className="rounded accent-indigo-600 w-4 h-4 cursor-pointer"
            />
            <span className="font-medium text-[var(--foreground)]">Lowercase Letters (a-z)</span>
          </label>

          <label className="flex items-center gap-2.5 p-3 rounded-xl bg-[var(--muted)] cursor-pointer">
            <input
              type="checkbox"
              checked={includeNumbers}
              onChange={(e) => setIncludeNumbers(e.target.checked)}
              className="rounded accent-indigo-600 w-4 h-4 cursor-pointer"
            />
            <span className="font-medium text-[var(--foreground)]">Numbers (0-9)</span>
          </label>

          <label className="flex items-center gap-2.5 p-3 rounded-xl bg-[var(--muted)] cursor-pointer">
            <input
              type="checkbox"
              checked={includeSymbols}
              onChange={(e) => setIncludeSymbols(e.target.checked)}
              className="rounded accent-indigo-600 w-4 h-4 cursor-pointer"
            />
            <span className="font-medium text-[var(--foreground)]">Special Symbols (!@#$)</span>
          </label>

          <label className="flex items-center gap-2.5 p-3 rounded-xl bg-[var(--muted)] cursor-pointer sm:col-span-2">
            <input
              type="checkbox"
              checked={excludeAmbiguous}
              onChange={(e) => setExcludeAmbiguous(e.target.checked)}
              className="rounded accent-indigo-600 w-4 h-4 cursor-pointer"
            />
            <span className="font-medium text-[var(--foreground)]">
              Avoid Ambiguous Characters (e.g. 0, O, 1, l, I)
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}
