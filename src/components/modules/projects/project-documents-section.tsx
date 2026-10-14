"use client";

import React, { useState } from "react";
import { ProjectDocument, ProjectDocumentsConfig } from "@/types/documents";
import { useLanguage } from "@/context/language-context";
import { formatDocumentDate, formatFileSize } from "@/lib/documents";
import {
  FileText,
  ExternalLink,
  Download,
  ShieldCheck,
  Calendar,
  FileCheck2,
  AlertCircle,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PdfViewerModal } from "./pdf-viewer-modal";

interface ProjectDocumentsSectionProps {
  projectName: string;
  config?: ProjectDocumentsConfig;
  documents?: ProjectDocument[];
  onViewDocument?: (doc: ProjectDocument) => void;
}

export function ProjectDocumentsSection({
  projectName,
  config,
  documents = [],
  onViewDocument,
}: ProjectDocumentsSectionProps) {
  const { language, tDual } = useLanguage();
  const [activeDocForModal, setActiveDocForModal] = useState<ProjectDocument | null>(null);

  // Strict visibility rule: if disabled or not configured -> DO NOT render
  if (!config || !config.isEnabled) {
    return null;
  }

  // Filter only published documents
  const publishedDocs = documents.filter((d) => d.isPublished);

  // If no published documents exist, never render empty block
  if (publishedDocs.length === 0) {
    return null;
  }

  const titlePrefix =
    language === "tg" && config.titlePrefixTg
      ? config.titlePrefixTg
      : config.titlePrefix || "Документы";

  const fullTitle = `${titlePrefix} — ${projectName}`;

  const handleOpenPdf = (doc: ProjectDocument) => {
    if (onViewDocument) {
      onViewDocument(doc);
      return;
    }
    setActiveDocForModal(doc);
  };

  return (
    <section id="documents-section" className="container mx-auto px-4 py-4 space-y-6">
      <div className="rounded-3xl border border-slate-200/80 bg-linear-to-b from-slate-50/70 via-white to-slate-50/40 dark:from-slate-900/40 dark:via-background dark:to-slate-900/20 p-6 sm:p-8 shadow-sm space-y-6">
        {/* Header with Title and Verification Pill */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200/60 dark:border-slate-800">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600">
              <div className="p-1 rounded-md bg-emerald-500/10 text-emerald-600">
                <FileCheck2 className="h-4 w-4" />
              </div>
              <span>{tDual("Разрешительная документация", "Ҳуҷҷатҳои иҷозатдиҳӣ")}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              {fullTitle}
            </h2>

            <p className="text-xs sm:text-sm text-muted-foreground">
              {tDual(
                "Официальные заключения государственных органов, разрешения на строительство и ввод в эксплуатацию",
                "Хулосаҳои расмии мақомоти давлатӣ, иҷозатномаи сохтмон ва ба истифода додан"
              )}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 text-xs py-1 px-3">
              <ShieldCheck className="h-3.5 w-3.5 mr-1.5 text-emerald-600" />
              {tDual("Юридически проверено", "Аз ҷиҳати ҳуқуқӣ тасдиқшуда")}
            </Badge>
          </div>
        </div>

        {/* List of Published Documents */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {publishedDocs.map((doc) => {
            const docTitle = language === "tg" && doc.titleTg ? doc.titleTg : doc.title;
            const publishedDateFormatted = formatDocumentDate(doc.publishedAt);
            const sizeFormatted = formatFileSize(doc.fileSizeKb);

            return (
              <div
                key={doc.id}
                className="group relative flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-400 hover:shadow-md transition-all space-y-4"
              >
                {/* Top Section: File Icon, Title & Number */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    {/* PDF Icon Badge */}
                    <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 shrink-0 font-mono font-bold text-xs flex items-center gap-1.5">
                      <FileText className="h-4 w-4" />
                      <span>PDF</span>
                    </div>

                    {/* File Size */}
                    <span className="text-[11px] font-mono text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-md">
                      {sizeFormatted}
                    </span>
                  </div>

                  <div>
                    <h3
                      onClick={() => handleOpenPdf(doc)}
                      className="font-bold text-sm text-foreground group-hover:text-emerald-600 transition-colors cursor-pointer line-clamp-2 leading-snug"
                      title={docTitle}
                    >
                      {docTitle}
                    </h3>

                    {doc.documentNumber && (
                      <span className="text-[11px] font-mono text-muted-foreground block mt-1">
                        № {doc.documentNumber}
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Section: Publication Date & Action Buttons */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-slate-400" />
                      <span>{tDual("Дата размещения:", "Санаи нашр:")}</span>
                    </span>
                    <strong className="text-foreground font-semibold">
                      {publishedDateFormatted}
                    </strong>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <Button
                      type="button"
                      onClick={() => handleOpenPdf(doc)}
                      className="w-full h-9 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-xs gap-1.5 shadow-2xs transition-all cursor-pointer"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>{tDual("Открыть PDF", "Кушодани PDF")}</span>
                      <ExternalLink className="h-3 w-3 ml-0.5 opacity-80" />
                    </Button>

                    <a
                      href={doc.fileUrl}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      title={tDual("Скачать оригинал", "Боргирии аслӣ")}
                      className="inline-flex items-center justify-center h-9 w-9 rounded-xl border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors shrink-0"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* PDF Secure Viewer Modal with Watermark */}
      <PdfViewerModal
        isOpen={Boolean(activeDocForModal)}
        onClose={() => setActiveDocForModal(null)}
        document={activeDocForModal}
        projectName={projectName}
        isWatermarkEnabled={config.isWatermarkEnabled}
        watermarkText={config.watermarkText}
        watermarkOpacity={config.watermarkOpacity}
      />
    </section>
  );
}
