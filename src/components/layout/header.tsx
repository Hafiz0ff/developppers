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
  const { t, tDual, language } = useLanguage();
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
    admin: {
      label: language === "en" ? "Administrator" : language === "tg" ? "Мудир" : "Администратор",
      color: "bg-red-500/10 text-red-600 border-red-200",
    },
    developer: {
      label: language === "en" ? "Developer" : language === "tg" ? "Ширкати сохтмонӣ" : "Застройщик",
      color: "bg-blue-500/10 text-blue-600 border-blue-200",
    },
    realtor: {
      label: language === "en" ? "Realtor" : language === "tg" ? "Маклер" : "Риелтор",
      color: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
    },
    user: {
      label: language === "en" ? "User" : language === "tg" ? "Корбар" : "Пользователь",
      color: "bg-muted text-muted-foreground",
    },
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userRole = (session?.user as any)?.role || "user";
  const roleInfo = roleLabels[userRole] || roleLabels.user;

  const navItems = [
    { href: "/#new-buildings", icon: Building2, label: t.nav.newBuildings },
    { href: "/#classifieds", icon: Home, label: t.nav.resale },
    { href: "/#houses", icon: null, label: t.nav.houses },
    { href: "/map", icon: MapPin, label: t.nav.map },
    {
      href: "/compare",
      icon: ArrowLeftRight,
      label: t.nav.compare,
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
        <div className="max-w-7xl mx-auto h-16 px-3 sm:px-4 lg:px-5 flex items-center justify-between gap-1.5 sm:gap-3 rounded-2xl pointer-events-auto relative transition-all duration-300 bg-white/[0.025] backdrop-blur-2xl backdrop-saturate-150 border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.20),inset_0_1px_1.5px_rgba(255,255,255,0.35)]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-2.5 shrink-0 group">
            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/25 group-hover:scale-105 transition-transform duration-300">
              <Building2 className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold tracking-tight text-base sm:text-lg leading-tight text-white flex items-center gap-0.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]">
                MASKANI<span className="text-emerald-400 text-xs font-bold">.TJ</span>
              </span>
              <span className="text-[10px] text-white/90 uppercase tracking-wider font-semibold drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)] hidden 2xl:block">
                {t.nav.subtitle}
              </span>
            </div>
          </Link>

          {/* Navigation Links with Dynamic Underline & Forward Scale */}
          <nav
            onMouseLeave={() => setHoveredNav(null)}
            className="hidden lg:flex items-center gap-0 p-1 rounded-2xl bg-white/[0.025] border border-white/15 text-xs font-semibold backdrop-blur-md shrink-0"
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
                  className="relative px-1 xl:px-1.5 2xl:px-2 py-1 flex items-center select-none group whitespace-nowrap text-[11px] xl:text-xs"
                >
                  <motion.div
                    whileHover={{ scale: 1.05, y: -1 }}
                    transition={{ type: "spring", stiffness: 450, damping: 25 }}
                    className={`relative z-10 flex items-center gap-1 transition-colors duration-200 ${
                      isActive
                        ? "text-emerald-300 font-bold drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                        : "text-white font-semibold drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)] group-hover:text-white"
                    }`}
                  >
                    {Icon && (
                      <Icon
                        className={`h-3.5 w-3.5 transition-colors ${
                          isActive
                            ? "text-emerald-300 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                            : "text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)] group-hover:text-emerald-300"
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
                      className="absolute inset-0 rounded-xl bg-white/15 backdrop-blur-md shadow-xs border border-white/25 -z-0"
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
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {/* Language Selector */}
            <LanguageSwitcher />

            {/* Currency Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex h-8 box-border items-center gap-1 px-2 sm:px-2.5 rounded-xl border border-white/15 bg-white/[0.05] hover:bg-white/10 active:bg-white/15 backdrop-blur-xl text-white text-xs font-bold shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)] transition-all outline-hidden cursor-pointer shrink-0">
                <span>{currency}</span>
                <ChevronDown className="h-3 w-3 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 p-1.5 rounded-2xl bg-white/[0.04] backdrop-blur-3xl backdrop-saturate-150 shadow-[0_20px_50px_rgba(0,0,0,0.25),inset_0_1px_1.5px_rgba(255,255,255,0.4)] border border-white/20 z-50 text-white ring-0">
                <DropdownMenuItem
                  onClick={() => setCurrency("TJS")}
                  className={`cursor-pointer text-xs flex items-center justify-between px-3 py-2 rounded-xl font-semibold transition-all ${
                    currency === "TJS"
                      ? "text-white bg-emerald-500/25 border border-emerald-400/50 font-bold shadow-[0_0_12px_rgba(16,185,129,0.35),inset_0_1px_1px_rgba(255,255,255,0.3)]"
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
                      ? "text-white bg-emerald-500/25 border border-emerald-400/50 font-bold shadow-[0_0_12px_rgba(16,185,129,0.35),inset_0_1px_1px_rgba(255,255,255,0.3)]"
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
                className="relative flex h-8 w-8 box-border items-center justify-center rounded-xl border border-white/15 bg-white/[0.05] hover:bg-white/10 active:bg-white/15 backdrop-blur-xl text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)] transition-all cursor-pointer"
                title={t.nav.compare}
                aria-label={t.nav.compare}
              >
                <ArrowLeftRight className="h-3.5 w-3.5 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]" />
                {compareCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-emerald-500 text-white font-bold text-[9px] min-w-[16px] h-[16px] rounded-full flex items-center justify-center px-0.5 shadow-[0_0_8px_rgba(16,185,129,0.8)]">
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
                  className="hidden sm:inline-flex h-8 box-border items-center justify-center px-2 xl:px-2.5 rounded-xl border border-white/20 bg-white/[0.06] hover:bg-white/15 active:bg-white/20 text-white font-bold backdrop-blur-xl text-xs cursor-pointer shadow-[inset_0_1px_1px_rgba(255,255,255,0.35)] drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)] transition-all select-none whitespace-nowrap"
                >
                  <span>{t.nav.postAd}</span>
                </button>
              </Link>
            </motion.div>

            {/* Auth Button or User Profile */}
            {isPending ? (
              <div className="h-8 w-20 rounded-xl bg-white/20 animate-pulse backdrop-blur-md shrink-0" />
            ) : session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex h-8 box-border items-center gap-2 outline-hidden px-2 rounded-xl border border-white/25 bg-white/12 hover:bg-white/20 backdrop-blur-xl text-white transition-colors cursor-pointer shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] shrink-0">
                  <Avatar className="h-6 w-6 border border-white/30">
                    <AvatarImage src={session.user.image || undefined} />
                    <AvatarFallback className="bg-emerald-600 text-white font-bold text-xs">
                      {session.user.name?.slice(0, 2).toUpperCase() || "УЗ"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden lg:flex flex-col text-left text-xs">
                    <span className="font-semibold leading-tight line-clamp-1 max-w-[120px] text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]">
                      {session.user.name}
                    </span>
                    <span className="text-[10px] text-white/80 drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]">
                      {roleInfo.label}
                    </span>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 p-1.5 rounded-2xl bg-white/[0.07] backdrop-blur-3xl backdrop-saturate-150 shadow-[0_20px_50px_rgba(0,0,0,0.25),inset_0_1px_1.5px_rgba(255,255,255,0.4)] border border-white/30 z-50 text-white ring-0">
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
                className="flex h-8 box-border items-center gap-1.5 px-2 xl:px-2.5 rounded-xl bg-emerald-500/25 hover:bg-emerald-500/40 active:bg-emerald-500/50 backdrop-blur-xl border border-emerald-400/50 text-white font-bold text-xs shadow-[0_8px_24px_rgba(16,185,129,0.30),inset_0_1px_1.5px_rgba(255,255,255,0.45)] transition-all cursor-pointer drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)] shrink-0 whitespace-nowrap"
              >
                <LogIn className="h-3.5 w-3.5 text-emerald-300 drop-shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
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
