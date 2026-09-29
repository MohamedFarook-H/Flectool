"use client";

import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

interface PdfFile {
  name: string;
  size: number;
  file: File;
}

export function PdfMerge() {
  const { toast } = useToast();
  const [files, setFiles] = useState<PdfFile[]>([]);
  const [merging, setMerging] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = useCallback((fileList: FileList | null) => {
    if (!fileList) return;
    const pdfs = Array.from(fileList).filter(
      (f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf")
    );
    if (pdfs.length === 0) {
      toast("Please select PDF files only", "error");
      return;
    }
    setFiles((prev) => [
      ...prev,
      ...pdfs.map((f) => ({ name: f.name, size: f.size, file: f })),
    ]);
    toast(`${pdfs.length} PDF file(s) added`, "success");
  }, [toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const moveFile = (index: number, direction: -1 | 1) => {
    setFiles((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      toast("Add at least 2 PDF files to merge", "error");
      return;
    }
    setMerging(true);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const merged = await PDFDocument.create();
      for (const f of files) {
        const arrayBuffer = await f.file.arrayBuffer();
        const src = await PDFDocument.load(arrayBuffer);
        const pages = await merged.copyPages(src, src.getPageIndices());
        pages.forEach((p) => merged.addPage(p));
      }
      const pdfBytes = await merged.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "merged.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast("PDFs merged successfully!", "success");
    } catch {
      toast("Failed to merge PDFs. Make sure they are valid PDF files.", "error");
    } finally {
      setMerging(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
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
          accept=".pdf,application/pdf"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="text-4xl mb-3">📄</div>
        <p className="text-sm font-semibold text-[var(--foreground)]">
          Drop PDF files here or click to browse
        </p>
        <p className="text-xs text-[var(--muted-foreground)] mt-1">
          Select multiple PDFs — they will be merged in the order shown below
        </p>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">
              {files.length} file{files.length > 1 ? "s" : ""} selected
            </span>
            <Button variant="ghost" size="sm" onClick={() => setFiles([])}>
              Clear all
            </Button>
          </div>
          <div className="space-y-2">
            {files.map((f, i) => (
              <div
                key={`${f.name}-${i}`}
                className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border)] bg-[var(--card)]"
              >
                <span className="text-lg">📕</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-[var(--foreground)] truncate">
                    {f.name}
                  </div>
                  <div className="text-xs text-[var(--muted-foreground)]">{formatSize(f.size)}</div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => moveFile(i, -1)}
                    disabled={i === 0}
                    className="p-1.5 rounded-lg hover:bg-[var(--muted)] dark:hover:bg-[var(--muted)] disabled:opacity-30 text-[var(--muted-foreground)]"
                    title="Move up"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveFile(i, 1)}
                    disabled={i === files.length - 1}
                    className="p-1.5 rounded-lg hover:bg-[var(--muted)] dark:hover:bg-[var(--muted)] disabled:opacity-30 text-[var(--muted-foreground)]"
                    title="Move down"
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => removeFile(i)}
                    className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-500"
                    title="Remove"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Merge button */}
      <Button
        variant="primary"
        size="lg"
        className="w-full"
        onClick={handleMerge}
        isLoading={merging}
        disabled={files.length < 2}
      >
        {merging ? "Merging PDFs..." : `Merge ${files.length} PDF${files.length !== 1 ? "s" : ""}`}
      </Button>

      <p className="text-xs text-[var(--muted-foreground)] text-center">
        All processing happens in your browser. Your files never leave your device.
      </p>
    </div>
  );
}
