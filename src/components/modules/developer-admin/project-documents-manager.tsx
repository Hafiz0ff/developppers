"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  ProjectDocument,
  ProjectDocumentsConfig,
  StandardDocumentType,
} from "@/types/documents";
import {
  formatDocumentDate,
  formatFileSize,
  validatePdfFile,
} from "@/lib/documents";
import { useLanguage } from "@/lib/i18n/language-context";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Upload,
  Eye,
  Trash2,
  RefreshCw,
  Save,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  Sparkles,
  ExternalLink,
  Layers,
  Info,
} from "lucide-react";
import { PdfViewerModal } from "@/components/modules/projects/pdf-viewer-modal";

interface ProjectDocumentsManagerProps {
  projectId: string;
  projectName: string;
  initialConfig?: ProjectDocumentsConfig;
  initialDocuments?: ProjectDocument[];
  onSave?: (data: {
    config: ProjectDocumentsConfig;
    documents: ProjectDocument[];
  }) => void;
}

const STANDARD_SLOTS: {
  type: StandardDocumentType;
  titleRu: string;
  titleTg: string;
  descRu: string;
  descTg: string;
}[] = [
  {
    type: "construction_permit",
    titleRu: "Разрешение на строительство",
    titleTg: "Иҷозатномаи сохтмон",
    descRu: "Главный разрешительный документ на проведение строительно-монтажных работ.",
    descTg: "Ҳуҷҷати асосии иҷозатдиҳӣ барои корҳои сохтмонӣ ва васлкунӣ.",
  },
  {
    type: "address_decree",
    titleRu: "Постановление о присвоении адреса",
    titleTg: "Қарор дар бораи вобаста намудани суроға",
    descRu: "Официальное решение органа исполнительной власти о присвоении почтового адреса.",
    descTg: "Қарори расмии мақомоти иҷроия дар бораи таъин намудани суроғаи расмӣ.",
  },
  {
    type: "commissioning_act",
    titleRu: "Разрешение на ввод в эксплуатацию",
    titleTg: "Иҷозатномаи ба истифода додан",
    descRu: "Акт государственной приёмочной комиссии о готовности объекта к заселению.",
    descTg: "Санади расмии комиссияи давлатӣ оид ба омода будани иншоот барои истифода.",
  },
];

export function ProjectDocumentsManager({
  projectId,
  projectName,
  initialConfig,
  initialDocuments = [],
  onSave,
}: ProjectDocumentsManagerProps) {
  const { language } = useLanguage();
  const isTg = language === "tg";

  const storageKey = `sogd_dev_admin_documents_${projectId}`;

  // Master switch
  const [isEnabled, setIsEnabled] = useState<boolean>(() => {
    return initialConfig?.isEnabled ?? true;
  });

  // Watermark settings
  const [isWatermarkEnabled, setIsWatermarkEnabled] = useState<boolean>(() => {
    return initialConfig?.isWatermarkEnabled ?? true;
  });
  const [watermarkText, setWatermarkText] = useState<string>(() => {
    return initialConfig?.watermarkText || `${projectName} • sogd-realty.tj`;
  });
  const [watermarkOpacity, setWatermarkOpacity] = useState<number>(() => {
    return initialConfig?.watermarkOpacity ?? 0.18;
  });

  // Documents list
  const [documents, setDocuments] = useState<ProjectDocument[]>(() => {
    return initialDocuments;
  });

  // UI state
  const [previewDoc, setPreviewDoc] = useState<ProjectDocument | null>(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Hidden file inputs
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.config) {
          setIsEnabled(parsed.config.isEnabled ?? true);
          setIsWatermarkEnabled(parsed.config.isWatermarkEnabled ?? true);
          if (parsed.config.watermarkText) setWatermarkText(parsed.config.watermarkText);
          if (parsed.config.watermarkOpacity !== undefined) {
            setWatermarkOpacity(parsed.config.watermarkOpacity);
          }
        }
        if (Array.isArray(parsed.documents)) {
          setDocuments(parsed.documents);
        }
      }
    } catch {
      // ignore
    }
  }, [storageKey]);

  // Handle file upload/replace
  const handleFileUpload = (
    type: StandardDocumentType,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);

    const validation = validatePdfFile(file.name, file.size);
    if (!validation.isValid) {
      setUploadError(validation.error || "Недопустимый файл");
      return;
    }

    const now = new Date().toISOString();
    const sizeKb = Math.round(file.size / 1024) || 1200;
    const blobUrl = URL.createObjectURL(file);

    const defaultTitle =
      STANDARD_SLOTS.find((s) => s.type === type)?.titleRu || "Официальный документ";
    const defaultTitleTg =
      STANDARD_SLOTS.find((s) => s.type === type)?.titleTg || "Ҳуҷҷати расмӣ";

    setDocuments((prev) => {
      const existingIdx = prev.findIndex((d) => d.type === type);
      if (existingIdx >= 0) {
        // Update existing document (replace file, update date)
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          fileUrl: blobUrl,
          watermarkedFileUrl: blobUrl,
          fileSizeKb: sizeKb,
          updatedAt: now,
        };
        return updated;
      } else {
        // Create new document in slot
        const newDoc: ProjectDocument = {
          id: `doc_${projectId}_${type}_${Date.now()}`,
          projectId,
          type,
          title: defaultTitle,
          titleTg: defaultTitleTg,
          documentNumber: `№ ${Math.floor(10 + Math.random() * 90)}/26`,
          fileUrl: blobUrl,
          watermarkedFileUrl: blobUrl,
          fileSizeKb: sizeKb,
          publishedAt: now,
          updatedAt: now,
          issuedDate: now,
          isPublished: true,
        };
        return [...prev, newDoc];
      }
    });

    // Reset input
    e.target.value = "";
  };

  // Toggle publish state of individual document
  const handleTogglePublish = (docId: string) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === docId ? { ...d, isPublished: !d.isPublished } : d))
    );
  };

  // Update document title/number
  const handleUpdateDocField = (
    docId: string,
    field: keyof ProjectDocument,
    value: string
  ) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === docId ? { ...d, [field]: value } : d))
    );
  };

  // Remove document
  const handleRemoveDoc = (docId: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== docId));
  };

  // Save changes
  const handleSave = () => {
    setSaving(true);
    const config: ProjectDocumentsConfig = {
      isEnabled,
      isWatermarkEnabled,
      watermarkText: watermarkText.trim(),
      watermarkOpacity,
    };

    const payload = {
      config,
      documents,
    };

    try {
      localStorage.setItem(storageKey, JSON.stringify(payload));
    } catch {
      // ignore
    }

    if (onSave) {
      onSave(payload);
    }

    setTimeout(() => {
      setSaving(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }, 500);
  };

  const handleOpenPreview = (doc: ProjectDocument) => {
    setPreviewDoc(doc);
    setPreviewModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Alert banner if any upload error */}
      {uploadError && (
        <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-700 dark:text-red-300">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Top Banner & Master Switch */}
      <Card className="border-border/80 shadow-xs">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-emerald-600" />
                <CardTitle className="text-lg font-bold">
                  {isTg ? "Идоракунии бахши «Ҳуҷҷатҳо»" : "Управление блоком «Документы»"}
                </CardTitle>
                <Badge
                  variant="outline"
                  className={
                    isEnabled
                      ? "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300"
                      : "bg-muted text-muted-foreground"
                  }
                >
                  {isEnabled
                    ? isTg
                      ? "Дар витрина фаъол аст"
                      : "Опубликован на витрине"
                    : isTg
                    ? "Хомӯш карда шудааст"
                    : "Отключён"}
                </Badge>
              </div>
              <CardDescription className="text-xs">
                {isTg
                  ? "Иҷозатномаи сохтмон, қарор дар бораи вобаста намудани суроға ва дигар ҳуҷҷатҳои расмии иншоот."
                  : "Публикация разрешений на строительство, постановлений и актов ввода в эксплуатацию."}
              </CardDescription>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-muted/50 px-3 py-2 rounded-xl border border-border/60">
                <Switch
                  id="documents-master-switch"
                  checked={isEnabled}
                  onCheckedChange={setIsEnabled}
                  className="data-[state=checked]:bg-emerald-600"
                />
                <Label
                  htmlFor="documents-master-switch"
                  className="text-xs font-semibold cursor-pointer select-none"
                >
                  {isTg ? "Фаъол дар витрина" : "Включить на витрине"}
                </Label>
              </div>

              <Button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="h-9 text-xs font-semibold gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-xs"
              >
                {saving ? (
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                ) : savedSuccess ? (
                  <CheckCircle2 className="h-3.5 w-3.5" />
                ) : (
                  <Save className="h-3.5 w-3.5" />
                )}
                {savedSuccess
                  ? isTg
                    ? "Сабт шуд!"
                    : "Сохранено!"
                  : isTg
                  ? "Сабти тағйирот"
                  : "Сохранить изменения"}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="flex items-start gap-2 p-3 bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 rounded-xl text-xs text-amber-900 dark:text-amber-200">
            <Info className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
            <p className="leading-relaxed">
              {isTg
                ? "Қоидаи нигоҳдории маълумот: Хомӯш кардани ин бахш ҳуҷҷатҳои пештар боршударо нест намекунад. Онҳо дар пойгоҳи маълумот нигоҳ дошта шуда, пас аз фаъолшавӣ дубора намоиш дода мешаванд."
                : "Правило сохранности данных: Отключение блока полностью скрывает его на публичной витрине, но не удаляет ранее загруженные файлы. Они остаются сохранёнными в системе."}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 3 Standard Document Slots */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            {isTg ? "Ҳуҷҷатҳои стандартии иншоот" : "Стандартные документы объекта"}
          </h2>
          <span className="text-xs text-muted-foreground">
            {documents.filter((d) => d.isPublished).length} / {STANDARD_SLOTS.length}{" "}
            {isTg ? "нашр шудааст" : "опубликовано"}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {STANDARD_SLOTS.map((slot) => {
            const doc = documents.find((d) => d.type === slot.type);
            const inputId = `file-input-${slot.type}`;

            return (
              <Card
                key={slot.type}
                className={`border transition-all ${
                  doc
                    ? doc.isPublished
                      ? "border-emerald-500/40 bg-card shadow-xs"
                      : "border-border/80 bg-muted/20"
                    : "border-dashed border-border bg-card/50"
                }`}
              >
                <CardContent className="p-4 sm:p-5">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Left: Document info or empty slot */}
                    <div className="flex items-start gap-3.5 flex-1 min-w-0">
                      <div
                        className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${
                          doc
                            ? doc.isPublished
                              ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                              : "bg-muted text-muted-foreground border border-border"
                            : "bg-muted/40 text-muted-foreground/60 border border-dashed border-border"
                        }`}
                      >
                        <FileText className="h-5 w-5" />
                      </div>

                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-bold text-foreground truncate">
                            {doc
                              ? isTg && doc.titleTg
                                ? doc.titleTg
                                : doc.title
                              : isTg
                              ? slot.titleTg
                              : slot.titleRu}
                          </h3>

                          {doc ? (
                            <Badge
                              variant="outline"
                              className={`text-[10px] px-2 py-0.5 rounded-full ${
                                doc.isPublished
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300"
                                  : "bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300"
                              }`}
                            >
                              {doc.isPublished
                                ? isTg
                                  ? "Дар витрина нашр шуд"
                                  : "Опубликован"
                                : isTg
                                ? "Сиёҳнавис (Пинҳон)"
                                : "Черновик (Скрыт)"}
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="text-[10px] bg-muted/50 text-muted-foreground"
                            >
                              {isTg ? "Бор нашудааст" : "Не загружен"}
                            </Badge>
                          )}
                        </div>

                        <p className="text-xs text-muted-foreground">
                          {isTg ? slot.descTg : slot.descRu}
                        </p>

                        {/* Metadata if document exists */}
                        {doc && (
                          <div className="flex items-center gap-3 text-[11px] text-muted-foreground flex-wrap pt-0.5">
                            {doc.documentNumber && (
                              <span className="font-semibold text-foreground/80">
                                {doc.documentNumber}
                              </span>
                            )}
                            <span>•</span>
                            <span>{formatFileSize(doc.fileSizeKb)}</span>
                            <span>•</span>
                            <span>
                              {isTg ? "Санаи нашр:" : "Дата размещения:"}{" "}
                              <strong className="text-foreground">
                                {formatDocumentDate(doc.publishedAt)}
                              </strong>
                            </span>
                            {doc.updatedAt !== doc.publishedAt && (
                              <>
                                <span>•</span>
                                <span className="text-emerald-600">
                                  {isTg ? "Таҷдид:" : "Обновлён:"}{" "}
                                  {formatDocumentDate(doc.updatedAt)}
                                </span>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 flex-wrap shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-border/40">
                      {/* Hidden File Input */}
                      <input
                        type="file"
                        id={inputId}
                        accept=".pdf,application/pdf"
                        className="hidden"
                        ref={(el) => {
                          fileInputRefs.current[slot.type] = el;
                        }}
                        onChange={(e) => handleFileUpload(slot.type, e)}
                      />

                      {doc ? (
                        <>
                          <div className="flex items-center gap-1.5 mr-2">
                            <Switch
                              id={`publish-switch-${doc.id}`}
                              checked={doc.isPublished}
                              onCheckedChange={() => handleTogglePublish(doc.id)}
                              className="data-[state=checked]:bg-emerald-600"
                            />
                            <Label
                              htmlFor={`publish-switch-${doc.id}`}
                              className="text-xs text-muted-foreground cursor-pointer select-none"
                            >
                              {isTg ? "Нашр" : "Публикация"}
                            </Label>
                          </div>

                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenPreview(doc)}
                            className="h-8 text-xs font-semibold gap-1.5 cursor-pointer"
                          >
                            <Eye className="h-3.5 w-3.5 text-emerald-600" />
                            {isTg ? "Пешнамоиш" : "Просмотр"}
                          </Button>

                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => fileInputRefs.current[slot.type]?.click()}
                            className="h-8 text-xs gap-1.5 cursor-pointer"
                          >
                            <RefreshCw className="h-3.5 w-3.5" />
                            {isTg ? "Иваз намудан" : "Заменить"}
                          </Button>

                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveDoc(doc.id)}
                            className="h-8 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </>
                      ) : (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => fileInputRefs.current[slot.type]?.click()}
                          className="h-8 text-xs font-semibold gap-1.5 border-emerald-500/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 cursor-pointer"
                        >
                          <Upload className="h-3.5 w-3.5 text-emerald-600" />
                          {isTg ? "Боргирии PDF" : "Загрузить PDF"}
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Inline metadata edit form for existing doc */}
                  {doc && (
                    <div className="mt-4 pt-3 border-t border-border/50 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      <div>
                        <Label className="text-[11px] text-muted-foreground">
                          {isTg ? "Номи расмӣ (RU)" : "Наименование документа (RU)"}
                        </Label>
                        <Input
                          value={doc.title}
                          onChange={(e) => handleUpdateDocField(doc.id, "title", e.target.value)}
                          className="h-8 text-xs mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-[11px] text-muted-foreground">
                          {isTg ? "Номи расмӣ (TG)" : "Наименование документа (TG)"}
                        </Label>
                        <Input
                          value={doc.titleTg || ""}
                          onChange={(e) => handleUpdateDocField(doc.id, "titleTg", e.target.value)}
                          className="h-8 text-xs mt-1"
                          placeholder={isTg ? "Номи тоҷикӣ..." : "Название на таджикском..."}
                        />
                      </div>
                      <div>
                        <Label className="text-[11px] text-muted-foreground">
                          {isTg ? "Рақами сабт / қарор" : "Регистрационный номер"}
                        </Label>
                        <Input
                          value={doc.documentNumber || ""}
                          onChange={(e) =>
                            handleUpdateDocField(doc.id, "documentNumber", e.target.value)
                          }
                          className="h-8 text-xs mt-1"
                          placeholder="№ 142/24"
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Watermark Protection Settings */}
      <Card className="border-border/80 shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-emerald-600" />
            <CardTitle className="text-base font-bold">
              {isTg
                ? "Муҳофизат бо нишонаи обӣ (Watermark)"
                : "Защита документов водяным знаком"}
            </CardTitle>
          </div>
          <CardDescription className="text-xs">
            {isTg
              ? "Ҳангоми намоиш ба саҳифаҳои ҳуҷҷат матни нимшаффоф гузошта мешавад. Аслии файл бетағйир мемонад."
              : "При открытии на публичной витрине на страницы накладывается ненавязчивый полупрозрачный текст. Исходный PDF сохраняется в первозданном виде."}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pt-1">
          <div className="flex items-center justify-between p-3 bg-muted/40 rounded-xl border border-border/60">
            <div className="space-y-0.5">
              <Label
                htmlFor="watermark-enabled-switch"
                className="text-xs font-semibold cursor-pointer select-none"
              >
                {isTg
                  ? "Нишонаи обиро ба ҳуҷҷатҳои оммавӣ илова кунед"
                  : "Добавлять водяной знак на публичные документы"}
              </Label>
              <p className="text-[11px] text-muted-foreground">
                {isTg
                  ? "Нишонаи обӣ матн ва муҳрҳои расмиро намепӯшонад ва нусхабардориро маҳдуд месозад."
                  : "Полупрозрачный текст под углом -25°, не закрывающий печати, подписи и QR-коды."}
              </p>
            </div>
            <Switch
              id="watermark-enabled-switch"
              checked={isWatermarkEnabled}
              onCheckedChange={setIsWatermarkEnabled}
              className="data-[state=checked]:bg-emerald-600"
            />
          </div>

          {isWatermarkEnabled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <Label className="text-xs font-semibold">
                  {isTg ? "Матни нишонаи обӣ" : "Текст водяного знака"}
                </Label>
                <Input
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                  className="h-9 text-xs"
                  placeholder={`${projectName} • Только для ознакомления`}
                />
                <p className="text-[11px] text-muted-foreground">
                  {isTg
                    ? "Тавсия мешавад: Номи иншоот ё ширкати сохтмонӣ."
                    : "Рекомендуется: Название жилого комплекса и указание площадки sogd-realty."}
                </p>

                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center justify-between text-xs">
                    <Label className="text-xs font-semibold">
                      {isTg ? "Шаффофият (Transparency)" : "Прозрачность водяного знака"}
                    </Label>
                    <span className="font-mono text-muted-foreground">
                      {Math.round(watermarkOpacity * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.10"
                    max="0.35"
                    step="0.01"
                    value={watermarkOpacity}
                    onChange={(e) => setWatermarkOpacity(parseFloat(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>10% ({isTg ? "Хеле камнамо" : "Тонкий"})</span>
                    <span>18% ({isTg ? "Стандартӣ" : "Стандарт"})</span>
                    <span>35% ({isTg ? "Намоён" : "Заметный"})</span>
                  </div>
                </div>
              </div>

              {/* Live interactive visual sample of watermark */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">
                  {isTg ? "Пешнамоиши муҳофизатӣ" : "Интерактивный образец защиты"}
                </Label>
                <div className="relative h-36 rounded-xl border border-border/80 bg-white dark:bg-zinc-950 p-3 overflow-hidden shadow-inner flex flex-col justify-between select-none">
                  {/* Fake document lines */}
                  <div className="space-y-2">
                    <div className="h-2.5 w-1/3 bg-zinc-300 dark:bg-zinc-800 rounded-sm" />
                    <div className="h-2 w-4/5 bg-zinc-200 dark:bg-zinc-800/80 rounded-sm" />
                    <div className="h-2 w-2/3 bg-zinc-200 dark:bg-zinc-800/80 rounded-sm" />
                    <div className="h-2 w-3/4 bg-zinc-200 dark:bg-zinc-800/80 rounded-sm" />
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <div className="h-6 w-16 bg-zinc-200 dark:bg-zinc-800 rounded-sm" />
                    <div className="h-7 w-7 rounded-full border border-blue-400/40 bg-blue-50/50 dark:bg-blue-950/40 flex items-center justify-center text-[8px] text-blue-600 font-bold">
                      ПЕЧАТЬ
                    </div>
                  </div>

                  {/* Watermark overlay */}
                  <div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none transform -rotate-12 transition-opacity"
                    style={{ opacity: watermarkOpacity }}
                  >
                    <span className="text-sm font-extrabold uppercase tracking-widest text-zinc-900 dark:text-zinc-100 whitespace-nowrap border-2 border-dashed border-zinc-500/40 px-3 py-1 rounded-md">
                      {watermarkText || "SOGD-REALTY"}
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground text-center">
                  {isTg
                    ? "Матн ва мӯҳри аслӣ таҳти нишона пурра хонда мешаванд."
                    : "Шрифт и печати остаются читаемыми под защитным слоем."}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* PDF Viewer Modal for Admin Testing */}
      <PdfViewerModal
        isOpen={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        document={previewDoc}
        projectName={projectName}
        isWatermarkEnabled={isWatermarkEnabled}
        watermarkText={watermarkText}
        watermarkOpacity={watermarkOpacity}
      />
    </div>
  );
}
