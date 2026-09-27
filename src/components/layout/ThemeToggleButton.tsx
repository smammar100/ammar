"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeToggleButtonProps {
  className?: string;
  size?: number;
}

/** Theme toggle with View-Transitions cross-fade; persists to localStorage. */
export function ThemeToggleButton({ className, size = 18 }: ThemeToggleButtonProps) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !dark;
    const apply = () => {
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem("theme", next ? "dark" : "light");
      setDark(next);
    };
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduced && "startViewTransition" in document) {
      (document as Document & { startViewTransition: (cb: () => void) => void }).startViewTransition(apply);
    } else {
      apply();
    }
  };

  const label = `Switch to ${dark ? "light" : "dark"} mode`;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      // The skeuomorphic icon button (styles/global.css); callers size it.
      className={cn("skeu skeu-press skeu-icon", className)}
    >
      {dark ? <Sun size={size} /> : <Moon size={size} />}
    </button>
  );
}
