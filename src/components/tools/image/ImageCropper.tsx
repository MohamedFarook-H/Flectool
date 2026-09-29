"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

type AspectRatio = "freeform" | "1:1" | "16:9" | "4:3" | "9:16";

const RATIOS: { value: AspectRatio; label: string; ratio: number | null }[] = [
  { value: "freeform", label: "Freeform", ratio: null },
  { value: "1:1", label: "1:1 (Square)", ratio: 1 },
  { value: "16:9", label: "16:9 (Wide)", ratio: 16 / 9 },
  { value: "4:3", label: "4:3 (Standard)", ratio: 4 / 3 },
  { value: "9:16", label: "9:16 (Story)", ratio: 9 / 16 },
];

export function ImageCropper() {
  const { toast } = useToast();
  const [original, setOriginal] = useState<{ url: string; name: string; width: number; height: number } | null>(null);
  const [aspect, setAspect] = useState<AspectRatio>("freeform");
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, w: 0, h: 0 });
  const [result, setResult] = useState<{ url: string; width: number; height: number } | null>(null);
  const [cropping, setCropping] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const dragOrigin = useRef({ x: 0, y: 0, w: 0, h: 0 });

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
      setCropArea({ x: 0, y: 0, w: img.naturalWidth, h: img.naturalHeight });
      setResult(null);
    };
    img.src = url;
  }, [toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0] || null);
  }, [handleFile]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!original) return;
    dragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
    dragOrigin.current = { ...cropArea };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging.current || !original || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const scaleX = original.width / rect.width;
    const scaleY = original.height / rect.height;
    const dx = (e.clientX - dragStart.current.x) * scaleX;
    const dy = (e.clientY - dragStart.current.y) * scaleY;

    let newX = dragOrigin.current.x + dx;
    let newY = dragOrigin.current.y + dy;
    newX = Math.max(0, Math.min(newX, original.width - cropArea.w));
    newY = Math.max(0, Math.min(newY, original.height - cropArea.h));

    setCropArea((prev) => ({ ...prev, x: newX, y: newY }));
  };

  const handleMouseUp = () => {
    dragging.current = false;
  };

  useEffect(() => {
    if (!original) return;
    const ratio = RATIOS.find((r) => r.value === aspect)?.ratio;
    if (ratio) {
      let w = original.width;
      let h = w / ratio;
      if (h > original.height) {
        h = original.height;
        w = h * ratio;
      }
      setCropArea({ x: (original.width - w) / 2, y: (original.height - h) / 2, w, h });
    } else {
      setCropArea({ x: 0, y: 0, w: original.width, h: original.height });
    }
  }, [aspect, original]);

  const crop = useCallback(() => {
    if (!original) return;
    setCropping(true);

    const canvas = canvasRef.current;
    if (!canvas) { setCropping(false); return; }
    const ctx = canvas.getContext("2d");
    if (!ctx) { setCropping(false); return; }

    const img = new Image();
    img.onload = () => {
      const w = Math.round(cropArea.w);
      const h = Math.round(cropArea.h);
      canvas.width = w;
      canvas.height = h;
      ctx.drawImage(img, cropArea.x, cropArea.y, cropArea.w, cropArea.h, 0, 0, w, h);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            setResult({ url, width: w, height: h });
            toast(`Cropped to ${w} x ${h} px`, "success");
          }
          setCropping(false);
        },
        "image/png"
      );
    };
    img.src = original.url;
  }, [original, cropArea, toast]);

  const handleDownload = () => {
    if (!result || !original) return;
    const a = document.createElement("a");
    a.href = result.url;
    a.download = `${original.name.replace(/\.[^.]+$/, "")}_cropped.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast("Cropped image downloaded!", "success");
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
            <p className="text-xs text-[var(--muted-foreground)] mt-1">Then drag to select the crop area</p>
          </>
        )}
      </div>

      {/* Aspect ratio */}
      {original && (
        <div className="p-6 rounded-2xl glass-card space-y-4">
          <span className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">
            Aspect Ratio
          </span>
          <div className="flex flex-wrap gap-2">
            {RATIOS.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setAspect(r.value)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  aspect === r.value
                    ? "bg-indigo-600 text-white"
                    : "bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Crop area */}
      {original && (
        <div
          ref={containerRef}
          className="relative rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--muted)] select-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <img
            src={original.url}
            alt="Crop preview"
            className="max-h-96 mx-auto block"
            draggable={false}
          />
          {/* Overlay */}
          <div
            className="absolute border-2 border-indigo-500 bg-indigo-500/20 cursor-move"
            style={{
              left: `${(cropArea.x / original.width) * 100}%`,
              top: `${(cropArea.y / original.height) * 100}%`,
              width: `${(cropArea.w / original.width) * 100}%`,
              height: `${(cropArea.h / original.height) * 100}%`,
            }}
          >
            <div className="absolute -top-6 left-0 text-xs font-bold text-[var(--primary)] bg-[var(--card)] px-2 py-0.5 rounded shadow-sm">
              {Math.round(cropArea.w)} x {Math.round(cropArea.h)}
            </div>
          </div>
        </div>
      )}

      {/* Crop button */}
      <Button
        variant="primary"
        size="lg"
        className="w-full"
        onClick={crop}
        isLoading={cropping}
        disabled={!original}
      >
        {cropping ? "Cropping..." : "Crop & Download"}
      </Button>

      {/* Result */}
      {result && (
        <div className="p-6 rounded-2xl border border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-4">
          <div className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
            Crop Complete
          </div>
          <div className="text-xs text-[var(--muted-foreground)]">
            Output: {result.width} x {result.height} px
          </div>
          <div className="text-center">
            <img src={result.url} alt="Cropped" className="max-h-48 mx-auto rounded-lg shadow-md" />
          </div>
          <Button variant="primary" size="md" className="w-full" onClick={handleDownload}>
            Download Cropped Image
          </Button>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
