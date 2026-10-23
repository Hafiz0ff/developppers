"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Lock, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/context/language-context";

export default function PrivacyPolicyPage() {
  const { tDual } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl space-y-6">
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {tDual("Назад на главную", "Бозгашт ба саҳифаи аслӣ")}
        </Link>
      </div>

      <Card className="border shadow-xs">
        <CardHeader className="border-b bg-muted/20 p-6 space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600">
            <ShieldCheck className="h-4 w-4" />
            <span>
              {tDual(
                "Защита персональных данных",
                "Ҳифзи маълумоти шахсӣ"
              )}
            </span>
          </div>
          <CardTitle className="text-2xl font-extrabold text-foreground">
            {tDual(
              "Политика в отношении обработки персональных данных",
              "Сиёсат дар бораи коркарди маълумоти шахсӣ"
            )}
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            {tDual(
              "Редакция в соответствии с Законом Республики Таджикистан «О защите персональных данных»",
              "Таҳрир мутобиқи Қонуни Ҷумҳурии Тоҷикистон «Дар бораи ҳифзи маълумоти шахсӣ»"
            )}
          </p>
        </CardHeader>

        <CardContent className="p-6 space-y-5 text-sm leading-relaxed text-foreground/90">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <FileText className="h-4 w-4 text-emerald-600" />
              <span>
                {tDual("1. Общие положения", "1. Муқаррароти умумӣ")}
              </span>
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {tDual(
                "Настоящая Политика определяет порядок сбора, хранения, обработки и защиты персональных данных пользователей платформы недвижимости при отправке заявок на бронирование объектов, заказе обратного звонка и взаимодействии с официальными застройщиками через CRM платформы.",
                "Ин Сиёсат тартиби ҷамъоварӣ, нигоҳдорӣ, коркард ва ҳифзи маълумоти шахсии истифодабарандагони платформаи амволро ҳангоми фиристодани дархостҳо барои бандкунӣ ва фармоиши занги бозгашт муайян мекунад."
              )}
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <Lock className="h-4 w-4 text-emerald-600" />
              <span>
                {tDual(
                  "2. Состав и цели обработки персональных данных",
                  "2. Таркиб ва мақсадҳои коркарди маълумоти шахсӣ"
                )}
              </span>
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {tDual(
                "При отправке заявки на бронирование или обратный звонок обрабатываются: контактный номер телефона покупателя, выбранный временной интервал для связи, а также параметры интересующих объектов недвижимости (квартира, машино-место, кладовая). Данные передаются исключительно уполномоченному отделу продаж соответствующего застройщика в рамках процесса обработки заявки.",
                "Ҳангоми фиристодани дархост рақами телефони тамос, вақти интихобшудаи занг ва маълумот дар бораи объектҳои интихобшуда коркард мешаванд. Маълумот танҳо ба шуъбаи фурӯши сохтмончии дахлдор пешниҳод мегардад."
              )}
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-foreground">
              {tDual(
                "3. Безопасность и права субъекта данных",
                "3. Амният ва ҳуқуқҳои субъекти маълумот"
              )}
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {tDual(
                "Персональные данные обрабатываются только при наличии явного согласия пользователя, выраженного путём установки отметки в чекбоксе формы заявки. Пользователь вправе в любой момент отозвать согласие, направив обращение в службу поддержки платформы.",
                "Маълумоти шахсӣ танҳо бо розигии бевоситаи корбар коркард карда мешавад. Корбар ҳуқуқ дорад дар ҳар лаҳза розигии худро бозхонд намояд."
              )}
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
