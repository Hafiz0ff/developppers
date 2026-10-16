"use client";

import React, { useState, useEffect } from "react";
import { SelectedDealBundle, LeadSubmissionPayload } from "@/types/crm-booking";
import {
  generateTimeSlots,
  calculateBundleTotal,
  formatSeparatedNumber,
} from "@/lib/crm-booking-store";
import { useLanguage } from "@/context/language-context";
import { useCurrency } from "@/context/currency-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  X,
  PhoneCall,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Home,
  Car,
  Warehouse,
  ShieldCheck,
  Sparkles,
  Loader2,
} from "lucide-react";

interface LeadRequestDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  type: "booking" | "callback";
  developerId: string;
  projectId: string;
  projectName: string;
  bundle: SelectedDealBundle;
  workHoursStart?: string;
  workHoursEnd?: string;
}

export function LeadRequestDrawer({
  isOpen,
  onClose,
  type,
  developerId,
  projectId,
  projectName,
  bundle,
  workHoursStart = "09:00",
  workHoursEnd = "22:00",
}: LeadRequestDrawerProps) {
  const { tDual, language } = useLanguage();
  const { currency } = useCurrency();
  const isUsd = currency === "USD";

  // Form states
  const [contactMode, setContactMode] = useState<"instant_15min" | "scheduled">("instant_15min");
  const [scheduledDay, setScheduledDay] = useState<"today" | "tomorrow">("today");
  const [scheduledTime, setScheduledTime] = useState<string>("12:00");
  const [phone, setPhone] = useState<string>("+992 ");
  const [consentPersonalData, setConsentPersonalData] = useState<boolean>(true);

  // Submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

  // Lock body scroll while open
  useEffect(() => {
    if (!isOpen) return;
    const orig = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = orig;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Reset form when reopened
  useEffect(() => {
    if (isOpen) {
      setIsSubmittedSuccess(false);
      setErrorMsg(null);
      setContactMode("instant_15min");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const { total, itemsCount } = calculateBundleTotal(bundle, currency);

  // Time slots calculation
  const timeSlots = generateTimeSlots(
    workHoursStart,
    workHoursEnd,
    scheduledDay === "today"
  );

  const handlePhoneChange = (val: string) => {
    // Basic formatting for Tajikistan numbers +992
    if (!val.startsWith("+992")) {
      setPhone("+992 ");
      return;
    }
    setPhone(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validation
    const rawDigits = phone.replace(/\D/g, "");
    if (rawDigits.length < 9) {
      setErrorMsg(
        tDual(
          "Пожалуйста, введите корректный номер телефона (минимум 9 цифр).",
          "Лутфан рақами дурусти телефонро ворид намоед (на камтар аз 9 рақам)."
        )
      );
      return;
    }

    if (!consentPersonalData) {
      setErrorMsg(
        tDual(
          "Необходимо согласие на обработку персональных данных.",
          "Розигӣ ба коркарди маълумоти шахсӣ ҳатмист."
        )
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const todayDate = new Date();
      const scheduledDateStr =
        scheduledDay === "today"
          ? todayDate.toISOString().split("T")[0]
          : new Date(todayDate.getTime() + 86400000).toISOString().split("T")[0];

      const payload: Partial<LeadSubmissionPayload> = {
        type,
        developerId,
        projectId,
        projectName,
        phone: phone.trim(),
        contactMode,
        scheduledDate: contactMode === "scheduled" ? scheduledDateStr : undefined,
        scheduledTime: contactMode === "scheduled" ? scheduledTime : undefined,
        // Deal bundle context
        unitId: bundle.unit?.id,
        unitNumber: bundle.unit?.number,
        unitPriceTjs: bundle.unit?.priceTjs,
        unitArea: bundle.unit?.totalArea,
        parkingId: bundle.parking?.id,
        parkingNumber: bundle.parking?.number,
        parkingPriceTjs: bundle.parking?.priceTjs,
        storageId: bundle.storage?.id,
        storageNumber: bundle.storage?.number,
        storagePriceTjs: bundle.storage?.priceTjs,
        totalPriceTjs: bundle.unit || bundle.parking || bundle.storage
          ? (bundle.unit?.priceTjs || 0) + (bundle.parking?.priceTjs || 0) + (bundle.storage?.priceTjs || 0)
          : 0,
        currency: "TJS",
        consentPersonalData: true,
      };

      const res = await fetch("/api/crm/lead-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (data.code === "CRM_NOT_ACTIVE" || data.code === "FEATURE_DISABLED") {
          throw new Error(
            tDual(
              "Отдел продаж застройщика временно принимает звонки напрямую. Пожалуйста, позвоните по номеру компании.",
              "Шуъбаи фурӯш муваққатан зангҳоро мустақиман қабул мекунад. Лутфан бо рақами ширкат тамос гиред."
            )
          );
        }
        throw new Error(data.error || "Не удалось отправить заявку");
      }

      setIsSubmittedSuccess(true);
    } catch (err: any) {
      console.error("Submission error:", err);
      setErrorMsg(err.message || "Ошибка отправки заявки");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isBooking = type === "booking";

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Drawer Container (Sliding from LEFT side) */}
      <div className="relative w-full max-w-md bg-card border-r border-border shadow-2xl z-10 flex flex-col h-full overflow-hidden animate-in slide-in-from-left duration-300">
        {/* Drawer Header */}
        <div className="p-5 border-b flex items-start justify-between bg-muted/20">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div
                className={`p-1.5 rounded-lg ${
                  isBooking
                    ? "bg-emerald-600 text-white"
                    : "bg-blue-600 text-white"
                }`}
              >
                {isBooking ? <Sparkles className="h-4 w-4" /> : <PhoneCall className="h-4 w-4" />}
              </div>
              <h2 className="text-base sm:text-lg font-black text-foreground">
                {isBooking
                  ? tDual("Заявка на бронирование", "Дархост барои бандкунӣ")
                  : tDual("Когда вам перезвонить?", "Кай ба шумо занг занем?")}
              </h2>
            </div>
            <p className="text-xs text-muted-foreground">
              {projectName}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            aria-label="Закрыть"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {isSubmittedSuccess ? (
            <div className="py-12 text-center space-y-4 my-auto">
              <div className="h-16 w-16 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-300 shadow-sm animate-in zoom-in">
                <CheckCircle2 className="h-9 w-9" />
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-bold text-foreground">
                  {tDual("Заявка успешно отправлена!", "Дархост бомуваффақият фиристода шуд!")}
                </h3>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
                  {contactMode === "instant_15min"
                    ? tDual(
                        "Менеджер отдела продаж свяжется с вами в течение 15 минут.",
                        "Менеҷери шуъбаи фурӯш дар давоми 15 дақиқа бо шумо тамос мегирад."
                      )
                    : tDual(
                        `Менеджер отдела продаж свяжется с вами ${
                          scheduledDay === "today" ? "сегодня" : "завтра"
                        } около ${scheduledTime}.`,
                        `Менеҷери шуъбаи фурӯш бо шумо ${
                          scheduledDay === "today" ? "имрӯз" : "фардо"
                        } соати тақрибан ${scheduledTime} тамос мегирад.`
                      )}
                </p>
              </div>

              <div className="p-3.5 bg-muted/40 border rounded-xl text-left text-[11px] text-muted-foreground space-y-1">
                <span className="font-semibold text-foreground block">
                  {tDual("Обратите внимание:", "Диққат диҳед:")}
                </span>
                <span>
                  {tDual(
                    "Отправка заявки не является договором и не блокирует объект в базе автоматически. Оформление бронирования происходит менеджером после согласования деталей.",
                    "Фиристодани дархост шартнома намебошад ва объектро дар пойгоҳ ба таври худкор банд намекунад. Расмикунонӣ пас аз гуфтугӯ бо менеҷер сурат мегирад."
                  )}
                </span>
              </div>

              <div className="pt-4">
                <Button
                  onClick={onClose}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs h-10 rounded-xl"
                >
                  {tDual("Готово", "Тайёр")}
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Selected Bundle Summary (Cart Context) */}
              {(bundle.unit || bundle.parking || bundle.storage) && (
                <div className="p-3.5 rounded-xl bg-muted/30 border space-y-2 text-xs">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                    {tDual("Выбранные объекты:", "Объектҳои интихобшуда:")}
                  </span>
                  <div className="space-y-1.5">
                    {bundle.unit && (
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-foreground">
                          <Home className="h-3.5 w-3.5 text-emerald-600" />
                          <span>
                            {tDual("Квартира", "Хонадон")} №{bundle.unit.number} ({bundle.unit.totalArea} м²)
                          </span>
                        </span>
                        <span className="font-semibold text-foreground">
                          {isUsd
                            ? `$${formatSeparatedNumber(bundle.unit.priceUsd)}`
                            : `${formatSeparatedNumber(bundle.unit.priceTjs)} сом.`}
                        </span>
                      </div>
                    )}
                    {bundle.parking && (
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-foreground">
                          <Car className="h-3.5 w-3.5 text-emerald-600" />
                          <span>
                            {tDual("Паркинг", "Таваққуфгоҳ")} №{bundle.parking.number}
                          </span>
                        </span>
                        <span className="font-semibold text-foreground">
                          {isUsd
                            ? `$${formatSeparatedNumber(bundle.parking.priceUsd)}`
                            : `${formatSeparatedNumber(bundle.parking.priceTjs)} сом.`}
                        </span>
                      </div>
                    )}
                    {bundle.storage && (
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-foreground">
                          <Warehouse className="h-3.5 w-3.5 text-emerald-600" />
                          <span>
                            {tDual("Кладовая", "Анбор")} №{bundle.storage.number}
                          </span>
                        </span>
                        <span className="font-semibold text-foreground">
                          {isUsd
                            ? `$${formatSeparatedNumber(bundle.storage.priceUsd)}`
                            : `${formatSeparatedNumber(bundle.storage.priceTjs)} сом.`}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="pt-2 border-t flex justify-between font-bold text-foreground">
                    <span>{tDual("Итого к оформлению:", "Ҷамъ барои расмикунонӣ:")}</span>
                    <span className="text-emerald-600 font-black">
                      {isUsd
                        ? `$${formatSeparatedNumber(total)}`
                        : `${formatSeparatedNumber(total)} сом.`}
                    </span>
                  </div>
                </div>
              )}

              {/* Contact Mode Selector */}
              <div className="space-y-2">
                <Label className="text-xs font-bold text-foreground">
                  {tDual("Удобное время связи:", "Вақти муносиби тамос:")}
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setContactMode("instant_15min")}
                    className={`p-3 rounded-xl border text-xs text-left transition-all cursor-pointer ${
                      contactMode === "instant_15min"
                        ? "border-emerald-600 bg-emerald-500/10 text-emerald-900 dark:text-emerald-100 font-semibold"
                        : "border-border bg-card text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold mb-0.5">
                      <Clock className="h-3.5 w-3.5 text-emerald-600" />
                      <span>{tDual("В течение 15 минут", "Дар 15 дақиқа")}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground block">
                      {tDual("Экспресс-связь", "Пайвасти фаврӣ")}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setContactMode("scheduled")}
                    className={`p-3 rounded-xl border text-xs text-left transition-all cursor-pointer ${
                      contactMode === "scheduled"
                        ? "border-emerald-600 bg-emerald-500/10 text-emerald-900 dark:text-emerald-100 font-semibold"
                        : "border-border bg-card text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold mb-0.5">
                      <Calendar className="h-3.5 w-3.5 text-emerald-600" />
                      <span>{tDual("Выбрать время", "Интихоби вақт")}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground block">
                      {workHoursStart} — {workHoursEnd}
                    </span>
                  </button>
                </div>
              </div>

              {/* Scheduled Time Pickers */}
              {contactMode === "scheduled" && (
                <div className="p-3.5 rounded-xl bg-muted/40 border space-y-3 animate-in fade-in">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-[11px] text-muted-foreground">
                        {tDual("День:", "Рӯз:")}
                      </Label>
                      <Select
                        value={scheduledDay}
                        onValueChange={(val) => {
                          if (val) setScheduledDay(val as "today" | "tomorrow");
                        }}
                      >
                        <SelectTrigger className="h-9 text-xs bg-card">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="z-60">
                          <SelectItem value="today">{tDual("Сегодня", "Имрӯз")}</SelectItem>
                          <SelectItem value="tomorrow">{tDual("Завтра", "Фардо")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-[11px] text-muted-foreground">
                        {tDual("Время:", "Вақт:")}
                      </Label>
                      <Select
                        value={scheduledTime}
                        onValueChange={(val) => {
                          if (val) setScheduledTime(val);
                        }}
                      >
                        <SelectTrigger className="h-9 text-xs bg-card">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="max-h-48 z-60">
                          {timeSlots.map((slot) => (
                            <SelectItem
                              key={slot.value}
                              value={slot.value}
                              disabled={slot.disabled}
                            >
                              {slot.label} {slot.disabled ? tDual("(прошло)", "(гузашт)") : ""}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {/* Phone Input */}
              <div className="space-y-1.5">
                <Label htmlFor="lead-phone" className="text-xs font-semibold text-foreground">
                  {tDual("Номер телефона для связи:", "Рақами телефон барои тамос:")}
                </Label>
                <Input
                  id="lead-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  placeholder="+992 (__) ___-__-__"
                  className="h-10 text-sm font-mono tracking-wide"
                  required
                />
                <span className="text-[11px] text-muted-foreground block">
                  {tDual("Формат: +992 92 XXX XX XX", "Намуна: +992 92 XXX XX XX")}
                </span>
              </div>

              {/* Personal Data Consent Checkbox */}
              <div className="flex items-start gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="consent-checkbox"
                  checked={consentPersonalData}
                  onChange={(e) => setConsentPersonalData(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <label
                  htmlFor="consent-checkbox"
                  className="text-[11px] text-muted-foreground leading-tight cursor-pointer select-none"
                >
                  {tDual(
                    "Я согласен на обработку моих персональных данных и передачу их застройщику для связи по объекту.",
                    "Ман ба коркарди маълумоти шахсии худ ва супоридани он ба сохтмончӣ розигӣ медиҳам."
                  )}
                </label>
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 text-rose-800 dark:text-rose-200 text-xs flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full font-bold text-xs h-11 rounded-xl shadow-md cursor-pointer ${
                    isBooking
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                      : "bg-slate-900 hover:bg-black text-white dark:bg-emerald-600 dark:hover:bg-emerald-700"
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>{tDual("Отправка в отдел продаж...", "Ирсол ба шуъбаи фурӯш...")}</span>
                    </div>
                  ) : (
                    <span>
                      {isBooking
                        ? tDual("Отправить заявку на бронирование", "Фиристодани дархости бандкунӣ")
                        : tDual("Заказать звонок", "Фармоиши занг")}
                    </span>
                  )}
                </Button>
              </div>

              {/* Legal Disclaimer */}
              <div className="text-[10px] text-muted-foreground text-center leading-relaxed pt-1">
                {tDual(
                  "Отправка заявки не является бронированием или договором купли-продажи. Менеджер свяжется для подтверждения доступности.",
                  "Фиристодани дархост бандкунӣ ё шартномаи хариду фурӯш намебошад. Менеҷер барои тасдиқ бо шумо тамос мегирад."
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
