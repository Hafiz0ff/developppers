"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useCurrency } from "@/context/currency-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Users,
  TrendingUp,
  DollarSign,
  Phone,
  MessageCircle,
  Plus,
  Share2,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Trash2,
  Edit,
  Copy,
  Check,
  Eye,
  ExternalLink,
  Layers,
  Building,
  Home,
  CheckSquare,
  Square,
  Search,
  Filter,
  Send,
} from "lucide-react";
import { CATALOG_PROPERTIES, CatalogProperty } from "@/lib/catalog-data";
import { useLanguage } from "@/lib/i18n/language-context";
import { ProfileNav } from "@/components/profile/profile-nav";

type LeadStatus = "new" | "contacted" | "showing" | "deal" | "closed";

interface Lead {
  id: string;
  agentId: string;
  clientName: string;
  clientPhone: string;
  classifiedId?: string | null;
  classifiedTitle?: string | null;
  status: LeadStatus;
  budget: number; // in USD
  commission: number; // in USD
  commissionPercent: number; // default 2%
  source: string;
  notes?: string;
  createdAt: string | Date;
  updatedAt?: string | Date;
}

interface CollectionItem {
  id: string;
  shareCode: string;
  title: string;
  notes: string;
  propertyIds: string;
  viewsCount: number;
  agentName: string;
  agentPhone: string;
  createdAt: string;
}

const COLUMNS: { id: LeadStatus; title: string; titleTg: string; color: string; badgeColor: string }[] = [
  {
    id: "new",
    title: "Новые отклики",
    titleTg: "Дархостҳои нав",
    color: "border-sky-200 bg-sky-50/40",
    badgeColor: "bg-sky-100 text-sky-800 border-sky-200",
  },
  {
    id: "contacted",
    title: "В работе / Звонок",
    titleTg: "Дар коркард / Занг",
    color: "border-amber-200 bg-amber-50/40",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
  },
  {
    id: "showing",
    title: "Назначен показ",
    titleTg: "Нишондиҳӣ таъин шуд",
    color: "border-purple-200 bg-purple-50/40",
    badgeColor: "bg-purple-100 text-purple-800 border-purple-200",
  },
  {
    id: "deal",
    title: "Успешная сделка",
    titleTg: "Муомилаи бобарор",
    color: "border-emerald-200 bg-emerald-50/40",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  {
    id: "closed",
    title: "Архив / Отказ",
    titleTg: "Бойгонӣ / Рад шуд",
    color: "border-slate-200 bg-slate-50/40",
    badgeColor: "bg-slate-100 text-slate-700 border-slate-200",
  },
];

export default function BrokerCrmPage() {
  const { formatPrice, currency } = useCurrency();
  const { language } = useLanguage();
  const isTg = language === "tg";

  // State
  const [leads, setLeads] = useState<Lead[]>([]);
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"kanban" | "collections">("kanban");
  const [searchQuery, setSearchQuery] = useState("");

  // Drag and Drop
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);

  // Modals
  const [isNewLeadOpen, setIsNewLeadOpen] = useState(false);
  const [isEditLeadOpen, setIsEditLeadOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // New lead form
  const [newLeadForm, setNewLeadForm] = useState({
    clientName: "",
    clientPhone: "+992 ",
    classifiedTitle: "3-комнатная квартира с евроремонтом (18 мкр, Худжанд)",
    budget: 45000,
    commissionPercent: 2,
    source: "manual",
    notes: "",
  });

  // Share Collection Modal
  const [isCreateCollectionOpen, setIsCreateCollectionOpen] = useState(false);
  const [collectionForm, setCollectionForm] = useState({
    title: "Персональная подборка проверенных квартир в Худжанде",
    notes: "Здравствуйте! Отобрал для вас 3 самых надежных объекта с готовыми документами.",
    agentName: "Рустам Ахмедов (Маклер)",
    agentPhone: "+992 92 777 00 22",
    selectedPropertyIds: ["c1", "c4", "c2"],
  });
  const [generatedShareUrl, setGeneratedShareUrl] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // 1. Load Leads & Collections
  const loadData = async () => {
    try {
      setLoading(true);
      const [leadsRes, colRes] = await Promise.all([
        fetch("/api/crm/leads"),
        fetch("/api/crm/collections"),
      ]);

      const leadsData = await leadsRes.json();
      const colData = await colRes.json();

      if (leadsData.success) {
        setLeads(leadsData.leads);
      }
      if (colData.success) {
        setCollections(colData.collections);
      }
    } catch (err) {
      console.error("Failed to load CRM data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 2. Financial Metrics calculation
  const metrics = useMemo(() => {
    // В работе (все кроме closed)
    const activeDeals = leads.filter((l) => l.status !== "closed");
    const newLeadsToday = leads.filter((l) => l.status === "new");
    const successfulDeals = leads.filter((l) => l.status === "deal");

    const totalActiveVolume = activeDeals.reduce((sum, l) => sum + (l.budget || 0), 0);
    const potentialCommission = activeDeals.reduce((sum, l) => sum + (l.commission || 0), 0);
    const earnedThisMonth = successfulDeals.reduce((sum, l) => sum + (l.commission || 0), 0);

    return {
      activeCount: activeDeals.length,
      newCount: newLeadsToday.length,
      totalActiveVolume,
      potentialCommission,
      earnedThisMonth,
    };
  }, [leads]);

  // 3. Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("text/plain", id);
    setDraggedLeadId(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, targetStatus: LeadStatus) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData("text/plain") || draggedLeadId;
    if (!leadId) return;

    // Optimistic update
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: targetStatus } : l))
    );
    setDraggedLeadId(null);

    // Call API
    try {
      await fetch("/api/crm/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: leadId, status: targetStatus }),
      });
    } catch (err) {
      console.error("Failed to persist lead status:", err);
    }
  };

  // 4. Create Lead
  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/crm/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLeadForm),
      });
      const data = await res.json();
      if (data.success) {
        setLeads((prev) => [data.lead, ...prev]);
        setIsNewLeadOpen(false);
        setNewLeadForm({
          clientName: "",
          clientPhone: "+992 ",
          classifiedTitle: "3-комнатная квартира с евроремонтом (18 мкр, Худжанд)",
          budget: 45000,
          commissionPercent: 2,
          source: "manual",
          notes: "",
        });
      }
    } catch (err) {
      console.error("Error creating lead:", err);
    }
  };

  // 5. Update Lead
  const handleUpdateLead = async () => {
    if (!selectedLead) return;
    try {
      const res = await fetch("/api/crm/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedLead),
      });
      const data = await res.json();
      if (data.success) {
        setLeads((prev) =>
          prev.map((l) => (l.id === selectedLead.id ? data.lead : l))
        );
        setIsEditLeadOpen(false);
      }
    } catch (err) {
      console.error("Error updating lead:", err);
    }
  };

  // 6. Delete Lead
  const handleDeleteLead = async (id: string) => {
    if (!confirm("Удалить этот лид из воронки?")) return;
    try {
      await fetch(`/api/crm/leads?id=${id}`, { method: "DELETE" });
      setLeads((prev) => prev.filter((l) => l.id !== id));
      setIsEditLeadOpen(false);
    } catch (err) {
      console.error("Error deleting lead:", err);
    }
  };

  // 7. Create Collection for WhatsApp
  const handleCreateCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/crm/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: collectionForm.title,
          notes: collectionForm.notes,
          propertyIds: collectionForm.selectedPropertyIds,
          agentName: collectionForm.agentName,
          agentPhone: collectionForm.agentPhone,
        }),
      });
      const data = await res.json();
      if (data.success) {
        const fullUrl = `${window.location.origin}${data.shareUrl}`;
        setGeneratedShareUrl(fullUrl);
        setCollections((prev) => [data.collection, ...prev]);
      }
    } catch (err) {
      console.error("Error creating collection:", err);
    }
  };

  const togglePropertyInCollection = (id: string) => {
    setCollectionForm((prev) => {
      const exists = prev.selectedPropertyIds.includes(id);
      return {
        ...prev,
        selectedPropertyIds: exists
          ? prev.selectedPropertyIds.filter((p) => p !== id)
          : [...prev.selectedPropertyIds, id],
      };
    });
  };

  // Filtered leads
  const filteredLeads = useMemo(() => {
    if (!searchQuery) return leads;
    const q = searchQuery.toLowerCase();
    return leads.filter(
      (l) =>
        l.clientName.toLowerCase().includes(q) ||
        l.clientPhone.toLowerCase().includes(q) ||
        (l.classifiedTitle && l.classifiedTitle.toLowerCase().includes(q)) ||
        (l.notes && l.notes.toLowerCase().includes(q))
    );
  }, [leads, searchQuery]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 text-slate-900">
      {/* 1. TOP HEADER & NAVIGATION */}
      <div className="bg-white border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-5">
        <div className="max-w-7xl mx-auto">
          <ProfileNav />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-4 pt-4 border-t border-slate-100">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase font-bold tracking-wider text-emerald-600 mb-1">
                <Users className="h-3.5 w-3.5" />
                {isTg ? "B2B CRM-и даллал ва агентӣ" : "B2B CRM Маклера и Агентства"}
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                {isTg ? "Воронкаи канбании мизоҷон ва муомилаҳо" : "Канбан-воронка лидов & Сделок"}
                <Badge className="bg-emerald-50 text-emerald-800 border-emerald-200 text-xs font-semibold">
                  Sogd CRM Lite
                </Badge>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {isTg
                  ? "Баҳисобгирии зангҳои даромад, муроҷиатҳои WhatsApp, нишондиҳиҳо ва ҳисобкунаки ҳаққи хизмат"
                  : "Учет входящих звонков, WhatsApp-откликов, показов и калькулятор ожидаемой комиссии"}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <Button
                variant="outline"
                onClick={() => {
                  setGeneratedShareUrl(null);
                  setIsCreateCollectionOpen(true);
                }}
                className="h-9 px-3 text-xs font-semibold gap-1.5 border-emerald-300 text-emerald-700 bg-emerald-50/50 hover:bg-emerald-100/50 cursor-pointer"
              >
                <Share2 className="h-3.5 w-3.5 text-emerald-600" />
                {isTg ? "Маҷмӯа ба WhatsApp" : "Подборка в WhatsApp"}
              </Button>

              <Button
                onClick={() => setIsNewLeadOpen(true)}
                className="h-9 px-3.5 text-xs font-semibold gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                {isTg ? "Мизоҷи нав" : "Новый лид"}
              </Button>
            </div>
          </div>
        </div>

        {/* TAB SWITCHER */}
        <div className="max-w-7xl mx-auto flex items-center gap-6 mt-6 border-t border-slate-100 pt-3">
          <button
            type="button"
            onClick={() => setActiveTab("kanban")}
            className={`pb-2 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === "kanban"
                ? "border-emerald-600 text-emerald-600"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <Layers className="h-4 w-4" />
            {isTg ? "Лавҳаи канбан" : "Канбан-доска"}
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold">
              {leads.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("collections")}
            className={`pb-2 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === "collections"
                ? "border-emerald-600 text-emerald-600"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <Share2 className="h-4 w-4" />
            {isTg ? "Маҷмӯаҳо барои мизоҷон" : "Подборки для клиентов"}
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold">
              {collections.length}
            </span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* 2. SUMMARY METRICS WIDGET (FINANCIAL PIPELINE) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-white border-slate-200/80 shadow-xs">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">
                  {isTg ? "Муомилаҳо дар коркард" : "Сделок в работе"}
                </p>
                <div className="text-2xl font-extrabold text-slate-900 mt-1">
                  {metrics.activeCount}{" "}
                  <span className="text-xs font-normal text-slate-400">
                    {isTg ? "мизоҷ" : "клиентов"}
                  </span>
                </div>
                <p className="text-[11px] text-emerald-600 font-medium mt-0.5">
                  +{metrics.newCount} {isTg ? "нав имрӯз" : "новых сегодня"}
                </p>
              </div>
              <div className="h-11 w-11 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <Users className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200/80 shadow-xs">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">
                  {isTg ? "Ҳаҷми муомилаҳо дар гардиш" : "Объем сделок в пайплайне"}
                </p>
                <div className="text-2xl font-extrabold text-slate-900 mt-1">
                  ${metrics.totalActiveVolume.toLocaleString()}
                </div>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                  ≈ {(metrics.totalActiveVolume * 10.95).toLocaleString()} TJS
                </p>
              </div>
              <div className="h-11 w-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Building className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200/80 shadow-xs">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">
                  {isTg ? "Ҳаққи хизмати пешбинишуда" : "Ожидаемая комиссия"}
                </p>
                <div className="text-2xl font-extrabold text-emerald-600 mt-1">
                  ${metrics.potentialCommission.toLocaleString()}
                </div>
                <p className="text-[11px] text-emerald-700 font-medium mt-0.5">
                  {isTg ? "бо меъёри даллалӣ ~2%" : "при ставке маклера ~2%"}
                </p>
              </div>
              <div className="h-11 w-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Sparkles className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200/80 shadow-xs">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">
                  {isTg ? "Даромад дар ин моҳ" : "Заработано в этом месяце"}
                </p>
                <div className="text-2xl font-extrabold text-slate-900 mt-1">
                  ${metrics.earnedThisMonth.toLocaleString()}
                </div>
                <p className="text-[11px] text-emerald-600 font-medium mt-0.5">
                  {isTg ? "аз рӯи муомилаҳои анҷомёфта" : "по закрытым сделкам"}
                </p>
              </div>
              <div className="h-11 w-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <DollarSign className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 3. KANBAN TAB */}
        {activeTab === "kanban" && (
          <div className="space-y-4">
            {/* Search and filters bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200/80">
              <div className="relative w-full sm:w-80">
                <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-400" />
                <Input
                  placeholder={
                    isTg
                      ? "Ҷустуҷӯ аз рӯи ном, рақам, иншоот..."
                      : "Поиск по имени, номеру, объекту..."
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 text-xs border-slate-200 bg-slate-50 focus:bg-white"
                />
              </div>

              <div className="text-xs text-slate-500 font-medium">
                💡 <span className="text-slate-700 font-semibold">{isTg ? "Маслиҳат:" : "Подсказка:"}</span>{" "}
                {isTg
                  ? "Барои иваз кардани вазъи муомила, кортҳоро байни сутунҳо бо муш кашед."
                  : "Перетаскивайте карточки мышкой между колонками для смены статуса сделки."}
              </div>
            </div>

            {/* Kanban Columns Grid */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4 items-start">
              {COLUMNS.map((col) => {
                const columnLeads = filteredLeads.filter((l) => l.status === col.id);
                const colSumBudget = columnLeads.reduce((s, l) => s + (l.budget || 0), 0);

                return (
                  <div
                    key={col.id}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, col.id)}
                    className={`rounded-2xl border ${col.color} p-3 flex flex-col min-h-[500px] transition-colors`}
                  >
                    {/* Column Header */}
                    <div className="flex items-center justify-between mb-3 px-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-slate-900 tracking-tight">
                          {isTg ? col.titleTg || col.title : col.title}
                        </span>
                        <Badge className={`${col.badgeColor} text-[10px] px-1.5 py-0 h-4 font-bold`}>
                          {columnLeads.length}
                        </Badge>
                      </div>

                      <span className="text-[10px] font-mono text-slate-500 font-medium">
                        ${colSumBudget.toLocaleString()}
                      </span>
                    </div>

                    {/* Leads Cards Container */}
                    <div className="space-y-2.5 flex-1">
                      {columnLeads.length === 0 ? (
                        <div className="h-28 rounded-xl border border-dashed border-slate-200/80 flex items-center justify-center text-[11px] text-slate-400 text-center p-3">
                          {isTg ? "Мизоҷро ба ин ҷо кашед" : "Перетащите лид сюда"}
                        </div>
                      ) : (
                        columnLeads.map((lead) => {
                          const cleanPhone = lead.clientPhone.replace(/\D/g, "");
                          const waText = encodeURIComponent(
                            isTg
                              ? `Салом, ${lead.clientName}! Оид ба иншооти «${lead.classifiedTitle || "амвол"}» дар Хуҷанд.`
                              : `Здравствуйте, ${lead.clientName}! По поводу объекта «${lead.classifiedTitle || "недвижимости"}» в Худжанде.`
                          );

                          return (
                            <div
                              key={lead.id}
                              draggable
                              onDragStart={(e) => handleDragStart(e, lead.id)}
                              onClick={() => {
                                setSelectedLead({ ...lead });
                                setIsEditLeadOpen(true);
                              }}
                              className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-xs hover:border-emerald-400 hover:shadow-md cursor-grab active:cursor-grabbing transition-all space-y-2.5 group"
                            >
                              {/* Top row: Client name & Source */}
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <h4 className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors">
                                    {lead.clientName}
                                  </h4>
                                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                                    {lead.clientPhone}
                                  </p>
                                </div>

                                <Badge
                                  variant="secondary"
                                  className="text-[9px] px-1.5 py-0 bg-slate-100 text-slate-600 font-medium"
                                >
                                  {lead.source === "whatsapp_click"
                                    ? "WhatsApp"
                                    : lead.source === "phone_click"
                                    ? (isTg ? "Занг" : "Звонок")
                                    : (isTg ? "Сомона" : "Сайт")}
                                </Badge>
                              </div>

                              {/* Attached property */}
                              {lead.classifiedTitle && (
                                <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg line-clamp-2 border border-slate-100 leading-tight">
                                  🏢 {lead.classifiedTitle}
                                </div>
                              )}

                              {/* Finance bar */}
                              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                                <div>
                                  <span className="text-[10px] text-slate-400 block font-semibold">
                                    {isTg ? "Буҷет" : "Бюджет"}
                                  </span>
                                  <span className="font-extrabold text-slate-900 font-mono">
                                    ${lead.budget.toLocaleString()}
                                  </span>
                                </div>

                                <div className="text-right">
                                  <span className="text-[10px] text-emerald-600 block font-semibold">
                                    {isTg ? `Ҳаққи хизмат (${lead.commissionPercent}%)` : `Комиссия (${lead.commissionPercent}%)`}
                                  </span>
                                  <span className="font-extrabold text-emerald-600 font-mono">
                                    +${lead.commission.toLocaleString()}
                                  </span>
                                </div>
                              </div>

                              {/* Quick Actions (Stage Selector, Call & WhatsApp) */}
                              <div
                                className="flex items-center justify-between gap-1.5 pt-1.5 border-t border-slate-100"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <select
                                  value={lead.status}
                                  onChange={async (e) => {
                                    e.stopPropagation();
                                    const newStatus = e.target.value as LeadStatus;
                                    setLeads((prev) =>
                                      prev.map((l) => (l.id === lead.id ? { ...l, status: newStatus } : l))
                                    );
                                    try {
                                      await fetch("/api/crm/leads", {
                                        method: "PATCH",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({ id: lead.id, status: newStatus }),
                                      });
                                    } catch (err) {
                                      console.error("Failed to update status", err);
                                    }
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                  className="h-7 text-[10px] rounded-lg border border-slate-200 bg-slate-50 font-semibold px-1.5 text-slate-700 cursor-pointer max-w-[130px] truncate"
                                >
                                  {COLUMNS.map((c) => (
                                    <option key={c.id} value={c.id}>
                                      {isTg ? c.titleTg : c.title}
                                    </option>
                                  ))}
                                </select>

                                <div className="flex items-center gap-1.5">
                                  <a
                                    href={`tel:${cleanPhone}`}
                                    className="h-7 w-7 rounded-lg border border-slate-200 text-slate-600 hover:text-emerald-600 hover:border-emerald-300 flex items-center justify-center transition-colors"
                                    title={isTg ? "Ба мизоҷ занг задан" : "Позвонить клиенту"}
                                  >
                                    <Phone className="h-3.5 w-3.5" />
                                  </a>

                                  <a
                                    href={`https://wa.me/${cleanPhone}?text=${waText}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="h-7 w-7 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-colors border border-emerald-100"
                                    title={isTg ? "Ба WhatsApp навиштан" : "Написать в WhatsApp"}
                                  >
                                    <MessageCircle className="h-3.5 w-3.5" />
                                  </a>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. COLLECTIONS TAB */}
        {activeTab === "collections" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {isTg ? "Маҷмӯаҳои таҳияшуда барои мизоҷон" : "Сформированные подборки для клиентов"}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isTg
                    ? "Пайвандҳо ба намоишгоҳи инфиродӣ бидуни рақамҳои соҳибмулк. Бо 1 клик ба WhatsApp фиристед."
                    : "Ссылки на персональные витрины без контактов собственников. Отправляйте в WhatsApp в 1 клик."}
                </p>
              </div>

              <Button
                onClick={() => {
                  setGeneratedShareUrl(null);
                  setIsCreateCollectionOpen(true);
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold gap-1.5 rounded-xl h-9"
              >
                <Plus className="h-4 w-4" />
                {isTg ? "Эҷоди маҷмӯаи нав" : "Создать новую подборку"}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {collections.map((col) => {
                const shareLink = typeof window !== "undefined" ? `${window.location.origin}/p/${col.shareCode}` : `/p/${col.shareCode}`;
                const waMessage = encodeURIComponent(
                  isTg
                    ? `Салом! Барои Шумо маҷмӯаи иншооти санҷидашудаи амволи ғайриманқулро дар Хуҷанд омода кардам: ${shareLink}`
                    : `Здравствуйте! Подготовил для вас персональную подборку проверенных объектов недвижимости в Худжанде: ${shareLink}`
                );

                return (
                  <Card key={col.id} className="bg-white border-slate-200/90 shadow-xs rounded-xl overflow-hidden">
                    <CardHeader className="p-4 pb-2">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-semibold mb-1">
                            /{col.shareCode}
                          </Badge>
                          <CardTitle className="text-base font-bold text-slate-900">
                            {col.title}
                          </CardTitle>
                        </div>

                        <div className="flex items-center gap-1 text-xs text-slate-500 font-medium shrink-0">
                          <Eye className="h-3.5 w-3.5 text-slate-400" />
                          <span>{col.viewsCount} {isTg ? "дидан" : "просмотров"}</span>
                        </div>
                      </div>
                      {col.notes && (
                        <CardDescription className="text-xs text-slate-500 italic mt-1 line-clamp-2">
                          «{col.notes}»
                        </CardDescription>
                      )}
                    </CardHeader>

                    <CardContent className="p-4 pt-2 space-y-3">
                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between text-xs font-mono text-slate-600">
                        <span className="truncate max-w-[260px]">{shareLink}</span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(shareLink);
                            alert(isTg ? "Пайванд нусхабардорӣ шуд!" : "Ссылка скопирована в буфер обмена!");
                          }}
                          className="text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1 shrink-0 ml-2"
                        >
                          <Copy className="h-3.5 w-3.5" />
                          {isTg ? "Нусхабардорӣ" : "Копировать"}
                        </button>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-1">
                        <Link
                          href={`/p/${col.shareCode}`}
                          target="_blank"
                          className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          {isTg ? "Кушодани витрина" : "Открыть витрину"}
                        </Link>

                        <a
                          href={`https://wa.me/?text=${waMessage}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Button
                            size="sm"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold h-8 px-3 rounded-lg gap-1.5"
                          >
                            <MessageCircle className="h-3.5 w-3.5" />
                            {isTg ? "Ба WhatsApp фиристодан" : "Отправить в WhatsApp"}
                          </Button>
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 5. MODAL: CREATE NEW LEAD */}
      <Dialog open={isNewLeadOpen} onOpenChange={setIsNewLeadOpen}>
        <DialogContent className="sm:max-w-md bg-white rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900">
              {isTg ? "Иловаи мизоҷи нав ба воронка" : "Добавить нового клиента в воронку"}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              {isTg
                ? "Барои назорати зангҳо, нишондиҳиҳо ва ҳаққи хизмат корти харидорро эҷод кунед."
                : "Создайте карточку покупателя для отслеживания звонков, показов и комиссионных."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateLead} className="space-y-3.5 py-2">
            <div>
              <Label className="text-xs font-semibold text-slate-700">
                {isTg ? "Номи мизоҷ *" : "Имя клиента *"}
              </Label>
              <Input
                required
                placeholder={isTg ? "Масалан: Рустам Шарипов" : "Например: Рустам Шарипов"}
                value={newLeadForm.clientName}
                onChange={(e) =>
                  setNewLeadForm((prev) => ({ ...prev, clientName: e.target.value }))
                }
                className="mt-1 text-xs"
              />
            </div>

            <div>
              <Label className="text-xs font-semibold text-slate-700">
                {isTg ? "Рақами телефон *" : "Номер телефона *"}
              </Label>
              <Input
                required
                placeholder="+992 92 ___ __ __"
                value={newLeadForm.clientPhone}
                onChange={(e) =>
                  setNewLeadForm((prev) => ({ ...prev, clientPhone: e.target.value }))
                }
                className="mt-1 text-xs font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold text-slate-700">
                  {isTg ? "Буҷет ($) *" : "Бюджет ($) *"}
                </Label>
                <Input
                  type="number"
                  required
                  value={newLeadForm.budget}
                  onChange={(e) =>
                    setNewLeadForm((prev) => ({ ...prev, budget: Number(e.target.value) }))
                  }
                  className="mt-1 text-xs font-mono"
                />
              </div>

              <div>
                <Label className="text-xs font-semibold text-slate-700">
                  {isTg ? "Ҳаққи хизмати даллал (%)" : "Комиссия маклера (%)"}
                </Label>
                <Input
                  type="number"
                  value={newLeadForm.commissionPercent}
                  onChange={(e) =>
                    setNewLeadForm((prev) => ({
                      ...prev,
                      commissionPercent: Number(e.target.value),
                    }))
                  }
                  className="mt-1 text-xs font-mono"
                />
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-between text-xs">
              <span className="text-emerald-800 font-medium">
                {isTg ? "Пардохти пешбинишуда:" : "Ожидаемая выплата:"}
              </span>
              <strong className="text-emerald-700 font-mono text-sm">
                ${Math.round((newLeadForm.budget * newLeadForm.commissionPercent) / 100)}
              </strong>
            </div>

            <div>
              <Label className="text-xs font-semibold text-slate-700">
                {isTg ? "Иншооти мавриди таваҷҷуҳ" : "Интересующий объект"}
              </Label>
              <Input
                value={newLeadForm.classifiedTitle}
                onChange={(e) =>
                  setNewLeadForm((prev) => ({ ...prev, classifiedTitle: e.target.value }))
                }
                className="mt-1 text-xs"
              />
            </div>

            <div>
              <Label className="text-xs font-semibold text-slate-700">
                {isTg ? "Қайдҳо / Талаботҳо" : "Заметки / Требования"}
              </Label>
              <Textarea
                placeholder={
                  isTg
                    ? "Ошёнаи 3-5 меҷӯяд, омода ба пешпардохт, савдо мешавад..."
                    : "Ищет этаж 3-5, готов на задаток, торг..."
                }
                value={newLeadForm.notes}
                onChange={(e) =>
                  setNewLeadForm((prev) => ({ ...prev, notes: e.target.value }))
                }
                className="mt-1 text-xs min-h-[70px]"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsNewLeadOpen(false)}
                className="text-xs"
              >
                {isTg ? "Бекор кардан" : "Отмена"}
              </Button>
              <Button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
              >
                {isTg ? "Эҷоди мизоҷ" : "Создать лид"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 6. MODAL: EDIT LEAD & TIMELINE */}
      <Dialog open={isEditLeadOpen} onOpenChange={setIsEditLeadOpen}>
        {selectedLead && (
          <DialogContent className="sm:max-w-lg bg-white rounded-2xl">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className="text-lg font-bold text-slate-900">
                  {isTg ? `Корти мизоҷ: ${selectedLead.clientName}` : `Карточка клиента: ${selectedLead.clientName}`}
                </DialogTitle>
                <Badge
                  className="text-xs font-semibold uppercase"
                  variant="outline"
                >
                  {selectedLead.status}
                </Badge>
              </div>
              <DialogDescription className="text-xs text-slate-500">
                {isTg
                  ? "Таҳрири муомила, таърихи нишондиҳӣ ва ҳисоби ҳаққи хизмат."
                  : "Редактирование параметров сделки, истории показов и расчет комиссии."}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3.5 py-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-semibold text-slate-700">
                    {isTg ? "Ному насаби мизоҷ" : "ФИО клиента"}
                  </Label>
                  <Input
                    value={selectedLead.clientName}
                    onChange={(e) =>
                      setSelectedLead((prev) => prev && { ...prev, clientName: e.target.value })
                    }
                    className="mt-1 text-xs"
                  />
                </div>

                <div>
                  <Label className="text-xs font-semibold text-slate-700">
                    {isTg ? "Телефон" : "Телефон"}
                  </Label>
                  <Input
                    value={selectedLead.clientPhone}
                    onChange={(e) =>
                      setSelectedLead((prev) => prev && { ...prev, clientPhone: e.target.value })
                    }
                    className="mt-1 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs font-semibold text-slate-700">
                  {isTg ? "Вазъ дар воронка" : "Статус в воронке"}
                </Label>
                <div className="grid grid-cols-5 gap-1.5 mt-1.5">
                  {COLUMNS.map((col) => (
                    <button
                      key={col.id}
                      type="button"
                      onClick={() =>
                        setSelectedLead((prev) => prev && { ...prev, status: col.id })
                      }
                      className={`text-[10px] font-semibold py-1.5 rounded-lg border transition-all ${
                        selectedLead.status === col.id
                          ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {(isTg ? col.titleTg || col.title : col.title).split(" ")[0]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-semibold text-slate-700">
                    {isTg ? "Буҷет ($)" : "Бюджет ($)"}
                  </Label>
                  <Input
                    type="number"
                    value={selectedLead.budget}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setSelectedLead((prev) => {
                        if (!prev) return null;
                        const comm = Math.round((val * prev.commissionPercent) / 100);
                        return { ...prev, budget: val, commission: comm };
                      });
                    }}
                    className="mt-1 text-xs font-mono"
                  />
                </div>

                <div>
                  <Label className="text-xs font-semibold text-slate-700">
                    {isTg ? "Ҳаққи хизмати даллал ($)" : "Комиссия маклера ($)"}
                  </Label>
                  <Input
                    type="number"
                    value={selectedLead.commission}
                    onChange={(e) =>
                      setSelectedLead((prev) => prev && { ...prev, commission: Number(e.target.value) })
                    }
                    className="mt-1 text-xs font-mono text-emerald-600 font-bold"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs font-semibold text-slate-700">
                  {isTg ? "Таърихи қайдҳо ва мувофиқаҳо" : "История заметок & Договоренности"}
                </Label>
                <Textarea
                  value={selectedLead.notes || ""}
                  onChange={(e) =>
                    setSelectedLead((prev) => prev && { ...prev, notes: e.target.value })
                  }
                  className="mt-1 text-xs min-h-[90px]"
                />
              </div>

              {/* Direct Communication Bar */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-600 font-medium">
                  {isTg ? "Ҳозир дар тамос шавед:" : "Связаться прямо сейчас:"}
                </span>
                <div className="flex items-center gap-2">
                  <a href={`tel:${selectedLead.clientPhone.replace(/\D/g, "")}`}>
                    <Button size="sm" variant="outline" className="h-8 text-xs font-semibold gap-1">
                      <Phone className="h-3.5 w-3.5 text-emerald-600" />
                      {isTg ? "Занг задан" : "Позвонить"}
                    </Button>
                  </a>

                  <a
                    href={`https://wa.me/${selectedLead.clientPhone.replace(/\D/g, "")}?text=${encodeURIComponent(
                      isTg
                        ? `Салом, ${selectedLead.clientName}!`
                        : `Здравствуйте, ${selectedLead.clientName}!`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button size="sm" className="h-8 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white gap-1">
                      <MessageCircle className="h-3.5 w-3.5" />
                      WhatsApp
                    </Button>
                  </a>
                </div>
              </div>
            </div>

            <DialogFooter className="flex items-center justify-between pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => handleDeleteLead(selectedLead.id)}
                className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 gap-1"
              >
                <Trash2 className="h-3.5 w-3.5" />
                {isTg ? "Нобуд кардан" : "Удалить"}
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditLeadOpen(false)}
                  className="text-xs"
                >
                  {isTg ? "Пӯшидан" : "Закрыть"}
                </Button>
                <Button
                  type="button"
                  onClick={handleUpdateLead}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
                >
                  {isTg ? "Сабт кардан" : "Сохранить"}
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* 7. MODAL: CREATE WHATSAPP COLLECTION */}
      <Dialog open={isCreateCollectionOpen} onOpenChange={setIsCreateCollectionOpen}>
        <DialogContent className="sm:max-w-xl bg-white rounded-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Share2 className="h-5 w-5 text-emerald-600" />
              {isTg ? "Генератори маҷмӯаи инфиродӣ барои мизоҷ" : "Генератор персональной подборки для клиента"}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              {isTg
                ? "Витринаи мобилиро бо алоқаи худ (бидуни рақами соҳибмулк) созед ва ба WhatsApp фиристед."
                : "Создайте мобильную витрину со своими контактами (без прямых номеров собственников) и отправьте клиенту в WhatsApp."}
            </DialogDescription>
          </DialogHeader>

          {generatedShareUrl ? (
            <div className="space-y-4 py-3">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                <div className="h-10 w-10 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-sm">
                  <Check className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900">
                  {isTg ? "Маҷмӯа бомуваффақият омода шуд!" : "Подборка успешно создана!"}
                </h3>
                <p className="text-xs text-slate-600">
                  {isTg
                    ? "Мизоҷ саҳифаро бо ном, телефон ва иншооти интихобкардаи Шумо мебинад."
                    : "Клиент увидит чистую страницу с вашим именем, телефоном и выбранными объектами."}
                </p>
                <div className="p-2.5 bg-white rounded-lg border border-emerald-200 font-mono text-xs text-slate-800 break-all select-all">
                  {generatedShareUrl}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(generatedShareUrl);
                    setCopiedUrl(true);
                    setTimeout(() => setCopiedUrl(false), 2000);
                  }}
                  className="flex-1 text-xs font-semibold h-10 gap-1.5"
                >
                  {copiedUrl ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                  {copiedUrl ? (isTg ? "Нусхабардорӣ шуд!" : "Скопировано!") : (isTg ? "Нусхабардории пайванд" : "Скопировать ссылку")}
                </Button>

                <a
                  href={`https://wa.me/?text=${encodeURIComponent(
                    isTg
                      ? `Салом! Барои Шумо маҷмӯаи иншооти санҷидашудаи амволи ғайриманқулро дар Хуҷанд омода кардам: ${generatedShareUrl}`
                      : `Здравствуйте! Подготовил для вас персональную подборку проверенных вариантов недвижимости в Худжанде: ${generatedShareUrl}`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1"
                >
                  <Button className="w-full text-xs font-semibold h-10 bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5">
                    <MessageCircle className="h-4 w-4" />
                    {isTg ? "Ба WhatsApp фиристодан" : "Отправить в WhatsApp"}
                  </Button>
                </a>
              </div>

              <div className="text-center pt-2">
                <Link
                  href={generatedShareUrl}
                  target="_blank"
                  className="text-xs font-semibold text-emerald-600 hover:underline inline-flex items-center gap-1"
                >
                  {isTg ? "Дидани саҳифа бо чашми мизоҷ" : "Посмотреть страницу глазами клиента"}{" "}
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleCreateCollection} className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-semibold text-slate-700">
                    {isTg ? "Номи даллал (маклери амвол)" : "Имя маклера"}
                  </Label>
                  <Input
                    required
                    value={collectionForm.agentName}
                    onChange={(e) =>
                      setCollectionForm((prev) => ({ ...prev, agentName: e.target.value }))
                    }
                    className="mt-1 text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-slate-700">
                    {isTg ? "WhatsApp / Телефони шумо" : "Ваш WhatsApp / Телефон"}
                  </Label>
                  <Input
                    required
                    value={collectionForm.agentPhone}
                    onChange={(e) =>
                      setCollectionForm((prev) => ({ ...prev, agentPhone: e.target.value }))
                    }
                    className="mt-1 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs font-semibold text-slate-700">
                  {isTg ? "Сарлавҳаи маҷмӯа" : "Заголовок подборки"}
                </Label>
                <Input
                  required
                  value={collectionForm.title}
                  onChange={(e) =>
                    setCollectionForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="mt-1 text-xs"
                />
              </div>

              <div>
                <Label className="text-xs font-semibold text-slate-700">
                  {isTg ? "Паёми шахсӣ ба мизоҷ" : "Личное приветствие клиенту"}
                </Label>
                <Textarea
                  value={collectionForm.notes}
                  onChange={(e) =>
                    setCollectionForm((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  className="mt-1 text-xs min-h-[60px]"
                />
              </div>

              {/* Property Selector from catalog */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-xs font-semibold text-slate-700">
                    {isTg ? "Иншоотҳоро барои маҷмӯа интихоб намоед:" : "Выберите объекты для включения в подборку:"}
                  </Label>
                  <span className="text-[11px] font-bold text-emerald-600">
                    {isTg ? "Интихобшуда: " : "Выбрано: "}{collectionForm.selectedPropertyIds.length}
                  </span>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {CATALOG_PROPERTIES.map((prop) => {
                    const isSelected = collectionForm.selectedPropertyIds.includes(prop.id);

                    return (
                      <div
                        key={prop.id}
                        onClick={() => togglePropertyInCollection(prop.id)}
                        className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                          isSelected
                            ? "bg-emerald-50/70 border-emerald-300"
                            : "bg-slate-50 border-slate-200/80 hover:bg-slate-100/70"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={prop.image}
                            alt=""
                            className="h-12 w-16 rounded-lg object-cover shrink-0"
                          />
                          <div>
                            <h5 className="font-bold text-xs text-slate-900 line-clamp-1">
                              {prop.title}
                            </h5>
                            <p className="text-[11px] text-slate-500 font-medium">
                              {prop.city}, {prop.district} • {isTg ? `${prop.rooms} ҳуҷр. (${prop.area} м²)` : `${prop.rooms} комн. (${prop.area} м²)`}
                            </p>
                            <span className="font-extrabold text-xs text-emerald-600 font-mono">
                              ${prop.priceUsd.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <div className="shrink-0">
                          {isSelected ? (
                            <CheckSquare className="h-5 w-5 text-emerald-600" />
                          ) : (
                            <Square className="h-5 w-5 text-slate-300" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateCollectionOpen(false)}
                  className="text-xs"
                >
                  {isTg ? "Бекор кардан" : "Отмена"}
                </Button>
                <Button
                  type="submit"
                  disabled={collectionForm.selectedPropertyIds.length === 0}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
                >
                  {isTg
                    ? `Таҳияи маҷмӯа (${collectionForm.selectedPropertyIds.length})`
                    : `Сформировать подборку (${collectionForm.selectedPropertyIds.length})`}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
