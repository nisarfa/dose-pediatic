import React, { useState } from 'react';
import { PrescribedItem } from '../types/drug';
import { Printer, Trash2, Edit3, Check, Calendar, User, FileText, Download, ShieldCheck, HeartPulse } from 'lucide-react';

interface PrescriptionSlipProps {
  items: PrescribedItem[];
  onRemoveItem: (id: string) => void;
  onClearAll: () => void;
  onUpdateItemNote: (id: string, note: string) => void;
  patientName: string;
  hn: string;
  weightKg: number;
}

export const PrescriptionSlipModal: React.FC<PrescriptionSlipProps> = ({
  items,
  onRemoveItem,
  onClearAll,
  onUpdateItemNote,
  patientName,
  hn,
  weightKg,
}) => {
  const currentDate = new Date().toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempNote, setTempNote] = useState('');

  const startEdit = (item: PrescribedItem) => {
    setEditingId(item.id);
    setTempNote(item.customNote || '');
  };

  const saveEdit = (id: string) => {
    onUpdateItemNote(id, tempNote);
    setEditingId(null);
  };

  const handlePrint = () => {
    window.print();
  };

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center max-w-2xl mx-auto my-8">
        <div className="w-16 h-16 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 font-['Prompt',sans-serif]">
          ยังไม่มีรายการยาในบัตรคำแนะนำ
        </h3>
        <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
          กลับไปที่แท็บ <strong>&ldquo;คำนวณตามน้ำหนัก&rdquo;</strong> แล้วกดปุ่ม <strong>&ldquo;+ เพิ่มในใบยา&rdquo;</strong> เพื่อรวบรวมรายการยาและพิมพ์บัตรคำแนะนำการกินยาสำหรับผู้ปกครอง
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top action buttons (hidden in print) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div>
          <h2 className="text-base font-bold text-slate-900 font-['Prompt',sans-serif]">
            บัตรคำแนะนำการรับประทานยาเด็ก (สำหรับผู้ปกครอง)
          </h2>
          <p className="text-xs text-slate-500">
            เลือกไว้ทั้งหมด {items.length} รายการ (น้ำหนักคำนวณ: {weightKg} กก.)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onClearAll}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 transition cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            ล้างรายการทั้งหมด
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-teal-700 hover:bg-teal-800 text-white transition shadow-sm cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            พิมพ์บัตรคำแนะนำยา (Print)
          </button>
        </div>
      </div>

      {/* Printable Sheet (Standard A4/Card Layout) */}
      <div className="bg-white rounded-2xl border border-slate-300 shadow-md p-6 sm:p-8 print:p-0 print:border-none print:shadow-none font-['Sarabun',sans-serif]">
        {/* Prescription Header */}
        <div className="border-b-2 border-teal-800 pb-4 mb-4">
          <div className="flex justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-2">
                <HeartPulse className="w-6 h-6 text-teal-700" />
                <h1 className="text-xl sm:text-2xl font-bold text-teal-950 font-['Prompt',sans-serif]">
                  ระบบยา อำเภอสายบุรี
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                โรงพยาบาลส่งเสริมสุขภาพ ในเครือข่าย จังหวัดปัตตานี
              </p>
              <div className="inline-block bg-teal-50 text-teal-800 font-semibold text-xs px-2.5 py-0.5 rounded border border-teal-200 mt-1">
                ใบคู่มือและตารางเวลาการรับประทานยาสำหรับเด็ก
              </div>
            </div>

            <div className="text-right text-xs text-slate-600 space-y-0.5">
              <div>วันที่: <strong className="text-slate-900">{currentDate}</strong></div>
              <div>เครือข่าย: CUP สายบุรี</div>
            </div>
          </div>

          {/* Patient Details Row */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 block">ชื่อผู้ป่วย:</span>
              <strong className="text-slate-900 text-sm">
                {patientName || '...........................................'}
              </strong>
            </div>
            <div>
              <span className="text-slate-500 block">HN / เลขประจำตัว:</span>
              <strong className="text-slate-900 text-sm">{hn || '..................'}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">น้ำหนักตัว (BW):</span>
              <strong className="text-teal-800 text-sm">{weightKg} กิโลกรัม</strong>
            </div>
            <div>
              <span className="text-slate-500 block">หน่วยบริการ:</span>
              <strong className="text-slate-900 text-sm">CUP สายบุรี</strong>
            </div>
          </div>
        </div>

        {/* Medicines Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-teal-900 text-white font-['Prompt',sans-serif]">
                <th className="py-2.5 px-3 rounded-tl-lg">ลำดับ</th>
                <th className="py-2.5 px-3">ชื่อยา / สรรพคุณ</th>
                <th className="py-2.5 px-3 text-center">ขนาดยาต่อครั้ง</th>
                <th className="py-2.5 px-3">เวลาที่รับประทาน</th>
                <th className="py-2.5 px-3">ข้อแนะนำเฉพาะ</th>
                <th className="py-2.5 px-2 text-center print:hidden rounded-tr-lg">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {items.map((item, index) => (
                <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}>
                  <td className="py-3 px-3 font-bold text-slate-500 text-center w-10">
                    {index + 1}
                  </td>

                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900 text-sm font-['Prompt',sans-serif]">
                      {item.drug.genericName}
                    </div>
                    {item.drug.brandName && (
                      <div className="text-[11px] text-slate-500">{item.drug.brandName}</div>
                    )}
                    <div className="text-[11px] text-teal-700 font-medium mt-0.5">
                      {item.indication}
                    </div>
                  </td>

                  <td className="py-3 px-3 text-center font-mono">
                    <div className="text-base font-extrabold text-teal-900">
                      {item.doseMl} <span className="text-xs font-normal">mL</span>
                    </div>
                    <div className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/80 inline-block mt-0.5 font-sans">
                      {item.teaspoonText}
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-800">{item.frequencyText}</div>
                    <div className="text-amber-800 font-medium">{item.timingText}</div>
                  </td>

                  <td className="py-3 px-3">
                    {editingId === item.id ? (
                      <div className="flex items-center gap-1 print:hidden">
                        <input
                          type="text"
                          value={tempNote}
                          onChange={(e) => setTempNote(e.target.value)}
                          placeholder="เพิ่มข้อความแนะนำ..."
                          className="border border-slate-300 rounded px-2 py-1 text-xs w-full outline-none focus:border-teal-500"
                        />
                        <button
                          onClick={() => saveEdit(item.id)}
                          className="bg-teal-600 text-white p-1 rounded hover:bg-teal-700"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-1 group">
                        <div className="text-slate-600 text-[11px]">
                          {item.customNote ? (
                            <span className="font-semibold text-rose-700">★ {item.customNote}</span>
                          ) : (
                            <span>{item.drug.instructionsTh}</span>
                          )}
                          {item.drug.warningTh && (
                            <div className="text-rose-600 font-medium mt-0.5">
                              ⚠️ {item.drug.warningTh}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => startEdit(item)}
                          className="text-slate-400 hover:text-teal-700 print:hidden opacity-0 group-hover:opacity-100 transition p-1"
                          title="แก้ไขข้อความแนะนำ"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </td>

                  <td className="py-3 px-2 text-center print:hidden">
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-slate-400 hover:text-rose-600 transition p-1 cursor-pointer"
                      title="ลบรายการนี้"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Visual Administration Reminder Checklist */}
        <div className="mt-6 pt-4 border-t border-slate-200">
          <h4 className="text-xs font-bold uppercase tracking-wider text-teal-900 mb-2 font-['Prompt',sans-serif]">
            ตารางเตือนการป้อนยาประจำวัน (ทำเครื่องหมายถูกเมื่อป้อนแล้ว)
          </h4>
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="bg-amber-50/70 border border-amber-200/80 p-2 rounded-xl">
              <span className="text-amber-800 font-bold block">🌅 มื้อเช้า</span>
              <span className="text-[11px] text-slate-500">07:00 - 08:00 น.</span>
            </div>
            <div className="bg-sky-50/70 border border-sky-200/80 p-2 rounded-xl">
              <span className="text-sky-800 font-bold block">☀️ มื้อกลางวัน</span>
              <span className="text-[11px] text-slate-500">12:00 - 13:00 น.</span>
            </div>
            <div className="bg-orange-50/70 border border-orange-200/80 p-2 rounded-xl">
              <span className="text-orange-800 font-bold block">🌆 มื้อเย็น</span>
              <span className="text-[11px] text-slate-500">17:00 - 18:00 น.</span>
            </div>
            <div className="bg-indigo-50/70 border border-indigo-200/80 p-2 rounded-xl">
              <span className="text-indigo-800 font-bold block">🌙 ก่อนนอน</span>
              <span className="text-[11px] text-slate-500">20:00 - 21:00 น.</span>
            </div>
          </div>
        </div>

        {/* Footer Warning & Signoff */}
        <div className="mt-6 pt-4 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-end gap-4">
          <div className="space-y-1">
            <div className="font-semibold text-slate-700">ข้อควรระวังสำคัญสำหรับผู้ปกครอง:</div>
            <div>• ใช้กระบอกฉีดยา (Syringe) หรือช้อนตวงยาที่ได้มาตรฐานในการตวงยา ห้ามใช้ช้อนแกงตวง</div>
            <div>• ยาปฏิชีวนะต้องรับประทานติดต่อกันจนหมดขวด แม้อาการจะดีขึ้นแล้ว</div>
            <div>• หากเด็กมีอาการแพ้ยา เช่น ผื่นคัน ลมพิษ ตาบวม หายใจหอบเหนื่อย ให้หยุดยาทันทีและรีบมาพบแพทย์</div>
          </div>

          <div className="text-center shrink-0 w-44 pt-4 sm:pt-0">
            <div className="border-b border-slate-400 pb-1 w-full"></div>
            <div className="text-[11px] text-slate-600 mt-1">เภสัชกร / เจ้าหน้าที่ผู้จ่ายยา</div>
            <div className="text-[10px] text-teal-800 font-medium">เครือข่ายระบบยา อำเภอสายบุรี</div>
          </div>
        </div>
      </div>
    </div>
  );
};
