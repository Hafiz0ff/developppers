"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, ExternalLink, Sparkles, X } from "lucide-react";
import { ProjectVisualShowcase } from "../project-visual-showcase";
import { INITIAL_UNITS } from "@/lib/data/mock-db";
import { useLanguage } from "@/lib/i18n/language-context";

interface ProjectPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectName: string;
  coverImageUrl: string;
  images: string[];
  installmentMonths?: number;
  installmentDownPaymentPercent?: number;
  slug?: string;
}

export function ProjectPreviewModal({
  open,
  onOpenChange,
  projectName,
  coverImageUrl,
  images,
  installmentMonths = 24,
  installmentDownPaymentPercent = 30,
  slug = "sirdaryo-plaza",
}: ProjectPreviewModalProps) {
  const { language } = useLanguage();
  const isTg = language === "tg";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl p-0 overflow-hidden rounded-2xl border bg-card">
        {/* Preview Top Announcement Bar */}
        <div className="bg-emerald-600 text-white px-4 py-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span className="font-bold">
              {isTg ? "Реҷаи пешнамоиши витринаи 6D" : "Режим предпросмотра 6D-витрины"}
            </span>
            <span className="text-[11px] text-emerald-100 hidden sm:inline">
              {isTg
                ? "(Пеш аз интишор кори ҳамаи 6 қабати интерактивиро санҷед)"
                : "(Проверьте работу всех 6 интерактивных слоёв до публикации)"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`/projects/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-semibold underline hover:text-emerald-100 flex items-center gap-1"
            >
              {isTg ? "Кушодани саҳифаи витрина" : "Открыть страницу витрины"}
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        {/* Live Showcase Component */}
        <div className="p-4 sm:p-6 max-h-[85vh] overflow-y-auto space-y-4">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-foreground">{projectName}</h2>
            <p className="text-xs text-muted-foreground">
              {isTg
                ? "Муаррифии интерактивӣ барои харидорон бо гузариш байни аксҳо, нақшаи маҳалла, бурриши бино, намуд аз тирезаҳо ва нақшаҳо."
                : "Интерактивная презентация для покупателей с переключением фото, генплана, среза здания, видов из окон и планировок."}
            </p>
          </div>

          <ProjectVisualShowcase
            projectName={projectName}
            coverImageUrl={coverImageUrl}
            images={images}
            installmentMonths={installmentMonths}
            installmentDownPaymentPercent={installmentDownPaymentPercent}
            units={INITIAL_UNITS}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
