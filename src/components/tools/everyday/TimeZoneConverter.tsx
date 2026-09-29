"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

interface City {
  name: string;
  timezone: string;
  country: string;
}

const CITIES: City[] = [
  { name: "New York", timezone: "America/New_York", country: "USA" },
  { name: "London", timezone: "Europe/London", country: "UK" },
  { name: "Paris", timezone: "Europe/Paris", country: "France" },
  { name: "Dubai", timezone: "Asia/Dubai", country: "UAE" },
  { name: "Mumbai", timezone: "Asia/Kolkata", country: "India" },
  { name: "Singapore", timezone: "Asia/Singapore", country: "Singapore" },
  { name: "Tokyo", timezone: "Asia/Tokyo", country: "Japan" },
  { name: "Sydney", timezone: "Australia/Sydney", country: "Australia" },
  { name: "Los Angeles", timezone: "America/Los_Angeles", country: "USA" },
  { name: "Berlin", timezone: "Europe/Berlin", country: "Germany" },
  { name: "Hong Kong", timezone: "Asia/Hong_Kong", country: "China" },
  { name: "São Paulo", timezone: "America/Sao_Paulo", country: "Brazil" },
];

function getTimeInTimezone(timezone: string, date: Date): string {
  try {
    return date.toLocaleTimeString("en-US", {
      timeZone: timezone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return "--:--";
  }
}

function getOffset(timezone: string, date: Date): string {
  try {
    const str = date.toLocaleString("en-US", { timeZone: timezone, timeZoneName: "shortOffset" });
    const match = str.match(/GMT([+-]\d+)/);
    return match ? `UTC${match[1]}` : "";
  } catch {
    return "";
  }
}

function isWorkingHours(timezone: string, date: Date): boolean {
  try {
    const hour = parseInt(
      date.toLocaleString("en-US", { timeZone: timezone, hour: "numeric", hour12: false })
    );
    return hour >= 9 && hour < 18;
  } catch {
    return false;
  }
}

export function TimeZoneConverter() {
  const { toast } = useToast();
  const [selectedCities, setSelectedCities] = useState<string[]>([
    "America/New_York",
    "Europe/London",
    "Asia/Kolkata",
    "Asia/Tokyo",
  ]);
  const [sliderHour, setSliderHour] = useState(new Date().getHours());
  const [liveMode, setLiveMode] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    if (!liveMode) return;
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, [liveMode]);

  const displayTime = liveMode
    ? currentTime
    : new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), sliderHour, 0, 0);

  const toggleCity = (timezone: string) => {
    setSelectedCities((prev) =>
      prev.includes(timezone)
        ? prev.filter((t) => t !== timezone)
        : [...prev, timezone]
    );
  };

  const handleCopy = () => {
    const lines = selectedCities.map((tz) => {
      const city = CITIES.find((c) => c.timezone === tz);
      return `${city?.name || tz}: ${getTimeInTimezone(tz, displayTime)}`;
    });
    const text = `Time comparison:\n${lines.join("\n")}`;
    navigator.clipboard.writeText(text);
    toast("Time comparison copied!", "success");
  };

  const addCity = useCallback((timezone: string) => {
    setSelectedCities((prev) => (prev.includes(timezone) ? prev : [...prev, timezone]));
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* City selector */}
      <div className="p-6 rounded-2xl glass-card space-y-4">
        <span className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">
          Select Cities to Compare
        </span>
        <div className="flex flex-wrap gap-2">
          {CITIES.map((city) => (
            <button
              key={city.timezone}
              type="button"
              onClick={() => toggleCity(city.timezone)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedCities.includes(city.timezone)
                  ? "bg-indigo-600 text-white"
                  : "bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
              }`}
            >
              {city.name}
            </button>
          ))}
        </div>
      </div>

      {/* Time slider */}
      <div className="p-6 rounded-2xl glass-card space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">
            {liveMode ? "Current Time" : "Custom Time"}
          </span>
          <button
            type="button"
            onClick={() => setLiveMode(!liveMode)}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              liveMode
                ? "bg-emerald-500 text-white"
                : "bg-[var(--muted)] text-[var(--muted-foreground)]"
            }`}
          >
            {liveMode ? "Live" : "Manual"}
          </button>
        </div>
        {!liveMode && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[var(--muted-foreground)]">Hour</span>
              <span className="text-sm font-bold text-[var(--primary)]">
                {sliderHour.toString().padStart(2, "0")}:00
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="23"
              value={sliderHour}
              onChange={(e) => setSliderHour(parseInt(e.target.value))}
              className="w-full accent-indigo-600"
            />
          </div>
        )}
        {liveMode && (
          <div className="text-center">
            <div className="text-3xl font-extrabold text-[var(--foreground)] tabular-nums">
              {displayTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </div>
            <div className="text-xs text-[var(--muted-foreground)] mt-1">
              {displayTime.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </div>
          </div>
        )}
      </div>

      {/* City times */}
      <div className="space-y-2">
        {selectedCities.map((tz) => {
          const city = CITIES.find((c) => c.timezone === tz);
          const time = getTimeInTimezone(tz, displayTime);
          const offset = getOffset(tz, displayTime);
          const working = isWorkingHours(tz, displayTime);
          return (
            <div
              key={tz}
              className="flex items-center justify-between p-4 rounded-xl border border-[var(--border)] bg-[var(--card)]"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    working ? "bg-emerald-500" : "bg-[var(--muted-foreground)]"
                  }`}
                  title={working ? "Working hours" : "Outside working hours"}
                />
                <div>
                  <div className="text-sm font-bold text-[var(--foreground)]">
                    {city?.name || tz}
                  </div>
                  <div className="text-xs text-[var(--muted-foreground)]">{city?.country} {offset && `(${offset})`}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-[var(--foreground)] tabular-nums">
                  {time}
                </div>
                <div className={`text-xs font-medium ${working ? "text-emerald-500" : "text-[var(--muted-foreground)]"}`}>
                  {working ? "Working hours" : "Off hours"}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="primary" size="md" className="flex-1" onClick={handleCopy}>
          Copy All Times
        </Button>
        <Button
          variant="ghost"
          size="md"
          onClick={() => {
            setSelectedCities(["America/New_York", "Europe/London", "Asia/Kolkata", "Asia/Tokyo"]);
            toast("Reset to default cities", "info");
          }}
        >
          Reset
        </Button>
      </div>
    </div>
  );
}
