'use client';

import React, { useState, useRef, useCallback } from 'react';
import { PDFDocument, rgb } from 'pdf-lib';

type PageSize = 'A4' | 'Letter' | 'A3';
type Orientation = 'portrait' | 'landscape';
type MarginSize = 'none' | 'small' | 'medium' | 'large';

interface ImageFile {
  id: string;
  file: File;
  dataUrl: string;
  name: string;
}

const PAGE_SIZES: Record<PageSize, [number, number]> = {
  A4: [595.28, 841.89],
  Letter: [612, 792],
  A3: [841.89, 1190.55],
};

const MARGIN_VALUES: Record<MarginSize, number> = {
  none: 0,
  small: 18,
  medium: 36,
  large: 72,
};

export default function JpgToPdf() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [pageSize, setPageSize] = useState<PageSize>('A4');
  const [orientation, setOrientation] = useState<Orientation>('portrait');
  const [margin, setMargin] = useState<MarginSize>('medium');
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<'idle' | 'converting' | 'done' | 'error'>('idle');
  const [statusMsg, setStatusMsg] = useState('');
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const readFileAsDataUrl = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });

  const addImages = useCallback(async (files: FileList | File[]) => {
    const imageFiles = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (!imageFiles.length) return;
    const newImages: ImageFile[] = await Promise.all(
      imageFiles.map(async (file) => ({
        id: `${Date.now()}-${Math.random()}`,
        file,
        dataUrl: await readFileAsDataUrl(file),
        name: file.name,
      }))
    );
    setImages((prev) => [...prev, ...newImages]);
    setStatus('idle');
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      addImages(e.dataTransfer.files);
    },
    [addImages]
  );

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => setIsDragging(false);

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
    setStatus('idle');
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    setImages((prev) => {
      const arr = [...prev];
      const target = direction === 'up' ? index - 1 : index + 1;
      if (target < 0 || target >= arr.length) return prev;
      [arr[index], arr[target]] = [arr[target], arr[index]];
      return arr;
    });
  };

  const convert = async () => {
    if (images.length === 0) return;
    setStatus('converting');
    setProgress(0);
    setStatusMsg('Initialising PDF\u2026');

    try {
      const pdfDoc = await PDFDocument.create();
      let [w, h] = PAGE_SIZES[pageSize];
      if (orientation === 'landscape') [w, h] = [h, w];
      const m = MARGIN_VALUES[margin];

      for (let i = 0; i < images.length; i++) {
        setStatusMsg(`Embedding image ${i + 1} of ${images.length}\u2026`);
        setProgress(Math.round(((i + 1) / images.length) * 90));

        const { file } = images[i];
        const arrayBuffer = await readFileAsArrayBuffer(file);
        const bytes = new Uint8Array(arrayBuffer);

        let embeddedImage;
        const mimeType = file.type.toLowerCase();
        if (mimeType === 'image/jpeg' || mimeType === 'image/jpg') {
          embeddedImage = await pdfDoc.embedJpg(bytes);
        } else {
          const blob = new Blob([bytes], { type: file.type });
          const bmpUrl = URL.createObjectURL(blob);
          const img = new Image();
          await new Promise<void>((res, rej) => {
            img.onload = () => res();
            img.onerror = rej;
            img.src = bmpUrl;
          });
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const ctx = canvas.getContext('2d')!;
          ctx.drawImage(img, 0, 0);
          URL.revokeObjectURL(bmpUrl);
          const pngBlob = await new Promise<Blob>((res) => canvas.toBlob((b) => res(b!), 'image/png'));
          const pngBuffer = await pngBlob.arrayBuffer();
          embeddedImage = await pdfDoc.embedPng(new Uint8Array(pngBuffer));
        }

        const page = pdfDoc.addPage([w, h]);
        const availW = w - m * 2;
        const availH = h - m * 2;
        const imgW = embeddedImage.width;
        const imgH = embeddedImage.height;
        const scaleX = availW / imgW;
        const scaleY = availH / imgH;
        const scale = Math.min(scaleX, scaleY);
        const drawW = imgW * scale;
        const drawH = imgH * scale;
        const x = m + (availW - drawW) / 2;
        const y = m + (availH - drawH) / 2;

        page.drawImage(embeddedImage, { x, y, width: drawW, height: drawH });
      }

      setStatusMsg('Saving PDF\u2026');
      setProgress(95);
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'converted.pdf';
      a.click();
      URL.revokeObjectURL(url);

      setStatus('done');
      setProgress(100);
      setStatusMsg(`Done! Created PDF with ${images.length} page(s).`);
    } catch (err: unknown) {
      console.error(err);
      setStatus('error');
      setStatusMsg(`Error: ${err instanceof Error ? err.message : 'Conversion failed'}`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      {/* Drop Zone */}
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed cursor-pointer transition-colors p-10 ${
          isDragging
            ? 'border-blue-500 bg-blue-500/10'
            : 'border-[var(--border)] hover:border-blue-400 hover:bg-blue-500/5'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && addImages(e.target.files)}
        />
        <div className="text-4xl">\uD83D\uDDBC\uFE0F</div>
        <p className="text-sm text-[var(--foreground)]/70 text-center">
          <span className="font-semibold text-blue-500">Click to upload</span> or drag &amp; drop<br />
          JPG, PNG, WEBP images
        </p>
      </div>

      {/* Settings */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl border border-[var(--border)] bg-[var(--card)]">
        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase tracking-wide text-[var(--foreground)]/60">Page Size</label>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(e.target.value as PageSize)}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {(['A4', 'Letter', 'A3'] as PageSize[]).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase tracking-wide text-[var(--foreground)]/60">Orientation</label>
          <select
            value={orientation}
            onChange={(e) => setOrientation(e.target.value as Orientation)}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="portrait">Portrait</option>
            <option value="landscape">Landscape</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase tracking-wide text-[var(--foreground)]/60">Margin</label>
          <select
            value={margin}
            onChange={(e) => setMargin(e.target.value as MarginSize)}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {(['none', 'small', 'medium', 'large'] as MarginSize[]).map((m) => (
              <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Image List */}
      {images.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-[var(--foreground)]/80">
            Images ({images.length})
          </h3>
          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {images.map((img, index) => (
              <div
                key={img.id}
                className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--card)] p-3"
              >
                <img
                  src={img.dataUrl}
                  alt={img.name}
                  className="w-14 h-14 object-cover rounded-md flex-shrink-0 border border-[var(--border)]"
                />
                <span className="flex-1 text-sm truncate text-[var(--foreground)]/80" title={img.name}>
                  {img.name}
                </span>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => moveImage(index, 'up')}
                    disabled={index === 0}
                    className="p-1.5 rounded-md hover:bg-[var(--border)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Move up"
                  >
                    \u2191
                  </button>
                  <button
                    onClick={() => moveImage(index, 'down')}
                    disabled={index === images.length - 1}
                    className="p-1.5 rounded-md hover:bg-[var(--border)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Move down"
                  >
                    \u2193
                  </button>
                  <button
                    onClick={() => removeImage(img.id)}
                    className="p-1.5 rounded-md text-red-500 hover:bg-red-500/10 transition-colors"
                    title="Remove"
                  >
                    \u2715
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Status */}
      {status !== 'idle' && (
        <div
          className={`rounded-lg p-4 text-sm ${
            status === 'error'
              ? 'bg-red-500/10 border border-red-500/30 text-red-600'
              : status === 'done'
              ? 'bg-green-500/10 border border-green-500/30 text-green-600'
              : 'bg-blue-500/10 border border-blue-500/30 text-blue-600'
          }`}
        >
          {status === 'converting' && (
            <div className="space-y-2">
              <p>{statusMsg}</p>
              <div className="w-full bg-blue-200/30 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
          {(status === 'done' || status === 'error') && <p>{statusMsg}</p>}
        </div>
      )}

      {/* Convert Button */}
      <button
        onClick={convert}
        disabled={images.length === 0 || status === 'converting'}
        className="w-full py-3 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {status === 'converting'
          ? `Converting\u2026 (${progress}%)`
          : `Convert ${images.length || ''} Image${images.length !== 1 ? 's' : ''} to PDF`}
      </button>
    </div>
  );
}
