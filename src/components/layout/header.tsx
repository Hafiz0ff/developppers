"use client";

import React, { useState } from "react";
import Link from "next/link";
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
} from "lucide-react";


export function Header() {
  const { currency, setCurrency } = useCurrency();
  const { t, tDual } = useLanguage();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "register">("login");

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

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-md supports-backdrop-filter:bg-background/80">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Building2 className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold tracking-tight text-lg leading-tight text-emerald-950 flex items-center gap-0.5">
                MASKANI
              </span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
                {tDual("Недвижимость Таджикистана", "Амволи ғайриманқули Тоҷикистон")}
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link
              href="/#new-buildings"
              className="text-foreground/80 hover:text-emerald-600 transition-colors flex items-center gap-1.5"
            >
              <Building2 className="h-4 w-4 text-emerald-600" />
              {t.nav.newBuildings}
            </Link>
            <Link
              href="/#classifieds"
              className="text-foreground/80 hover:text-emerald-600 transition-colors flex items-center gap-1.5"
            >
              <Home className="h-4 w-4 text-emerald-600" />
              {t.nav.resale}
            </Link>
            <Link
              href="/#houses"
              className="text-foreground/80 hover:text-emerald-600 transition-colors"
            >
              {t.nav.houses}
            </Link>
            <Link
              href="/#developers"
              className="text-foreground/80 hover:text-emerald-600 transition-colors flex items-center gap-1.5"
            >
              <Briefcase className="h-4 w-4 text-emerald-600" />
              {t.nav.developers}
            </Link>
          </nav>


          {/* Right Controls: Language, Currency, Add Button, Auth */}
          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <LanguageSwitcher />

            {/* Currency Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white/90 hover:bg-white text-slate-800 text-xs font-bold shadow-xs hover:border-emerald-500 hover:text-emerald-700 transition-all outline-hidden cursor-pointer">
                <span>{currency}</span>
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 p-1.5 rounded-xl bg-white shadow-xl border border-slate-200/80 z-50">
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

            {/* Post Ad Button */}
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
                className="hidden sm:flex border-emerald-600/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 gap-1.5 text-xs font-medium cursor-pointer"
              >
                <PlusCircle className="h-3.5 w-3.5 text-emerald-600" />
                {t.nav.postAd}
              </Button>
            </Link>

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
              <Button
                size="sm"
                onClick={() => handleOpenAuth("login")}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs px-3 shadow-xs"
              >
                <LogIn className="mr-1.5 h-3.5 w-3.5" />
                {t.nav.login}
              </Button>
            )}
          </div>
        </div>

        {/* Compact Marquee Border Divider */}
        <div className="w-full overflow-hidden bg-emerald-50/60 backdrop-blur-xs border-y border-emerald-100/80 py-1">
          <div className="flex whitespace-nowrap animate-marquee">
            {[0, 1].map((i) => (
              <span
                key={i}
                className="inline-flex items-center gap-6 px-6 text-[11px] font-semibold tracking-widest uppercase text-emerald-900/75 select-none"
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
      </header>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultTab={authModalTab}
      />
    </>
  );
}
