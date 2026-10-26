import React, { useState } from 'react';
import { Scale, Calendar, User, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { estimateWeightFromAge } from '../utils/calculator';

interface PatientInputProps {
  weightKg: number;
  setWeightKg: (w: number) => void;
  ageMonths: number;
  setAgeMonths: (m: number) => void;
  patientName: string;
  setPatientName: (name: string) => void;
  hn: string;
  setHn: (hn: string) => void;
}

const QUICK_WEIGHTS = [4, 6, 8, 10, 12, 14, 16, 18, 20, 25, 30];

const AGE_PRESETS = [
  { label: '3 เดือน (~6 กก.)', months: 3 },
  { label: '6 เดือน (~7.9 กก.)', months: 6 },
  { label: '9 เดือน (~8.9 กก.)', months: 9 },
  { label: '1 ขวบ (~9.6 กก.)', months: 12 },
  { label: '1 ขวบครึ่ง (~11 กก.)', months: 18 },
  { label: '2 ขวบ (~12.2 กก.)', months: 24 },
  { label: '3 ขวบ (~14.3 กก.)', months: 36 },
  { label: '4 ขวบ (~16.3 กก.)', months: 48 },
  { label: '5 ขวบ (~18.3 กก.)', months: 60 },
  { label: '7 ขวบ (~23 กก.)', months: 84 },
  { label: '10 ขวบ (~32 กก.)', months: 120 },
];

export const PatientInput: React.FC<PatientInputProps> = ({
  weightKg,
  setWeightKg,
  ageMonths,
  setAgeMonths,
  patientName,
  setPatientName,
  hn,
  setHn,
}) => {
  const [showAgeHelper, setShowAgeHelper] = useState(false);

  const handleAgeChange = (m: number) => {
    setAgeMonths(m);
    const estimated = estimateWeightFromAge(m);
    setWeightKg(estimated);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-4 sm:p-5 transition-all">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        {/* Main Weight Input */}
        <div className="lg:col-span-5 bg-gradient-to-br from-teal-50 to-emerald-50/60 p-4 rounded-xl border border-teal-100/80">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-teal-900 flex items-center gap-1.5 font-['Prompt',sans-serif]">
              <Scale className="w-4 h-4 text-teal-600" />
              น้ำหนักตัวผู้ป่วย (Body Weight)
            </label>
            <span className="text-xs text-teal-600 font-medium">หน่วยเป็นกิโลกรัม (kg)</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <input
                type="number"
                min="1.5"
                max="60"
                step="0.1"
                value={weightKg || ''}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setWeightKg(isNaN(val) ? 0 : Math.max(0, Math.min(80, val)));
                }}
                className="w-full text-2xl sm:text-3xl font-bold text-teal-950 bg-white border-2 border-teal-300 rounded-xl px-4 py-2 text-center focus:ring-4 focus:ring-teal-500/20 focus:border-teal-600 outline-none transition-all shadow-inner font-mono"
                placeholder="ระบุน้ำหนัก"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm">
                กก.
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <button
                type="button"
                onClick={() => setWeightKg(Math.round((weightKg + 0.5) * 10) / 10)}
                className="px-2.5 py-1 bg-white hover:bg-teal-100 text-teal-800 text-xs font-bold rounded-md border border-teal-200 shadow-sm transition active:scale-95"
                title="เพิ่ม 0.5 กก."
              >
                +0.5
              </button>
              <button
                type="button"
                onClick={() => setWeightKg(Math.max(1, Math.round((weightKg - 0.5) * 10) / 10))}
                className="px-2.5 py-1 bg-white hover:bg-teal-100 text-teal-800 text-xs font-bold rounded-md border border-teal-200 shadow-sm transition active:scale-95"
                title="ลด 0.5 กก."
              >
                -0.5
              </button>
            </div>
          </div>

          {/* Quick Slider */}
          <div className="mt-3">
            <input
              type="range"
              min="2"
              max="40"
              step="0.5"
              value={weightKg}
              onChange={(e) => setWeightKg(parseFloat(e.target.value))}
              className="w-full h-2 bg-teal-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
            />
          </div>

          {/* Quick weight chips */}
          <div className="mt-2.5 flex flex-wrap gap-1 items-center">
            <span className="text-[11px] text-teal-700 font-medium mr-1">เลือกด่วน:</span>
            {QUICK_WEIGHTS.map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => setWeightKg(w)}
                className={`text-[11px] px-2 py-0.5 rounded-full font-medium transition cursor-pointer ${
                  weightKg === w
                    ? 'bg-teal-700 text-white shadow-sm'
                    : 'bg-white text-teal-800 border border-teal-200 hover:bg-teal-100'
                }`}
              >
                {w} kg
              </button>
            ))}
          </div>
        </div>

        {/* Age Helper & Estimate */}
        <div className="lg:col-span-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-slate-800 flex items-center gap-1.5 font-['Prompt',sans-serif]">
              <Calendar className="w-4 h-4 text-slate-600" />
              ประมาณน้ำหนักจากอายุ (ถ้ายังไม่ได้ชั่ง)
            </label>
            <button
              type="button"
              onClick={() => setShowAgeHelper(!showAgeHelper)}
              className="text-xs text-teal-700 hover:text-teal-900 font-medium underline flex items-center gap-0.5"
            >
              {showAgeHelper ? 'ย่อ' : 'ดูค่าอ้างอิง'}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={ageMonths}
              onChange={(e) => handleAgeChange(parseInt(e.target.value, 10))}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none"
            >
              <option value="0">เลือกช่วงอายุเด็ก...</option>
              {AGE_PRESETS.map((p) => (
                <option key={p.months} value={p.months}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-2 text-[11px] text-slate-500 flex items-start gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
            <span>
              อ้างอิงเกณฑ์มัธยฐานน้ำหนักเด็กไทย (กรมอนามัย / WHO) หากชั่งน้ำหนักจริงได้ให้ใช้น้ำหนักจริงเสมอ
            </span>
          </div>

          {showAgeHelper && (
            <div className="mt-2 pt-2 border-t border-slate-200 grid grid-cols-2 gap-1 text-[11px] text-slate-600">
              <div>สูตรเด็ก &gt; 1 ขวบ: (อายุปี × 2) + 8</div>
              <div className="text-right text-teal-700 font-medium">Nelson's Rule</div>
            </div>
          )}
        </div>

        {/* Optional Patient Details for Prescription */}
        <div className="lg:col-span-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="text-sm font-semibold text-slate-800 flex items-center gap-1.5 mb-2 font-['Prompt',sans-serif]">
            <User className="w-4 h-4 text-slate-600" />
            ข้อมูลผู้ป่วย (สำหรับออกฉลาก/ใบยา)
          </div>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="ชื่อ - สกุล เด็ก / ชื่อเล่น"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none"
            />
            <input
              type="text"
              placeholder="เลข HN / สิทธิการรักษา"
              value={hn}
              onChange={(e) => setHn(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
