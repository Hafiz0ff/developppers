"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/language-context";
import { useCurrency } from "@/context/currency-context";
import {
  getShowcaseSections,
  resolveSectionHref,
  getDeveloperApartmentsCount,
} from "@/lib/showcase/showcase-store";
import { ALL_PROPERTIES, COMMERCIAL_PROPERTIES } from "@/lib/catalog-data";
import { INITIAL_PROJECTS, INITIAL_DEVELOPERS, type ProjectData, type DeveloperData } from "@/lib/data/mock-db";
import { SERVICES_DATA, type ServiceData } from "@/lib/data/services-data";
import { BLOG_ARTICLES, type BlogArticle } from "@/lib/data/blog-data";
import { ClassifiedCard } from "@/components/classifieds/classified-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DeveloperAvatar } from "@/components/ui/developer-avatar";
import { ProjectCatalogCardBadge } from "@/components/modules/project-engagement-pills";
import { NewBuildingPriceBlock } from "@/components/modules/new-building-price-block";
import {
  ChevronRight,
  MapPin,
  Building2,
  Calendar,
  Percent,
  CheckCircle2,
  Clock,
  MessageCircle,
  Phone,
  Sparkles,
} from "lucide-react";

interface Props {
  activeCity?: string;
}

export function HomepageShowcaseSections({ activeCity = "khujand" }: Props) {
  const { language, tDual } = useLanguage();
  const isTg = language === "tg";
  const { formatPrice } = useCurrency();

  const sections = useMemo(() => {
    return getShowcaseSections().filter((s) => s.visible);
  }, []);

  // Filter 4 cards per section (4 × 1 desktop grid, AC-18)
  const newBuildProjects = useMemo(() => INITIAL_PROJECTS.slice(0, 4), []);

  const resaleApartments = useMemo(() => {
    return ALL_PROPERTIES.filter(
      (p) =>
        p.dealType === "Продажа" &&
        (p.propertyType === "Квартира" || p.propertyType === "Новостройка")
    ).slice(0, 4);
  }, []);

  const rentApartments = useMemo(() => {
    return ALL_PROPERTIES.filter((p) => p.dealType === "Аренда").slice(0, 4);
  }, []);

  const houses = useMemo(() => {
    return ALL_PROPERTIES.filter(
      (p) => p.dealType === "Продажа" && p.propertyType.includes("Ҳавлӣ")
    ).slice(0, 4);
  }, []);

  const commercialProps = useMemo(() => {
    return COMMERCIAL_PROPERTIES.slice(0, 4);
  }, []);

  const services = useMemo(() => {
    return SERVICES_DATA.slice(0, 4);
  }, []);

  const developers = useMemo(() => {
    return INITIAL_DEVELOPERS.slice(0, 4);
  }, []);

  const articles = useMemo(() => {
    return BLOG_ARTICLES.slice(0, 4);
  }, []);

  return (
    <div className="w-full space-y-12 sm:space-y-16 mt-8 sm:mt-12">
      {sections.map((section) => {
        const href = resolveSectionHref(section, activeCity, language);
        const title = section.title[language] || section.title.ru;
        const subtitle = section.subtitle[language] || section.subtitle.ru;

        return (
          <section
            key={section.id}
            id={section.id}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full"
          >
            {/* Clickable Header with Arrow (AC-17) */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
              <div>
                <Link
                  href={href}
                  className="group inline-flex items-center gap-2 focus:outline-none"
                >
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {title}
                  </h2>
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:bg-emerald-50 group-hover:text-emerald-600 dark:group-hover:bg-emerald-950/60 dark:group-hover:text-emerald-400 transition-all group-hover:translate-x-1">
                    <ChevronRight className="h-4 w-4" />
                  </span>
                </Link>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {subtitle}
                </p>
              </div>

              <Link
                href={href}
                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 transition-colors self-start sm:self-auto"
              >
                <span>{isTg ? "Ҳамаашро дидан" : "Смотреть все"}</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Section Card Grid: Exactly 4 in a row on desktop (4 × 1, AC-18) */}
            {section.sourceType === "projects" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {newBuildProjects.map((project) => {
                  const dev = INITIAL_DEVELOPERS.find((d) => d.id === project.developerId);
                  return (
                    <div
                      key={project.id}
                      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs hover:border-emerald-500/50 hover:shadow-[0_16px_36px_-12px_rgba(16,185,129,0.18)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
                    >
                      <div>
                        {/* Project Hero Image */}
                        <Link
                          href={`/projects/${project.slug}`}
                          className="relative h-48 w-full block overflow-hidden bg-slate-900"
                        >
                          <img
                            src={project.customBuildingFeatures?.[0]?.value || "/images/qayroqum/qayroqum-1.jpg"}
                            alt={project.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute top-3 left-3 z-10">
                            <Badge className="bg-emerald-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-lg border-none shadow-xs">
                              {project.buildingClass.toUpperCase()}
                            </Badge>
                          </div>
                          {dev && (
                            <div className="absolute top-3 right-3 z-10">
                              <DeveloperAvatar name={dev.name} logoUrl={dev.logoUrl} size="sm" />
                            </div>
                          )}
                        </Link>

                        <div className="p-4 space-y-2">
                          <Link href={`/projects/${project.slug}`}>
                            <h3 className="font-bold text-slate-900 dark:text-white text-base line-clamp-1 group-hover:text-emerald-600 transition-colors">
                              {isTg && project.nameTg ? project.nameTg : project.name}
                            </h3>
                          </Link>

                          <p className="text-xs text-slate-500 flex items-center gap-1 truncate">
                            <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                            <span>{project.city}, {project.district}</span>
                          </p>

                          {/* Price per sq.m */}
                          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                              {isTg ? "Нархи 1 м² аз" : "Цена за м² от"}
                            </span>
                            <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                              {formatPrice(project.minPricePerMeterTjs, project.minPricePerMeterUsd)}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 pt-0">
                        <Link href={`/projects/${project.slug}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full rounded-xl text-xs font-bold border-slate-200 hover:border-emerald-500 hover:text-emerald-700 h-9"
                          >
                            {isTg ? "Интихоби хонадон" : "Выбрать квартиру"}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Resale Apartments Grid */}
            {section.sourceType === "resale_apartments" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {resaleApartments.map((item) => (
                  <ClassifiedCard
                    key={item.id}
                    item={item as any}
                    formatPrice={formatPrice}
                  />
                ))}
              </div>
            )}

            {/* Rent Apartments Grid */}
            {section.sourceType === "rent_apartments" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {rentApartments.map((item) => (
                  <ClassifiedCard
                    key={item.id}
                    item={item as any}
                    formatPrice={formatPrice}
                  />
                ))}
              </div>
            )}

            {/* Houses Grid */}
            {section.sourceType === "houses" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {houses.map((item) => (
                  <ClassifiedCard
                    key={item.id}
                    item={item as any}
                    formatPrice={formatPrice}
                  />
                ))}
              </div>
            )}

            {/* Commercial Properties Grid */}
            {section.sourceType === "commercial" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {commercialProps.map((item) => (
                  <ClassifiedCard
                    key={item.id}
                    item={item as any}
                    formatPrice={formatPrice}
                  />
                ))}
              </div>
            )}

            {/* Services Grid (AC-09, AC-16) */}
            {section.sourceType === "services" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {services.map((srv) => (
                  <div
                    key={srv.id}
                    className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs hover:border-emerald-500/50 hover:shadow-[0_16px_36px_-12px_rgba(16,185,129,0.18)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      <div className="h-44 w-full overflow-hidden relative bg-slate-900">
                        <img
                          src={srv.imageUrl}
                          alt={srv.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 z-10">
                          <Badge className="bg-slate-900/85 backdrop-blur-md text-white text-[10px] font-bold border-none px-2 py-0.5 rounded-lg">
                            {isTg ? srv.categoryTg : srv.category}
                          </Badge>
                        </div>
                      </div>

                      <div className="p-4 space-y-2">
                        <h3 className="font-bold text-slate-900 dark:text-white text-base line-clamp-1 group-hover:text-emerald-600 transition-colors">
                          {isTg ? srv.titleTg : srv.title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {isTg ? srv.shortDescriptionTg : srv.shortDescription}
                        </p>

                        <div className="pt-2 text-xs">
                          <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">
                            {isTg ? "Нарх" : "Стоимость"}
                          </span>
                          <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                            {isTg ? `Аз ${srv.priceStartingFromTjs} TJS` : `от ${srv.priceStartingFromTjs} TJS`}
                          </span>
                          <span className="text-slate-400 text-xs ml-1">/ {isTg ? srv.priceUnitTg : srv.priceUnit}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 pt-0 border-t border-slate-100 dark:border-slate-800 mt-2 flex items-center justify-between text-xs">
                      <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[140px]">
                        {isTg ? srv.providerNameTg : srv.providerName}
                      </span>
                      <a
                        href={`https://wa.me/${srv.whatsapp.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="py-1.5 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-100 transition-colors"
                      >
                        WhatsApp
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Developers Grid (Section 6, AC-29, AC-30) */}
            {section.sourceType === "developers" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {developers.map((dev) => {
                  const verifiedUnits = getDeveloperApartmentsCount(dev.id);

                  return (
                    <div
                      key={dev.id}
                      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 space-y-4 shadow-xs hover:border-emerald-500/50 hover:shadow-[0_16px_36px_-12px_rgba(16,185,129,0.18)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <DeveloperAvatar name={dev.name} logoUrl={dev.logoUrl} size="md" />
                          <div>
                            <div className="flex items-center gap-1">
                              <h3 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1 group-hover:text-emerald-600 transition-colors">
                                {isTg && dev.nameTg ? dev.nameTg : dev.name}
                              </h3>
                              {dev.isVerified && (
                                <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] px-1 py-0">
                                  ✓
                                </Badge>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              {isTg ? `Аз соли ${dev.foundedYear}` : `С ${dev.foundedYear} года на рынке`}
                            </p>
                          </div>
                        </div>

                        {/* Subtitle with apartment count strictly when verified (AC-30) */}
                        <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-2.5 text-xs space-y-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-slate-500">{isTg ? "Лоиҳаҳои фаъол:" : "Проектов:"}</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200">{dev.activeProjectsCount} ЖК</span>
                          </div>

                          {/* AC-30: Display apartment count ONLY if verified and > 0, otherwise hide */}
                          {verifiedUnits > 0 ? (
                            <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                              <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{isTg ? "Хонадонҳо дар фурӯш:" : "Квартир в продаже:"}</span>
                              <span className="font-extrabold text-emerald-700 dark:text-emerald-400">{verifiedUnits}</span>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                              <span className="text-slate-400">{isTg ? "Рейтинги боэътимодӣ:" : "Рейтинг надёжности:"}</span>
                              <span className="font-bold text-amber-500">★ {dev.rating}</span>
                            </div>
                          )}
                        </div>

                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {isTg && dev.descriptionTg ? dev.descriptionTg : dev.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                        <Link href={`/developers/${dev.slug}`} className="w-full">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full rounded-xl text-xs font-bold border-slate-200 hover:border-emerald-500 hover:text-emerald-700"
                          >
                            {isTg ? "Профили ширкат" : "Профиль застройщика"}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Articles Grid (Section 7, AC-31, AC-32) */}
            {section.sourceType === "articles" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {articles.map((art) => {
                  const artTitle = isTg ? art.titleTg : art.title;
                  const artExcerpt = isTg ? art.excerptTg : art.excerpt;
                  const artCategory = isTg ? art.categoryTg : art.category;

                  return (
                    <article
                      key={art.id}
                      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs hover:border-emerald-500/50 hover:shadow-[0_16px_36px_-12px_rgba(16,185,129,0.18)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
                    >
                      <div>
                        {/* AI-Generated Thematic Cover (AC-32) */}
                        <Link
                          href={`/blog/${art.slug}`}
                          className="relative h-44 w-full block overflow-hidden bg-slate-900"
                        >
                          <img
                            src={art.coverImage}
                            alt={artTitle}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-3 left-3 z-10">
                            <Badge className="bg-slate-900/85 backdrop-blur-md text-white text-[10px] font-bold border-none px-2 py-0.5 rounded-lg">
                              {artCategory}
                            </Badge>
                          </div>
                        </Link>

                        <div className="p-4 space-y-2">
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                            <span>{art.publishedAt}</span>
                            <span>•</span>
                            <span>{art.readTimeMin} {isTg ? "дақ." : "мин."}</span>
                          </div>

                          <Link href={`/blog/${art.slug}`}>
                            <h3 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-2 group-hover:text-emerald-600 transition-colors leading-snug">
                              {artTitle}
                            </h3>
                          </Link>

                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                            {artExcerpt}
                          </p>
                        </div>
                      </div>

                      <div className="p-4 pt-0 border-t border-slate-100 dark:border-slate-800 mt-2 flex items-center justify-between text-xs">
                        <span className="text-[11px] text-slate-600 dark:text-slate-400 truncate max-w-[130px]">
                          {art.author.name}
                        </span>
                        <Link
                          href={`/blog/${art.slug}`}
                          className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 text-xs hover:gap-1 transition-all"
                        >
                          <span>{isTg ? "Хондан" : "Читать"}</span>
                          <ChevronRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
