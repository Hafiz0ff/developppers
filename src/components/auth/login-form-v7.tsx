"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Phone,
  Building2,
  MapPin,
  Loader2,
  Check,
  Smartphone,
  ShieldCheck,
} from "lucide-react";
import { ChamferedGlassCard, type MorphPhase } from "./chamfered-glass-card";
import { SOGD_CITIES } from "@/lib/constants/locations";
import { signIn, signUp } from "@/lib/auth-client";
import { useLanguage } from "@/context/language-context";

export interface LoginFormV7Props {
  defaultMode?: "login" | "register";
  accentTheme?: "gold" | "emerald";
  onSuccess?: () => void;
  onRequestOtpVerification?: (phone: string, demoCode?: string) => void;
}

export function LoginFormV7({
  defaultMode = "login",
  accentTheme = "gold",
  onSuccess,
  onRequestOtpVerification,
}: LoginFormV7Props) {
  const { language } = useLanguage();
  const [mode, setMode] = useState<"login" | "register">(defaultMode);
  const [morphPhase, setMorphPhase] = useState<MorphPhase>("idle");
  const [loginMethod, setLoginMethod] = useState<"otp" | "password">("otp");

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("+992 92 700 0000");
  const [city, setCity] = useState("khujand");
  const [role, setRole] = useState<"user" | "realtor" | "developer">("user");
  const [agencyName, setAgencyName] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const timersRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  useEffect(() => {
    setMode(defaultMode);
  }, [defaultMode]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  const tr = useCallback(
    (ru: string, tg: string, en: string) => {
      if (language === "tg") return tg;
      if (language === "en") return en;
      return ru;
    },
    [language]
  );

  /**
   * 4-Phase Corner-Shard Convergence & Energy Pulse Transition (IMG_5893.MP4 frames 1.28s - 2.24s)
   */
  const triggerModeSwitch = (targetMode: "login" | "register") => {
    if (morphPhase !== "idle" || targetMode === mode) return;
    setError(null);
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];

    // Phase 1 & 2: Form blurs out, corner shards fly diagonally to the center
    setMorphPhase("converge");

    // Phase 3: Shards hold locked in center + Golden/Emerald Energy Orb & Shockwave pulse
    const t1 = setTimeout(() => {
      setMorphPhase("pulse");
    }, 260);

    // Phase 4: Swap form DOM & Shards fly back to chamfered corners as new form unblurs
    const t2 = setTimeout(() => {
      setMode(targetMode);
      setMorphPhase("return");
    }, 560);

    const t3 = setTimeout(() => {
      setMorphPhase("idle");
    }, 820);

    timersRef.current.push(t1, t2, t3);
  };

  const requestPhoneOtp = async (targetPhone: string) => {
    const cleanPhone = targetPhone.trim() || "+992 92 700 0000";
    try {
      const res = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send", phone: cleanPhone }),
      });
      const data = await res.json();
      onRequestOtpVerification?.(cleanPhone, data.demoCode || "4545");
    } catch {
      onRequestOtpVerification?.(cleanPhone, "4545");
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanPhone = phone.trim();
    if (cleanPhone.replace(/\D/g, "").length < 9) {
      setError(
        tr(
          "Введите корректный номер телефона (+992 ...)",
          "Рақами дурусти телефонро ворид кунед (+992 ...)",
          "Please enter a valid phone number (+992 ...)"
        )
      );
      return;
    }

    if (loginMethod === "otp") {
      await requestPhoneOtp(cleanPhone);
      return;
    }

    setLoading(true);
    try {
      const syntheticEmail = email.trim() || `${cleanPhone.replace(/\D/g, "")}@maskani.tj`;
      const res = await signIn.email({
        email: syntheticEmail,
        password,
      });

      if (res.error) {
        setError(
          res.error.message ||
            tr(
              "Неверный пароль. Вы можете войти по SMS-коду без пароля.",
              "Рамз нодуруст аст. Шумо метавонед бо SMS-код бе рамз ворид шавед.",
              "Invalid password. You can sign in via SMS code instead."
            )
        );
      } else {
        onSuccess?.();
        window.location.reload();
      }
    } catch {
      // If DB is offline in demo, transition smoothly to OTP verification
      if (onRequestOtpVerification) {
        await requestPhoneOtp(cleanPhone);
      } else {
        setError(
          tr(
            "Сервер временно недоступен. Войдите по коду из SMS.",
            "Сервер муваққатан дастрас нест. Бо рамзи SMS ворид шавед.",
            "Server temporarily unavailable. Try SMS code."
          )
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanPhone = phone.trim();
    if (cleanPhone.replace(/\D/g, "").length < 9) {
      setError(
        tr(
          "Введите действующий номер телефона (+992 ...)",
          "Рақами дурусти телефонро ворид кунед (+992 ...)",
          "Please enter a valid phone number (+992 ...)"
        )
      );
      return;
    }

    if (password !== confirmPassword) {
      setError(
        tr(
          "Пароли не совпадают",
          "Рамзҳо мувофиқат намекунанд",
          "Passwords do not match"
        )
      );
      return;
    }

    if (!agreeTerms) {
      setError(
        tr(
          "Необходимо принять условия использования и политику конфиденциальности",
          "Қабули шартҳои истифода ва сиёсати махфият ҳатмист",
          "Please agree to the Terms & Privacy Policy"
        )
      );
      return;
    }

    setLoading(true);
    try {
      const syntheticEmail = email.trim() || `${cleanPhone.replace(/\D/g, "")}@maskani.tj`;
      const res = await signUp.email({
        email: syntheticEmail,
        password,
        name: name.trim() || "Пользователь Maskani",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...({
          role,
          phone: cleanPhone,
          city,
          agencyName: role === "realtor" ? agencyName : undefined,
        } as any),
      });

      if (res.error) {
        // In case account exists or demo mode, proceed to phone verification
        await requestPhoneOtp(cleanPhone);
      } else {
        // After registration, verify phone number via OTP
        await requestPhoneOtp(cleanPhone);
      }
    } catch {
      await requestPhoneOtp(cleanPhone);
    } finally {
      setLoading(false);
    }
  };

  const accentTextClass =
    accentTheme === "gold" ? "text-[#FACC15]" : "text-emerald-400";
  const ctaButtonStyle =
    accentTheme === "gold"
      ? {
          background: "linear-gradient(180deg, #FDE047 0%, #FACC15 55%, #EAB308 100%)",
          color: "#09090C",
          boxShadow: "0 10px 30px -6px rgba(250, 204, 21, 0.48), inset 0 1px 0 rgba(255,255,255,0.65)",
        }
      : {
          background: "linear-gradient(180deg, #34D399 0%, #10B981 55%, #059669 100%)",
          color: "#FFFFFF",
          boxShadow: "0 10px 30px -6px rgba(16, 185, 129, 0.48), inset 0 1px 0 rgba(255,255,255,0.35)",
        };

  return (
    <ChamferedGlassCard morphPhase={morphPhase} accentTheme={accentTheme}>
      {/* Dual-Tone Header Title & Subtitle */}
      <div className="mb-5">
        {mode === "login" ? (
          <>
            <h2 className="text-2xl font-extrabold tracking-tight sm:text-[26px]">
              <span className="text-white">{tr("С возвращением ", "Хуш омадед ", "Welcome ")}</span>
              <span className={accentTextClass}>{tr("в Maskani", "ба Maskani", "Back")}</span>
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              {tr(
                "Вход только по номеру телефона (+992)",
                "Воридшавӣ танҳо бо рақами телефон (+992)",
                "Sign in via verified phone number (+992)"
              )}
            </p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-extrabold tracking-tight sm:text-[26px]">
              <span className="text-white">{tr("Создать ", "Сохтани ", "Create ")}</span>
              <span className={accentTextClass}>{tr("аккаунт", "ҳисоб", "Account")}</span>
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              {tr(
                "Регистрация с подтверждением номера телефона",
                "Бақайдгирӣ бо тасдиқи рақами телефон",
                "Registration with SMS phone verification"
              )}
            </p>
          </>
        )}
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-2.5 text-xs text-rose-300">
          {error}
        </div>
      )}

      {mode === "login" ? (
        /* ==================== SIGN IN FORM (PHONE ONLY) ==================== */
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          {/* Method Switcher: Fast SMS Code vs Password */}
          <div className="grid grid-cols-2 gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-1">
            <button
              type="button"
              onClick={() => setLoginMethod("otp")}
              className={`cursor-pointer rounded-lg py-1.5 text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 ${
                loginMethod === "otp"
                  ? "bg-[#FACC15] text-slate-950 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Smartphone className="h-3.5 w-3.5" />
              <span>{tr("SMS-код", "Бо SMS-код", "SMS Code")}</span>
            </button>
            <button
              type="button"
              onClick={() => setLoginMethod("password")}
              className={`cursor-pointer rounded-lg py-1.5 text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 ${
                loginMethod === "password"
                  ? "bg-[#FACC15] text-slate-950 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Lock className="h-3.5 w-3.5" />
              <span>{tr("Пароль", "Бо рамз", "Password")}</span>
            </button>
          </div>

          {/* Phone Number Input (Primary) */}
          <div className="space-y-1.5">
            <label
              htmlFor="v7-login-phone"
              className="block text-[11px] font-semibold tracking-wide text-slate-300"
            >
              {tr("Номер мобильного телефона", "Рақами телефони мобилӣ", "Mobile Phone Number")}
            </label>
            <div className="relative flex items-center">
              <Phone className="pointer-events-none absolute left-3.5 h-4 w-4 text-slate-400" />
              <input
                id="v7-login-phone"
                type="tel"
                required
                placeholder="+992 92 700 0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] pr-4 pl-10 text-xs text-white placeholder:text-slate-500 transition-all outline-none focus:border-[#FACC15]/70 focus:bg-white/[0.07] focus:ring-2 focus:ring-[#FACC15]/20 font-mono"
              />
            </div>
            <p className="text-[10px] text-slate-400">
              {loginMethod === "otp"
                ? tr("На этот номер поступит SMS с кодом подтверждения", "Ба ин рақам SMS бо рамзи тасдиқ фиристода мешавад", "A verification SMS code will be sent to this number")
                : tr("Введите пароль от подтверждённого профиля", "Рамзи ҳуҷраи тасдиқшударо ворид кунед", "Enter password for your verified account")}
            </p>
          </div>

          {/* Password field if loginMethod === 'password' */}
          {loginMethod === "password" && (
            <div className="space-y-1.5">
              <label
                htmlFor="v7-login-password"
                className="block text-[11px] font-semibold tracking-wide text-slate-300"
              >
                {tr("Пароль", "Рамз", "Password")}
              </label>
              <div className="relative flex items-center">
                <Lock className="pointer-events-none absolute left-3.5 h-4 w-4 text-slate-400" />
                <input
                  id="v7-login-password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] pr-10 pl-10 text-xs text-white placeholder:text-slate-500 transition-all outline-none focus:border-[#FACC15]/70 focus:bg-white/[0.07] focus:ring-2 focus:ring-[#FACC15]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 cursor-pointer text-slate-400 transition-colors hover:text-white"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Remember me & toggle between SMS code / Password */}
          <div className="flex items-center justify-between pt-0.5 text-xs">
            <label className="inline-flex cursor-pointer items-center gap-2 text-slate-300">
              <button
                type="button"
                role="checkbox"
                aria-checked={rememberMe}
                onClick={() => setRememberMe((v) => !v)}
                className={`flex h-4 w-4 items-center justify-center rounded-[5px] border transition-colors ${
                  rememberMe
                    ? "border-[#FACC15] bg-[#FACC15] text-slate-950"
                    : "border-white/20 bg-white/5 text-transparent"
                }`}
              >
                <Check className="h-3 w-3 stroke-[3]" />
              </button>
              <span className="text-[11px] text-slate-300">
                {tr("Запомнить меня", "Маро дар хотир гир", "Remember me")}
              </span>
            </label>

            {loginMethod === "password" ? (
              <button
                type="button"
                onClick={() => {
                  setLoginMethod("otp");
                  requestPhoneOtp(phone);
                }}
                className="cursor-pointer text-[11px] font-medium text-slate-400 transition-colors hover:text-[#FACC15]"
              >
                {tr("Войти по коду из SMS", "Бо рамзи SMS ворид шудан", "Sign in via SMS code")}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setLoginMethod("password")}
                className="cursor-pointer text-[11px] font-medium text-slate-400 transition-colors hover:text-[#FACC15]"
              >
                {tr("Войти с паролем", "Бо рамз ворид шудан", "Use password")}
              </button>
            )}
          </div>

          {/* Primary Sign In CTA Button */}
          <button
            type="submit"
            disabled={loading}
            style={ctaButtonStyle}
            className="group relative flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl text-xs font-extrabold tracking-wide transition-transform active:scale-[0.99] disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{tr("Отправка...", "Дар ҳоли ирсол...", "Processing...")}</span>
              </>
            ) : loginMethod === "otp" ? (
              <>
                <Smartphone className="h-4 w-4" />
                <span>{tr("Получить SMS-код и войти", "Гирифтани SMS-код ва воридшавӣ", "Get SMS Code & Sign In")}</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </>
            ) : (
              <>
                <span>{tr("Войти в кабинет", "Воридшавӣ ба ҳуҷра", "Sign In to Cabinet")}</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>

          {/* Tahoe Frosted Trust & Anti-Fraud Notice */}
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] p-2.5 text-[11px] text-emerald-300 flex items-start gap-2 leading-relaxed">
            <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              {tr(
                "Авторизация только по подтверждённому номеру телефона (+992) для защиты от спама и мошенников. Привязка Google и Apple доступна в профиле.",
                "Воридшавӣ танҳо бо рақами тасдиқшудаи телефон (+992) барои пешгирии қаллобон. Пайвасти Google ва Apple дар ҳуҷраи шахсӣ дастрас аст.",
                "Phone authorization only (+992) to prevent fraud. Linking Google & Apple is available in profile settings."
              )}
            </span>
          </div>

          {/* Switch to Sign Up */}
          <p className="pt-1 text-center text-xs text-slate-400">
            {tr("Ещё нет аккаунта?", "Ҳоло ҳисоб надоред?", "Don't have an account?")}{" "}
            <button
              type="button"
              onClick={() => triggerModeSwitch("register")}
              className={`cursor-pointer font-bold ${accentTextClass} hover:underline`}
            >
              {tr("Зарегистрироваться", "Бақайдгирӣ", "Sign Up")}
            </button>
          </p>
        </form>
      ) : (
        /* ==================== CREATE ACCOUNT FORM ==================== */
        <form onSubmit={handleRegisterSubmit} className="space-y-3">
          {/* Compact 3-Segment Role Selector for Maskani */}
          <div className="grid grid-cols-3 gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] p-1">
            {(
              [
                { id: "user", label: tr("Частное лицо", "Шахсӣ", "Buyer / Owner") },
                { id: "realtor", label: tr("Риелтор", "Риэлтор", "Realtor") },
                { id: "developer", label: tr("Застройщик", "Сохтмончӣ", "Developer") },
              ] as const
            ).map((r) => {
              const active = role === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r.id)}
                  className={`cursor-pointer rounded-lg py-1.5 text-[11px] font-bold transition-all ${
                    active
                      ? "bg-[#FACC15] text-slate-950 shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {r.label}
                </button>
              );
            })}
          </div>

          {/* Full Name */}
          <div className="space-y-1">
            <label
              htmlFor="v7-reg-name"
              className="block text-[11px] font-semibold tracking-wide text-slate-300"
            >
              {tr("Имя и фамилия", "Ном ва насаб", "Full Name")}
            </label>
            <div className="relative flex items-center">
              <User className="pointer-events-none absolute left-3.5 h-4 w-4 text-slate-400" />
              <input
                id="v7-reg-name"
                type="text"
                required
                placeholder={tr("Дилшод Назаров", "Дилшод Назаров", "Alex Johnson")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-10 w-full rounded-xl border border-white/10 bg-white/[0.04] pr-4 pl-10 text-xs text-white placeholder:text-slate-500 transition-all outline-none focus:border-[#FACC15]/70 focus:bg-white/[0.07]"
              />
            </div>
          </div>

          {/* Optional Agency Name for Realtor */}
          {role === "realtor" && (
            <div className="space-y-1">
              <label
                htmlFor="v7-reg-agency"
                className="block text-[11px] font-semibold tracking-wide text-slate-300"
              >
                {tr("Агентство недвижимости", "Агентии амвол", "Agency Name")}
              </label>
              <div className="relative flex items-center">
                <Building2 className="pointer-events-none absolute left-3.5 h-4 w-4 text-slate-400" />
                <input
                  id="v7-reg-agency"
                  type="text"
                  placeholder={tr("Сугд-Инвест Недвижимость", "Суғд-Инвест", "Sughd Realty Agency")}
                  value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
                  className="h-10 w-full rounded-xl border border-white/10 bg-white/[0.04] pr-4 pl-10 text-xs text-white placeholder:text-slate-500 transition-all outline-none focus:border-[#FACC15]/70 focus:bg-white/[0.07]"
                />
              </div>
            </div>
          )}

          {/* Email & Phone Row */}
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <div className="space-y-1">
              <label
                htmlFor="v7-reg-email"
                className="block text-[11px] font-semibold tracking-wide text-slate-300"
              >
                {tr("Email адрес", "Email суроға", "Email Address")}
              </label>
              <div className="relative flex items-center">
                <Mail className="pointer-events-none absolute left-3 h-3.5 w-3.5 text-slate-400" />
                <input
                  id="v7-reg-email"
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-10 w-full rounded-xl border border-white/10 bg-white/[0.04] pr-3 pl-9 text-xs text-white placeholder:text-slate-500 transition-all outline-none focus:border-[#FACC15]/70 focus:bg-white/[0.07]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label
                htmlFor="v7-reg-phone"
                className="block text-[11px] font-semibold tracking-wide text-slate-300"
              >
                {tr("Телефон (SMS)", "Телефон (SMS)", "Phone Number")}
              </label>
              <div className="relative flex items-center">
                <Phone className="pointer-events-none absolute left-3 h-3.5 w-3.5 text-slate-400" />
                <input
                  id="v7-reg-phone"
                  type="tel"
                  required
                  placeholder="+992 92 700 0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-10 w-full rounded-xl border border-white/10 bg-white/[0.04] pr-3 pl-9 text-xs text-white placeholder:text-slate-500 transition-all outline-none focus:border-[#FACC15]/70 focus:bg-white/[0.07]"
                />
              </div>
            </div>
          </div>

          {/* City Selector */}
          <div className="space-y-1">
            <label
              htmlFor="v7-reg-city"
              className="block text-[11px] font-semibold tracking-wide text-slate-300"
            >
              {tr("Город / Регион", "Шаҳр / Минтақа", "City / Region")}
            </label>
            <div className="relative flex items-center">
              <MapPin className="pointer-events-none absolute left-3.5 h-3.5 w-3.5 text-slate-400" />
              <select
                id="v7-reg-city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="h-10 w-full appearance-none rounded-xl border border-white/10 bg-[#171721] pr-8 pl-9 text-xs text-white transition-all outline-none focus:border-[#FACC15]/70"
              >
                {SOGD_CITIES.map((c) => (
                  <option key={c.value} value={c.value} className="bg-[#14141D] text-white">
                    {language === "tg"
                      ? c.nameTj
                      : language === "en"
                        ? c.nameEn || c.nameRu
                        : c.nameRu}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 2-Column Password & Confirm Password (1:1 as in IMG_5893.MP4 frame 2.20s) */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="space-y-1">
              <label
                htmlFor="v7-reg-pass"
                className="block text-[11px] font-semibold tracking-wide text-slate-300"
              >
                {tr("Пароль", "Рамз", "Password")}
              </label>
              <div className="relative flex items-center">
                <Lock className="pointer-events-none absolute left-3 h-3.5 w-3.5 text-slate-400" />
                <input
                  id="v7-reg-pass"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-10 w-full rounded-xl border border-white/10 bg-white/[0.04] pr-8 pl-8 text-xs text-white placeholder:text-slate-500 transition-all outline-none focus:border-[#FACC15]/70 focus:bg-white/[0.07]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2.5 cursor-pointer text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label
                htmlFor="v7-reg-confirm"
                className="block text-[11px] font-semibold tracking-wide text-slate-300"
              >
                {tr("Повтор пароля", "Такрори рамз", "Confirm Password")}
              </label>
              <div className="relative flex items-center">
                <Lock className="pointer-events-none absolute left-3 h-3.5 w-3.5 text-slate-400" />
                <input
                  id="v7-reg-confirm"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  minLength={8}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-10 w-full rounded-xl border border-white/10 bg-white/[0.04] pr-8 pl-8 text-xs text-white placeholder:text-slate-500 transition-all outline-none focus:border-[#FACC15]/70 focus:bg-white/[0.07]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute right-2.5 cursor-pointer text-slate-400 hover:text-white"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-3.5 w-3.5" />
                  ) : (
                    <Eye className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Terms & Privacy Policy Checkbox */}
          <label className="inline-flex cursor-pointer items-center gap-2 pt-0.5 text-xs text-slate-300">
            <button
              type="button"
              role="checkbox"
              aria-checked={agreeTerms}
              onClick={() => setAgreeTerms((v) => !v)}
              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[5px] border transition-colors ${
                agreeTerms
                  ? "border-[#FACC15] bg-[#FACC15] text-slate-950"
                  : "border-white/20 bg-white/5 text-transparent"
              }`}
            >
              <Check className="h-3 w-3 stroke-[3]" />
            </button>
            <span className="text-[11px] text-slate-300">
              {tr(
                "Я согласен с Условиями и Политикой конфиденциальности",
                "Ман бо Шартҳо ва Сиёсати махфият розӣ ҳастам",
                "I agree to the Terms & Privacy Policy"
              )}
            </span>
          </label>

          {/* Primary Create Account CTA Button */}
          <button
            type="submit"
            disabled={loading}
            style={ctaButtonStyle}
            className="group relative flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl text-xs font-extrabold tracking-wide transition-transform active:scale-[0.99] disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{tr("Создание...", "Сохта шуда истодааст...", "Creating Account...")}</span>
              </>
            ) : (
              <>
                <span>{tr("Создать аккаунт", "Сохтани ҳисоб", "Create Account")}</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>

          {/* Tahoe Frosted Anti-Fraud Notice */}
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] p-2.5 text-[11px] text-emerald-300 flex items-start gap-2 leading-relaxed">
            <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              {tr(
                "Все объявления привязываются к подтверждённому номеру телефона (+992). Привязка аккаунтов Google и Apple доступна в профиле.",
                "Ҳамаи эълонҳо ба рақами тасдиқшудаи телефон (+992) пайваст мешаванд. Пайвасти Google ва Apple дар ҳуҷраи шахсӣ дастрас аст.",
                "All listings are linked to verified phone numbers (+992). Linking Google & Apple is available in your profile."
              )}
            </span>
          </div>

          {/* Switch to Sign In */}
          <p className="pt-0.5 text-center text-xs text-slate-400">
            {tr("Уже есть аккаунт?", "Аллакай ҳисоб доред?", "Already have an account?")}{" "}
            <button
              type="button"
              onClick={() => triggerModeSwitch("login")}
              className={`cursor-pointer font-bold ${accentTextClass} hover:underline`}
            >
              {tr("Войти", "Воридшавӣ", "Sign In")}
            </button>
          </p>
        </form>
      )}
    </ChamferedGlassCard>
  );
}
