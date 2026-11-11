import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BLOG_ARTICLES, type BlogArticle } from "@/lib/data/blog-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  ArrowLeft,
  ChevronRight,
  Share2,
  Bookmark,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ lang?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = BLOG_ARTICLES.find((a) => a.slug === slug);
  if (!article) return { title: "Статья не найдена — Maskani.tj" };

  return {
    title: `${article.title} — Блог Maskani.tj`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [{ url: article.coverImage }],
    },
  };
}

export default async function BlogArticlePage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const isTg = sp?.lang === "tg";

  const article = BLOG_ARTICLES.find((a) => a.slug === slug);
  if (!article) {
    notFound();
  }

  const title = isTg ? article.titleTg : article.title;
  const excerpt = isTg ? article.excerptTg : article.excerpt;
  const category = isTg ? article.categoryTg : article.category;
  const paragraphs = isTg ? article.content.tg : article.content.ru;

  const otherArticles = BLOG_ARTICLES.filter((a) => a.slug !== slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-background dark:bg-slate-950 pb-20">
      {/* Top Breadcrumb Bar */}
      <div className="bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800 sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500 truncate">
            <Link href="/" className="hover:text-emerald-600 transition-colors">
              {isTg ? "Асосӣ" : "Главная"}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/blog" className="hover:text-emerald-600 transition-colors">
              {isTg ? "Блог" : "Блог"}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-xs">
              {title}
            </span>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-xs text-slate-600 dark:text-slate-300 hover:text-emerald-600 font-medium"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{isTg ? "Ҳамаи мақолаҳо" : "Все статьи"}</span>
          </Link>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12">
        {/* Header */}
        <div className="space-y-4">
          <Badge className="bg-emerald-600 text-white font-bold text-xs px-3 py-1 rounded-lg">
            {category}
          </Badge>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            {title}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            {excerpt}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-slate-200/80 dark:border-slate-800 text-xs text-slate-500">
            <div className="flex items-center gap-3">
              <img
                src={article.author.avatar}
                alt={article.author.name}
                className="h-10 w-10 rounded-full object-cover border border-slate-200"
              />
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-sm">
                  {article.author.name}
                </p>
                <p className="text-xs text-slate-500">{article.author.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {article.publishedAt}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {article.readTimeMin} {isTg ? "дақиқа мутолиа" : "мин. чтения"}
              </span>
            </div>
          </div>
        </div>

        {/* Hero Cover */}
        <div className="mt-6 rounded-2xl overflow-hidden shadow-lg border border-slate-200/80 dark:border-slate-800">
          <img
            src={article.coverImage}
            alt={title}
            className="w-full h-72 sm:h-96 object-cover"
          />
        </div>

        {/* Article Body */}
        <div className="mt-8 prose prose-slate dark:prose-invert max-w-none space-y-5 text-slate-800 dark:text-slate-200 text-sm sm:text-base leading-relaxed">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-justify sm:text-left">
              {p}
            </p>
          ))}
        </div>

        {/* Bottom CTA / Consultation Card */}
        <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-bold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{isTg ? "Машварати ройгон" : "Бесплатная консультация"}</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold">
              {isTg ? "Саволе оид ба интихоби манзил доред?" : "Ищете надёжную квартиру в Согде?"}
            </h3>
            <p className="text-xs text-slate-300 max-w-md">
              {isTg
                ? "Коршиносони мо ба шумо дар интихоби беҳтарин маҷмаа ва санҷиши ҳуҷҷатҳо кӯмак мерасонанд."
                : "Эксперты портала Maskani.tj помогут подобрать проверенный ЖК, сравнить цены и проверить документы."}
            </p>
          </div>
          <Link href="/classifieds">
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl px-5 h-11 text-xs">
              {isTg ? "Дидани каталог" : "Перейти в каталог"}
            </Button>
          </Link>
        </div>

        {/* Related Articles */}
        <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
            {isTg ? "Мақолаҳои дигар" : "Читайте также"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {otherArticles.map((rel) => (
              <Link
                key={rel.id}
                href={`/blog/${rel.slug}`}
                className="group flex flex-col bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs hover:border-emerald-500/50 transition-all"
              >
                <div className="h-32 w-full overflow-hidden">
                  <img
                    src={rel.coverImage}
                    alt={rel.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3.5 space-y-1.5 flex-1 flex flex-col justify-between">
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-2 group-hover:text-emerald-600 transition-colors">
                    {isTg ? rel.titleTg : rel.title}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {rel.publishedAt}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}
