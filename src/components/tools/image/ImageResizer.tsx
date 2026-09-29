"use client";

import React, { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";

type ResizeMode = "dimensions" | "percentage" | "preset";

const PRESETS = [
  { label: "Avatar", width: 500, height: 500 },
  { label: "Full HD", width: 1920, height: 1080 },
  { label: "Instagram Post", width: 1080, height: 1080 },
  { label: "Instagram Story", width: 1080, height: 1920 },
  { label: "Twitter Header", width: 1500, height: 500 },
  { label: "YouTube Thumb", width: 1280, height: 720 },
];

export function ImageResizer() {
  const { toast } = useToast();
  const [original, setOriginal] = useState<{ url: string; width: number; height: number; name: string; size: number } | null>(null);
  const [mode, setMode] = useState<ResizeMode>("dimensions");
  const [targetWidth, setTargetWidth] = useState("");
  const [targetHeight, setTargetHeight] = useState("");
  const [scalePercent, setScalePercent] = useState("50");
  const [lockAspect, setLockAspect] = useState(true);
  const [result, setResult] = useState<{ url: string; width: number; height: number; blob: Blob } | null>(null);
  const [resizing, setResizing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const aspectRef = useRef(1);

  const handleFile = useCallback((f: File | null) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      toast("Please select an image file", "error");
      return;
    }
    const url = URL.createObjectURL(f);
    const img = new Image();
    img.onload = () => {
      aspectRef.current = img.naturalWidth / img.naturalHeight;
      setOriginal({ url, width: img.naturalWidth, height: img.naturalHeight, name: f.name, size: f.size });
      setTargetWidth(String(img.naturalWidth));
      setTargetHeight(String(img.naturalHeight));
      setResult(null);
    };
    img.src = url;
  }, [toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0] || null);
  }, [handleFile]);

  const handleWidthChange = (val: string) => {
    setTargetWidth(val);
    if (lockAspect && original) {
      const w = parseFloat(val);
      if (w > 0) setTargetHeight(String(Math.round(w / aspectRef.current)));
    }
  };

  const handleHeightChange = (val: string) => {
    setTargetHeight(val);
    if (lockAspect && original) {
      const h = parseFloat(val);
      if (h > 0) setTargetWidth(String(Math.round(h * aspectRef.current)));
    }
  };

  const applyPreset = (width: number, height: number) => {
    setTargetWidth(String(width));
    setTargetHeight(String(height));
    setMode("dimensions");
  };

  const resize = useCallback(() => {
    if (!original) return;
    setResizing(true);

    let w: number, h: number;
    if (mode === "percentage") {
      const pct = parseFloat(scalePercent) / 100;
      w = Math.round(original.width * pct);
      h = Math.round(original.height * pct);
    } else {
      w = parseFloat(targetWidth) || original.width;
      h = parseFloat(targetHeight) || original.height;
    }

    const canvas = canvasRef.current;
    if (!canvas) { setResizing(false); return; }
    const ctx = canvas.getContext("2d");
    if (!ctx) { setResizing(false); return; }

    const img = new Image();
    img.onload = () => {
      canvas.width = w;
      canvas.height = h;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, w, h);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            setResult({ url, width: w, height: h, blob });
            toast(`Resized to ${w} x ${h} px`, "success");
          }
          setResizing(false);
        },
        "image/png"
      );
    };
    img.src = original.url;
  }, [original, mode, targetWidth, targetHeight, scalePercent, toast]);

  const handleDownload = () => {
    if (!result || !original) return;
    const a = document.createElement("a");
    a.href = result.url;
    a.download = `${original.name.replace(/\.[^.]+$/, "")}_${result.width}x${result.height}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast("Resized image downloaded!", "success");
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

      {/* Mode tabs */}
      {original && (
        <div className="grid grid-cols-3 gap-1 bg-[var(--muted)] p-1.5 rounded-2xl">
          {(["dimensions", "percentage", "preset"] as ResizeMode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                mode === m
                  ? "bg-[var(--card)] text-[var(--primary)] shadow-xs"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              }`}
            >
              {m === "dimensions" ? "Dimensions" : m === "percentage" ? "Percentage" : "Presets"}
            </button>
          ))}
        </div>
      )}

      {/* Dimensions mode */}
      {original && mode === "dimensions" && (
        <div className="p-6 rounded-2xl glass-card space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Width (px)"
              type="number"
              min="1"
              value={targetWidth}
              onChange={(e) => handleWidthChange(e.target.value)}
            />
            <Input
              label="Height (px)"
              type="number"
              min="1"
              value={targetHeight}
              onChange={(e) => handleHeightChange(e.target.value)}
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] cursor-pointer">
            <input
              type="checkbox"
              checked={lockAspect}
              onChange={(e) => setLockAspect(e.target.checked)}
              className="rounded accent-indigo-600"
            />
            Lock aspect ratio
          </label>
        </div>
      )}

      {/* Percentage mode */}
      {original && mode === "percentage" && (
        <div className="p-6 rounded-2xl glass-card space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">
              Scale
            </span>
            <span className="text-sm font-bold text-[var(--primary)]">
              {scalePercent}%
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="200"
            value={scalePercent}
            onChange={(e) => setScalePercent(e.target.value)}
            className="w-full accent-indigo-600"
          />
          <p className="text-xs text-[var(--muted-foreground)]">
            Output: {Math.round(original.width * parseFloat(scalePercent) / 100)} x{" "}
            {Math.round(original.height * parseFloat(scalePercent) / 100)} px
          </p>
        </div>
      )}

      {/* Preset mode */}
      {original && mode === "preset" && (
        <div className="p-6 rounded-2xl glass-card">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => applyPreset(p.width, p.height)}
                className="p-4 rounded-xl border border-[var(--border)] hover:border-indigo-400 text-center transition-all"
              >
                <div className="text-sm font-bold text-[var(--foreground)]">{p.label}</div>
                <div className="text-xs text-[var(--muted-foreground)] mt-1">{p.width} x {p.height}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Resize button */}
      <Button
        variant="primary"
        size="lg"
        className="w-full"
        onClick={resize}
        isLoading={resizing}
        disabled={!original}
      >
        {resizing ? "Resizing..." : "Resize Image"}
      </Button>

      {/* Result */}
      {result && (
        <div className="p-6 rounded-2xl border border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-4">
          <div className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
            Resize Complete
          </div>
          <div className="text-xs text-[var(--muted-foreground)]">
            {original?.width} x {original?.height} → {result.width} x {result.height} px
          </div>
          <div className="text-center">
            <img src={result.url} alt="Resized" className="max-h-48 mx-auto rounded-lg shadow-md" />
          </div>
          <Button variant="primary" size="md" className="w-full" onClick={handleDownload}>
            Download Resized Image
          </Button>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
