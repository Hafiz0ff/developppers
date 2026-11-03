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

  return (
    <div className="glass-card p-3 rounded-2xl border border-slate-200/70 dark:border-white/10 shadow-xs">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
        <Select value={params.get("city") || "all"} onValueChange={(v) => setParam("city", v ?? "all")}>
          <SelectTrigger className="h-10 rounded-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200/80 dark:border-white/15 hover:border-emerald-500/50 transition-all text-xs font-medium">
            <SelectValue placeholder={isTg ? "Шаҳр" : "Город"} />
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
          value={params.get("propertyType") || "all"}
          onValueChange={(v) => setParam("propertyType", v ?? "all")}
        >
          <SelectTrigger className="h-10 rounded-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200/80 dark:border-white/15 hover:border-emerald-500/50 transition-all text-xs font-medium">
            <SelectValue placeholder={isTg ? "Намуди амвол" : "Тип"} />
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
          value={params.get("dealType") || "all"}
          onValueChange={(v) => setParam("dealType", v ?? "all")}
        >
          <SelectTrigger className="h-10 rounded-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200/80 dark:border-white/15 hover:border-emerald-500/50 transition-all text-xs font-medium">
            <SelectValue placeholder={isTg ? "Муомила" : "Сделка"} />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-slate-200/80 dark:border-white/15 backdrop-blur-xl">
            <SelectItem value="all">{isTg ? "Фурӯш ва иҷора" : "Продажа и аренда"}</SelectItem>
            <SelectItem value="sale">{isTg ? "Фурӯш" : "Продажа"}</SelectItem>
            <SelectItem value="rent_long">{isTg ? "Иҷора" : "Аренда"}</SelectItem>
          </SelectContent>
        </Select>

        <Select value={params.get("rooms") || "all"} onValueChange={(v) => setParam("rooms", v ?? "all")}>
          <SelectTrigger className="h-10 rounded-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200/80 dark:border-white/15 hover:border-emerald-500/50 transition-all text-xs font-medium">
            <SelectValue placeholder={isTg ? "Ҳуҷраҳо" : "Комнаты"} />
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
