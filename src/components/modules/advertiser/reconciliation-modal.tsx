"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Printer, Download, FileText, CheckCircle2 } from "lucide-react";
import type { ReconciliationAct } from "@/lib/ads/ad-engine";

interface ReconciliationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  act: ReconciliationAct | null;
}

export function ReconciliationModal({ open, onOpenChange, act }: ReconciliationModalProps) {
  if (!act) return null;

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 bg-white text-slate-900 border border-slate-200 rounded-2xl shadow-2xl">
        <DialogHeader className="border-b border-slate-100 pb-4 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-slate-900">
                Электронный акт сверки взаимных расчетов
              </DialogTitle>
              <p className="text-xs text-slate-500 font-mono">
                № {act.actNumber} от {act.generatedAt}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handlePrint}
              className="h-8 px-3 rounded-lg border-slate-200 text-xs font-semibold gap-1.5 cursor-pointer hover:bg-slate-50"
            >
              <Printer className="h-3.5 w-3.5 text-slate-600" />
              <span>Печать / PDF</span>
            </Button>
          </div>
        </DialogHeader>

        {/* Printable Official Document Sheet */}
        <div className="p-4 sm:p-6 bg-slate-50/50 rounded-xl border border-slate-200/80 space-y-6 text-xs text-slate-800 leading-relaxed print:bg-white print:border-none print:p-0">
          <div className="text-center space-y-1">
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-900">
              АКТ СВЕРКИ ВЗАИМНЫХ РАСЧЕТОВ
            </h3>
            <p className="text-[11px] text-slate-600">
              за период с <b>{act.periodStart}</b> по <b>{act.periodEnd}</b>
            </p>
            <p className="text-[11px] text-slate-500">
              между <b>{act.supplier.name}</b> и <b>{act.customer.name}</b> по договору на оказание рекламных услуг
            </p>
          </div>

          {/* Requisites Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-200">
            <div className="p-3 bg-white rounded-lg border border-slate-200/60 space-y-1">
              <span className="font-bold text-[11px] text-emerald-800 uppercase block">Исполнитель:</span>
              <p className="font-semibold text-slate-900">{act.supplier.name}</p>
              <p className="text-slate-500 text-[10px]">ИНН: {act.supplier.tin}</p>
              <p className="text-slate-500 text-[10px]">{act.supplier.address}</p>
              <p className="text-slate-500 text-[10px]">р/с: {act.supplier.bankAccount}</p>
              <p className="text-slate-500 text-[10px]">{act.supplier.bankName}</p>
            </div>

            <div className="p-3 bg-white rounded-lg border border-slate-200/60 space-y-1">
              <span className="font-bold text-[11px] text-blue-800 uppercase block">Заказчик (Рекламодатель):</span>
              <p className="font-semibold text-slate-900">{act.customer.name}</p>
              <p className="text-slate-500 text-[10px]">Бренд: {act.customer.brandName}</p>
              <p className="text-slate-500 text-[10px]">ИНН: {act.customer.tin}</p>
              <p className="text-slate-500 text-[10px]">Контактное лицо: {act.customer.contactPerson}</p>
              <p className="text-slate-500 text-[10px]">Телефон: {act.customer.phone}</p>
            </div>
          </div>

          {/* Financial Breakdown Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border border-slate-300 text-xs">
              <thead>
                <tr className="bg-slate-200/80 text-slate-900 font-bold">
                  <th className="border border-slate-300 p-2">Показатель взаиморасчетов</th>
                  <th className="border border-slate-300 p-2 text-right">По данным Исполнителя</th>
                  <th className="border border-slate-300 p-2 text-right">По данным Заказчика</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-300 p-2 text-slate-600">Начальное сальдо на {act.periodStart}</td>
                  <td className="border border-slate-300 p-2 text-right font-mono font-medium">
                    {act.openingBalanceTjs.toLocaleString("ru-RU")} сомони
                  </td>
                  <td className="border border-slate-300 p-2 text-right font-mono font-medium">
                    {act.openingBalanceTjs.toLocaleString("ru-RU")} сомони
                  </td>
                </tr>
                <tr>
                  <td className="border border-slate-300 p-2 text-slate-600">
                    Оплачено Заказчиком (пополнение баланса / контракты)
                  </td>
                  <td className="border border-slate-300 p-2 text-right font-mono font-bold text-emerald-700">
                    +{act.totalCreditedTjs.toLocaleString("ru-RU")} сомони
                  </td>
                  <td className="border border-slate-300 p-2 text-right font-mono font-bold text-emerald-700">
                    +{act.totalCreditedTjs.toLocaleString("ru-RU")} сомони
                  </td>
                </tr>
                <tr>
                  <td className="border border-slate-300 p-2 text-slate-600">
                    Оказано услуг по показу баннеров и кликов (расход)
                  </td>
                  <td className="border border-slate-300 p-2 text-right font-mono font-semibold text-slate-800">
                    -{act.totalDebitedTjs.toLocaleString("ru-RU")} сомони
                  </td>
                  <td className="border border-slate-300 p-2 text-right font-mono font-semibold text-slate-800">
                    -{act.totalDebitedTjs.toLocaleString("ru-RU")} сомони
                  </td>
                </tr>
                <tr className="bg-emerald-50/70 font-bold text-emerald-950">
                  <td className="border border-slate-300 p-2">Конечное сальдо (текущий баланс Заказчика)</td>
                  <td className="border border-slate-300 p-2 text-right font-mono text-emerald-700 text-sm">
                    {act.closingBalanceTjs.toLocaleString("ru-RU")} сомони
                  </td>
                  <td className="border border-slate-300 p-2 text-right font-mono text-emerald-700 text-sm">
                    {act.closingBalanceTjs.toLocaleString("ru-RU")} сомони
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200/80 flex items-center gap-2 text-[11px] font-medium">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>
              Задолженность отсутствует. Баланс активен и готов к дальнейшим показам рекламных кампаний в Согде.
            </span>
          </div>

          {/* Signatures & Seal stamp */}
          <div className="pt-6 grid grid-cols-2 gap-8 border-t border-slate-200 text-[11px]">
            <div>
              <p className="font-bold text-slate-900 mb-2">От Исполнителя:</p>
              <p className="text-slate-600">Директор: ________________ / {act.supplier.director} /</p>
              <p className="text-slate-600 mt-1">Главный бухгалтер: _________ / {act.supplier.chiefAccountant} /</p>
              {/* Stylized Digital Seal */}
              <div className="mt-3 inline-block p-2 border-2 border-blue-600/50 rounded-full text-blue-700 text-[9px] font-bold text-center rotate-[-4deg] opacity-85">
                <div>РЕСПУБЛИКА ТАДЖИКИСТАН • Г. ХУДЖАНД</div>
                <div>ООО «МАСКАНИ СОГД МЕДИА»</div>
                <div>ЭЛЕКТРОННАЯ ЦИФРОВАЯ ПОДПИСЬ</div>
              </div>
            </div>

            <div>
              <p className="font-bold text-slate-900 mb-2">От Заказчика:</p>
              <p className="text-slate-600">Уполномоченное лицо: ________ / {act.customer.contactPerson} /</p>
              <p className="text-slate-500 mt-1">М.П.</p>
              <div className="mt-4 text-[10px] text-slate-400">
                Документ сформирован автоматически в B2B кабинете Maskani.tj
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
