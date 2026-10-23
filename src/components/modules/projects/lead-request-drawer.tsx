"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SelectedDealBundle, LeadSubmissionPayload } from "@/types/crm-booking";
import {
  generateTimeSlots,
  calculateBundleTotal,
  formatSeparatedNumber,
  saveLocalBookingLead,
} from "@/lib/crm-booking-store";
import { useLanguage } from "@/context/language-context";
import { useCurrency } from "@/context/currency-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PhoneCall,
  CheckCircle2,
  AlertCircle,
  Home,
  Car,
  Warehouse,
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
  const { tDual } = useLanguage();
  const { currency } = useCurrency();
  const isUsd = currency === "USD";

  // Form states (Section 10.2, 11.2, 14: default mode is instant_15min, consent is NOT pre-checked)
  const [contactMode, setContactMode] = useState<"instant_15min" | "scheduled">("instant_15min");
  const [scheduledDay, setScheduledDay] = useState<"today" | "tomorrow">("today");
  const [scheduledTime, setScheduledTime] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [consentPersonalData, setConsentPersonalData] = useState<boolean>(false);

  // Field-specific validation errors (Section 10.5 & 13)
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [scheduleError, setScheduleError] = useState<string | null>(null);
  const [consentError, setConsentError] = useState<string | null>(null);

  // Submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

  // Time slots calculation (09:00 - 22:00)
  const timeSlots = generateTimeSlots(
    workHoursStart,
    workHoursEnd,
    scheduledDay === "today"
  );

  // Pick first available non-disabled time slot when switching day or opening
  useEffect(() => {
    const firstAvailable = timeSlots.find((s) => !s.disabled);
    if (firstAvailable && (!scheduledTime || timeSlots.find((s) => s.value === scheduledTime)?.disabled)) {
      setScheduledTime(firstAvailable.value);
    } else if (!firstAvailable && scheduledDay === "today") {
      // If all slots today are in the past, switch to tomorrow
      setScheduledDay("tomorrow");
    }
  }, [scheduledDay, workHoursStart, workHoursEnd]);

  // Reset form when reopened
  useEffect(() => {
    if (isOpen) {
      setIsSubmittedSuccess(false);
      setErrorMsg(null);
      setPhoneError(null);
      setScheduleError(null);
      setConsentError(null);
      setContactMode("instant_15min");
      setConsentPersonalData(false);
    }
  }, [isOpen, type]);

  const handleRequestClose = () => {
    // Section 10.1: Warn user if unsaved form data exists
    const rawDigits = phone.replace(/\D/g, "");
    if (!isSubmittedSuccess && rawDigits.length >= 4) {
      const ok = window.confirm(
        tDual(
          "Вы ввели данные в форму заявки, но ещё не отправили её. Закрыть окно и потерять введённые данные?",
          "Шумо маълумотро ворид кардед, аммо ҳанӯз нафиристодаед. Равзанаро пӯшем?"
        )
      );
      if (!ok) return;
    }
    onClose();
  };

  // Lock body scroll while open
  useEffect(() => {
    if (!isOpen) return;
    const orig = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleRequestClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = orig;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, phone, isSubmittedSuccess]);

  if (!isOpen) return null;

  const { total } = calculateBundleTotal(bundle, currency);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setErrorMsg(null);
    setPhoneError(null);
    setScheduleError(null);
    setConsentError(null);

    let hasValidationError = false;

    // 1. Validate phone
    const rawDigits = phone.replace(/\D/g, "");
    if (!phone.trim() || rawDigits.length < 9) {
      setPhoneError(
        tDual(
          "Пожалуйста, введите корректный номер телефона (минимум 9 цифр).",
          "Лутфан рақами дурусти телефонро ворид намоед (на камтар аз 9 рақам)."
        )
      );
      hasValidationError = true;
    }

    // 2. Validate schedule if contactMode === "scheduled"
    if (contactMode === "scheduled") {
      const chosenSlot = timeSlots.find((s) => s.value === scheduledTime);
      if (!scheduledDay || !scheduledTime || chosenSlot?.disabled) {
        setScheduleError(
          tDual(
            "Пожалуйста, выберите доступный день и время для звонка (не в прошлом).",
            "Лутфан рӯз ва вақти дастрасро барои занг интихоб намоед."
          )
        );
        hasValidationError = true;
      }
    }

    // 3. Validate personal data consent (Mandatory per Section 10.5, 11.5, 14)
    if (!consentPersonalData) {
      setConsentError(
        tDual(
          "Для отправки формы необходимо отметить согласие на обработку персональных данных.",
          "Барои фиристодани варақа розигӣ ба коркарди маълумоти шахсӣ ҳатмист."
        )
      );
      hasValidationError = true;
    }

    if (hasValidationError) return;

    setIsSubmitting(true);

    try {
      const todayDate = new Date();
      const scheduledDateStr =
        scheduledDay === "today"
          ? todayDate.toISOString().split("T")[0]
          : new Date(todayDate.getTime() + 86400000).toISOString().split("T")[0];

      const formattedPhone = phone.trim().startsWith("+")
        ? phone.trim()
        : `+992 ${phone.trim()}`;

      const payload: Partial<LeadSubmissionPayload> = {
        type,
        developerId,
        projectId,
        projectName,
        phone: formattedPhone,
        contactMode,
        scheduledDate: contactMode === "scheduled" ? scheduledDateStr : undefined,
        scheduledTime: contactMode === "scheduled" ? scheduledTime : undefined,
        // Selected deal bundle context (passed for both booking and callback per Section 10.5 & 11.5)
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
        totalPriceTjs:
          bundle.unit || bundle.parking || bundle.storage
            ? (bundle.unit?.priceTjs || 0) +
              (bundle.parking?.priceTjs || 0) +
              (bundle.storage?.priceTjs || 0)
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
              "Приём онлайн-заявок для данной новостройки временно недоступен. Пожалуйста, свяжитесь с застройщиком по телефону.",
              "Қабули дархостҳои онлайн муваққатан ғайрифаъол аст. Лутфан бо рақами телефон тамос гиред."
            )
          );
        }
        throw new Error(data.error || "Не удалось отправить заявку. Повторите попытку.");
      }

      if (data.lead) {
        saveLocalBookingLead(data.lead);
      }

      setIsSubmittedSuccess(true);
    } catch (err: any) {
      console.error("Submission error:", err);
      setErrorMsg(
        err.message ||
          tDual(
            "Ошибка передачи заявки. Проверьте подключение и повторите попытку.",
            "Хатогии ирсоли дархост. Лутфан дубора кӯшиш кунед."
          )
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isBooking = type === "booking";

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-stretch">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-300"
        onClick={handleRequestClose}
      />

      {/* Drawer Container (Section 10.1 & 11.1: Opens from LEFT side on desktop, adaptive bottom/full sheet on mobile) */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={isBooking ? "Заявка на бронирование" : "Когда вам перезвонить?"}
        className="relative w-full sm:max-w-md bg-card border-t sm:border-t-0 sm:border-r border-border rounded-t-3xl sm:rounded-none shadow-2xl z-10 flex flex-col max-h-[92vh] sm:max-h-full sm:h-full overflow-hidden animate-in slide-in-from-bottom sm:slide-in-from-left duration-300"
      >
        {/* Drawer Header (Left: Title, Right: Close ×) */}
        <div className="p-5 border-b flex items-start justify-between gap-3 bg-muted/20">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div
                className={`p-1.5 rounded-lg shrink-0 ${
                  isBooking
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-900 dark:bg-emerald-600 text-white"
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
            <p className="text-xs text-muted-foreground">{projectName}</p>
          </div>

          <button
            type="button"
            onClick={handleRequestClose}
            className="h-8 w-8 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer flex items-center justify-center text-xl font-bold leading-none"
            aria-label="Закрыть"
          >
            ×
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {isSubmittedSuccess ? (
            <div className="py-10 text-center space-y-4 my-auto">
              <div className="h-16 w-16 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-300 shadow-sm animate-in zoom-in">
                <CheckCircle2 className="h-9 w-9" />
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-bold text-foreground">
                  {isBooking
                    ? tDual("Заявка на бронирование отправлена!", "Дархост барои бандкунӣ фиристода шуд!")
                    : tDual("Заявка на обратный звонок принята!", "Дархост барои занги бозгашт қабул шуд!")}
                </h3>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
                  {contactMode === "instant_15min"
                    ? tDual(
                        "Менеджер отдела продаж застройщика свяжется с вами в течение 15 минут.",
                        "Менеҷери шуъбаи фурӯш дар давоми 15 дақиқа бо шумо тамос мегирад."
                      )
                    : tDual(
                        `Менеджер отдела продаж свяжется с вами ${
                          scheduledDay === "today" ? "сегодня" : "завтра"
                        } в ${scheduledTime}.`,
                        `Менеҷери шуъбаи фурӯш бо шумо ${
                          scheduledDay === "today" ? "имрӯз" : "фардо"
                        } соати ${scheduledTime} тамос мегирад.`
                      )}
                </p>
              </div>

              <div className="p-3.5 bg-muted/40 border rounded-xl text-left text-[11px] text-muted-foreground space-y-1">
                <span className="font-semibold text-foreground block">
                  {tDual("Важная информация:", "Маълумоти муҳим:")}
                </span>
                <span>
                  {tDual(
                    "Отправка заявки не означает автоматического резервирования недвижимости. Фактическое бронирование оформляет застройщик самостоятельно после связи с вами.",
                    "Фиристодани дархост маънои ба таври худкор банд шудани амволро надорад. Бандкунии воқеиро сохтмончӣ пас аз тамос ба расмият медарорад."
                  )}
                </span>
              </div>

              <div className="pt-3">
                <Button
                  type="button"
                  onClick={onClose}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs h-10 rounded-xl cursor-pointer"
                >
                  {tDual("Закрыть", "Пӯшидан")}
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* Selected Bundle Summary (Cart Context) */}
              {(bundle.unit || bundle.parking || bundle.storage) && (
                <div className="p-3.5 rounded-xl bg-muted/30 border space-y-2 text-xs">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                    {tDual("Выбранный комплект объектов:", "Маҷмӯи объектҳои интихобшуда:")}
                  </span>
                  <div className="space-y-1.5">
                    {bundle.unit && (
                      <div className="flex items-center justify-between gap-2">
                        <span className="flex items-center gap-1.5 text-foreground truncate">
                          <Home className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">
                            {tDual("Квартира", "Хонадон")} № {bundle.unit.number} ({bundle.unit.totalArea} м²)
                          </span>
                        </span>
                        <span className="font-semibold text-foreground shrink-0 tabular-nums">
                          {isUsd
                            ? `$${formatSeparatedNumber(bundle.unit.priceUsd)}`
                            : `${formatSeparatedNumber(bundle.unit.priceTjs)} сомони`}
                        </span>
                      </div>
                    )}
                    {bundle.parking && (
                      <div className="flex items-center justify-between gap-2">
                        <span className="flex items-center gap-1.5 text-foreground truncate">
                          <Car className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">
                            {tDual("Машино-место", "Ҷойи мошин")} № {bundle.parking.number}
                          </span>
                        </span>
                        <span className="font-semibold text-foreground shrink-0 tabular-nums">
                          {isUsd
                            ? `$${formatSeparatedNumber(bundle.parking.priceUsd)}`
                            : `${formatSeparatedNumber(bundle.parking.priceTjs)} сомони`}
                        </span>
                      </div>
                    )}
                    {bundle.storage && (
                      <div className="flex items-center justify-between gap-2">
                        <span className="flex items-center gap-1.5 text-foreground truncate">
                          <Warehouse className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">
                            {tDual("Кладовая", "Анборхона")} № {bundle.storage.number}
                          </span>
                        </span>
                        <span className="font-semibold text-foreground shrink-0 tabular-nums">
                          {isUsd
                            ? `$${formatSeparatedNumber(bundle.storage.priceUsd)}`
                            : `${formatSeparatedNumber(bundle.storage.priceTjs)} сомони`}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="pt-2 border-t flex justify-between font-bold text-foreground">
                    <span>{tDual("Итого:", "Ҷамъ:")}</span>
                    <span className="text-emerald-600 font-black tabular-nums">
                      {isUsd
                        ? `$${formatSeparatedNumber(total)}`
                        : `${formatSeparatedNumber(total)} сомони`}
                    </span>
                  </div>
                </div>
              )}

              {/* Section 10.2 & 11.2: Radio Buttons for Contact Time */}
              <div className="space-y-2.5">
                <Label className="text-xs font-bold text-foreground block">
                  {tDual("Время связи", "Вақти тамос")}
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <label
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs transition-all cursor-pointer select-none ${
                      contactMode === "instant_15min"
                        ? "border-emerald-600 bg-emerald-500/10 text-foreground font-semibold"
                        : "border-border bg-card text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <input
                      type="radio"
                      name="contact-mode"
                      value="instant_15min"
                      checked={contactMode === "instant_15min"}
                      onChange={() => setContactMode("instant_15min")}
                      className="h-4 w-4 accent-emerald-600 cursor-pointer shrink-0"
                    />
                    <span>{tDual("В течение 15 минут", "Дар давоми 15 дақиқа")}</span>
                  </label>

                  <label
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs transition-all cursor-pointer select-none ${
                      contactMode === "scheduled"
                        ? "border-emerald-600 bg-emerald-500/10 text-foreground font-semibold"
                        : "border-border bg-card text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <input
                      type="radio"
                      name="contact-mode"
                      value="scheduled"
                      checked={contactMode === "scheduled"}
                      onChange={() => setContactMode("scheduled")}
                      className="h-4 w-4 accent-emerald-600 cursor-pointer shrink-0"
                    />
                    <span>{tDual("Выбрать время", "Интихоби вақт")}</span>
                  </label>
                </div>
              </div>

              {/* Section 10.3 & 11.3: Phone Input with placeholder «Введите номер телефона» */}
              <div className="space-y-1.5">
                <Label htmlFor="lead-phone" className="text-xs font-semibold text-foreground">
                  {tDual("Телефон", "Телефон")}
                </Label>
                <Input
                  id="lead-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (phoneError) setPhoneError(null);
                  }}
                  placeholder={tDual("Введите номер телефона", "Рақами телефонро ворид кунед")}
                  className={`h-10 text-sm ${phoneError ? "border-rose-500 focus-visible:ring-rose-500" : ""}`}
                  required
                />
                {phoneError ? (
                  <span className="text-[11px] text-rose-600 font-medium block">
                    {phoneError}
                  </span>
                ) : (
                  <span className="text-[11px] text-muted-foreground block">
                    {tDual("Например: +992 92 700 00 00", "Намуна: +992 92 700 00 00")}
                  </span>
                )}
              </div>

              {/* Section 10.4 & 11.4: Under phone field, two dropdowns when «Выбрать время» is selected */}
              {contactMode === "scheduled" && (
                <div className="p-3.5 rounded-xl bg-muted/40 border space-y-3 animate-in fade-in">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-[11px] text-muted-foreground">
                        {tDual("День", "Рӯз")}
                      </Label>
                      <Select
                        value={scheduledDay}
                        onValueChange={(val) => {
                          if (val) {
                            setScheduledDay(val as "today" | "tomorrow");
                            setScheduleError(null);
                          }
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
                        {tDual("Время", "Вақт")}
                      </Label>
                      <Select
                        value={scheduledTime}
                        onValueChange={(val) => {
                          if (val) {
                            setScheduledTime(val);
                            setScheduleError(null);
                          }
                        }}
                      >
                        <SelectTrigger className="h-9 text-xs bg-card">
                          <SelectValue placeholder="09:00" />
                        </SelectTrigger>
                        <SelectContent className="max-h-52 z-60">
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
                  {scheduleError && (
                    <span className="text-[11px] text-rose-600 font-medium block">
                      {scheduleError}
                    </span>
                  )}
                </div>
              )}

              {/* Submit Button (Section 10.3/10.4: «Отправить заявку», Section 11.3/11.4: «Заказать звонок») */}
              <div className="pt-1">
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
                      <span>{tDual("Отправка...", "Ирсол...")}</span>
                    </div>
                  ) : (
                    <span>
                      {isBooking
                        ? tDual("Отправить заявку", "Фиристодани дархост")
                        : tDual("Заказать звонок", "Фармоиши занг")}
                    </span>
                  )}
                </Button>
              </div>

              {/* Section 10.3, 11.3 & 14: Square Checkbox for Personal Data Consent (Unchecked by default, with Privacy Policy link) */}
              <div className="space-y-1.5">
                <div className="flex items-start gap-2.5 pt-1">
                  <input
                    type="checkbox"
                    id="consent-checkbox"
                    checked={consentPersonalData}
                    onChange={(e) => {
                      setConsentPersonalData(e.target.checked);
                      if (consentError) setConsentError(null);
                    }}
                    className="mt-0.5 h-4 w-4 rounded-none border-border accent-emerald-600 focus:ring-emerald-500 cursor-pointer shrink-0"
                  />
                  <label
                    htmlFor="consent-checkbox"
                    className="text-[11px] text-muted-foreground leading-relaxed cursor-pointer select-none"
                  >
                    {tDual(
                      "Я согласен на обработку моих персональных данных. С ",
                      "Ман ба коркарди маълумоти шахсии худ розиям. Бо "
                    )}
                    <Link
                      href="/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-emerald-600 underline hover:text-emerald-700 font-medium"
                    >
                      {tDual(
                        "политикой в отношении обработки персональных данных",
                        "сиёсат дар бораи коркарди маълумоти шахсӣ"
                      )}
                    </Link>
                    {tDual(" ознакомлен и согласен.", " шинос шудам ва розиям.")}
                  </label>
                </div>
                {consentError && (
                  <span className="text-[11px] text-rose-600 font-medium block pl-6">
                    {consentError}
                  </span>
                )}
              </div>

              {/* Server / Submission Error Message */}
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 text-rose-800 dark:text-rose-200 text-xs flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
