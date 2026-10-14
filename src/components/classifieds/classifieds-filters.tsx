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

export function ClassifiedsFilters() {
  const router = useRouter();
  const params = useSearchParams();

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (!value || value === "all") next.delete(key);
    else next.set(key, value);
    const qs = next.toString();
    router.push(qs ? `/classifieds?${qs}` : "/classifieds");
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      <Select value={params.get("city") || "all"} onValueChange={(v) => setParam("city", v ?? "all")}>
        <SelectTrigger className="h-10 bg-white">
          <SelectValue placeholder="Город" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Все города</SelectItem>
          {SOGD_CITIES.map((city) => (
            <SelectItem key={city.value} value={city.value}>
              {city.nameRu}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={params.get("propertyType") || "all"}
        onValueChange={(v) => setParam("propertyType", v ?? "all")}
      >
        <SelectTrigger className="h-10 bg-white">
          <SelectValue placeholder="Тип" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Все типы</SelectItem>
          <SelectItem value="apartment">Квартира</SelectItem>
          <SelectItem value="house">Дом / Ҳавлӣ</SelectItem>
          <SelectItem value="commercial">Коммерция</SelectItem>
          <SelectItem value="land">Участок</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={params.get("dealType") || "all"}
        onValueChange={(v) => setParam("dealType", v ?? "all")}
      >
        <SelectTrigger className="h-10 bg-white">
          <SelectValue placeholder="Сделка" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Продажа и аренда</SelectItem>
          <SelectItem value="sale">Продажа</SelectItem>
          <SelectItem value="rent_long">Аренда</SelectItem>
        </SelectContent>
      </Select>

      <Select value={params.get("rooms") || "all"} onValueChange={(v) => setParam("rooms", v ?? "all")}>
        <SelectTrigger className="h-10 bg-white">
          <SelectValue placeholder="Комнаты" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Комнаты</SelectItem>
          <SelectItem value="1">1</SelectItem>
          <SelectItem value="2">2</SelectItem>
          <SelectItem value="3">3</SelectItem>
          <SelectItem value="4+">4+</SelectItem>
        </SelectContent>
      </Select>

      <Input
        defaultValue={params.get("q") || ""}
        placeholder="Поиск"
        className="h-10 bg-white"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            setParam("q", (e.target as HTMLInputElement).value);
          }
        }}
      />
    </div>
  );
}
