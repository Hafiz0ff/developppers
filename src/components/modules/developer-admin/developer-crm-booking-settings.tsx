"use client";

import React, { useState, useEffect, useRef } from "react";
import { DeveloperCrmSettings } from "@/types/crm-booking";
import {
  getDeveloperCrmSettings,
  saveDeveloperCrmSettings,
} from "@/lib/crm-booking-store";
import { useLanguage } from "@/context/language-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  HelpCircle,
  CheckCircle2,
  PhoneCall,
  Sparkles,
  Link as LinkIcon,
  Unlink,
  Clock,
  X,
} from "lucide-react";

interface DeveloperCrmBookingSettingsProps {
  developerId?: string;
  onSettingsChange?: (settings: DeveloperCrmSettings) => void;
}

export function DeveloperCrmBookingSettings({
  developerId = "dev-1",
  onSettingsChange,
}: DeveloperCrmBookingSettingsProps) {
  const { tDual } = useLanguage();
  const [settings, setSettings] = useState<DeveloperCrmSettings>(() =>
    getDeveloperCrmSettings(developerId)
  );
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isHoverOverlayOpen, setIsHoverOverlayOpen] = useState(false);
  const [isConnectingCrm, setIsConnectingCrm] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync when storage updates or developerId changes
  useEffect(() => {
    setSettings(getDeveloperCrmSettings(developerId));

    const handleStorageChange = () => {
      const current = getDeveloperCrmSettings(developerId);
      setSettings(current);
    };

    window.addEventListener("maskani-crm-settings-changed", handleStorageChange);
    return () => window.removeEventListener("maskani-crm-settings-changed", handleStorageChange);
  }, [developerId]);

  const updateSettings = (updated: DeveloperCrmSettings) => {
    const normalized = saveDeveloperCrmSettings(updated);
    setSettings(normalized);
    if (onSettingsChange) {
      onSettingsChange(normalized);
    }
  };

  const handleToggleScenario = (checked: boolean) => {
    if (!settings.crmConnected) return;
    const updated: DeveloperCrmSettings = {
      ...settings,
      bookingScenarioEnabled: checked,
      updatedAt: new Date().toISOString(),
    };
    updateSettings(updated);
    showNotice(
      checked
        ? tDual(
            "Сценарий «Заявки на бронирование и звонки» включён. На публичной карточке новостройки отображаются кнопки «Забронировать» и «Звонок».",
            "Сенарияи «Дархостҳо барои бандкунӣ ва зангҳо» фаъол карда шуд."
          )
        : tDual(
            "Сценарий выключен. На публичной карточке новостройки снова отображается номер телефона.",
            "Сенария хомӯш карда шуд. Дар саҳифаи новостройка рақами телефон намоиш дода мешавад."
          )
    );
  };

  const handleConnectCrm = () => {
    setIsConnectingCrm(true);
    setTimeout(() => {
      const updated: DeveloperCrmSettings = {
        ...settings,
        crmConnected: true,
        bookingScenarioEnabled: false,
        updatedAt: new Date().toISOString(),
      };
      updateSettings(updated);
      setIsConnectingCrm(false);
      showNotice(
        tDual(
          "CRM подключена! Теперь вы можете включить сценарий «Заявки на бронирование и звонки».",
          "CRM бомуваффақият васл шуд! Акнун шумо метавонед сенарияро фаъол намоед."
        )
      );
    }, 350);
  };

  const handleDisconnectCrm = () => {
    const updated: DeveloperCrmSettings = {
      ...settings,
      crmConnected: false,
      bookingScenarioEnabled: false,
      updatedAt: new Date().toISOString(),
    };
    updateSettings(updated);
    showNotice(
      tDual(
        "CRM отключена. Сценарий автоматически деактивирован для новых заявок, ранее полученные заявки сохранены.",
        "CRM хомӯш карда шуд. Сенария ғайрифаъол шуд, дархостҳои қаблӣ нигоҳ дошта шуданд."
      )
    );
  };

  const showNotice = (msg: string) => {
    setSuccessBanner(msg);
    setTimeout(() => setSuccessBanner(null), 4500);
  };

  const handleQuestionMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setIsHoverOverlayOpen(true);
  };

  const handleQuestionMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHoverOverlayOpen(false);
    }, 220);
  };

  const handleQuestionClick = () => {
    // Section 3.1: Click toggles the info overlay (and works on mobile tap without hover)
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setIsHelpModalOpen((prev) => !prev);
      setIsHoverOverlayOpen(false);
    } else {
      setIsHelpModalOpen((prev) => !prev);
      setIsHoverOverlayOpen(false);
    }
  };

  const renderScenarioInfoContent = () => (
    <div className="space-y-3 text-xs leading-relaxed text-foreground/90">
      <p className="font-semibold text-foreground">
        {tDual(
          "После включения функции вместо открытого номера телефона на странице вашей новостройки появятся кнопки «Забронировать» и «Звонок».",
          "Пас аз фаъол намудани функсия ба ҷои рақами кушодаи телефон дар саҳифаи сохтмони шумо тугмаҳои «Банд кардан» ва «Занг» пайдо мешаванд."
        )}
      </p>

      <div className="space-y-2">
        <div className="font-bold text-foreground text-xs">
          {tDual("Как это работает:", "Ин чӣ тавр кор мекунад:")}
        </div>
        <ul className="space-y-2 list-disc pl-4">
          <li>
            <strong className="text-foreground">
              {tDual("«Забронировать»", "«Банд кардан»")}
            </strong>{" "}
            —{" "}
            {tDual(
              "покупатель отправляет заявку, если готов перейти к оформлению бронирования выбранной квартиры.",
              "харидор дархост мефиристад, агар омода бошад ба расмикунонии банд кардани хонадони интихобшуда гузарад."
            )}
          </li>
          <li>
            <strong className="text-foreground">
              {tDual("«Звонок»", "«Занг»")}
            </strong>{" "}
            —{" "}
            {tDual(
              "покупатель заказывает обратный звонок для консультации, обсуждения условий или организации встречи.",
              "харидор занги бозгаштро барои машварат, муҳокимаи шартҳо ё ташкили вохӯрӣ фармоиш медиҳад."
            )}
          </li>
          <li>
            <strong className="text-foreground">
              {tDual("Выбор времени", "Интихоби вақт")}
            </strong>{" "}
            —{" "}
            {tDual(
              "покупатель может запросить связь в течение 15 минут либо выбрать время на сегодня или завтра с 09:00 до 22:00.",
              "харидор метавонад дар давоми 15 дақиқа алоқаро талаб кунад ё вақтро барои имрӯз ё фардо аз 09:00 то 22:00 интихоб намояд."
            )}
          </li>
          <li>
            <strong className="text-foreground">
              {tDual("Квартира, паркинг и кладовая", "Хонадон, таваққуфгоҳ ва анбор")}
            </strong>{" "}
            —{" "}
            {tDual(
              "если соответствующие блоки включены в настройках новостройки, покупатель сможет добавить дополнительные объекты к выбранной квартире и увидеть их общую стоимость.",
              "агар блокҳои дахлдор дар танзимоти маҷмаа фаъол бошанд, харидор метавонад объектҳои иловагиро ба хонаи интихобшуда ҳамроҳ намуда, арзиши умумии онҳоро бинад."
            )}
          </li>
          <li>
            <strong className="text-foreground">
              {tDual("Заявки в CRM", "Дархостҳо дар CRM")}
            </strong>{" "}
            —{" "}
            {tDual(
              "вы получите информацию о типе обращения, контактных данных покупателя, выбранных объектах и желаемом времени связи.",
              "шумо дар бораи намуди муроҷиат, маълумоти тамоси харидор, объектҳои интихобшуда ва вақти дилхоҳи тамос маълумот мегиред."
            )}
          </li>
        </ul>
      </div>

      <p className="text-foreground font-medium pt-1">
        {tDual(
          "Фактическое бронирование квартиры, машино-места или кладовой выполняет ваша команда после обработки заявки.",
          "Бандкунии воқеии хонадон, ҷойи мошин ё анборро дастаи шумо пас аз коркарди дархост анҷом медиҳад."
        )}
      </p>

      <p className="text-muted-foreground">
        {tDual(
          "Отключить сценарий можно в любой момент. После отключения на странице новостройки снова будет отображаться номер телефона согласно стандартным настройкам сайта.",
          "Шумо метавонед сенарияро дар ҳар лаҳза хомӯш кунед. Пас аз хомӯшкунӣ дар саҳифаи новостройка мувофиқи танзимоти пешфарз рақами телефон намоиш дода мешавад."
        )}
      </p>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Toast Notice */}
      {successBanner && (
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 p-3.5 rounded-xl border border-emerald-300 dark:border-emerald-800 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{successBanner}</span>
        </div>
      )}

      {/* Main Settings Card (Section 3.1) */}
      <Card className="border border-border/80 shadow-xs overflow-visible">
        <CardHeader className="p-5 pb-4 bg-muted/20 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <PhoneCall className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>
                  {tDual(
                    "Заявки на бронирование и звонки",
                    "Дархостҳо барои бандкунӣ ва зангҳо"
                  )}
                </span>
              </CardTitle>

              <CardDescription className="text-xs">
                {tDual(
                  "Управление сценарием приёма заявок на бронирование и обратный звонок в карточках новостроек",
                  "Идоракунии сенарияи қабули дархостҳо барои бандкунӣ ва занги бозгашт дар кортҳои новостройка"
                )}
              </CardDescription>
            </div>

            {/* Right Controls: CRM Badge + Question Icon (to the left of Switch) + Switch */}
            <div className="flex items-center gap-3 self-start sm:self-center">
              <Badge
                variant="outline"
                className={`text-[11px] px-2.5 py-1 font-semibold flex items-center gap-1.5 ${
                  settings.crmConnected
                    ? "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300"
                    : "bg-slate-100 text-slate-600 border-slate-300 dark:bg-slate-800 dark:text-slate-400"
                }`}
              >
                {settings.crmConnected ? (
                  <>
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>{tDual("CRM подключена", "CRM васл шуд")}</span>
                  </>
                ) : (
                  <>
                    <span className="h-2 w-2 rounded-full bg-slate-400" />
                    <span>{tDual("CRM не подключена", "CRM васл нест")}</span>
                  </>
                )}
              </Badge>

              {/* Section 3.1: Слева от тумблера расположить иконку вопроса */}
              <div
                className="relative flex items-center"
                onMouseEnter={handleQuestionMouseEnter}
                onMouseLeave={handleQuestionMouseLeave}
              >
                <button
                  type="button"
                  onClick={handleQuestionClick}
                  className="p-1.5 text-muted-foreground hover:text-emerald-600 hover:bg-muted rounded-full transition-colors cursor-pointer"
                  aria-label={tDual("Сценарий бронирования и звонков", "Сенарияи бандкунӣ ва зангҳо")}
                >
                  <HelpCircle className="h-4 w-4" />
                </button>

                {/* Desktop Hover / Popover Overlay (Section 3.1 & 3.4) */}
                {isHoverOverlayOpen && (
                  <div
                    onMouseEnter={handleQuestionMouseEnter}
                    onMouseLeave={handleQuestionMouseLeave}
                    className="hidden md:block absolute right-0 top-full mt-2 w-[420px] z-50 p-5 rounded-2xl bg-card border border-border shadow-2xl space-y-3 animate-in fade-in zoom-in-95 duration-150"
                  >
                    <div className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-emerald-600 shrink-0" />
                        <h4 className="text-sm font-bold text-foreground">
                          {tDual("Сценарий бронирования и звонков", "Сенарияи бандкунӣ ва зангҳо")}
                        </h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsHoverOverlayOpen(false)}
                        className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                        aria-label="Закрыть"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    {renderScenarioInfoContent()}
                  </div>
                )}
              </div>

              {/* Switch (Tumbler) */}
              <div className="flex items-center gap-2">
                <Switch
                  id="booking-scenario-switch"
                  checked={settings.crmConnected && settings.bookingScenarioEnabled}
                  disabled={!settings.crmConnected}
                  onCheckedChange={handleToggleScenario}
                  className="data-[state=checked]:bg-emerald-600"
                />
                <label
                  htmlFor="booking-scenario-switch"
                  className={`text-xs font-semibold select-none ${
                    !settings.crmConnected
                      ? "text-muted-foreground opacity-60 cursor-not-allowed"
                      : "text-foreground cursor-pointer"
                  }`}
                >
                  {settings.bookingScenarioEnabled && settings.crmConnected
                    ? tDual("ON", "ON")
                    : tDual("OFF", "OFF")}
                </label>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-5 space-y-5">
          {/* STATE 1 (Section 3.2): CRM NOT CONNECTED */}
          {!settings.crmConnected && (
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-600 text-white shrink-0 mt-0.5">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-foreground">
                    {tDual(
                      "Превращайте интерес покупателей в заявки на бронирование",
                      "Таваҷҷуҳи харидоронро ба дархостҳои бандкунӣ табдил диҳед"
                    )}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {tDual(
                      "Предоставьте покупателям возможность отправлять заявки на бронирование квартиры или заказывать обратный звонок прямо со страницы вашей новостройки.",
                      "Ба харидорон имкон диҳед, ки бевосита аз саҳифаи сохтмони шумо барои банд кардани хонадон дархост фиристанд ё фармоиши занги бозгашт кунанд."
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {tDual(
                      "Покупатель сможет выбрать квартиру, добавить машино-место или кладовую и увидеть общую стоимость выбранных объектов. Вместе с заявкой вы получите информацию о том, что именно его заинтересовало и когда с ним удобнее связаться.",
                      "Харидор метавонад хонадонро интихоб кунад, ҷойи мошин ё анборро илова намояд ва арзиши умумии объектҳои интихобшударо бинад."
                    )}
                  </p>
                </div>
              </div>

              <div className="text-xs text-foreground/90 leading-relaxed bg-white dark:bg-card p-4 rounded-xl border border-border/80 space-y-2.5">
                <div className="font-bold text-foreground text-xs">
                  {tDual("Что это даст вам:", "Ин ба шумо чӣ медиҳад:")}
                </div>
                <ul className="space-y-1.5 list-disc pl-4 text-xs text-muted-foreground">
                  <li>
                    <strong className="text-foreground font-semibold">
                      {tDual("Больше целевых обращений.", "Зиёдшавии муроҷиатҳои мақсаднок.")}
                    </strong>{" "}
                    {tDual(
                      "Покупатель может отправить заявку, не разыскивая ваш номер телефона.",
                      "Харидор метавонад бе ҷустуҷӯи рақами телефон дархост фиристад."
                    )}
                  </li>
                  <li>
                    <strong className="text-foreground font-semibold">
                      {tDual("Понимание намерений покупателя.", "Фаҳмидани нияти харидор.")}
                    </strong>{" "}
                    {tDual(
                      "Вы увидите, хочет ли клиент перейти к бронированию или пока нуждается в консультации.",
                      "Шумо мебинед, ки оё муштарӣ мехоҳад фавран банд кунад ё танҳо машварат лозим дорад."
                    )}
                  </li>
                  <li>
                    <strong className="text-foreground font-semibold">
                      {tDual("Продажа дополнительных объектов.", "Фурӯши объектҳои иловагӣ.")}
                    </strong>{" "}
                    {tDual(
                      "Покупатель сможет добавить к квартире паркинг и кладовую, а вы получите заявку с полным составом выбранных объектов.",
                      "Харидор метавонад ба хона таваққуфгоҳ ва анборро ҳамроҳ кунад ва шумо маҷмӯи пурраи интихобро мегиред."
                    )}
                  </li>
                  <li>
                    <strong className="text-foreground font-semibold">
                      {tDual("Удобная обработка заявок.", "Коркарди муносиби дархостҳо.")}
                    </strong>{" "}
                    {tDual(
                      "Все обращения поступают в CRM, где ваша команда сможет работать с потенциальными покупателями.",
                      "Ҳамаи муроҷиатҳо ба CRM ворид мешаванд, ки дар он дастаи шумо метавонад бо мизоҷон кор барад."
                    )}
                  </li>
                </ul>

                <p className="text-xs text-muted-foreground pt-1">
                  {tDual(
                    "Подключите CRM, чтобы активировать функцию и дать покупателям новый способ взаимодействия с вашим отделом продаж.",
                    "CRM-ро васл кунед, то функсия фаъол шавад ва ба харидорон усули нави ҳамкорӣ пешниҳод гардад."
                  )}
                </p>
              </div>

              <div className="pt-1 flex items-center gap-3">
                <Button
                  type="button"
                  onClick={handleConnectCrm}
                  disabled={isConnectingCrm}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-5 h-9 rounded-xl shadow-xs cursor-pointer"
                >
                  <LinkIcon className="h-3.5 w-3.5 mr-1.5" />
                  {isConnectingCrm
                    ? tDual("Подключение CRM...", "Пайвастшавӣ ба CRM...")
                    : tDual("Подключить CRM", "Подключить CRM")}
                </Button>
              </div>
            </div>
          )}

          {/* STATE 2 (Section 3.3): CRM CONNECTED, SCENARIO OFF */}
          {settings.crmConnected && !settings.bookingScenarioEnabled && (
            <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-4">
              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-foreground">
                  {tDual(
                    "Заявки на бронирование и звонки",
                    "Дархостҳо барои бандкунӣ ва зангҳо"
                  )}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {tDual(
                    "Позвольте покупателям отправлять заявки на бронирование выбранной квартиры и заказывать обратный звонок прямо со страницы новостройки.",
                    "Ба харидорон имкон диҳед, ки бевосита аз саҳифаи новостройка барои банд кардани хонадони интихобшуда дархост фиристанд ва занги бозгаштро фармоиш диҳанд."
                  )}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {tDual(
                    "Получайте в CRM информацию о выбранных объектах, общей стоимости и удобном времени связи.",
                    "Дар CRM маълумотро дар бораи объектҳои интихобшуда, арзиши умумӣ ва вақти мувофиқи тамос дастрас намоед."
                  )}
                </p>
                <p className="text-xs text-foreground font-medium leading-relaxed">
                  {tDual(
                    "Включите функцию, чтобы начать принимать такие заявки.",
                    "Функсияро фаъол кунед, то қабули чунин дархостҳоро оғоз намоед."
                  )}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Button
                  type="button"
                  onClick={() => handleToggleScenario(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-4 h-9 rounded-xl shadow-xs cursor-pointer"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                  {tDual("Включить сценарий", "Фаъол кардани сенария")}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleDisconnectCrm}
                  className="text-xs text-muted-foreground hover:text-rose-600 border-border h-9 rounded-xl cursor-pointer"
                >
                  <Unlink className="h-3.5 w-3.5 mr-1.5" />
                  {tDual("Отключить CRM", "Хомӯш кардани CRM")}
                </Button>
              </div>
            </div>
          )}

          {/* STATE 3 (Section 3.4): CRM CONNECTED & SCENARIO ON (Promotional texts hidden) */}
          {settings.crmConnected && settings.bookingScenarioEnabled && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <div className="inline-flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>
                    {tDual(
                      "Сценарий бронирования и звонков активен",
                      "Сенарияи бандкунӣ ва зангҳо фаъол аст"
                    )}
                  </span>
                </div>
                <span className="text-muted-foreground hidden sm:inline">•</span>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="h-3.5 w-3.5 text-emerald-600" />
                  <span>
                    {tDual("Принимаем звонки с", "Қабули зангҳо аз")}{" "}
                    <strong className="text-foreground">
                      {settings.workHoursStart} до {settings.workHoursEnd}
                    </strong>
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsHelpModalOpen(true)}
                  className="text-xs h-8 rounded-xl border-emerald-500/30 text-emerald-800 dark:text-emerald-200 gap-1.5 cursor-pointer"
                >
                  <HelpCircle className="h-3.5 w-3.5" />
                  <span>{tDual("Описание сценария", "Тавсифи сенария")}</span>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleDisconnectCrm}
                  className="text-xs text-muted-foreground hover:text-rose-600 h-8 rounded-xl cursor-pointer"
                >
                  <Unlink className="h-3.5 w-3.5 mr-1" />
                  <span>{tDual("Отключить CRM", "Хомӯш кардани CRM")}</span>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* QUESTION MARK (?) CLICK / MOBILE OVERLAY MODAL (Section 3.4 of ТЗ) */}
      <Dialog open={isHelpModalOpen} onOpenChange={setIsHelpModalOpen}>
        <DialogContent className="max-w-xl p-6 rounded-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="space-y-2 pb-2 border-b">
            <div className="flex items-center gap-2 text-emerald-600">
              <Sparkles className="h-5 w-5" />
              <DialogTitle className="text-lg font-bold text-foreground">
                {tDual("Сценарий бронирования и звонков", "Сенарияи бандкунӣ ва зангҳо")}
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-muted-foreground">
              {tDual(
                "Принцип работы функции «Заявки на бронирование и звонки»",
                "Тарзи кори функсияи «Дархостҳо барои бандкунӣ ва зангҳо»"
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="py-2">{renderScenarioInfoContent()}</div>

          <div className="pt-2 border-t flex justify-end">
            <Button
              type="button"
              onClick={() => setIsHelpModalOpen(false)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-5 h-9 rounded-xl cursor-pointer"
            >
              {tDual("Понятно", "Фаҳмост")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
