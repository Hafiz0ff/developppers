"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Eye,
  Layers,
  CheckCircle2,
  Plus,
  Trash2,
  Sparkles,
  Link2,
} from "lucide-react";

export function ProjectViewsLayoutsManager() {
  const [mappedNotification, setMappedNotification] = useState<string | null>(null);

  // Pool mapping state
  const [selectedLayoutType, setSelectedLayoutType] = useState("2-комнатная (68.4 м²)");
  const [targetSection, setTargetSection] = useState("Секция 1");
  const [targetFloorRange, setTargetFloorRange] = useState("3 — 12 этажи");
  const [targetRooms, setTargetRooms] = useState("2");

  const handleApplyPoolMapping = () => {
    setMappedNotification(
      `Планировка «${selectedLayoutType}» успешно привязана ко всем ${targetRooms}-комнатным квартирам (${targetSection}, ${targetFloorRange})!`
    );
    setTimeout(() => setMappedNotification(null), 4000);
  };

  const windowViews = [
    {
      id: "wv_1",
      title: "Панорама на набережную Сырдарьи",
      section: "Секция 1",
      floors: "4 — 16 этажи",
      direction: "Юго-Запад",
      imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&h=1000&fit=crop",
    },
    {
      id: "wv_2",
      title: "Тихий закрытый двор-парк без машин",
      section: "Секция 1 & 2",
      floors: "1 — 8 этажи",
      direction: "Восток",
      imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1600&h=1000&fit=crop",
    },
    {
      id: "wv_3",
      title: "Вид на Туркестанский хребет и горы",
      section: "Секция 2",
      floors: "9 — 16 этажи",
      direction: "Север",
      imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&h=1000&fit=crop",
    },
  ];

  const layouts = [
    {
      id: "lay_1",
      name: "1-комнатная квартира (Тип A)",
      area: 45.2,
      rooms: 1,
      imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop",
    },
    {
      id: "lay_2",
      name: "2-комнатная квартира (Тип B)",
      area: 68.4,
      rooms: 2,
      imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop",
    },
    {
      id: "lay_3",
      name: "3-комнатная квартира (Тип C)",
      area: 96.8,
      rooms: 3,
      imageUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=800&fit=crop",
    },
  ];

  return (
    <Card className="border shadow-xs">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Layers className="h-4 w-4 text-emerald-600" />
            Виды из окон и типовые планировки
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            3 планировки • 3 ракурса окон
          </Badge>
        </div>
        <CardDescription className="text-xs">
          Привязывайте чертежи планировок и фотографии видов из окон к конкретным квартирам или сразу ко всему пулу однотипных квартир.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-4 space-y-5">
        {mappedNotification && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{mappedNotification}</span>
          </div>
        )}

        {/* 1. Pool Mapping Mass Tool */}
        <div className="p-3.5 rounded-xl border bg-muted/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Link2 className="h-3.5 w-3.5 text-emerald-600" />
              Массовая привязка планировки к пулу квартир
            </span>
            <Badge className="bg-emerald-600 text-white text-[10px]">
              Экономия времени
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div className="space-y-1">
              <Label className="text-[11px] font-semibold">Выберите планировку</Label>
              <select
                value={selectedLayoutType}
                onChange={(e) => setSelectedLayoutType(e.target.value)}
                className="w-full h-8 text-xs bg-background border rounded-md px-2"
              >
                <option value="1-комнатная (45.2 м²)">1-комн. (45.2 м²)</option>
                <option value="2-комнатная (68.4 м²)">2-комн. (68.4 м²)</option>
                <option value="3-комнатная (96.8 м²)">3-комн. (96.8 м²)</option>
              </select>
            </div>

            <div className="space-y-1">
              <Label className="text-[11px] font-semibold">Подъезд / Секция</Label>
              <select
                value={targetSection}
                onChange={(e) => setTargetSection(e.target.value)}
                className="w-full h-8 text-xs bg-background border rounded-md px-2"
              >
                <option value="Секция 1">Секция 1</option>
                <option value="Секция 2">Секция 2</option>
                <option value="Все секции">Все секции</option>
              </select>
            </div>

            <div className="space-y-1">
              <Label className="text-[11px] font-semibold">Диапазон этажей</Label>
              <select
                value={targetFloorRange}
                onChange={(e) => setTargetFloorRange(e.target.value)}
                className="w-full h-8 text-xs bg-background border rounded-md px-2"
              >
                <option value="1 — 16 этажи">Все этажи (1 — 16)</option>
                <option value="1 — 4 этажи">Нижние (1 — 4)</option>
                <option value="3 — 12 этажи">Средние (3 — 12)</option>
                <option value="13 — 16 этажи">Верхние (13 — 16)</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button
                type="button"
                onClick={handleApplyPoolMapping}
                className="w-full h-8 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 cursor-pointer shadow-xs"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Привязать к пулу
              </Button>
            </div>
          </div>
        </div>

        {/* 2. Window Views List */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <Eye className="h-3.5 w-3.5 text-emerald-600" />
            Ракурсы видов из окон
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {windowViews.map((wv) => (
              <div
                key={wv.id}
                className="rounded-xl border bg-card overflow-hidden flex flex-col justify-between"
              >
                <div className="h-28 w-full relative bg-slate-900">
                  <img src={wv.imageUrl} alt={wv.title} className="w-full h-full object-cover" />
                  <Badge className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-md text-white text-[10px]">
                    {wv.direction}
                  </Badge>
                </div>
                <div className="p-3 space-y-1">
                  <div className="text-xs font-bold text-foreground leading-tight">{wv.title}</div>
                  <div className="text-[11px] text-muted-foreground">
                    {wv.section} • {wv.floors}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Blueprints List */}
        <div className="space-y-2 pt-2">
          <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5 text-emerald-600" />
            Типовые планировочные решения
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {layouts.map((lay) => (
              <div
                key={lay.id}
                className="rounded-xl border bg-card overflow-hidden flex flex-col justify-between p-3 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">{lay.name}</span>
                  <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-300">
                    {lay.area} м²
                  </Badge>
                </div>
                <div className="h-24 w-full rounded-lg overflow-hidden border bg-muted">
                  <img src={lay.imageUrl} alt={lay.name} className="w-full h-full object-cover" />
                </div>
                <div className="text-[11px] text-muted-foreground">
                  Экспликация: Кухня, Гостиная, Спальня, Санузел, Лоджия
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
