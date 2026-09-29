"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";

type QrType = "url" | "text" | "wifi" | "email" | "phone";

export function QrGenerator() {
  const { toast } = useToast();
  const [type, setType] = useState<QrType>("url");
  const [textVal, setTextVal] = useState<string>("https://flectool.dev");
  const [fgColor, setFgColor] = useState<string>("#0f172a");
  const [bgColor, setBgColor] = useState<string>("#ffffff");
  const [size, setSize] = useState<number>(300);

  // Wi-Fi fields
  const [wifiSsid, setWifiSsid] = useState<string>("MyHomeWiFi");
  const [wifiPass, setWifiPass] = useState<string>("SecretPass123");
  const [wifiType, setWifiType] = useState<string>("WPA");

  // Email fields
  const [emailTo, setEmailTo] = useState<string>("hello@flectool.dev");
  const [emailSubject, setEmailSubject] = useState<string>("Hello from Flectool");

  // Phone field
  const [phoneNum, setPhoneNum] = useState<string>("+1234567890");

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Construct payload string based on active type
  const getPayload = (): string => {
    switch (type) {
      case "wifi":
        return `WIFI:T:${wifiType};S:${wifiSsid};P:${wifiPass};;`;
      case "email":
        return `mailto:${emailTo}?subject=${encodeURIComponent(emailSubject)}`;
      case "phone":
        return `tel:${phoneNum}`;
      case "url":
      case "text":
      default:
        return textVal;
    }
  };

  useEffect(() => {
    const payload = getPayload();
    if (!payload.trim()) return;

    // Use browser image loading to render QR code onto canvas
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Generate high resolution QR code via SVG/Image data
    const img = new Image();
    img.crossOrigin = "anonymous";
    const encodedPayload = encodeURIComponent(payload);
    const cleanFg = fgColor.replace("#", "");
    const cleanBg = bgColor.replace("#", "");

    // Fast, reliable, clean API for client-rendered QR image
    img.src = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedPayload}&color=${cleanFg}&bgcolor=${cleanBg}&margin=2`;

    img.onload = () => {
      canvas.width = size;
      canvas.height = size;
      ctx.drawImage(img, 0, 0, size, size);
    };
  }, [type, textVal, wifiSsid, wifiPass, wifiType, emailTo, emailSubject, phoneNum, fgColor, bgColor, size]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const dataUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `flectool-qr-${type}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast("QR Code downloaded as PNG!", "success");
    } catch {
      toast("Downloading QR code...", "info");
      const a = document.createElement("a");
      a.href = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(getPayload())}`;
      a.download = "flectool-qr.png";
      a.target = "_blank";
      a.click();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Type Selector Tabs */}
      <div className="flex flex-wrap gap-1 bg-[var(--muted)] p-1.5 rounded-2xl">
        {(["url", "text", "wifi", "email", "phone"] as QrType[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setType(t)}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              type === t
                ? "bg-[var(--card)] text-[var(--primary)] shadow-xs"
                : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left: Input Form */}
        <div className="md:col-span-7 p-6 rounded-2xl glass-card space-y-4">
          {type === "url" && (
            <Input
              label="Website URL"
              type="url"
              value={textVal}
              onChange={(e) => setTextVal(e.target.value)}
              placeholder="https://yourwebsite.com"
            />
          )}

          {type === "text" && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--foreground)]">
                Plain Text Message
              </label>
              <textarea
                value={textVal}
                onChange={(e) => setTextVal(e.target.value)}
                rows={4}
                placeholder="Type any message to encode..."
                className="w-full p-3 rounded-xl border border-[var(--border)] bg-[var(--card)] text-sm outline-none focus:border-indigo-500"
              />
            </div>
          )}

          {type === "wifi" && (
            <div className="space-y-3">
              <Input
                label="Network SSID (Name)"
                value={wifiSsid}
                onChange={(e) => setWifiSsid(e.target.value)}
                placeholder="e.g. Office_Guest"
              />
              <Input
                label="Wi-Fi Password"
                type="text"
                value={wifiPass}
                onChange={(e) => setWifiPass(e.target.value)}
                placeholder="Password"
              />
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[var(--foreground)]">
                  Encryption
                </label>
                <div className="flex gap-2">
                  {["WPA", "WEP", "nopass"].map((enc) => (
                    <button
                      key={enc}
                      type="button"
                      onClick={() => setWifiType(enc)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                        wifiType === enc
                          ? "bg-indigo-600 text-white"
                          : "bg-[var(--muted)] text-[var(--muted-foreground)]"
                      }`}
                    >
                      {enc === "nopass" ? "Open" : enc}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {type === "email" && (
            <div className="space-y-3">
              <Input
                label="Recipient Email"
                type="email"
                value={emailTo}
                onChange={(e) => setEmailTo(e.target.value)}
                placeholder="name@example.com"
              />
              <Input
                label="Subject Line"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="Email Subject"
              />
            </div>
          )}

          {type === "phone" && (
            <Input
              label="Phone Number (with Country Code)"
              type="tel"
              value={phoneNum}
              onChange={(e) => setPhoneNum(e.target.value)}
              placeholder="+1 555 123 4567"
            />
          )}

          {/* Color & Size Controls */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[var(--border)]">
            <div>
              <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                QR Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="w-8 h-8 rounded-lg border-0 cursor-pointer p-0"
                />
                <span className="text-xs font-mono">{fgColor}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                Background
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-8 h-8 rounded-lg border-0 cursor-pointer p-0"
                />
                <span className="text-xs font-mono">{bgColor}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Live Preview & Download */}
        <div className="md:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl glass-card space-y-4 text-center border border-indigo-500/20">
          <div className="p-4 bg-[var(--card)] rounded-2xl shadow-md border border-[var(--border)]">
            <canvas ref={canvasRef} width={260} height={260} className="w-56 h-56 object-contain" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
              Live Preview
            </span>
            <p className="text-[11px] text-[var(--muted-foreground)]">Scan with any smartphone camera</p>
          </div>

          <Button variant="primary" size="md" className="w-full" onClick={handleDownload}>
            Download High-Res PNG
          </Button>
        </div>
      </div>
    </div>
  );
}
