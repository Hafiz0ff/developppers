"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ShieldCheck, KeyRound } from "lucide-react";
import { LoginFormV7 } from "./login-form-v7";
import { OtpVerificationV7 } from "./otp-verification-v7";
import { useLanguage } from "@/context/language-context";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "login" | "register";
}

export function AuthModal({ isOpen, onClose, defaultTab = "login" }: AuthModalProps) {
  const { language } = useLanguage();
  const [step, setStep] = useState<"auth" | "otp">("auth");
  const [otpPhone, setOtpPhone] = useState<string>("+992 92 700 0000");
  const [demoCode, setDemoCode] = useState<string>("4545");

  useEffect(() => {
    if (isOpen) {
      setStep("auth");
    }
  }, [isOpen, defaultTab]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  const tr = (ru: string, tg: string, en: string) => {
    if (language === "tg") return tg;
    if (language === "en") return en;
    return ru;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[120] flex items-center justify-center overflow-y-auto p-4 sm:p-6 [perspective:1200px]"
        >
          {/* Tahoe Frosted Glass Backdrop (50% blur & gentle tint, keeps website context recognizable) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/45 backdrop-blur-md backdrop-saturate-150"
          />

          {/* Modal Stage: Tahoe Spring 3D Fly-In Animation (lightweight & fluid) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: -44, rotateX: 10, filter: "blur(6px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.93, y: 24, filter: "blur(4px)" }}
            transition={{ type: "spring", stiffness: 340, damping: 24, mass: 0.75 }}
            className="relative z-10 flex w-full max-w-[440px] flex-col items-center my-auto transform-gpu"
          >
            {/* Top Mode Switcher Bar + Close Button */}
            <div className="mb-3 flex w-full items-center justify-between px-1">
              <div className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-[#12121A]/90 p-1 backdrop-blur-md">
                <button
                  type="button"
                  onClick={() => setStep("auth")}
                  className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold transition-all ${
                    step === "auth"
                      ? "bg-[#FACC15] text-slate-950 shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <KeyRound className="h-3 w-3" />
                  <span>{tr("Вход / Регистрация", "Воридшавӣ", "Login / Sign Up")}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep("otp")}
                  className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold transition-all ${
                    step === "otp"
                      ? "bg-emerald-500 text-white shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <ShieldCheck className="h-3 w-3" />
                  <span>{tr("OTP Верификация", "Тасдиқи OTP", "OTP Verify")}</span>
                </button>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-white/12 bg-[#12121A]/90 text-slate-400 transition-colors hover:border-white/25 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Active View: LoginFormV7 OR OtpVerificationV7 */}
            <AnimatePresence mode="wait">
              {step === "auth" ? (
                <motion.div
                  key="auth-v7-card"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="w-full"
                >
                  <LoginFormV7
                    defaultMode={defaultTab}
                    accentTheme="gold"
                    onSuccess={onClose}
                    onRequestOtpVerification={(phoneVal, codeHint) => {
                      setOtpPhone(phoneVal || "+992 92 700 0000");
                      if (codeHint) setDemoCode(codeHint);
                      setStep("otp");
                    }}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="otp-v7-card"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="w-full flex justify-center"
                >
                  <OtpVerificationV7
                    phone={otpPhone}
                    demoCodeHint={demoCode}
                    onBack={() => setStep("auth")}
                    onVerified={() => {
                      onClose();
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
