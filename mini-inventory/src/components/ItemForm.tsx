import { useState } from 'react';
import type { Item } from '../types';
import { uid } from '../utils/storage';

interface Props {
  onAdd: (item: Item) => void;
}

export default function ItemForm({ onAdd }: Props) {
  const [name, setName] = useState('');
  const [qty, setQty] = useState<number>(1);
  const [unit, setUnit] = useState('กล่อง');
  const [cost, setCost] = useState<number>(0);
  const [lowAt, setLowAt] = useState<number>(5);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({
      id: uid(),
      name: name.trim(),
      qty: Math.max(0, qty),
      unit,
      cost: Math.max(0, cost),
      lowAt: Math.max(0, lowAt),
    });
    setName('');
    setQty(1);
    setUnit('กล่อง');
    setCost(0);
    setLowAt(5);
  }

  return (
    <form
      onSubmit={submit}
      className="grid"
      style={{ gap: 12, gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', alignItems: 'end' }}
    >
      <div>
        <label className="small">ชื่อสินค้า</label>
        <input
          className="input"
          placeholder="เช่น น้ำดื่ม, เสื้อชูชีพ"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div>
        <label className="small">จำนวน</label>
        <input
          className="input"
          type="number"
          min={0}
          placeholder="0"
          value={qty}
          onChange={(e) => setQty(parseInt(e.target.value || '0', 10))}
        />
      </div>

      <div>
        <label className="small">หน่วย</label>
        <input
          className="input"
          placeholder="กล่อง, ขวด, ถุง"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
        />
      </div>

      <div>
        <label className="small">ต้นทุนต่อหน่วย (บาท)</label>
        <input
          className="input"
          type="number"
          min={0}
          placeholder="0"
          value={cost}
          onChange={(e) => setCost(parseInt(e.target.value || '0', 10))}
        />
      </div>

      <div>
        <label className="small">เตือนเมื่อเหลือ ≤</label>
        <div className="row">
          <input
            className="input"
            type="number"
            min={0}
            placeholder="5"
            value={lowAt}
            onChange={(e) => setLowAt(parseInt(e.target.value || '0', 10))}
          />
          <button className="btn primary">เพิ่ม</button>
        </div>
      </div>
    </form>
  );

}
