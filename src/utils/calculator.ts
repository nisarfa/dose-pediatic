import { CalculatedDoseResult, DrugCategory, DrugFormulation } from '../types/drug';

export interface CategoryInfo {
  id: DrugCategory;
  nameTh: string;
  shortDescTh: string;
  color: string;
  badgeBg: string;
  badgeText: string;
}

export const DRUG_CATEGORIES: CategoryInfo[] = [
  {
    id: 'all',
    nameTh: 'ยาทั้งหมด',
    shortDescTh: 'แสดงรายการยาทุกกลุ่ม',
    color: 'emerald',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-800',
  },
  {
    id: 'antipyretic',
    nameTh: 'ยาลดไข้ / บรรเทาปวด',
    shortDescTh: 'Paracetamol, Ibuprofen',
    color: 'rose',
    badgeBg: 'bg-rose-100',
    badgeText: 'text-rose-700',
  },
  {
    id: 'antibiotic',
    nameTh: 'ยาปฏิชีวนะ (ฆ่าเชื้อ)',
    shortDescTh: 'Amoxicillin, Augmentin, Cloxacillin, Cephalexin',
    color: 'amber',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-800',
  },
  {
    id: 'respiratory',
    nameTh: 'ทางเดินหายใจ / แก้แพ้ / ไอ',
    shortDescTh: 'CPM, Cetirizine, Salbutamol, Bisolvon',
    color: 'cyan',
    badgeBg: 'bg-cyan-100',
    badgeText: 'text-cyan-800',
  },
  {
    id: 'gi',
    nameTh: 'ระบบทางเดินอาหาร / ท้องเสีย',
    shortDescTh: 'Domperidone, Ondansetron, Air-X, Zinc, ORS',
    color: 'teal',
    badgeBg: 'bg-teal-100',
    badgeText: 'text-teal-800',
  },
  {
    id: 'steroid_emergency',
    nameTh: 'สเตียรอยด์ / ยาฉุกเฉิน',
    shortDescTh: 'Prednisolone, Dexamethasone, Diazepam',
    color: 'purple',
    badgeBg: 'bg-purple-100',
    badgeText: 'text-purple-800',
  },
  {
    id: 'supplements',
    nameTh: 'ถ่ายพยาธิ / ธาตุเหล็ก / วิตามิน',
    shortDescTh: 'Albendazole, Fer-in-sol, MVI',
    color: 'blue',
    badgeBg: 'bg-blue-100',
    badgeText: 'text-blue-800',
  },
];

/**
 * Format volume in standard Thai medical spoon/teaspoon text
 */
export function formatTeaspoonText(ml: number, formType: DrugFormulation['formType']): string {
  if (formType === 'rectal') {
    return '1 หลอดสวนทวาร';
  }
  if (formType === 'tablet') {
    if (ml <= 0.5) return '1/2 เม็ด';
    if (ml <= 1) return '1 เม็ด';
    return `${Math.round(ml * 10) / 10} เม็ด`;
  }
  if (formType === 'drops') {
    // 1 dropper is usually 0.6 mL (approx 15-20 drops)
    if (ml <= 0.3) return '~ 0.3 mL (ครึ่งหลอดหยด)';
    if (ml <= 0.6) return '~ 0.6 mL (1 หลอดหยด)';
    if (ml <= 0.9) return '~ 0.9 mL (1½ หลอดหยด)';
    if (ml <= 1.2) return '~ 1.2 mL (2 หลอดหยด)';
    return `${ml.toFixed(1)} mL (ใช้หลอดหยดตวง)`;
  }

  // Liquid / Syrup (1 teaspoon = 5 mL)
  if (ml <= 1.25) {
    return '1/4 ช้อนชา (1.25 mL)';
  } else if (ml <= 2.5) {
    return '1/2 ช้อนชา (2.5 mL)';
  } else if (ml <= 3.75) {
    return '3/4 ช้อนชา (3.75 mL)';
  } else if (ml <= 5.0) {
    return '1 ช้อนชา (5 mL)';
  } else if (ml <= 7.5) {
    return '1½ ช้อนชา (7.5 mL)';
  } else if (ml <= 10.0) {
    return '2 ช้อนชา (10 mL)';
  } else if (ml <= 12.5) {
    return '2½ ช้อนชา (12.5 mL)';
  } else if (ml <= 15.0) {
    return '3 ช้อนชา / 1 ช้อนโต๊ะ (15 mL)';
  } else {
    const tsp = Math.round((ml / 5) * 2) / 2;
    return `ประมาณ ${tsp} ช้อนชา (${ml.toFixed(1)} mL)`;
  }
}

/**
 * Calculate pediatric drug dose based on body weight (BW)
 */
export function calculatePediatricDose(
  drug: DrugFormulation,
  weightKg: number,
  ageMonths?: number
): CalculatedDoseResult {
  const targetDosePerKg = drug.defaultDosePerKg ?? (drug.minDosePerKg + drug.maxDosePerKg) / 2;
  const concentrationRatio = drug.volumeValue / drug.strengthValue; // mL per 1 mg

  let mgPerDose = 0;
  let dailyTotalMg = 0;
  let frequencyTimes = drug.frequencyTimesPerDay || 3;

  if (drug.dosingType === 'per_dose') {
    mgPerDose = weightKg * targetDosePerKg;
    dailyTotalMg = mgPerDose * frequencyTimes;
  } else {
    // per_day
    dailyTotalMg = weightKg * targetDosePerKg;
    mgPerDose = dailyTotalMg / frequencyTimes;
  }

  // Safety caps check
  let isExceedsMaxDose = false;
  let warningNote: string | undefined;

  if (drug.maxSingleDoseMg && mgPerDose > drug.maxSingleDoseMg) {
    mgPerDose = drug.maxSingleDoseMg;
    isExceedsMaxDose = true;
    warningNote = `ขนาดยาถูกจำกัดไว้ที่ขนาดสูงสุดต่อครั้ง (${drug.maxSingleDoseMg} mg)`;
  }

  if (drug.maxDailyDoseMg && dailyTotalMg > drug.maxDailyDoseMg) {
    dailyTotalMg = drug.maxDailyDoseMg;
    mgPerDose = dailyTotalMg / frequencyTimes;
    isExceedsMaxDose = true;
    warningNote = `ขนาดยาถูกจำกัดไว้ที่ขนาดสูงสุดต่อวัน (${drug.maxDailyDoseMg} mg/วัน)`;
  }

  // Convert to mL
  let mlPerDose = mgPerDose * concentrationRatio;
  let dailyTotalMl = dailyTotalMg * concentrationRatio;

  // Rounding for practical clinical use:
  // For small volume drops (< 1.5 ml), keep 2 decimals
  // For standard syrup, round to nearest 0.1 or 0.25 ml
  if (drug.formType === 'drops') {
    mlPerDose = Math.round(mlPerDose * 10) / 10;
  } else {
    mlPerDose = Math.round(mlPerDose * 10) / 10;
  }

  dailyTotalMl = Math.round(dailyTotalMl * 10) / 10;
  mgPerDose = Math.round(mgPerDose * 10) / 10;
  dailyTotalMg = Math.round(dailyTotalMg * 10) / 10;

  // Age warning check
  let isAgeWarning = false;
  if (ageMonths !== undefined && drug.minAgeMonths && ageMonths < drug.minAgeMonths) {
    isAgeWarning = true;
    const ageWarningText = `⚠️ ควรระวัง: ยานี้มักไม่แนะนำในเด็กอายุน้อยกว่า ${drug.minAgeMonths} เดือน (อายุที่ระบุ: ${ageMonths} เดือน)`;
    warningNote = warningNote ? `${warningNote} | ${ageWarningText}` : ageWarningText;
  }

  const teaspoonText = formatTeaspoonText(mlPerDose, drug.formType);
  const doseSummaryString = `${mlPerDose} mL (${teaspoonText}) ${drug.frequencyTextTh}`;

  return {
    drug,
    patientWeightKg: weightKg,
    calculatedMgPerDose: mgPerDose,
    calculatedMlPerDose: mlPerDose,
    teaspoonText,
    dailyTotalMg,
    dailyTotalMl,
    isExceedsMaxDose,
    isAgeWarning,
    warningNote,
    doseSummaryString,
  };
}

/**
 * Standard median weight estimation by age based on Thai/WHO Growth Standards
 */
export function estimateWeightFromAge(ageMonths: number): number {
  if (ageMonths <= 0) return 3.2;
  if (ageMonths === 1) return 4.2;
  if (ageMonths === 2) return 5.3;
  if (ageMonths === 3) return 6.2;
  if (ageMonths === 4) return 6.9;
  if (ageMonths === 5) return 7.4;
  if (ageMonths === 6) return 7.9;
  if (ageMonths === 9) return 8.9;
  if (ageMonths === 12) return 9.6; // 1 year
  if (ageMonths === 18) return 11.0;
  if (ageMonths === 24) return 12.2; // 2 years
  if (ageMonths === 36) return 14.3; // 3 years
  if (ageMonths === 48) return 16.3; // 4 years
  if (ageMonths === 60) return 18.3; // 5 years
  if (ageMonths === 72) return 20.5; // 6 years
  if (ageMonths === 84) return 23.0; // 7 years
  if (ageMonths === 96) return 25.5; // 8 years
  if (ageMonths === 108) return 28.5; // 9 years
  if (ageMonths === 120) return 32.0; // 10 years
  if (ageMonths === 144) return 38.0; // 12 years

  // Standard Nelson pediatric formula:
  // For age > 1 yr: Weight (kg) = (Age in years * 2) + 8
  const ageYears = ageMonths / 12;
  return Math.round((ageYears * 2 + 8) * 10) / 10;
}
