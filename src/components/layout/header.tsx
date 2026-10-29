"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCurrency } from "@/context/currency-context";
import { useLanguage } from "@/context/language-context";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { AuthModal } from "@/components/auth/auth-modal";
import { useSession, signOut } from "@/lib/auth-client";
import {
  Building2,
  PlusCircle,
  LogIn,
  LogOut,
  User,
  Home,
  ShieldCheck,
  Briefcase,
  ChevronDown,
  TrendingUp,
  Users,
  Check,
  MapPin,
  ArrowLeftRight,
} from "lucide-react";
import { useCompare } from "@/context/compare-context";


export function Header() {
  const pathname = usePathname();
  const { currency, setCurrency } = useCurrency();
  const { t, tDual } = useLanguage();
  const { compareCount } = useCompare();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "register">("login");
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { data: session, isPending } = useSession();

  const handleOpenAuth = (tab: "login" | "register") => {
    setAuthModalTab(tab);
    setAuthModalOpen(true);
  };

  const roleLabels: Record<string, { label: string; color: string }> = {
    admin: { label: tDual("Администратор", "Мудир"), color: "bg-red-500/10 text-red-600 border-red-200" },
    developer: {
      label: tDual("Застройщик", "Ширкати сохтмонӣ"),
      color: "bg-blue-500/10 text-blue-600 border-blue-200",
    },
    realtor: {
      label: tDual("Риелтор", "Маклер"),
      color: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
    },
    user: { label: tDual("Пользователь", "Корбар"), color: "bg-muted text-muted-foreground" },
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userRole = (session?.user as any)?.role || "user";
  const roleInfo = roleLabels[userRole] || roleLabels.user;

  const navItems = [
    { href: "/#new-buildings", icon: Building2, label: t.nav.newBuildings },
    { href: "/#classifieds", icon: Home, label: t.nav.resale },
    { href: "/#houses", icon: null, label: t.nav.houses },
    { href: "/map", icon: MapPin, label: tDual("Карта", "Харита") },
    {
      href: "/compare",
      icon: ArrowLeftRight,
      label: tDual("Сравнение", "Муқоиса"),
      badge: compareCount > 0 ? compareCount : null,
    },
    { href: "/developers", icon: Briefcase, label: t.nav.developers },
  ];

  // Active section or hovered item determination for dynamic underline
  const activeHref = hoveredNav ?? (
    pathname === "/map" ? "/map" :
    pathname === "/compare" ? "/compare" :
    pathname?.startsWith("/developers") ? "/developers" :
    pathname === "/" ? "/#new-buildings" :
    null
  );

  const isHome = pathname === "/";

  return (
    <>
      <header className={`sticky top-0 z-50 w-full pt-2.5 sm:pt-3 pb-2 px-3 sm:px-6 pointer-events-none transition-all duration-300 ${isHome ? "-mb-20 sm:-mb-22" : ""}`}>
        <div className={`max-w-7xl mx-auto h-16 px-3 sm:px-4 lg:px-5 flex items-center justify-between gap-1.5 sm:gap-3 rounded-2xl pointer-events-auto relative transition-all duration-300 ${
          isScrolled
            ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/60 dark:border-white/15 shadow-[0_12px_36px_rgba(0,0,0,0.08),inset_0_1px_1.5px_rgba(255,255,255,0.9)]"
            : "bg-white/[0.06] backdrop-blur-2xl border border-white/25 shadow-[0_20px_50px_rgba(0,0,0,0.25),inset_0_1px_1.5px_rgba(255,255,255,0.4)]"
        }`}>
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-2.5 shrink-0 group">
            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/25 group-hover:scale-105 transition-transform duration-300">
              <Building2 className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className={`font-extrabold tracking-tight text-base sm:text-lg leading-tight flex items-center gap-0.5 transition-colors ${
                isScrolled ? "text-slate-900 dark:text-white" : "text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
              }`}>
                MASKANI<span className="text-emerald-500 text-xs font-bold">.TJ</span>
              </span>
              <span className={`text-[10px] uppercase tracking-wider font-semibold hidden sm:block transition-colors ${
                isScrolled ? "text-slate-500 dark:text-slate-400" : "text-white/85 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
              }`}>
                {tDual("Недвижимость Таджикистана", "Амволи ғайриманқули Тоҷикистон")}
              </span>
            </div>
          </Link>

          {/* Navigation Links with Dynamic Underline & Forward Scale */}
          <nav
            onMouseLeave={() => setHoveredNav(null)}
            className={`hidden lg:flex items-center gap-0 p-1 rounded-2xl border text-xs font-semibold backdrop-blur-md shrink transition-colors ${
              isScrolled
                ? "bg-slate-100/80 dark:bg-white/[0.06] border-slate-200/80 dark:border-white/15"
                : "bg-white/[0.07] border-white/20"
            }`}
          >
            {navItems.map((item) => {
              const isHovered = hoveredNav === item.href;
              const isActive = activeHref === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onMouseEnter={() => setHoveredNav(item.href)}
                  className="relative px-2 xl:px-2.5 py-1.5 flex items-center select-none group whitespace-nowrap"
                >
                  <motion.div
                    whileHover={{ scale: 1.05, y: -1 }}
                    transition={{ type: "spring", stiffness: 450, damping: 25 }}
                    className={`relative z-10 flex items-center gap-1 transition-colors duration-200 ${
                      isActive
                        ? isScrolled
                          ? "text-emerald-600 dark:text-emerald-400 font-bold"
                          : "text-emerald-300 font-bold drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                        : isScrolled
                        ? "text-slate-700 dark:text-slate-200 font-semibold group-hover:text-slate-900 dark:group-hover:text-white"
                        : "text-white font-semibold drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] group-hover:text-white"
                    }`}
                  >
                    {Icon && (
                      <Icon
                        className={`h-3.5 w-3.5 transition-colors ${
                          isActive
                            ? isScrolled
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-emerald-300 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                            : isScrolled
                            ? "text-slate-600 dark:text-slate-300 group-hover:text-emerald-600"
                            : "text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] group-hover:text-emerald-300"
                        }`}
                      />
                    )}
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full tabular-nums shadow-xs">
                        {item.badge}
                      </span>
                    )}
                  </motion.div>

                  {/* Soft Frosted Glass Hover Backing */}
                  {isHovered && (
                    <motion.div
                      layoutId="header-nav-hover-bg"
                      transition={{ type: "spring", stiffness: 450, damping: 32 }}
                      className={`absolute inset-0 rounded-xl backdrop-blur-md shadow-xs border -z-0 ${
                        isScrolled
                          ? "bg-white/80 dark:bg-white/15 border-slate-200/60 dark:border-white/25"
                          : "bg-white/15 border-white/25"
                      }`}
                    />
                  )}

                  {/* Dynamic Underline adapting to the exact length of the word */}
                  {isActive && (
                    <motion.div
                      layoutId="header-nav-underline"
                      transition={{ type: "spring", stiffness: 450, damping: 32 }}
                      className="absolute bottom-0.5 left-2 right-2 h-[2.5px] rounded-full bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)] z-20"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Controls: Language, Currency, Add Button, Auth */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Language Selector */}
            <LanguageSwitcher isScrolled={isScrolled} />

            {/* Currency Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border backdrop-blur-xl text-xs font-bold transition-all outline-hidden cursor-pointer shrink-0 ${
                isScrolled
                  ? "text-slate-700 bg-slate-100/80 hover:bg-slate-200/80 active:bg-slate-200 border-slate-200/80 shadow-xs"
                  : "text-white border-white/25 bg-white/12 hover:bg-white/20 active:bg-white/25 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
              }`}>
                <span>{currency}</span>
                <ChevronDown className={`h-3 w-3 ${isScrolled ? "text-slate-600" : "text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"}`} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 p-1.5 rounded-2xl bg-slate-900/85 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_1.5px_rgba(255,255,255,0.25)] border border-white/20 z-50 text-white">
                <DropdownMenuItem
                  onClick={() => setCurrency("TJS")}
                  className={`cursor-pointer text-xs flex items-center justify-between px-3 py-2 rounded-xl font-semibold transition-all ${
                    currency === "TJS"
                      ? "text-white bg-emerald-500/35 border border-emerald-400/60 font-bold shadow-[0_0_12px_rgba(16,185,129,0.35),inset_0_1px_1px_rgba(255,255,255,0.3)]"
                      : "text-white/90 hover:text-white hover:bg-white/15 focus:text-white focus:bg-white/15"
                  }`}
                >
                  <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">TJS (Сомонӣ)</span>
                  {currency === "TJS" && <Check className="h-3.5 w-3.5 text-emerald-300 drop-shadow-[0_0_6px_rgba(52,211,153,0.9)]" />}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setCurrency("USD")}
                  className={`cursor-pointer text-xs flex items-center justify-between px-3 py-2 rounded-xl font-semibold transition-all mt-1 ${
                    currency === "USD"
                      ? "text-white bg-emerald-500/35 border border-emerald-400/60 font-bold shadow-[0_0_12px_rgba(16,185,129,0.35),inset_0_1px_1px_rgba(255,255,255,0.3)]"
                      : "text-white/90 hover:text-white hover:bg-white/15 focus:text-white focus:bg-white/15"
                  }`}
                >
                  <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">USD (Доллар $)</span>
                  {currency === "USD" && <Check className="h-3.5 w-3.5 text-emerald-300 drop-shadow-[0_0_6px_rgba(52,211,153,0.9)]" />}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Compare Link / Icon */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="shrink-0">
              <Link
                href="/compare"
                className={`relative p-2 rounded-xl border backdrop-blur-xl transition-all flex items-center justify-center cursor-pointer ${
                  isScrolled
                    ? "text-slate-700 bg-slate-100/80 hover:bg-slate-200/80 active:bg-slate-200 border-slate-200/80 shadow-xs"
                    : "text-white border-white/25 bg-white/12 hover:bg-white/20 active:bg-white/25 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
                }`}
                title={tDual("Сравнение объектов", "Муқоисаи амвол")}
                aria-label={tDual("Сравнение объектов", "Муқоисаи амвол")}
              >
                <ArrowLeftRight className={`h-4 w-4 ${isScrolled ? "text-slate-700" : "text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"}`} />
                {compareCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white font-bold text-[10px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 shadow-[0_0_8px_rgba(16,185,129,0.8)]">
                    {compareCount}
                  </span>
                )}
              </Link>
            </motion.div>

            {/* Post Ad Button */}
            <motion.div whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: 0.97 }} className="shrink-0">
              <Link href={session ? "/classifieds/new" : "#"}>
                <button
                  type="button"
                  onClick={(e) => {
                    if (!session) {
                      e.preventDefault();
                      handleOpenAuth("login");
                    }
                  }}
                  className={`hidden sm:inline-flex items-center justify-center px-3 py-1.5 rounded-xl border font-bold backdrop-blur-xl text-xs cursor-pointer transition-all select-none whitespace-nowrap ${
                    isScrolled
                      ? "text-slate-800 bg-slate-100/90 hover:bg-slate-200/90 active:bg-slate-200 border-slate-200 shadow-xs"
                      : "text-white border-white/30 bg-white/15 hover:bg-white/25 active:bg-white/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.35)] drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
                  }`}
                >
                  <span>{t.nav.postAd}</span>
                </button>
              </Link>
            </motion.div>

            {/* Auth Button or User Profile */}
            {isPending ? (
              <div className="h-9 w-20 rounded-xl bg-white/20 animate-pulse backdrop-blur-md shrink-0" />
            ) : session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className={`flex items-center gap-2 outline-hidden px-2 py-1.5 rounded-xl border backdrop-blur-xl transition-colors cursor-pointer shrink-0 ${
                  isScrolled
                    ? "text-slate-700 bg-slate-100/80 hover:bg-slate-200/80 border-slate-200/80 shadow-xs"
                    : "text-white border-white/25 bg-white/12 hover:bg-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]"
                }`}>
                  <Avatar className="h-7 w-7 border border-white/30">
                    <AvatarImage src={session.user.image || undefined} />
                    <AvatarFallback className="bg-emerald-600 text-white font-bold text-xs">
                      {session.user.name?.slice(0, 2).toUpperCase() || "УЗ"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden lg:flex flex-col text-left text-xs">
                    <span className={`font-semibold leading-tight line-clamp-1 max-w-[120px] ${
                      isScrolled ? "text-slate-800 dark:text-white" : "text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
                    }`}>
                      {session.user.name}
                    </span>
                    <span className={`text-[10px] ${
                      isScrolled ? "text-slate-500 dark:text-slate-400" : "text-white/80 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
                    }`}>
                      {roleInfo.label}
                    </span>
                  </div>
                  <ChevronDown className={`h-3.5 w-3.5 ${isScrolled ? "text-slate-600" : "text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"}`} />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 p-1.5 rounded-2xl bg-slate-900/85 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_1.5px_rgba(255,255,255,0.25)] border border-white/20 z-50 text-white">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-semibold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">{session.user.name}</p>
                      <p className="text-xs text-white/70 font-mono">
                        {session.user.email}
                      </p>
                      <div className="pt-1">
                        <Badge
                          variant="outline"
                          className="text-[10px] font-medium bg-emerald-500/20 text-emerald-300 border-emerald-400/40"
                        >
                          {roleInfo.label}
                        </Badge>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/15" />
                  <Link href="/profile/crm">
                    <DropdownMenuItem className="cursor-pointer text-white/90 hover:text-white hover:bg-white/15 focus:text-white focus:bg-white/15 rounded-xl font-semibold transition-all">
                      <Users className="mr-2 h-4 w-4 text-emerald-400" />
                      {t.nav.crm}
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/profile/analytics">
                    <DropdownMenuItem className="cursor-pointer text-white/90 hover:text-white hover:bg-white/15 focus:text-white focus:bg-white/15 rounded-xl transition-all">
                      <TrendingUp className="mr-2 h-4 w-4 text-emerald-400" />
                      {t.nav.analytics}
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/profile/settings">
                    <DropdownMenuItem className="cursor-pointer text-white/90 hover:text-white hover:bg-white/15 focus:text-white focus:bg-white/15 rounded-xl transition-all">
                      <User className="mr-2 h-4 w-4 text-white/70" />
                      {t.nav.settings}
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/classifieds">
                    <DropdownMenuItem className="cursor-pointer text-white/90 hover:text-white hover:bg-white/15 focus:text-white focus:bg-white/15 rounded-xl transition-all">
                      <Home className="mr-2 h-4 w-4 text-white/70" />
                      {t.nav.myAds}
                    </DropdownMenuItem>
                  </Link>

                  {userRole === "developer" && (
                    <Link href="/developer-admin">
                      <DropdownMenuItem className="cursor-pointer text-white/90 hover:text-white hover:bg-white/15 focus:text-white focus:bg-white/15 rounded-xl transition-all">
                        <Building2 className="mr-2 h-4 w-4 text-emerald-400" />
                        {t.nav.devCabinet}
                      </DropdownMenuItem>
                    </Link>
                  )}
                  {userRole === "admin" && (
                    <Link href="/developer-admin">
                      <DropdownMenuItem className="cursor-pointer text-white/90 hover:text-white hover:bg-white/15 focus:text-white focus:bg-white/15 rounded-xl transition-all">
                        <ShieldCheck className="mr-2 h-4 w-4 text-red-400" />
                        {t.nav.adminPanel}
                      </DropdownMenuItem>
                    </Link>
                  )}
                  <DropdownMenuSeparator className="bg-white/15" />
                  <DropdownMenuItem
                    onClick={async () => {
                      await signOut();
                      window.location.reload();
                    }}
                    className="cursor-pointer text-red-300 hover:text-red-200 hover:bg-red-500/20 focus:text-red-200 focus:bg-red-500/20 rounded-xl transition-all"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    {t.nav.logout}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleOpenAuth("login")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/25 transition-all cursor-pointer shrink-0 whitespace-nowrap"
              >
                <LogIn className="h-3.5 w-3.5 text-white" />
                <span>{t.nav.login}</span>
              </motion.button>
            )}
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultTab={authModalTab}
      />
    </>
  );
}
