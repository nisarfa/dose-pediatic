import React, { useState } from 'react';
import { DrugFormulation } from '../types/drug';
import { calculatePediatricDose } from '../utils/calculator';
import { Printer, Search, Table, FileSpreadsheet, Download, Info } from 'lucide-react';

interface QuickDoseMatrixProps {
  drugs: DrugFormulation[];
}

const WEIGHT_COLUMNS = [3, 5, 7, 10, 12, 15, 18, 20, 25, 30];

export const QuickDoseMatrix: React.FC<QuickDoseMatrixProps> = ({ drugs }) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredDrugs = drugs.filter((drug) => {
    const matchesSearch =
      drug.genericName.toLowerCase().includes(search.toLowerCase()) ||
      (drug.brandName && drug.brandName.toLowerCase().includes(search.toLowerCase())) ||
      drug.indicationTh.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || drug.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const headers = ['ชื่อยา', 'ความเข้มข้น', 'วิธีใช้', ...WEIGHT_COLUMNS.map((w) => `${w} กก. (mL)`)];
    const rows = filteredDrugs.map((drug) => {
      const doses = WEIGHT_COLUMNS.map((w) => {
        const res = calculatePediatricDose(drug, w);
        return `${res.calculatedMlPerDose} mL (${res.teaspoonText.replace(/,/g, ' ')})`;
      });
      return [
        `"${drug.genericName}"`,
        `"${drug.strengthValue} ${drug.strengthUnit}/${drug.volumeValue} ${drug.volumeUnit}"`,
        `"${drug.frequencyTextTh}"`,
        ...doses.map((d) => `"${d}"`),
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'sai_buri_pediatric_dose_matrix.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Action and Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 print:hidden">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ค้นหายาในตารางเทียบน้ำหนัก..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-700 outline-none focus:bg-white focus:border-teal-500"
          >
            <option value="all">ทุกกลุ่มยา</option>
            <option value="antipyretic">ยาลดไข้</option>
            <option value="antibiotic">ยาฆ่าเชื้อ</option>
            <option value="respiratory">ทางเดินหายใจ</option>
            <option value="gi">ทางเดินอาหาร</option>
            <option value="steroid_emergency">สเตียรอยด์/ฉุกเฉิน</option>
            <option value="supplements">ถ่ายพยาธิ/วิตามิน</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>ส่งออก Excel/CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-teal-700 hover:bg-teal-800 text-white transition shadow-sm cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>พิมพ์ตารางติดผนัง</span>
          </button>
        </div>
      </div>

      {/* Printable Heading */}
      <div className="hidden print:block mb-4 text-center">
        <h2 className="text-xl font-bold text-slate-900 font-['Prompt',sans-serif]">
          ระบบยา อำเภอสายบุรี - ตารางขนาดยาในเด็กเทียบน้ำหนักตัว (3 - 30 กิโลกรัม)
        </h2>
        <p className="text-xs text-slate-600">
          โรงพยาบาลส่งเสริมสุขภาพ ในเครือข่าย จังหวัดปัตตานี
        </p>
      </div>

      {/* Info notice */}
      <div className="bg-teal-50 border border-teal-200 text-teal-900 p-3 rounded-xl text-xs flex items-center gap-2 print:hidden">
        <Info className="w-4 h-4 text-teal-700 shrink-0" />
        <span>
          ตารางสำเร็จรูปนี้แสดงปริมาตรยาต่อครั้ง (mL) และเทียบช้อนชา เพื่อความรวดเร็วในการจ่ายยาที่ห้องยาและ รพ.สต.
        </span>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-teal-800 text-white font-['Prompt',sans-serif]">
                <th className="py-3 px-3 sticky left-0 bg-teal-800 z-10 min-w-[180px] shadow-[2px_0_5px_rgba(0,0,0,0.1)]">
                  รายการยา &amp; ความแรง
                </th>
                <th className="py-3 px-2 min-w-[140px]">วิธีรับประทาน</th>
                {WEIGHT_COLUMNS.map((w) => (
                  <th key={w} className="py-3 px-2 text-center min-w-[75px] border-l border-teal-700">
                    <span className="block font-bold text-sm">{w} kg</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDrugs.map((drug, idx) => (
                <tr
                  key={drug.id}
                  className={`hover:bg-teal-50/40 transition-colors ${
                    idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'
                  }`}
                >
                  <td className="py-3 px-3 font-medium text-slate-900 sticky left-0 bg-inherit z-10 shadow-[2px_0_5px_rgba(0,0,0,0.05)]">
                    <div className="font-semibold text-slate-900">{drug.genericName}</div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {drug.strengthValue} {drug.strengthUnit} / {drug.volumeValue} {drug.volumeUnit}
                    </div>
                  </td>

                  <td className="py-3 px-2 text-slate-600 text-[11px]">
                    <div>{drug.frequencyTextTh}</div>
                    <div className="text-teal-700 font-medium">{drug.timingTextTh}</div>
                  </td>

                  {WEIGHT_COLUMNS.map((w) => {
                    const res = calculatePediatricDose(drug, w);
                    return (
                      <td
                        key={w}
                        className="py-3 px-2 text-center border-l border-slate-100 font-mono"
                      >
                        <div className="font-bold text-teal-950 text-sm">
                          {res.calculatedMlPerDose}{' '}
                          <span className="text-[10px] font-normal text-slate-500">mL</span>
                        </div>
                        <div className="text-[10px] text-emerald-700 font-sans mt-0.5">
                          {res.teaspoonText.split('(')[0].trim()}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
