"use client";

import React, { useState } from "react";
import { INITIAL_DEVELOPERS } from "@/lib/data/mock-db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  CheckCircle2,
  Phone,
  MessageCircle,
  Globe,
  MapPin,
  Image as ImageIcon,
} from "lucide-react";

export default function DeveloperProfilePage() {
  const dev = INITIAL_DEVELOPERS[0]; // Рахш Сохтмон
  const [name, setName] = useState(dev.name);
  const [description, setDescription] = useState(dev.description);
  const [officeAddress, setOfficeAddress] = useState(dev.officeAddress);
  const [city, setCity] = useState(dev.city);
  const [phone, setPhone] = useState(dev.phone);
  const [phoneSecondary, setPhoneSecondary] = useState(dev.phoneSecondary || "");
  const [whatsapp, setWhatsapp] = useState(dev.whatsapp);
  const [telegram, setTelegram] = useState(dev.telegram || "");
  const [email, setEmail] = useState(dev.email);
  const [websiteUrl, setWebsiteUrl] = useState(dev.websiteUrl || "");
  const [logoUrl, setLogoUrl] = useState(dev.logoUrl);
  const [coverUrl, setCoverUrl] = useState(dev.coverUrl);
  const [foundedYear, setFoundedYear] = useState(dev.foundedYear.toString());

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">
            Профиль компании-застройщика
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Информация отображается на публичной странице компании и карточках ваших ЖК
          </p>
        </div>
        {savedSuccess && (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-300">
            <CheckCircle2 className="h-4 w-4" />
            Изменения успешно сохранены!
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Info */}
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Building2 className="h-4 w-4 text-emerald-600" />
              Основная информация
            </CardTitle>
            <CardDescription className="text-xs">
              Официальное название и позиционирование на рынке Согдийской области
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="dev-name" className="text-xs">
                  Название компании
                </Label>
                <Input
                  id="dev-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="dev-year" className="text-xs">
                  Год основания
                </Label>
                <Input
                  id="dev-year"
                  type="number"
                  value={foundedYear}
                  onChange={(e) => setFoundedYear(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="dev-desc" className="text-xs">
                Описание компании
              </Label>
              <Textarea
                id="dev-desc"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Media: Logo & Cover */}
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-emerald-600" />
              Логотип и обложка витрины
            </CardTitle>
            <CardDescription className="text-xs">
              URL-ссылки на изображения логотипа (квадратное) и главного баннера
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="dev-logo" className="text-xs">
                  Ссылка на логотип (URL)
                </Label>
                <Input
                  id="dev-logo"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                />
                <div className="mt-2 h-16 w-16 rounded-xl border overflow-hidden bg-muted">
                  <img src={logoUrl} alt="Превью логотипа" className="w-full h-full object-cover" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="dev-cover" className="text-xs">
                  Ссылка на обложку (URL)
                </Label>
                <Input
                  id="dev-cover"
                  value={coverUrl}
                  onChange={(e) => setCoverUrl(e.target.value)}
                />
                <div className="mt-2 h-16 w-full rounded-xl border overflow-hidden bg-muted">
                  <img src={coverUrl} alt="Превью обложки" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contacts & Location */}
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <MapPin className="h-4 w-4 text-emerald-600" />
              Контакты и локация в Согде
            </CardTitle>
            <CardDescription className="text-xs">
              Контакты, по которым клиенты смогут связаться с отделом продаж
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Город офиса</Label>
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
                <Label htmlFor="dev-address" className="text-xs">
                  Адрес офиса продаж
                </Label>
                <Input
                  id="dev-address"
                  value={officeAddress}
                  onChange={(e) => setOfficeAddress(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="dev-phone" className="text-xs">
                  Основной телефон отдела продаж
                </Label>
                <Input
                  id="dev-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="dev-whatsapp" className="text-xs">
                  WhatsApp (для быстрых лидов)
                </Label>
                <Input
                  id="dev-whatsapp"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="dev-telegram" className="text-xs">
                  Telegram канал / юзернейм
                </Label>
                <Input
                  id="dev-telegram"
                  value={telegram}
                  onChange={(e) => setTelegram(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="dev-email" className="text-xs">
                  Электронная почта (Email)
                </Label>
                <Input
                  id="dev-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="dev-site" className="text-xs">
                  Официальный веб-сайт
                </Label>
                <Input
                  id="dev-site"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-6 shadow-xs gap-2"
          >
            <Save className="h-4 w-4" />
            Сохранить изменения
          </Button>
        </div>
      </form>
    </div>
  );
}
