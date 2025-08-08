"use client";
import { useEffect, useState } from "react";

interface TypewriterProps {
  phrases: string[];
  typingMs?: number;
  pauseMs?: number;
}

export default function Typewriter({
  phrases,
  typingMs = 40,
  pauseMs = 1200,
}: TypewriterProps) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = phrases[phraseIndex % phrases.length] ?? "";
    if (!deleting && displayText.length < current.length) {
      const id = setTimeout(
        () => setDisplayText(current.slice(0, displayText.length + 1)),
        typingMs
      );
      return () => clearTimeout(id);
    }
    if (!deleting && displayText.length === current.length) {
      const id = setTimeout(() => setDeleting(true), pauseMs);
      return () => clearTimeout(id);
    }
    if (deleting && displayText.length > 0) {
      const id = setTimeout(
        () => setDisplayText(current.slice(0, displayText.length - 1)),
        typingMs / 2
      );
      return () => clearTimeout(id);
    }
    if (deleting && displayText.length === 0) {
      setDeleting(false);
      setPhraseIndex((i) => (i + 1) % phrases.length);
    }
  }, [deleting, displayText, phraseIndex, phrases, typingMs, pauseMs]);

  return (
    <span className="inline-block align-baseline">
      {displayText}
      <span className="ml-0.5 inline-block w-3 border-r-2 border-gray-600 animate-pulse" />
    </span>
  );
}


