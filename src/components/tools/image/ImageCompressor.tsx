"use client";

import React, { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

export function ImageCompressor() {
  const { toast } = useToast();
  const [original, setOriginal] = useState<{ url: string; size: number; width: number; height: number; name: string } | null>(null);
  const [quality, setQuality] = useState(0.7);
  const [result, setResult] = useState<{ url: string; size: number; blob: Blob } | null>(null);
  const [compressing, setCompressing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFile = useCallback((f: File | null) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      toast("Please select an image file (JPG, PNG, WebP)", "error");
      return;
    }
    const url = URL.createObjectURL(f);
    const img = new Image();
    img.onload = () => {
      setOriginal({ url, size: f.size, width: img.naturalWidth, height: img.naturalHeight, name: f.name });
      setResult(null);
    };
    img.src = url;
  }, [toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0] || null);
  }, [handleFile]);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const compress = useCallback(() => {
    if (!original) return;
    setCompressing(true);
    const canvas = canvasRef.current;
    if (!canvas) { setCompressing(false); return; }
    const ctx = canvas.getContext("2d");
    if (!ctx) { setCompressing(false); return; }

    const img = new Image();
    img.onload = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);

      const mimeType = original.name.toLowerCase().endsWith(".png") ? "image/png" : "image/jpeg";
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            setResult({ url, size: blob.size, blob });
            const savings = ((1 - blob.size / original.size) * 100).toFixed(1);
            toast(`Compressed! Saved ${savings}%`, "success");
          }
          setCompressing(false);
        },
        mimeType,
        quality
      );
    };
    img.src = original.url;
  }, [original, quality, toast]);

  const handleDownload = () => {
    if (!result || !original) return;
    const a = document.createElement("a");
    a.href = result.url;
    const ext = original.name.toLowerCase().endsWith(".png") ? "png" : "jpg";
    a.download = `${original.name.replace(/\.[^.]+$/, "")}_compressed.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast("Compressed image downloaded!", "success");
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
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => handleFile(e.target.files?.[0] || null)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        {original ? (
          <div className="space-y-2">
            <img src={original.url} alt="Preview" className="max-h-40 mx-auto rounded-lg shadow-md" />
            <p className="text-sm font-semibold text-[var(--foreground)]">{original.name}</p>
            <p className="text-xs text-[var(--muted-foreground)]">
              {original.width} x {original.height} px — {formatSize(original.size)}
            </p>
          </div>
        ) : (
          <>
            <div className="text-4xl mb-3">🖼️</div>
            <p className="text-sm font-semibold text-[var(--foreground)]">
              Drop an image here or click to browse
            </p>
            <p className="text-xs text-[var(--muted-foreground)] mt-1">Supports JPG, PNG, and WebP</p>
          </>
        )}
      </div>

      {/* Quality slider */}
      {original && (
        <div className="p-6 rounded-2xl glass-card space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">
              Quality
            </span>
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
          <div className="flex justify-between text-xs text-[var(--muted-foreground)]">
            <span>Smaller file</span>
            <span>Better quality</span>
          </div>
        </div>
      )}

      {/* Compress button */}
      <Button
        variant="primary"
        size="lg"
        className="w-full"
        onClick={compress}
        isLoading={compressing}
        disabled={!original}
      >
        {compressing ? "Compressing..." : "Compress Image"}
      </Button>

      {/* Result */}
      {result && original && (
        <div className="p-6 rounded-2xl border border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                Compression Complete
              </div>
              <div className="text-xs text-[var(--muted-foreground)] mt-1">
                {formatSize(original.size)} → {formatSize(result.size)}
                ({((1 - result.size / original.size) * 100).toFixed(1)}% reduction)
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-[var(--muted-foreground)]">Before</div>
              <div className="text-xs font-bold text-[var(--muted-foreground)] line-through">{formatSize(original.size)}</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1 text-center">
              <div className="text-xs text-[var(--muted-foreground)] mb-1">After</div>
              <img src={result.url} alt="Compressed" className="max-h-32 mx-auto rounded-lg shadow-sm" />
              <div className="text-xs font-bold text-emerald-600 mt-1">{formatSize(result.size)}</div>
            </div>
          </div>
          <Button variant="primary" size="md" className="w-full" onClick={handleDownload}>
            Download Compressed Image
          </Button>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
