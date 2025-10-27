export type Item = {
  id: string;
  name: string;
  qty: number;   // จำนวนคงเหลือ
  unit: string;  // หน่วย เช่น ขวด, แพ็ค, กล่อง
  cost: number;  // ต้นทุนต่อหน่วย
  lowAt: number; // เกณฑ์แจ้งเตือนของใกล้หมด
};

export type Filter = 'all' | 'low' | 'in';
export type SortKey = 'name' | 'qty' | 'cost' | 'value';
