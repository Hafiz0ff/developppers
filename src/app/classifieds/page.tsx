"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/lib/i18n/language-context";
import { useCurrency } from "@/context/currency-context";
import { ClassifiedsFilters } from "@/components/classifieds/classifieds-filters";
import { ClassifiedCard } from "@/components/classifieds/classified-card";
import { Button } from "@/components/ui/button";
import { Plus, Home, ArrowLeft, SearchX, Sparkles, MapPin, Zap } from "lucide-react";
import type { ClassifiedCard as ClassifiedCardData } from "@/lib/classifieds/map-card";
import { CATALOG_PROPERTIES } from "@/lib/catalog-data";
import { SponsoredPartnerBanner } from "@/components/modules/ads/sponsored-partner-banner";
import { PaymentModal } from "@/components/modules/payments/payment-modal";
import { VAS_SERVICES } from "@/lib/payments/payment-gateway";

function ClassifiedsCatalogContent() {
  const { language } = useLanguage();
  const isTg = language === "tg";
  const { formatPrice } = useCurrency();
  const searchParams = useSearchParams();

  const [items, setItems] = useState<ClassifiedCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [vasModalOpen, setVasModalOpen] = useState(false);
  const [selectedVas, setSelectedVas] = useState<"classified_top" | "classified_highlight" | "classified_urgent" | "classified_turbo">("classified_top");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const qs = searchParams.toString();
        const res = await fetch(qs ? `/api/classifieds?${qs}` : "/api/classifieds");
        const json = (await res.json()) as { success: boolean; classifieds?: ClassifiedCardData[] };

        if (json.success && Array.isArray(json.classifieds)) {
          setItems(json.classifieds);
        } else {
          setItems([]);
        }
      } catch {
        const fallback: ClassifiedCardData[] = CATALOG_PROPERTIES.map((prop) => ({
          ...prop,
          slug: prop.slug || `classified-${prop.id}`,
          status: "active",
          viewsCount: 24,
          userId: "demo",
        }));
        setItems(fallback);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
            <Link href="/" className="hover:text-emerald-700 flex items-center gap-1 font-medium">
              <ArrowLeft className="h-3.5 w-3.5" />
              {isTg ? "Ба саҳифаи асосӣ" : "На главную"}
            </Link>
            <span>/</span>
            <span className="text-slate-800 font-semibold">
              {isTg ? "Бозори дуюмдараҷа" : "Вторичный рынок"}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 mb-1">
                <Home className="h-3.5 w-3.5" />
                {isTg ? "Амволи шаҳрвандон ва соҳибмулкон" : "Недвижимость от собственников и маклеров"}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {isTg
                  ? "Эълонҳои бозори дуюмдараҷа дар вилояти Суғд"
                  : "Объявления вторичного рынка в Согдийской области"}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {isTg
                  ? "Хонадонҳо, ҳавлиҳои анъанавӣ, бӯстонсароҳо ва биноҳои тиҷоратӣ бидуни миёнаравҳо"
                  : "Квартиры, традиционные дома (ҳавлӣ), дачи и коммерческие объекты напрямую"}
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <Button
                onClick={() => setVasModalOpen(true)}
                variant="outline"
                className="border-amber-300 bg-amber-50/80 hover:bg-amber-100/90 text-amber-900 font-bold text-xs h-10 px-3.5 rounded-xl gap-1.5 cursor-pointer shadow-xs"
              >
                <Zap className="h-4 w-4 text-amber-600 fill-amber-500" />
                <span>{isTg ? "Пешбарӣ (ТОП)" : "Продвижение (ТОП)"}</span>
              </Button>
              <Link href="/map?type=apartment">
                <Button variant="outline" className="border-slate-300 hover:bg-slate-100 font-semibold text-xs h-10 px-4 rounded-xl gap-2 cursor-pointer text-slate-700">
                  <MapPin className="h-4 w-4 text-emerald-600" />
                  {isTg ? "Дар харита" : "На карте"}
                </Button>
              </Link>
              <Link href="/classifieds/new">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs h-10 px-4 rounded-xl gap-2 shadow-xs cursor-pointer">
                  <Plus className="h-4 w-4" />
                  {isTg ? "Гузоштани эълон (ройгон)" : "Подать объявление (бесплатно)"}
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-100">
            <ClassifiedsFilters />
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* Sponsored Partner Showcase */}
        <SponsoredPartnerBanner
          slot="catalog_banner"
          category="secondary"
          variant="horizontal"
        />

        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-slate-600 font-medium">
            {isTg ? (
              <>
                Ёфт шуд: <span className="font-bold text-slate-900">{items.length}</span> эълон
              </>
            ) : (
              <>
                Найдено: <span className="font-bold text-slate-900">{items.length}</span> объявлений
              </>
            )}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-80 rounded-xl bg-white animate-pulse border border-slate-200" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center max-w-lg mx-auto">
            <SearchX className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-900 text-base mb-1">
              {isTg ? "Ягон эълон ёфт нашуд" : "Ничего не найдено"}
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              {isTg
                ? "Параметрҳои филтрро тағйир диҳед ё эълони худро аввалин шуда ҷойгир кунед"
                : "Попробуйте изменить параметры фильтров или подайте своё объявление"}
            </p>
            <Link href="/classifieds/new">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 rounded-xl">
                {isTg ? "Гузоштани эълон" : "Подать объявление"}
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {items.map((item) => (
              <ClassifiedCard key={item.id} item={item} formatPrice={formatPrice} />
            ))}
          </div>
        )}
      </div>

      {/* Promotional VAS Services Payment Modal */}
      <PaymentModal
        isOpen={vasModalOpen}
        onClose={() => setVasModalOpen(false)}
        purpose={selectedVas}
        title={
          isTg
            ? "Пешбарии эълон ба ТОП"
            : "Продвижение объявления в ТОП каталога"
        }
        subtitle={
          isTg
            ? "Ҷойгиркунӣ дар сатри аввали феҳрист бо нишони ТОП (Корти Миллӣ, DC, Alif, Эсхата)"
            : "Закрепление на 7 дней в топе каталога вторички через Корти Милли, DC, Alif или Эсхата"
        }
        amountTjs={VAS_SERVICES[selectedVas]?.priceTjs || 25}
      />
    </div>
  );
}

export default function ClassifiedsCatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8FAFC] py-16 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
        </div>
      }
    >
      <ClassifiedsCatalogContent />
    </Suspense>
  );
}
