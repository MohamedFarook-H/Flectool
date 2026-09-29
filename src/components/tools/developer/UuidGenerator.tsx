"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

export function UuidGenerator() {
  const { toast } = useToast();
  const [count, setCount] = useState<number>(5);
  const [uppercase, setUppercase] = useState<boolean>(false);
  const [hyphens, setHyphens] = useState<boolean>(true);
  const [braces, setBraces] = useState<boolean>(false);
  const [uuids, setUuids] = useState<string[]>([]);

  const generateUuidString = () => {
    let id = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (crypto.getRandomValues(new Uint8Array(1))[0] % 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });

    if (!hyphens) {
      id = id.replace(/-/g, "");
    }
    if (uppercase) {
      id = id.toUpperCase();
    }
    if (braces) {
      id = `{${id}}`;
    }
    return id;
  };

  const generateBatch = () => {
    const list: string[] = [];
    for (let i = 0; i < Math.min(100, Math.max(1, count)); i++) {
      list.push(generateUuidString());
    }
    setUuids(list);
  };

  useEffect(() => {
    generateBatch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, uppercase, hyphens, braces]);

  const handleCopyAll = () => {
    navigator.clipboard.writeText(uuids.join("\n"));
    toast(`Copied ${uuids.length} UUID${uuids.length === 1 ? "" : "s"} to clipboard!`, "success");
  };

  const handleCopySingle = (id: string) => {
    navigator.clipboard.writeText(id);
    toast("Copied UUID!", "success");
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Controls Bar */}
      <div className="p-6 rounded-2xl glass-card space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-[var(--foreground)]">
              Quantity:
            </span>
            <div className="flex items-center gap-2">
              {[1, 5, 10, 25, 50].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setCount(num)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    count === num
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <Button variant="primary" size="sm" onClick={generateBatch}>
            ↻ Generate New
          </Button>
        </div>

        {/* Formatting Checkboxes */}
        <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-[var(--border)] text-xs">
          <label className="flex items-center gap-2 cursor-pointer text-[var(--foreground)]">
            <input
              type="checkbox"
              checked={uppercase}
              onChange={(e) => setUppercase(e.target.checked)}
              className="rounded accent-indigo-600 w-4 h-4 cursor-pointer"
            />
            <span>Uppercase</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-[var(--foreground)]">
            <input
              type="checkbox"
              checked={hyphens}
              onChange={(e) => setHyphens(e.target.checked)}
              className="rounded accent-indigo-600 w-4 h-4 cursor-pointer"
            />
            <span>Hyphens (-)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-[var(--foreground)]">
            <input
              type="checkbox"
              checked={braces}
              onChange={(e) => setBraces(e.target.checked)}
              className="rounded accent-indigo-600 w-4 h-4 cursor-pointer"
            />
            <span>Braces ({`{ }`})</span>
          </label>
        </div>
      </div>

      {/* UUIDs Display List */}
      <div className="rounded-2xl glass-card overflow-hidden">
        <div className="flex items-center justify-between p-4 bg-[var(--muted)] border-b border-[var(--border)]">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
            Generated UUID v4 ({uuids.length})
          </span>
          <Button variant="secondary" size="sm" onClick={handleCopyAll}>
            Copy All
          </Button>
        </div>

        <div className="divide-y divide-[var(--border)] p-2 font-mono text-xs max-h-96 overflow-y-auto">
          {uuids.map((id, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[var(--muted)] transition-colors group"
            >
              <span className="text-[var(--foreground)] select-all">{id}</span>
              <button
                type="button"
                onClick={() => handleCopySingle(id)}
                className="opacity-70 group-hover:opacity-100 text-xs text-[var(--primary)] font-semibold px-2 py-0.5 rounded hover:bg-[var(--muted)]"
              >
                Copy
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
