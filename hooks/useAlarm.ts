"use client";
import { useCallback, useRef, useState } from "react";

export type AlarmTone = "sharp" | "gentle" | "bell" | "pulse";

interface ToneConfig {
  label: string;
  play: (ctx: AudioContext) => void;
}

const TONES: Record<AlarmTone, ToneConfig> = {
  sharp: {
    label: "Sharp",
    play(ctx) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "square";
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.setValueAtTime(660, ctx.currentTime + 0.12);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.24);
      gain.gain.setValueAtTime(0.26, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.5);
      osc.onended = () => ctx.close();
    },
  },
  gentle: {
    label: "Gentle",
    play(ctx) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(520, ctx.currentTime);
      osc.frequency.setValueAtTime(440, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.9);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.9);
      osc.onended = () => ctx.close();
    },
  },
  bell: {
    label: "Bell",
    play(ctx) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(1047, ctx.currentTime);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.4);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 1.4);
      osc.onended = () => ctx.close();
    },
  },
  pulse: {
    label: "Pulse",
    play(ctx) {
      [0, 0.22, 0.44].forEach((offset) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "triangle";
        osc.frequency.setValueAtTime(740, ctx.currentTime + offset);
        gain.gain.setValueAtTime(0.22, ctx.currentTime + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + offset + 0.18);
        osc.start(ctx.currentTime + offset);
        osc.stop(ctx.currentTime + offset + 0.18);
        osc.onended = () => ctx.close();
      });
    },
  },
};

export const ALARM_TONE_OPTIONS = (Object.keys(TONES) as AlarmTone[]).map((k) => ({
  value: k,
  label: TONES[k].label,
}));

export function useAlarm() {
  const [tone, setTone] = useState<AlarmTone>("sharp");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const toneRef = useRef<AlarmTone>(tone);
  toneRef.current = tone;

  const beep = useCallback(() => {
    try {
      const ctx = new AudioContext();
      TONES[toneRef.current].play(ctx);
    } catch {
      // Web Audio not available
    }
  }, []);

  const startAlarm = useCallback(() => {
    beep();
    intervalRef.current = setInterval(beep, 1800);
  }, [beep]);

  const stopAlarm = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const previewTone = useCallback(() => beep(), [beep]);

  return { startAlarm, stopAlarm, previewTone, tone, setTone };
}
