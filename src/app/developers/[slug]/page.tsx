"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { INITIAL_DEVELOPERS, INITIAL_PROJECTS } from "@/lib/data/mock-db";
import { useCurrency } from "@/context/currency-context";
import { useLanguage } from "@/context/language-context";
import { formatNewBuildingPricePerMeter, getPricePerMeterLabel } from "@/lib/pricing/new-building-price";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
  Star,
  Sparkles,
  ChevronRight,
  Home,
  Check,
  Clock,
  ExternalLink,
} from "lucide-react";

export default function PublicDeveloperPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { formatPrice, currency } = useCurrency();
  const { language, tDual } = useLanguage();
  const isTg = language === "tg";

  const developer =
    INITIAL_DEVELOPERS.find((d) => d.slug === slug) || INITIAL_DEVELOPERS[0];

  const projects = INITIAL_PROJECTS.filter((p) => p.developerId === developer.id);

  const displayName = isTg && developer.nameTg ? developer.nameTg : developer.name;
  const displayDesc = isTg && developer.descriptionTg ? developer.descriptionTg : developer.description;
  const displayAddress = isTg && developer.officeAddressTg ? developer.officeAddressTg : developer.officeAddress;

  // Fast Lead Form State
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || "");
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [leadSuccess, setLeadSuccess] = useState(false);

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientPhone.trim()) return;

    setLeadSubmitting(true);
    try {
      const selectedProj = projects.find((p) => p.id === selectedProjectId) || projects[0];
      await fetch("/api/crm/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: clientName || (isTg ? "Харидор аз саҳифаи сохтмончӣ" : "Покупатель со страницы застройщика"),
          phone: clientPhone,
          developerId: developer.id,
          developerName: developer.name,
          projectId: selectedProj?.id,
          projectName: selectedProj?.name,
          source: "developer_page",
          createdAt: new Date().toISOString(),
        }),
      });
      setLeadSuccess(true);
      setClientName("");
      setClientPhone("");
      setTimeout(() => setLeadSuccess(false), 6000);
    } catch (err) {
      console.error("Lead submission error", err);
      setLeadSuccess(true); // Still show user feedback in demo mode
    } finally {
      setLeadSubmitting(false);
    }
  };

  const whatsappMessage = encodeURIComponent(
    isTg
      ? `Салом! Ман аз портали Maskani.tj оид ба маҷмааҳои истиқоматии ширкати «${displayName}» дар вилояти Суғд муроҷиат мекунам.`
      : `Здравствуйте! Обращаюсь с портала Maskani.tj по поводу жилых комплексов компании «${developer.name}» в Согдийской области.`
  );

  return (
    <div className="pb-24 space-y-10">
      {/* BREADCRUMBS */}
      <div className="bg-muted/30 border-b py-2.5">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground flex-wrap">
            <Link
              href="/"
              className="hover:text-foreground flex items-center gap-1 transition-colors"
            >
              <Home className="h-3.5 w-3.5" />
              <span>{tDual("Главная", "Асосӣ")}</span>
            </Link>
            <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-50" />
            <Link
              href="/developers"
              className="hover:text-foreground transition-colors"
            >
              {tDual("Застройщики Согда", "Сохтмончиёни Суғд")}
            </Link>
            <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-50" />
            <span className="text-foreground font-semibold truncate max-w-xs">
              {displayName}
            </span>
          </nav>
        </div>
      </div>

      {/* DEVELOPER HERO & BANNER */}
      <div className="relative">
        <div className="h-64 sm:h-80 md:h-96 w-full overflow-hidden bg-muted relative">
          <img
            src={developer.coverUrl}
            alt={displayName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>

        <div className="container mx-auto px-4 -mt-24 sm:-mt-28 relative z-10">
          <div className="bg-card border rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl border-2 border-background shadow-lg overflow-hidden bg-background shrink-0">
                <img
                  src={developer.logoUrl}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                    {displayName}
                  </h1>
                  {developer.isVerified && (
                    <Badge className="bg-emerald-600 text-white text-xs gap-1 font-semibold px-2.5 py-0.5">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      {tDual("Проверенный застройщик", "Сохтмончии тасдиқшуда")}
                    </Badge>
                  )}
                  {developer.rating && (
                    <Badge variant="outline" className="border-amber-500/50 text-amber-600 dark:text-amber-400 text-xs gap-1 font-bold">
                      <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                      {developer.rating}
                    </Badge>
                  )}
                </div>

                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>{displayAddress}</span>
                </p>

                <div className="flex flex-wrap gap-3 sm:gap-4 text-xs text-muted-foreground pt-1">
                  <span>
                    {tDual("На рынке с", "Дар бозор аз с.")} <strong>{developer.foundedYear}</strong>
                  </span>
                  <span>•</span>
                  <span>
                    {tDual("Сдано объектов:", "Маҷмааҳои супоридашуда:")} <strong>{developer.completedProjectsCount}</strong>
                  </span>
                  <span>•</span>
                  <span>
                    {tDual("Строящихся ЖК:", "Маҷмааҳои дар ҳоли сохтмон:")}{" "}
                    <strong className="text-emerald-600">
                      {projects.length || developer.activeProjectsCount}
                    </strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Direct Contacts Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
              <a
                href={`https://wa.me/${developer.whatsapp.replace(/\D/g, "")}?text=${whatsappMessage}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                {tDual("Написать в WhatsApp", "Навиштан дар WhatsApp")}
              </a>

              <a
                href={`tel:${developer.phone}`}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl border hover:bg-muted font-semibold text-xs transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span>{developer.phone}</span>
              </a>

              {developer.phoneSecondary && (
                <a
                  href={`tel:${developer.phoneSecondary}`}
                  className="hidden xl:inline-flex items-center justify-center gap-2 h-11 px-4 rounded-xl border hover:bg-muted font-semibold text-xs transition-colors text-muted-foreground"
                >
                  <Phone className="h-3.5 w-3.5" />
                  <span>{developer.phoneSecondary}</span>
                </a>
              )}

              {developer.telegram && (
                <a
                  href={`https://t.me/${developer.telegram}`}
                  target="_blank"
                  rel="noreferrer"
                  title="Telegram"
                  className="h-11 w-11 rounded-xl border hover:bg-muted flex items-center justify-center text-sky-500 transition-colors"
                >
                  <Send className="h-4 w-4" />
                </a>
              )}

              {developer.websiteUrl && (
                <a
                  href={developer.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  title={tDual("Официальный сайт", "Сомонаи расмӣ")}
                  className="h-11 w-11 rounded-xl border hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Globe className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 space-y-12">
        {/* ABOUT & LEAD FORM GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ABOUT THE DEVELOPER */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              {tDual(`О компании «${displayName}»`, `Дар бораи ширкати «${displayName}»`)}
            </h2>
            <div className="bg-card border rounded-2xl p-6 space-y-4 shadow-xs">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {displayDesc}
              </p>

              <div className="pt-4 border-t grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="p-3 bg-muted/40 rounded-xl">
                  <div className="text-xs text-muted-foreground">{tDual("Опыт работы", "Таҷриба")}</div>
                  <div className="text-lg font-bold text-foreground mt-0.5">
                    {new Date().getFullYear() - developer.foundedYear}+ {tDual("лет", "сол")}
                  </div>
                </div>
                <div className="p-3 bg-muted/40 rounded-xl">
                  <div className="text-xs text-muted-foreground">{tDual("Сдано ЖК", "МИ супорида")}</div>
                  <div className="text-lg font-bold text-foreground mt-0.5">
                    {developer.completedProjectsCount} {tDual("объектов", "маҷмаа")}
                  </div>
                </div>
                <div className="p-3 bg-muted/40 rounded-xl">
                  <div className="text-xs text-muted-foreground">{tDual("В стройке", "Дар сохтмон")}</div>
                  <div className="text-lg font-bold text-emerald-600 mt-0.5">
                    {projects.length} {tDual("ЖК", "МИ")}
                  </div>
                </div>
                <div className="p-3 bg-muted/40 rounded-xl">
                  <div className="text-xs text-muted-foreground">{tDual("Сейсмостойкость", "Сейсмотобоварӣ")}</div>
                  <div className="text-lg font-bold text-foreground mt-0.5">9 {tDual("баллов", "балл")}</div>
                </div>
              </div>
            </div>
          </div>

          {/* FAST CALLBACK / CONSULTATION CARD */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-foreground">
              {tDual("Консультация отдела продаж", "Машварати шуъбаи фурӯш")}
            </h2>
            <Card className="border p-5 space-y-4 shadow-xs">
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-foreground">
                  {tDual("Оставить заявку застройщику", "Фиристодани дархост ба сохтмончӣ")}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {tDual(
                    "Менеджер свяжется с вами в течение 10 минут и отправит планировки в WhatsApp",
                    "Мутахассиси фурӯш дар муддати 10 дақиқа бо шумо тамос гирифта, нақшаҳоро мефиристад"
                  )}
                </p>
              </div>

              {leadSuccess ? (
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-start gap-2.5">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" />
                  <div>
                    <p className="font-bold">{tDual("Заявка успешно отправлена!", "Дархост бомуваффақият қабул шуд!")}</p>
                    <p className="font-normal text-[11px] mt-0.5">
                      {tDual(
                        "Отдел продаж «" + developer.name + "» уже получил ваше обращение.",
                        "Шуъбаи фурӯши «" + displayName + "» муроҷиати шуморо қабул намуд."
                      )}
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleLeadSubmit} className="space-y-3">
                  <div>
                    <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                      {tDual("Ваше имя", "Номи шумо")}
                    </label>
                    <Input
                      placeholder={isTg ? "Масалан: Ҷамшед" : "Например: Джамшед"}
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="text-xs h-9"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                      {tDual("Номер телефона (WhatsApp) *", "Рақами телефон (WhatsApp) *")}
                    </label>
                    <Input
                      required
                      placeholder="+992 92 ___ __ __"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="text-xs h-9"
                    />
                  </div>

                  {projects.length > 1 && (
                    <div>
                      <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                        {tDual("Интересующий жилой комплекс", "Маҷмааи истиқоматии мавриди таваҷҷуҳ")}
                      </label>
                      <select
                        value={selectedProjectId}
                        onChange={(e) => setSelectedProjectId(e.target.value)}
                        className="w-full text-xs h-9 rounded-md border border-input bg-background px-3 py-1 text-foreground"
                      >
                        {projects.map((p) => (
                          <option key={p.id} value={p.id}>
                            {isTg && p.nameTg ? p.nameTg : p.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={leadSubmitting}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs h-9 gap-1.5 shadow-xs cursor-pointer"
                  >
                    {leadSubmitting ? (
                      tDual("Отправка...", "Дар ҳоли ирсол...")
                    ) : (
                      <>
                        <Send className="h-3.5 w-3.5" />
                        {tDual("Получить консультацию", "Гирифтани машварат")}
                      </>
                    )}
                  </Button>
                </form>
              )}

              <div className="pt-2 border-t text-[11px] text-muted-foreground flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>{tDual("Отдел продаж: Пн–Сб 08:30–18:00", "Шуъбаи фурӯш: Дш–Шб 08:30–18:00")}</span>
              </div>
            </Card>
          </div>
        </div>

        {/* DEVELOPER'S COMPLEXES IN SOGD */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-extrabold text-foreground">
                {tDual("Жилые комплексы компании в Согде", "Маҷмааҳои истиқоматии ширкат дар Суғд")}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {tDual(
                  "Все строящиеся и готовые объекты с планировками, шахматками и прямыми ценами",
                  "Ҳамаи маҷмааҳои сохташаванда ва омода бо нақшаҳо, ҷадвали хонаҳо ва нархҳои бе миёнарав"
                )}
              </p>
            </div>
            <Badge variant="outline" className="text-xs font-semibold px-3 py-1 self-start sm:self-auto">
              {projects.length} {tDual("объектов в каталоге", "маҷмаа дар феҳрист")}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((proj) => {
              const projDisplayName = isTg && proj.nameTg ? proj.nameTg : proj.name;
              const projDisplayAddress = isTg && proj.addressTg ? proj.addressTg : proj.address;
              const projDisplayLandmark = isTg && proj.landmarkTg ? proj.landmarkTg : proj.landmark;
              const projDisplayDesc = isTg && proj.shortDescriptionTg ? proj.shortDescriptionTg : proj.shortDescription;

              return (
                <Card
                  key={proj.id}
                  className="overflow-hidden border hover:border-emerald-500/50 transition-all hover:shadow-lg group flex flex-col justify-between"
                >
                  <div>
                    {/* Cover Preview */}
                    <Link href={`/projects/${proj.slug}`} className="block relative h-56 w-full overflow-hidden bg-muted">
                      <img
                        src={proj.coverImageUrl}
                        alt={projDisplayName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 flex gap-1.5">
                        <Badge className="bg-emerald-600 text-white font-semibold text-xs">
                          {proj.status === "under_construction"
                            ? tDual("Строится", "Дар ҳоли сохтмон")
                            : proj.status === "ready"
                            ? tDual("Сдан", "Ба истифода дода шуд")
                            : tDual("Проектирование", "Лоиҳакашӣ")}
                        </Badge>
                        <Badge
                          variant="secondary"
                          className="backdrop-blur-md bg-background/80 text-foreground font-semibold text-xs"
                        >
                          {proj.buildingClass === "premium"
                            ? tDual("Премиум", "Синфи олӣ")
                            : proj.buildingClass === "business"
                            ? tDual("Бизнес", "Тиҷоратӣ")
                            : tDual("Комфорт", "Бароҳат")}
                        </Badge>
                      </div>

                      {proj.hasInstallment && (
                        <div className="absolute bottom-3 left-3 bg-background/95 backdrop-blur-md text-emerald-700 dark:text-emerald-400 font-semibold text-xs px-2.5 py-1 rounded-md shadow-xs flex items-center gap-1.5">
                          <Percent className="h-3.5 w-3.5" />
                          <span>
                            {tDual(
                              `Рассрочка до ${proj.installmentMonths} мес`,
                              `Пардохти қисм-қисм то ${proj.installmentMonths} моҳ`
                            )}
                          </span>
                        </div>
                      )}
                    </Link>

                    <CardContent className="p-5 space-y-3">
                      <div>
                        <Link href={`/projects/${proj.slug}`}>
                          <h3 className="text-lg font-bold text-foreground group-hover:text-emerald-600 transition-colors line-clamp-1">
                            {projDisplayName}
                          </h3>
                        </Link>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1 line-clamp-1">
                          <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          <span>{projDisplayAddress}</span>
                        </p>
                      </div>

                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {projDisplayDesc}
                      </p>

                      {/* Amenities Chips */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {proj.hasUndergroundParking && (
                          <span className="text-[11px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                            🚗 {tDual("Паркинг", "Таваққуфгоҳ")}
                          </span>
                        )}
                        {proj.hasAutonomousHeating && (
                          <span className="text-[11px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                            🔥 {tDual("Отопление", "Гармидиҳӣ")}
                          </span>
                        )}
                        {proj.hasElevator && (
                          <span className="text-[11px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                            ⚡ {tDual("Лифт", "Лифт")}
                          </span>
                        )}
                        {proj.floorsCount && (
                          <span className="text-[11px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                            🏢 {proj.floorsCount} {tDual("эт.", "ош.")}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </div>

                  {/* Pricing and Action Link */}
                  <div className="p-5 pt-0 space-y-3">
                    <div className="pt-3 border-t flex items-center justify-between">
                      <div>
                        <div className="text-[11px] text-muted-foreground">
                          {getPricePerMeterLabel(language)}
                        </div>
                        <div className="text-xs font-semibold text-foreground">
                          {formatNewBuildingPricePerMeter({
                            pricePerMeterTjs: proj.minPricePerMeterTjs,
                            pricePerMeterUsd: proj.minPricePerMeterUsd,
                            totalPriceTjs: proj.minTotalPriceTjs,
                            totalPriceUsd: proj.minTotalPriceUsd,
                            currency,
                            language,
                          }) || "—"}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[11px] text-muted-foreground">
                          {tDual("Стоимость квартир:", "Нархи хонадонҳо:")}
                        </div>
                        <div className="text-base font-extrabold text-emerald-600">
                          {tDual("от ", "аз ")}
                          {formatPrice(proj.minTotalPriceTjs, proj.minTotalPriceUsd)}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Link href={`/projects/${proj.slug}`} className="block">
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs h-9 gap-1 shadow-xs">
                          <span>{tDual("Шахматка", "Ҷадвал")}</span>
                          <ArrowRight className="h-3 w-3" />
                        </Button>
                      </Link>
                      <a
                        href={`https://wa.me/${developer.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
                          isTg
                            ? `Салом! Оид ба «${projDisplayName}» маълумот мехостам.`
                            : `Здравствуйте! Хочу узнать подробнее о «${proj.name}».`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 h-9 rounded-md border hover:bg-muted font-semibold text-xs text-foreground transition-colors"
                      >
                        <MessageCircle className="h-3.5 w-3.5 text-emerald-600" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
