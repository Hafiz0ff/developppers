"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCurrency } from "@/context/currency-context";
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

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Page Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
            Панель управления застройщика
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            ООО «Рахш Сохтмон» • Управление объектами строительства и продажами в Согде
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link href="/developer-admin/projects/new">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs gap-1.5 shadow-xs">
              <PlusCircle className="h-4 w-4" />
              Добавить новый ЖК
            </Button>
          </Link>
          <Link href="/developers/rahsh-sohtmon">
            <Button variant="outline" size="sm" className="text-xs gap-1">
              Витрина компании
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
              Активных ЖК
            </CardTitle>
            <FolderKanban className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-extrabold text-foreground">2 объекта</div>
            <p className="text-[11px] text-muted-foreground mt-1">
              ЖК «Сирдарё Плаза» (19 мкр), ЖК «Бахористон»
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-semibold text-muted-foreground">
              Свободно квартир
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-extrabold text-emerald-600">64 кв.</div>
            <p className="text-[11px] text-muted-foreground mt-1">
              В активной продаже через шахматку
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-semibold text-muted-foreground">
              На брони
            </CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-extrabold text-amber-600">18 кв.</div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Ожидают заключения договоров
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-semibold text-muted-foreground">
              Потенциал продаж
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-xl font-extrabold text-foreground">
              {formatPrice(34821000, 3180000)}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              По свободным юнитам
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
              Текущие жилые комплексы
            </h2>
            <Link
              href="/developer-admin/projects"
              className="text-xs font-semibold text-emerald-600 hover:underline"
            >
              Смотреть все
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
                  Строится
                </Badge>
              </div>

              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-base text-foreground">
                      ЖК «Сирдарё Плаза»
                    </h3>
                    <Badge variant="outline" className="text-[10px]">
                      Бизнес-класс
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    г. Худжанд, 19-й микрорайон, набережная Сырдарьи
                  </p>
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-2">
                    <span>16 этажей</span>
                    <span>•</span>
                    <span>3 секции</span>
                    <span>•</span>
                    <span className="text-emerald-600 font-semibold">
                      Сдача: 4 кв. 2026
                    </span>
                  </div>
                </div>

                <div className="pt-3 mt-2 border-t flex flex-wrap items-center justify-between gap-2">
                  <div className="text-xs">
                    <span className="text-muted-foreground">Квартиры от: </span>
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
                        Управление шахматкой
                      </Button>
                    </Link>
                    <Link href="/developer-admin/projects/proj_sirdaryo_plaza/edit">
                      <Button size="sm" variant="outline" className="h-8 text-xs">
                        Редактировать
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
            Входящие запросы от покупателей
          </h2>

          <Card className="p-4 space-y-3">
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-muted/40 border text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground">
                    Фаррух (Худжанд)
                  </span>
                  <span className="text-[10px] text-muted-foreground">Сегодня, 11:20</span>
                </div>
                <p className="text-muted-foreground text-[11px]">
                  Запрос на бронь: <strong>Кв. 28 (2-комн., 78.5 м²)</strong> в ЖК «Сирдарё Плаза».
                </p>
                <div className="pt-1 flex items-center gap-2">
                  <a
                    href="https://wa.me/992928881234"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 hover:underline"
                  >
                    <MessageCircle className="h-3 w-3" />
                    Написать в WhatsApp
                  </a>
                  <span className="text-muted-foreground">•</span>
                  <a
                    href="tel:+992928881234"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-foreground hover:underline"
                  >
                    <Phone className="h-3 w-3" />
                    Позвонить
                  </a>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-muted/40 border text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground">
                    Нозима (Б. Гафуров)
                  </span>
                  <span className="text-[10px] text-muted-foreground">Вчера, 17:45</span>
                </div>
                <p className="text-muted-foreground text-[11px]">
                  Консультация по условиям <strong>рассрочки до 24 мес</strong> и 3-комнатным квартирам с видом на реку.
                </p>
                <div className="pt-1 flex items-center gap-2">
                  <a
                    href="https://wa.me/992927771122"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 hover:underline"
                  >
                    <MessageCircle className="h-3 w-3" />
                    WhatsApp диалог
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-2 text-center">
              <span className="text-[11px] text-muted-foreground">
                Уведомления также автоматически дублируются в Telegram-бот отдела продаж.
              </span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
