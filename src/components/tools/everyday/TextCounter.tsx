"use client";

import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

interface TextStats {
  words: number;
  chars: number;
  charsNoSpaces: number;
  sentences: number;
  paragraphs: number;
  readingTime: string;
  speakingTime: string;
  topKeywords: { word: string; count: number }[];
}

function analyzeText(text: string): TextStats {
  const trimmed = text.trim();
  if (!trimmed) {
    return {
      words: 0, chars: 0, charsNoSpaces: 0, sentences: 0, paragraphs: 0,
      readingTime: "0 min", speakingTime: "0 min", topKeywords: [],
    };
  }

  const words = trimmed.split(/\s+/).filter(Boolean);
  const chars = text.length;
  const charsNoSpaces = text.replace(/\s/g, "").length;
  const sentences = trimmed.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;
  const paragraphs = trimmed.split(/\n\n+/).filter((p) => p.trim().length > 0).length;

  const readingMinutes = words.length / 200;
  const speakingMinutes = words.length / 150;

  // Keyword frequency
  const freq: Record<string, number> = {};
  const stopWords = new Set(["the", "a", "an", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "do", "does", "did", "will", "would", "could", "should", "may", "might", "shall", "can", "need", "dare", "ought", "used", "to", "of", "in", "for", "on", "with", "at", "by", "from", "as", "into", "through", "during", "before", "after", "above", "below", "between", "out", "off", "over", "under", "again", "further", "then", "once", "here", "there", "when", "where", "why", "how", "all", "each", "every", "both", "few", "more", "most", "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so", "than", "too", "very", "just", "because", "but", "and", "or", "if", "while", "that", "this", "it", "its", "i", "me", "my", "we", "our", "you", "your", "he", "him", "his", "she", "her", "they", "them", "their", "what", "which", "who", "whom", "these", "those", "am", "s", "t", "don", "now"]);

  words.forEach((w) => {
    const clean = w.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (clean.length > 2 && !stopWords.has(clean)) {
      freq[clean] = (freq[clean] || 0) + 1;
    }
  });

  const topKeywords = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word, count]) => ({ word, count }));

  return {
    words: words.length,
    chars,
    charsNoSpaces,
    sentences,
    paragraphs,
    readingTime: readingMinutes < 1 ? "< 1 min" : `${Math.ceil(readingMinutes)} min`,
    speakingTime: speakingMinutes < 1 ? "< 1 min" : `${Math.ceil(speakingMinutes)} min`,
    topKeywords,
  };
}

export default function TextCounter() {
  const { toast } = useToast();
  const [text, setText] = useState("");

  const stats = analyzeText(text);

  const handleCopy = () => {
    const summary = `Text Analysis:
Words: ${stats.words}
Characters: ${stats.chars}
Characters (no spaces): ${stats.charsNoSpaces}
Sentences: ${stats.sentences}
Paragraphs: ${stats.paragraphs}
Reading time: ${stats.readingTime}
Speaking time: ${stats.speakingTime}`;
    navigator.clipboard.writeText(summary);
    toast("Analysis copied to clipboard!", "success");
  };

  const handleClear = () => {
    setText("");
    toast("Text cleared", "info");
  };

  const statCards = [
    { label: "Words", value: stats.words },
    { label: "Characters", value: stats.chars },
    { label: "No Spaces", value: stats.charsNoSpaces },
    { label: "Sentences", value: stats.sentences },
    { label: "Paragraphs", value: stats.paragraphs },
    { label: "Reading Time", value: stats.readingTime },
    { label: "Speaking Time", value: stats.speakingTime },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Text input */}
      <div className="p-6 rounded-2xl glass-card space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">
            Your Text
          </label>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={handleCopy} disabled={!text}>
              Copy Stats
            </Button>
            <Button variant="ghost" size="sm" onClick={handleClear} disabled={!text}>
              Clear
            </Button>
          </div>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
          placeholder="Type or paste your text here to analyze word count, character count, reading time, and more..."
          className="w-full p-4 rounded-xl border border-[var(--border)] bg-[var(--card)] text-sm outline-none focus:border-indigo-500 resize-y min-h-[160px]"
        />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {statCards.map((s) => (
          <div
            key={s.label}
            className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card)] text-center"
          >
            <div className="text-2xl font-extrabold text-[var(--primary)] tabular-nums">
              {s.value}
            </div>
            <div className="text-xs text-[var(--muted-foreground)] mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Social media limits */}
      {text && (
        <div className="p-6 rounded-2xl glass-card space-y-4">
          <span className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">
            Social Media Limits
          </span>
          <div className="space-y-3">
            {[
              { platform: "Twitter / X", limit: 280, current: stats.chars },
              { platform: "Instagram Caption", limit: 2200, current: stats.chars },
              { platform: "LinkedIn Post", limit: 3000, current: stats.chars },
            ].map((p) => {
              const pct = Math.min((p.current / p.limit) * 100, 100);
              const over = p.current > p.limit;
              return (
                <div key={p.platform} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-[var(--foreground)]">{p.platform}</span>
                    <span className={over ? "text-rose-500 font-bold" : "text-[var(--muted-foreground)]"}>
                      {p.current} / {p.limit}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[var(--muted)] overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        over ? "bg-rose-500" : pct > 80 ? "bg-amber-500" : "bg-emerald-500"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Keywords */}
      {stats.topKeywords.length > 0 && (
        <div className="p-6 rounded-2xl glass-card space-y-4">
          <span className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">
            Top Keywords
          </span>
          <div className="flex flex-wrap gap-2">
            {stats.topKeywords.map((kw) => (
              <span
                key={kw.word}
                className="px-3 py-1 rounded-lg bg-[var(--muted)] text-xs font-medium text-[var(--foreground)]"
              >
                {kw.word} <span className="text-[var(--primary)] font-bold">({kw.count})</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
