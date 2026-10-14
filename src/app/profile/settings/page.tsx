"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/language-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Send,
  Bell,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Smartphone,
  ChevronRight,
  ArrowLeft,
  Users,
  TrendingUp,
  User,
  Copy,
  Check,
  RefreshCw,
  Sparkles,
} from "lucide-react";

export default function ProfileSettingsPage() {
  const { language } = useLanguage();
  const isTg = language === "tg";

  const [chatId, setChatId] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [botUsername, setBotUsername] = useState("SogdRealtyBot");
  const [botConfigured, setBotConfigured] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);
  const [copiedBot, setCopiedBot] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true);
        const res = await fetch("/api/profile/telegram");
        const data = await res.json();
        if (data.success) {
          setChatId(data.settings.chatId || "");
          setNotificationsEnabled(data.settings.enabled);
          if (data.botUsername) setBotUsername(data.botUsername);
          setBotConfigured(data.botConfigured);
        }
      } catch (err) {
        console.error("Failed to load telegram settings:", err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      setSaving(true);
      setStatusMessage(null);
      const res = await fetch("/api/profile/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatId,
          enabled: notificationsEnabled,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMessage({
          type: "success",
          text: isTg ? "Танзимот бомуваффақият сабт шуд!" : "Настройки успешно сохранены!",
        });
      } else {
        setStatusMessage({
          type: "error",
          text: data.error || (isTg ? "Хатогӣ ҳангоми сабт" : "Ошибка сохранения"),
        });
      }
    } catch (err) {
      setStatusMessage({
        type: "error",
        text: isTg ? "Хатогии шабака ҳангоми сабт" : "Сетевая ошибка при сохранении",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleTestNotification = async () => {
    if (!chatId.trim()) {
      setStatusMessage({
        type: "error",
        text: isTg
          ? "Лутфан қабл аз озмоиш Telegram Chat ID-и худро ворид кунед"
          : "Пожалуйста, укажите ваш Telegram Chat ID перед отправкой теста",
      });
      return;
    }

    try {
      setTesting(true);
      setStatusMessage(null);
      const res = await fetch("/api/profile/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatId,
          action: "test",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMessage({
          type: "success",
          text: data.message || (isTg ? "Огоҳиномаи озмоишӣ ба Telegram фиристода шуд!" : "Тестовое уведомление отправлено в Telegram!"),
        });
      } else {
        setStatusMessage({
          type: "error",
          text: data.error || (isTg ? "Паём фиристода нашуд. Chat ID-ро санҷед." : "Не удалось отправить сообщение. Проверьте Chat ID."),
        });
      }
    } catch (err) {
      setStatusMessage({
        type: "error",
        text: isTg ? "Хатогии шабака ҳангоми фиристодани озмоиш" : "Сетевая ошибка при отправке теста",
      });
    } finally {
      setTesting(false);
    }
  };

  const isConnected = Boolean(chatId && chatId.trim().length > 0);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-24">
      {/* 1. TOP HEADER */}
      <div className="bg-white border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-5">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase font-bold tracking-wider text-emerald-600 mb-1">
              <Link href="/profile/crm" className="hover:underline flex items-center gap-1 font-semibold">
                <ArrowLeft className="h-3 w-3" />
                {isTg ? "Кабинети шахсӣ" : "Личный кабинет"}
              </Link>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {isTg ? "Танзимоти профил ва пайвастшавиҳо" : "Настройки профиля & Интеграции"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {isTg
                ? "Идоракунии маълумоти шахсӣ, амният ва огоҳиномаҳои фаврӣ"
                : "Управление персональными данными, безопасностью и моментальными уведомлениями"}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link href="/profile/crm">
              <Button variant="outline" className="h-9 px-3 text-xs font-semibold gap-1.5 border-slate-200 cursor-pointer">
                <Users className="h-3.5 w-3.5 text-emerald-600" />
                {isTg ? "Канбан CRM" : "Канбан CRM"}
              </Button>
            </Link>

            <Link href="/profile/analytics">
              <Button variant="outline" className="h-9 px-3 text-xs font-semibold gap-1.5 border-slate-200 cursor-pointer">
                <TrendingUp className="h-3.5 w-3.5 text-slate-600" />
                {isTg ? "Таҳлил" : "Аналитика"}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
        {/* 2. USER OVERVIEW CARD */}
        <Card className="bg-white border-slate-200/80 shadow-xs rounded-2xl overflow-hidden">
          <CardHeader className="p-5 pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-base">
                РА
              </div>
              <div>
                <CardTitle className="text-base font-bold text-slate-900">
                  Рустам Аҳмедов
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  {isTg
                    ? "Мутахассиси амвол • Агентии «Суғд-Инвест» (ш. Хуҷанд)"
                    : "Риелтор • Агентство «Сугд-Инвест» (г. Худжанд)"}
                </CardDescription>
              </div>
            </div>

            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-semibold gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              {isTg ? "Тасдиқшуда" : "Верифицирован"}
            </Badge>
          </CardHeader>

          <CardContent className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block font-semibold text-[11px]">
                {isTg ? "Телефон:" : "Телефон:"}
              </span>
              <span className="font-bold text-slate-800 font-mono">+992 92 777 00 22</span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold text-[11px]">
                {isTg ? "Шаҳри фаъолият:" : "Город присутствия:"}
              </span>
              <span className="font-bold text-slate-800">
                {isTg ? "Хуҷанд / Вилояти Суғд" : "Худжанд / Согдийская область"}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold text-[11px]">
                {isTg ? "Нақш дар платформа:" : "Роль на платформе:"}
              </span>
              <span className="font-bold text-slate-800">
                {isTg ? "Даллоли амвол / Агентии амволи ғайриманқул" : "Маклер / Агентство недвижимости"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* 3. TELEGRAM INTEGRATION CARD */}
        <Card className="bg-white border-slate-200/80 shadow-xs rounded-2xl overflow-hidden">
          <CardHeader className="p-5 sm:p-6 pb-4 border-b border-slate-100 bg-gradient-to-r from-sky-50/50 via-white to-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-sky-500 text-white flex items-center justify-center shadow-md shadow-sky-500/20">
                  <Send className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg font-bold text-slate-900">
                      {isTg ? "Огоҳиномаҳои фаврии Telegram" : "Мгновенные Telegram-уведомления"}
                    </CardTitle>
                    {isConnected ? (
                      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-bold gap-1">
                        <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                        {isTg ? "Пайваст шуд" : "Подключено"}
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-slate-100 text-slate-600 text-[10px] font-semibold">
                        {isTg ? "Танзим нашудааст" : "Не настроено"}
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="text-xs text-slate-500 mt-0.5">
                    {isTg
                      ? "Огоҳиномаҳо дар бораи зангҳо, гузариш ба WhatsApp ва дархостҳои навро бевосита дар Telegram қабул кунед"
                      : "Получайте пуши о звонках, кликах WhatsApp и новых заявках сразу в Telegram"}
                  </CardDescription>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Label htmlFor="telegram-toggle" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  {notificationsEnabled
                    ? isTg
                      ? "Фаъол"
                      : "Включены"
                    : isTg
                    ? "Хомӯш"
                    : "Выключены"}
                </Label>
                <Switch
                  id="telegram-toggle"
                  checked={notificationsEnabled}
                  onCheckedChange={setNotificationsEnabled}
                />
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-5 sm:p-6 space-y-6">
            {/* Step-by-step Connection instructions */}
            <div className="rounded-xl border border-sky-100 bg-sky-50/40 p-4 space-y-3">
              <h4 className="font-bold text-xs text-sky-950 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-sky-600" />
                {isTg ? "Дастури пайвастшавӣ дар 30 сония:" : "Инструкция по подключению за 30 секунд:"}
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-600">
                <div className="p-3 bg-white rounded-lg border border-sky-100/80 space-y-1.5">
                  <div className="font-bold text-sky-700 flex items-center gap-1.5">
                    <span className="h-5 w-5 rounded-full bg-sky-100 text-sky-800 text-[11px] font-extrabold flex items-center justify-center">1</span>
                    {isTg ? "Ботро фаъол созед" : "Запустите бота"}
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    {isTg
                      ? "Боти расмии платформаро дар Telegram кушоед ва тугмаи «Start»-ро пахш кунед:"
                      : "Откройте официального бота платформы в Telegram и нажмите «Start»:"}
                  </p>
                  <a
                    href={`https://t.me/${botUsername}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-600 hover:underline pt-0.5"
                  >
                    @{botUsername}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>

                <div className="p-3 bg-white rounded-lg border border-sky-100/80 space-y-1.5">
                  <div className="font-bold text-sky-700 flex items-center gap-1.5">
                    <span className="h-5 w-5 rounded-full bg-sky-100 text-sky-800 text-[11px] font-extrabold flex items-center justify-center">2</span>
                    {isTg ? "Chat ID-ро муайян кунед" : "Узнайте Chat ID"}
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    {isTg
                      ? "Фармони /id-ро ба бот фиристед ё ба @userinfobot нависед, то ID-и худро гиред."
                      : "Отправьте команду /id боту или напишите в @userinfobot, чтобы скопировать ваш персональный ID."}
                  </p>
                </div>

                <div className="p-3 bg-white rounded-lg border border-sky-100/80 space-y-1.5">
                  <div className="font-bold text-sky-700 flex items-center gap-1.5">
                    <span className="h-5 w-5 rounded-full bg-sky-100 text-sky-800 text-[11px] font-extrabold flex items-center justify-center">3</span>
                    {isTg ? "Гузоред ва сабт намоед" : "Вставьте и сохраните"}
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    {isTg
                      ? "Рақамро дар сатри поён гузоред, сабт кунед ва тугмаи «Санҷиш»-ро пахш намоед."
                      : "Вставьте номер в поле ниже, сохраните и нажмите кнопку «Тест» для проверки."}
                  </p>
                </div>
              </div>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <Label htmlFor="chat-id" className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                  <span>{isTg ? "Telegram Chat ID-и шумо *" : "Ваш Telegram Chat ID *"}</span>
                  <span className="text-[11px] font-normal text-slate-400">
                    {isTg ? "Масалан: 123456789 ё -100123456789 (барои гурӯҳ)" : "Например: 123456789 или -100123456789 (для группы)"}
                  </span>
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="chat-id"
                    type="text"
                    placeholder={isTg ? "Telegram Chat ID-и худро ворид кунед..." : "Введите ваш Telegram Chat ID..."}
                    value={chatId}
                    onChange={(e) => setChatId(e.target.value)}
                    className="h-10 text-xs font-mono pr-24 border-slate-200 bg-slate-50 focus:bg-white"
                  />
                  <div className="absolute right-1.5 top-1.5">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleTestNotification}
                      disabled={testing || !chatId.trim()}
                      className="h-7 px-2.5 text-[11px] font-semibold text-sky-600 hover:text-sky-700 hover:bg-sky-50 gap-1 cursor-pointer"
                    >
                      {testing ? <RefreshCw className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
                      {isTg ? "Санҷиш" : "Тест"}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Status Banner */}
              {statusMessage && (
                <div
                  className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                    statusMessage.type === "success"
                      ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                      : "bg-red-50 border-red-200 text-red-800"
                  }`}
                >
                  {statusMessage.type === "success" ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
                  )}
                  <span>{statusMessage.text}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <a
                  href={`https://t.me/${botUsername}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 hover:underline"
                >
                  <Send className="h-3.5 w-3.5" />
                  {isTg ? `Гузариш ба @${botUsername}` : `Перейти к @${botUsername}`}
                  <ExternalLink className="h-3 w-3" />
                </a>

                <div className="flex items-center gap-2">
                  <Button
                    type="submit"
                    disabled={saving}
                    className="h-9 px-4 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs cursor-pointer"
                  >
                    {saving
                      ? isTg
                        ? "Дар ҳоли сабт..."
                        : "Сохранение..."
                      : isTg
                      ? "Сабти танзимот"
                      : "Сохранить настройки"}
                  </Button>
                </div>
              </div>
            </form>

            {/* Notification Preview */}
            <div className="border-t border-slate-100 pt-5 space-y-2">
              <h5 className="font-semibold text-xs text-slate-700">
                {isTg ? "Намунаи огоҳинома дар Telegram:" : "Пример входящего пуша в Telegram:"}
              </h5>
              <div className="p-3.5 rounded-xl bg-slate-900 text-slate-100 text-[11px] font-mono leading-relaxed space-y-1 shadow-sm max-w-md">
                <p className="text-emerald-400 font-bold">
                  {isTg ? "🔔 Дархости нав дар Maskani.tj!" : "🔔 Новый лид на Maskani.tj!"}
                </p>
                <p>👤 <strong>{isTg ? "Мизоҷ:" : "Клиент:"}</strong> Дилшод Раҳимов</p>
                <p>📞 <strong>{isTg ? "Телефон:" : "Телефон:"}</strong> +992 93 505 11 88</p>
                <p>🏢 <strong>{isTg ? "Амвол:" : "Объект:"}</strong> {isTg ? "Хонадони 3-ҳуҷрагӣ (18 мкр)" : "3-комнатная квартира (18 мкр)"}</p>
                <p>💰 <strong>{isTg ? "Буҷет:" : "Бюджет:"}</strong> $49,000 <em>({isTg ? "Ҳаққи хизмат" : "Комиссия"} ~ $980)</em></p>
                <p>📊 <strong>{isTg ? "Манбаъ:" : "Канал:"}</strong> 💬 {isTg ? "Гузариш ба WhatsApp" : "Переход в WhatsApp"}</p>
                <p className="text-sky-400 underline pt-1">
                  👉 {isTg ? "Кушодани корт дар воронкаи CRM" : "Открыть карточку в CRM Воронке"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
