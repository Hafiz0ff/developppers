"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, X, Share, PlusSquare, Sparkles } from "lucide-react";

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);

  useEffect(() => {
    // 1. Register Service Worker
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          reg.update();
          console.log("[PWA] Service Worker зарегистрирован успешно:", reg.scope);
        })
        .catch((err) => {
          console.warn("[PWA] Ошибка регистрации Service Worker:", err);
        });
    }

    // 2. Check standalone mode (already installed)
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;

    if (isStandalone) {
      return;
    }

    // 3. Check dismissal timestamp in localStorage (dismiss for 3 days)
    const dismissedAt = localStorage.getItem("sogd_pwa_prompt_dismissed");
    if (dismissedAt) {
      const elapsed = Date.now() - Number(dismissedAt);
      if (elapsed < 3 * 24 * 60 * 60 * 1000) {
        return;
      }
    }

    // 4. Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isAppleDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isAppleDevice);

    // 5. Android / Chrome beforeinstallprompt listener
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // If on iOS and not standalone, show prompt after a short delay
    let iosTimer: NodeJS.Timeout;
    if (isAppleDevice && !isStandalone) {
      iosTimer = setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      if (iosTimer) clearTimeout(iosTimer);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIos) {
      setShowIosGuide(true);
      return;
    }

    if (!deferredPrompt) {
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log("[PWA] Решение пользователя:", outcome);
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("sogd_pwa_prompt_dismissed", Date.now().toString());
  };

  if (!showPrompt) {
    return null;
  }

  return (
    <aside
      aria-label="Установка приложения Maskani"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="bg-background/90 backdrop-blur-xl border border-border/80 rounded-2xl p-4 sm:p-5 shadow-xl text-foreground flex flex-col gap-3">
        {/* Top: Icon + Title + Close */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src="/icons/icon-192x192.png"
              alt="Maskani"
              className="h-11 w-11 rounded-xl shadow-xs border border-border/80 object-cover shrink-0"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-semibold text-sm text-foreground">
                  Установить Maskani
                </h4>
                <Badge variant="secondary" className="text-xs font-semibold px-1.5 py-0.5 rounded">
                  PWA
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                Быстрый доступ к каталогу новостроек, шахматке и CRM без браузера
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Закрыть уведомление"
            className="text-muted-foreground hover:text-foreground p-1 -mr-1 -mt-1 rounded-lg hover:bg-muted transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* iOS Instruction Modal / Accordion */}
        {showIosGuide && (
          <div className="p-3 bg-muted/40 rounded-xl border border-border/60 text-xs text-foreground space-y-2 animate-in fade-in">
            <p className="font-semibold text-foreground flex items-center gap-1">
              Для установки на iPhone / iPad:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-xs leading-relaxed text-muted-foreground">
              <li>
                Нажмите кнопку <strong>«Поделиться»</strong>{" "}
                <Share className="h-3.5 w-3.5 inline mx-0.5 text-primary" /> внизу Safari
              </li>
              <li>
                Прокрутите меню и выберите <strong>«На экран "Домой"»</strong>{" "}
                <PlusSquare className="h-3.5 w-3.5 inline mx-0.5 text-foreground" />
              </li>
              <li>Нажмите «Добавить» в правом верхнем углу</li>
            </ol>
          </div>
        )}

        {/* Bottom Action Buttons */}
        <div className="flex items-center gap-2 pt-1">
          <Button
            size="sm"
            onClick={handleInstallClick}
            className="flex-1 font-semibold text-xs h-9 rounded-xl shadow-xs gap-1.5"
          >
            <Download className="h-3.5 w-3.5" />
            {isIos ? "Как установить на экран" : "Установить на экран"}
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={handleDismiss}
            className="text-xs text-muted-foreground hover:text-foreground h-9 px-3 rounded-xl"
          >
            Позже
          </Button>
        </div>
      </div>
    </aside>
  );
}
