"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SOGD_CITIES } from "@/lib/constants/locations";
import { useLanguage } from "@/lib/i18n/language-context";

export function ClassifiedsFilters() {
  const router = useRouter();
  const params = useSearchParams();
  const { language } = useLanguage();
  const isTg = language === "tg";

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (!value || value === "all") next.delete(key);
    else next.set(key, value);
    const qs = next.toString();
    router.push(qs ? `/classifieds?${qs}` : "/classifieds");
  }

  const hasActiveFilters = Array.from(params.keys()).some(
    (k) => params.get(k) && params.get(k) !== "all"
  );

  const currentCity = params.get("city") || "all";
  const currentPropertyType = params.get("propertyType") || "all";
  const currentDealType = params.get("dealType") || "all";
  const currentRooms = params.get("rooms") || "all";

  const getCityLabel = (val: string) => {
    if (val === "all") return isTg ? "Ҳамаи шаҳрҳо" : "Все города";
    const found = SOGD_CITIES.find((c) => c.value === val);
    return found ? (isTg ? found.nameTj || found.nameRu : found.nameRu) : val;
  };

  const propertyLabels: Record<string, { ru: string; tg: string }> = {
    all: { ru: "Все типы", tg: "Ҳамаи намудҳо" },
    apartment: { ru: "Квартира", tg: "Хонадон" },
    house: { ru: "Дом / Ҳавлӣ", tg: "Ҳавлӣ / Хона" },
    commercial: { ru: "Коммерция", tg: "Амволи тиҷоратӣ" },
    land: { ru: "Участок", tg: "Қитъаи замин" },
  };

  const dealLabels: Record<string, { ru: string; tg: string }> = {
    all: { ru: "Продажа и аренда", tg: "Фурӯш ва иҷора" },
    sale: { ru: "Продажа", tg: "Фурӯш" },
    rent_long: { ru: "Аренда", tg: "Иҷора" },
  };

  const roomLabels: Record<string, { ru: string; tg: string }> = {
    all: { ru: "Комнаты", tg: "Ҳамаи ҳуҷраҳо" },
    "1": { ru: "1 комната", tg: "1 ҳуҷра" },
    "2": { ru: "2 комнаты", tg: "2 ҳуҷра" },
    "3": { ru: "3 комнаты", tg: "3 ҳуҷра" },
    "4+": { ru: "4+ комнат", tg: "4+ ҳуҷра" },
  };

  return (
    <div className="glass-card p-3 rounded-2xl border border-slate-200/70 dark:border-white/10 shadow-xs">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
        <Select value={currentCity} onValueChange={(v) => setParam("city", v ?? "all")}>
          <SelectTrigger className="h-10 rounded-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200/80 dark:border-white/15 hover:border-emerald-500/50 transition-all text-xs font-medium">
            <SelectValue placeholder={isTg ? "Шаҳр" : "Город"}>{getCityLabel(currentCity)}</SelectValue>
          </SelectTrigger>
          <SelectContent className="rounded-xl border-slate-200/80 dark:border-white/15 backdrop-blur-xl">
            <SelectItem value="all">{isTg ? "Ҳамаи шаҳрҳо" : "Все города"}</SelectItem>
            {SOGD_CITIES.map((city) => (
              <SelectItem key={city.value} value={city.value}>
                {isTg ? city.nameTj || city.nameRu : city.nameRu}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={currentPropertyType}
          onValueChange={(v) => setParam("propertyType", v ?? "all")}
        >
          <SelectTrigger className="h-10 rounded-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200/80 dark:border-white/15 hover:border-emerald-500/50 transition-all text-xs font-medium">
            <SelectValue placeholder={isTg ? "Намуди амвол" : "Тип"}>
              {isTg ? propertyLabels[currentPropertyType]?.tg : propertyLabels[currentPropertyType]?.ru || currentPropertyType}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="rounded-xl border-slate-200/80 dark:border-white/15 backdrop-blur-xl">
            <SelectItem value="all">{isTg ? "Ҳамаи намудҳо" : "Все типы"}</SelectItem>
            <SelectItem value="apartment">{isTg ? "Хонадон" : "Квартира"}</SelectItem>
            <SelectItem value="house">{isTg ? "Ҳавлӣ / Хона" : "Дом / Ҳавлӣ"}</SelectItem>
            <SelectItem value="commercial">{isTg ? "Амволи тиҷоратӣ" : "Коммерция"}</SelectItem>
            <SelectItem value="land">{isTg ? "Қитъаи замин" : "Участок"}</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={currentDealType}
          onValueChange={(v) => setParam("dealType", v ?? "all")}
        >
          <SelectTrigger className="h-10 rounded-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200/80 dark:border-white/15 hover:border-emerald-500/50 transition-all text-xs font-medium">
            <SelectValue placeholder={isTg ? "Муомила" : "Сделка"}>
              {isTg ? dealLabels[currentDealType]?.tg : dealLabels[currentDealType]?.ru || currentDealType}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="rounded-xl border-slate-200/80 dark:border-white/15 backdrop-blur-xl">
            <SelectItem value="all">{isTg ? "Фурӯш ва иҷора" : "Продажа и аренда"}</SelectItem>
            <SelectItem value="sale">{isTg ? "Фурӯш" : "Продажа"}</SelectItem>
            <SelectItem value="rent_long">{isTg ? "Иҷора" : "Аренда"}</SelectItem>
          </SelectContent>
        </Select>

        <Select value={currentRooms} onValueChange={(v) => setParam("rooms", v ?? "all")}>
          <SelectTrigger className="h-10 rounded-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200/80 dark:border-white/15 hover:border-emerald-500/50 transition-all text-xs font-medium">
            <SelectValue placeholder={isTg ? "Ҳуҷраҳо" : "Комнаты"}>
              {isTg ? roomLabels[currentRooms]?.tg : roomLabels[currentRooms]?.ru || currentRooms}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="rounded-xl border-slate-200/80 dark:border-white/15 backdrop-blur-xl">
            <SelectItem value="all">{isTg ? "Ҳамаи ҳуҷраҳо" : "Комнаты"}</SelectItem>
            <SelectItem value="1">1</SelectItem>
            <SelectItem value="2">2</SelectItem>
            <SelectItem value="3">3</SelectItem>
            <SelectItem value="4+">4+</SelectItem>
          </SelectContent>
        </Select>

        <Input
          defaultValue={params.get("q") || ""}
          placeholder={isTg ? "Ҷустуҷӯ аз рӯи ном ё кӯча..." : "Поиск по названию или улице..."}
          className="h-10 rounded-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200/80 dark:border-white/15 hover:border-emerald-500/50 focus-visible:ring-emerald-500/30 transition-all text-xs"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setParam("q", (e.target as HTMLInputElement).value);
            }
          }}
        />
      </div>
    </div>
  );
}
