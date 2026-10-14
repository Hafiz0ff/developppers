"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Sun, Compass, CheckCircle2, RotateCw } from "lucide-react";
import { SunTrackCompass } from "../sun-track-widget";

interface ProjectInsolationSettingsProps {
  initialAngle?: number;
  onChange?: (angle: number) => void;
}

export function ProjectInsolationSettings({
  initialAngle = 180, // Default: South facing
  onChange,
}: ProjectInsolationSettingsProps) {
  const [angle, setAngle] = useState(initialAngle);
  const [saved, setSaved] = useState(false);

  const handleAngleChange = (newVal: number) => {
    setAngle(newVal);
    if (onChange) onChange(newVal);
  };

  const getOrientationName = (deg: number) => {
    if (deg >= 337.5 || deg < 22.5) return "Север (С)";
    if (deg >= 22.5 && deg < 67.5) return "Северо-Восток (СВ)";
    if (deg >= 67.5 && deg < 112.5) return "Восток (В)";
    if (deg >= 112.5 && deg < 157.5) return "Юго-Восток (ЮВ)";
    if (deg >= 157.5 && deg < 202.5) return "Юг (Ю)";
    if (deg >= 202.5 && deg < 247.5) return "Юго-Запад (ЮЗ)";
    if (deg >= 247.5 && deg < 292.5) return "Запад (З)";
    return "Северо-Запад (СЗ)";
  };

  const getInsolationAdvice = (deg: number) => {
    if (deg >= 135 && deg <= 225) {
      return "Идеальная инсоляция: главный фасад получает максимум солнечного света в дневные часы (с 11:00 до 16:00).";
    }
    if (deg >= 45 && deg < 135) {
      return "Восточная экспозиция: мягкое утреннее солнце с восхода до полудня, прохлада во второй половине дня.";
    }
    if (deg > 225 && deg <= 315) {
      return "Западная экспозиция: красивый вечерний закатный свет, рекомендуется энергоэффективное остекление.";
    }
    return "Северная экспозиция: рассеянный мягкий дневной свет без перегрева помещений летом.";
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <Card className="border shadow-xs">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Sun className="h-4 w-4 text-amber-500 fill-amber-500/20" />
            Ориентация здания и солнечный трек (Инсоляция)
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {getOrientationName(angle)} • {angle}°
          </Badge>
        </div>
        <CardDescription className="text-xs">
          Задайте ориентацию главного фасада ЖК относительно севера. Это позволит покупателям точно оценивать освещенность комнат в разное время дня с 09:00 до 18:00.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        {saved && (
          <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            Ориентация фасада сохранена!
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Controls */}
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <Label className="font-semibold text-foreground">
                  Угол поворота главного фасада:
                </Label>
                <span className="font-mono font-bold text-emerald-600 bg-muted px-2 py-0.5 rounded-md">
                  {angle}° ({getOrientationName(angle)})
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={360}
                step={5}
                value={angle}
                onChange={(e) => handleAngleChange(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                <span>0° (Север)</span>
                <span>90° (Восток)</span>
                <span>180° (Юг)</span>
                <span>270° (Запад)</span>
                <span>360°</span>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-1.5 flex-wrap text-xs">
              <span className="text-[11px] text-muted-foreground">Пресеты:</span>
              {[
                { label: "Юг (180°)", val: 180 },
                { label: "Юго-Запад (225°)", val: 225 },
                { label: "Восток (90°)", val: 90 },
                { label: "Север (0°)", val: 0 },
              ].map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => handleAngleChange(p.val)}
                  className={`text-[11px] px-2 py-1 rounded-md border transition-colors cursor-pointer ${
                    angle === p.val
                      ? "bg-emerald-600 text-white border-emerald-600 font-semibold"
                      : "bg-muted/40 hover:bg-muted text-foreground border-border/60"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Advice notice */}
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <Sun className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                Оценка инсоляции:
              </div>
              <p className="text-[11px] leading-relaxed opacity-90">
                {getInsolationAdvice(angle)}
              </p>
            </div>
          </div>

          {/* Compass & Facade Preview */}
          <div className="flex flex-col items-center justify-center p-4 rounded-xl border bg-muted/20 space-y-3">
            <div className="relative flex items-center justify-center">
              <SunTrackCompass timeHours={12} />
            </div>

            <div className="text-center space-y-0.5">
              <div className="text-xs font-bold text-foreground">
                Компас витрины синхронизирован
              </div>
              <div className="text-[11px] text-muted-foreground">
                Траектория солнца рассчитывается с учётом ориентации фасада {angle}°
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
