"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Building2, Phone, KeyRound, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import type { AdvertiserDto } from "@/lib/ads/ad-engine";

interface AdvertiserLoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoginSuccess: (advertiser: AdvertiserDto) => void;
}

export function AdvertiserLoginModal({
  open,
  onOpenChange,
  onLoginSuccess,
}: AdvertiserLoginModalProps) {
  const [tab, setTab] = useState<"quick" | "sms">("quick");
  const [phone, setPhone] = useState("+992 ");
  const [otpCode, setOtpCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Quick selectable verified accounts
  const quickAccounts = [
    {
      id: "adv-eskhata",
      name: "ОАО «Банк Эсхата»",
      contact: "Мавзуна Рахимова",
      role: "Генеральный банк (Спонсор)",
      balance: "120 000 TJS",
    },
    {
      id: "adv-megafon",
      name: "МегаФон Таджикистан",
      contact: "Сардор Умаров",
      role: "Телеком-партнер",
      balance: "95 000 TJS",
    },
    {
      id: "adv-tcell",
      name: "Tcell (Indigo Tajikistan)",
      contact: "Зафар Каримов",
      role: "Телеком-партнер",
      balance: "80 000 TJS",
    },
    {
      id: "adv-farovon",
      name: "ГК «Фаровон-1»",
      contact: "Дилшод Тохиров",
      role: "Стройматериалы",
      balance: "45 000 TJS",
    },
    {
      id: "adv-artel",
      name: "Artel Таджикистан",
      contact: "Умиджон Алимов",
      role: "Бытовая техника",
      balance: "18 000 TJS",
    },
  ];

  const handleQuickLogin = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/advertiser/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ advertiserId: id }),
      });
      const data = await res.json();
      if (data.success && data.advertiser) {
        onLoginSuccess(data.advertiser);
        onOpenChange(false);
      } else {
        setError(data.error || "Не удалось войти");
      }
    } catch {
      setError("Ошибка сети");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = () => {
    if (phone.length < 8) {
      setError("Укажите корректный номер телефона");
      return;
    }
    setError(null);
    setCodeSent(true);
    setOtpCode("1234"); // Auto-fill demo OTP code
  };

  const handleSmsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode) {
      setError("Введите проверочный СМС-код");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/advertiser/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otpCode }),
      });
      const data = await res.json();
      if (data.success && data.advertiser) {
        onLoginSuccess(data.advertiser);
        onOpenChange(false);
      } else {
        setError(data.error || "Неверный СМС-код (используйте 1234)");
      }
    } catch {
      setError("Ошибка сети");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6 bg-white text-slate-900 border border-slate-200 rounded-2xl shadow-2xl">
        <DialogHeader className="border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-slate-900">
                Вход в B2B Кабинет рекламодателя
              </DialogTitle>
              <p className="text-xs text-slate-500">
                Доступ для маркетологов и коммерческих партнеров
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* Tab switcher */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-xl mt-2 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setTab("quick")}
            className={`py-1.5 rounded-lg transition-all cursor-pointer ${
              tab === "quick" ? "bg-white text-emerald-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Корпоративные аккаунты
          </button>
          <button
            type="button"
            onClick={() => setTab("sms")}
            className={`py-1.5 rounded-lg transition-all cursor-pointer ${
              tab === "sms" ? "bg-white text-emerald-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            По номеру телефона
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-medium border border-red-200 mt-2">
            {error}
          </div>
        )}

        {tab === "quick" ? (
          <div className="space-y-2.5 pt-2 max-h-[360px] overflow-y-auto">
            <span className="text-[11px] text-slate-400 font-medium block">
              Выберите верифицированный аккаунт для мгновенного входа:
            </span>

            {quickAccounts.map((acc) => (
              <button
                key={acc.id}
                type="button"
                disabled={loading}
                onClick={() => handleQuickLogin(acc.id)}
                className="w-full p-3 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30 text-left transition-all flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <div className="font-bold text-xs text-slate-900 group-hover:text-emerald-700">
                    {acc.name}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {acc.contact} • {acc.role}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-mono font-bold text-emerald-600 block">
                    {acc.balance}
                  </span>
                  <span className="text-[10px] text-slate-400 group-hover:text-emerald-600 flex items-center gap-0.5 justify-end">
                    Войти →
                  </span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <form onSubmit={handleSmsLogin} className="space-y-3 pt-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Номер телефона маркетолога / компании
              </label>
              <div className="flex gap-2">
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+992 92 ..."
                  className="h-10 text-xs rounded-xl"
                  required
                />
                {!codeSent ? (
                  <Button
                    type="button"
                    onClick={handleSendOtp}
                    className="h-10 px-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shrink-0 rounded-xl"
                  >
                    Получить код
                  </Button>
                ) : null}
              </div>
            </div>

            {codeSent && (
              <div className="animate-in fade-in duration-200">
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  СМС-код подтверждения
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="1234"
                    maxLength={4}
                    className="h-10 text-center text-sm font-mono font-bold tracking-widest rounded-xl"
                    required
                  />
                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] shrink-0">
                    Тестовый код: 1234
                  </Badge>
                </div>
              </div>
            )}

            <div className="pt-2">
              <Button
                type="submit"
                disabled={loading || !codeSent}
                className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-1.5 shadow-sm cursor-pointer"
              >
                {loading ? "Авторизация..." : "Войти в кабинет рекламодателя"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
