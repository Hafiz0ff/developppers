"use client";

import React, { useState } from "react";

type Props = {
  urls: string[];
  onChange: (urls: string[]) => void;
  disabled?: boolean;
};

export function PhotoUploader({ urls, onChange, disabled }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  async function uploadFiles(files: FileList | File[]) {
    const list = Array.from(files).slice(0, 10 - urls.length);
    if (list.length === 0) return;
    setError(null);
    setUploading(true);
    try {
      const form = new FormData();
      list.forEach((file) => form.append("files", file));
      const res = await fetch("/api/classifieds/photos", { method: "POST", body: form });
      const data = (await res.json()) as { success: boolean; urls?: string[]; error?: string };
      if (!data.success || !data.urls) {
        setError(
          data.error === "file_too_large"
            ? "Файл больше 10 МБ"
            : data.error === "unsupported_type"
              ? "Нужен JPEG, PNG или WebP"
              : "Не удалось загрузить фото"
        );
        return;
      }
      onChange([...urls, ...data.urls].slice(0, 10));
    } catch {
      setError("Не удалось загрузить фото");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-3">
      <label
        className={`block border-2 border-dashed rounded-xl p-6 text-center text-sm ${
          disabled ? "opacity-50" : "border-emerald-200 bg-emerald-50/40 cursor-pointer"
        }`}
      >
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          disabled={disabled || uploading || urls.length >= 10}
          className="hidden"
          onChange={(e) => {
            if (e.target.files) void uploadFiles(e.target.files);
          }}
        />
        {uploading ? "Загрузка…" : "Нажмите или перетащите фото с устройства (до 10)"}
      </label>
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
      <div className="grid grid-cols-3 gap-2">
        {urls.map((url, index) => (
          <div key={url} className="relative aspect-video rounded-lg overflow-hidden bg-slate-100">
            <img src={url} alt="" className="w-full h-full object-cover" />
            {index === 0 ? (
              <span className="absolute bottom-1 left-1 text-[10px] bg-black/60 text-white px-1.5 py-0.5 rounded">
                Обложка
              </span>
            ) : null}
            <button
              type="button"
              className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/60 text-white text-xs"
              onClick={() => onChange(urls.filter((item) => item !== url))}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
