import React from 'react';
import { Pill, Activity, ShieldCheck, Database, Table, FileSpreadsheet, FileText, BookOpen } from 'lucide-react';

interface HeaderProps {
  activeTab: 'calc' | 'matrix' | 'prescription' | 'manager' | 'guideline';
  setActiveTab: (tab: 'calc' | 'matrix' | 'prescription' | 'manager' | 'guideline') => void;
  cartCount: number;
  totalDrugsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  totalDrugsCount,
}) => {
  return (
    <header className="bg-gradient-to-r from-teal-800 via-teal-700 to-emerald-800 text-white shadow-lg sticky top-0 z-30">
      {/* Top micro bar */}
      <div className="bg-teal-900/80 px-4 py-1 text-xs border-b border-teal-700/50">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-teal-100">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 font-medium bg-teal-800/80 px-2 py-0.5 rounded text-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5" /> เครือข่ายบริการสุขภาพ CUP สายบุรี
            </span>
            <span className="hidden sm:inline text-teal-300">•</span>
            <span className="hidden sm:inline">โรงพยาบาลส่งเสริมสุขภาพ ในเครือข่าย จังหวัดปัตตานี</span>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span>มาตรฐานความปลอดภัยขนาดยาเด็ก</span>
            <span className="bg-emerald-500/30 text-emerald-200 px-2 py-0.5 rounded-full font-mono">
              {totalDrugsCount} รายการยาพร้อมคำนวณ
            </span>
          </div>
        </div>
      </div>

      {/* Main Header Content */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-teal-200 shadow-inner">
              <Pill className="w-7 h-7 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-['Prompt',sans-serif]">
                  ระบบยา อำเภอสายบุรี
                </h1>
                <span className="bg-emerald-400 text-teal-950 font-semibold text-[10px] sm:text-xs px-2 py-0.5 rounded-md shadow-sm">
                  Pediatric Dose
                </span>
              </div>
              <p className="text-xs sm:text-sm text-teal-100">
                ระบบคำนวณและคู่มือขนาดยาในเด็ก (Pediatric Dosage & Safe Prescription System)
              </p>
            </div>
          </div>

          {/* Quick tab switcher buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              onClick={() => setActiveTab('calc')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'calc'
                  ? 'bg-white text-teal-900 shadow-sm font-semibold'
                  : 'bg-teal-800/70 text-teal-100 hover:bg-teal-700/80 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              คำนวณตามน้ำหนัก
            </button>

            <button
              onClick={() => setActiveTab('matrix')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'matrix'
                  ? 'bg-white text-teal-900 shadow-sm font-semibold'
                  : 'bg-teal-800/70 text-teal-100 hover:bg-teal-700/80 hover:text-white'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              ตารางเทียบ 3-30 kg
            </button>

            <button
              onClick={() => setActiveTab('prescription')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap relative ${
                activeTab === 'prescription'
                  ? 'bg-white text-teal-900 shadow-sm font-semibold'
                  : 'bg-teal-800/70 text-teal-100 hover:bg-teal-700/80 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              บัตรคำแนะนำยา
              {cartCount > 0 && (
                <span className="bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('guideline')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'guideline'
                  ? 'bg-white text-teal-900 shadow-sm font-semibold'
                  : 'bg-teal-800/70 text-teal-100 hover:bg-teal-700/80 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              แนวทางคลินิก
            </button>

            <button
              onClick={() => setActiveTab('manager')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'manager'
                  ? 'bg-white text-teal-900 shadow-sm font-semibold'
                  : 'bg-teal-800/70 text-teal-100 hover:bg-teal-700/80 hover:text-white'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              จัดการข้อมูลยา
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
