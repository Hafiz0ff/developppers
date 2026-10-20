"use client";

import React, { useState } from "react";
import {
  CreditCard,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Lock,
  ArrowRight,
  Phone,
  Zap,
  Building2,
  Wallet,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/context/language-context";
import {
  PaymentProvider,
  PaymentPurpose,
  PaymentTransactionDto,
  PAYMENT_PROVIDERS,
  TJS_TO_USD_RATE,
} from "@/lib/payments/payment-gateway";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  purpose: PaymentPurpose;
  title: string;
  subtitle?: string;
  amountTjs: number;
  advertiserId?: string;
  classifiedId?: string;
  unitId?: string;
  onSuccess?: (tx: PaymentTransactionDto) => void;
}

export function PaymentModal({
  isOpen,
  onClose,
  purpose,
  title,
  subtitle,
  amountTjs,
  advertiserId,
  classifiedId,
  unitId,
  onSuccess,
}: PaymentModalProps) {
  const { language, tDual } = useLanguage();
  const isTg = language === "tg";

  // Stepper: "select_method" -> "3d_secure_otp" (for Korti Milli) -> "success"
  const [step, setStep] = useState<"select_method" | "3d_secure_otp" | "success">("select_method");
  const [selectedProvider, setSelectedProvider] = useState<PaymentProvider>("korti_milli");

  // Form Fields
  const [payerPhone, setPayerPhone] = useState("+992 ");
  const [payerName, setPayerName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  // Alif Salom Installment
  const [alifSalomMonths, setAlifSalomMonths] = useState<number>(3);
  const [alifSubMethod, setAlifSubMethod] = useState<"qr" | "salom">("qr");

  // Transaction & OTP State
  const [activeTx, setActiveTx] = useState<PaymentTransactionDto | null>(null);
  const [otpCode, setOtpCode] = useState("");
  const [otpError, setOtpError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const amountUsd = Math.round(amountTjs / TJS_TO_USD_RATE);

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setOtpError("");

    try {
      const res = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          purpose,
          amountTjs,
          provider: selectedProvider,
          method:
            selectedProvider === "korti_milli" || selectedProvider === "visa_mastercard"
              ? "card"
              : selectedProvider === "alif_mobi" && alifSubMethod === "salom"
              ? "installment_salom"
              : "qr",
          payerPhone,
          payerName: payerName || "Клиент Maskani",
          advertiserId,
          classifiedId,
          unitId,
          installmentMonths: selectedProvider === "alif_mobi" ? alifSalomMonths : undefined,
        }),
      });

      const data = await res.json();
      if (data.success && data.transaction) {
        setActiveTx(data.transaction);
        if (selectedProvider === "korti_milli") {
          setStep("3d_secure_otp");
        } else {
          // For QR providers, give instant confirmation button or simulate auto-scan
        }
      }
    } catch {
      // silent fallback
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTx) return;

    setIsSubmitting(true);
    setOtpError("");

    try {
      const res = await fetch("/api/payments/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transactionId: activeTx.id,
          otpCode: otpCode || "1234",
        }),
      });

      const data = await res.json();
      if (data.success && data.transaction) {
        setActiveTx(data.transaction);
        setStep("success");
        if (onSuccess) onSuccess(data.transaction);
      } else {
        setOtpError(data.error || "Неверный проверочный СМС-код (используйте 1234)");
      }
    } catch {
      setOtpError("Ошибка соединения с банком");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmQr = async () => {
    if (!activeTx) return;
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/payments/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transactionId: activeTx.id,
          externalId: `${selectedProvider.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`,
        }),
      });

      const data = await res.json();
      if (data.success && data.transaction) {
        setActiveTx(data.transaction);
        setStep("success");
        if (onSuccess) onSuccess(data.transaction);
      }
    } catch {
      // silent
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setStep("select_method");
    setActiveTx(null);
    setOtpCode("");
    setOtpError("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && resetForm()}>
      <DialogContent className="sm:max-w-xl p-0 overflow-hidden rounded-3xl border-slate-200 shadow-2xl bg-white">
        {/* Top Header Banner */}
        <div className="bg-slate-900 text-white p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between text-xs mb-2">
            <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <Lock className="h-3 w-3 text-emerald-400" />
              <span>{isTg ? "Пардохти амн бо рамзгузорӣ" : "Безопасный эквайринг НПЦ РТ"}</span>
            </Badge>

            <span className="text-[11px] text-slate-400">Maskani FinTech Gateway</span>
          </div>

          <DialogTitle className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {title}
          </DialogTitle>
          {subtitle && (
            <DialogDescription className="text-xs text-slate-300 mt-1">
              {subtitle}
            </DialogDescription>
          )}

          {/* Amount Badge */}
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-baseline justify-between">
            <span className="text-xs text-slate-400">
              {isTg ? "Маблағи пардохт:" : "Сумма к оплате:"}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-white">
                {amountTjs.toLocaleString("ru-RU")} сомони
              </span>
              <span className="text-xs text-emerald-400 font-semibold">
                (~${amountUsd} USD)
              </span>
            </div>
          </div>
        </div>

        {/* STEP 1: SELECT METHOD & FILL DETAILS */}
        {step === "select_method" && (
          <div className="p-6 space-y-6">
            {/* Payment Systems Switcher */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                {isTg ? "Усули пардохтро интихоб кунед:" : "Выберите платежную систему РТ:"}
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  {
                    id: "korti_milli" as PaymentProvider,
                    title: "Корти Милли",
                    badge: "НПЦ РТ",
                    color: "border-emerald-500 bg-emerald-50/40 text-emerald-900",
                    icon: CreditCard,
                  },
                  {
                    id: "dushanbe_city" as PaymentProvider,
                    title: "Dushanbe City",
                    badge: "DC Pay QR",
                    color: "border-amber-500 bg-amber-50/40 text-amber-900",
                    icon: Wallet,
                  },
                  {
                    id: "alif_mobi" as PaymentProvider,
                    title: "Alif Pay",
                    badge: "Салом 0%",
                    color: "border-emerald-500 bg-emerald-50/40 text-emerald-900",
                    icon: Sparkles,
                  },
                  {
                    id: "eskhata_online" as PaymentProvider,
                    title: "Эсхата Онлайн",
                    badge: "Банк Эсхата",
                    color: "border-blue-500 bg-blue-50/40 text-blue-900",
                    icon: Building2,
                  },
                ].map((p) => {
                  const Icon = p.icon;
                  const isSelected = selectedProvider === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setSelectedProvider(p.id);
                        setActiveTx(null);
                      }}
                      className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                        isSelected
                          ? "border-emerald-600 bg-emerald-50/50 shadow-xs ring-2 ring-emerald-500/20"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-2">
                        <Icon
                          className={`h-4 w-4 ${
                            isSelected ? "text-emerald-600" : "text-slate-400"
                          }`}
                        />
                        <Badge
                          variant="outline"
                          className="text-[9px] px-1.5 py-0 border-slate-200 text-slate-600"
                        >
                          {p.badge}
                        </Badge>
                      </div>
                      <span className="text-xs font-extrabold text-slate-900 leading-tight">
                        {p.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Provider Specific Input Form */}
            <form onSubmit={handleCreateOrder} className="space-y-4">
              {/* KORTI MILLI (CARD PAYMENT) */}
              {selectedProvider === "korti_milli" && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">
                      {isTg ? "Реквизитҳои корти миллӣ" : "Данные карты Корти Милли"}
                    </span>
                    <Badge className="bg-emerald-100 text-emerald-800 text-[10px] font-semibold">
                      Поддержка всех банков РТ
                    </Badge>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] text-slate-500 font-medium">
                      {isTg ? "Рақами корт (16 рақам)" : "Номер карты (16 цифр)"}
                    </label>
                    <Input
                      required
                      placeholder="5058 •••• •••• ••••"
                      maxLength={19}
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="h-10 rounded-xl bg-white font-mono text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[11px] text-slate-500 font-medium">
                        {isTg ? "Муҳлати амал" : "Срок действия"}
                      </label>
                      <Input
                        required
                        placeholder="MM/YY"
                        maxLength={5}
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="h-10 rounded-xl bg-white font-mono text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] text-slate-500 font-medium">CVC / CVV</label>
                      <Input
                        required
                        type="password"
                        placeholder="•••"
                        maxLength={3}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="h-10 rounded-xl bg-white font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* DUSHANBE CITY (DC PAY QR / WALLET) */}
              {selectedProvider === "dushanbe_city" && (
                <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-3 text-center">
                  <div className="h-12 w-12 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center mx-auto">
                    <QrCode className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-amber-950">
                      {isTg ? "Пардохт бо DC Pay QR" : "Оплата через DC Pay QR"}
                    </h4>
                    <p className="text-xs text-amber-800 mt-0.5">
                      {isTg
                        ? "Замимаи DC Next ё Dushanbe City-ро кушода, QR-кодро скан кунед"
                        : "Отсканируйте QR-код в мобильном приложении DC Next или Dushanbe City"}
                    </p>
                  </div>
                </div>
              )}

              {/* ALIF PAY & ALIF SALOM */}
              {selectedProvider === "alif_mobi" && (
                <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 space-y-4">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setAlifSubMethod("qr")}
                      className={`flex-1 h-9 rounded-xl text-xs font-bold transition-all ${
                        alifSubMethod === "qr"
                          ? "bg-emerald-600 text-white shadow-xs"
                          : "bg-white text-slate-700 border border-slate-200"
                      }`}
                    >
                      Alif Mobi QR
                    </button>
                    <button
                      type="button"
                      onClick={() => setAlifSubMethod("salom")}
                      className={`flex-1 h-9 rounded-xl text-xs font-bold transition-all ${
                        alifSubMethod === "salom"
                          ? "bg-emerald-600 text-white shadow-xs"
                          : "bg-white text-slate-700 border border-slate-200"
                      }`}
                    >
                      {isTg ? "Насияи Салом 0%" : "Рассрочка Салом 0%"}
                    </button>
                  </div>

                  {alifSubMethod === "salom" && (
                    <div className="space-y-2 bg-white p-3 rounded-xl border border-emerald-100">
                      <span className="text-xs font-semibold text-slate-700 block">
                        {isTg ? "Муҳлати насияи бефоизро интихоб кунед:" : "Срок рассрочки без процентов:"}
                      </span>
                      <div className="grid grid-cols-3 gap-2">
                        {[3, 6, 12].map((m) => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => setAlifSalomMonths(m)}
                            className={`p-2 rounded-lg border text-center transition-all ${
                              alifSalomMonths === m
                                ? "border-emerald-600 bg-emerald-50 text-emerald-950 font-bold"
                                : "border-slate-200 text-slate-600"
                            }`}
                          >
                            <div className="text-xs">{m} {isTg ? "моҳ" : "мес"}</div>
                            <div className="text-[10px] text-emerald-600 font-medium">
                              {Math.round(amountTjs / m)} смн/мес
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ESKHATA ONLINE */}
              {selectedProvider === "eskhata_online" && (
                <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200/80 space-y-2 text-center">
                  <div className="h-12 w-12 rounded-xl bg-blue-500/10 text-blue-700 flex items-center justify-center mx-auto">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <h4 className="text-sm font-extrabold text-blue-950">
                    Банк Эсхата Онлайн
                  </h4>
                  <p className="text-xs text-blue-800">
                    {isTg
                      ? "Пардохти мустақим аз замимаи «Эсхата Онлайн» бидуни фоиз"
                      : "Прямая оплата без комиссии через приложение «Эсхата Онлайн»"}
                  </p>
                </div>
              )}

              {/* Common Payer Phone Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  {isTg ? "Рақами телефони пардохткунанда *" : "Номер телефона для квитанции *" }
                </label>
                <Input
                  required
                  value={payerPhone}
                  onChange={(e) => setPayerPhone(e.target.value)}
                  placeholder="+992 92 777 0000"
                  className="h-10 rounded-xl text-xs"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md gap-2"
              >
                {isSubmitting ? (
                  <span>{isTg ? "Омодасозии пардохт..." : "Подготовка платежа..."}</span>
                ) : (
                  <>
                    <span>
                      {selectedProvider === "korti_milli"
                        ? isTg
                          ? `Пардохти ${amountTjs} сомонӣ`
                          : `Оплатить ${amountTjs} сомони`
                        : isTg
                        ? "Гузариш ба пардохт"
                        : "Сформировать счет на оплату"}
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            {/* QR Simulation Trigger (if created) */}
            {activeTx && selectedProvider !== "korti_milli" && (
              <div className="pt-4 border-t border-slate-100 text-center space-y-3">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 inline-block mx-auto">
                  <div className="w-40 h-40 bg-white p-2 rounded-xl border border-slate-200 flex items-center justify-center mx-auto shadow-inner">
                    <QrCode className="h-32 w-32 text-slate-900" />
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono mt-2 block">
                    {activeTx.id}
                  </span>
                </div>

                <Button
                  onClick={handleConfirmQr}
                  className="w-full h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-2"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>
                    {isTg ? "Тасдиқи пардохт (скани QR)" : "Я оплатил в приложении (Подтвердить)"}
                  </span>
                </Button>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: 3D SECURE SMS OTP (FOR KORTI MILLI) */}
        {step === "3d_secure_otp" && activeTx && (
          <div className="p-6 space-y-5 text-center">
            <div className="h-12 w-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <ShieldCheck className="h-6 w-6" />
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900">
                {isTg ? "Тасдиқи 3D Secure (НПЦ РТ)" : "Подтверждение 3D Secure (НПЦ РТ)"}
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                {isTg
                  ? `Рамзи тасдиқ ба рақами ${payerPhone} фиристода шуд. Барои санҷиш рамзи 1234 -ро ворид кунед.`
                  : `СМС с кодом подтверждения отправлено на номер ${payerPhone}. Для теста используйте код 1234.`}
              </p>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-4 max-w-xs mx-auto">
              <div className="space-y-1.5">
                <Input
                  autoFocus
                  required
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="1234"
                  className="h-12 rounded-xl text-center text-xl font-mono tracking-widest bg-slate-50 border-slate-300"
                />
                {otpError && (
                  <p className="text-[11px] text-red-600 font-medium">{otpError}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-2"
              >
                {isSubmitting ? (
                  <span>{isTg ? "Санҷиш..." : "Проверка..."}</span>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    <span>{isTg ? "Тасдиқ ва пардохт" : "Подтвердить оплату"}</span>
                  </>
                )}
              </Button>
            </form>
          </div>
        )}

        {/* STEP 3: SUCCESS CONFIRMATION */}
        {step === "success" && activeTx && (
          <div className="p-8 text-center space-y-5">
            <div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <div>
              <Badge className="bg-emerald-100 text-emerald-800 font-bold text-xs px-3 py-1 rounded-full mb-2">
                {isTg ? "Пардохт қабул шуд" : "Платеж успешно зачислен"}
              </Badge>
              <h3 className="text-2xl font-black text-slate-900">
                {amountTjs.toLocaleString("ru-RU")} сомони
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {activeTx.descriptionRu}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-left space-y-1.5 max-w-sm mx-auto font-mono">
              <div className="flex justify-between text-slate-500">
                <span>ID транзакции:</span>
                <span className="font-bold text-slate-800">{activeTx.id}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Провайдер:</span>
                <span className="font-bold text-slate-800">
                  {PAYMENT_PROVIDERS[activeTx.provider]?.nameRu}
                </span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Время:</span>
                <span className="text-slate-800">
                  {new Date(activeTx.completedAt || activeTx.createdAt).toLocaleTimeString("ru-RU")}
                </span>
              </div>
            </div>

            <Button
              onClick={resetForm}
              className="h-11 px-8 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
            >
              {isTg ? "Пӯшидан" : "Закрыть окно"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
