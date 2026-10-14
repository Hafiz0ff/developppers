"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  Heart,
  TrendingUp,
  Layers,
  FileText,
  Camera,
  Compass,
  Sun,
  PhoneCall,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/language-context";

interface ProjectAnalyticsTabProps {
  projectName: string;
  viewsMonth?: number;
  viewsTotal?: number;
  favsMonth?: number;
  favsTotal?: number;
}

export function ProjectAnalyticsTab({
  projectName,
  viewsMonth = 186,
  viewsTotal = 248,
  favsMonth = 24,
  favsTotal = 32,
}: ProjectAnalyticsTabProps) {
  const { language } = useLanguage();
  const isTg = language === "tg";

  const modeStats = [
    {
      name: isTg ? "Намуди бурриш / Ҷадвали шоҳмотӣ" : "Вид в срезе / Шахматка",
      percent: 42,
      count: isTg ? "104 тамошо" : "104 просмотра",
      icon: Layers,
      color: "bg-emerald-500",
    },
    {
      name: isTg ? "Нақша бо шарҳи бахшҳо" : "Планировка с экспликацией",
      percent: 26,
      count: isTg ? "65 тамошо" : "65 просмотров",
      icon: FileText,
      color: "bg-blue-500",
    },
    {
      name: isTg ? "Нигористони намоҳо" : "Фотогалерея фасадов",
      percent: 14,
      count: isTg ? "35 тамошо" : "35 просмотров",
      icon: Camera,
      color: "bg-indigo-500",
    },
    {
      name: isTg ? "Намуди умумӣ / Инфрасохтор (POI)" : "Общий вид / Инфраструктура (POI)",
      percent: 9,
      count: isTg ? "22 тамошо" : "22 просмотра",
      icon: Compass,
      color: "bg-amber-500",
    },
    {
      name: isTg ? "Намуд аз тирезаҳои хонаҳо" : "Вид из окон квартир",
      percent: 6,
      count: isTg ? "15 тамошо" : "15 просмотров",
      icon: Eye,
      color: "bg-pink-500",
    },
    {
      name: isTg ? "Пайроҳаи офтоб / Инсолятсия" : "Солнечный трек / Инсоляция",
      percent: 3,
      count: isTg ? "7 тамошо" : "7 просмотров",
      icon: Sun,
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="space-y-4">
      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="border shadow-xs p-3.5 space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-semibold">
              {isTg ? "Тамошоҳо дар 30 рӯз" : "Просмотры за 30 дней"}
            </span>
            <Eye className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-foreground">{viewsMonth}</div>
          <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            <span>{isTg ? "+18% нисбат ба моҳи гузашта" : "+18% к прошлому мес."}</span>
          </div>
        </Card>

        <Card className="border shadow-xs p-3.5 space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-semibold">
              {isTg ? "Ҳамагӣ тамошоҳо" : "Всего просмотров"}
            </span>
            <Eye className="h-4 w-4 text-slate-500" />
          </div>
          <div className="text-2xl font-black text-foreground">{viewsTotal}</div>
          <div className="text-[10px] text-muted-foreground">
            {isTg ? "Боздидкунандагони нодир" : "Уникальные посетители"}
          </div>
        </Card>

        <Card className="border shadow-xs p-3.5 space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-semibold">
              {isTg ? "Дар баргузидаҳо (30 рӯз)" : "В избранном (30 дней)"}
            </span>
            <Heart className="h-4 w-4 text-rose-500 fill-rose-500" />
          </div>
          <div className="text-2xl font-black text-foreground">{favsMonth}</div>
          <div className="text-[10px] text-rose-600 font-semibold flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            <span>{isTg ? "+8 иловакунии нав" : "+8 новых добавлений"}</span>
          </div>
        </Card>

        <Card className="border shadow-xs p-3.5 space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-semibold">
              {isTg ? "Конверсия ба мизоҷон" : "Конверсия в лиды"}
            </span>
            <PhoneCall className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-foreground">8.4%</div>
          <div className="text-[10px] text-muted-foreground">
            {isTg ? "Зангҳо ва дархостҳои WhatsApp" : "Звонки и WhatsApp заявки"}
          </div>
        </Card>
      </div>

      {/* Engagement by 6D Showcase Modes */}
      <Card className="border shadow-xs">
        <CardHeader className="p-4 pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-600" />
              {isTg
                ? "Маҳбубияти 6 қабати интерактивии витрина"
                : "Популярность 6 интерактивных слоёв витрины"}
            </CardTitle>
            <Badge variant="outline" className="text-xs">
              {isTg ? "248 муроҷиат" : "248 взаимодействий"}
            </Badge>
          </div>
          <CardDescription className="text-xs">
            {isTg
              ? "Таҳлили рафтори харидорон: кадом маводи визуалӣ таваҷҷуҳи бештарро ҷалб мекунанд ва ба бронкунии хонаҳо оварда мерасонанд."
              : "Анализ поведения покупателей: какие визуальные материалы вызывают наибольший интерес и приводят к бронированию квартир."}
          </CardDescription>
        </CardHeader>

        <CardContent className="p-4 space-y-3">
          {modeStats.map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground flex items-center gap-2">
                    <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                    {item.name}
                  </span>
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span className="text-muted-foreground">{item.count}</span>
                    <strong className="text-foreground">{item.percent}%</strong>
                  </div>
                </div>

                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all duration-500`}
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
