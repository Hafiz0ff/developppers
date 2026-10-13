"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { SOGD_CITIES } from "@/lib/constants/locations";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2,
  Save,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  Percent,
  MapPin,
  FileText,
  Image as ImageIcon,
} from "lucide-react";

export default function NewProjectPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [buildingClass, setBuildingClass] = useState<"economy" | "comfort" | "business" | "premium">("comfort");
  const [finishing, setFinishing] = useState<"rough" | "pre_finishing" | "turnkey">("rough");
  const [city, setCity] = useState("khujand");
  const [district, setDistrict] = useState("19 мкр");
  const [address, setAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [floorsCount, setFloorsCount] = useState("16");
  const [sectionsCount, setSectionsCount] = useState("3");
  const [ceilingHeight, setCeilingHeight] = useState("3.10");
  const [deadlineQuarter, setDeadlineQuarter] = useState("4");
  const [deadlineYear, setDeadlineYear] = useState("2026");

  // Finances
  const [minPricePerMeterUsd, setMinPricePerMeterUsd] = useState("600");
  const [minPricePerMeterTjs, setMinPricePerMeterTjs] = useState("6570");
  const [hasInstallment, setHasInstallment] = useState(true);
  const [installmentMonths, setInstallmentMonths] = useState("24");
  const [installmentDownPayment, setInstallmentDownPayment] = useState("30");

  // Amenities
  const [hasUndergroundParking, setHasUndergroundParking] = useState(true);
  const [hasElevator, setHasElevator] = useState(true);
  const [hasAutonomousHeating, setHasAutonomousHeating] = useState(true);

  // Description & Media
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState(
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=800&fit=crop"
  );
  const [galleryUrls, setGalleryUrls] = useState(
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&h=800&fit=crop\nhttps://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop"
  );
  const [documents, setDocuments] = useState(
    "Разрешение на строительство №142/24\nЗаключение сейсмоэкспертизы 9 баллов"
  );

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePriceUsdChange = (val: string) => {
    setMinPricePerMeterUsd(val);
    const usd = parseFloat(val);
    if (!isNaN(usd)) {
      setMinPricePerMeterTjs(Math.round(usd * 10.95).toString());
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSuccess(true);
      setTimeout(() => {
        router.push("/developer-admin/projects");
      }, 1200);
    }, 600);
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/developer-admin/projects">
          <Button variant="outline" size="sm" className="h-8 text-xs gap-1">
            <ArrowLeft className="h-3.5 w-3.5" />
            Назад
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">
            Создание нового жилого комплекса (ЖК)
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Заполните параметры жилого комплекса для размещения в каталоге новостроек Согда
          </p>
        </div>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          ЖК успешно создан и сохранен в базе данных! Перенаправление...
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Details */}
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Building2 className="h-4 w-4 text-emerald-600" />
              Основные параметры комплекса
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="proj-name" className="text-xs font-semibold">
                  Название жилого комплекса *
                </Label>
                <Input
                  id="proj-name"
                  placeholder="Например: ЖК «Сирдарё Плаза»"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Класс жилья *</Label>
                <Select
                  value={buildingClass}
                  onValueChange={(val) => {
                    if (val) setBuildingClass(val as "economy" | "comfort" | "business" | "premium");
                  }}
                >
                  <SelectTrigger className="w-full text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="economy">Эконом-класс</SelectItem>
                    <SelectItem value="comfort">Комфорт-класс</SelectItem>
                    <SelectItem value="business">Бизнес-класс</SelectItem>
                    <SelectItem value="premium">Премиум / Элит</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Отделка квартир *</Label>
                <Select
                  value={finishing}
                  onValueChange={(val) => {
                    if (val) setFinishing(val as "rough" | "pre_finishing" | "turnkey");
                  }}
                >
                  <SelectTrigger className="w-full text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rough">Черновая (коробка)</SelectItem>
                    <SelectItem value="pre_finishing">Предчистовая (белый каркас)</SelectItem>
                    <SelectItem value="turnkey">С ремонтом под ключ</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="proj-short" className="text-xs font-semibold">
                  Краткое описание (для карточки в каталоге)
                </Label>
                <Input
                  id="proj-short"
                  placeholder="Элитный 16-этажный комплекс на набережной Сырдарьи с видом на парк..."
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="proj-desc" className="text-xs font-semibold">
                  Полное описание ЖК
                </Label>
                <Textarea
                  id="proj-desc"
                  rows={4}
                  placeholder="Подробно опишите архитектурные решения, сейсмостойкость, инженерные системы..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location in Sogd */}
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <MapPin className="h-4 w-4 text-emerald-600" />
              Локация в Согдийской области
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Город / Район Согда</Label>
                <Select
                  value={city}
                  onValueChange={(val) => {
                    if (val) setCity(val);
                  }}
                >
                  <SelectTrigger className="w-full text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SOGD_CITIES.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.nameRu}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="proj-district" className="text-xs font-semibold">
                  Микрорайон / Район
                </Label>
                <Input
                  id="proj-district"
                  placeholder="18 мкр, 19 мкр, 34 мкр, Шелкокомбинат и др."
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="proj-address" className="text-xs font-semibold">
                  Точный адрес *
                </Label>
                <Input
                  id="proj-address"
                  placeholder="ул. Рахима Джалила 14"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="proj-landmark" className="text-xs font-semibold">
                  Ориентир
                </Label>
                <Input
                  id="proj-landmark"
                  placeholder="Набережная реки Сырдарья, напротив памятника Сомони"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Building Engineering Specs & Deadlines */}
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Calendar className="h-4 w-4 text-emerald-600" />
              Характеристики здания и сроки сдачи
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="proj-floors" className="text-xs font-semibold">
                  Этажей
                </Label>
                <Input
                  id="proj-floors"
                  type="number"
                  value={floorsCount}
                  onChange={(e) => setFloorsCount(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="proj-sections" className="text-xs font-semibold">
                  Секций (подъездов)
                </Label>
                <Input
                  id="proj-sections"
                  type="number"
                  value={sectionsCount}
                  onChange={(e) => setSectionsCount(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="proj-quarter" className="text-xs font-semibold">
                  Квартал сдачи
                </Label>
                <Select
                  value={deadlineQuarter}
                  onValueChange={(val) => {
                    if (val) setDeadlineQuarter(val);
                  }}
                >
                  <SelectTrigger className="w-full text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 квартал</SelectItem>
                    <SelectItem value="2">2 квартал</SelectItem>
                    <SelectItem value="3">3 квартал</SelectItem>
                    <SelectItem value="4">4 квартал</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="proj-year" className="text-xs font-semibold">
                  Год сдачи
                </Label>
                <Input
                  id="proj-year"
                  type="number"
                  value={deadlineYear}
                  onChange={(e) => setDeadlineYear(e.target.value)}
                />
              </div>
            </div>

            {/* Toggles */}
            <div className="pt-2 border-t grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                <span className="font-semibold">Подземный паркинг</span>
                <Switch
                  checked={hasUndergroundParking}
                  onCheckedChange={setHasUndergroundParking}
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                <span className="font-semibold">Скоростные лифты</span>
                <Switch checked={hasElevator} onCheckedChange={setHasElevator} />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                <span className="font-semibold">Автономное отопление</span>
                <Switch
                  checked={hasAutonomousHeating}
                  onCheckedChange={setHasAutonomousHeating}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing & Installments (Рассрочка) */}
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Percent className="h-4 w-4 text-emerald-600" />
              Ценообразование и условия рассрочки
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="proj-price-usd" className="text-xs font-semibold">
                  Базовая цена за м² в USD ($)
                </Label>
                <Input
                  id="proj-price-usd"
                  type="number"
                  value={minPricePerMeterUsd}
                  onChange={(e) => handlePriceUsdChange(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="proj-price-tjs" className="text-xs font-semibold">
                  Эквивалент в TJS (сомони, по курсу 10.95)
                </Label>
                <Input
                  id="proj-price-tjs"
                  type="number"
                  value={minPricePerMeterTjs}
                  onChange={(e) => setMinPricePerMeterTjs(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="proj-inst-months" className="text-xs font-semibold">
                  Срок беспроцентной рассрочки (месяцев)
                </Label>
                <Input
                  id="proj-inst-months"
                  type="number"
                  value={installmentMonths}
                  onChange={(e) => setInstallmentMonths(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="proj-downpay" className="text-xs font-semibold">
                  Первоначальный взнос (%)
                </Label>
                <Input
                  id="proj-downpay"
                  type="number"
                  value={installmentDownPayment}
                  onChange={(e) => setInstallmentDownPayment(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Media & Documents */}
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-emerald-600" />
              Фотогалерея и документы
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="proj-cover" className="text-xs font-semibold">
                Главное фото комплекса (Обложка)
              </Label>
              <Input
                id="proj-cover"
                value={coverImageUrl}
                onChange={(e) => setCoverImageUrl(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="proj-gallery" className="text-xs font-semibold">
                Дополнительные фото (URL по одному на строке)
              </Label>
              <Textarea
                id="proj-gallery"
                rows={3}
                value={galleryUrls}
                onChange={(e) => setGalleryUrls(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="proj-docs" className="text-xs font-semibold">
                Разрешительные документы и сертификаты
              </Label>
              <Textarea
                id="proj-docs"
                rows={2}
                value={documents}
                onChange={(e) => setDocuments(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-2">
          <Link href="/developer-admin/projects">
            <Button variant="outline" type="button" className="text-xs">
              Отмена
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={saving}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-6 gap-2 shadow-xs"
          >
            <Save className="h-4 w-4" />
            {saving ? "Сохранение..." : "Опубликовать жилой комплекс"}
          </Button>
        </div>
      </form>
    </div>
  );
}
