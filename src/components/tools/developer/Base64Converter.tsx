"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

// UTF-8 safe Base64 encoder/decoder (SSR-safe)
function utf8ToBase64(str: string): string {
  if (typeof window === "undefined") return "";
  return window.btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) =>
      String.fromCharCode(parseInt(p1, 16))
    )
  );
}

function base64ToUtf8(str: string): string {
  if (typeof window === "undefined") return "";
  return decodeURIComponent(
    Array.prototype.map
      .call(window.atob(str), (c: string) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );
}

export function Base64Converter() {
  const { toast } = useToast();
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [inputText, setInputText] = useState<string>("Hello, Flectool 2026!");
  const [outputText, setOutputText] = useState<string>(utf8ToBase64("Hello, Flectool 2026!"));
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleInputChange = (text: string) => {
    setInputText(text);
    setErrorMsg(null);
    if (!text) {
      setOutputText("");
      return;
    }

    try {
      if (mode === "encode") {
        setOutputText(utf8ToBase64(text));
      } else {
        setOutputText(base64ToUtf8(text.trim()));
      }
    } catch {
      setErrorMsg(mode === "encode" ? "Failed to encode input" : "Invalid Base64 sequence");
      setOutputText("");
    }
  };

  const switchMode = (newMode: "encode" | "decode") => {
    setMode(newMode);
    setErrorMsg(null);
    // Swap input and output for quick two-way testing
    if (outputText && !errorMsg) {
      setInputText(outputText);
      try {
        if (newMode === "encode") {
          setOutputText(utf8ToBase64(outputText));
        } else {
          setOutputText(base64ToUtf8(outputText.trim()));
        }
      } catch {
        setOutputText("");
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUri = event.target?.result as string;
      setInputText(`[File: ${file.name} (${file.type})]`);
      setOutputText(dataUri);
      toast(`Converted ${file.name} to Base64 Data URI!`, "success");
    };
    reader.readAsDataURL(file);
  };

  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    toast("Copied to clipboard!", "success");
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Mode Selector & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl glass-card">
        <div className="flex bg-[var(--muted)] p-1 rounded-xl">
          <button
            type="button"
            onClick={() => switchMode("encode")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mode === "encode"
                ? "bg-[var(--card)] text-[var(--primary)] shadow-xs"
                : "text-[var(--muted-foreground)]"
            }`}
          >
            Text → Base64 (Encode)
          </button>
          <button
            type="button"
            onClick={() => switchMode("decode")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mode === "decode"
                ? "bg-[var(--card)] text-[var(--primary)] shadow-xs"
                : "text-[var(--muted-foreground)]"
            }`}
          >
            Base64 → Text (Decode)
          </button>
        </div>

        <div className="flex items-center gap-2">
          <label className="cursor-pointer">
            <span className="inline-flex items-center justify-center font-medium rounded-xl h-9 px-3 text-xs bg-[var(--muted)] hover:bg-[var(--muted)] dark:bg-[var(--muted)] dark:hover:bg-[var(--muted)] text-[var(--foreground)] transition-colors">
              File to Base64
            </span>
            <input type="file" onChange={handleFileUpload} className="hidden" />
          </label>
          <Button variant="ghost" size="sm" onClick={() => { setInputText(""); setOutputText(""); }}>
            Clear
          </Button>
          <Button variant="primary" size="sm" onClick={handleCopy}>
            Copy Output
          </Button>
        </div>
      </div>

      {/* Editor Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Input Textarea */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[var(--foreground)]">
            {mode === "encode" ? "Raw Input Text" : "Base64 Encoded String"}
          </label>
          <textarea
            value={inputText}
            onChange={(e) => handleInputChange(e.target.value)}
            rows={10}
            placeholder={mode === "encode" ? "Type or paste text..." : "Paste base64 string..."}
            className="w-full p-3.5 rounded-2xl glass-card font-mono text-xs sm:text-sm bg-[var(--card)] outline-none resize-y leading-relaxed border border-[var(--border)] focus:border-indigo-500"
          />
        </div>

        {/* Output Textarea */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-[var(--foreground)]">
              {mode === "encode" ? "Base64 Output" : "Decoded Text"}
            </label>
            <span className="text-[11px] text-[var(--muted-foreground)] font-mono">
              {outputText.length} characters
            </span>
          </div>
          <textarea
            readOnly
            value={outputText}
            rows={10}
            placeholder="Result will appear here..."
            className="w-full p-3.5 rounded-2xl glass-card font-mono text-xs sm:text-sm bg-[var(--muted)] text-[var(--foreground)] outline-none resize-y leading-relaxed border border-[var(--border)]"
          />
        </div>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-mono">
          ⚠ {errorMsg}
        </div>
      )}
    </div>
  );
}
