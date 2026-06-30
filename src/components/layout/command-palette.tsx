"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowRight, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { commandItems, filterCommandItems } from "@/components/layout/command-palette-data";
import { cn } from "@/lib/utils/cn";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const filtered = useMemo(() => filterCommandItems(commandItems, query), [query]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }

      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setQuery("");
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const runFirst = () => {
    const first = filtered[0];

    if (first) {
      router.push(first.href);
      setOpen(false);
    }
  };

  return (
    <>
      <Button className="hidden min-w-64 justify-between border-cyan-200/10 bg-white/[0.03] text-slate-400 hover:bg-white/[0.06] hover:text-cyan-100 lg:inline-flex" onClick={() => setOpen(true)} variant="outline">
        <span className="flex items-center gap-2">
          <Search className="h-4 w-4" aria-hidden="true" />
          Buscar o saltar a...
        </span>
        <span className="rounded border border-cyan-200/10 bg-slate-950/70 px-1.5 py-0.5 text-[11px] text-slate-500">Ctrl K</span>
      </Button>
      <Button aria-label="Abrir comandos" className="lg:hidden" onClick={() => setOpen(true)} size="icon" variant="outline">
        <Search className="h-4 w-4" aria-hidden="true" />
      </Button>

      {open ? (
        <div className="fixed inset-0 z-50 bg-slate-950/68 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Paleta de comandos">
          <div className="motion-enter mx-auto mt-20 w-full max-w-2xl overflow-hidden rounded-xl border border-white/15 bg-slate-950 text-white shadow-2xl">
            <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
              <Search className="h-4 w-4 text-cyan-200" aria-hidden="true" />
              <input
                ref={inputRef}
                className="h-10 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    runFirst();
                  }
                }}
                placeholder="Ir a dashboard, crear obligacion, subir documento..."
              />
              <button className="rounded-md p-2 text-slate-300 hover:bg-white/10 hover:text-white" onClick={() => setOpen(false)} type="button">
                <X className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">Cerrar</span>
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <p className="px-3 py-8 text-center text-sm text-slate-300">No hay comandos para esa busqueda.</p>
              ) : (
                filtered.map((item) => (
                  <Link
                    className={cn(
                      "group flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-slate-200 transition-colors hover:bg-white/10 hover:text-white focus-visible:bg-white/10"
                    )}
                    href={item.href}
                    key={item.id}
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-md border border-cyan-200/20 bg-cyan-200/10 text-cyan-100">
                      <item.icon className="h-4 w-4" aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-medium">{item.label}</span>
                      <span className="block text-xs text-slate-400">{item.hint}</span>
                    </span>
                    <ArrowRight className="h-4 w-4 text-slate-500 transition-transform group-hover:translate-x-0.5 group-hover:text-cyan-100" aria-hidden />
                  </Link>
                ))
              )}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 px-4 py-3 text-xs text-slate-400">
              <span>Enter ejecuta el primer resultado</span>
              <span>Esc cierra</span>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
