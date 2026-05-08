"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const CACHE_KEY = "pomodoro-quote";
const CACHE_TTL = 6 * 60 * 60 * 1000;

interface Quote {
  q: string;
  a: string;
}

export function MotivationalQuote() {
  const [quote, setQuote] = useState<Quote | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (raw) {
          const cached = JSON.parse(raw) as { quote: Quote; ts: number };
          if (Date.now() - cached.ts < CACHE_TTL) {
            setQuote(cached.quote);
            return;
          }
        }
      } catch (err) {
        console.error("Quote cache read failed:", err);
      }

      try {
        const res = await fetch("/api/quote");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const q = data[0] as Quote;
        localStorage.setItem(CACHE_KEY, JSON.stringify({ quote: q, ts: Date.now() }));
        setQuote(q);
      } catch (err) {
        console.error("Quote fetch failed:", err);
        toast.error("Could not load quote.");
      }
    }
    load();
  }, []);

  if (!quote) return null;

  return (
    <div className="flex flex-col gap-1 text-center px-2 py-4">
      <p className="text-xs italic text-muted-foreground leading-relaxed">
        &ldquo;{quote.q}&rdquo;
      </p>
      <p className="text-xs font-medium text-muted-foreground">— {quote.a}</p>
    </div>
  );
}
