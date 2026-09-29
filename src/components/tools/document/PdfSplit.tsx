"use client";

import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";

export function PdfSplit() {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [pageCount, setPageCount] = useState<number>(0);
  const [ranges, setRanges] = useState("1-1");
  const [splitting, setSplitting] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback(async (f: File | null) => {
    if (!f) return;
    if (f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf")) {
      toast("Please select a valid PDF file", "error");
      return;
    }
    setFile(f);
    setFileName(f.name);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const arrayBuffer = await f.arrayBuffer();
      const doc = await PDFDocument.load(arrayBuffer);
      setPageCount(doc.getPageCount());
      setRanges(`1-${doc.getPageCount()}`);
    } catch {
      toast("Failed to read PDF. Make sure it is a valid PDF file.", "error");
      setFile(null);
      setFileName("");
      setPageCount(0);
    }
  }, [toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0] || null);
  }, [handleFile]);

  const parseRanges = (input: string, max: number): number[][] | null => {
    const parts = input.split(",").map((s) => s.trim()).filter(Boolean);
    const result: number[][] = [];
    for (const part of parts) {
      const match = part.match(/^(\d+)(?:\s*-\s*(\d+))?$/);
      if (!match) return null;
      const start = parseInt(match[1], 10);
      const end = match[2] ? parseInt(match[2], 10) : start;
      if (start < 1 || end > max || start > end) return null;
      const pages: number[] = [];
      for (let i = start; i <= end; i++) pages.push(i);
      result.push(pages);
    }
    return result.length > 0 ? result : null;
  };

  const handleSplit = async () => {
    if (!file || pageCount === 0) return;
    const parsed = parseRanges(ranges, pageCount);
    if (!parsed) {
      toast("Invalid page range format. Use e.g. 1-3, 5, 8-10", "error");
      return;
    }
    setSplitting(true);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const arrayBuffer = await file.arrayBuffer();
      const src = await PDFDocument.load(arrayBuffer);

      for (let i = 0; i < parsed.length; i++) {
        const out = await PDFDocument.create();
        const indices = parsed[i].map((p) => p - 1);
        const pages = await out.copyPages(src, indices);
        pages.forEach((p) => out.addPage(p));
        const pdfBytes = await out.save();
        const blob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${fileName.replace(".pdf", "")}_pages_${parsed[i][0]}-${parsed[i][parsed[i].length - 1]}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
      toast(`Split into ${parsed.length} PDF file(s)!`, "success");
    } catch {
      toast("Failed to split PDF. The file may be corrupted or password-protected.", "error");
    } finally {
      setSplitting(false);
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
          onChange={(e) => handleFile(e.target.files?.[0] || null)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        {file ? (
          <>
            <div className="text-4xl mb-3">📕</div>
            <p className="text-sm font-semibold text-[var(--foreground)]">{fileName}</p>
            <p className="text-xs text-[var(--muted-foreground)] mt-1">{pageCount} pages detected</p>
          </>
        ) : (
          <>
            <div className="text-4xl mb-3">📄</div>
            <p className="text-sm font-semibold text-[var(--foreground)]">
              Drop a PDF file here or click to browse
            </p>
            <p className="text-xs text-[var(--muted-foreground)] mt-1">We will detect the page count automatically</p>
          </>
        )}
      </div>

      {/* Range input */}
      {file && pageCount > 0 && (
        <div className="p-6 rounded-2xl glass-card space-y-4">
          <Input
            label="Page Ranges to Extract"
            value={ranges}
            onChange={(e) => setRanges(e.target.value)}
            placeholder="e.g. 1-3, 5, 8-10"
            hint={`Enter page numbers or ranges. Total pages: ${pageCount}`}
          />
          <div className="text-xs text-[var(--muted-foreground)] space-y-1">
            <p>Examples:</p>
            <ul className="list-disc list-inside space-y-0.5 ml-2">
              <li><code className="px-1 py-0.5 bg-[var(--muted)] rounded">1-5</code> — pages 1 through 5</li>
              <li><code className="px-1 py-0.5 bg-[var(--muted)] rounded">3</code> — just page 3</li>
              <li><code className="px-1 py-0.5 bg-[var(--muted)] rounded">1-3, 5, 8-10</code> — multiple ranges</li>
            </ul>
          </div>
        </div>
      )}

      {/* Split button */}
      <Button
        variant="primary"
        size="lg"
        className="w-full"
        onClick={handleSplit}
        isLoading={splitting}
        disabled={!file || pageCount === 0}
      >
        {splitting ? "Splitting PDF..." : "Split & Download"}
      </Button>

      <p className="text-xs text-[var(--muted-foreground)] text-center">
        All processing happens in your browser. Your files never leave your device.
      </p>
    </div>
  );
}
