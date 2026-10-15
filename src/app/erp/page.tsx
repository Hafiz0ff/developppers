import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Devcore ERP — Управление строительной компанией | Маскани",
  description: "Современная ERP-платформа для застройщиков и строительных холдингов",
};

export default function ErpDemoPage() {
  return (
    <div className="w-full h-screen bg-slate-950 flex flex-col overflow-hidden">
      {/* Top Banner with Navigation */}
      <header className="h-10 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between text-xs text-white shrink-0 z-50">
        <div className="flex items-center gap-3">
          <a
            href="/developer-admin"
            className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors font-semibold text-[11px]"
          >
            ← В кабинет Маскани
          </a>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="font-bold text-emerald-400 flex items-center gap-1.5 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            DEVCORE ERP · ДЕМО ДЛЯ ЗАСТРОЙЩИКОВ
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            ENTERPRISE МОДУЛЬ
          </span>
          <a
            href="/erp/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-300 hover:text-white px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-600 transition-colors"
          >
            <span>На весь экран</span>
            <span>↗</span>
          </a>
        </div>
      </header>

      {/* Fullscreen Embedded ERP Application */}
      <iframe
        src="/erp/"
        className="w-full flex-1 border-0"
        title="Devcore ERP - Платформа управления строительной компанией"
      />
    </div>
  );
}
