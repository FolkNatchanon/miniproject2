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
      style={{ gap: 8, gridTemplateColumns: 'repeat(5, minmax(0, 1fr))' }}
    >
      <input
        className="input"
        placeholder="ชื่อสินค้า"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="input"
        type="number"
        min={0}
        placeholder="จำนวน"
        value={qty}
        onChange={(e) => setQty(parseInt(e.target.value || '0', 10))}
      />
      <input
        className="input"
        placeholder="หน่วย"
        value={unit}
        onChange={(e) => setUnit(e.target.value)}
      />
      <input
        className="input"
        type="number"
        min={0}
        placeholder="ต้นทุน/หน่วย"
        value={cost}
        onChange={(e) => setCost(parseInt(e.target.value || '0', 10))}
      />
      <div className="row">
        <input
          className="input"
          type="number"
          min={0}
          placeholder="เตือนเมื่อเหลือ…"
          value={lowAt}
          onChange={(e) => setLowAt(parseInt(e.target.value || '0', 10))}
        />
        <button className="btn primary">เพิ่ม</button>
      </div>
    </form>
  );
}
