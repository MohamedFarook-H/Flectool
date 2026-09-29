"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

const SAMPLE_JSON = JSON.stringify(
  {
    name: "Flectool",
    version: "2.0.0",
    features: ["Instant tools", "Client-side privacy", "Modern SaaS UI"],
    metrics: { toolsCount: 27, offlineReady: true },
    author: { team: "Flectool Engineering", contact: "support@flectool.local" },
  },
  null,
  2
);

export function JsonFormatter() {
  const { toast } = useToast();
  const [inputJson, setInputJson] = useState<string>(SAMPLE_JSON);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [indentSize, setIndentSize] = useState<number>(2);

  const formatJson = (spaces: number = indentSize) => {
    if (!inputJson.trim()) {
      setErrorMsg(null);
      return;
    }
    try {
      const parsed = JSON.parse(inputJson);
      setInputJson(JSON.stringify(parsed, null, spaces));
      setErrorMsg(null);
      toast("JSON formatted successfully", "success");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Invalid JSON syntax");
      }
      toast("Invalid JSON format", "error");
    }
  };

  const minifyJson = () => {
    if (!inputJson.trim()) return;
    try {
      const parsed = JSON.parse(inputJson);
      setInputJson(JSON.stringify(parsed));
      setErrorMsg(null);
      toast("JSON minified to single line", "success");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Invalid JSON syntax");
      }
      toast("Invalid JSON format", "error");
    }
  };

  const validateJson = () => {
    if (!inputJson.trim()) {
      toast("Editor is empty", "info");
      return;
    }
    try {
      JSON.parse(inputJson);
      setErrorMsg(null);
      toast("✓ JSON is 100% valid!", "success");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Invalid JSON syntax");
      }
      toast("Invalid JSON format", "error");
    }
  };

  const handleCopy = () => {
    if (!inputJson) return;
    navigator.clipboard.writeText(inputJson);
    toast("Copied JSON to clipboard", "success");
  };

  const handleDownload = () => {
    if (!inputJson) return;
    const blob = new Blob([inputJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "flectool-formatted.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast("JSON downloaded", "success");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setInputJson(content);
      setErrorMsg(null);
      toast(`Loaded ${file.name}`, "info");
    };
    reader.readAsText(file);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl glass-card">
        {/* Formatting Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="primary" size="sm" onClick={() => formatJson(2)}>
            Format (2 Sp)
          </Button>
          <Button variant="secondary" size="sm" onClick={() => formatJson(4)}>
            Format (4 Sp)
          </Button>
          <Button variant="secondary" size="sm" onClick={minifyJson}>
            Minify
          </Button>
          <Button variant="outline" size="sm" onClick={validateJson}>
            Validate
          </Button>
        </div>

        {/* Utilities */}
        <div className="flex items-center gap-2">
          <label className="cursor-pointer">
            <span className="inline-flex items-center justify-center font-medium rounded-xl h-9 px-3.5 text-xs bg-[var(--muted)] hover:bg-[var(--muted)] dark:bg-[var(--muted)] dark:hover:bg-[var(--muted)] text-[var(--foreground)] transition-colors">
              Upload .json
            </span>
            <input
              type="file"
              accept=".json,application/json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
          <Button variant="ghost" size="sm" onClick={() => setInputJson(SAMPLE_JSON)}>
            Sample
          </Button>
          <Button variant="ghost" size="sm" onClick={() => { setInputJson(""); setErrorMsg(null); }}>
            Clear
          </Button>
          <Button variant="secondary" size="sm" onClick={handleCopy}>
            Copy
          </Button>
          <Button variant="secondary" size="sm" onClick={handleDownload}>
            Download
          </Button>
        </div>
      </div>

      {/* Editor & Validation status */}
      <div className="space-y-2">
        <div className="relative rounded-2xl glass-card overflow-hidden border border-[var(--border)]">
          <textarea
            value={inputJson}
            onChange={(e) => {
              setInputJson(e.target.value);
              setErrorMsg(null);
            }}
            placeholder="Paste your raw JSON code here..."
            rows={18}
            spellCheck={false}
            className="w-full p-4 font-mono text-xs sm:text-sm bg-[var(--card)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] outline-none resize-y leading-relaxed"
          />
        </div>

        {/* Diagnostic Bar */}
        {errorMsg ? (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-mono flex items-start gap-2 animate-in fade-in">
            <span className="font-bold">Error:</span>
            <span>{errorMsg}</span>
          </div>
        ) : (
          <div className="flex items-center justify-between px-2 text-xs text-[var(--muted-foreground)] font-mono">
            <span>Size: {new Blob([inputJson]).size.toLocaleString()} bytes</span>
            <span>Lines: {inputJson.split("\n").length}</span>
          </div>
        )}
      </div>
    </div>
  );
}
