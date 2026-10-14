"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCurrency } from "@/context/currency-context";
import { useLanguage } from "@/context/language-context";
import {
  Building2,
  FolderKanban,
  Grid3X3,
  PlusCircle,
  TrendingUp,
  Users,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Phone,
  MessageCircle,
} from "lucide-react";

export default function DeveloperAdminDashboard() {
  const { formatPrice } = useCurrency();
  const { language, tDual } = useLanguage();

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Page Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
            {tDual("Панель управления застройщика", "Панели идоракунии сохтмончӣ")}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            {tDual(
              "ООО «Рахш Сохтмон» • Управление объектами строительства и продажами в Согде",
              "ҶДММ «Рахш Сохтмон» • Идоракунии сохтмон ва фурӯш дар вилояти Суғд"
            )}
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link href="/developer-admin/projects/new">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs gap-1.5 shadow-xs">
              <PlusCircle className="h-4 w-4" />
              {tDual("Добавить новый ЖК", "Иловаи МИ нав")}
            </Button>
          </Link>
          <Link href="/developers/rahsh-sohtmon">
            <Button variant="outline" size="sm" className="text-xs gap-1">
              {tDual("Витрина компании", "Витринаи ширкат")}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-semibold text-muted-foreground">
              {tDual("Активных ЖК", "МИ фаъол")}
            </CardTitle>
            <FolderKanban className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-extrabold text-foreground">
              {tDual("2 объекта", "2 маҷмаа")}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              {tDual(
                "ЖК «Сирдарё Плаза» (19 мкр), ЖК «Бахористон»",
                "МИ «Сирдарё Плаза» (маҳ. 19), МИ «Баҳористон»"
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-semibold text-muted-foreground">
              {tDual("Свободно квартир", "Хонадонҳои озод")}
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-extrabold text-emerald-600">
              64 {tDual("кв.", "хона")}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              {tDual(
                "В активной продаже через шахматку",
                "Дар фурӯши фаъол тавассути ҷадвал"
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-semibold text-muted-foreground">
              {tDual("На брони", "Дар ҳолати брон")}
            </CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-extrabold text-amber-600">
              18 {tDual("кв.", "хона")}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              {tDual("Ожидают заключения договоров", "Интизори имзои шартнома")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-semibold text-muted-foreground">
              {tDual("Потенциал продаж", "Иқтидори фурӯш")}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-xl font-extrabold text-foreground">
              {formatPrice(34821000, 3180000)}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              {tDual("По свободным юнитам", "Аз рӯи хонадонҳои озод")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* QUICK ACTIONS & ACTIVE COMPLEXES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Projects Cards */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">
              {tDual("Текущие жилые комплексы", "Маҷмааҳои истиқоматии ҷорӣ")}
            </h2>
            <Link
              href="/developer-admin/projects"
              className="text-xs font-semibold text-emerald-600 hover:underline"
            >
              {tDual("Смотреть все", "Ҳамаашро дидан")}
            </Link>
          </div>

          <Card className="overflow-hidden border hover:border-emerald-500/50 transition-all">
            <div className="flex flex-col sm:flex-row">
              <div className="relative sm:w-48 h-36 sm:h-auto bg-muted">
                <img
                  src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&fit=crop"
                  alt="ЖК Сирдарё Плаза"
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px]">
                  {tDual("Строится", "Дар ҳоли сохтмон")}
                </Badge>
              </div>

              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-base text-foreground">
                      {tDual("ЖК «Сирдарё Плаза»", "МИ «Сирдарё Плаза»")}
                    </h3>
                    <Badge variant="outline" className="text-[10px]">
                      {tDual("Бизнес-класс", "Синфи тиҷоратӣ (Бизнес)")}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {tDual(
                      "г. Худжанд, 19-й микрорайон, набережная Сырдарьи",
                      "ш. Хуҷанд, маҳаллаи 19-ум, соҳили Сирдарё"
                    )}
                  </p>
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-2">
                    <span>{tDual("16 этажей", "16 ошёна")}</span>
                    <span>•</span>
                    <span>{tDual("3 секции", "3 бахш")}</span>
                    <span>•</span>
                    <span className="text-emerald-600 font-semibold">
                      {tDual("Сдача: 4 кв. 2026", "Супоридан: семоҳаи 4-и с. 2026")}
                    </span>
                  </div>
                </div>

                <div className="pt-3 mt-2 border-t flex flex-wrap items-center justify-between gap-2">
                  <div className="text-xs">
                    <span className="text-muted-foreground">{tDual("Квартиры от: ", "Нарх аз: ")}</span>
                    <strong className="text-emerald-600">
                      {formatPrice(348210, 31800)}
                    </strong>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href="/developer-admin/projects/proj_sirdaryo_plaza/units">
                      <Button
                        size="sm"
                        className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1.5"
                      >
                        <Grid3X3 className="h-3.5 w-3.5" />
                        {tDual("Управление шахматкой", "Идоракунии ҷадвал")}
                      </Button>
                    </Link>
                    <Link href="/developer-admin/projects/proj_sirdaryo_plaza/edit">
                      <Button size="sm" variant="outline" className="h-8 text-xs">
                        {tDual("Редактировать", "Таҳрир кардан")}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Inquiries / Leads */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-foreground">
            {tDual("Входящие запросы от покупателей", "Дархостҳои воридотӣ аз харидорон")}
          </h2>

          <Card className="p-4 space-y-3">
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-muted/40 border text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground">
                    {tDual("Фаррух (Худжанд)", "Фаррух (Хуҷанд)")}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{tDual("Сегодня, 11:20", "Имрӯз, 11:20")}</span>
                </div>
                <p className="text-muted-foreground text-[11px]">
                  {tDual(
                    "Запрос на бронь: Кв. 28 (2-комн., 78.5 м²) в ЖК «Сирдарё Плаза».",
                    "Дархости брон: Хонадони 28 (2-ҳуҷр., 78.5 м²) дар МИ «Сирдарё Плаза»."
                  )}
                </p>
                <div className="pt-1 flex items-center gap-2">
                  <a
                    href="https://wa.me/992928881234"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 hover:underline"
                  >
                    <MessageCircle className="h-3 w-3" />
                    {tDual("Написать в WhatsApp", "Навиштан дар WhatsApp")}
                  </a>
                  <span className="text-muted-foreground">•</span>
                  <a
                    href="tel:+992928881234"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-foreground hover:underline"
                  >
                    <Phone className="h-3 w-3" />
                    {tDual("Позвонить", "Занг задан")}
                  </a>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-muted/40 border text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground">
                    {tDual("Нозима (Б. Гафуров)", "Нозима (Б. Ғафуров)")}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{tDual("Вчера, 17:45", "Дирӯз, 17:45")}</span>
                </div>
                <p className="text-muted-foreground text-[11px]">
                  {tDual(
                    "Консультация по условиям рассрочки до 24 мес и 3-комнатным квартирам с видом на реку.",
                    "Машварат оид ба шартҳои пардохти қисм-қисм то 24 моҳ ва хонаҳои 3-ҳуҷрагӣ бо манзара ба дарё."
                  )}
                </p>
                <div className="pt-1 flex items-center gap-2">
                  <a
                    href="https://wa.me/992927771122"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 hover:underline"
                  >
                    <MessageCircle className="h-3 w-3" />
                    {tDual("WhatsApp диалог", "Гуфтугӯ дар WhatsApp")}
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-2 text-center">
              <span className="text-[11px] text-muted-foreground">
                {tDual(
                  "Уведомления также автоматически дублируются в Telegram-бот отдела продаж.",
                  "Огоҳиномаҳо инчунин ба таври худкор ба Telegram-боти шуъбаи фурӯш фиристода мешаванд."
                )}
              </span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
