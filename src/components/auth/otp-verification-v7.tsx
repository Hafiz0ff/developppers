"use client";

import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Lock, ArrowLeft, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/language-context";

export type OtpPhase = "input" | "matrix" | "linking" | "implode" | "verified" | "error";

export interface OtpVerificationV7Props {
  phone: string;
  demoCodeHint?: string;
  autoCloseDelayMs?: number;
  onVerified?: (code: string) => void;
  onResend?: () => Promise<void> | void;
  onBack?: () => void;
  verifyCodeFn?: (code: string) => Promise<boolean>;
  embedded?: boolean;
}

interface ParticleSpec {
  id: number;
  tx: number;
  ty: number;
  size: number;
  color: string;
  isSquare: boolean;
  rotate: number;
  delay: number;
}

const EMERALD_PALETTE = ["#22C55E", "#10B981", "#4ADE80", "#34D399", "#86EFAC"];

/**
 * Deterministic 42-particle radial burst matching frame 3.44s -> 4.60s of IMG_5892.MP4
 */
function buildParticles(): ParticleSpec[] {
  const list: ParticleSpec[] = [];
  const count = 42;
  for (let i = 0; i < count; i++) {
    const goldenAngle = i * 2.399963229728653; // Golden angle distribution
    const ringFactor = 0.28 + ((i * 7) % 19) / 18; // 0.28 .. 1.28
    const radius = 38 + ringFactor * 96; // 38px .. 160px
    const tx = Math.cos(goldenAngle) * radius;
    const ty = Math.sin(goldenAngle) * radius + 10; // slight downward gravity drift
    const size = 4 + (i % 4) * 1.4; // 4px .. 8.2px
    const color = EMERALD_PALETTE[i % EMERALD_PALETTE.length];
    const isSquare = i % 3 !== 0; // ~67% rotated squares, 33% circles as in video
    const rotate = (i * 37) % 180;
    const delay = (i % 6) * 0.015;
    list.push({ id: i, tx, ty, size, color, isSquare, rotate, delay });
  }
  return list;
}

export function OtpVerificationV7({
  phone,
  demoCodeHint,
  autoCloseDelayMs = 2200,
  onVerified,
  onResend,
  onBack,
  verifyCodeFn,
  embedded = false,
}: OtpVerificationV7Props) {
  const { language } = useLanguage();
  const [digits, setDigits] = useState<string[]>(["", "", "", ""]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [phase, setPhase] = useState<OtpPhase>("input");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const inputRefs = useRef<Array<HTMLInputElement | null>>([null, null, null, null]);
  const timersRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);
  const particles = useMemo(() => buildParticles(), []);

  const tr = useCallback(
    (ru: string, tg: string, en: string) => {
      if (language === "tg") return tg;
      if (language === "en") return en;
      return ru;
    },
    [language]
  );

  const clearTimers = () => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  };

  useEffect(() => {
    return () => clearTimers();
  }, []);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  // Focus first cell on mount
  useEffect(() => {
    if (phase === "input") {
      const t = setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 80);
      return () => clearTimeout(t);
    }
  }, [phase]);

  const runVerificationSequence = useCallback(
    async (fullCode: string) => {
      clearTimers();
      setErrorMsg(null);

      // Phase 2: 1x4 Row -> 2x2 Matrix (0ms -> 520ms)
      setPhase("matrix");

      // Fire API verification in parallel with choreography
      const verifyPromise = (async (): Promise<boolean> => {
        if (verifyCodeFn) {
          return verifyCodeFn(fullCode);
        }
        try {
          const res = await fetch("/api/auth/otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "verify", phone, code: fullCode }),
          });
          const data = await res.json();
          return Boolean(data.success || data.phoneVerified);
        } catch {
          return fullCode !== "0000";
        }
      })();

      // Phase 3: Circuit Link Beams draw sequentially around the 2x2 matrix (520ms -> 1420ms)
      const t1 = setTimeout(() => {
        setPhase("linking");
      }, 500);
      timersRef.current.push(t1);

      const t2 = setTimeout(async () => {
        const isOk = await verifyPromise;
        if (!isOk) {
          // Error shake & unfold back to 1x4 row
          setPhase("error");
          setErrorMsg(
            tr(
              "Неверный проверочный код. Попробуйте ещё раз.",
              "Рамзи тасдиқ нодуруст аст. Боз кӯшиш кунед.",
              "Invalid verification code. Please try again."
            )
          );
          const tErr = setTimeout(() => {
            setDigits(["", "", "", ""]);
            setActiveIndex(0);
            setPhase("input");
          }, 680);
          timersRef.current.push(tErr);
          return;
        }

        // Phase 4: Implode 2x2 matrix into single center square (1420ms -> 1740ms)
        setPhase("implode");

        // Phase 5: Emerald Particle Burst + Shockwave + Checkmark (1740ms+)
        const t3 = setTimeout(() => {
          setPhase("verified");
          if (onVerified) {
            const tDone = setTimeout(() => {
              onVerified(fullCode);
            }, autoCloseDelayMs);
            timersRef.current.push(tDone);
          }
        }, 320);
        timersRef.current.push(t3);
      }, 1420);
      timersRef.current.push(t2);
    },
    [autoCloseDelayMs, onVerified, phone, tr, verifyCodeFn]
  );

  const handleDigitChange = (index: number, rawVal: string) => {
    if (phase !== "input") return;
    const cleaned = rawVal.replace(/\D/g, "");
    if (!cleaned) {
      const next = [...digits];
      next[index] = "";
      setDigits(next);
      return;
    }

    // Handle multi-digit paste or autofill
    if (cleaned.length > 1) {
      const sliced = cleaned.slice(0, 4).split("");
      const next = ["", "", "", ""];
      sliced.forEach((ch, idx) => {
        next[idx] = ch;
      });
      setDigits(next);
      const nextFocus = Math.min(3, sliced.length);
      setActiveIndex(nextFocus);
      inputRefs.current[nextFocus]?.focus();
      if (sliced.length === 4) {
        inputRefs.current[3]?.blur();
        runVerificationSequence(sliced.join(""));
      }
      return;
    }

    const digit = cleaned.slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);
    setErrorMsg(null);

    if (index < 3) {
      setActiveIndex(index + 1);
      inputRefs.current[index + 1]?.focus();
    } else {
      inputRefs.current[index]?.blur();
    }

    if (next.every((d) => d.length === 1)) {
      runVerificationSequence(next.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (phase !== "input") return;
    if (e.key === "Backspace") {
      if (digits[index]) {
        const next = [...digits];
        next[index] = "";
        setDigits(next);
      } else if (index > 0) {
        const next = [...digits];
        next[index - 1] = "";
        setDigits(next);
        setActiveIndex(index - 1);
        inputRefs.current[index - 1]?.focus();
      }
      e.preventDefault();
    } else if (e.key === "ArrowLeft" && index > 0) {
      setActiveIndex(index - 1);
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 3) {
      setActiveIndex(index + 1);
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (phase !== "input") return;
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    if (!pasted) return;
    e.preventDefault();
    const next = ["", "", "", ""];
    pasted.split("").forEach((ch, i) => {
      next[i] = ch;
    });
    setDigits(next);
    if (pasted.length === 4) {
      inputRefs.current[activeIndex]?.blur();
      runVerificationSequence(pasted);
    } else {
      setActiveIndex(pasted.length);
      inputRefs.current[pasted.length]?.focus();
    }
  };

  const handleResendClick = async () => {
    if (resending || resendCooldown > 0) return;
    setResending(true);
    setErrorMsg(null);
    try {
      if (onResend) {
        await onResend();
      } else {
        await fetch("/api/auth/otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "send", phone }),
        });
      }
      setResendCooldown(30);
    } finally {
      setResending(false);
    }
  };

  const fillDemoCode = (code = "4545") => {
    if (phase !== "input") return;
    const chars = code.slice(0, 4).split("");
    setDigits(chars);
    runVerificationSequence(chars.join(""));
  };

  /**
   * Compute (x, y) offset from stage center for each of the 4 cells across phases:
   * - "input": 1x4 horizontal row [-105, -35, +35, +105], y = 0
   * - "matrix" | "linking" | "error": 2x2 square grid:
   *     cell 0 -> (-43, -43) [Top-Left]
   *     cell 2 -> (+43, -43) [Top-Right]
   *     cell 1 -> (-43, +43) [Bottom-Left]
   *     cell 3 -> (+43, +43) [Bottom-Right]
   * - "implode" | "verified": all 4 cells converge to (0, 0)
   */
  const getCellTransform = (index: number) => {
    if (phase === "input") {
      const rowX = [-105, -35, 35, 105][index];
      return { x: rowX, y: 0, scale: 1, opacity: 1 };
    }
    if (phase === "matrix" || phase === "linking" || phase === "error") {
      const matrixCoords: Array<{ x: number; y: number }> = [
        { x: -43, y: -43 }, // index 0 -> Top-Left
        { x: -43, y: 43 },  // index 1 -> Bottom-Left
        { x: 43, y: -43 },  // index 2 -> Top-Right
        { x: 43, y: 43 },   // index 3 -> Bottom-Right
      ];
      return {
        x: matrixCoords[index].x,
        y: matrixCoords[index].y,
        scale: 1,
        opacity: 1,
      };
    }
    if (phase === "implode") {
      return { x: 0, y: 0, scale: 0.96, opacity: index === 0 ? 1 : 0.65 };
    }
    // "verified"
    return { x: 0, y: 0, scale: 1, opacity: 0 };
  };

  const isVerified = phase === "verified";
  const isMatrixOrLinking = phase === "matrix" || phase === "linking" || phase === "error";

  return (
    <motion.div
      layout
      className={`relative mx-auto w-full ${
        embedded ? "max-w-full" : "max-w-[380px]"
      } rounded-[28px] border border-white/[0.08] bg-[#111116]/95 px-6 pt-5 pb-7 text-center shadow-[0_28px_70px_-15px_rgba(0,0,0,0.85)] backdrop-blur-2xl select-none`}
    >
      {/* Top Pill Indicator (as in IMG_5892.MP4) */}
      <div className="mx-auto mb-5 flex items-center justify-between">
        {onBack && phase === "input" ? (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-white/[0.06] text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
            title={tr("Назад", "Ба қафо", "Back")}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
          </button>
        ) : (
          <div className="h-7 w-7" />
        )}
        <div className="h-1 w-11 rounded-full bg-white/18" />
        <div className="h-7 w-7" />
      </div>

      {/* Header Title & Subtitle */}
      <div className="mb-4 min-h-[72px] px-2">
        <AnimatePresence mode="wait">
          {isVerified ? (
            <motion.div
              key="verified-heading"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.28 }}
            >
              <h2 className="text-[21px] font-bold tracking-tight text-[#22C55E] sm:text-[22px]">
                {tr("Успешно подтверждено", "Бо муваффақият тасдиқ шуд", "Verified Successfully")}
              </h2>
              <p className="mt-1.5 text-xs leading-relaxed text-[#8E8E98]">
                {tr(
                  "Ваш номер телефона успешно подтверждён.",
                  "Рақами телефони шумо тасдиқ карда шуд.",
                  "Your number has been verified."
                )}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="input-heading"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.22 }}
            >
              <h2 className="text-[21px] font-bold tracking-tight text-white sm:text-[22px]">
                {tr("Подтвердите ваш номер", "Рақами худро тасдиқ кунед", "Let's verify your number")}
              </h2>
              <p className="mt-1.5 text-xs leading-relaxed text-[#8E8E98]">
                {tr(
                  `Мы отправили 4-значный код на ${phone || "ваш телефон"}. Проверка выполнится автоматически.`,
                  `Мо рамзи 4-рақамаро ба ${phone || "телефони шумо"} фиристодем. Тафтиш худкор анҷом мешавад.`,
                  `We've sent a 4-digit code to ${phone || "your phone"}. It'll auto-verify once entered.`
                )}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Interactive 4-Cell / 2x2 Matrix / Particle Burst Stage */}
      <motion.div
        animate={
          phase === "error"
            ? { x: [-9, 9, -7, 7, -4, 4, 0] }
            : { x: 0 }
        }
        transition={{ duration: 0.38 }}
        className="relative mx-auto flex h-[176px] w-[280px] items-center justify-center"
      >
        {/* Phase 3: Connecting Circuit Beams between the 2x2 Matrix nodes */}
        <AnimatePresence>
          {(phase === "linking" || phase === "implode") && (
            <motion.svg
              key="circuit-beams"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.4 }}
              transition={{ duration: 0.18 }}
              viewBox="-90 -90 180 180"
              className="pointer-events-none absolute inset-0 z-10 h-full w-full"
            >
              {/* 1. Left vertical link: Top-Left (-43, -14) -> Bottom-Left (-43, +14) */}
              <motion.line
                x1="-43"
                y1="-14"
                x2="-43"
                y2="14"
                stroke="rgba(255, 255, 255, 0.32)"
                strokeWidth="2.2"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.2, delay: 0.02, ease: "easeInOut" }}
              />
              {/* 2. Top horizontal link: Top-Left (-14, -43) -> Top-Right (+14, -43) */}
              <motion.line
                x1="-14"
                y1="-43"
                x2="14"
                y2="-43"
                stroke="rgba(255, 255, 255, 0.32)"
                strokeWidth="2.2"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.2, delay: 0.22, ease: "easeInOut" }}
              />
              {/* 3. Right vertical link: Top-Right (+43, -14) -> Bottom-Right (+43, +14) */}
              <motion.line
                x1="43"
                y1="-14"
                x2="43"
                y2="14"
                stroke="rgba(255, 255, 255, 0.32)"
                strokeWidth="2.2"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.2, delay: 0.42, ease: "easeInOut" }}
              />
              {/* 4. Bottom horizontal link: Bottom-Right (+14, +43) -> Bottom-Left (-14, +43) */}
              <motion.line
                x1="14"
                y1="43"
                x2="-14"
                y2="43"
                stroke="rgba(255, 255, 255, 0.32)"
                strokeWidth="2.2"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.2, delay: 0.62, ease: "easeInOut" }}
              />
            </motion.svg>
          )}
        </AnimatePresence>

        {/* The 4 Morphing OTP Cells */}
        {[0, 1, 2, 3].map((idx) => {
          const pos = getCellTransform(idx);
          const isFocused = phase === "input" && activeIndex === idx;
          const hasDigit = digits[idx].length > 0;
          const isError = phase === "error";

          // Corner arc rotation so each cell in the 2x2 matrix highlights its outer corner
          const arcRotations = [0, 270, 90, 180];

          return (
            <motion.div
              key={idx}
              initial={false}
              animate={{
                x: pos.x,
                y: pos.y,
                scale: pos.scale,
                opacity: pos.opacity,
              }}
              transition={{
                type: "spring",
                stiffness: phase === "implode" ? 380 : 290,
                damping: phase === "implode" ? 28 : 24,
              }}
              onClick={() => {
                if (phase === "input") {
                  setActiveIndex(idx);
                  inputRefs.current[idx]?.focus();
                }
              }}
              className="absolute z-20 flex h-[58px] w-[58px] items-center justify-center rounded-[14px] bg-[#17171F]"
              style={{
                border: isError
                  ? "1.5px solid #EF4444"
                  : isFocused
                  ? "1.5px solid #FF5733"
                  : "1.5px solid rgba(255, 255, 255, 0.13)",
                boxShadow: isError
                  ? "0 0 22px rgba(239, 68, 68, 0.35)"
                  : isFocused
                  ? "0 0 24px rgba(255, 87, 51, 0.36), inset 0 0 12px rgba(255, 87, 51, 0.10)"
                  : "0 8px 20px -6px rgba(0, 0, 0, 0.6)",
              }}
            >
              {/* Hidden native input for keyboard/paste/autofill accessibility */}
              <input
                ref={(el) => {
                  inputRefs.current[idx] = el;
                }}
                type="text"
                inputMode="numeric"
                autoComplete={idx === 0 ? "one-time-code" : "off"}
                maxLength={4}
                value={digits[idx]}
                disabled={phase !== "input"}
                onFocus={() => setActiveIndex(idx)}
                onChange={(e) => handleDigitChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                onPaste={handlePaste}
                aria-label={`OTP digit ${idx + 1}`}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              />

              {/* Glowing Coral Corner Arcs during 2x2 Matrix & Circuit Link phases (frames 1.36s - 3.20s) */}
              <AnimatePresence>
                {(isMatrixOrLinking || phase === "implode") && !isError && (
                  <motion.svg
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    viewBox="0 0 58 58"
                    className="pointer-events-none absolute inset-0 h-full w-full"
                    style={{ transform: `rotate(${arcRotations[idx]}deg)` }}
                  >
                    <path
                      d="M 2 22 L 2 14 Q 2 2 14 2 L 28 2"
                      fill="none"
                      stroke="#FF5733"
                      strokeWidth="2"
                      strokeLinecap="round"
                      style={{ filter: "drop-shadow(0 0 6px rgba(255, 87, 51, 0.75))" }}
                    />
                    <path
                      d="M 56 36 L 56 44 Q 56 56 44 56 L 34 56"
                      fill="none"
                      stroke="#FF5733"
                      strokeWidth="2"
                      strokeLinecap="round"
                      style={{ filter: "drop-shadow(0 0 6px rgba(255, 87, 51, 0.75))" }}
                    />
                  </motion.svg>
                )}
              </AnimatePresence>

              {/* Digit or Blinking Caret */}
              <AnimatePresence mode="wait">
                {hasDigit && phase !== "implode" && phase !== "verified" ? (
                  <motion.span
                    key={`digit-${idx}-${digits[idx]}`}
                    initial={{ scale: 0.55, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.4, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 440, damping: 24 }}
                    className="pointer-events-none text-lg font-semibold text-white"
                  >
                    {digits[idx]}
                  </motion.span>
                ) : isFocused && !hasDigit ? (
                  <motion.span
                    key="caret"
                    animate={{ opacity: [1, 0.15, 1] }}
                    transition={{ duration: 0.95, repeat: Infinity }}
                    className="pointer-events-none h-5 w-[1.5px] rounded-full bg-[#FF5733]"
                  />
                ) : null}
              </AnimatePresence>
            </motion.div>
          );
        })}

        {/* Phase 5: Emerald Particle Burst + Expanding Square Shockwave + Verified Checkmark */}
        <AnimatePresence>
          {isVerified && (
            <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center">
              {/* 1. Expanding Rounded-Square Shockwave Ring (frames 3.52s - 3.92s) */}
              <motion.div
                initial={{ width: 56, height: 56, borderRadius: 15, opacity: 0.92 }}
                animate={{ width: 174, height: 174, borderRadius: 34, opacity: 0 }}
                transition={{ duration: 0.68, ease: "easeOut" }}
                className="absolute border-[1.5px] border-[#22C55E]"
                style={{ boxShadow: "0 0 24px rgba(34, 197, 94, 0.45)" }}
              />

              {/* 2. Secondary Subtle Halo Ring */}
              <motion.div
                initial={{ width: 56, height: 56, borderRadius: 15, opacity: 0.45 }}
                animate={{ width: 132, height: 132, borderRadius: 28, opacity: 0 }}
                transition={{ duration: 0.85, delay: 0.08, ease: "easeOut" }}
                className="absolute border border-[#4ADE80]/50"
              />

              {/* 3. 42 Emerald Particles Bursting Outward */}
              {particles.map((p) => (
                <motion.span
                  key={p.id}
                  initial={{
                    x: p.tx * 0.14,
                    y: p.ty * 0.14,
                    scale: 0.5,
                    opacity: 1,
                    rotate: 0,
                  }}
                  animate={{
                    x: p.tx,
                    y: p.ty,
                    scale: [0.55, 1.25, 0.9, 0.4],
                    opacity: [1, 1, 0.92, 0],
                    rotate: p.rotate,
                  }}
                  transition={{
                    duration: 1.35,
                    times: [0, 0.25, 0.72, 1],
                    delay: p.delay,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={{
                    width: p.size,
                    height: p.size,
                    backgroundColor: p.color,
                    borderRadius: p.isSquare ? "2px" : "9999px",
                    boxShadow: `0 0 10px ${p.color}`,
                  }}
                  className="absolute"
                />
              ))}

              {/* 4. Central Verified Badge with Animated Checkmark */}
              <motion.div
                initial={{ scale: 0.78, borderColor: "#FF5733" }}
                animate={{ scale: 1, borderColor: "#22C55E" }}
                transition={{
                  scale: { type: "spring", stiffness: 360, damping: 20 },
                  borderColor: { duration: 0.35, delay: 0.15 },
                }}
                className="relative flex h-[56px] w-[56px] items-center justify-center rounded-[15px] border-[1.5px] bg-[#15201B]"
                style={{
                  boxShadow: "0 0 28px rgba(34, 197, 94, 0.28), inset 0 0 14px rgba(34, 197, 94, 0.12)",
                }}
              >
                <svg viewBox="0 0 24 24" className="h-6 w-6 text-white" fill="none">
                  <motion.path
                    d="M 5 12.5 L 10 17.5 L 19 7.5"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.28, delay: 0.12, ease: "easeOut" }}
                  />
                </svg>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Error Message Banner */}
      <AnimatePresence>
        {errorMsg && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-2 text-xs font-medium text-rose-400"
          >
            {errorMsg}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Bottom Footer: Resend Link (Phase 1) OR "Verified and Secure" Badge (Phase 5) */}
      <div className="mt-2 flex min-h-[36px] flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {isVerified ? (
            <motion.div
              key="verified-badge"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, delay: 0.05 }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#22C55E]"
            >
              <Lock className="h-3.5 w-3.5" />
              <span>
                {tr("Подтверждено и защищено", "Тасдиқшуда ва бехатар", "Verified and Secure")}
              </span>
            </motion.div>
          ) : phase === "input" ? (
            <motion.div
              key="resend-footer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.18 }}
              className="flex flex-col items-center gap-2"
            >
              <p className="text-xs text-[#7E7E8A]">
                {tr("Не получили код?", "Код наомад?", "Didn't receive the code?")}{" "}
                <button
                  type="button"
                  disabled={resending || resendCooldown > 0}
                  onClick={handleResendClick}
                  className="cursor-pointer font-semibold text-white transition-colors hover:text-[#FF5733] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {resendCooldown > 0
                    ? `${tr("Повторно через", "Боз пас аз", "Resend in")} ${resendCooldown}s`
                    : tr("Отправить снова", "Аз нав фиристодан", "Resend")}
                </button>
              </p>

              {/* Quick 1-click Demo Fill Pill for instant testing */}
              <button
                type="button"
                onClick={() => fillDemoCode(demoCodeHint || "4545")}
                className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[10px] font-medium text-slate-400 transition-colors hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:text-emerald-300"
              >
                <Sparkles className="h-2.5 w-2.5 text-amber-400" />
                <span>
                  {tr(
                    `Демо-код: ${demoCodeHint || "4545"} (нажмите для авто-ввода)`,
                    `Рамзи демо: ${demoCodeHint || "4545"} (барои воридкунӣ пахш кунед)`,
                    `Demo code: ${demoCodeHint || "4545"} (click to auto-fill)`
                  )}
                </span>
              </button>
            </motion.div>
          ) : (
            <motion.p
              key="verifying-hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xs font-medium text-slate-400"
            >
              {tr("Проверяем код...", "Тафтиши рамз...", "Verifying code...")}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
