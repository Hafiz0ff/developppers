"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ImageIcon,
  Plus,
  ArrowUp,
  ArrowDown,
  Star,
  Trash2,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/language-context";

interface ProjectGalleryManagerProps {
  images: string[];
  coverImageUrl: string;
  onChange: (images: string[], coverImageUrl: string) => void;
}

export function ProjectGalleryManager({
  images,
  coverImageUrl,
  onChange,
}: ProjectGalleryManagerProps) {
  const { language } = useLanguage();
  const isTg = language === "tg";
  const [newImageUrl, setNewImageUrl] = useState("");
  const [photoList, setPhotoList] = useState<string[]>(() => {
    // Ensure cover is first
    const list = [coverImageUrl, ...images.filter((img) => img !== coverImageUrl)];
    return Array.from(new Set(list));
  });

  const updateList = (newList: string[]) => {
    setPhotoList(newList);
    onChange(newList, newList[0] || coverImageUrl);
  };

  const handleMakeCover = (index: number) => {
    if (index === 0) return;
    const target = photoList[index];
    const filtered = photoList.filter((_, i) => i !== index);
    const updated = [target, ...filtered];
    updateList(updated);
  };

  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    const updated = [...photoList];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    updateList(updated);
  };

  const handleMoveDown = (index: number) => {
    if (index >= photoList.length - 1) return;
    const updated = [...photoList];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    updateList(updated);
  };

  const handleDelete = (index: number) => {
    if (photoList.length <= 1) return;
    const updated = photoList.filter((_, i) => i !== index);
    updateList(updated);
  };

  const handleAddPhoto = () => {
    if (!newImageUrl.trim()) return;
    const updated = [...photoList, newImageUrl.trim()];
    updateList(updated);
    setNewImageUrl("");
  };

  const handleAddSample = (sampleUrl: string) => {
    if (photoList.includes(sampleUrl)) return;
    updateList([...photoList, sampleUrl]);
  };

  return (
    <Card className="border shadow-xs">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-emerald-600" />
            {isTg ? "Нигористон ва муқоваи иншоот" : "Галерея и обложка объекта"}
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {isTg ? `${photoList.length} акс дар намоиш` : `${photoList.length} фото в показе`}
          </Badge>
        </div>
        <CardDescription className="text-xs">
          {isTg
            ? "Акси аввал ба таври худкор ҳамчун муқоваи асосӣ дар феҳрист ва корти иншоот истифода мешавад. Шумо метавонед тартиби аксҳоро иваз кунед ва муқоваро дар 1 клик таъйин намоед."
            : "Первое изображение автоматически используется как главная обложка в каталоге и в карточке объекта. Вы можете менять порядок фотографий и назначать обложку в 1 клик."}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        {/* Add photo bar */}
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <Input
            placeholder={
              isTg
                ? "Истиноди мустақим ба аксро гузоред (https://...)"
                : "Вставьте прямую ссылку на фото (https://...)"
            }
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            className="text-xs h-9"
          />
          <Button
            type="button"
            onClick={handleAddPhoto}
            disabled={!newImageUrl.trim()}
            className="w-full sm:w-auto h-9 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 shrink-0 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            {isTg ? "Иловаи акс" : "Добавить фото"}
          </Button>
        </div>

        {/* Quick sample photos */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
          <span className="text-[11px]">{isTg ? "Намунаҳои омода:" : "Готовые ракурсы:"}</span>
          {[
            {
              label: isTg ? "+ Намои шабона" : "+ Ночной фасад",
              url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&h=1000&fit=crop",
            },
            {
              label: isTg ? "+ Даромадгоҳи асосӣ" : "+ Входная группа",
              url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&h=1000&fit=crop",
            },
            {
              label: isTg ? "+ Боғи дохили ҳавлӣ" : "+ Двор-парк",
              url: "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=1600&h=1000&fit=crop",
            },
          ].map((sample) => (
            <button
              key={sample.label}
              type="button"
              onClick={() => handleAddSample(sample.url)}
              className="text-[11px] px-2 py-0.5 rounded-md bg-muted hover:bg-muted/80 text-foreground transition-colors cursor-pointer"
            >
              {sample.label}
            </button>
          ))}
        </div>

        {/* Photo Grid List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
          {photoList.map((url, idx) => {
            const isCover = idx === 0;

            return (
              <div
                key={`${url}-${idx}`}
                className={`relative rounded-xl border overflow-hidden bg-card transition-all flex flex-col justify-between ${
                  isCover
                    ? "ring-2 ring-emerald-500 border-emerald-500/50 shadow-md"
                    : "hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                {/* Image preview */}
                <div className="relative h-36 w-full bg-slate-900 overflow-hidden">
                  <img
                    src={url}
                    alt={isTg ? `Акси ${idx + 1}` : `Фото ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 flex items-center gap-1.5">
                    <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-md">
                      #{idx + 1}
                    </span>
                    {isCover && (
                      <Badge className="bg-emerald-600 text-white text-[10px] gap-1 font-semibold">
                        <Star className="h-2.5 w-2.5 fill-white" />
                        {isTg ? "Муқова" : "Обложка"}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Card footer controls */}
                <div className="p-2.5 flex items-center justify-between gap-1 bg-muted/20 border-t">
                  <div className="flex items-center gap-1">
                    {!isCover && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleMakeCover(idx)}
                        className="h-7 px-2 text-[11px] font-semibold text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 gap-1 cursor-pointer"
                        title={
                          isTg
                            ? "Ҳамчун муқоваи асосии лоиҳа таъйин кардан"
                            : "Назначить главной обложкой проекта"
                        }
                      >
                        <Star className="h-3 w-3" />
                        {isTg ? "Ба муқова" : "На обложку"}
                      </Button>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={idx === 0}
                      onClick={() => handleMoveUp(idx)}
                      className="h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer disabled:opacity-30"
                      title={isTg ? "Ба боло / чап" : "Переместить вверх / влево"}
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={idx === photoList.length - 1}
                      onClick={() => handleMoveDown(idx)}
                      className="h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer disabled:opacity-30"
                      title={isTg ? "Ба поён / рост" : "Переместить вниз / вправо"}
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={photoList.length <= 1}
                      onClick={() => handleDelete(idx)}
                      className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer disabled:opacity-30"
                      title={isTg ? "Нест кардани акс" : "Удалить фото"}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
