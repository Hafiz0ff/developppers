"use client";

import React, { useEffect, useState } from "react";
import { ProjectDocument } from "@/types/documents";
import { useLanguage } from "@/context/language-context";
import { formatDocumentDate, formatFileSize } from "@/lib/documents";
import {
  X,
  Download,
  ExternalLink,
  ShieldCheck,
  FileText,
  Calendar,
  AlertCircle,
  Eye,
  ZoomIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PdfViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: ProjectDocument | null;
  projectName: string;
  isWatermarkEnabled?: boolean;
  watermarkText?: string;
  watermarkOpacity?: number;
}

export function PdfViewerModal({
  isOpen,
  onClose,
  document: doc,
  projectName,
  isWatermarkEnabled = false,
  watermarkText,
  watermarkOpacity = 0.18,
}: PdfViewerModalProps) {
  const { language, tDual } = useLanguage();
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setLoadError(false);
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !doc) return null;

  const docTitle = language === "tg" && doc.titleTg ? doc.titleTg : doc.title;
  const publishedDateFormatted = formatDocumentDate(doc.publishedAt);
  const sizeFormatted = formatFileSize(doc.fileSizeKb);

  const effectiveWatermark =
    watermarkText ||
    (language === "tg"
      ? `${projectName} • Танҳо барои шиносоӣ`
      : `${projectName} • Только для ознакомления`);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-5xl h-[92vh] flex flex-col rounded-3xl bg-background border border-border shadow-2xl overflow-hidden">
        {/* Top Header Bar */}
        <div className="p-4 sm:p-5 border-b border-border bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="bg-rose-500/10 text-rose-600 border-rose-200 text-[10px] font-mono py-0">
                PDF • {sizeFormatted}
              </Badge>
              {doc.documentNumber && (
                <span className="text-[11px] font-mono text-muted-foreground">
                  № {doc.documentNumber}
                </span>
              )}
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {tDual("Размещён:", "Нашр:")} {publishedDateFormatted}
              </span>
            </div>

            <h3 className="font-extrabold text-base sm:text-lg text-foreground truncate" title={docTitle}>
              {docTitle}
            </h3>
          </div>

          {/* Action Buttons: Open in Tab, Download & Close */}
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            <a
              href={doc.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-border hover:bg-muted text-foreground text-xs font-semibold transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{tDual("В новой вкладке", "Дар равзанаи нав")}</span>
            </a>

            <a
              href={doc.fileUrl}
              download
              className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{tDual("Скачать оригинал", "Боргирии аслӣ")}</span>
            </a>

            <button
              type="button"
              onClick={onClose}
              aria-label="Закрыть просмотр"
              className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer ml-1"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* PDF Document Container with Optional Watermark Layer */}
        <div className="relative flex-1 w-full bg-slate-900/95 overflow-hidden flex items-center justify-center">
          {loadError ? (
            <div className="p-8 max-w-md text-center space-y-3 bg-card rounded-2xl border border-border shadow-md text-xs">
              <AlertCircle className="h-8 w-8 text-amber-500 mx-auto" />
              <h4 className="font-bold text-sm text-foreground">
                {tDual("Документ открывается в новой вкладке", "Ҳуҷҷат дар равзанаи нав кушода мешавад")}
              </h4>
              <p className="text-muted-foreground leading-relaxed">
                {tDual(
                  "Ваш браузер или устройство оптимизированы для открытия PDF в отдельной вкладке.",
                  "Браузери шумо ҳуҷҷатҳои PDF-ро дар равзанаи алоҳида беҳтар намоиш медиҳад."
                )}
              </p>
              <div className="pt-2 flex justify-center gap-2">
                <a
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 h-9 px-4 rounded-xl bg-emerald-600 text-white font-semibold text-xs"
                >
                  <ExternalLink className="h-4 w-4" />
                  {tDual("Открыть документ", "Кушодани ҳуҷҷат")}
                </a>
              </div>
            </div>
          ) : (
            <iframe
              src={`${doc.fileUrl}#toolbar=0&navpanes=0`}
              title={docTitle}
              onError={() => setLoadError(true)}
              className="w-full h-full border-none bg-white"
            />
          )}

          {/* Protective Watermark Layer (Semi-transparent, non-obscuring) */}
          {isWatermarkEnabled && !loadError && (
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none select-none overflow-hidden flex items-center justify-center"
              style={{ opacity: watermarkOpacity }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-24 gap-x-16 w-[140%] h-[140%] -rotate-25 items-center justify-items-center">
                {Array.from({ length: 8 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="text-slate-800 dark:text-slate-200 font-extrabold text-sm sm:text-base tracking-widest uppercase border border-slate-700/20 px-4 py-1.5 rounded-lg whitespace-nowrap shadow-xs"
                  >
                    {effectiveWatermark}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Notification */}
        <div className="px-4 py-2.5 bg-muted/30 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground shrink-0">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            <span>
              {tDual(
                "Официальный электронный образ документа, предоставленный застройщиком",
                "Нусхаи расмии электронии ҳуҷҷат, ки аз ҷониби сохтмончӣ пешниҳод шудааст"
              )}
            </span>
          </div>

          {isWatermarkEnabled && (
            <span className="text-[10px] text-muted-foreground hidden sm:inline font-mono">
              {tDual("Защищено водяным знаком", "Бо нишонаи обӣ ҳифзшуда")}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
