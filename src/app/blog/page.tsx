"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/language-context";
import { BLOG_ARTICLES } from "@/lib/data/blog-data";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Clock,
  Calendar,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";

export default function BlogIndexPage() {
  const { language, tDual } = useLanguage();
  const isTg = language === "tg";
  const [searchQuery, setSearchQuery] = useState("");

  const filteredArticles = BLOG_ARTICLES.filter((art) => {
    const q = searchQuery.toLowerCase();
    const title = (isTg ? art.titleTg : art.title).toLowerCase();
    const excerpt = (isTg ? art.excerptTg : art.excerpt).toLowerCase();
    return title.includes(q) || excerpt.includes(q);
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 pb-20">
      {/* Top Breadcrumb Bar */}
      <div className="bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800 sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Link href="/" className="hover:text-emerald-600 transition-colors">
              {isTg ? "Асосӣ" : "Главная"}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-semibold text-slate-900 dark:text-white">
              {isTg ? "Блог ва мақолаҳо" : "Блог и статьи"}
            </span>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 hover:text-emerald-600 font-medium transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>{isTg ? "Ба саҳифаи асосӣ" : "На главную"}</span>
          </Link>
        </div>
      </div>

      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs uppercase font-extrabold tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
              <BookOpen className="h-4 w-4" />
              <span>{tDual("Экспертный блог Maskani", "Блоги таҳлилии Maskani", "Maskani Editorial Blog")}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {tDual(
                "Статьи, аналитика и гид по недвижимости Таджикистана",
                "Мақолаҳо, таҳлилҳо ва роҳнамои амволи Тоҷикистон",
                "Real Estate Articles, Analytics & Guides in Tajikistan"
              )}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
              {tDual(
                "Практические руководства по покупке, аренде, ипотеке, оценке и инвестициям в новостройки Худжанда, Душанбе и Согдийской области.",
                "Дастурҳои амалӣ оид ба харид, иҷора, ипотека, баҳодиҳӣ ва сармоягузорӣ ба навсохтҳои Хуҷанд ва вилояти Суғд.",
                "Actionable guides on buying, renting, mortgage, valuation, and investments in Tajikistan real estate."
              )}
            </p>
          </div>

          {/* Search Box */}
          <div className="w-full md:w-72 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder={isTg ? "Ҷустуҷӯи мақола..." : "Поиск по статьям..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-white dark:bg-slate-900 rounded-xl border-slate-200 dark:border-slate-800 text-xs"
            />
          </div>
        </div>
      </div>

      {/* Articles Grid (4 cards in row on desktop) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredArticles.map((article) => {
            const title = isTg ? article.titleTg : article.title;
            const excerpt = isTg ? article.excerptTg : article.excerpt;
            const category = isTg ? article.categoryTg : article.category;

            return (
              <article
                key={article.id}
                className="group flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs hover:border-emerald-500/50 hover:shadow-[0_16px_36px_-12px_rgba(16,185,129,0.18)] hover:-translate-y-1 transition-all duration-300"
              >
                {/* Article Cover */}
                <Link
                  href={`/blog/${article.slug}`}
                  className="relative h-48 w-full overflow-hidden block bg-slate-900"
                >
                  <img
                    src={article.coverImage}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 z-10">
                    <Badge className="bg-slate-900/85 backdrop-blur-md text-white text-[11px] font-bold border-none px-2.5 py-0.5 rounded-lg">
                      {category}
                    </Badge>
                  </div>
                </Link>

                {/* Article Content */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {article.publishedAt}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {article.readTimeMin} {isTg ? "дақ." : "мин."}
                      </span>
                    </div>

                    <Link href={`/blog/${article.slug}`}>
                      <h2 className="font-bold text-slate-900 dark:text-white text-base line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {title}
                      </h2>
                    </Link>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                      {excerpt}
                    </p>
                  </div>

                  {/* Author & Read More */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <img
                        src={article.author.avatar}
                        alt={article.author.name}
                        className="h-6 w-6 rounded-full object-cover border border-slate-200"
                      />
                      <span className="font-medium text-slate-700 dark:text-slate-300 text-[11px] truncate max-w-[120px]">
                        {article.author.name}
                      </span>
                    </div>

                    <Link
                      href={`/blog/${article.slug}`}
                      className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 hover:gap-1.5 transition-all text-xs"
                    >
                      <span>{isTg ? "Мутолиа" : "Читать"}</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
