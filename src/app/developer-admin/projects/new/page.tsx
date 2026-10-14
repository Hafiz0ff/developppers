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
  Plus,
  Trash2,
  HelpCircle,
  Eye,
  Edit3,
  Paintbrush,
  Sparkles,
} from "lucide-react";
import { ResponsiveTooltip } from "@/components/ui/responsive-tooltip";
import { FinishingFeatureDialog } from "@/components/modules/projects/finishing-feature-dialog";
import type { CustomBuildingFeature, FinishingFeature } from "@/lib/data/mock-db";
import { useLanguage } from "@/lib/i18n/language-context";

export default function NewProjectPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const isTg = language === "tg";
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

  // Standard building characteristics
  const [landArea, setLandArea] = useState("");
  const [wallMaterial, setWallMaterial] = useState("");
  const [facade, setFacade] = useState("");
  const [cadastralNumber, setCadastralNumber] = useState("");

  // Custom building features (up to 3)
  const [customBuildingFeatures, setCustomBuildingFeatures] = useState<CustomBuildingFeature[]>([
    { id: "cbf_1", title: "", value: "" },
  ]);

  // Finishing features (up to 3)
  const [finishingFeatures, setFinishingFeatures] = useState<FinishingFeature[]>([]);
  const [finishingDialogOpen, setFinishingDialogOpen] = useState(false);
  const [activeFinishingFeature, setActiveFinishingFeature] = useState<FinishingFeature | null>(null);
  const [finishingDialogMode, setFinishingDialogMode] = useState<"add" | "edit" | "view">("add");

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

  // Custom building features handlers
  const handleAddCustomBuildingFeature = () => {
    if (customBuildingFeatures.length >= 3) return;
    const lastItem = customBuildingFeatures[customBuildingFeatures.length - 1];
    if (lastItem && !lastItem.title.trim()) return;
    setCustomBuildingFeatures((prev) => [
      ...prev,
      { id: `cbf_${Date.now()}`, title: "", value: "" },
    ]);
  };

  const handleUpdateCustomBuildingFeature = (
    id: string,
    field: "title" | "value",
    val: string
  ) => {
    if (val.length > 40) return;
    setCustomBuildingFeatures((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: val } : item))
    );
  };

  const handleRemoveCustomBuildingFeature = (id: string) => {
    if (customBuildingFeatures.length === 1) {
      setCustomBuildingFeatures([{ id: `cbf_${Date.now()}`, title: "", value: "" }]);
    } else {
      setCustomBuildingFeatures((prev) => prev.filter((item) => item.id !== id));
    }
  };

  // Finishing features handlers
  const handleOpenAddFinishingDialog = () => {
    if (finishingFeatures.length >= 3) return;
    setActiveFinishingFeature(null);
    setFinishingDialogMode("add");
    setFinishingDialogOpen(true);
  };

  const handleOpenViewFinishingDialog = (feature: FinishingFeature) => {
    setActiveFinishingFeature(feature);
    setFinishingDialogMode("view");
    setFinishingDialogOpen(true);
  };

  const handleOpenEditFinishingDialog = (feature: FinishingFeature) => {
    setActiveFinishingFeature(feature);
    setFinishingDialogMode("edit");
    setFinishingDialogOpen(true);
  };

  const handleSaveFinishingFeature = (feature: FinishingFeature) => {
    setFinishingFeatures((prev) => {
      const idx = prev.findIndex((f) => f.id === feature.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = feature;
        return updated;
      }
      if (prev.length >= 3) return prev;
      return [...prev, feature];
    });
  };

  const handleRemoveFinishingFeature = (id: string) => {
    setFinishingFeatures((prev) => prev.filter((f) => f.id !== id));
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
            {isTg ? "Бозгашт" : "Назад"}
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">
            {isTg ? "Иловаи маҷмааи истиқоматии нав (МИ)" : "Создание нового жилого комплекса (ЖК)"}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isTg
              ? "Параметрҳои маҷмааи истиқоматиро барои ҷойгиркунӣ дар феҳристи биноҳои нави Суғд пур кунед"
              : "Заполните параметры жилого комплекса для размещения в каталоге новостроек Согда"}
          </p>
        </div>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          {isTg
            ? "МИ бомуваффақият сохта шуд ва дар пойгоҳи додаҳо сабт гардид! Интиқолдиҳӣ..."
            : "ЖК успешно создан и сохранен в базе данных! Перенаправление..."}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Details */}
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Building2 className="h-4 w-4 text-emerald-600" />
              {isTg ? "Параметрҳои асосии маҷмаа" : "Основные параметры комплекса"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="proj-name" className="text-xs font-semibold">
                  {isTg ? "Номи маҷмааи истиқоматӣ *" : "Название жилого комплекса *"}
                </Label>
                <Input
                  id="proj-name"
                  placeholder={isTg ? "Масалан: МИ «Сирдарё Плаза»" : "Например: ЖК «Сирдарё Плаза»"}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">
                  {isTg ? "Синфи манзил *" : "Класс жилья *"}
                </Label>
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
                    <SelectItem value="economy">
                      {isTg ? "Синфи эконом" : "Эконом-класс"}
                    </SelectItem>
                    <SelectItem value="comfort">
                      {isTg ? "Синфи бароҳат (комфорт)" : "Комфорт-класс"}
                    </SelectItem>
                    <SelectItem value="business">
                      {isTg ? "Синфи тиҷоратӣ (бизнес)" : "Бизнес-класс"}
                    </SelectItem>
                    <SelectItem value="premium">
                      {isTg ? "Премиум / Элитӣ" : "Премиум / Элит"}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">
                  {isTg ? "Пардози хонаҳо *" : "Отделка квартир *"}
                </Label>
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
                    <SelectItem value="rough">
                      {isTg ? "Пардози аввалия (қуттӣ)" : "Черновая (коробка)"}
                    </SelectItem>
                    <SelectItem value="pre_finishing">
                      {isTg ? "Пардози пешакӣ (қуттии сафед)" : "Предчистовая (белый каркас)"}
                    </SelectItem>
                    <SelectItem value="turnkey">
                      {isTg ? "Бо таъмири пурра («калид дар даст»)" : "С ремонтом под ключ"}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="proj-short" className="text-xs font-semibold">
                  {isTg ? "Тавсифи мухтасар (барои корт дар феҳрист)" : "Краткое описание (для карточки в каталоге)"}
                </Label>
                <Input
                  id="proj-short"
                  placeholder={
                    isTg
                      ? "Маҷмааи элитии 16-ошёна дар соҳили Сирдарё бо манзара ба боғ..."
                      : "Элитный 16-этажный комплекс на набережной Сырдарьи с видом на парк..."
                  }
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="proj-desc" className="text-xs font-semibold">
                  {isTg ? "Тавсифи пурраи МИ" : "Полное описание ЖК"}
                </Label>
                <Textarea
                  id="proj-desc"
                  rows={4}
                  placeholder={
                    isTg
                      ? "Қарорҳои меъморӣ, тобоварии зилзилавӣ, системаҳои муҳандисиро муфассал нависед..."
                      : "Подробно опишите архитектурные решения, сейсмостойкость, инженерные системы..."
                  }
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
              {isTg ? "Мавқеъ дар вилояти Суғд" : "Локация в Согдийской области"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">
                  {isTg ? "Шаҳр / Ноҳияи Суғд" : "Город / Район Согда"}
                </Label>
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
                        {isTg ? c.nameTj : c.nameRu}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="proj-district" className="text-xs font-semibold">
                  {isTg ? "Маҳалла / Ноҳия" : "Микрорайон / Район"}
                </Label>
                <Input
                  id="proj-district"
                  placeholder={isTg ? "маҳаллаи 18, 19, 34, Абрешимбофон ва ғ." : "18 мкр, 19 мкр, 34 мкр, Шелкокомбинат и др."}
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="proj-address" className="text-xs font-semibold">
                  {isTg ? "Суроғаи дақиқ *" : "Точный адрес *"}
                </Label>
                <Input
                  id="proj-address"
                  placeholder={isTg ? "кӯчаи Раҳим Ҷалил 14" : "ул. Рахима Джалила 14"}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="proj-landmark" className="text-xs font-semibold">
                  {isTg ? "Нишона (ориентир)" : "Ориентир"}
                </Label>
                <Input
                  id="proj-landmark"
                  placeholder={
                    isTg
                      ? "Соҳили дарёи Сирдарё, рӯбарӯи муҷассамаи Сомонӣ"
                      : "Набережная реки Сырдарья, напротив памятника Сомони"
                  }
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
              {isTg ? "Хусусиятҳои бино ва муҳлати супоридан" : "Характеристики здания и сроки сдачи"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="proj-floors" className="text-xs font-semibold">
                  {isTg ? "Шумораи ошёнаҳо" : "Этажей"}
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
                  {isTg ? "Бахшҳо (даромадгоҳҳо)" : "Секций (подъездов)"}
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
                  {isTg ? "Семоҳаи супоридан" : "Квартал сдачи"}
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
                    <SelectItem value="1">{isTg ? "Семоҳаи 1" : "1 квартал"}</SelectItem>
                    <SelectItem value="2">{isTg ? "Семоҳаи 2" : "2 квартал"}</SelectItem>
                    <SelectItem value="3">{isTg ? "Семоҳаи 3" : "3 квартал"}</SelectItem>
                    <SelectItem value="4">{isTg ? "Семоҳаи 4" : "4 квартал"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="proj-year" className="text-xs font-semibold">
                  {isTg ? "Соли супоридан" : "Год сдачи"}
                </Label>
                <Input
                  id="proj-year"
                  type="number"
                  value={deadlineYear}
                  onChange={(e) => setDeadlineYear(e.target.value)}
                />
              </div>
            </div>

            {/* Standard Building & Land Specs */}
            <div className="pt-2 border-t">
              <h4 className="text-xs font-bold text-foreground mb-3">
                {isTg ? "Хусусиятҳои сохтмонӣ ва қитъаи замин" : "Конструктивные особенности и земельный участок"}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="proj-land-area" className="text-xs font-semibold">
                    {isTg ? "Масоҳати қитъа" : "Площадь участка"}
                  </Label>
                  <Input
                    id="proj-land-area"
                    placeholder={isTg ? "Масоҳати қитъаи сохтмончӣ" : "Площадь участка у застройщика"}
                    value={landArea}
                    onChange={(e) => setLandArea(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="proj-wall-material" className="text-xs font-semibold">
                    {isTg ? "Маводи деворҳо" : "Материал стен"}
                  </Label>
                  <Input
                    id="proj-wall-material"
                    placeholder={isTg ? "Газоблок / Хишт" : "Газоблок"}
                    value={wallMaterial}
                    onChange={(e) => setWallMaterial(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="proj-facade" className="text-xs font-semibold">
                    {isTg ? "Намои бино (фасад)" : "Фасад"}
                  </Label>
                  <Input
                    id="proj-facade"
                    placeholder={isTg ? "Плиткаи клинкерӣ / Санги табиӣ" : "Клинкерная плитка"}
                    value={facade}
                    onChange={(e) => setFacade(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="proj-cadastral" className="text-xs font-semibold">
                    {isTg ? "Рақами кадастрӣ" : "Кадастровый номер"}
                  </Label>
                  <Input
                    id="proj-cadastral"
                    placeholder={isTg ? "Рақами кадастрии қитъа" : "Кадастровый код участка"}
                    value={cadastralNumber}
                    onChange={(e) => setCadastralNumber(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Custom Building Features */}
            <div className="pt-3 border-t space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-foreground">
                    {isTg ? "Хусусиятҳои иловагӣ" : "Пользовательские характеристики"}
                  </h4>
                  <ResponsiveTooltip
                    title={isTg ? "Хусусиятҳои иловагӣ" : "Пользовательские характеристики"}
                    content={
                      isTg
                        ? "Шумо метавонед сарлавҳаи худро илова намоед, масалан «Гармидиҳӣ» ва қимати онро муайян кунед, масалан «Умумӣ (дегхонаи шахсӣ)»"
                        : "Вы можете добавить свой заголовок, например „Отопление“, и указать его значение, например „Общее (собственная котельная)“"
                    }
                  >
                    <span className="p-1 text-muted-foreground hover:text-emerald-600 cursor-pointer">
                      <HelpCircle className="h-3.5 w-3.5" />
                    </span>
                  </ResponsiveTooltip>
                </div>
                <span className="text-[11px] text-muted-foreground">
                  {isTg
                    ? `Илова шуд ${customBuildingFeatures.filter((f) => f.title.trim()).length} аз 3`
                    : `Добавлено ${customBuildingFeatures.filter((f) => f.title.trim()).length} из 3`}
                </span>
              </div>

              <div className="space-y-3">
                {customBuildingFeatures.map((feat) => (
                  <div
                    key={feat.id}
                    className="p-3 rounded-xl bg-muted/20 border space-y-2"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
                      {/* Title field */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Label className="text-[11px] font-semibold text-foreground">
                              {isTg ? "Сарлавҳаи шумо" : "Ваш заголовок"}
                            </Label>
                            <ResponsiveTooltip
                              title={isTg ? "Сарлавҳаи шумо" : "Пользовательский заголовок"}
                              content={
                                isTg
                                  ? "Шумо метавонед сарлавҳаи худро илова намоед, масалан «Гармидиҳӣ»"
                                  : "Вы можете добавить свой заголовок, например „Отопление“, и указать его значение, например „Общее (собственная котельная)“"
                              }
                            >
                              <span className="text-muted-foreground hover:text-emerald-600 cursor-pointer">
                                <HelpCircle className="h-3 w-3" />
                              </span>
                            </ResponsiveTooltip>
                          </div>
                          <span
                            className={`text-[10px] ${
                              feat.title.length >= 40
                                ? "text-amber-600 font-bold"
                                : "text-muted-foreground"
                            }`}
                          >
                            {feat.title.length}/40
                          </span>
                        </div>
                        <Input
                          placeholder={isTg ? "Масалан, Гармидиҳӣ" : "Например, Отопление"}
                          value={feat.title}
                          maxLength={40}
                          onChange={(e) =>
                            handleUpdateCustomBuildingFeature(
                              feat.id,
                              "title",
                              e.target.value
                            )
                          }
                          className="h-9 text-xs rounded-lg"
                        />
                      </div>

                      {/* Value field */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <Label className="text-[11px] font-semibold text-foreground">
                            {isTg ? "Қимати нишондиҳанда" : "Значение характеристики"}
                          </Label>
                          <span
                            className={`text-[10px] ${
                              feat.value.length >= 40
                                ? "text-amber-600 font-bold"
                                : "text-muted-foreground"
                            }`}
                          >
                            {feat.value.length}/40
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Input
                            placeholder={
                              isTg
                                ? "Масалан, Умумӣ (дегхонаи шахсӣ)"
                                : "Например, Общее (собственная котельная)"
                            }
                            value={feat.value}
                            maxLength={40}
                            onChange={(e) =>
                              handleUpdateCustomBuildingFeature(
                                feat.id,
                                "value",
                                e.target.value
                              )
                            }
                            className="h-9 text-xs rounded-lg flex-1"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              handleRemoveCustomBuildingFeature(feat.id)
                            }
                            title={isTg ? "Нест кардани нишондиҳанда" : "Удалить характеристику"}
                            className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg shrink-0 cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add next custom feature button */}
              {customBuildingFeatures.length < 3 && (
                <div className="pt-1 flex items-center justify-start">
                  <ResponsiveTooltip
                    title={isTg ? "Иловаи нишондиҳанда" : "Добавление характеристики"}
                    content={
                      isTg
                        ? "Шумо метавонед сарлавҳаи худро илова намоед, масалан «Гармидиҳӣ» ва қимати онро муайян кунед"
                        : "Вы можете добавить свой заголовок, например „Отопление“, и указать его значение, например „Общее (собственная котельная)“"
                    }
                  >
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddCustomBuildingFeature}
                      disabled={
                        !customBuildingFeatures[
                          customBuildingFeatures.length - 1
                        ]?.title.trim()
                      }
                      className="h-8 px-3 text-xs gap-1.5 border-dashed border-emerald-600/40 text-emerald-700 hover:border-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 rounded-lg cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      {isTg
                        ? `Иловаи хусусияти иловагӣ (${customBuildingFeatures.length}/3)`
                        : `Добавить пользовательскую характеристику (${customBuildingFeatures.length}/3)`}
                    </Button>
                  </ResponsiveTooltip>
                </div>
              )}
            </div>

            {/* Toggles */}
            <div className="pt-2 border-t grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                <span className="font-semibold">
                  {isTg ? "Таваққуфгоҳи зеризаминӣ" : "Подземный паркинг"}
                </span>
                <Switch
                  checked={hasUndergroundParking}
                  onCheckedChange={setHasUndergroundParking}
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                <span className="font-semibold">
                  {isTg ? "Лифтҳои тезрав" : "Скоростные лифты"}
                </span>
                <Switch checked={hasElevator} onCheckedChange={setHasElevator} />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                <span className="font-semibold">
                  {isTg ? "Гармидиҳии мустақил" : "Автономное отопление"}
                </span>
                <Switch
                  checked={hasAutonomousHeating}
                  onCheckedChange={setHasAutonomousHeating}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* NEW BLOCK: Finishing & Fit-out (Отделка) */}
        <Card>
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Paintbrush className="h-4 w-4 text-emerald-600" />
                {isTg ? "Пардоз ва таҷҳизонидан" : "Отделка и комплектация"}
              </CardTitle>
              <div className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200">
                {isTg ? "Намуди асосӣ: " : "Базовый тип: "}
                {finishing === "rough"
                  ? isTg ? "Пардози аввалия (қуттӣ)" : "Черновая"
                  : finishing === "pre_finishing"
                  ? isTg ? "Пардози пешакӣ (White box)" : "Предчистовая (White box)"
                  : isTg ? "Бо таъмири пурра" : "Под ключ"}
              </div>
            </div>
            <CardDescription className="text-xs">
              {isTg
                ? "То 3 хусусияти васеи пардозро бо тавсифи муфассал дар равзанаи модалӣ илова намоед"
                : "Добавьте до 3 расширенных характеристик отделки с подробным описанием в модальном окне"}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            {/* Added features cards */}
            {finishingFeatures.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {finishingFeatures.map((feat) => (
                  <div
                    key={feat.id}
                    className="p-3.5 rounded-xl border bg-card hover:border-emerald-500/40 transition-all flex flex-col justify-between space-y-2 shadow-xs group"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h5 className="text-xs font-bold text-foreground line-clamp-1">
                          {feat.title}
                        </h5>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {feat.description.length}/400
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                        {feat.description || (isTg ? "Бе тавсиф" : "Без описания")}
                      </p>
                    </div>

                    <div className="pt-2 border-t flex items-center justify-end gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenViewFinishingDialog(feat)}
                        title={isTg ? "Дидани тавсифи пурра" : "Посмотреть полное описание"}
                        className="h-7 px-2 text-[11px] text-muted-foreground hover:text-emerald-600 rounded-md gap-1 cursor-pointer"
                      >
                        <Eye className="h-3 w-3" />
                        {isTg ? "Муоина" : "Просмотр"}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenEditFinishingDialog(feat)}
                        title={isTg ? "Таҳрир кардан" : "Редактировать"}
                        className="h-7 w-7 text-muted-foreground hover:text-foreground rounded-md cursor-pointer"
                      >
                        <Edit3 className="h-3 w-3" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveFinishingFeature(feat.id)}
                        title={isTg ? "Нест кардан" : "Удалить"}
                        className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md cursor-pointer"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-5 rounded-xl border border-dashed text-center space-y-2 bg-muted/10">
                <div className="h-9 w-9 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
                  <Sparkles className="h-4 w-4" />
                </div>
                <p className="text-xs font-medium text-foreground">
                  {isTg
                    ? "Хусусиятҳои инфиродии пардоз ҳоло илова нашудаанд"
                    : "Индивидуальные характеристики отделки еще не добавлены"}
                </p>
                <p className="text-[11px] text-muted-foreground max-w-md mx-auto">
                  {isTg
                    ? "Шумо метавонед то 3 нишондиҳандаи хосро (домофон, дари даромадгоҳ, садоизолятсия, ҳамворкунии фарш) бо тавсифи муфассал илова намоед."
                    : "Вы можете добавить до 3 уникальных параметров (домофон, входная дверь, звукоизоляция, стяжка) с подробным описанием."}
                </p>
              </div>
            )}

            {/* Add button with Tooltip */}
            <div className="flex items-center justify-between pt-1">
              {finishingFeatures.length < 3 ? (
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleOpenAddFinishingDialog}
                    className="h-9 px-4 text-xs font-semibold bg-white dark:bg-card border-emerald-600/40 text-emerald-700 hover:border-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 rounded-xl gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    {isTg
                      ? `Иловаи хусусияти пардоз (${finishingFeatures.length}/3)`
                      : `Добавить характеристику отделки (${finishingFeatures.length}/3)`}
                  </Button>

                  <ResponsiveTooltip
                    title={isTg ? "Хусусияти пардоз" : "Характеристика отделки"}
                    content={
                      isTg
                        ? "Шумо метавонед хусусияти худро илова намоед, масалан «Домофон» ва тавсифи муфассали онро пешниҳод кунед"
                        : "Вы можете добавить свою характеристику, например „Домофон“, и дать ей расширенное описание, например „В каждой квартире установлен IP-видеодомофон с возможностью интеграции в систему «Умный дом»“"
                    }
                  >
                    <span className="p-1.5 text-muted-foreground hover:text-emerald-600 cursor-pointer">
                      <HelpCircle className="h-4 w-4" />
                    </span>
                  </ResponsiveTooltip>
                </div>
              ) : (
                <div className="text-xs text-emerald-700 dark:text-emerald-300 font-medium flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-200">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {isTg
                    ? "Шумораи ниҳоии хусусиятҳо илова шуд (3 аз 3)"
                    : "Добавлено максимальное количество характеристик (3 из 3)"}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pricing & Installments (Рассрочка) */}
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Percent className="h-4 w-4 text-emerald-600" />
              {isTg
                ? "Нархгузорӣ ва шартҳои пардохти қисм-қисм"
                : "Ценообразование и условия рассрочки"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="proj-price-usd" className="text-xs font-semibold">
                  {isTg ? "Нархи ибтидоӣ барои 1 м² бо USD ($)" : "Базовая цена за м² в USD ($)"}
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
                  {isTg
                    ? "Муодили он бо сомонӣ (TJS, бо қурби 10.95)"
                    : "Эквивалент в TJS (сомони, по курсу 10.95)"}
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
                  {isTg
                    ? "Муҳлати пардохти қисм-қисми бефоиз (моҳ)"
                    : "Срок беспроцентной рассрочки (месяцев)"}
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
                  {isTg ? "Пешпардохт (%)" : "Первоначальный взнос (%)"}
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
              {isTg ? "Нигористони аксҳо ва ҳуҷҷатҳо" : "Фотогалерея и документы"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="proj-cover" className="text-xs font-semibold">
                {isTg ? "Акси асосии маҷмаа (Муқова)" : "Главное фото комплекса (Обложка)"}
              </Label>
              <Input
                id="proj-cover"
                value={coverImageUrl}
                onChange={(e) => setCoverImageUrl(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="proj-gallery" className="text-xs font-semibold">
                {isTg
                  ? "Аксҳои иловагӣ (ҳар як пайванд дар сатри алоҳида)"
                  : "Дополнительные фото (URL по одному на строке)"}
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
                {isTg
                  ? "Ҳуҷҷатҳои иҷозатдиҳӣ ва сертификатҳо"
                  : "Разрешительные документы и сертификаты"}
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
              {isTg ? "Бекор кардан" : "Отмена"}
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={saving}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-6 gap-2 shadow-xs cursor-pointer"
          >
            <Save className="h-4 w-4" />
            {saving
              ? isTg
                ? "Дар ҳоли сабт..."
                : "Сохранение..."
              : isTg
              ? "Интишори маҷмааи истиқоматӣ"
              : "Опубликовать жилой комплекс"}
          </Button>
        </div>
      </form>

      {/* Finishing Feature Dialog */}
      <FinishingFeatureDialog
        open={finishingDialogOpen}
        onOpenChange={setFinishingDialogOpen}
        initialData={activeFinishingFeature}
        mode={finishingDialogMode}
        onSave={handleSaveFinishingFeature}
        onEditRequested={(feat) => {
          setActiveFinishingFeature(feat);
          setFinishingDialogMode("edit");
        }}
      />
    </div>
  );
}
