"use client";

import React, { useState } from "react";
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

  return (
    <>
      <header className="sticky top-0 z-50 w-full pt-2.5 sm:pt-3 pb-2 px-3 sm:px-6 pointer-events-none transition-all duration-300">
        <div className="max-w-7xl mx-auto h-16 px-3.5 sm:px-5 flex items-center justify-between gap-2 sm:gap-4 glass-island rounded-2xl pointer-events-auto relative shadow-[0_16px_36px_-10px_rgba(15,23,42,0.1),0_3px_10px_-2px_rgba(15,23,42,0.04)]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/25 group-hover:scale-105 transition-transform duration-300">
              <Building2 className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold tracking-tight text-lg leading-tight text-emerald-950 dark:text-emerald-100 flex items-center gap-0.5">
                MASKANI<span className="text-emerald-500 text-xs">.TJ</span>
              </span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
                {tDual("Недвижимость Таджикистана", "Амволи ғайриманқули Тоҷикистон")}
              </span>
            </div>
          </Link>

          {/* Navigation Links with Video-Style Dynamic Underline & Forward Scale */}
          <nav
            onMouseLeave={() => setHoveredNav(null)}
            className="hidden lg:flex items-center gap-0.5 p-1 rounded-2xl bg-slate-900/[0.04] dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 text-xs font-semibold backdrop-blur-md"
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
                  className="relative px-3.5 py-2 flex items-center select-none group"
                >
                  <motion.div
                    whileHover={{ scale: 1.06, y: -1 }}
                    transition={{ type: "spring", stiffness: 450, damping: 25 }}
                    className={`relative z-10 flex items-center gap-1.5 transition-colors duration-200 ${
                      isActive
                        ? "text-emerald-950 dark:text-emerald-300 font-bold"
                        : "text-slate-600 dark:text-slate-300 group-hover:text-slate-950 dark:group-hover:text-white font-medium"
                    }`}
                  >
                    {Icon && (
                      <Icon
                        className={`h-3.5 w-3.5 transition-colors ${
                          isActive
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-slate-400 group-hover:text-emerald-600"
                        }`}
                      />
                    )}
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full tabular-nums shadow-xs">
                        {item.badge}
                      </span>
                    )}
                  </motion.div>

                  {/* Soft Frosted Glass Hover Backing */}
                  {isHovered && (
                    <motion.div
                      layoutId="header-nav-hover-bg"
                      transition={{ type: "spring", stiffness: 450, damping: 32 }}
                      className="absolute inset-0 rounded-xl bg-white/85 dark:bg-slate-800/85 shadow-xs border border-slate-200/70 dark:border-white/10 -z-0"
                    />
                  )}

                  {/* Dynamic Underline adapting to the exact length of the word */}
                  {isActive && (
                    <motion.div
                      layoutId="header-nav-underline"
                      transition={{ type: "spring", stiffness: 450, damping: 32 }}
                      className="absolute bottom-0.5 left-3 right-3 h-[2.5px] rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 shadow-[0_2px_8px_rgba(16,185,129,0.55)] z-20"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Controls: Language, Currency, Add Button, Auth */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Language Selector */}
            <LanguageSwitcher />

            {/* Currency Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-pill hover:border-emerald-500/50 hover:text-emerald-700 text-slate-800 dark:text-slate-100 text-xs font-bold transition-all outline-hidden cursor-pointer">
                <span>{currency}</span>
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 p-1.5 rounded-xl bg-white/95 backdrop-blur-xl shadow-xl border border-slate-200/80 z-50">
                <DropdownMenuItem
                  onClick={() => setCurrency("TJS")}
                  className={`cursor-pointer text-xs flex items-center justify-between px-3 py-2 rounded-lg font-semibold transition-colors ${
                    currency === "TJS" ? "text-emerald-700 bg-emerald-50/80 border border-emerald-200/60" : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <span>TJS (Сомонӣ)</span>
                  {currency === "TJS" && <Check className="h-3.5 w-3.5 text-emerald-600" />}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setCurrency("USD")}
                  className={`cursor-pointer text-xs flex items-center justify-between px-3 py-2 rounded-lg font-semibold transition-colors mt-1 ${
                    currency === "USD" ? "text-emerald-700 bg-emerald-50/80 border border-emerald-200/60" : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <span>USD (Доллар $)</span>
                  {currency === "USD" && <Check className="h-3.5 w-3.5 text-emerald-600" />}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Compare Link / Icon */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/compare"
                className="relative p-2 rounded-xl glass-pill text-slate-700 dark:text-slate-200 hover:text-emerald-700 hover:border-emerald-500 transition-all flex items-center justify-center cursor-pointer"
                title={tDual("Сравнение объектов", "Муқоисаи амвол")}
                aria-label={tDual("Сравнение объектов", "Муқоисаи амвол")}
              >
                <ArrowLeftRight className="h-4 w-4" />
                {compareCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-emerald-600 text-white font-bold text-[10px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 shadow-sm">
                    {compareCount}
                  </span>
                )}
              </Link>
            </motion.div>

            {/* Post Ad Button */}
            <motion.div whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: 0.97 }}>
              <Link href={session ? "/classifieds/new" : "#"}>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    if (!session) {
                      e.preventDefault();
                      handleOpenAuth("login");
                    }
                  }}
                  className="hidden sm:flex rounded-xl glass-pill border-emerald-600/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10 gap-1.5 text-xs font-semibold cursor-pointer shadow-xs"
                >
                  <PlusCircle className="h-3.5 w-3.5 text-emerald-600" />
                  {t.nav.postAd}
                </Button>
              </Link>
            </motion.div>

            {/* Auth Button or User Profile */}
            {isPending ? (
              <div className="h-9 w-20 rounded-md bg-muted animate-pulse" />
            ) : session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 outline-hidden p-1 rounded-lg hover:bg-muted/70 transition-colors">
                  <Avatar className="h-8 w-8 border border-border">
                    <AvatarImage src={session.user.image || undefined} />
                    <AvatarFallback className="bg-emerald-100 text-emerald-800 font-bold text-xs">
                      {session.user.name?.slice(0, 2).toUpperCase() || "УЗ"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden lg:flex flex-col text-left text-xs">
                    <span className="font-semibold leading-tight line-clamp-1 max-w-[120px]">
                      {session.user.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {roleInfo.label}
                    </span>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-semibold">{session.user.name}</p>
                      <p className="text-xs text-muted-foreground font-mono">
                        {session.user.email}
                      </p>
                      <div className="pt-1">
                        <Badge
                          variant="outline"
                          className={`text-[10px] font-medium ${roleInfo.color}`}
                        >
                          {roleInfo.label}
                        </Badge>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link href="/profile/crm">
                    <DropdownMenuItem className="cursor-pointer text-emerald-700 dark:text-emerald-400 font-semibold">
                      <Users className="mr-2 h-4 w-4 text-emerald-600" />
                      {t.nav.crm}
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/profile/analytics">
                    <DropdownMenuItem className="cursor-pointer text-slate-700 dark:text-slate-300">
                      <TrendingUp className="mr-2 h-4 w-4 text-emerald-600" />
                      {t.nav.analytics}
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/profile/settings">
                    <DropdownMenuItem className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      {t.nav.settings}
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/classifieds">
                    <DropdownMenuItem className="cursor-pointer">
                      <Home className="mr-2 h-4 w-4" />
                      {t.nav.myAds}
                    </DropdownMenuItem>
                  </Link>

                  {userRole === "developer" && (
                    <Link href="/developer-admin">
                      <DropdownMenuItem className="cursor-pointer">
                        <Building2 className="mr-2 h-4 w-4" />
                        {t.nav.devCabinet}
                      </DropdownMenuItem>
                    </Link>
                  )}
                  {userRole === "admin" && (
                    <Link href="/developer-admin">
                      <DropdownMenuItem className="cursor-pointer">
                        <ShieldCheck className="mr-2 h-4 w-4 text-red-500" />
                        {t.nav.adminPanel}
                      </DropdownMenuItem>
                    </Link>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={async () => {
                      await signOut();
                      window.location.reload();
                    }}
                    className="cursor-pointer text-destructive focus:text-destructive"
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
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-600/25 transition-all cursor-pointer"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>{t.nav.login}</span>
              </motion.button>
            )}
          </div>
        </div>
      </header>

      {/* Full-width continuous Marquee Ticker (NOT sticky with header, edge-to-edge from screen left to right) */}
      <div className="w-full overflow-hidden bg-gradient-to-r from-emerald-50/90 via-white/80 to-emerald-50/90 dark:from-slate-900/90 dark:via-slate-800/80 dark:to-slate-900/90 backdrop-blur-md border-y border-emerald-200/50 dark:border-white/10 py-1.5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] select-none">
        <div className="flex whitespace-nowrap animate-marquee">
          {[0, 1].map((i) => (
            <span
              key={i}
              className="inline-flex items-center gap-6 px-6 text-[11px] font-semibold tracking-widest uppercase text-emerald-950/80 dark:text-emerald-300"
            >
              <span><span className="text-emerald-600 mr-2">✦</span>{t.marquee.portalTitle}</span>
              <span><span className="text-emerald-600 mr-2">✦</span>{t.marquee.directDev}</span>
              <span><span className="text-emerald-600 mr-2">✦</span>{t.marquee.chessboards}</span>
              <span><span className="text-emerald-600 mr-2">✦</span>{t.marquee.resaleHomes}</span>
              <span><span className="text-emerald-600 mr-2">✦</span>{t.marquee.dualCurrency}</span>
              <span><span className="text-emerald-600 mr-2">✦</span>{t.marquee.b2bCrm}</span>
            </span>
          ))}
        </div>
      </div>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultTab={authModalTab}
      />
    </>
  );
}
