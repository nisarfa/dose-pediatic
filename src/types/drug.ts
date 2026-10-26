export type DrugCategory =
  | 'antipyretic' // ยาลดไข้ บรรเทาปวด
  | 'antibiotic' // ยาปฏิชีวนะ
  | 'respiratory' // ยาทางเดินหายใจ แก้แพ้ แก้ไอ ลดน้ำมูก
  | 'gi' // ทางเดินอาหาร อาเจียน ท้องเสีย
  | 'steroid_emergency' // สเตียรอยด์และยาฉุกเฉิน
  | 'supplements' // ยาถ่ายพยาธิและวิตามินบำรุง
  | 'all';

export interface DrugFormulation {
  id: string;
  genericName: string;
  brandName?: string;
  category: Exclude<DrugCategory, 'all'>;
  strengthValue: number; // e.g. 120
  strengthUnit: string; // e.g. 'mg'
  volumeValue: number; // e.g. 5
  volumeUnit: string; // e.g. 'mL'
  formType: 'syrup' | 'drops' | 'suspension' | 'dry_syrup' | 'solution' | 'tablet' | 'rectal';

  // Dosing rules
  dosingType: 'per_dose' | 'per_day'; // whether standard mg/kg is per dose or divided per day
  minDosePerKg: number; // mg/kg (or drops/kg if specified)
  maxDosePerKg: number; // mg/kg
  defaultDosePerKg?: number; // default recommended mg/kg

  // Frequency
  frequencyHours?: number; // e.g. 4-6 hr -> 6
  frequencyTimesPerDay?: number; // e.g. 3 times a day (TID)
  frequencyTextTh: string; // e.g. 'ทุก 4 - 6 ชั่วโมง เมื่อมีไข้' หรือ 'วันละ 3 ครั้ง หลังอาหาร'
  timingTextTh: string; // 'หลังอาหารทันที', 'ก่อนอาหาร 30-60 นาที', 'พร้อมอาหาร'

  // Safety caps
  maxSingleDoseMg?: number; // Maximum single dose in mg
  maxDailyDoseMg?: number; // Maximum total daily dose in mg
  minAgeMonths?: number; // Minimum recommended age in months (e.g. 6 months for Ibuprofen)
  maxDailyDosesCount?: number; // Max times per day (e.g. 5 times for Paracetamol)

  // Clinical indications & instructions
  indicationTh: string; // ข้อบ่งใช้ เช่น ไข้ ปวด
  instructionsTh: string; // คำแนะนำการใช้ยา เช่น เขย่าขวดก่อนใช้
  warningTh?: string; // คำเตือน เช่น ห้ามใช้ในผู้ป่วยสงสัยไข้เลือดออก
  storageTh?: string; // การเก็บรักษา เช่น แช่ตู้เย็นหลังผสม
  isHighAlert?: boolean; // ยาที่มีความเสี่ยงสูง
}

export interface CalculatedDoseResult {
  drug: DrugFormulation;
  patientWeightKg: number;
  calculatedMgPerDose: number;
  calculatedMlPerDose: number;
  teaspoonText: string;
  dropsCount?: number;
  dailyTotalMg: number;
  dailyTotalMl: number;
  isExceedsMaxDose: boolean;
  isAgeWarning: boolean;
  warningNote?: string;
  doseSummaryString: string;
}

export interface PrescribedItem {
  id: string;
  drug: DrugFormulation;
  doseMl: number;
  teaspoonText: string;
  frequencyText: string;
  timingText: string;
  customNote?: string;
  indication: string;
}
