"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type CodeFile = { name: string; path: string; html: string };

const EVENT = "vx:open-code";

/** Inline trigger, used in the page intro. */
export function OpenCodeButton({ className = "" }: { className?: string }) {
  return (
    <button type="button" className={`btn btn-primary ${className}`} onClick={() => window.dispatchEvent(new Event(EVENT))}>
      <span aria-hidden="true" className="font-mono">{"</>"}</span> View code
    </button>
  );
}

export default function CodeViewer({ files, repo }: { files: CodeFile[]; repo: string }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState(0);
  const [copied, setCopied] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const codeRef = useRef<HTMLElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  const show = useCallback(() => {
    opener.current = document.activeElement as HTMLElement | null;
    setOpen(true);
  }, []);
  const hide = useCallback(() => {
    setOpen(false);
    opener.current?.focus?.();
  }, []);

  useEffect(() => {
    window.addEventListener(EVENT, show);
    return () => window.removeEventListener(EVENT, show);
  }, [show]);

  useEffect(() => {
    if (!open) return;
    document.documentElement.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && hide();
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, hide]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(codeRef.current?.textContent ?? "");
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked: nothing to do */
    }
  };

  const file = files[tab];

  return (
    <>
      <button
        type="button"
        onClick={show}
        className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-[70] inline-flex min-h-12 items-center gap-2 rounded-full bg-accent px-5 text-[0.95rem] font-semibold text-ink shadow-[0_8px_30px_rgba(0,0,0,0.45)] transition-colors hover:bg-bone sm:right-8"
      >
        <span aria-hidden="true" className="font-mono">{"</>"}</span> View code
      </button>

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Source code"
        aria-hidden={!open}
        inert={!open}
        data-lenis-prevent
        className={`fixed inset-0 z-[120] ${open ? "" : "pointer-events-none"}`}
      >
        <div
          onClick={hide}
          className={`absolute inset-0 bg-ink/75 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
        />
        <div
          className={`absolute bottom-0 right-0 flex h-[88svh] w-full flex-col border-t border-line bg-coal transition-transform duration-500 ease-expo md:top-0 md:h-auto md:w-[min(760px,92vw)] md:border-l md:border-t-0 ${
            open ? "translate-y-0 md:translate-x-0" : "translate-y-full md:translate-x-full md:translate-y-0"
          }`}
        >
          <div className="flex flex-wrap items-center gap-3 border-b border-line px-4 py-3 sm:px-6">
            <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto no-scrollbar" role="tablist" aria-label="Files">
              {files.map((f, i) => (
                <button
                  key={f.path}
                  role="tab"
                  aria-selected={i === tab}
                  onClick={() => setTab(i)}
                  className={`shrink-0 rounded-full px-3.5 py-1.5 font-mono text-[0.78rem] transition-colors ${
                    i === tab ? "bg-bone text-ink" : "border border-line text-mute hover:text-bone"
                  }`}
                >
                  {f.name}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={copy} className="rounded-full border border-line px-3.5 py-1.5 text-[0.82rem] hover:border-bone">
                {copied ? "Copied" : "Copy"}
              </button>
              <a
                href={`${repo}/blob/main/${file.path}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden rounded-full border border-line px-3.5 py-1.5 text-[0.82rem] hover:border-bone sm:inline-block"
              >
                GitHub
              </a>
              <button ref={closeRef} type="button" onClick={hide} aria-label="Close code" className="grid size-9 place-items-center rounded-full bg-smoke text-lg hover:bg-accent hover:text-ink">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-auto overscroll-contain px-4 py-5 sm:px-6" tabIndex={0} aria-label={`Source of ${file.name}`}>
            <pre className="font-mono text-[0.78rem] leading-[1.65] text-[#d8d0c4] sm:text-[0.82rem]">
              <code ref={codeRef} dangerouslySetInnerHTML={{ __html: file.html }} />
            </pre>
          </div>
        </div>
      </div>
    </>
  );
}
