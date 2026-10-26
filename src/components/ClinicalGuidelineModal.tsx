import React from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  HeartPulse,
  Thermometer,
  Pill,
  Droplets,
  Activity,
  CheckCircle2,
} from 'lucide-react';

export const ClinicalGuidelineModal: React.FC = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title */}
      <div className="bg-gradient-to-r from-teal-800 to-emerald-800 text-white p-6 rounded-2xl shadow-md">
        <h2 className="text-xl font-bold font-['Prompt',sans-serif] flex items-center gap-2">
          <HeartPulse className="w-6 h-6 text-emerald-300" />
          แนวทางความปลอดภัยทางคลินิกด้านยาในเด็ก ระบบยา อำเภอสายบุรี
        </h2>
        <p className="text-xs sm:text-sm text-teal-100 mt-1">
          หลักเกณฑ์ความปลอดภัย การป้องกันความคลาดเคลื่อนทางยา และการใช้ยาอย่างสมเหตุผลในเด็ก (RDU Ped)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Card 1: Fever & Paracetamol / Ibuprofen */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-rose-700 font-bold font-['Prompt',sans-serif]">
            <Thermometer className="w-5 h-5 text-rose-600" />
            <h3>1. แนวทางยาลดไข้และการป้องกันพิษต่อตับ</h3>
          </div>

          <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
            <p>
              <strong className="text-slate-800">Paracetamol:</strong> ขนาดยาที่ปลอดภัยคือ <strong>10 - 15 mg/kg/dose</strong> ทุก 4 - 6 ชั่วโมง เมื่อมีไข้
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-700">
              <li>ไม่ควรให้เกินวันละ 5 ครั้ง (ขนาดยารวมสูงสุดไม่เกิน 75 mg/kg/วัน หรือ 2,000 mg/วัน)</li>
              <li>
                <strong>ระวังความสับสนสูตรยา:</strong> Drops (60 mg/0.6 mL) มีความเข้มข้นมากกว่า Syrup ธรรมดา (120 mg/5 mL) ถึงกว่า 4 เท่า ตรวจสอบฉลากและใช้ Dropper ตวงเสมอ
              </li>
              <li>
                <strong>เช็ดตัวลดไข้ (Tepid Sponge):</strong> แนะนำให้เช็ดตัวลดไข้ด้วยน้ำธรรมดาควบคู่กับการให้ยา โดยเฉพาะเด็กที่มีประวัติชักจากไข้สูง
              </li>
            </ul>

            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 mt-2">
              <strong className="flex items-center gap-1 font-bold">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" /> ข้อควรระวัง Ibuprofen:
              </strong>
              <span>
                ห้ามใช้ในเด็กที่สงสัยโรคไข้เลือดออก (Dengue) หรือภาวะขาดน้ำรุนแรง เพราะเสี่ยงต่อเลือดออกในทางเดินอาหารและไตวายเฉียบพลัน และห้ามใช้ในเด็กอายุน้อยกว่า 6 เดือน
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Antibiotic Stewardship */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-amber-700 font-bold font-['Prompt',sans-serif]">
            <Pill className="w-5 h-5 text-amber-600" />
            <h3>2. การใช้ยาปฏิชีวนะอย่างสมเหตุผล (RDU in Ped)</h3>
          </div>

          <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
            <p>
              โรคหวัด คัดจมูก ไอ เจ็บคอ และท้องเสียเฉียบพลันในเด็ก <strong>กว่า 80-90% เกิดจากเชื้อไวรัส</strong> การให้ยาปฏิชีวนะไม่ช่วยให้อาการหายเร็วขึ้นและเพิ่มความเสี่ยงเชื้อดื้อยา
            </p>

            <div className="space-y-1.5 pt-1">
              <div className="font-semibold text-slate-800">ข้อพิจารณาเมื่อจำเป็นต้องใช้ยาฆ่าเชื้อ:</div>
              <ul className="list-disc list-inside space-y-1 text-slate-700">
                <li>
                  <strong>Amoxicillin ขนาดมาตรฐาน:</strong> 40-50 mg/kg/day แบ่งวันละ 3 ครั้ง สำหรับคออักเสบ ทอนซิลอักเสบจากเชื้อแบคทีเรีย
                </li>
                <li>
                  <strong>Amoxicillin High-Dose:</strong> 80-90 mg/kg/day สำหรับหูชั้นกลางอักเสบเฉียบพลัน (AOM) หรือไซนัสอักเสบเฉียบพลัน
                </li>
                <li>
                  <strong>เน้นย้ำผู้ปกครอง:</strong> ต้องรับประทานยาปฏิชีวนะติดต่อกันจนครบตามแพทย์สั่ง (7-10 วัน) แม้เด็กจะไข้ลดหรืออาการดีขึ้นแล้วก็ตาม
                </li>
              </ul>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900">
              <strong className="block font-bold">การเก็บรักษายาน้ำผงแห้งหลังผสม:</strong>
              <span>
                ยาน้ำปฏิชีวนะส่วนใหญ่ เช่น Amoxicillin, Cloxacillin, Augmentin ควรเก็บในตู้เย็นช่องธรรมดา (2-8°C) และใช้ให้หมดภายใน 7-14 วัน ห้ามแช่ช่องฟรีซ
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Acute Diarrhea Management */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-teal-700 font-bold font-['Prompt',sans-serif]">
            <Droplets className="w-5 h-5 text-teal-600" />
            <h3>3. แนวทางรักษาโรคอุจจาระร่วงเฉียบพลัน (Acute Diarrhea)</h3>
          </div>

          <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
            <div className="p-2.5 bg-teal-50 border border-teal-200 rounded-xl text-teal-900 font-medium">
              หลักการสำคัญอันดับ 1 คือ <strong>&ldquo;ป้องกันและแก้ไขภาวะขาดน้ำ (Rehydration)&rdquo;</strong>
            </div>

            <ul className="list-disc list-inside space-y-1 text-slate-700">
              <li>
                <strong>น้ำตาลเกลือแร่ ORS:</strong> ให้จิบบ่อยๆ ทีละน้อยตลอดทั้งวัน หลีกเลี่ยงเครื่องดื่มเกลือแร่สำหรับนักกีฬาที่มีน้ำตาลสูง
              </li>
              <li>
                <strong>เสริมธาตุสังกะสี (Zinc Supplementation):</strong> แนะนำให้ Zinc 10-20 mg/วัน ติดต่อกัน 10-14 วัน ช่วยฟื้นฟูเยื่อบุลำไส้และลดระยะเวลาการถ่ายเหลวตามแนวทาง WHO
              </li>
              <li>
                <strong>ห้ามใช้ยาหยุดถ่าย (Antimotility / Loperamide):</strong> ห้ามใช้ในเด็กเล็กเด็ดขาด เพราะอาจทำให้ลำไส้เป็นอัมพาตและติดเชื้อรุนแรง
              </li>
            </ul>

            <div className="text-rose-700 font-semibold pt-1">
              สัญญาณเตือนต้องรีบนำเด็กส่งโรงพยาบาล: ซึม กระหม่อมบุ๋ม ตาลึกโหล ปากแห้ง ไม่ยอมดื่มน้ำ ปัสสาวะไม่ออกนานเกิน 6 ชม. หรือถ่ายเป็นมูกเลือด
            </div>
          </div>
        </div>

        {/* Card 4: High Alert & Seizure Safety */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-purple-700 font-bold font-['Prompt',sans-serif]">
            <Activity className="w-5 h-5 text-purple-600" />
            <h3>4. การดูแลเด็กชักจากไข้และยาเฝ้าระวังสูง (High Alert Drugs)</h3>
          </div>

          <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
            <div className="font-semibold text-slate-800">การปฐมพยาบาลเมื่อเด็กชักจากไข้:</div>
            <ul className="list-disc list-inside space-y-1 text-slate-700">
              <li>จัดท่านอนตะแคงเพื่อป้องกันการสำลัก คลายเสื้อผ้าให้โปร่ง</li>
              <li><strong>ห้ามนำช้อน นิ้ว หรือสิ่งของใดๆ ยัดใส่ปากเด็กเด็ดขาด</strong></li>
              <li>
                หากแพทย์เคยจ่าย <strong>Diazepam Rectal Tube (Stesolid 5 mg หรือ 10 mg):</strong> ให้สวนทวารหนักตามขนาดยาที่ระบุหากอาการชักเกิน 3-5 นาที แล้วรีบนำส่ง รพ.
              </li>
            </ul>

            <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-purple-900 mt-2">
              <strong className="block font-bold">Double-check ก่อนส่งมอบยา:</strong>
              <span>
                ทุกครั้งที่จ่ายยาเด็ก บุคลากรควรทบทวน &ldquo;5 Rights&rdquo;: ถูกคน, ถูกยา, ถูกขนาด (คำนวณตามน้ำหนักตัวจริง), ถูกวิธี, และถูกเวลา พร้อมสอนผู้ปกครองดูขีดตวงยาบน Syringe หรือช้อนยา
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
