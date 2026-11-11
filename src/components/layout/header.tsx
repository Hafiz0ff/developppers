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
      color: "bg-destructive/10 text-destructive border-destructive/20",
    },
    developer: {
      label: language === "en" ? "Developer" : language === "tg" ? "Ширкати сохтмонӣ" : "Застройщик",
      color: "bg-primary/10 text-primary border-primary/20",
    },
    realtor: {
      label: language === "en" ? "Realtor" : language === "tg" ? "Маклер" : "Риелтор",
      color: "bg-primary/10 text-primary border-primary/20",
    },
    user: {
      label: language === "en" ? "User" : language === "tg" ? "Корбар" : "Пользователь",
      color: "bg-muted text-muted-foreground",
    },
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userRole = (session?.user as any)?.role || "user";
  const roleInfo = roleLabels[userRole] || roleLabels.user;

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
      <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/85 backdrop-blur-md transition-all">
        <div className="w-full max-w-[1440px] mx-auto h-16 px-3 sm:px-6 flex items-center justify-between gap-2 xl:gap-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-2.5 shrink-0 group">
            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform duration-300">
              <Building2 className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold tracking-tight text-base sm:text-lg leading-tight text-foreground flex items-center gap-0.5">
                MASKANI<span className="text-primary text-xs font-bold">.TJ</span>
              </span>
              {SHOW_HEADER_SUBTITLE && (
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold hidden 2xl:block truncate max-w-[160px]">
                  {t.nav.subtitle}
                </span>
              )}
            </div>
          </Link>

          {/* Center Navigation Links with Interactive Mega-Menu (Desktop) */}
          <nav
            onMouseLeave={handleMouseLeave}
            className="hidden lg:flex items-center gap-0.5 p-1 rounded-xl bg-muted/40 border border-border/50 text-xs font-semibold shrink-0"
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
                      className={`relative px-2 xl:px-2.5 py-1.5 flex items-center gap-1 select-none rounded-lg text-xs font-semibold cursor-pointer transition-colors duration-200 ${
                        isOpen
                          ? "text-primary bg-primary/10 font-bold"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      {Icon && <Icon className="h-3.5 w-3.5 shrink-0 hidden 2xl:inline-block" />}
                      <span>{item.label[language]}</span>
                      <ChevronDown
                        className={`h-3 w-3 opacity-70 transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-primary opacity-100" : ""
                        }`}
                      />
                    </button>
                  ) : (
                    <Link
                      href={resolveMenuItemUrl(item, activeCity, language)}
                      className="relative px-2 xl:px-2.5 py-1.5 flex items-center gap-1 select-none rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
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
                        className="absolute top-full left-0 mt-2 w-[510px] p-4 rounded-2xl border border-border/80 bg-background/95 shadow-xl backdrop-blur-xl z-50 text-foreground grid grid-cols-2 gap-4"
                      >
                        {/* Column 1 */}
                        <div className="space-y-3.5">
                          {col1Groups.map((grp) => (
                            <div key={grp.id} className="space-y-1">
                              {grp.label[language] && (
                                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-2.5 pb-1">
                                  {grp.label[language]}
                                </div>
                              )}
                              <div className="space-y-0.5">
                                {grp.links.map((link) => (
                                  <Link
                                    key={link.id}
                                    href={resolveMenuItemUrl(link, activeCity, language)}
                                    onClick={() => setActiveDropdown(null)}
                                    className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-foreground hover:bg-muted focus:bg-muted transition-all group/item cursor-pointer"
                                  >
                                    <span>{link.label[language]}</span>
                                    <ChevronRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-0.5 transition-all" />
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Column 2 */}
                        <div className="space-y-3.5 border-l border-border/60 pl-4">
                          {col2Groups.map((grp) => (
                            <div key={grp.id} className="space-y-1">
                              {grp.label[language] && (
                                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-2.5 pb-1">
                                  {grp.label[language]}
                                </div>
                              )}
                              <div className="space-y-0.5">
                                {grp.links.map((link) => (
                                  <Link
                                    key={link.id}
                                    href={resolveMenuItemUrl(link, activeCity, language)}
                                    onClick={() => setActiveDropdown(null)}
                                    className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-foreground hover:bg-muted focus:bg-muted transition-all group/item cursor-pointer"
                                  >
                                    <span>{link.label[language]}</span>
                                    <ChevronRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-0.5 transition-all" />
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
                        className="absolute top-full left-0 mt-2 w-56 p-1.5 rounded-2xl border border-border/80 bg-background/95 shadow-xl backdrop-blur-xl z-50 text-foreground space-y-0.5"
                      >
                        {item.children?.map((sub) => (
                          <Link
                            key={sub.id}
                            href={resolveMenuItemUrl(sub, activeCity, language)}
                            onClick={() => setActiveDropdown(null)}
                            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-foreground hover:bg-muted focus:bg-muted transition-all group/sub cursor-pointer"
                          >
                            <span>{sub.label[language]}</span>
                            <ChevronRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover/sub:opacity-100 group-hover/sub:translate-x-0.5 transition-all" />
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

            {/* Currency Selector (Desktop / Tablet - hidden on small mobile to give breathing room) */}
            <DropdownMenu>
              <DropdownMenuTrigger className="hidden sm:flex h-8 box-border items-center gap-1 px-2.5 rounded-lg border border-border/80 bg-background hover:bg-muted active:bg-muted/80 text-foreground text-xs font-semibold shadow-2xs transition-all outline-hidden cursor-pointer shrink-0">
                <span>{currency}</span>
                <ChevronDown className="h-3 w-3 text-muted-foreground" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 p-1.5 rounded-xl border border-border/80 bg-background shadow-lg z-50 text-foreground ring-0">
                <DropdownMenuItem
                  onClick={() => setCurrency("TJS")}
                  className={`cursor-pointer text-xs flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-all ${
                    currency === "TJS"
                      ? "text-primary bg-primary/10 font-bold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted focus:text-foreground focus:bg-muted"
                  }`}
                >
                  <span>TJS (Сомонӣ)</span>
                  {currency === "TJS" && <Check className="h-3.5 w-3.5 text-primary" />}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setCurrency("USD")}
                  className={`cursor-pointer text-xs flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-all mt-1 ${
                    currency === "USD"
                      ? "text-primary bg-primary/10 font-bold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted focus:text-foreground focus:bg-muted"
                  }`}
                >
                  <span>USD (Доллар $)</span>
                  {currency === "USD" && <Check className="h-3.5 w-3.5 text-primary" />}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Compare Link / Icon */}
            <div className="hidden sm:block shrink-0">
              <Link
                href="/compare"
                className="relative flex h-8 w-8 box-border items-center justify-center rounded-lg border border-border/80 bg-background hover:bg-muted active:bg-muted/80 text-foreground shadow-2xs transition-all cursor-pointer"
                title={t.nav.compare}
                aria-label={t.nav.compare}
              >
                <ArrowLeftRight className="h-3.5 w-3.5 text-foreground" />
                {compareCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-semibold text-primary-foreground leading-none shadow-2xs">
                    {compareCount}
                  </span>
                )}
              </Link>
            </div>

            {/* Post Ad Button (Split CTA: Sell / Rent) */}
            <DropdownMenu>
              <DropdownMenuTrigger className="hidden sm:inline-flex h-8 box-border items-center justify-center gap-1 px-2.5 xl:px-3 rounded-lg border border-border/80 bg-background hover:bg-muted active:bg-muted/80 text-foreground font-semibold text-xs cursor-pointer shadow-2xs transition-all select-none whitespace-nowrap outline-hidden">
                <span>{language === "tg" ? "Эълон додан" : language === "en" ? "Post Ad" : "Подать объявление"}</span>
                <ChevronDown className="h-3 w-3 text-muted-foreground" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 p-1.5 rounded-xl border border-border/80 bg-background shadow-lg z-50 text-foreground ring-0"
              >
                <DropdownMenuItem
                  onClick={() => {
                    window.location.href = "/classifieds/new?deal=sale";
                  }}
                  className="cursor-pointer text-xs flex items-center justify-between px-3 py-2.5 rounded-lg font-medium text-foreground hover:bg-muted focus:bg-muted transition-all"
                >
                  <div className="flex items-center gap-2">
                    <Home className="h-4 w-4 text-primary" />
                    <span>{language === "tg" ? "Фурӯши амвол" : language === "en" ? "Sell Property" : "Продать недвижимость"}</span>
                  </div>
                  <ChevronRight className="h-3 w-3 text-muted-foreground opacity-60" />
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => {
                    window.location.href = "/classifieds/new?deal=rent";
                  }}
                  className="cursor-pointer text-xs flex items-center justify-between px-3 py-2.5 rounded-lg font-medium text-foreground hover:bg-muted focus:bg-muted transition-all mt-1"
                >
                  <div className="flex items-center gap-2">
                    <KeyRound className="h-4 w-4 text-primary" />
                    <span>{language === "tg" ? "Ба иҷора супоридан" : language === "en" ? "Rent Out Property" : "Сдать в аренду"}</span>
                  </div>
                  <ChevronRight className="h-3 w-3 text-muted-foreground opacity-60" />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Auth Button or User Profile */}
            {isPending ? (
              <div className="h-8 w-20 rounded-lg bg-muted animate-pulse shrink-0" />
            ) : session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex h-8 box-border items-center gap-2 outline-hidden px-2 rounded-lg border border-border/80 bg-background hover:bg-muted transition-colors cursor-pointer shadow-2xs shrink-0">
                  <Avatar className="h-6 w-6 border border-border/80">
                    <AvatarImage src={session.user.image || undefined} />
                    <AvatarFallback className="bg-primary text-primary-foreground font-bold text-xs">
                      {session.user.name?.slice(0, 2).toUpperCase() || "УЗ"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden lg:flex flex-col text-left text-xs">
                    <span className="font-semibold leading-tight line-clamp-1 max-w-[120px] text-foreground">
                      {session.user.name}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {roleInfo.label}
                    </span>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 p-1.5 rounded-xl border border-border/80 bg-background shadow-lg z-50 text-foreground ring-0">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-semibold text-foreground">{session.user.name}</p>
                      <p className="text-xs text-muted-foreground font-mono">
                        {session.user.email}
                      </p>
                      <div className="pt-1">
                        <Badge
                          variant="outline"
                          className="text-xs font-medium bg-primary/10 text-primary border-primary/20"
                        >
                          {roleInfo.label}
                        </Badge>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-border/60" />
                  <Link href="/profile/crm">
                    <DropdownMenuItem className="cursor-pointer text-foreground hover:bg-muted focus:bg-muted rounded-lg font-medium text-xs transition-all">
                      <Users className="mr-2 h-4 w-4 text-primary" />
                      {t.nav.crm}
                    </DropdownMenuItem>
                  </Link>
                  <Link href={userRole === "developer" ? "/developer-admin/publications" : "/profile/publications"}>
                    <DropdownMenuItem className="cursor-pointer text-foreground hover:bg-muted focus:bg-muted rounded-lg font-medium text-xs transition-all">
                      <Share2 className="mr-2 h-4 w-4 text-primary" />
                      {userRole === "developer"
                        ? tDual("Публикация ЖК", "Нашри МИ")
                        : tDual("Публикация объектов", "Нашри амвол")}
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/profile/analytics">
                    <DropdownMenuItem className="cursor-pointer text-foreground hover:bg-muted focus:bg-muted rounded-lg font-medium text-xs transition-all">
                      <TrendingUp className="mr-2 h-4 w-4 text-primary" />
                      {t.nav.analytics}
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/profile/settings">
                    <DropdownMenuItem className="cursor-pointer text-foreground hover:bg-muted focus:bg-muted rounded-lg font-medium text-xs transition-all">
                      <User className="mr-2 h-4 w-4 text-muted-foreground" />
                      {t.nav.settings}
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/classifieds">
                    <DropdownMenuItem className="cursor-pointer text-foreground hover:bg-muted focus:bg-muted rounded-lg font-medium text-xs transition-all">
                      <Home className="mr-2 h-4 w-4 text-muted-foreground" />
                      {t.nav.myAds}
                    </DropdownMenuItem>
                  </Link>

                  {userRole === "developer" && (
                    <Link href="/developer-admin">
                      <DropdownMenuItem className="cursor-pointer text-foreground hover:bg-muted focus:bg-muted rounded-lg font-medium text-xs transition-all">
                        <Building2 className="mr-2 h-4 w-4 text-primary" />
                        {t.nav.devCabinet}
                      </DropdownMenuItem>
                    </Link>
                  )}
                  {userRole === "admin" && (
                    <Link href="/super-admin">
                      <DropdownMenuItem className="cursor-pointer text-foreground hover:bg-muted focus:bg-muted rounded-lg font-medium text-xs transition-all">
                        <ShieldCheck className="mr-2 h-4 w-4 text-destructive" />
                        {t.nav.adminPanel}
                      </DropdownMenuItem>
                    </Link>
                  )}
                  <DropdownMenuSeparator className="bg-border/60" />
                  <DropdownMenuItem
                    onClick={async () => {
                      await signOut();
                      window.location.reload();
                    }}
                    className="cursor-pointer text-destructive hover:bg-destructive/10 focus:bg-destructive/10 rounded-lg text-xs transition-all"
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
                className="h-8 px-3 rounded-lg text-xs font-semibold gap-1.5 shrink-0"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>{t.nav.login}</span>
              </Button>
            )}

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex h-8 w-8 box-border items-center justify-center rounded-lg border border-border/80 bg-background hover:bg-muted active:scale-95 text-foreground cursor-pointer transition-all shrink-0 shadow-2xs"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="h-4 w-4 text-foreground" />
              ) : (
                <Menu className="h-4 w-4 text-foreground" />
              )}
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
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs lg:hidden flex flex-col justify-end"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-h-[85vh] overflow-y-auto bg-background border-t border-border/80 rounded-t-3xl p-5 pb-8 space-y-4 text-foreground shadow-2xl"
            >
              {/* Pull Indicator Handle */}
              <div className="w-10 h-1 rounded-full bg-muted-foreground/30 mx-auto -mt-1 mb-2" />

              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <span className="font-extrabold text-base tracking-tight text-foreground flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shadow-xs">
                    <Building2 className="h-4 w-4" />
                  </div>
                  MASKANI<span className="text-primary font-bold">.TJ</span>
                </span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="h-8 w-8 rounded-full border border-border/80 bg-muted/60 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Mobile Quick Action Strip (Currency, Compare, Profile/Login) */}
              <div className="grid grid-cols-3 gap-2 pb-1">
                {/* Currency Switcher */}
                <button
                  type="button"
                  onClick={() => setCurrency(currency === "TJS" ? "USD" : "TJS")}
                  className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border border-border/80 bg-card hover:bg-muted active:bg-muted text-xs font-semibold text-foreground transition-all cursor-pointer shadow-2xs"
                  title="Переключить валюту"
                >
                  <span className="text-primary font-bold">{currency}</span>
                  <span className="text-[11px] text-muted-foreground">{currency === "TJS" ? "⇄ USD" : "⇄ TJS"}</span>
                </button>

                <Link
                  href="/compare"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border border-border/80 bg-card hover:bg-muted text-xs font-semibold text-foreground transition-all shadow-2xs"
                >
                  <ArrowLeftRight className="h-3.5 w-3.5 text-primary" />
                  <span>{t.nav.compare}</span>
                  {compareCount > 0 && (
                    <span className="bg-primary text-primary-foreground font-bold text-[11px] px-1.5 py-0.5 rounded-full">
                      {compareCount}
                    </span>
                  )}
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleOpenAuth("login");
                  }}
                  className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border border-primary/30 bg-primary/10 text-xs font-semibold text-primary hover:bg-primary/15 transition-all cursor-pointer shadow-2xs"
                >
                  <LogIn className="h-3.5 w-3.5 text-primary" />
                  <span>{session ? t.nav.profile : t.nav.login}</span>
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
                        className="flex items-center justify-between p-3.5 rounded-xl border border-border/60 bg-card hover:bg-muted active:bg-muted font-semibold text-sm transition-all shadow-2xs"
                      >
                        <div className="flex items-center gap-2.5">
                          {Icon && <Icon className="h-4 w-4 text-primary" />}
                          <span>{item.label[language]}</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </Link>
                    );
                  }

                  return (
                    <div
                      key={item.id}
                      className="rounded-xl border border-border/60 bg-card overflow-hidden transition-all shadow-2xs"
                    >
                      <button
                        type="button"
                        onClick={() => setMobileExpandedSection(isExpanded ? null : item.id)}
                        className="w-full flex items-center justify-between p-3.5 font-semibold text-sm transition-all cursor-pointer hover:bg-muted/50"
                      >
                        <div className="flex items-center gap-2.5">
                          {Icon && <Icon className="h-4 w-4 text-primary" />}
                          <span>{item.label[language]}</span>
                        </div>
                        <ChevronDown
                          className={`h-4 w-4 text-muted-foreground transition-transform duration-300 ${
                            isExpanded ? "rotate-180 text-primary" : ""
                          }`}
                        />
                      </button>

                      {isExpanded && (
                        <div className="p-3 pt-1 space-y-1 border-t border-border/60 bg-muted/20">
                          {item.children?.map((child) => {
                            if (child.type === "group-header") {
                              return (
                                <div
                                  key={child.id}
                                  className="text-xs font-bold uppercase tracking-wider text-muted-foreground pt-2 px-2 pb-0.5"
                                >
                                  {child.label[language]}
                                </div>
                              );
                            }
                            return (
                              <Link
                                key={child.id}
                                href={resolveMenuItemUrl(child, activeCity, language)}
                                onClick={() => setMobileMenuOpen(false)}
                                className="block py-2 px-3 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
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
              <div className="pt-2 space-y-2 border-t border-border/60">
                <Link
                  href="/classifieds/new?deal=sale"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs shadow-xs transition-transform active:scale-[0.99]"
                >
                  <Home className="h-4 w-4" />
                  <span>
                    {language === "tg"
                      ? "Фурӯши амвол"
                      : language === "en"
                      ? "Sell Property"
                      : "Продать недвижимость"}
                  </span>
                </Link>
                <Link
                  href="/classifieds/new?deal=rent"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 font-semibold text-xs transition-colors"
                >
                  <KeyRound className="h-4 w-4 text-primary" />
                  <span>
                    {language === "tg"
                      ? "Ба иҷора супоридан"
                      : language === "en"
                      ? "Rent Out Property"
                      : "Сдать в аренду"}
                  </span>
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
