"use client";

import React, { useState, useEffect } from "react";
import {
  Megaphone,
  Plus,
  Building2,
  DollarSign,
  TrendingUp,
  Sliders,
  CheckCircle2,
  Clock,
  Eye,
  MousePointerClick,
  Layers,
  MapPin,
  Calendar,
  Sparkles,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  AdvertiserDto,
  AdCampaignDto,
  getAllAdvertisers,
  getAllCampaigns,
  createAdvertiser,
  createCampaign,
} from "@/lib/ads/ad-engine";

export default function SuperAdminAdsManagementPage() {
  const [advertisers, setAdvertisers] = useState<AdvertiserDto[]>([]);
  const [campaigns, setCampaigns] = useState<AdCampaignDto[]>([]);
  const [activeTab, setActiveTab] = useState<"advertisers" | "campaigns" | "create">("advertisers");

  // Create Advertiser Form State
  const [companyName, setCompanyName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [tin, setTin] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [phone, setPhone] = useState("+992 ");
  const [email, setEmail] = useState("");
  const [industry, setIndustry] = useState<any>("developer");
  const [tier, setTier] = useState<any>("auction_bidder");
  const [contractValue, setContractValue] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    setAdvertisers(getAllAdvertisers());
    setCampaigns(getAllCampaigns());
  }, []);

  const handleCreateAdvertiser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !brandName || !contactPerson) return;

    const newAdv = createAdvertiser({
      companyName,
      brandName,
      tin,
      contactPerson,
      phone,
      email,
      websiteUrl: "",
      industry,
      tier,
      status: "active",
      balanceTjs: tier === "sponsor_annual" ? Number(contractValue) || 100000 : 20000,
      balanceUsd: tier === "sponsor_annual" ? Math.round((Number(contractValue) || 100000) / 10.9) : 1800,
      annualContractValueTjs: tier === "sponsor_annual" ? Number(contractValue) || 100000 : 0,
      notes: "Добавлен через супер-админ панель",
    });

    setAdvertisers(getAllAdvertisers());
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setActiveTab("advertisers");
    }, 1500);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">
            <Megaphone className="h-4 w-4" />
            <span>Рекламный движок и спонсорские пакеты</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Управление рекламой и спонсорами
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Пакеты для гигантов (Банк Эсхата, МегаФон, Tcell, Фаровон, Сомон Сохтмон), аукционные ставки и таргетинг.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => setActiveTab("create")}
            className="h-10 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>Добавить рекламодателя</span>
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab("advertisers")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "advertisers"
              ? "bg-slate-900 text-white shadow-2xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          Рекламодатели ({advertisers.length})
        </button>

        <button
          onClick={() => setActiveTab("campaigns")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "campaigns"
              ? "bg-slate-900 text-white shadow-2xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          Кампании и Аукцион ({campaigns.length})
        </button>

        <button
          onClick={() => setActiveTab("create")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "create"
              ? "bg-emerald-600 text-white shadow-2xs"
              : "text-emerald-700 hover:bg-emerald-50"
          }`}
        >
          + Новый рекламодатель
        </button>
      </div>

      {/* TAB 1: Advertisers */}
      {activeTab === "advertisers" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="rounded-2xl border-slate-200/80 shadow-xs p-5">
              <span className="text-xs text-slate-500 font-medium">Годовых спонсоров</span>
              <div className="text-2xl font-black text-emerald-600 mt-1">
                {advertisers.filter((a) => a.tier === "sponsor_annual").length} компании
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Гарантированный показ 365 дней во всех категориях
              </p>
            </Card>

            <Card className="rounded-2xl border-slate-200/80 shadow-xs p-5">
              <span className="text-xs text-slate-500 font-medium">Участников аукциона</span>
              <div className="text-2xl font-black text-blue-600 mt-1">
                {advertisers.filter((a) => a.tier === "auction_bidder").length} компаний
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Конкурируют за показы по ставке CPM / CPC
              </p>
            </Card>

            <Card className="rounded-2xl border-slate-200/80 shadow-xs p-5">
              <span className="text-xs text-slate-500 font-medium">Общий портфель спонсорства</span>
              <div className="text-2xl font-black text-slate-900 mt-1">
                305 000 сомони
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                ≈ $27 980 годовой доход платформы
              </p>
            </Card>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-3">Бренд / Юрлицо</th>
                    <th className="py-3 px-3">Контакты</th>
                    <th className="py-3 px-3">Тип пакета</th>
                    <th className="py-3 px-3">Контракт / Баланс</th>
                    <th className="py-3 px-3">Статус</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {advertisers.map((adv) => (
                    <tr key={adv.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-slate-900 text-sm">{adv.brandName}</div>
                        <div className="text-[11px] text-slate-400">{adv.companyName}</div>
                        {adv.tin && <div className="text-[10px] text-slate-400 font-mono">ИНН: {adv.tin}</div>}
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="text-slate-800">{adv.contactPerson}</div>
                        <div className="text-slate-500 font-mono">{adv.phone}</div>
                        <div className="text-slate-400">{adv.email}</div>
                      </td>
                      <td className="py-3.5 px-3">
                        {adv.tier === "sponsor_annual" ? (
                          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-[10px] font-bold">
                            Годовой спонсор
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-slate-600 border-slate-300 text-[10px]">
                            Аукцион ставок
                          </Badge>
                        )}
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-slate-900 font-mono text-sm">
                          {adv.annualContractValueTjs
                            ? `${adv.annualContractValueTjs.toLocaleString()} сомони / год`
                            : `${adv.balanceTjs.toLocaleString()} сомони`}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Израсходовано: {adv.totalSpentTjs.toLocaleString()} сомони
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="inline-flex items-center gap-1.5 text-emerald-600 font-semibold text-xs">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Активен</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Campaigns */}
      {activeTab === "campaigns" && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm overflow-hidden">
            <h3 className="text-base font-bold text-slate-900 mb-4">
              Активные рекламные кампании и ставки
            </h3>

            <div className="space-y-4">
              {campaigns.map((camp) => (
                <div
                  key={camp.id}
                  className="p-5 rounded-2xl border border-slate-200 hover:border-emerald-400 hover:shadow-xs transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-base">{camp.name}</h4>
                        <Badge
                          className={
                            camp.billingModel === "annual_sponsorship"
                              ? "bg-emerald-600 text-white text-[10px]"
                              : "bg-blue-600 text-white text-[10px]"
                          }
                        >
                          {camp.billingModel === "annual_sponsorship"
                            ? "Годовой спонсор"
                            : `Аукцион: ${camp.bidAmountTjs} TJS (${camp.billingModel})`}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Рекламодатель ID: {camp.advertiserId}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-mono">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Показы</span>
                        <strong className="text-slate-900 font-bold">{camp.impressionsCount.toLocaleString()}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Клики</span>
                        <strong className="text-emerald-600 font-bold">{camp.clicksCount.toLocaleString()}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">CTR</span>
                        <strong className="text-slate-800 font-bold">
                          {camp.impressionsCount > 0
                            ? ((camp.clicksCount / camp.impressionsCount) * 100).toFixed(2)
                            : "0"}%
                        </strong>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-600">
                    <span className="font-medium text-slate-400">Таргетинг:</span>
                    <Badge variant="secondary" className="text-[10px]">
                      Гео: {camp.geoTargeting.join(", ")}
                    </Badge>
                    <Badge variant="secondary" className="text-[10px]">
                      Категории: {camp.categoryTargeting.join(", ")}
                    </Badge>
                    <Badge variant="secondary" className="text-[10px]">
                      Слот: {camp.placementSlots.join(", ")}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Create Advertiser */}
      {activeTab === "create" && (
        <Card className="rounded-3xl border-slate-200/80 shadow-sm max-w-2xl mx-auto">
          <CardContent className="p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Подключение нового рекламодателя / спонсора
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Создание профиля компании в рекламной платформе Maskani.tj
              </p>
            </div>

            {isSuccess && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Рекламодатель успешно добавлен в систему!</span>
              </div>
            )}

            <form onSubmit={handleCreateAdvertiser} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Название бренда (например, «Фаровон», «Байзо»)
                  </label>
                  <Input
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="Байзо"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Юридическое название компании
                  </label>
                  <Input
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="ООО «Байзо-2020»"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Отрасль / Сфера деятельности
                  </label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white font-medium text-xs text-slate-800"
                  >
                    <option value="bank">Банки и Финансы (Эсхата, Арванд)</option>
                    <option value="telecom">Телеком и Связь (МегаФон, Tcell)</option>
                    <option value="developer">Застройщик (Сомон Сохтмон)</option>
                    <option value="manufacturing">Производство и Стройматериалы (Фаровон, Сугдцемент)</option>
                    <option value="retail">Ритейл и Бытовая техника (Артель, Амид)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Тип рекламного пакета
                  </label>
                  <select
                    value={tier}
                    onChange={(e) => setTier(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white font-medium text-xs text-slate-800"
                  >
                    <option value="sponsor_annual">Годовой эксклюзивный спонсор (365 дней)</option>
                    <option value="auction_bidder">Аукцион показов по ставке (Яндекс-модель)</option>
                  </select>
                </div>
              </div>

              {tier === "sponsor_annual" && (
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Стоимость годового контракта (в сомони)
                  </label>
                  <Input
                    value={contractValue}
                    onChange={(e) => setContractValue(e.target.value)}
                    placeholder="Например, 100000"
                    type="number"
                    required
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Контактное лицо (ФИО / Должность)
                  </label>
                  <Input
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    placeholder="Рустам Саидов (Начальник отдела рекламы)"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Телефон для связи
                  </label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+992 92 000 0000"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  Email для отчетов
                </label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="marketing@company.tj"
                  type="email"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab("advertisers")}
                  className="rounded-xl"
                >
                  Отмена
                </Button>
                <Button
                  type="submit"
                  className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                >
                  Сохранить рекламодателя
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
