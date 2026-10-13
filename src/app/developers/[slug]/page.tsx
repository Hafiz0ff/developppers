"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { INITIAL_DEVELOPERS, INITIAL_PROJECTS } from "@/lib/data/mock-db";
import { useCurrency } from "@/context/currency-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Building2,
  ShieldCheck,
  Phone,
  MessageCircle,
  Send,
  MapPin,
  Calendar,
  CheckCircle2,
  FolderKanban,
  ArrowRight,
  Globe,
  Percent,
} from "lucide-react";

export default function PublicDeveloperPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { formatPrice } = useCurrency();

  const developer =
    INITIAL_DEVELOPERS.find((d) => d.slug === slug) || INITIAL_DEVELOPERS[0];

  const projects = INITIAL_PROJECTS.filter((p) => p.developerId === developer.id);

  return (
    <div className="pb-20 space-y-10">
      {/* DEVELOPER HERO & BANNER */}
      <div className="relative">
        <div className="h-64 sm:h-80 w-full overflow-hidden bg-muted relative">
          <img
            src={developer.coverUrl}
            alt={developer.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </div>

        <div className="container mx-auto px-4 -mt-20 relative z-10">
          <div className="bg-card border rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="h-24 w-24 rounded-2xl border-2 border-background shadow-md overflow-hidden bg-background shrink-0">
                <img
                  src={developer.logoUrl}
                  alt={developer.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                    {developer.name}
                  </h1>
                  {developer.isVerified && (
                    <Badge className="bg-emerald-600 text-white text-xs gap-1 font-semibold">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Проверенный застройщик
                    </Badge>
                  )}
                </div>

                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  {developer.officeAddress}
                </p>

                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-1">
                  <span>
                    На рынке с <strong>{developer.foundedYear} г.</strong>
                  </span>
                  <span>•</span>
                  <span>
                    Сдано объектов: <strong>{developer.completedProjectsCount}</strong>
                  </span>
                  <span>•</span>
                  <span>
                    Строящихся ЖК: <strong>{developer.activeProjectsCount}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Direct Contacts Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              <a
                href={`https://wa.me/${developer.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
                  `Здравствуйте! Обращаюсь с портала Sogd Realty по поводу ваших жилых комплексов в Худжанде.`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                Написать в WhatsApp
              </a>

              <a
                href={`tel:${developer.phone}`}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl border hover:bg-muted font-semibold text-xs transition-colors"
              >
                <Phone className="h-4 w-4" />
                {developer.phone}
              </a>

              {developer.telegram && (
                <a
                  href={`https://t.me/${developer.telegram}`}
                  target="_blank"
                  rel="noreferrer"
                  className="h-10 w-10 rounded-xl border hover:bg-muted flex items-center justify-center text-sky-500 transition-colors"
                >
                  <Send className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 space-y-10">
        {/* ABOUT THE DEVELOPER */}
        <div className="max-w-4xl space-y-3">
          <h2 className="text-xl font-bold text-foreground">
            О компании «{developer.name}»
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {developer.description}
          </p>
        </div>

        {/* DEVELOPER'S COMPLEXES IN SOGD */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-foreground">
                Жилые комплексы компании в Согде
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Все строящиеся и сданные объекты с шахматками квартир и ценами от застройщика
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((proj) => (
              <Card
                key={proj.id}
                className="overflow-hidden border hover:border-emerald-500/50 transition-all hover:shadow-lg group"
              >
                <div className="relative h-60 w-full overflow-hidden bg-muted">
                  <img
                    src={proj.coverImageUrl}
                    alt={proj.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <Badge className="bg-emerald-600 text-white font-semibold text-xs">
                      {proj.status === "under_construction" ? "Строится" : "Сдан"}
                    </Badge>
                    <Badge variant="secondary" className="backdrop-blur-md bg-background/80 text-foreground font-semibold text-xs">
                      {proj.buildingClass === "business" ? "Бизнес-класс" : "Комфорт-класс"}
                    </Badge>
                  </div>
                  <div className="absolute bottom-3 left-3 bg-background/95 backdrop-blur-md text-emerald-700 dark:text-emerald-400 font-semibold text-xs px-2.5 py-1 rounded-md shadow-xs flex items-center gap-1.5">
                    <Percent className="h-3.5 w-3.5" />
                    Рассрочка до {proj.installmentMonths} мес
                  </div>
                </div>

                <CardContent className="p-5 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-foreground group-hover:text-emerald-600 transition-colors">
                      {proj.name}
                    </h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      {proj.address} ({proj.landmark})
                    </p>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {proj.shortDescription}
                  </p>

                  <div className="pt-3 border-t flex items-center justify-between">
                    <div>
                      <div className="text-[11px] text-muted-foreground">Цена за м²:</div>
                      <div className="text-sm font-semibold text-foreground">
                        от {formatPrice(proj.minPricePerMeterTjs, proj.minPricePerMeterUsd)} / м²
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] text-muted-foreground">Квартиры от:</div>
                      <div className="text-lg font-extrabold text-emerald-600">
                        от {formatPrice(proj.minTotalPriceTjs, proj.minTotalPriceUsd)}
                      </div>
                    </div>
                  </div>

                  <Link href={`/projects/${proj.slug}`} className="block pt-1">
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs gap-1.5">
                      Открыть планировки и шахматку
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
