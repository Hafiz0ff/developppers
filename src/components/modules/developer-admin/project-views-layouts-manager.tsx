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
import { useLanguage } from "@/lib/i18n/language-context";

export function ProjectViewsLayoutsManager() {
  const { language } = useLanguage();
  const isTg = language === "tg";
  const [mappedNotification, setMappedNotification] = useState<string | null>(null);

  // Pool mapping state
  const [selectedLayoutType, setSelectedLayoutType] = useState(
    isTg ? "2-ҳуҷрагӣ (68.4 м²)" : "2-комнатная (68.4 м²)"
  );
  const [targetSection, setTargetSection] = useState(isTg ? "Бахши 1" : "Секция 1");
  const [targetFloorRange, setTargetFloorRange] = useState(isTg ? "Ошёнаҳои 3 — 12" : "3 — 12 этажи");
  const [targetRooms, setTargetRooms] = useState("2");

  const handleApplyPoolMapping = () => {
    setMappedNotification(
      isTg
        ? `Нақшаи «${selectedLayoutType}» ба ҳамаи хонаҳои ${targetRooms}-ҳуҷрагӣ (${targetSection}, ${targetFloorRange}) бомуваффақият пайваст карда шуд!`
        : `Планировка «${selectedLayoutType}» успешно привязана ко всем ${targetRooms}-комнатным квартирам (${targetSection}, ${targetFloorRange})!`
    );
    setTimeout(() => setMappedNotification(null), 4000);
  };

  const windowViews = [
    {
      id: "wv_1",
      title: isTg ? "Манзараи соҳили Сирдарё" : "Панорама на набережную Сырдарьи",
      section: isTg ? "Бахши 1" : "Секция 1",
      floors: isTg ? "Ошёнаҳои 4 — 16" : "4 — 16 этажи",
      direction: isTg ? "Ҷанубу Ғарб" : "Юго-Запад",
      imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&h=1000&fit=crop",
    },
    {
      id: "wv_2",
      title: isTg ? "Ҳавлии орому маҳфуз бидуни мошинҳо" : "Тихий закрытый двор-парк без машин",
      section: isTg ? "Бахши 1 & 2" : "Секция 1 & 2",
      floors: isTg ? "Ошёнаҳои 1 — 8" : "1 — 8 этажи",
      direction: isTg ? "Шарқ" : "Восток",
      imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1600&h=1000&fit=crop",
    },
    {
      id: "wv_3",
      title: isTg ? "Манзара ба қаторкӯҳҳои Туркистон" : "Вид на Туркестанский хребет и горы",
      section: isTg ? "Бахши 2" : "Секция 2",
      floors: isTg ? "Ошёнаҳои 9 — 16" : "9 — 16 этажи",
      direction: isTg ? "Шимол" : "Север",
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
            {isTg ? "Намудҳо аз тиреза ва нақшаҳои намунавӣ" : "Виды из окон и типовые планировки"}
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {isTg ? "3 нақша • 3 зовияи тиреза" : "3 планировки • 3 ракурса окон"}
          </Badge>
        </div>
        <CardDescription className="text-xs">
          {isTg
            ? "Нақшаҳои хонаҳо ва аксҳои намуд аз тирезаро ба манзилҳои мушаххас ё ба тамоми пули хонаҳои якхела пайваст намоед."
            : "Привязывайте чертежи планировок и фотографии видов из окон к конкретным квартирам или сразу ко всему пулу однотипных квартир."}
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
              {isTg
                ? "Пайвасткунии оммавии нақша ба пули хонаҳо"
                : "Массовая привязка планировки к пулу квартир"}
            </span>
            <Badge className="bg-emerald-600 text-white text-[10px]">
              {isTg ? "Сарфаи вақт" : "Экономия времени"}
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div className="space-y-1">
              <Label className="text-[11px] font-semibold">
                {isTg ? "Нақшаро интихоб кунед" : "Выберите планировку"}
              </Label>
              <select
                value={selectedLayoutType}
                onChange={(e) => setSelectedLayoutType(e.target.value)}
                className="w-full h-8 text-xs bg-background border rounded-md px-2"
              >
                <option value="1-комнатная (45.2 м²)">
                  {isTg ? "1-ҳуҷр. (45.2 м²)" : "1-комн. (45.2 м²)"}
                </option>
                <option value="2-комнатная (68.4 м²)">
                  {isTg ? "2-ҳуҷр. (68.4 м²)" : "2-комн. (68.4 м²)"}
                </option>
                <option value="3-комнатная (96.8 м²)">
                  {isTg ? "3-ҳуҷр. (96.8 м²)" : "3-комн. (96.8 м²)"}
                </option>
              </select>
            </div>

            <div className="space-y-1">
              <Label className="text-[11px] font-semibold">
                {isTg ? "Даромадгоҳ / Бахш" : "Подъезд / Секция"}
              </Label>
              <select
                value={targetSection}
                onChange={(e) => setTargetSection(e.target.value)}
                className="w-full h-8 text-xs bg-background border rounded-md px-2"
              >
                <option value="Секция 1">{isTg ? "Бахши 1" : "Секция 1"}</option>
                <option value="Секция 2">{isTg ? "Бахши 2" : "Секция 2"}</option>
                <option value="Все секции">{isTg ? "Ҳамаи бахшҳо" : "Все секции"}</option>
              </select>
            </div>

            <div className="space-y-1">
              <Label className="text-[11px] font-semibold">
                {isTg ? "Фосилаи ошёнаҳо" : "Диапазон этажей"}
              </Label>
              <select
                value={targetFloorRange}
                onChange={(e) => setTargetFloorRange(e.target.value)}
                className="w-full h-8 text-xs bg-background border rounded-md px-2"
              >
                <option value="1 — 16 этажи">
                  {isTg ? "Ҳамаи ошёнаҳо (1 — 16)" : "Все этажи (1 — 16)"}
                </option>
                <option value="1 — 4 этажи">
                  {isTg ? "Поёнӣ (1 — 4)" : "Нижние (1 — 4)"}
                </option>
                <option value="3 — 12 этажи">
                  {isTg ? "Миёна (3 — 12)" : "Средние (3 — 12)"}
                </option>
                <option value="13 — 16 этажи">
                  {isTg ? "Болоӣ (13 — 16)" : "Верхние (13 — 16)"}
                </option>
              </select>
            </div>

            <div className="flex items-end">
              <Button
                type="button"
                onClick={handleApplyPoolMapping}
                className="w-full h-8 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 cursor-pointer shadow-xs"
              >
                <Sparkles className="h-3.5 w-3.5" />
                {isTg ? "Ба пул пайваст кардан" : "Привязать к пулу"}
              </Button>
            </div>
          </div>
        </div>

        {/* 2. Window Views List */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <Eye className="h-3.5 w-3.5 text-emerald-600" />
            {isTg ? "Зовияҳои намуд аз тиреза" : "Ракурсы видов из окон"}
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
            {isTg ? "Қарорҳои нақшавии намунавӣ" : "Типовые планировочные решения"}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {layouts.map((lay) => (
              <div
                key={lay.id}
                className="rounded-xl border bg-card overflow-hidden flex flex-col justify-between p-3 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">
                    {isTg
                      ? lay.name.replace("комнатная квартира", "ҳуҷрагӣ").replace("Тип", "Намуди")
                      : lay.name}
                  </span>
                  <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-300">
                    {lay.area} м²
                  </Badge>
                </div>
                <div className="h-24 w-full rounded-lg overflow-hidden border bg-muted">
                  <img src={lay.imageUrl} alt={lay.name} className="w-full h-full object-cover" />
                </div>
                <div className="text-[11px] text-muted-foreground">
                  {isTg
                    ? "Бахшҳо: Ошхона, Меҳмонхона, Хоби калон, Ҳаммом, Айвон"
                    : "Экспликация: Кухня, Гостиная, Спальня, Санузел, Лоджия"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
