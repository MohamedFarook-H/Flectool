"use client";

import React, { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

type OutputFormat = "image/jpeg" | "image/png" | "image/webp";

const FORMATS: { value: OutputFormat; label: string; ext: string }[] = [
  { value: "image/jpeg", label: "JPG", ext: "jpg" },
  { value: "image/png", label: "PNG", ext: "png" },
  { value: "image/webp", label: "WebP", ext: "webp" },
];

export function ImageConverter() {
  const { toast } = useToast();
  const [original, setOriginal] = useState<{ url: string; name: string; width: number; height: number } | null>(null);
  const [format, setFormat] = useState<OutputFormat>("image/png");
  const [quality, setQuality] = useState(0.92);
  const [result, setResult] = useState<{ url: string; blob: Blob; ext: string } | null>(null);
  const [converting, setConverting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFile = useCallback((f: File | null) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      toast("Please select an image file", "error");
      return;
    }
    const url = URL.createObjectURL(f);
    const img = new Image();
    img.onload = () => {
      setOriginal({ url, name: f.name, width: img.naturalWidth, height: img.naturalHeight });
      setResult(null);
    };
    img.src = url;
  }, [toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0] || null);
  }, [handleFile]);

  const convert = useCallback(() => {
    if (!original) return;
    setConverting(true);

    const canvas = canvasRef.current;
    if (!canvas) { setConverting(false); return; }
    const ctx = canvas.getContext("2d");
    if (!ctx) { setConverting(false); return; }

    const img = new Image();
    img.onload = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      // For JPG, fill with white background (no transparency)
      if (format === "image/jpeg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const ext = FORMATS.find((f) => f.value === format)?.ext || "png";
            setResult({ url, blob, ext });
            toast(`Converted to ${ext.toUpperCase()}!`, "success");
          }
          setConverting(false);
        },
        format,
        quality
      );
    };
    img.src = original.url;
  }, [original, format, quality, toast]);

  const handleDownload = () => {
    if (!result || !original) return;
    const a = document.createElement("a");
    a.href = result.url;
    a.download = `${original.name.replace(/\.[^.]+$/, "")}.${result.ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast("Converted image downloaded!", "success");
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer ${
          dragOver
            ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20"
            : "border-[var(--border)] hover:border-indigo-400"
        }`}
      >
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFile(e.target.files?.[0] || null)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        {original ? (
          <div className="space-y-2">
            <img src={original.url} alt="Preview" className="max-h-40 mx-auto rounded-lg shadow-md" />
            <p className="text-sm font-semibold text-[var(--foreground)]">{original.name}</p>
            <p className="text-xs text-[var(--muted-foreground)]">{original.width} x {original.height} px</p>
          </div>
        ) : (
          <>
            <div className="text-4xl mb-3">🖼️</div>
            <p className="text-sm font-semibold text-[var(--foreground)]">
              Drop an image here or click to browse
            </p>
            <p className="text-xs text-[var(--muted-foreground)] mt-1">Supports JPG, PNG, WebP, and more</p>
          </>
        )}
      </div>

      {/* Format selection */}
      {original && (
        <div className="p-6 rounded-2xl glass-card space-y-4">
          <span className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">
            Output Format
          </span>
          <div className="grid grid-cols-3 gap-3">
            {FORMATS.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setFormat(f.value)}
                className={`p-4 rounded-xl border text-center transition-all ${
                  format === f.value
                    ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20"
                    : "border-[var(--border)] hover:border-indigo-300"
                }`}
              >
                <div className="text-sm font-bold text-[var(--foreground)]">{f.label}</div>
              </button>
            ))}
          </div>

          {format !== "image/png" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[var(--muted-foreground)]">Quality</span>
                <span className="text-sm font-bold text-[var(--primary)]">
                  {Math.round(quality * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={quality}
                onChange={(e) => setQuality(parseFloat(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>
          )}
        </div>
      )}

      {/* Convert button */}
      <Button
        variant="primary"
        size="lg"
        className="w-full"
        onClick={convert}
        isLoading={converting}
        disabled={!original}
      >
        {converting ? "Converting..." : "Convert Image"}
      </Button>

      {/* Result */}
      {result && (
        <div className="p-6 rounded-2xl border border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-4">
          <div className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
            Conversion Complete
          </div>
          <div className="text-center">
            <img src={result.url} alt="Converted" className="max-h-48 mx-auto rounded-lg shadow-md" />
          </div>
          <Button variant="primary" size="md" className="w-full" onClick={handleDownload}>
            Download .{result.ext.toUpperCase()} Image
          </Button>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
