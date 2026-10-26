import React, { useState } from 'react';
import { DrugFormulation, DrugCategory } from '../types/drug';
import {
  Plus,
  Trash2,
  Edit2,
  Upload,
  Download,
  RotateCcw,
  Check,
  AlertCircle,
  FileText,
  Search,
} from 'lucide-react';
import { SAI_BURI_DEFAULT_DRUGS } from '../data/saiBuriDrugs';

interface DrugManagerModalProps {
  drugs: DrugFormulation[];
  onSaveDrugs: (drugs: DrugFormulation[]) => void;
  onResetToDefault: () => void;
}

export const DrugManagerModal: React.FC<DrugManagerModalProps> = ({
  drugs,
  onSaveDrugs,
  onResetToDefault,
}) => {
  const [search, setSearch] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editDrugId, setEditDrugId] = useState<string | null>(null);

  // Form fields
  const [genericName, setGenericName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [category, setCategory] = useState<DrugCategory>('antipyretic');
  const [strengthValue, setStrengthValue] = useState<number>(120);
  const [strengthUnit, setStrengthUnit] = useState('mg');
  const [volumeValue, setVolumeValue] = useState<number>(5);
  const [volumeUnit, setVolumeUnit] = useState('mL');
  const [formType, setFormType] = useState<DrugFormulation['formType']>('syrup');
  const [dosingType, setDosingType] = useState<'per_dose' | 'per_day'>('per_dose');
  const [minDosePerKg, setMinDosePerKg] = useState<number>(10);
  const [maxDosePerKg, setMaxDosePerKg] = useState<number>(15);
  const [defaultDosePerKg, setDefaultDosePerKg] = useState<number>(12.5);
  const [frequencyTimesPerDay, setFrequencyTimesPerDay] = useState<number>(3);
  const [frequencyTextTh, setFrequencyTextTh] = useState('วันละ 3 ครั้ง หลังอาหาร');
  const [timingTextTh, setTimingTextTh] = useState('หลังอาหาร');
  const [maxSingleDoseMg, setMaxSingleDoseMg] = useState<number | undefined>(undefined);
  const [maxDailyDoseMg, setMaxDailyDoseMg] = useState<number | undefined>(undefined);
  const [indicationTh, setIndicationTh] = useState('');
  const [instructionsTh, setInstructionsTh] = useState('');
  const [warningTh, setWarningTh] = useState('');
  const [storageTh, setStorageTh] = useState('');
  const [isHighAlert, setIsHighAlert] = useState(false);

  // Import text modal state
  const [importText, setImportText] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [showImportBox, setShowImportBox] = useState(false);

  const resetForm = () => {
    setEditDrugId(null);
    setGenericName('');
    setBrandName('');
    setCategory('antipyretic');
    setStrengthValue(120);
    setStrengthUnit('mg');
    setVolumeValue(5);
    setVolumeUnit('mL');
    setFormType('syrup');
    setDosingType('per_dose');
    setMinDosePerKg(10);
    setMaxDosePerKg(15);
    setDefaultDosePerKg(12.5);
    setFrequencyTimesPerDay(3);
    setFrequencyTextTh('วันละ 3 ครั้ง หลังอาหาร');
    setTimingTextTh('หลังอาหาร');
    setMaxSingleDoseMg(undefined);
    setMaxDailyDoseMg(undefined);
    setIndicationTh('');
    setInstructionsTh('');
    setWarningTh('');
    setStorageTh('');
    setIsHighAlert(false);
    setIsEditing(false);
  };

  const handleStartAdd = () => {
    resetForm();
    setIsEditing(true);
  };

  const handleStartEdit = (drug: DrugFormulation) => {
    setEditDrugId(drug.id);
    setGenericName(drug.genericName);
    setBrandName(drug.brandName || '');
    setCategory(drug.category);
    setStrengthValue(drug.strengthValue);
    setStrengthUnit(drug.strengthUnit);
    setVolumeValue(drug.volumeValue);
    setVolumeUnit(drug.volumeUnit);
    setFormType(drug.formType);
    setDosingType(drug.dosingType);
    setMinDosePerKg(drug.minDosePerKg);
    setMaxDosePerKg(drug.maxDosePerKg);
    setDefaultDosePerKg(drug.defaultDosePerKg || drug.minDosePerKg);
    setFrequencyTimesPerDay(drug.frequencyTimesPerDay || 3);
    setFrequencyTextTh(drug.frequencyTextTh);
    setTimingTextTh(drug.timingTextTh);
    setMaxSingleDoseMg(drug.maxSingleDoseMg);
    setMaxDailyDoseMg(drug.maxDailyDoseMg);
    setIndicationTh(drug.indicationTh);
    setInstructionsTh(drug.instructionsTh);
    setWarningTh(drug.warningTh || '');
    setStorageTh(drug.storageTh || '');
    setIsHighAlert(!!drug.isHighAlert);
    setIsEditing(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!genericName.trim()) return;

    const newDrug: DrugFormulation = {
      id: editDrugId || `custom-${Date.now()}`,
      genericName: genericName.trim(),
      brandName: brandName.trim() || undefined,
      category: category as Exclude<DrugCategory, 'all'>,
      strengthValue: Number(strengthValue) || 100,
      strengthUnit: strengthUnit.trim() || 'mg',
      volumeValue: Number(volumeValue) || 5,
      volumeUnit: volumeUnit.trim() || 'mL',
      formType,
      dosingType,
      minDosePerKg: Number(minDosePerKg) || 10,
      maxDosePerKg: Number(maxDosePerKg) || 15,
      defaultDosePerKg: Number(defaultDosePerKg) || Number(minDosePerKg) || 10,
      frequencyTimesPerDay: Number(frequencyTimesPerDay) || 3,
      frequencyTextTh: frequencyTextTh.trim() || 'วันละ 3 ครั้ง หลังอาหาร',
      timingTextTh: timingTextTh.trim() || 'หลังอาหาร',
      maxSingleDoseMg: maxSingleDoseMg ? Number(maxSingleDoseMg) : undefined,
      maxDailyDoseMg: maxDailyDoseMg ? Number(maxDailyDoseMg) : undefined,
      indicationTh: indicationTh.trim() || 'บรรเทาอาการ',
      instructionsTh: instructionsTh.trim() || 'เขย่าขวดก่อนใช้ยา',
      warningTh: warningTh.trim() || undefined,
      storageTh: storageTh.trim() || undefined,
      isHighAlert,
    };

    let updated: DrugFormulation[];
    if (editDrugId) {
      updated = drugs.map((d) => (d.id === editDrugId ? newDrug : d));
    } else {
      updated = [newDrug, ...drugs];
    }

    onSaveDrugs(updated);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('คุณต้องการลบรายการยานี้ใช่หรือไม่?')) {
      const updated = drugs.filter((d) => d.id !== id);
      onSaveDrugs(updated);
    }
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(drugs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'sai_buri_pediatric_drugs.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportText = () => {
    try {
      setImportStatus(null);
      const parsed = JSON.parse(importText);
      if (Array.isArray(parsed) && parsed.length > 0) {
        onSaveDrugs(parsed);
        setImportStatus(`นำเข้าสำเร็จ ${parsed.length} รายการ!`);
        setShowImportBox(false);
        setImportText('');
      } else {
        setImportStatus('ข้อมูล JSON ไม่ถูกต้อง (ต้องเป็น Array ของรายการยา)');
      }
    } catch {
      // Try parsing simple TSV / CSV
      try {
        const lines = importText.trim().split('\n');
        if (lines.length > 1) {
          const newItems: DrugFormulation[] = [];
          lines.forEach((line, index) => {
            if (index === 0 && (line.includes('Generic') || line.includes('ชื่อยา'))) return;
            const parts = line.split(/[\t,]/).map((p) => p.trim().replace(/^"|"$/g, ''));
            if (parts.length >= 2 && parts[0]) {
              newItems.push({
                id: `import-${Date.now()}-${index}`,
                genericName: parts[0],
                brandName: parts[1] || parts[0],
                category: 'antipyretic',
                strengthValue: parseFloat(parts[2]) || 120,
                strengthUnit: 'mg',
                volumeValue: parseFloat(parts[3]) || 5,
                volumeUnit: 'mL',
                formType: 'syrup',
                dosingType: 'per_dose',
                minDosePerKg: parseFloat(parts[4]) || 10,
                maxDosePerKg: parseFloat(parts[5]) || 15,
                defaultDosePerKg: parseFloat(parts[6]) || 12.5,
                frequencyTimesPerDay: 3,
                frequencyTextTh: parts[7] || 'วันละ 3 ครั้ง หลังอาหาร',
                timingTextTh: 'หลังอาหาร',
                indicationTh: parts[8] || 'ตามแพทย์สั่ง',
                instructionsTh: 'เขย่าขวดก่อนใช้',
              });
            }
          });
          if (newItems.length > 0) {
            onSaveDrugs([...newItems, ...drugs]);
            setImportStatus(`นำเข้าสำเร็จ ${newItems.length} รายการ!`);
            setShowImportBox(false);
            setImportText('');
            return;
          }
        }
        setImportStatus('ไม่สามารถแปลงข้อมูลได้ กรุณาใช้รูปแบบ JSON หรือ CSV/TSV ที่ถูกต้อง');
      } catch {
        setImportStatus('เกิดข้อผิดพลาดในการนำเข้า กรุณาตรวจสอบรูปแบบไฟล์');
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setImportText(content);
        setShowImportBox(true);
      }
    };
    reader.readAsText(file);
  };

  const filteredDrugs = drugs.filter(
    (d) =>
      d.genericName.toLowerCase().includes(search.toLowerCase()) ||
      (d.brandName && d.brandName.toLowerCase().includes(search.toLowerCase())) ||
      d.indicationTh.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Banner and Quick Actions */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 font-['Prompt',sans-serif]">
            จัดการฐานข้อมูลยาในระบบ อำเภอสายบุรี
          </h2>
          <p className="text-xs text-slate-500">
            ปรับแต่งสูตรคำนวณ ความเข้มข้น เพิ่มรายการยาของเครือข่าย หรือนำเข้าไฟล์ข้อมูลยา
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleStartAdd}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-teal-700 hover:bg-teal-800 text-white transition shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            เพิ่มยาใหม่
          </button>

          <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer">
            <Upload className="w-4 h-4 text-slate-600" />
            <span>นำเข้าไฟล์</span>
            <input
              type="file"
              accept=".json,.csv,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>ส่งออก JSON</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm('คุณต้องการรีเซ็ตรายการยากลับเป็นค่าเริ่มต้นของ CUP สายบุรี ทั้งหมดใช่หรือไม่?')) {
                onResetToDefault();
              }
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-800 transition cursor-pointer"
            title="รีเซ็ตเป็นรายการมาตรฐาน"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>รีเซ็ตมาตรฐาน</span>
          </button>
        </div>
      </div>

      {/* Import Box */}
      {showImportBox && (
        <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold flex items-center gap-2 text-teal-300">
              <Upload className="w-4 h-4" /> วางข้อมูลยา (JSON หรือ CSV/Excel Tab-separated)
            </h3>
            <button
              onClick={() => setShowImportBox(false)}
              className="text-slate-400 hover:text-white text-xs"
            >
              ยกเลิก
            </button>
          </div>
          <textarea
            rows={5}
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder="วางโค้ด JSON ของรายการยา หรือคัดลอกตารางจาก Excel มาวางที่นี่..."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 font-mono outline-none focus:border-teal-400"
          />
          {importStatus && (
            <div className="text-xs text-amber-400 font-medium">{importStatus}</div>
          )}
          <div className="flex justify-end gap-2">
            <button
              onClick={handleImportText}
              className="px-4 py-1.5 rounded-lg text-xs font-bold bg-teal-500 hover:bg-teal-400 text-slate-950"
            >
              ยืนยันการนำเข้าข้อมูล
            </button>
          </div>
        </div>
      )}

      {/* Add / Edit Form Modal / Box */}
      {isEditing && (
        <form
          onSubmit={handleSaveForm}
          className="bg-white p-6 rounded-2xl border-2 border-teal-500 shadow-md space-y-4"
        >
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="text-base font-bold text-teal-950 font-['Prompt',sans-serif]">
              {editDrugId ? '✏️ แก้ไขรายการยา' : '➕ เพิ่มรายการยาใหม่เข้าสู่ระบบ'}
            </h3>
            <button
              type="button"
              onClick={resetForm}
              className="text-slate-400 hover:text-slate-600 text-xs"
            >
              ปิด
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                ชื่อสามัญทางยา (Generic Name) *
              </label>
              <input
                type="text"
                required
                value={genericName}
                onChange={(e) => setGenericName(e.target.value)}
                placeholder="เช่น Paracetamol Syrup"
                className="w-full border border-slate-300 rounded-lg p-2 outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                ชื่อทางการค้า / ข้อความภาษาไทย
              </label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="เช่น พาราเซตามอล (120 mg/5 mL)"
                className="w-full border border-slate-300 rounded-lg p-2 outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">หมวดหมู่ยา</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as DrugCategory)}
                className="w-full border border-slate-300 rounded-lg p-2 outline-none focus:border-teal-500"
              >
                <option value="antipyretic">ยาลดไข้ / บรรเทาปวด</option>
                <option value="antibiotic">ยาปฏิชีวนะ (ฆ่าเชื้อ)</option>
                <option value="respiratory">ทางเดินหายใจ / แก้แพ้</option>
                <option value="gi">ระบบทางเดินอาหาร</option>
                <option value="steroid_emergency">สเตียรอยด์ / ฉุกเฉิน</option>
                <option value="supplements">ถ่ายพยาธิ / ธาตุเหล็ก</option>
              </select>
            </div>

            {/* Strength and Volume */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                ความแรงตัวยา (Strength Value) *
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="any"
                  required
                  value={strengthValue}
                  onChange={(e) => setStrengthValue(parseFloat(e.target.value))}
                  className="w-2/3 border border-slate-300 rounded-lg p-2 outline-none focus:border-teal-500 font-mono"
                />
                <input
                  type="text"
                  value={strengthUnit}
                  onChange={(e) => setStrengthUnit(e.target.value)}
                  placeholder="mg"
                  className="w-1/3 border border-slate-300 rounded-lg p-2 outline-none focus:border-teal-500 text-center"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                ปริมาตรบรรจุ (Volume Value) *
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="any"
                  required
                  value={volumeValue}
                  onChange={(e) => setVolumeValue(parseFloat(e.target.value))}
                  className="w-2/3 border border-slate-300 rounded-lg p-2 outline-none focus:border-teal-500 font-mono"
                />
                <input
                  type="text"
                  value={volumeUnit}
                  onChange={(e) => setVolumeUnit(e.target.value)}
                  placeholder="mL"
                  className="w-1/3 border border-slate-300 rounded-lg p-2 outline-none focus:border-teal-500 text-center"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">รูปแบบยา</label>
              <select
                value={formType}
                onChange={(e) => setFormType(e.target.value as DrugFormulation['formType'])}
                className="w-full border border-slate-300 rounded-lg p-2 outline-none focus:border-teal-500"
              >
                <option value="syrup">ยาน้ำเชื่อม (Syrup)</option>
                <option value="suspension">ยาน้ำแขวนตะกอน (Suspension)</option>
                <option value="dry_syrup">ยาน้ำผงแห้ง (Dry Syrup)</option>
                <option value="drops">ยาหยด (Drops)</option>
                <option value="tablet">ยาเม็ด/ละลายน้ำ (Tablet)</option>
                <option value="rectal">ยาเหน็บ/สวนทวาร (Rectal)</option>
              </select>
            </div>

            {/* Dose rules */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                การคิดขนาดยา (Dosing Type)
              </label>
              <select
                value={dosingType}
                onChange={(e) => setDosingType(e.target.value as 'per_dose' | 'per_day')}
                className="w-full border border-slate-300 rounded-lg p-2 outline-none focus:border-teal-500"
              >
                <option value="per_dose">ต่อครั้ง (mg/kg/dose)</option>
                <option value="per_day">ต่อวันแล้วแบ่งมื้อ (mg/kg/day)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                ขนาดยา mg/kg (ต่ำสุด - สูงสุด)
              </label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  step="any"
                  value={minDosePerKg}
                  onChange={(e) => setMinDosePerKg(parseFloat(e.target.value))}
                  className="w-1/2 border border-slate-300 rounded-lg p-2 outline-none focus:border-teal-500 font-mono"
                  placeholder="Min"
                />
                <span>-</span>
                <input
                  type="number"
                  step="any"
                  value={maxDosePerKg}
                  onChange={(e) => setMaxDosePerKg(parseFloat(e.target.value))}
                  className="w-1/2 border border-slate-300 rounded-lg p-2 outline-none focus:border-teal-500 font-mono"
                  placeholder="Max"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                ขนาดยาแนะนำ (Default mg/kg)
              </label>
              <input
                type="number"
                step="any"
                value={defaultDosePerKg}
                onChange={(e) => setDefaultDosePerKg(parseFloat(e.target.value))}
                className="w-full border border-slate-300 rounded-lg p-2 outline-none focus:border-teal-500 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">ความถี่ (ครั้งต่อวัน)</label>
              <input
                type="number"
                value={frequencyTimesPerDay}
                onChange={(e) => setFrequencyTimesPerDay(parseInt(e.target.value, 10))}
                className="w-full border border-slate-300 rounded-lg p-2 outline-none focus:border-teal-500 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                ข้อความความถี่ (ภาษาไทย)
              </label>
              <input
                type="text"
                value={frequencyTextTh}
                onChange={(e) => setFrequencyTextTh(e.target.value)}
                placeholder="เช่น วันละ 3 ครั้ง หลังอาหาร"
                className="w-full border border-slate-300 rounded-lg p-2 outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">เวลาสัมพันธ์กับอาหาร</label>
              <input
                type="text"
                value={timingTextTh}
                onChange={(e) => setTimingTextTh(e.target.value)}
                placeholder="เช่น ก่อนอาหาร 30 นาที / หลังอาหารทันที"
                className="w-full border border-slate-300 rounded-lg p-2 outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">สรรพคุณ / ข้อบ่งใช้</label>
              <input
                type="text"
                value={indicationTh}
                onChange={(e) => setIndicationTh(e.target.value)}
                placeholder="เช่น ลดไข้ แก้ปวด"
                className="w-full border border-slate-300 rounded-lg p-2 outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">คำแนะนำการใช้</label>
              <input
                type="text"
                value={instructionsTh}
                onChange={(e) => setInstructionsTh(e.target.value)}
                placeholder="เช่น เขย่าขวดก่อนใช้"
                className="w-full border border-slate-300 rounded-lg p-2 outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">คำเตือน / ข้อห้ามใช้</label>
              <input
                type="text"
                value={warningTh}
                onChange={(e) => setWarningTh(e.target.value)}
                placeholder="เช่น ห้ามใช้ในเด็ก < 6 เดือน"
                className="w-full border border-slate-300 rounded-lg p-2 outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-amber-800">
              <input
                type="checkbox"
                checked={isHighAlert}
                onChange={(e) => setIsHighAlert(e.target.checked)}
                className="w-4 h-4 text-amber-600 rounded"
              />
              กำหนดเป็นยาเฝ้าระวังสูง (High Alert Drug)
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-teal-700 hover:bg-teal-800 text-white shadow-sm"
            >
              บันทึกรายการยา
            </button>
          </div>
        </form>
      )}

      {/* Drug List Table for Management */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ค้นหารายการยาเพื่อแก้ไข/ลบ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 outline-none focus:bg-white focus:border-teal-500"
            />
          </div>
          <span className="text-xs text-slate-500">
            แสดง {filteredDrugs.length} จาก {drugs.length} รายการ
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">ชื่อยา (Generic)</th>
                <th className="py-2.5 px-3">ชื่อไทย / ความแรง</th>
                <th className="py-2.5 px-3">สูตร mg/kg</th>
                <th className="py-2.5 px-3">วิธีใช้</th>
                <th className="py-2.5 px-3 text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDrugs.map((drug) => (
                <tr key={drug.id} className="hover:bg-slate-50/80">
                  <td className="py-2.5 px-3 font-semibold text-slate-900">
                    {drug.genericName}
                    {drug.isHighAlert && (
                      <span className="ml-1.5 text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                        High Alert
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">
                    <div>{drug.brandName || '-'}</div>
                    <div className="text-[11px] text-slate-400">
                      {drug.strengthValue} {drug.strengthUnit}/{drug.volumeValue} {drug.volumeUnit}
                    </div>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-700">
                    {drug.minDosePerKg}-{drug.maxDosePerKg}{' '}
                    {drug.dosingType === 'per_dose' ? 'mg/kg/dose' : 'mg/kg/day'}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 max-w-xs truncate">
                    {drug.frequencyTextTh}
                  </td>
                  <td className="py-2.5 px-3 text-right space-x-1">
                    <button
                      onClick={() => handleStartEdit(drug)}
                      className="p-1.5 text-slate-500 hover:text-teal-700 rounded hover:bg-teal-50 transition cursor-pointer"
                      title="แก้ไข"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(drug.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-600 rounded hover:bg-rose-50 transition cursor-pointer"
                      title="ลบ"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
