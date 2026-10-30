"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
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
  getMenuItemsTree,
  type MenuItemTree,
} from "@/lib/navigation/menu-store";
import { resolveMenuItemUrl } from "@/lib/seo/url-resolver";
import {
  Building2,
  Home,
  Store,
  Briefcase,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  LogIn,
  LogOut,
  User,
  ShieldCheck,
  TrendingUp,
  Users,
  Check,
  ArrowLeftRight,
  KeyRound,
  FileText,
  Share2,
} from "lucide-react";
import { useCompare } from "@/context/compare-context";

interface MenuGroup {
  id: string;
  label: Record<"ru" | "tg" | "en", string>;
  links: MenuItemTree[];
}

function parseColumnGroups(children: MenuItemTree[] | undefined, column: number): MenuGroup[] {
  if (!children) return [];
  const colItems = children.filter((c) => c.column === column);
  const groups: MenuGroup[] = [];
  let currentGroup: MenuGroup | null = null;

  for (const item of colItems) {
    if (item.type === "group-header") {
      currentGroup = {
        id: item.id,
        label: item.label,
        links: [],
      };
      groups.push(currentGroup);
    } else if (currentGroup) {
      currentGroup.links.push(item);
    } else {
      currentGroup = {
        id: `auto_${item.id}`,
        label: { ru: "", tg: "", en: "" },
        links: [item],
      };
      groups.push(currentGroup);
    }
  }

  return groups;
}

// Toggle to true if you want to restore "Недвижимость Таджикистана" under the logo
const SHOW_HEADER_SUBTITLE = false;

export function Header() {
  const pathname = usePathname();
  const { currency, setCurrency } = useCurrency();
  const { t, tDual, language } = useLanguage();
  const { compareCount } = useCompare();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "register">("login");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpandedSection, setMobileExpandedSection] = useState<string | null>("nav_buy");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { data: session, isPending } = useSession();

  // Resolve current active city from path
  const pathParts = (pathname || "/").split("/").filter(Boolean);
  const firstSegment = pathParts[0] === "tg" || pathParts[0] === "en" ? pathParts[1] : pathParts[0];
  const activeCity =
    firstSegment &&
    ["khujand", "dushanbe", "gafurov", "guliston", "buston", "isfara", "istaravshan", "konibodom", "panjakent"].includes(firstSegment)
      ? firstSegment
      : "khujand";

  // Menu items tree from Central Navigation Store
  const menuTree = getMenuItemsTree("header_main");

  const handleOpenAuth = (tab: "login" | "register") => {
    setAuthModalTab(tab);
    setAuthModalOpen(true);
  };

  const handleMouseEnter = (id: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(id);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 180);
  };

  // Close menus on route change
  useEffect(() => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
  }, [pathname]);

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
  const isHome = pathname === "/";

  // Top-level icon mapping
  const getItemIcon = (id: string) => {
    switch (id) {
      case "nav_buy":
        return Home;
      case "nav_rent":
        return KeyRound;
      case "nav_new_buildings":
        return Building2;
      case "nav_commercial_hub":
        return Store;
      case "nav_services":
        return Sparkles;
      case "nav_companies":
        return Briefcase;
      default:
        return null;
    }
  };

  return (
    <>
      <header className={`sticky top-0 z-50 w-full pt-2.5 sm:pt-3 pb-2 px-3 sm:px-6 pointer-events-none transition-all duration-300 ${isHome ? "-mb-20 sm:-mb-22" : ""}`}>
        <div className="w-full max-w-[1440px] mx-auto h-16 px-2.5 sm:px-4 lg:px-5 flex items-center justify-between gap-1 xl:gap-2.5 rounded-2xl pointer-events-auto relative transition-all duration-300 bg-white/[0.025] backdrop-blur-2xl backdrop-saturate-150 border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.20),inset_0_1px_1.5px_rgba(255,255,255,0.35)]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-2.5 shrink-0 group">
            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/25 group-hover:scale-105 transition-transform duration-300">
              <Building2 className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold tracking-tight text-base sm:text-lg leading-tight text-white flex items-center gap-0.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]">
                MASKANI<span className="text-emerald-400 text-xs font-bold">.TJ</span>
              </span>
              {SHOW_HEADER_SUBTITLE && (
                <span className="text-[9px] text-white/80 uppercase tracking-wider font-semibold drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)] hidden 2xl:block truncate max-w-[160px]">
                  {t.nav.subtitle}
                </span>
              )}
            </div>
          </Link>

          {/* Center Navigation Links with Interactive Mega-Menu (Desktop) */}
          <nav
            onMouseLeave={handleMouseLeave}
            className="hidden lg:flex items-center gap-0.5 p-1 rounded-2xl bg-white/[0.025] border border-white/15 text-xs font-semibold backdrop-blur-md shrink-0"
          >
            {menuTree.map((item) => {
              const hasChildren = Boolean(item.children && item.children.length > 0);
              const isMegaMenu = hasChildren && (item.id === "nav_buy" || item.id === "nav_rent");
              const isSimpleDropdown = hasChildren && item.id === "nav_companies";
              const isOpen = activeDropdown === item.id;
              const Icon = getItemIcon(item.id);

              const col1Groups = isMegaMenu ? parseColumnGroups(item.children, 1) : [];
              const col2Groups = isMegaMenu ? parseColumnGroups(item.children, 2) : [];

              return (
                <div
                  key={item.id}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(item.id)}
                >
                  {hasChildren ? (
                    <button
                      type="button"
                      onClick={() => setActiveDropdown(isOpen ? null : item.id)}
                      className={`relative px-1.5 xl:px-2.5 py-1.5 flex items-center gap-1 select-none rounded-xl text-[11px] xl:text-xs font-semibold cursor-pointer transition-colors duration-200 ${
                        isOpen
                          ? "text-emerald-300 bg-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)]"
                          : "text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)] hover:text-emerald-300 hover:bg-white/10"
                      }`}
                    >
                      {Icon && <Icon className="h-3.5 w-3.5 shrink-0 hidden 2xl:inline-block" />}
                      <span>{item.label[language]}</span>
                      <ChevronDown
                        className={`h-3 w-3 opacity-70 transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-emerald-300 opacity-100" : ""
                        }`}
                      />
                    </button>
                  ) : (
                    <Link
                      href={resolveMenuItemUrl(item, activeCity, language)}
                      className="relative px-1.5 xl:px-2.5 py-1.5 flex items-center gap-1 select-none rounded-xl text-[11px] xl:text-xs font-semibold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)] hover:text-emerald-300 hover:bg-white/10 transition-colors"
                    >
                      {Icon && <Icon className="h-3.5 w-3.5 shrink-0 hidden 2xl:inline-block" />}
                      <span>{item.label[language]}</span>
                    </Link>
                  )}

                  {/* 2-Column Mega-Menu Dropdown (Купить / Арендовать) */}
                  <AnimatePresence>
                    {isMegaMenu && isOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.98 }}
                        transition={{ duration: 0.16, ease: "easeOut" }}
                        className="absolute top-full left-0 mt-3 w-[510px] p-4.5 rounded-2xl glass-dropdown-panel z-50 text-white grid grid-cols-2 gap-4.5"
                      >
                        {/* Column 1 */}
                        <div className="space-y-3.5">
                          {col1Groups.map((grp) => (
                            <div key={grp.id} className="space-y-1">
                              {grp.label[language] && (
                                <div className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] px-2.5 pb-0.5">
                                  {grp.label[language]}
                                </div>
                              )}
                              <div className="space-y-0.5">
                                {grp.links.map((link) => (
                                  <Link
                                    key={link.id}
                                    href={resolveMenuItemUrl(link, activeCity, language)}
                                    onClick={() => setActiveDropdown(null)}
                                    className="flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-semibold text-white/90 hover:text-white hover:bg-white/15 focus:bg-white/15 transition-all group/item cursor-pointer"
                                  >
                                    <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                                      {link.label[language]}
                                    </span>
                                    <ChevronRight className="h-3 w-3 text-emerald-400 opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-0.5 transition-all" />
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Column 2 */}
                        <div className="space-y-3.5 border-l border-white/12 pl-4">
                          {col2Groups.map((grp) => (
                            <div key={grp.id} className="space-y-1">
                              {grp.label[language] && (
                                <div className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] px-2.5 pb-0.5">
                                  {grp.label[language]}
                                </div>
                              )}
                              <div className="space-y-0.5">
                                {grp.links.map((link) => (
                                  <Link
                                    key={link.id}
                                    href={resolveMenuItemUrl(link, activeCity, language)}
                                    onClick={() => setActiveDropdown(null)}
                                    className="flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-semibold text-white/90 hover:text-white hover:bg-white/15 focus:bg-white/15 transition-all group/item cursor-pointer"
                                  >
                                    <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                                      {link.label[language]}
                                    </span>
                                    <ChevronRight className="h-3 w-3 text-emerald-400 opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-0.5 transition-all" />
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* 1-Column Dropdown (Компании) */}
                  <AnimatePresence>
                    {isSimpleDropdown && isOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.98 }}
                        transition={{ duration: 0.16, ease: "easeOut" }}
                        className="absolute top-full left-0 mt-3 w-56 p-1.5 rounded-2xl glass-dropdown-panel z-50 text-white space-y-0.5"
                      >
                        {item.children?.map((sub) => (
                          <Link
                            key={sub.id}
                            href={resolveMenuItemUrl(sub, activeCity, language)}
                            onClick={() => setActiveDropdown(null)}
                            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-white/90 hover:text-white hover:bg-white/15 focus:bg-white/15 transition-all group/sub cursor-pointer"
                          >
                            <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                              {sub.label[language]}
                            </span>
                            <ChevronRight className="h-3 w-3 text-emerald-400 opacity-0 group-hover/sub:opacity-100 group-hover/sub:translate-x-0.5 transition-all" />
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </nav>

          {/* Right Controls: Language, Currency, Compare, Post Ad, Auth */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {/* Language Selector */}
            <LanguageSwitcher />

            {/* Currency Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex h-8 box-border items-center gap-1 px-2 sm:px-2.5 rounded-xl border border-white/15 bg-white/[0.05] hover:bg-white/10 active:bg-white/15 backdrop-blur-xl text-white text-xs font-bold shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)] transition-all outline-hidden cursor-pointer shrink-0">
                <span>{currency}</span>
                <ChevronDown className="h-3 w-3 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 p-1.5 rounded-2xl glass-dropdown-panel z-50 text-white ring-0">
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

            {/* Post Ad Button (Split CTA: Sell / Rent) */}
            <DropdownMenu>
              <DropdownMenuTrigger className="hidden sm:inline-flex h-8 box-border items-center justify-center gap-1 px-2 xl:px-2.5 rounded-xl border border-white/20 bg-white/[0.06] hover:bg-white/15 active:bg-white/20 text-white font-bold backdrop-blur-xl text-xs cursor-pointer shadow-[inset_0_1px_1px_rgba(255,255,255,0.35)] drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)] transition-all select-none whitespace-nowrap outline-hidden">
                <span>{language === "tg" ? "Эълон додан" : language === "en" ? "Post Ad" : "Подать объявление"}</span>
                <ChevronDown className="h-3 w-3 text-white/80" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 p-1.5 rounded-2xl glass-dropdown-panel z-50 text-white ring-0"
              >
                <DropdownMenuItem
                  onClick={() => {
                    if (!session) {
                      handleOpenAuth("login");
                    } else {
                      window.location.href = "/classifieds/new?deal=sale";
                    }
                  }}
                  className="cursor-pointer text-xs flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold text-white/90 hover:text-white hover:bg-white/15 focus:text-white focus:bg-white/15 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <Home className="h-4 w-4 text-emerald-400" />
                    <span>{language === "tg" ? "Фурӯши амвол" : language === "en" ? "Sell Property" : "Продать недвижимость"}</span>
                  </div>
                  <ChevronRight className="h-3 w-3 text-emerald-400 opacity-60" />
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => {
                    if (!session) {
                      handleOpenAuth("login");
                    } else {
                      window.location.href = "/classifieds/new?deal=rent";
                    }
                  }}
                  className="cursor-pointer text-xs flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold text-white/90 hover:text-white hover:bg-white/15 focus:text-white focus:bg-white/15 transition-all mt-1"
                >
                  <div className="flex items-center gap-2">
                    <KeyRound className="h-4 w-4 text-emerald-400" />
                    <span>{language === "tg" ? "Ба иҷора супоридан" : language === "en" ? "Rent Out Property" : "Сдать в аренду"}</span>
                  </div>
                  <ChevronRight className="h-3 w-3 text-emerald-400 opacity-60" />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

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
                <DropdownMenuContent align="end" className="w-56 p-1.5 rounded-2xl glass-dropdown-panel z-50 text-white ring-0">
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
                  <Link href={userRole === "developer" ? "/developer-admin/publications" : "/profile/publications"}>
                    <DropdownMenuItem className="cursor-pointer text-white/90 hover:text-white hover:bg-white/15 focus:text-white focus:bg-white/15 rounded-xl transition-all">
                      <Share2 className="mr-2 h-4 w-4 text-emerald-400" />
                      {userRole === "developer"
                        ? tDual("Публикация ЖК", "Нашри МИ")
                        : tDual("Публикация объектов", "Нашри амвол")}
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

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex h-8 w-8 box-border items-center justify-center rounded-xl border border-white/20 bg-white/[0.06] hover:bg-white/15 text-white cursor-pointer backdrop-blur-xl transition-all shrink-0 ml-0.5"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-md lg:hidden flex flex-col justify-end"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-h-[85vh] overflow-y-auto bg-slate-900/95 border-t border-white/20 rounded-t-3xl p-5 space-y-4 text-white"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1">
                  MASKANI<span className="text-emerald-400">.TJ</span>
                </span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-white/80 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Mobile Menu Accordion Items */}
              <div className="space-y-2">
                {menuTree.map((item) => {
                  const hasChildren = Boolean(item.children && item.children.length > 0);
                  const isExpanded = mobileExpandedSection === item.id;
                  const Icon = getItemIcon(item.id);

                  if (!hasChildren) {
                    return (
                      <Link
                        key={item.id}
                        href={resolveMenuItemUrl(item, activeCity, language)}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 font-semibold text-sm transition-all"
                      >
                        <div className="flex items-center gap-2.5">
                          {Icon && <Icon className="h-4 w-4 text-emerald-400" />}
                          <span>{item.label[language]}</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-white/40" />
                      </Link>
                    );
                  }

                  return (
                    <div key={item.id} className="rounded-xl bg-white/5 overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setMobileExpandedSection(isExpanded ? null : item.id)}
                        className="w-full flex items-center justify-between p-3 font-semibold text-sm transition-all"
                      >
                        <div className="flex items-center gap-2.5">
                          {Icon && <Icon className="h-4 w-4 text-emerald-400" />}
                          <span>{item.label[language]}</span>
                        </div>
                        <ChevronDown className={`h-4 w-4 text-white/40 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                      </button>

                      {isExpanded && (
                        <div className="p-3 pt-0 space-y-2 border-t border-white/5">
                          {item.children?.map((child) => {
                            if (child.type === "group-header") {
                              return (
                                <div key={child.id} className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 pt-2 px-1">
                                  {child.label[language]}
                                </div>
                              );
                            }
                            return (
                              <Link
                                key={child.id}
                                href={resolveMenuItemUrl(child, activeCity, language)}
                                onClick={() => setMobileMenuOpen(false)}
                                className="block py-1.5 px-3 rounded-lg text-xs text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                              >
                                {child.label[language]}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Mobile Post Ad Buttons */}
              <div className="pt-2 space-y-2 border-t border-white/10">
                <Link
                  href="/classifieds/new?deal=sale"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md"
                >
                  <Home className="h-4 w-4" />
                  <span>{language === "tg" ? "Фурӯши амвол" : language === "en" ? "Sell Property" : "Продать недвижимость"}</span>
                </Link>
                <Link
                  href="/classifieds/new?deal=rent"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-emerald-400/50 bg-emerald-500/15 text-white font-bold text-xs"
                >
                  <KeyRound className="h-4 w-4 text-emerald-400" />
                  <span>{language === "tg" ? "Ба иҷора супоридан" : language === "en" ? "Rent Out Property" : "Сдать в аренду"}</span>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultTab={authModalTab}
      />
    </>
  );
}
