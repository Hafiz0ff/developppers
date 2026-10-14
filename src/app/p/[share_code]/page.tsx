"use client";

import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import { useCurrency } from "@/context/currency-context";
import { useLanguage } from "@/lib/i18n/language-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Phone,
  MessageCircle,
  Share2,
  Printer,
  Check,
  Copy,
  MapPin,
  Building,
  Layers,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  ArrowLeft,
  Calendar,
  Eye,
  Info,
} from "lucide-react";
import { CatalogProperty } from "@/lib/catalog-data";

interface CollectionData {
  id: string;
  shareCode: string;
  agentName: string;
  agentPhone: string;
  agentAvatar: string;
  agentAgency: string;
  title: string;
  notes: string;
  viewsCount: number;
  createdAt: string;
}

export default function ClientCollectionPage({
  params,
}: {
  params: Promise<{ share_code: string }>;
}) {
  const resolvedParams = use(params);
  const shareCode = resolvedParams.share_code;

  const { formatPrice, currency, setCurrency } = useCurrency();
  const { language } = useLanguage();
  const isTg = language === "tg";

  const [collection, setCollection] = useState<CollectionData | null>(null);
  const [properties, setProperties] = useState<CatalogProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState<Record<string, number>>({});

  useEffect(() => {
    async function loadCollection() {
      try {
        setLoading(true);
        const res = await fetch(`/api/crm/collections/${shareCode}`);
        const data = await res.json();
        if (data.success) {
          setCollection(data.collection);
          setProperties(data.properties || []);
        }
      } catch (err) {
        console.error("Failed to load collection:", err);
      } finally {
        setLoading(false);
      }
    }
    loadCollection();
  }, [shareCode]);

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const cleanPhone = collection?.agentPhone?.replace(/\D/g, "") || "992927770022";
  const whatsappShareText = encodeURIComponent(
    isTg
      ? `Салом, ${collection?.agentName || "мутахассис"}! Ман интихоби амволи фиристодаи шуморо (${shareCode}) дидам. Мехоҳам барои дидани он маслиҳат кунем: ${
          typeof window !== "undefined" ? window.location.href : ""
        }`
      : `Здравствуйте, ${collection?.agentName || "специалист"}! Я посмотрел(а) вашу подборку недвижимости (${shareCode}). Хочу обсудить детали и договориться о просмотре: ${
          typeof window !== "undefined" ? window.location.href : ""
        }`
  );
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${whatsappShareText}`;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-slate-500">
        <div className="h-10 w-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium">
          {isTg
            ? "Интихоби инфиродии амвол боргирӣ мешавад..."
            : "Загружаем персональную подборку недвижимости..."}
        </p>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center">
        <div className="h-14 w-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
          <Info className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          {isTg ? "Интихоби амвол ёфт нашуд" : "Подборка не найдена"}
        </h1>
        <p className="text-sm text-slate-500 max-w-md mb-6">
          {isTg
            ? "Шояд муҳлати пайванд ба охир расидааст ё мутахассис рӯйхатро нав кардааст."
            : "Возможно, срок действия ссылки истек или маклер обновил список объектов."}
        </p>
        <Link href="/">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl">
            {isTg ? "Гузариш ба феҳристи асосии Maskani" : "Перейти в главный каталог Maskani"}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-20 print:bg-white print:pb-0">
      {/* 1. TOP UTILITY BAR (CURRENCY + SHARE + PRINT) */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 print:hidden">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Maskani</span>
          </Link>

          <div className="flex items-center gap-2">
            {/* Currency selector */}
            <div className="flex items-center border border-slate-200 rounded-lg p-0.5 bg-slate-50 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setCurrency("TJS")}
                className={`px-2 py-0.5 rounded-md transition-all ${
                  currency === "TJS"
                    ? "bg-white text-emerald-600 shadow-xs font-bold"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                TJS
              </button>
              <button
                type="button"
                onClick={() => setCurrency("USD")}
                className={`px-2 py-0.5 rounded-md transition-all ${
                  currency === "USD"
                    ? "bg-white text-emerald-600 shadow-xs font-bold"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                USD ($)
              </button>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={handlePrint}
              className="h-8 px-2.5 text-xs font-medium gap-1 rounded-lg border-slate-200 hidden sm:flex cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5 text-slate-600" />
              <span>{isTg ? "Чоп / PDF" : "Печать / PDF"}</span>
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={handleCopyLink}
              className="h-8 px-2.5 text-xs font-medium gap-1 rounded-lg border-slate-200 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-emerald-600">
                    {isTg ? "Нусха бардошта шуд" : "Скопировано"}
                  </span>
                </>
              ) : (
                <>
                  <Share2 className="h-3.5 w-3.5 text-slate-600" />
                  <span>{isTg ? "Мубодила" : "Поделиться"}</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* 2. BROKER PROFILE HEADER CARD */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-7 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-emerald-100/50 to-transparent rounded-bl-full pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 relative z-10">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 sm:h-20 sm:w-20 border-2 border-emerald-500/30 shadow-md">
                <AvatarImage src={collection.agentAvatar} alt={collection.agentName} />
                <AvatarFallback className="bg-emerald-600 text-white font-bold text-lg">
                  {collection.agentName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-xl font-bold text-slate-900">
                    {collection.agentName}
                  </h1>
                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-semibold gap-1">
                    <ShieldCheck className="h-3 w-3 text-emerald-600" />
                    {isTg ? "Мутахассиси тасдиқшуда" : "Проверенный эксперт"}
                  </Badge>
                </div>

                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                  {collection.agentAgency ||
                    (isTg ? "Мутахассиси инфиродии амвол" : "Персональный риелтор по недвижимости")}
                </p>

                <p className="text-xs text-slate-600 font-mono mt-1 font-semibold flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-emerald-600" />
                  {collection.agentPhone}
                </p>
              </div>
            </div>

            {/* Direct Contact Buttons */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <a href={`tel:${cleanPhone}`} className="flex-1 sm:flex-none">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto h-10 px-4 text-xs font-semibold rounded-xl border-slate-200 gap-1.5 cursor-pointer"
                >
                  <Phone className="h-3.5 w-3.5 text-emerald-600" />
                  {isTg ? "Занг задан" : "Позвонить"}
                </Button>
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 sm:flex-none"
              >
                <Button className="w-full sm:w-auto h-10 px-4 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/20 gap-1.5 cursor-pointer">
                  <MessageCircle className="h-4 w-4" />
                  {isTg ? "Дар WhatsApp навиштан" : "Написать в WhatsApp"}
                </Button>
              </a>
            </div>
          </div>

          {/* Collection Title & Personal Note */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {collection.title}
            </h2>
            {collection.notes && (
              <div className="mt-2.5 p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                «{collection.notes}»
              </div>
            )}
            <div className="flex items-center gap-4 mt-3 text-xs text-slate-400 font-medium">
              <span>
                {isTg ? "Шумораи амвол:" : "Объектов в подборке:"}{" "}
                <strong className="text-slate-700">{properties.length}</strong>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" /> {collection.viewsCount}{" "}
                {isTg ? "боздид" : "просмотров"}
              </span>
            </div>
          </div>
        </div>

        {/* 3. LIST OF PROPERTIES (CLEAN PRODUCT CARDS WITHOUT OWNER CONTACTS) */}
        <div className="space-y-6">
          {properties.map((prop, idx) => {
            const currentImgIdx = activePhotoIndex[prop.id] || 0;
            const allImages = prop.images && prop.images.length > 0 ? prop.images : [prop.image];
            const currentImg = allImages[currentImgIdx] || prop.image;

            const propertyWhatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
              isTg
                ? `Салом, ${collection.agentName}! Ба ман амволи №${idx + 1}: «${prop.title}» бо арзиши ${formatPrice(prop.priceTjs, prop.priceUsd)} писанд омад. Кай онро дидан мумкин аст?`
                : `Здравствуйте, ${collection.agentName}! Меня заинтересовал объект №${idx + 1}: «${prop.title}» за ${formatPrice(prop.priceTjs, prop.priceUsd)}. Когда можно посмотреть?`
            )}`;

            const dealTypeDisplay = isTg
              ? prop.dealType === "Аренда"
                ? "Иҷора"
                : "Фурӯш"
              : prop.dealType;

            const propertyTypeDisplay = isTg
              ? prop.propertyType === "Квартира"
                ? "Хонадон"
                : prop.propertyType.includes("Ҳавлӣ")
                ? "Ҳавлӣ"
                : prop.propertyType === "Коммерция"
                ? "Амволи тиҷоратӣ"
                : prop.propertyType
              : prop.propertyType;

            return (
              <Card
                key={prop.id}
                className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs hover:border-emerald-300 transition-all"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
                  {/* Photo Section */}
                  <div className="md:col-span-5 relative bg-slate-100 min-h-[260px] flex flex-col justify-between">
                    <img
                      src={currentImg}
                      alt={prop.title}
                      className="w-full h-full object-cover min-h-[260px] max-h-[340px]"
                    />

                    {/* Badge top-left */}
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      <Badge className="bg-emerald-600 text-white text-[11px] font-semibold">
                        {dealTypeDisplay}
                      </Badge>
                      <Badge variant="secondary" className="bg-white/95 backdrop-blur-md text-slate-800 text-[11px] font-medium">
                        {propertyTypeDisplay}
                      </Badge>
                    </div>

                    {/* Photo thumbnails slider */}
                    {allImages.length > 1 && (
                      <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5 overflow-x-auto p-1 bg-black/40 backdrop-blur-md rounded-lg">
                        {allImages.map((img, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() =>
                              setActivePhotoIndex((prev) => ({ ...prev, [prop.id]: i }))
                            }
                            className={`h-10 w-14 rounded overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                              currentImgIdx === i ? "border-emerald-400 scale-105" : "border-transparent opacity-70"
                            }`}
                          >
                            <img src={img} alt="" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Information Details */}
                  <div className="md:col-span-7 p-5 sm:p-6 flex flex-col justify-between space-y-4">
                    <div>
                      {/* Price header */}
                      <div className="flex items-baseline justify-between gap-2">
                        <div className="text-2xl font-extrabold text-emerald-600 tracking-tight">
                          {formatPrice(prop.priceTjs, prop.priceUsd)}
                        </div>
                        {prop.isNegotiable && (
                          <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            {isTg ? "Савдо мешавад" : "Торг уместен"}
                          </span>
                        )}
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                        {prop.title}
                      </h3>

                      <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1 font-medium">
                        <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        {prop.city}, {prop.district} ({prop.landmark})
                      </p>

                      {/* Specs bar */}
                      <div className="flex items-center gap-4 text-xs text-slate-700 bg-slate-50 rounded-xl p-2.5 mt-3 font-medium">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-slate-400 uppercase font-semibold">
                            {isTg ? "ҲУҶРАҲО" : "КОМНАТ"}
                          </span>
                          <span className="font-bold text-slate-900">
                            {prop.rooms} {isTg ? "ҳуҷр." : "комн."}
                          </span>
                        </div>
                        <div className="w-px h-6 bg-slate-200" />
                        <div className="flex flex-col">
                          <span className="text-[10px] text-slate-400 uppercase font-semibold">
                            {isTg ? "МАСОҲАТ" : "ПЛОЩАДЬ"}
                          </span>
                          <span className="font-bold text-slate-900">{prop.area} м²</span>
                        </div>
                        <div className="w-px h-6 bg-slate-200" />
                        <div className="flex flex-col">
                          <span className="text-[10px] text-slate-400 uppercase font-semibold">
                            {isTg ? "ОШЁНА / ЗАМИН" : "ЭТАЖ / УЧАСТОК"}
                          </span>
                          <span className="font-bold text-slate-900">{prop.floor || prop.landArea || "—"}</span>
                        </div>
                      </div>

                      {/* Features */}
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {prop.features.map((f) => (
                          <span
                            key={f}
                            className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-emerald-50/80 text-emerald-800 border border-emerald-100"
                          >
                            {f}
                          </span>
                        ))}
                      </div>

                      {/* Description */}
                      {prop.description && (
                        <p className="text-xs text-slate-600 leading-relaxed mt-3 line-clamp-3">
                          {prop.description}
                        </p>
                      )}
                    </div>

                    {/* Action Bar for this property */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                      <div className="text-[11px] text-slate-400 font-medium">
                        {isTg ? "Амвол тафтиш шудааст" : "Объект проверен маклером"}
                      </div>

                      <a
                        href={propertyWhatsappUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Button
                          size="sm"
                          className="h-9 px-3.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl gap-1.5 shadow-xs cursor-pointer"
                        >
                          <MessageCircle className="h-3.5 w-3.5" />
                          {isTg ? "Савол оид ба ин амвол" : "Спросить по этому объекту"}
                        </Button>
                      </a>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* 4. FOOTER CARD */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center space-y-3 print:hidden">
          <p className="text-xs text-slate-500 font-medium max-w-lg mx-auto">
            {isTg
              ? "Ин интихоби амвол шахсан барои шумо аз ҷониби мутахассиси амволи ғайриманқули платформаи Maskani таҳия шудааст. Ҳамаи амволҳо дар ҳоли ҳозир дастрасанд."
              : "Данная подборка сформирована персонально для вас специалистом по недвижимости платформы Maskani. Все указанные объекты актуальны на момент формирования."}
          </p>
          <div className="flex items-center justify-center gap-3 pt-1">
            <a href={whatsappUrl} target="_blank" rel="noreferrer">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl gap-1.5 cursor-pointer">
                <MessageCircle className="h-4 w-4" />
                {isTg ? `Робита бо ${collection.agentName}` : `Связаться с ${collection.agentName}`}
              </Button>
            </a>
          </div>
        </div>
      </main>

      {/* Floating Bottom Bar on Mobile */}
      <div className="fixed bottom-0 left-0 right-0 p-3 bg-white/95 backdrop-blur-md border-t border-slate-200 sm:hidden z-50 print:hidden flex items-center gap-2">
        <a href={`tel:${cleanPhone}`} className="flex-1">
          <Button variant="outline" className="w-full text-xs font-semibold rounded-xl h-10 border-slate-300 cursor-pointer">
            <Phone className="h-3.5 w-3.5 mr-1 text-emerald-600" />
            {isTg ? "Занг задан" : "Позвонить"}
          </Button>
        </a>
        <a href={whatsappUrl} target="_blank" rel="noreferrer" className="flex-2">
          <Button className="w-full text-xs font-semibold rounded-xl h-10 bg-emerald-600 hover:bg-emerald-700 text-white gap-1 cursor-pointer">
            <MessageCircle className="h-4 w-4" />
            {isTg ? "Дар WhatsApp навиштан" : "Написать в WhatsApp"}
          </Button>
        </a>
      </div>
    </div>
  );
}
