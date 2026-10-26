import React, { useState, useEffect, useMemo } from 'react';
import { DrugFormulation, DrugCategory, PrescribedItem, CalculatedDoseResult } from './types/drug';
import { SAI_BURI_DEFAULT_DRUGS } from './data/saiBuriDrugs';
import { calculatePediatricDose, DRUG_CATEGORIES } from './utils/calculator';
import { Header } from './components/Header';
import { PatientInput } from './components/PatientInput';
import { DrugCard } from './components/DrugCard';
import { QuickDoseMatrix } from './components/QuickDoseMatrix';
import { PrescriptionSlipModal } from './components/PrescriptionSlipModal';
import { DrugManagerModal } from './components/DrugManagerModal';
import { ClinicalGuidelineModal } from './components/ClinicalGuidelineModal';
import {
  Search,
  SlidersHorizontal,
  FileText,
  AlertCircle,
  X,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';

const LOCAL_STORAGE_KEY = 'sai_buri_pediatric_drugs_v1';

export default function App() {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'calc' | 'matrix' | 'prescription' | 'manager' | 'guideline'>('calc');

  // Patient states
  const [weightKg, setWeightKg] = useState<number>(10);
  const [ageMonths, setAgeMonths] = useState<number>(12);
  const [patientName, setPatientName] = useState<string>('');
  const [hn, setHn] = useState<string>('');

  // Drug database state
  const [drugs, setDrugs] = useState<DrugFormulation[]>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading stored drugs:', e);
    }
    return SAI_BURI_DEFAULT_DRUGS;
  });

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<DrugCategory>('all');

  // Prescribed items
  const [prescribedItems, setPrescribedItems] = useState<PrescribedItem[]>([]);

  // Toast / notification
  const [notification, setNotification] = useState<string | null>(null);

  // Sync drugs to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(drugs));
    } catch (e) {
      console.error('Error saving drugs to localStorage:', e);
    }
  }, [drugs]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  // Toggle drug in prescription list
  const handleTogglePrescribe = (calc: CalculatedDoseResult) => {
    const existingIndex = prescribedItems.findIndex((item) => item.drug.id === calc.drug.id);
    if (existingIndex >= 0) {
      // Remove
      setPrescribedItems((prev) => prev.filter((item) => item.drug.id !== calc.drug.id));
      showToast(`นำ ${calc.drug.genericName} ออกจากใบยาแล้ว`);
    } else {
      // Add
      const newItem: PrescribedItem = {
        id: `${calc.drug.id}-${Date.now()}`,
        drug: calc.drug,
        doseMl: calc.calculatedMlPerDose,
        teaspoonText: calc.teaspoonText,
        frequencyText: calc.drug.frequencyTextTh,
        timingText: calc.drug.timingTextTh,
        indication: calc.drug.indicationTh,
      };
      setPrescribedItems((prev) => [...prev, newItem]);
      showToast(`เพิ่ม ${calc.drug.genericName} ในบัตรคำแนะนำยาแล้ว (${calc.calculatedMlPerDose} mL)`);
    }
  };

  const handleRemovePrescribedItem = (id: string) => {
    setPrescribedItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearAllPrescribed = () => {
    setPrescribedItems([]);
    showToast('ล้างรายการยาที่เลือกทั้งหมดแล้ว');
  };

  const handleUpdateItemNote = (id: string, note: string) => {
    setPrescribedItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, customNote: note } : item))
    );
  };

  const handleResetToDefault = () => {
    setDrugs(SAI_BURI_DEFAULT_DRUGS);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    showToast('รีเซ็ตฐานข้อมูลยาเป็นค่าเริ่มต้นของเครือข่ายสายบุรีแล้ว');
  };

  // Filtered drug list
  const filteredDrugs = useMemo(() => {
    return drugs.filter((drug) => {
      const matchSearch =
        drug.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (drug.brandName && drug.brandName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        drug.indicationTh.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCategory = selectedCategory === 'all' || drug.category === selectedCategory;

      return matchSearch && matchCategory;
    });
  }, [drugs, searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Sarabun',sans-serif]">
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={prescribedItems.length}
        totalDrugsCount={drugs.length}
      />

      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-20 sm:bottom-6 right-6 z-50 bg-teal-900 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 border border-teal-700 text-xs sm:text-sm animate-bounce">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-5 sm:py-6 space-y-6">
        {/* TAB 1: Weight Calculator & Drug Formulary */}
        {activeTab === 'calc' && (
          <div className="space-y-6">
            {/* Patient Weight & Age Card */}
            <PatientInput
              weightKg={weightKg}
              setWeightKg={setWeightKg}
              ageMonths={ageMonths}
              setAgeMonths={setAgeMonths}
              patientName={patientName}
              setPatientName={setPatientName}
              hn={hn}
              setHn={setHn}
            />

            {/* Filter and Category Pills */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {/* Search input */}
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ค้นหาชื่อยา เช่น Paracetamol, Amoxicillin, ไอบู..."
                    className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-9 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition shadow-xs"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="text-xs text-slate-500 font-medium">
                  พบ <strong>{filteredDrugs.length}</strong> รายการยา (น้ำหนัก: {weightKg} กก.)
                </div>
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {DRUG_CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  const count =
                    cat.id === 'all'
                      ? drugs.length
                      : drugs.filter((d) => d.category === cat.id).length;

                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-teal-700 text-white shadow-sm font-semibold'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span>{cat.nameTh}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                          isSelected ? 'bg-teal-900/60 text-teal-100' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Drugs Cards Grid */}
            {filteredDrugs.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
                <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <h3 className="text-base font-bold text-slate-700">ไม่พบรายการยาที่ค้นหา</h3>
                <p className="text-xs text-slate-500 mt-1">
                  ลองค้นหาด้วยคำอื่น หรือกดที่ <strong>&ldquo;จัดการข้อมูลยา&rdquo;</strong> เพื่อเพิ่มรายการยานี้
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="mt-3 text-xs text-teal-700 hover:underline font-semibold"
                >
                  ล้างตัวกรองทั้งหมด
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                {filteredDrugs.map((drug) => {
                  const calculation = calculatePediatricDose(drug, weightKg, ageMonths);
                  const isPrescribed = prescribedItems.some((item) => item.drug.id === drug.id);

                  return (
                    <DrugCard
                      key={drug.id}
                      calculation={calculation}
                      isPrescribed={isPrescribed}
                      onTogglePrescribe={handleTogglePrescribe}
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Quick Dose Matrix */}
        {activeTab === 'matrix' && <QuickDoseMatrix drugs={drugs} />}

        {/* TAB 3: Prescription Cart & Parent Instruction Slip */}
        {activeTab === 'prescription' && (
          <PrescriptionSlipModal
            items={prescribedItems}
            onRemoveItem={handleRemovePrescribedItem}
            onClearAll={handleClearAllPrescribed}
            onUpdateItemNote={handleUpdateItemNote}
            patientName={patientName}
            hn={hn}
            weightKg={weightKg}
          />
        )}

        {/* TAB 4: Clinical Guidelines */}
        {activeTab === 'guideline' && <ClinicalGuidelineModal />}

        {/* TAB 5: Drug Manager */}
        {activeTab === 'manager' && (
          <DrugManagerModal
            drugs={drugs}
            onSaveDrugs={(newDrugs) => setDrugs(newDrugs)}
            onResetToDefault={handleResetToDefault}
          />
        )}
      </main>

      {/* Sticky Bottom Bar when items are selected in cart (if on calculator view) */}
      {activeTab === 'calc' && prescribedItems.length > 0 && (
        <div className="sticky bottom-0 z-20 bg-white/95 backdrop-blur border-t border-teal-200 px-4 py-3 shadow-lg print:hidden">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs shadow">
                {prescribedItems.length}
              </div>
              <div className="text-xs sm:text-sm text-slate-800">
                <span>เลือกยาแล้ว </span>
                <strong className="text-teal-900">{prescribedItems.length} รายการ</strong>
                <span className="hidden sm:inline text-slate-500">
                  {' '}
                  (สำหรับ นน. {weightKg} กก.{patientName ? ` - ${patientName}` : ''})
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('prescription')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-teal-700 hover:bg-teal-800 text-white transition shadow-sm cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>ดูและพิมพ์บัตรคำแนะนำยา</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-slate-100 border-t border-slate-200 text-slate-500 text-xs py-6 px-4 mt-12 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <ShieldCheck className="w-4 h-4 text-teal-700" />
            <span className="font-semibold text-slate-700">ระบบยา อำเภอสายบุรี (CUP Sai Buri Drug System)</span>
          </div>
          <div className="text-[11px] text-slate-500">
            โรงพยาบาลส่งเสริมสุขภาพ ในเครือข่าย จังหวัดปัตตานี
          </div>
          <div className="text-[10px] text-slate-400">
            สงวนลิขสิทธิ์เพื่อการพัฒนาคุณภาพและความปลอดภัยด้านยาในเด็ก
          </div>
        </div>
      </footer>
    </div>
  );
}
