"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Compass,
  MapPin,
  Plus,
  Trash2,
  GraduationCap,
  Baby,
  Trees,
  ShoppingBag,
  HeartPulse,
  Bus,
} from "lucide-react";

export interface POIItem {
  id: string;
  name: string;
  category: "school" | "kindergarten" | "park" | "shop" | "medical" | "transport";
  distance: string;
  xPercent: number;
  yPercent: number;
  description?: string;
}

const DEFAULT_POIS: POIItem[] = [
  {
    id: "poi_waterfront",
    name: "Набережная Сырдарьи и пляжная зона",
    category: "park",
    distance: "2 мин пешком (150 м)",
    xPercent: 48,
    yPercent: 78,
    description: "Благоустроенный променад для прогулок, беговые и велосипедные дорожки.",
  },
  {
    id: "poi_park",
    name: "Парк Камоли Худжанди",
    category: "park",
    distance: "4 мин пешком (350 м)",
    xPercent: 22,
    yPercent: 32,
    description: "Исторический парк с тенистыми аллеями, фонтанами и амфитеатром.",
  },
  {
    id: "poi_school",
    name: "Средняя школа №28",
    category: "school",
    distance: "5 мин пешком (420 м)",
    xPercent: 78,
    yPercent: 28,
    description: "Современная школа с углубленным изучением языков и спортивным комплексом.",
  },
  {
    id: "poi_kindergarten",
    name: "Детский сад «Парасту»",
    category: "kindergarten",
    distance: "3 мин пешком (260 м)",
    xPercent: 82,
    yPercent: 62,
    description: "Ясли и группы дошкольной подготовки с закрытой охраняемой территорией.",
  },
  {
    id: "poi_shop",
    name: "Супермаркет «Амид» & Торговый центр",
    category: "shop",
    distance: "4 мин пешком (380 м)",
    xPercent: 18,
    yPercent: 72,
    description: "Крупный продуктовый супермаркет, аптека, кафе и банкоматы 24/7.",
  },
  {
    id: "poi_clinic",
    name: "Медицинский центр и поликлиника",
    category: "medical",
    distance: "7 мин пешком (600 м)",
    xPercent: 88,
    yPercent: 42,
    description: "Многопрофильная клиника, диагностика и скорая помощь.",
  },
];

interface ProjectPoiManagerProps {
  initialPois?: POIItem[];
  onChange?: (pois: POIItem[]) => void;
}

export function ProjectPoiManager({
  initialPois = DEFAULT_POIS,
  onChange,
}: ProjectPoiManagerProps) {
  const [pois, setPois] = useState<POIItem[]>(initialPois);
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState<POIItem["category"]>("school");
  const [newDistance, setNewDistance] = useState("3 мин пешком");
  const [newX, setNewX] = useState(50);
  const [newY, setNewY] = useState(50);
  const [newDesc, setNewDesc] = useState("");

  const updatePois = (updated: POIItem[]) => {
    setPois(updated);
    if (onChange) onChange(updated);
  };

  const handleAddPoi = () => {
    if (!newName.trim()) return;
    const item: POIItem = {
      id: `poi_${Date.now()}`,
      name: newName.trim(),
      category: newCategory,
      distance: newDistance.trim(),
      xPercent: newX,
      yPercent: newY,
      description: newDesc.trim() || undefined,
    };
    const updated = [...pois, item];
    updatePois(updated);
    setNewName("");
    setNewDesc("");
  };

  const handleDeletePoi = (id: string) => {
    const updated = pois.filter((p) => p.id !== id);
    updatePois(updated);
  };

  const getCategoryIcon = (category: POIItem["category"]) => {
    switch (category) {
      case "school":
        return <GraduationCap className="h-3.5 w-3.5 text-blue-500" />;
      case "kindergarten":
        return <Baby className="h-3.5 w-3.5 text-pink-500" />;
      case "park":
        return <Trees className="h-3.5 w-3.5 text-emerald-500" />;
      case "shop":
        return <ShoppingBag className="h-3.5 w-3.5 text-amber-500" />;
      case "medical":
        return <HeartPulse className="h-3.5 w-3.5 text-rose-500" />;
      case "transport":
        return <Bus className="h-3.5 w-3.5 text-indigo-500" />;
    }
  };

  return (
    <Card className="border shadow-xs">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Compass className="h-4 w-4 text-emerald-600" />
            Генплан квартала и инфраструктура (POI)
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {pois.length} объектов рядом
          </Badge>
        </div>
        <CardDescription className="text-xs">
          Настройте точки притяжения (школы, детские сады, парки, набережные, магазины), которые отображаются на интерактивной карте в режиме «Общий вид».
        </CardDescription>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        {/* Table of existing POIs */}
        <div className="space-y-2">
          {pois.map((poi) => (
            <div
              key={poi.id}
              className="p-3 rounded-xl border bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  {getCategoryIcon(poi.category)}
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground flex items-center gap-2">
                    <span>{poi.name}</span>
                    <span className="text-[10px] text-emerald-600 font-normal">
                      • {poi.distance}
                    </span>
                  </div>
                  <div className="text-[11px] text-muted-foreground line-clamp-1">
                    {poi.description || "Без описания"} (X: {poi.xPercent}%, Y: {poi.yPercent}%)
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeletePoi(poi.id)}
                  className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                  title="Удалить объект"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Add new POI form */}
        <div className="p-3.5 rounded-xl border border-dashed bg-muted/20 space-y-3">
          <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <Plus className="h-3.5 w-3.5 text-emerald-600" />
            Добавить объект инфраструктуры
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1 sm:col-span-2">
              <Label className="text-[11px] font-semibold">Название объекта</Label>
              <Input
                placeholder="Например, Лицей №1 или Фитнес-центр"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="text-xs h-8"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-[11px] font-semibold">Категория</Label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as POIItem["category"])}
                className="w-full h-8 text-xs bg-background border rounded-md px-2"
              >
                <option value="school">Школа</option>
                <option value="kindergarten">Детский сад</option>
                <option value="park">Парк / Набережная</option>
                <option value="shop">ТЦ / Супермаркет</option>
                <option value="medical">Медицина</option>
                <option value="transport">Транспорт</option>
              </select>
            </div>

            <div className="space-y-1">
              <Label className="text-[11px] font-semibold">Удаленность / Время</Label>
              <Input
                placeholder="2 мин пешком (150 м)"
                value={newDistance}
                onChange={(e) => setNewDistance(e.target.value)}
                className="text-xs h-8"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-[11px] font-semibold">Координата X ({newX}%)</Label>
              <input
                type="range"
                min={5}
                max={95}
                value={newX}
                onChange={(e) => setNewX(parseInt(e.target.value, 10))}
                className="w-full accent-emerald-600"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-[11px] font-semibold">Координата Y ({newY}%)</Label>
              <input
                type="range"
                min={5}
                max={95}
                value={newY}
                onChange={(e) => setNewY(parseInt(e.target.value, 10))}
                className="w-full accent-emerald-600"
              />
            </div>

            <div className="space-y-1 sm:col-span-3">
              <Label className="text-[11px] font-semibold">Краткое описание (для подсказки при клике)</Label>
              <Input
                placeholder="Например, Охраняемая территория, спортивные секции"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="text-xs h-8"
              />
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <Button
              type="button"
              onClick={handleAddPoi}
              disabled={!newName.trim()}
              className="h-8 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              Добавить на карту
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
