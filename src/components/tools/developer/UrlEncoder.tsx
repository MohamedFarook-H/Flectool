"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

export function UrlEncoder() {
  const { toast } = useToast();
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [encodeType, setEncodeType] = useState<"component" | "full">("component");
  const [inputText, setInputText] = useState<string>("https://flectool.dev/search?q=free tools & utilities=true");
  const [outputText, setOutputText] = useState<string>("");

  React.useEffect(() => {
    if (!inputText) {
      setOutputText("");
      return;
    }
    try {
      if (mode === "encode") {
        if (encodeType === "component") {
          setOutputText(encodeURIComponent(inputText));
        } else {
          setOutputText(encodeURI(inputText));
        }
      } else {
        if (encodeType === "component") {
          setOutputText(decodeURIComponent(inputText));
        } else {
          setOutputText(decodeURI(inputText));
        }
      }
    } catch {
      setOutputText("Error: Malformed URI sequence");
    }
  }, [inputText, mode, encodeType]);

  // URL Parser breakdown if input is valid URL
  let parsedUrl: URL | null = null;
  try {
    parsedUrl = new URL(inputText.startsWith("http") ? inputText : `https://${inputText}`);
  } catch {
    parsedUrl = null;
  }

  const queryEntries = parsedUrl ? Array.from(parsedUrl.searchParams.entries()) : [];

  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    toast("Copied URL to clipboard!", "success");
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Mode Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl glass-card">
        <div className="flex bg-[var(--muted)] p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setMode("encode")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mode === "encode"
                ? "bg-[var(--card)] text-[var(--primary)] shadow-xs"
                : "text-[var(--muted-foreground)]"
            }`}
          >
            Encode URL
          </button>
          <button
            type="button"
            onClick={() => setMode("decode")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mode === "decode"
                ? "bg-[var(--card)] text-[var(--primary)] shadow-xs"
                : "text-[var(--muted-foreground)]"
            }`}
          >
            Decode URL
          </button>
        </div>

        {/* Encode Mode: Component vs Full */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--muted-foreground)] font-medium">Standard:</span>
          <select
            value={encodeType}
            onChange={(e) => setEncodeType(e.target.value as "component" | "full")}
            className="text-xs bg-[var(--muted)] rounded-lg px-2.5 py-1.5 outline-none font-semibold text-[var(--foreground)]"
          >
            <option value="component">encodeURIComponent (Strict)</option>
            <option value="full">encodeURI (Full Address)</option>
          </select>
        </div>
      </div>

      {/* Inputs & Outputs */}
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-[var(--foreground)]">
              {mode === "encode" ? "Raw URL or Query String" : "Encoded URL"}
            </label>
            <button
              type="button"
              onClick={() => setInputText("")}
              className="text-xs text-[var(--muted-foreground)] hover:text-[var(--muted-foreground)]"
            >
              Clear
            </button>
          </div>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={4}
            placeholder="Enter URL to encode or decode..."
            className="w-full p-3.5 rounded-2xl glass-card font-mono text-xs sm:text-sm bg-[var(--card)] outline-none border border-[var(--border)] focus:border-indigo-500"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-[var(--foreground)]">
              {mode === "encode" ? "Encoded Result" : "Decoded Result"}
            </label>
            <Button variant="primary" size="sm" onClick={handleCopy}>
              Copy Output
            </Button>
          </div>
          <textarea
            readOnly
            value={outputText}
            rows={4}
            className="w-full p-3.5 rounded-2xl glass-card font-mono text-xs sm:text-sm bg-[var(--muted)] text-[var(--foreground)] outline-none border border-[var(--border)]"
          />
        </div>
      </div>

      {/* Query Parameter Inspector */}
      {queryEntries.length > 0 && (
        <div className="p-5 rounded-2xl glass-card space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
              URL Query Parameters ({queryEntries.length})
            </span>
            <span className="text-xs font-mono text-[var(--primary)]">Host: {parsedUrl?.hostname}</span>
          </div>

          <div className="divide-y divide-[var(--border)] font-mono text-xs">
            {queryEntries.map(([key, val], idx) => (
              <div key={idx} className="py-2 flex items-center justify-between gap-4">
                <span className="font-semibold text-[var(--primary)]">{key}</span>
                <span className="text-[var(--muted-foreground)] truncate max-w-xs">{val}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
