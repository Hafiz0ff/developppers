"use client";

import React, { useState, useMemo } from "react";
import { Eye, Compass, Mountain, Trees, Waves, Info } from "lucide-react";
import { useLanguage } from "@/context/language-context";

interface ViewAngle {
  id: string;
  title: string;
  direction: string;
  imageUrl: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

export function ShowcaseWindowView({ projectName }: { projectName: string }) {
  const { tDual } = useLanguage();
  const isQayroqum = projectName.toLowerCase().includes("qayroqum");

  const angles: ViewAngle[] = useMemo(() => {
    return isQayroqum
      ? [
          {
            id: "sea",
            title: tDual("Панорама на «Баҳри Тоҷик» (Кайраккум)", "Манзараи панорамӣ ба «Баҳри Тоҷик»"),
            direction: tDual("Юго-запад • 10-й этаж", "Ҷанубу Ғарб • ошёнаи 10-ум"),
            imageUrl: "/images/qayroqum/qayroqum-9.jpg",
            icon: Waves,
            description: tDual(
              "Прямой панорамный вид на водную гладь «Таджикского моря» (Кайраккумского водохранилища) и благоустроенную набережную зону отдыха.",
              "Манзараи зебои мустақим ба сатҳи оби «Баҳри Тоҷик» (обанбори Қайроққум) ва минтақаи ободу кабудизоркардашудаи соҳил."
            ),
          },
          {
            id: "courtyard",
            title: tDual("Внутренний ландшафтный парк", "Боғи зебоманзари дохилӣ"),
            direction: tDual("Восток • Закрытая территория", "Шарқ • Ҳудуди пӯшида"),
            imageUrl: "/images/qayroqum/qayroqum-3.jpg",
            icon: Trees,
            description: tDual(
              "Вид на собственный закрытый парк с фонтанами, детскими городками, спортивными площадками и прогулочными аллеями без машин.",
              "Манзара ба боғи хусусии пӯшида бо фаввораҳо, майдончаҳои бозии кӯдакон, майдончаҳои варзишӣ ва пайроҳаҳои сайругашти бе мошин."
            ),
          },
          {
            id: "architecture",
            title: tDual("Архитектурный ансамбль и горы", "Ансамбли меъморӣ ва кӯҳҳо"),
            direction: tDual("Север • Панорама", "Шимол • Панорама"),
            imageUrl: "/images/qayroqum/qayroqum-11.jpg",
            icon: Mountain,
            description: tDual(
              "Вид на современную архитектуру комплекса, горы Моголтау и шоссе Худжанд — Гулистон с утренним рассветным солнцем.",
              "Манзара ба меъмории муосири маҷмаа, кӯҳҳои Муғултоғ ва шоҳроҳи Хуҷанд — Гулистон бо нурҳои субҳгоҳии офтоб."
            ),
          },
        ]
      : [
          {
            id: "river",
            title: tDual("Панорама на Сырдарью", "Манзараи панорамӣ ба Сирдарё"),
            direction: tDual("Северо-запад • 12-й этаж", "Шимолу Ғарб • ошёнаи 12-ум"),
            imageUrl:
              "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600&h=1000&fit=crop",
            icon: Waves,
            description: tDual(
              "Прямой панорамный вид на гладь реки Сырдарья и благоустроенную прогулочную набережную. Закатное вечернее солнце.",
              "Манзараи мустақим ба оби Сирдарё ва гулгашти соҳилӣ. Офтоби зебои ҳангоми ғуруб."
            ),
          },
          {
            id: "courtyard",
            title: tDual("Внутренний зелёный двор", "Ҳавлии сабзи дохилӣ"),
            direction: tDual("Юг • Закрытая территория", "Ҷануб • Ҳудуди пӯшида"),
            imageUrl:
              "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&h=1000&fit=crop",
            icon: Trees,
            description: tDual(
              "Спокойный вид на охраняемый ландшафтный двор без машин, детские городки европейского стандарта и фонтан.",
              "Манзараи ором ба ҳавлии сабзи бе мошин ва таҳти посбонӣ, майдончаҳои бозии муосир ва фаввора."
            ),
          },
          {
            id: "mountains",
            title: tDual("Горы Моголтау и город", "Кӯҳҳои Муғултоғ ва шаҳр"),
            direction: tDual("Восток • Утренний рассвет", "Шарқ • Субҳи содиқ"),
            imageUrl:
              "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&h=1000&fit=crop",
            icon: Mountain,
            description: tDual(
              "Широкая перспектива на хребет Моголтау и историческую часть Худжанда с первыми лучами утреннего солнца.",
              "Манзараи фарох ба қаторкӯҳҳои Муғултоғ ва қисмати таърихии Хуҷанд бо нурҳои аввалини офтоб."
            ),
          },
        ];
  }, [isQayroqum, tDual]);

  const [activeAngleId, setActiveAngleId] = useState<string>(angles[0]?.id || "sea");
  const activeAngle = angles.find((a) => a.id === activeAngleId) || angles[0];

  return (
    <div className="relative w-full h-[360px] sm:h-[480px] bg-slate-950 overflow-hidden select-none">
      {/* 1. HIGH-RES WINDOW VIEW PHOTO */}
      <img
        src={activeAngle.imageUrl}
        alt={activeAngle.title}
        className="w-full h-full object-cover transition-opacity duration-500"
      />

      {/* Elegant Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-black/40 pointer-events-none" />

      {/* 2. TOP ANGLE SWITCHER TABS */}
      <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center gap-2 overflow-x-auto [scrollbar-width:none]">
        {angles.map((ang) => {
          const Icon = ang.icon;
          const isActive = activeAngle.id === ang.id;

          return (
            <button
              key={ang.id}
              type="button"
              onClick={() => setActiveAngleId(ang.id)}
              className={`h-9 px-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer shadow-md ${
                isActive
                  ? "bg-white text-slate-900 border border-white"
                  : "bg-black/40 hover:bg-black/60 text-white backdrop-blur-md border border-white/20"
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? "text-emerald-600" : "text-emerald-400"}`} />
              <span>{ang.title}</span>
            </button>
          );
        })}
      </div>

      {/* 3. BOTTOM INFO CARD */}
      <div className="absolute bottom-4 left-4 right-4 sm:right-auto max-w-lg p-3.5 sm:p-4 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-white/15 text-white shadow-xl space-y-1">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
          <Compass className="h-4 w-4" />
          <span>{activeAngle.direction}</span>
        </div>
        <h4 className="text-sm font-bold text-white">{activeAngle.title}</h4>
        <p className="text-xs text-slate-300 leading-relaxed pt-0.5">
          {activeAngle.description}
        </p>
      </div>
    </div>
  );
}
