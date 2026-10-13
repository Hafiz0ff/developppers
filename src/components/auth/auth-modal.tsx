"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SOGD_CITIES } from "@/lib/constants/locations";
import { signIn, signUp } from "@/lib/auth-client";
import { Loader2, Building2, User, KeyRound, Phone, MapPin } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "login" | "register";
}

export function AuthModal({ isOpen, onClose, defaultTab = "login" }: AuthModalProps) {
  const [tab, setTab] = useState<"login" | "register">(defaultTab);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("+992 ");
  const [city, setCity] = useState("khujand");
  const [role, setRole] = useState<"user" | "realtor" | "developer">("user");
  const [agencyName, setAgencyName] = useState("");

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setName("");
    setPhone("+992 ");
    setError(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await signIn.email({
        email,
        password,
      });

      if (res.error) {
        setError(res.error.message || "Ошибка входа. Проверьте email и пароль.");
      } else {
        onClose();
        resetForm();
        window.location.reload();
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Не удалось войти в аккаунт";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await signUp.email({
        email,
        password,
        name,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...({
          role,
          phone,
          city,
          agencyName: role === "realtor" ? agencyName : undefined,
        } as any),
      });

      if (res.error) {
        setError(res.error.message || "Ошибка регистрации. Проверьте данные.");
      } else {
        onClose();
        resetForm();
        window.location.reload();
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Не удалось зарегистрироваться";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-9 w-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold shadow-sm">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">
                {tab === "login" ? "Вход в аккаунт" : "Регистрация на портале"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Недвижимость Согдийской области (Худжанд и регионы)
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Tab switchers */}
        <div className="flex border rounded-lg p-1 bg-muted/40">
          <button
            type="button"
            onClick={() => {
              setTab("login");
              setError(null);
            }}
            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${
              tab === "login"
                ? "bg-background shadow-xs text-foreground font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Войти
          </button>
          <button
            type="button"
            onClick={() => {
              setTab("register");
              setError(null);
            }}
            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${
              tab === "register"
                ? "bg-background shadow-xs text-foreground font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Регистрация
          </button>
        </div>

        {error && (
          <div className="p-3 text-xs rounded-md bg-destructive/10 text-destructive border border-destructive/20">
            {error}
          </div>
        )}

        {tab === "login" ? (
          <form onSubmit={handleLogin} className="space-y-4 pt-1">
            <div className="space-y-1.5">
              <Label htmlFor="login-email">Электронная почта (Email)</Label>
              <Input
                id="login-email"
                type="email"
                placeholder="name@example.tj"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="login-password">Пароль</Label>
              </div>
              <Input
                id="login-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Вход...
                </>
              ) : (
                <>
                  <KeyRound className="mr-2 h-4 w-4" />
                  Войти
                </>
              )}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-3.5 pt-1">
            <div className="space-y-1.5">
              <Label>Кто вы?</Label>
              <Select
                value={role}
                onValueChange={(val) => {
                  if (val) setRole(val as "user" | "realtor" | "developer");
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Покупатель / Частный продавец</SelectItem>
                  <SelectItem value="realtor">Риелтор / Агентство недвижимости</SelectItem>
                  <SelectItem value="developer">Представитель застройщика</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="reg-name">Имя и фамилия</Label>
              <Input
                id="reg-name"
                placeholder="Дилшод Назаров"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {role === "realtor" && (
              <div className="space-y-1.5">
                <Label htmlFor="reg-agency">Название агентства (опционально)</Label>
                <Input
                  id="reg-agency"
                  placeholder="Сугд-Инвест Недвижимость"
                  value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <Label htmlFor="reg-phone">Номер телефона</Label>
                <div className="relative">
                  <Input
                    id="reg-phone"
                    placeholder="+992 92 700 0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Город / Район</Label>
                <Select
                  value={city}
                  onValueChange={(val) => {
                    if (val) setCity(val);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SOGD_CITIES.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.nameRu}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="reg-email">Email</Label>
              <Input
                id="reg-email"
                type="email"
                placeholder="name@example.tj"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="reg-password">Пароль</Label>
              <Input
                id="reg-password"
                type="password"
                placeholder="Минимум 8 символов"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Создание аккаунта...
                </>
              ) : (
                <>
                  <User className="mr-2 h-4 w-4" />
                  Зарегистрироваться
                </>
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
