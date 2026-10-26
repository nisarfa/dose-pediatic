import React, { useState } from 'react';
import {
  AlertTriangle,
  Check,
  Copy,
  Plus,
  Info,
  Clock,
  Utensils,
  Thermometer,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { CalculatedDoseResult } from '../types/drug';

interface DrugCardProps {
  calculation: CalculatedDoseResult;
  isPrescribed: boolean;
  onTogglePrescribe: (calc: CalculatedDoseResult) => void;
}

export const DrugCard: React.FC<DrugCardProps> = ({
  calculation,
  isPrescribed,
  onTogglePrescribe,
}) => {
  const { drug, patientWeightKg, calculatedMlPerDose, calculatedMgPerDose, teaspoonText, isExceedsMaxDose, isAgeWarning, warningNote } = calculation;
  const [copied, setCopied] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleCopy = () => {
    const text = `${drug.brandName || drug.genericName}: รับประทานครั้งละ ${calculatedMlPerDose} mL (${teaspoonText}) ${drug.frequencyTextTh} ${drug.timingTextTh} [คำนวณตาม นน. ${patientWeightKg} กก.]`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isDengueSensitive = drug.id === 'ibuprofen-100';

  return (
    <div
      className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-sm hover:shadow-md ${
        isPrescribed
          ? 'border-teal-500 ring-2 ring-teal-500/20 bg-teal-50/20'
          : drug.isHighAlert
          ? 'border-amber-200/90'
          : 'border-slate-200/80 hover:border-teal-300'
      }`}
    >
      {/* Top Header of Card */}
      <div className="p-4 sm:p-5 border-b border-slate-100">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                {drug.strengthValue} {drug.strengthUnit} / {drug.volumeValue} {drug.volumeUnit}
              </span>

              {drug.isHighAlert && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                  <ShieldAlert className="w-3 h-3" /> ยาเฝ้าระวังสูง
                </span>
              )}

              {isDengueSensitive && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-rose-100 text-rose-700">
                  <AlertTriangle className="w-3 h-3" /> ระวังไข้เลือดออก
                </span>
              )}
            </div>

            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug font-['Prompt',sans-serif]">
              {drug.genericName}
            </h3>
            {drug.brandName && (
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{drug.brandName}</p>
            )}
            <p className="text-xs text-teal-700 font-medium mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
              {drug.indicationTh}
            </p>
          </div>

          {/* Prescribe button */}
          <button
            onClick={() => onTogglePrescribe(calculation)}
            className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer active:scale-95 ${
              isPrescribed
                ? 'bg-emerald-600 text-white shadow-sm hover:bg-emerald-700'
                : 'bg-slate-100 hover:bg-teal-600 hover:text-white text-slate-700 border border-slate-200 hover:border-teal-600'
            }`}
          >
            {isPrescribed ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>เลือกแล้ว</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>เพิ่มในใบยา</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Calculated Dose Highlight Banner */}
      <div className="bg-gradient-to-r from-teal-50/70 via-slate-50 to-emerald-50/70 p-4 sm:p-5">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 items-center">
          {/* Main calculated dose */}
          <div className="sm:col-span-7">
            <div className="text-[11px] font-bold uppercase tracking-wider text-teal-800">
              ขนาดยาที่ต้องรับประทานต่อครั้ง (Dose per administration):
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-teal-950 font-mono tracking-tight">
                {calculatedMlPerDose}
              </span>
              <span className="text-lg sm:text-xl font-bold text-teal-800">
                {drug.formType === 'rectal' ? 'หลอด' : drug.formType === 'tablet' ? 'เม็ด' : 'mL (มล.)'}
              </span>
              <span className="text-xs text-slate-500 font-mono">
                (~{calculatedMgPerDose} {drug.strengthUnit})
              </span>
            </div>

            <div className="mt-1 text-sm font-semibold text-emerald-800 bg-emerald-100/70 px-2.5 py-1 rounded-lg inline-block border border-emerald-200">
              👉 {teaspoonText}
            </div>
          </div>

          {/* Timing & frequency */}
          <div className="sm:col-span-5 bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs space-y-1.5 text-xs text-slate-700">
            <div className="flex items-start gap-1.5">
              <Clock className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
              <span className="font-medium text-slate-800">{drug.frequencyTextTh}</span>
            </div>
            <div className="flex items-start gap-1.5">
              <Utensils className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              <span>{drug.timingTextTh}</span>
            </div>
          </div>
        </div>

        {/* Safety Warnings Banner if triggered */}
        {(isExceedsMaxDose || isAgeWarning || warningNote) && (
          <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold">ข้อควรระวัง / ขนาดยาสูงสุด</div>
              <div>{warningNote}</div>
            </div>
          </div>
        )}
      </div>

      {/* Drug Instructions & Safety Notes */}
      <div className="p-4 sm:p-5 bg-white border-t border-slate-100 text-xs text-slate-600 space-y-2">
        <div className="flex items-start gap-2">
          <Info className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
          <span>
            <strong className="text-slate-800">คำแนะนำ:</strong> {drug.instructionsTh}
          </span>
        </div>

        {drug.warningTh && (
          <div className="flex items-start gap-2 text-rose-700">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
            <span>
              <strong>คำเตือน:</strong> {drug.warningTh}
            </span>
          </div>
        )}

        {/* Collapsible clinical details */}
        {showDetails && (
          <div className="pt-2 mt-2 border-t border-slate-100 space-y-1.5 text-slate-500">
            <div>
              <strong className="text-slate-700">สูตรการคิด:</strong>{' '}
              {drug.dosingType === 'per_dose'
                ? `${drug.minDosePerKg} - ${drug.maxDosePerKg} mg/kg/dose (ค่ามาตรฐาน: ${drug.defaultDosePerKg} mg/kg)`
                : `${drug.minDosePerKg} - ${drug.maxDosePerKg} mg/kg/day (แบ่งให้ ${drug.frequencyTimesPerDay} ครั้ง)`}
            </div>
            {drug.storageTh && (
              <div>
                <strong className="text-slate-700">การเก็บรักษา:</strong> {drug.storageTh}
              </div>
            )}
            {drug.maxDailyDoseMg && (
              <div>
                <strong className="text-slate-700">Max Dose:</strong> ไม่เกิน {drug.maxDailyDoseMg} mg ต่อวัน
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-[11px] text-teal-700 hover:text-teal-900 font-medium flex items-center gap-1 cursor-pointer"
          >
            {showDetails ? (
              <>
                <ChevronUp className="w-3 h-3" /> ซ่อนรายละเอียดเภสัชวิทยา
              </>
            ) : (
              <>
                <ChevronDown className="w-3 h-3" /> ดูสูตรคำนวณและข้อแนะนำเพิ่มเติม
              </>
            )}
          </button>

          <button
            onClick={handleCopy}
            className="text-[11px] text-slate-500 hover:text-slate-900 flex items-center gap-1 transition cursor-pointer"
            title="คัดลอกข้อความวิธีใช้"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-600" />
                <span className="text-emerald-700 font-medium">คัดลอกแล้ว</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>คัดลอกวิธีใช้</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
