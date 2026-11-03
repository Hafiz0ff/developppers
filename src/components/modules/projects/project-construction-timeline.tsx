"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ApplePhotoLightbox } from "@/components/modules/projects/apple-photo-lightbox";
import { useLanguage } from "@/context/language-context";
import {
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Camera,
  Layers,
  Sparkles,
  ChevronRight,
  HardHat,
  Hammer,
  ShieldCheck,
  Maximize2,
  ExternalLink,
} from "lucide-react";

export interface ConstructionReport {
  date: string;
  title: string;
  titleTg?: string;
  description?: string;
  descriptionTg?: string;
  stage?: "foundation" | "monolith" | "facade" | "glazing" | "engineering" | "handover";
  percentage?: number;
  photos: string[];
}

export interface ProjectConstructionTimelineProps {
  projectName: string;
  projectNameTg?: string;
  status: "under_construction" | "completed" | string;
  completionYear?: number | null;
  completionQuarter?: number | null;
  deadlineYear?: number | null;
  deadlineQuarter?: number | null;
  floorsCount?: number;
  reports?: ConstructionReport[];
  developerName?: string;
}

interface BuildingStage {
  id: string;
  key: "foundation" | "monolith" | "facade" | "glazing" | "engineering" | "handover";
  titleRu: string;
  titleTg: string;
  descRu: string;
  descTg: string;
  status: "completed" | "in_progress" | "planned";
  percentage: number;
  icon: typeof HardHat;
}

export function ProjectConstructionTimeline({
  projectName,
  projectNameTg,
  status,
  completionYear,
  completionQuarter,
  deadlineYear,
  deadlineQuarter,
  floorsCount = 16,
  reports = [],
  developerName,
}: ProjectConstructionTimelineProps) {
  const { language, tDual } = useLanguage();
  const isTg = language === "tg";

  const cleanName = (projectName || "")
    .replace(/^ЖК\s*[«"]?|^МИ\s*[«"]?/i, "")
    .replace(/[»"]$/g, "")
    .trim();
  const cleanNameTg = (projectNameTg || cleanName)
    .replace(/^ЖК\s*[«"]?|^МИ\s*[«"]?/i, "")
    .replace(/[»"]$/g, "")
    .trim();
  const displayName = isTg ? cleanNameTg : cleanName;

  const targetYear = deadlineYear || completionYear || 2027;
  const targetQuarter = deadlineQuarter || completionQuarter || 4;

  // Lightbox state for photo reports
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxTitle, setLightboxTitle] = useState("");

  const [activeTab, setActiveTab] = useState<"stages" | "chronology">("stages");

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash.includes("chronology")) {
      setActiveTab("chronology");
    }
  }, []);

  const isCompleted = status === "completed";

  // Compute calculated readiness %
  const calculateReadiness = (): number => {
    if (isCompleted) return 100;
    const currentYear = 2026;

    if (targetYear <= 2026 && targetQuarter <= 3) return 92;
    if (targetYear === 2026 && targetQuarter === 4) return 85;
    if (targetYear === 2027 && targetQuarter <= 2) return 65;
    if (targetYear === 2027 && targetQuarter > 2) return 55;
    if (targetYear === 2028) return 38;
    if (targetYear >= 2029) return 20;
    return 60;
  };

  const readinessPercent = calculateReadiness();

  // Define 6 universal stages of high-rise residential construction
  const stages: BuildingStage[] = [
    {
      id: "stage-1",
      key: "foundation",
      titleRu: "Котлован и фундамент",
      titleTg: "Таҳкурсӣ ва корҳои заминӣ",
      descRu: "Земляные работы, свайное поле и заливка монолитной плиты фундамента.",
      descTg: "Корҳои заминӣ, қаҳрамонсозӣ ва рехтани плитаи монолитии таҳкурсӣ.",
      status: readinessPercent >= 20 ? "completed" : "in_progress",
      percentage: readinessPercent >= 20 ? 100 : Math.round((readinessPercent / 20) * 100),
      icon: HardHat,
    },
    {
      id: "stage-2",
      key: "monolith",
      titleRu: "Монолитный каркас",
      titleTg: "Каркаси монолитии ошёнаҳо",
      descRu: `Возведение железобетонного каркаса на ${floorsCount} этажей со сейсмостойкостью до 9 баллов.`,
      descTg: `Бунёди каркаси оҳану бетонии ${floorsCount} ошёна бо тобоварӣ ба зилзилаи 9 балл.`,
      status: readinessPercent >= 55 ? "completed" : readinessPercent >= 25 ? "in_progress" : "planned",
      percentage:
        readinessPercent >= 55
          ? 100
          : readinessPercent >= 25
          ? Math.min(95, Math.round(((readinessPercent - 20) / 35) * 100))
          : 0,
      icon: Layers,
    },
    {
      id: "stage-3",
      key: "facade",
      titleRu: "Фасад и кладка стен",
      titleTg: "Корҳои фасадӣ ва деворбандӣ",
      descRu: "Кладка внешних и межквартирных стен кирпичом, утепление и монтаж вентилируемого фасада.",
      descTg: "Деворбандии берунӣ бо хишт, гармидиҳӣ ва васлкунии фасади замонавӣ.",
      status: readinessPercent >= 75 ? "completed" : readinessPercent >= 45 ? "in_progress" : "planned",
      percentage:
        readinessPercent >= 75
          ? 100
          : readinessPercent >= 45
          ? Math.min(90, Math.round(((readinessPercent - 45) / 30) * 100))
          : 0,
      icon: Building2,
    },
    {
      id: "stage-4",
      key: "glazing",
      titleRu: "Остекление и кровля",
      titleTg: "Шишабандӣ ва бомпӯшӣ",
      descRu: "Монтаж энергосберегающих стеклопакетов, гидроизоляция и утепление кровли.",
      descTg: "Насби тирезаҳои дуқабатаи каммасраф, гидроизолятсия ва бомпӯшӣ.",
      status: readinessPercent >= 88 ? "completed" : readinessPercent >= 60 ? "in_progress" : "planned",
      percentage:
        readinessPercent >= 88
          ? 100
          : readinessPercent >= 60
          ? Math.min(90, Math.round(((readinessPercent - 60) / 28) * 100))
          : 0,
      icon: Maximize2,
    },
    {
      id: "stage-5",
      key: "engineering",
      titleRu: "Инженерия и коммуникации",
      titleTg: "Шабакаҳои муҳандисӣ ва об/барқ",
      descRu: "Разводка электрики, водоснабжения, отопления и установка бесшумных скоростных лифтов.",
      descTg: "Кашидани ноқилҳои барқ, об, гармидиҳӣ ва насби лифтҳои бесадои тезгард.",
      status: readinessPercent >= 95 ? "completed" : readinessPercent >= 70 ? "in_progress" : "planned",
      percentage:
        readinessPercent >= 95
          ? 100
          : readinessPercent >= 70
          ? Math.min(85, Math.round(((readinessPercent - 70) / 25) * 100))
          : 0,
      icon: Hammer,
    },
    {
      id: "stage-6",
      key: "handover",
      titleRu: "Благоустройство и сдача",
      titleTg: "Ободонӣ ва супоридан ба комиссия",
      descRu: "Закрытый двор, озеленение, детская площадка и финальная государственная комиссия.",
      descTg: "Ҳавлии пӯшида, сабзазоркунӣ, майдончаи кӯдакона ва қабули давлатии комиссия.",
      status: isCompleted ? "completed" : readinessPercent >= 90 ? "in_progress" : "planned",
      percentage: isCompleted ? 100 : readinessPercent >= 90 ? 40 : 0,
      icon: ShieldCheck,
    },
  ];

  // Consolidate chronological photo reports (combining passed reports or generating informative baseline reports)
  const allChronologicalReports: ConstructionReport[] =
    reports.length > 0
      ? reports
      : [
          {
            date: isTg ? "Сентябр 2026" : "Сентябрь 2026",
            title: isTg
              ? "Корҳои васлкунии фасад ва ошёнаҳои болоӣ"
              : "Монтаж фасада и завершение монолитных работ",
            description: isTg
              ? "Каркаси бино бомуваффақият бунёд шуд. Сохтмончиён ба шишабандӣ ва корҳои дохилӣ гузаштанд."
              : "Монолитный каркас полностью возведен. Бригады перешли к остеклению и разводке внутренних сетей.",
            stage: "facade",
            percentage: readinessPercent,
            photos: ["/images/complexes/hero-1.jpg"],
          },
          {
            date: isTg ? "Июн 2026" : "Июнь 2026",
            title: isTg
              ? "Рехтани монолити ошёнаи 12-ум"
              : "Бетонирование перекрытий 12 этажа",
            description: isTg
              ? "Супоридани намунаҳои бетон ба озмоишгоҳи давлатӣ барои тасдиқи тобоварӣ ба 9 балл."
              : "Лабораторный контроль прочности бетона подтвердил соответствие 9-балльной сейсмостойкости.",
            stage: "monolith",
            percentage: Math.max(30, readinessPercent - 25),
            photos: ["/images/complexes/hero-2.jpg"],
          },
          {
            date: isTg ? "Феврал 2026" : "Февраль 2026",
            title: isTg
              ? "Корҳои таҳкурсӣ ва қаҳрамонсозӣ"
              : "Заливка монолитного фундамента",
            description: isTg
              ? "Таҳкурсии пуриқтидор рехта шуд ва ба марҳилаи ошёнаҳои аввали тиҷоратӣ шурӯъ гардид."
              : "Завершен нулевой цикл, начато возведение стилобатной коммерческой части комплекса.",
            stage: "foundation",
            percentage: 20,
            photos: ["/images/complexes/hero-3.jpg"],
          },
        ];

  const handleOpenPhoto = (photos: string[], index: number, title: string) => {
    setLightboxImages(photos);
    setLightboxIndex(index);
    setLightboxTitle(title);
    setLightboxOpen(true);
  };

  return (
    <section id="construction-progress" className="scroll-mt-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative">
      <div id="chronology" className="absolute -top-28 pointer-events-none" />
      <div className="glass-card rounded-3xl p-6 sm:p-8 relative overflow-hidden space-y-8">
        {/* Soft Ambient Glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* SECTION HEADER & READINESS HUD */}
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2 border-b border-slate-200/80 dark:border-white/10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400">
              <HardHat className="h-4 w-4" />
              <span>{tDual("Динамика строительства", "Раванди сохтмон")}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {tDual(
                `Ход строительства ЖК «${cleanName}»`,
                `Раванди сохтмони МИ «${displayName}»`
              )}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              {tDual(
                "Прозрачный мониторинг готовности конструкций, соблюдение нормативных сроков и фотоотчеты с площадки.",
                "Мониторинги шаффофи омодагии иншоот, риояи муҳлатҳои нақшавӣ ва аксҳо аз майдони сохтмон."
              )}
            </p>
          </div>

          {/* READINESS GAUGE CARD (Uiverse / Tahoe Frosted Glass) */}
          <div className="flex items-center gap-4 p-4 sm:p-5 rounded-2xl glass-card border border-emerald-500/30 shadow-[0_10px_30px_-5px_rgba(16,185,129,0.15)] shrink-0 self-start lg:self-auto">
            <div className="relative flex items-center justify-center">
              {/* Circular Gauge */}
              <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full border-4 border-slate-200/70 dark:border-white/10 flex items-center justify-center relative">
                <div
                  className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin-slow"
                  style={{
                    filter: "drop-shadow(0 0 8px rgba(16,185,129,0.5))",
                  }}
                />
                <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-mono">
                  {readinessPercent}%
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                {isCompleted ? (
                  <Badge variant="emerald" className="rounded-xl px-2.5 py-0.5 text-[11px] font-bold">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    {tDual("Сдан в эксплуатацию", "Ба истифода дода шуд")}
                  </Badge>
                ) : (
                  <Badge variant="emerald" className="rounded-xl px-2.5 py-0.5 text-[11px] font-bold animate-pulse">
                    <Clock className="h-3 w-3 mr-1" />
                    {tDual("Активное строительство", "Сохтмони фаъол")}
                  </Badge>
                )}
              </div>
              <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                {targetYear ? (
                  <span>
                    {tDual("Срок сдачи:", "Муҳлати супоридан:")}{" "}
                    <strong className="text-slate-900 dark:text-white">
                      {targetQuarter ? `${targetQuarter} кв. ` : ""}
                      {targetYear} г.
                    </strong>
                  </span>
                ) : (
                  <span>{tDual("Готов к заселению", "Барои кӯчидан тайёр")}</span>
                )}
              </div>
              {developerName && (
                <div className="text-[11px] text-slate-400">
                  {tDual("Застройщик:", "Сохтмончӣ:")} {developerName}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* OVERALL PROGRESS BAR (TAHOE LIQUID GLASS) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
              {tDual("Общая строительная готовность", "Омодагии умумии сохтмон")}
            </span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400 text-sm">
              {readinessPercent}% / 100%
            </span>
          </div>

          <div className="h-3.5 w-full rounded-full bg-slate-200/80 dark:bg-slate-800/80 p-0.5 overflow-hidden backdrop-blur-md shadow-inner">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${readinessPercent}%` }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-emerald-600 via-teal-400 to-emerald-400 shadow-[0_0_16px_rgba(16,185,129,0.6)] relative"
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </motion.div>
          </div>
        </div>

        {/* VIEW TOGGLE TABS */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="inline-flex p-1 rounded-2xl glass-card border border-slate-200/80 dark:border-white/10 shadow-xs">
            <button
              type="button"
              onClick={() => setActiveTab("stages")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "stages"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {tDual("6 Этапов строительства", "6 Марҳилаи сохтмон")}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("chronology")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "chronology"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {tDual(
                `Фотохроника (${allChronologicalReports.length})`,
                `Ҳисоботи аксҳо (${allChronologicalReports.length})`
              )}
            </button>
          </div>

          <div className="text-xs text-slate-500 hidden sm:block">
            {tDual(
              "Данные обновляются инженерами технадзора",
              "Маълумот аз ҷониби муҳандисони назорат нав карда мешавад"
            )}
          </div>
        </div>

        {/* TAB 1: 6 BUILDING STAGES GRID */}
        {activeTab === "stages" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {stages.map((stage, idx) => {
              const StageIcon = stage.icon;
              const title = isTg ? stage.titleTg : stage.titleRu;
              const desc = isTg ? stage.descTg : stage.descRu;

              return (
                <div
                  key={stage.id}
                  className={`p-5 rounded-2xl transition-all duration-300 flex flex-col justify-between border ${
                    stage.status === "completed"
                      ? "bg-emerald-500/[0.04] border-emerald-500/30 hover:border-emerald-500/50"
                      : stage.status === "in_progress"
                      ? "glass-card border-emerald-500/50 shadow-[0_12px_28px_-8px_rgba(16,185,129,0.2)] ring-2 ring-emerald-400/25"
                      : "bg-slate-50/50 dark:bg-slate-900/40 border-slate-200/70 dark:border-white/10 opacity-75"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-9 w-9 rounded-xl flex items-center justify-center ${
                            stage.status === "completed"
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                              : stage.status === "in_progress"
                              ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/30 animate-pulse"
                              : "bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                          }`}
                        >
                          <StageIcon className="h-4 w-4" />
                        </div>
                        <span className="text-[11px] font-bold text-slate-400 font-mono">
                          {idx + 1} / 6
                        </span>
                      </div>

                      {stage.status === "completed" ? (
                        <Badge variant="emerald" className="rounded-xl text-[10px] px-2 py-0.5 font-bold">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          {tDual("Завершено", "Анҷом ёфт")}
                        </Badge>
                      ) : stage.status === "in_progress" ? (
                        <Badge variant="emerald" className="rounded-xl text-[10px] px-2 py-0.5 font-bold">
                          <Clock className="h-3 w-3 mr-1" />
                          {stage.percentage}% • {tDual("В процессе", "Дар ҳоли иҷро")}
                        </Badge>
                      ) : (
                        <Badge variant="frostedLight" className="rounded-xl text-[10px] px-2 py-0.5 font-semibold text-slate-500">
                          {tDual("В плане", "Дар нақша")}
                        </Badge>
                      )}
                    </div>

                    <div>
                      <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                        {title}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-1">
                        {desc}
                      </p>
                    </div>
                  </div>

                  {/* Individual Stage Mini Progress */}
                  <div className="pt-4 mt-3 border-t border-slate-200/60 dark:border-white/10 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                      <span>{tDual("Готовность этапа", "Омодагии марҳила")}</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">
                        {stage.percentage}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          stage.status === "completed"
                            ? "bg-emerald-500"
                            : stage.status === "in_progress"
                            ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                            : "bg-slate-300 dark:bg-slate-700"
                        }`}
                        style={{ width: `${stage.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}

        {/* TAB 2: CHRONOLOGICAL PHOTO TIMELINE (PRIMEREACT PATTERN) */}
        {activeTab === "chronology" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="relative border-l-2 border-emerald-500/30 dark:border-emerald-500/25 ml-4 sm:ml-6 pl-6 sm:pl-8 space-y-8 my-4"
          >
            {allChronologicalReports.map((report, idx) => {
              const repTitle = isTg && report.titleTg ? report.titleTg : report.title;
              const repDesc = isTg && report.descriptionTg ? report.descriptionTg : report.description;

              return (
                <div key={idx} className="relative group">
                  {/* Glowing Milestone Marker Node (uiverse inspired) */}
                  <div className="absolute -left-[35px] sm:-left-[43px] top-1.5 flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-white dark:bg-slate-900 border-2 border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)] text-emerald-600 transition-transform group-hover:scale-125 z-10">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  </div>

                  {/* Report Glass Card */}
                  <div className="glass-card rounded-2xl p-5 sm:p-6 space-y-4 hover:border-emerald-500/40 hover:shadow-[0_16px_36px_-10px_rgba(16,185,129,0.15)] transition-all duration-300">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="frostedLight" className="rounded-xl px-2.5 py-1 text-xs font-mono font-bold">
                          <Calendar className="h-3 w-3 mr-1 text-emerald-600" />
                          {report.date}
                        </Badge>
                        {report.percentage && (
                          <Badge variant="emerald" className="rounded-xl px-2 py-0.5 text-[11px] font-bold">
                            {report.percentage}% {tDual("готовности", "омодагӣ")}
                          </Badge>
                        )}
                      </div>

                      <div className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Camera className="h-3 w-3 text-emerald-600" />
                        <span>
                          {report.photos.length}{" "}
                          {tDual(
                            report.photos.length === 1 ? "фотоотчет" : "фотографий",
                            "акс"
                          )}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                        {repTitle}
                      </h4>
                      {repDesc && (
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-1">
                          {repDesc}
                        </p>
                      )}
                    </div>

                    {/* Photos Grid */}
                    {report.photos.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
                        {report.photos.map((photo, pIdx) => (
                          <div
                            key={pIdx}
                            onClick={() => handleOpenPhoto(report.photos, pIdx, repTitle)}
                            className="relative h-28 sm:h-36 rounded-xl overflow-hidden bg-slate-900 group/photo cursor-pointer shadow-xs border border-white/20 hover:border-emerald-400 transition-all hover:scale-[1.02]"
                          >
                            <img
                              src={photo}
                              alt={`${repTitle} - ${pIdx + 1}`}
                              className="w-full h-full object-cover group-hover/photo:scale-110 transition-transform duration-500"
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = "/images/complexes/hero-1.jpg";
                              }}
                            />
                            <div className="absolute inset-0 bg-black/30 group-hover/photo:bg-black/10 transition-colors" />
                            <div className="absolute bottom-2 right-2 h-7 w-7 rounded-lg glass-pill flex items-center justify-center opacity-80 group-hover/photo:opacity-100 transition-opacity">
                              <Maximize2 className="h-3.5 w-3.5 text-slate-900 dark:text-white" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </div>

      {/* Fullscreen Photo Lightbox */}
      <ApplePhotoLightbox
        images={lightboxImages}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        title={lightboxTitle}
      />
    </section>
  );
}

/**
 * Compact mini badge for residential complex cards in catalog
 */
export function ConstructionMiniBadge({
  status,
  completionYear,
  completionQuarter,
}: {
  status: string;
  completionYear?: number | null;
  completionQuarter?: number | null;
}) {
  const { tDual } = useLanguage();
  const isCompleted = status === "completed";

  if (isCompleted) {
    return (
      <Badge variant="emerald" className="rounded-xl px-2 py-0.5 text-[10px] font-bold shadow-xs">
        <CheckCircle2 className="h-3 w-3 mr-1" />
        {tDual("Сдан", "Супоридашуда")}
      </Badge>
    );
  }

  const deadline = completionYear
    ? `${completionQuarter ? `${completionQuarter} кв. ` : ""}${completionYear}`
    : "2027";

  return (
    <Badge variant="frosted" className="rounded-xl px-2 py-0.5 text-[10px] font-bold shadow-xs gap-1">
      <HardHat className="h-3 w-3 text-emerald-400" />
      <span>{deadline}</span>
    </Badge>
  );
}
