"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

interface ThemeToggleButtonProps {
  className?: string;
  size?: number;
}

/** Theme toggle with View-Transitions cross-fade; persists to localStorage. */
export function ThemeToggleButton({ className = "", size = 18 }: ThemeToggleButtonProps) {
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
      className={`inline-flex items-center justify-center rounded-md text-muted-foreground transition-colors duration-200 hover:bg-foreground/5 hover:text-foreground ${className}`}
    >
      {dark ? <Sun size={size} /> : <Moon size={size} />}
    </button>
  );
}
