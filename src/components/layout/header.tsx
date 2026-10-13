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
} from "lucide-react";


export function Header() {
  const { currency, setCurrency } = useCurrency();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "register">("login");

  const { data: session, isPending } = useSession();

  const handleOpenAuth = (tab: "login" | "register") => {
    setAuthModalTab(tab);
    setAuthModalOpen(true);
  };

  const roleLabels: Record<string, { label: string; color: string }> = {
    admin: { label: "Администратор", color: "bg-red-500/10 text-red-600 border-red-200" },
    developer: {
      label: "Застройщик",
      color: "bg-blue-500/10 text-blue-600 border-blue-200",
    },
    realtor: {
      label: "Риелтор",
      color: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
    },
    user: { label: "Пользователь", color: "bg-muted text-muted-foreground" },
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userRole = (session?.user as any)?.role || "user";
  const roleInfo = roleLabels[userRole] || roleLabels.user;

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-md supports-backdrop-filter:bg-background/80">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Building2 className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg leading-tight tracking-tight text-foreground flex items-center gap-1.5">
                SOGD<span className="text-emerald-600">REALTY</span>
              </span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
                Согдийская область
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link
              href="#new-buildings"
              className="text-foreground/80 hover:text-emerald-600 transition-colors flex items-center gap-1.5"
            >
              <Building2 className="h-4 w-4 text-emerald-600" />
              Новостройки
            </Link>
            <Link
              href="#classifieds"
              className="text-foreground/80 hover:text-emerald-600 transition-colors flex items-center gap-1.5"
            >
              <Home className="h-4 w-4 text-emerald-600" />
              Вторичка
            </Link>
            <Link
              href="#houses"
              className="text-foreground/80 hover:text-emerald-600 transition-colors"
            >
              Дома и Ҳавлӣ
            </Link>
            <Link
              href="#developers"
              className="text-foreground/80 hover:text-emerald-600 transition-colors flex items-center gap-1.5"
            >
              <Briefcase className="h-4 w-4 text-emerald-600" />
              Застройщики
            </Link>
            <Link
              href="/profile/analytics"
              className="text-emerald-700 dark:text-emerald-400 hover:text-emerald-600 transition-colors flex items-center gap-1.5 font-semibold"
            >
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              Аналитика & CRM
            </Link>
          </nav>


          {/* Right Controls: Currency, Add Button, Auth */}
          <div className="flex items-center gap-2.5">
            {/* Currency Selector */}
            <div className="flex items-center border rounded-lg p-0.5 bg-muted/50 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setCurrency("TJS")}
                className={`px-2 py-1 rounded-md transition-all ${
                  currency === "TJS"
                    ? "bg-background text-emerald-600 shadow-xs font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                TJS (сомони)
              </button>
              <button
                type="button"
                onClick={() => setCurrency("USD")}
                className={`px-2 py-1 rounded-md transition-all ${
                  currency === "USD"
                    ? "bg-background text-emerald-600 shadow-xs font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                USD ($)
              </button>
            </div>

            {/* Post Ad Button */}
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                if (!session) {
                  handleOpenAuth("login");
                }
              }}
              className="hidden sm:flex border-emerald-600/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 gap-1.5 text-xs font-medium"
            >
              <PlusCircle className="h-3.5 w-3.5 text-emerald-600" />
              Подать объявление
            </Button>

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
                  <Link href="/profile/analytics">
                    <DropdownMenuItem className="cursor-pointer text-emerald-700 dark:text-emerald-400 font-semibold">
                      <TrendingUp className="mr-2 h-4 w-4 text-emerald-600" />
                      Аналитика & CRM
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Мой профиль
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Home className="mr-2 h-4 w-4" />
                    Мои объявления
                  </DropdownMenuItem>

                  {userRole === "developer" && (
                    <DropdownMenuItem className="cursor-pointer">
                      <Building2 className="mr-2 h-4 w-4" />
                      Кабинет застройщика
                    </DropdownMenuItem>
                  )}
                  {userRole === "admin" && (
                    <DropdownMenuItem className="cursor-pointer">
                      <ShieldCheck className="mr-2 h-4 w-4 text-red-500" />
                      Панель администратора
                    </DropdownMenuItem>
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
                    Выйти
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
                Войти
              </Button>
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
