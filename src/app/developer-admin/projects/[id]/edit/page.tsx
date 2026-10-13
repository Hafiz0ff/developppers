"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { INITIAL_PROJECTS } from "@/lib/data/mock-db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  ImageIcon,
} from "lucide-react";

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params?.id as string;

  const proj =
    INITIAL_PROJECTS.find((p) => p.id === projectId) || INITIAL_PROJECTS[0];

  const [name, setName] = useState(proj.name);
  const [buildingClass, setBuildingClass] = useState(proj.buildingClass);
  const [finishing, setFinishing] = useState(proj.finishing);
  const [city, setCity] = useState(proj.city);
  const [district, setDistrict] = useState(proj.district);
  const [address, setAddress] = useState(proj.address);
  const [landmark, setLandmark] = useState(proj.landmark);
  const [floorsCount, setFloorsCount] = useState(proj.floorsCount.toString());
  const [sectionsCount, setSectionsCount] = useState(proj.sectionsCount.toString());
  const [deadlineQuarter, setDeadlineQuarter] = useState(proj.deadlineQuarter.toString());
  const [deadlineYear, setDeadlineYear] = useState(proj.deadlineYear.toString());
  const [minPricePerMeterUsd, setMinPricePerMeterUsd] = useState(proj.minPricePerMeterUsd.toString());
  const [minPricePerMeterTjs, setMinPricePerMeterTjs] = useState(proj.minPricePerMeterTjs.toString());
  const [installmentMonths, setInstallmentMonths] = useState(proj.installmentMonths.toString());
  const [installmentDownPayment, setInstallmentDownPayment] = useState(proj.installmentDownPaymentPercent.toString());
  const [hasUndergroundParking, setHasUndergroundParking] = useState(proj.hasUndergroundParking);
  const [hasElevator, setHasElevator] = useState(proj.hasElevator);
  const [hasAutonomousHeating, setHasAutonomousHeating] = useState(proj.hasAutonomousHeating);
  const [shortDescription, setShortDescription] = useState(proj.shortDescription);
  const [description, setDescription] = useState(proj.description);

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 600);
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/developer-admin/projects">
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1">
              <ArrowLeft className="h-3.5 w-3.5" />
              Назад к проектам
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-foreground">
              Редактирование: {proj.name}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Обновление параметров жилого комплекса и условий продаж
            </p>
          </div>
        </div>
        {success && (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-300">
            <CheckCircle2 className="h-4 w-4" />
            Изменения сохранены!
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Building2 className="h-4 w-4 text-emerald-600" />
              Основные параметры
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="edit-name" className="text-xs font-semibold">
                  Название комплекса
                </Label>
                <Input
                  id="edit-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Класс жилья</Label>
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
                <Label className="text-xs font-semibold">Отделка</Label>
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
                <Label htmlFor="edit-short" className="text-xs font-semibold">
                  Краткое описание
                </Label>
                <Input
                  id="edit-short"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="edit-desc" className="text-xs font-semibold">
                  Подробное описание
                </Label>
                <Textarea
                  id="edit-desc"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location & Specs */}
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <MapPin className="h-4 w-4 text-emerald-600" />
              Локация и параметры
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Город / Район</Label>
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
                <Label htmlFor="edit-district" className="text-xs font-semibold">
                  Микрорайон
                </Label>
                <Input
                  id="edit-district"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-address" className="text-xs font-semibold">
                  Адрес
                </Label>
                <Input
                  id="edit-address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-landmark" className="text-xs font-semibold">
                  Ориентир
                </Label>
                <Input
                  id="edit-landmark"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

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
            {saving ? "Сохранение..." : "Сохранить изменения"}
          </Button>
        </div>
      </form>
    </div>
  );
}
