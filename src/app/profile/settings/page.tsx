"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/language-context";
import { ProfileNav } from "@/components/profile/profile-nav";
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
  const [botUsername, setBotUsername] = useState("MaskaniBot");
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
        <div className="max-w-4xl mx-auto">
          <ProfileNav />

          <div className="mt-4 pt-4 border-t border-slate-100">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {isTg ? "Танзимоти профил ва пайвастшавиҳо" : "Настройки профиля & Интеграции"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {isTg
                ? "Идоракунии маълумоти шахсӣ, амният ва огоҳиномаҳои фаврӣ"
                : "Управление персональными данными, безопасностью и моментальными уведомлениями"}
            </p>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
        {/* 2. USER OVERVIEW CARD */}
        <Card className="bg-card border-border/80 shadow-xs rounded-2xl overflow-hidden">
          <CardHeader className="p-5 pb-3 border-b border-border/60 flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-muted text-foreground font-bold flex items-center justify-center text-base">
                РА
              </div>
              <div>
                <CardTitle className="text-base font-bold text-foreground">
                  Рустам Аҳмедов
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  {isTg
                    ? "Мутахассиси амвол • Агентии «Суғд-Инвест» (ш. Хуҷанд)"
                    : "Риелтор • Агентство «Сугд-Инвест» (г. Худжанд)"}
                </CardDescription>
              </div>
            </div>

            <Badge variant="secondary" className="text-xs font-semibold gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
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

        {/* 2.5. LINKED SOCIAL ACCOUNTS (GOOGLE & APPLE) AS COMPLEMENT TO PHONE */}
        <Card className="bg-card border-border/80 shadow-xs rounded-2xl overflow-hidden">
          <CardHeader className="p-5 sm:p-6 pb-4 border-b border-border/60 bg-muted/20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-xs">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg font-bold text-foreground">
                      {isTg ? "Пайвасти ҳисобҳо (Google & Apple)" : "Связанные аккаунты (Google & Apple)"}
                    </CardTitle>
                    <Badge variant="secondary" className="text-xs font-semibold">
                      {isTg ? "Иловагӣ" : "Дополнение к номеру"}
                    </Badge>
                  </div>
                  <CardDescription className="text-xs text-muted-foreground mt-0.5">
                    {isTg
                      ? "Пайвасти ҳисобҳо ҳамчун усули иловагӣ барои воридшавии зуд дар дигар дастгоҳҳо хизмат мекунад. Рақами асосӣ барои эълонҳо тағйирнопазир мемонад."
                      : "Дополнительные способы авторизации для быстрого входа. Основным идентификатором для размещения объявлений всегда остаётся ваш подтверждённый номер."}
                  </CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-5 sm:p-6 space-y-4">
            {/* Primary Verified Phone Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-border/60 bg-muted/20">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-muted text-muted-foreground flex items-center justify-center shrink-0">
                  <Smartphone className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-foreground font-mono">+992 92 777 00 22</span>
                    <Badge variant="secondary" className="text-xs font-semibold gap-1">
                      <CheckCircle2 className="h-3 w-3 text-primary" />
                      {isTg ? "Асосӣ (Тасдиқшуда)" : "Основной (Подтверждён)"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {isTg
                      ? "Ҳамаи эълонҳо ва тамосҳо ба ин рақам сабт мешаванд"
                      : "Все объявления и контакты привязаны к этому номеру"}
                  </p>
                </div>
              </div>
            </div>

            {/* Google Account Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs">
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96z"
                    />
                  </svg>
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800">Google Account</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {isTg
                      ? "Барои воридшавии зуд дар компютер ё планшет"
                      : "Для мгновенного входа на ПК или планшете"}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 px-3 text-xs font-semibold rounded-lg border-slate-200 text-slate-700 hover:bg-white hover:text-slate-900 cursor-pointer shadow-2xs"
                onClick={() => {
                  alert(
                    isTg
                      ? "Пайвасти ҳисоби Google ба рақами +992 92 777 00 22 дар ҳоли коркард қарор дорад."
                      : "Интеграция привязки Google аккаунта к подтверждённому номеру +992 92 777 00 22."
                  );
                }}
              >
                {isTg ? "Пайваст кардан" : "Привязать Google"}
              </Button>
            </div>

            {/* Apple ID Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-black text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.08zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                  </svg>
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800">Apple ID</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {isTg
                      ? "Воридшавӣ тавассути Face ID ва экосистемаи Apple"
                      : "Вход через Face ID и экосистему Apple"}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 px-3 text-xs font-semibold rounded-lg border-slate-200 text-slate-700 hover:bg-white hover:text-slate-900 cursor-pointer shadow-2xs"
                onClick={() => {
                  alert(
                    isTg
                      ? "Пайвасти Apple ID ба рақами +992 92 777 00 22 дар ҳоли коркард қарор дорад."
                      : "Интеграция привязки Apple ID к подтверждённому номеру +992 92 777 00 22."
                  );
                }}
              >
                {isTg ? "Пайваст кардан" : "Привязать Apple ID"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 3. TELEGRAM INTEGRATION CARD */}
        <Card className="bg-card border-border/80 shadow-xs rounded-2xl overflow-hidden">
          <CardHeader className="p-5 sm:p-6 pb-4 border-b border-border/60 bg-muted/20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-muted text-muted-foreground flex items-center justify-center">
                  <Send className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg font-bold text-foreground">
                      {isTg ? "Огоҳиномаҳои фаврии Telegram" : "Мгновенные Telegram-уведомления"}
                    </CardTitle>
                    {isConnected ? (
                      <Badge variant="secondary" className="text-xs font-semibold gap-1">
                        <CheckCircle2 className="h-3 w-3 text-primary" />
                        {isTg ? "Пайваст шуд" : "Подключено"}
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs font-semibold">
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
