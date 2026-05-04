"use client";
import { useEffect, useState } from "react";

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
      } catch {}

      try {
        const res = await fetch("/api/quote");
        const data = await res.json();
        const q = data[0] as Quote;
        localStorage.setItem(CACHE_KEY, JSON.stringify({ quote: q, ts: Date.now() }));
        setQuote(q);
      } catch {}
    }
    load();
  }, []);

  if (!quote) return null;

  return (
    <div className="flex flex-col gap-3 h-full justify-center">
      <p className="italic" style={{ color: "#1a1a1a" }}>
        &ldquo;{quote.q}&rdquo;
      </p>
      <p className="font-semibold mt-4" style={{ color: "#1a1a1a" }}>
        — {quote.a}
      </p>
    </div>
  );
}
