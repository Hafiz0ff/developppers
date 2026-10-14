"use client";

import React, { useState } from "react";
import Link from "next/link";
import { INITIAL_DEVELOPERS, INITIAL_PROJECTS } from "@/lib/data/mock-db";
import { useLanguage } from "@/context/language-context";
import { useCurrency } from "@/context/currency-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Building2,
  ShieldCheck,
  Phone,
  MessageCircle,
  MapPin,
  Calendar,
  FolderKanban,
  ArrowRight,
  Star,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  Home,
  SlidersHorizontal,
} from "lucide-react";

export default function DevelopersDirectoryPage() {
  const { language, tDual } = useLanguage();
  const { formatPrice } = useCurrency();
  const isTg = language === "tg";

  const [selectedCity, setSelectedCity] = useState<string>("all");

  const developers = INITIAL_DEVELOPERS.filter((dev) => {
    if (selectedCity === "all") return true;
    return dev.city === selectedCity;
  });

  return (
    <div className="pb-24 space-y-10">
      {/* BREADCRUMBS */}
      <div className="bg-muted/30 border-b py-2.5">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link
              href="/"
              className="hover:text-foreground flex items-center gap-1 transition-colors"
            >
              <Home className="h-3.5 w-3.5" />
              <span>{tDual("Главная", "Асосӣ")}</span>
            </Link>
            <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-50" />
            <span className="text-foreground font-semibold">
              {tDual("Застройщики Согда", "Сохтмончиёни Суғд")}
            </span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 space-y-8">
        {/* PAGE HEADER */}
        <div className="space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 font-semibold text-xs border border-emerald-500/20">
            <ShieldCheck className="h-4 w-4" />
            <span>{tDual("100% Проверенные компании", "100% Ширкатҳои санҷидашуда")}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            {tDual(
              "Застройщики Согдийской области",
              "Ширкатҳои сохтмонии вилояти Суғд"
            )}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            {tDual(
              "Официальные девелоперские компании Худжанда, Гулистона и Б. Гафурова с проверенной документацией, сейсмостойкостью до 9 баллов и прямыми ценами без посредников.",
              "Ширкатҳои расмии сохтмонии Хуҷанд, Гулистон ва Б. Ғафуров бо ҳуҷҷатҳои тасдиқшуда, тобоварӣ ба заминларза то 9 балл ва нархҳои мустақим бе миёнарав."
            )}
          </p>
        </div>

        {/* CITY FILTER CHIPS */}
        <div className="flex flex-wrap items-center gap-2 pt-1 pb-2 border-b">
          <span className="text-xs font-semibold text-muted-foreground mr-1 flex items-center gap-1">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            {tDual("Город:", "Шаҳр:")}
          </span>
          <button
            onClick={() => setSelectedCity("all")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              selectedCity === "all"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-card border text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            {tDual("Все города", "Ҳамаи шаҳрҳо")} ({INITIAL_DEVELOPERS.length})
          </button>
          <button
            onClick={() => setSelectedCity("khujand")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              selectedCity === "khujand"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-card border text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            {tDual("Худжанд", "Хуҷанд")} (
            {INITIAL_DEVELOPERS.filter((d) => d.city === "khujand").length})
          </button>
          <button
            onClick={() => setSelectedCity("guliston")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              selectedCity === "guliston"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-card border text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            {tDual("Гулистон (Кайраккум)", "Гулистон (Қайроққум)")} (
            {INITIAL_DEVELOPERS.filter((d) => d.city === "guliston").length})
          </button>
        </div>

        {/* DEVELOPERS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {developers.map((dev) => {
            const devName = isTg && dev.nameTg ? dev.nameTg : dev.name;
            const devDesc = isTg && dev.descriptionTg ? dev.descriptionTg : dev.description;
            const devAddress = isTg && dev.officeAddressTg ? dev.officeAddressTg : dev.officeAddress;
            const devProjects = INITIAL_PROJECTS.filter((p) => p.developerId === dev.id);

            return (
              <Card
                key={dev.id}
                className="overflow-hidden border hover:border-emerald-500/50 transition-all hover:shadow-xl group flex flex-col justify-between"
              >
                <div>
                  {/* Developer Cover & Avatar */}
                  <div className="relative h-44 w-full bg-muted overflow-hidden">
                    <img
                      src={dev.coverUrl}
                      alt={devName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                    <div className="absolute top-3 right-3">
                      {dev.isVerified && (
                        <Badge className="bg-emerald-600 text-white text-[11px] gap-1 font-semibold shadow-xs">
                          <ShieldCheck className="h-3 w-3" />
                          {tDual("Проверен", "Тасдиқшуда")}
                        </Badge>
                      )}
                    </div>

                    <div className="absolute bottom-3 left-4 flex items-center gap-3">
                      <div className="h-16 w-16 rounded-xl border-2 border-background shadow-md overflow-hidden bg-background shrink-0">
                        <img
                          src={dev.logoUrl}
                          alt={devName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <h2 className="font-extrabold text-base text-foreground group-hover:text-emerald-600 transition-colors truncate drop-shadow-xs">
                          {devName}
                        </h2>
                        {dev.rating && (
                          <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                            <Star className="h-3 w-3 fill-amber-500" />
                            <span>{dev.rating}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-5 space-y-4">
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{devAddress}</span>
                    </p>

                    <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                      {devDesc}
                    </p>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-2 p-2.5 bg-muted/40 rounded-xl text-center">
                      <div>
                        <div className="text-[10px] text-muted-foreground">
                          {tDual("Опыт", "Таҷриба")}
                        </div>
                        <div className="text-xs font-extrabold text-foreground mt-0.5">
                          {new Date().getFullYear() - dev.foundedYear}+ {tDual("лет", "сол")}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-muted-foreground">
                          {tDual("Сдано ЖК", "МИ супорида")}
                        </div>
                        <div className="text-xs font-extrabold text-foreground mt-0.5">
                          {dev.completedProjectsCount}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-muted-foreground">
                          {tDual("В стройке", "Дар сохтмон")}
                        </div>
                        <div className="text-xs font-extrabold text-emerald-600 mt-0.5">
                          {devProjects.length || dev.activeProjectsCount} {tDual("ЖК", "МИ")}
                        </div>
                      </div>
                    </div>

                    {/* Active Complexes Preview Chips */}
                    {devProjects.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <div className="text-[11px] font-semibold text-muted-foreground">
                          {tDual("Жилые комплексы:", "Маҷмааҳои истиқоматӣ:")}
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {devProjects.slice(0, 3).map((p) => (
                            <Link
                              key={p.id}
                              href={`/projects/${p.slug}`}
                              className="text-[11px] px-2 py-0.5 rounded-md bg-muted text-foreground hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/60 dark:hover:text-emerald-300 transition-colors truncate max-w-[170px]"
                            >
                              {isTg && p.nameTg ? p.nameTg : p.name}
                            </Link>
                          ))}
                          {devProjects.length > 3 && (
                            <span className="text-[11px] px-1.5 py-0.5 text-muted-foreground">
                              +{devProjects.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </div>

                {/* Footer Buttons */}
                <div className="p-5 pt-0 space-y-2 border-t">
                  <div className="pt-3 flex items-center gap-2">
                    <Link href={`/developers/${dev.slug}`} className="flex-1">
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs h-9 gap-1 shadow-xs">
                        <span>
                          {tDual(
                            `Смотреть ЖК (${devProjects.length})`,
                            `Дидани МИ (${devProjects.length})`
                          )}
                        </span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                    <a
                      href={`https://wa.me/${dev.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
                        isTg
                          ? `Салом! Аз портали Maskani.tj оид ба маҷмааҳои истиқоматии шумо муроҷиат мекунам.`
                          : `Здравствуйте! Обращаюсь с портала Maskani.tj по поводу ваших жилых комплексов в Согде.`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      title="WhatsApp"
                      className="h-9 w-9 rounded-lg border hover:bg-muted flex items-center justify-center text-emerald-600 transition-colors"
                    >
                      <MessageCircle className="h-4 w-4" />
                    </a>
                    <a
                      href={`tel:${dev.phone}`}
                      title={tDual("Позвонить", "Занг задан")}
                      className="h-9 w-9 rounded-lg border hover:bg-muted flex items-center justify-center text-foreground transition-colors"
                    >
                      <Phone className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* TRUST BANNER */}
        <div className="bg-gradient-to-br from-emerald-950 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-lg border border-emerald-900/60 mt-12">
          <div className="max-w-3xl space-y-4">
            <Badge className="bg-emerald-500 text-slate-950 font-bold text-xs px-2.5 py-1">
              {tDual("ПРЯМЫЕ ЦЕНЫ ОТ ДЕВЕЛОПЕРОВ", "НАРХҲОИ МУСТАҚИМ АЗ СОХТМОНЧӢ")}
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {tDual(
                "Почему покупка через Maskani.tj выгоднее и безопаснее?",
                "Чаро харид тавассути Maskani.tj бехатар ва фоиданок аст?"
              )}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs sm:text-sm text-emerald-100/90">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  {tDual(
                    "0% комиссии: вы покупаете напрямую по официальному прайс-листу девелопера",
                    "0% комиссия: хариди мустақим аз рӯи нархномаи расмии сохтмончӣ"
                  )}
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  {tDual(
                    "Беспроцентная рассрочка от 24 до 60 месяцев без банков и переплат",
                    "Пардохти қисм-қисми бефоиз аз 24 то 60 моҳ бе бонкҳо ва изофапулӣ"
                  )}
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  {tDual(
                    "Проверенные разрешения на строительство и сейсмостойкость до 9 баллов",
                    "Иҷозатномаҳои тасдиқшудаи сохтмон ва сейсмотобоварӣ то 9 балл"
                  )}
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  {tDual(
                    "Интерактивная шахматка: выбирайте свободные этажи и планировки онлайн",
                    "Ҷадвали шоҳмотӣ: интихоби ошёна ва тарҳи дилхоҳ дар реҷаи онлайн"
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
