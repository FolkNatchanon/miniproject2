import { useState } from 'react';
import type { Item } from '../types';
import { formatCurrency } from '../utils/storage';

interface Props {
  item: Item;
  onInc: () => void;
  onDec: () => void;
  onDelete: () => void;
  onEdit: (next: Partial<Item>) => void;
}

export default function ItemRow({ item, onInc, onDec, onDelete, onEdit }: Props) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(item.name);
  const [unit, setUnit] = useState(item.unit);
  const [cost, setCost] = useState(item.cost);
  const [lowAt, setLowAt] = useState(item.lowAt);

  function save() {
    onEdit({
      name: name.trim() || item.name,
      unit: unit.trim() || item.unit,
      cost: Math.max(0, cost),
      lowAt: Math.max(0, lowAt),
    });
    setEditing(false);
  }

  const isLow = item.qty <= item.lowAt;
  const isOut = item.qty === 0; // ✅ เพิ่ม: หมดสต๊อก
  const value = item.qty * item.cost;

  return (
    <div className={`row-item ${isOut ? 'out' : isLow ? 'low' : ''}`}>
      {editing ? (
        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="input" value={unit} onChange={(e) => setUnit(e.target.value)} />
        </div>
      ) : (
        <div>
          <div style={{ fontWeight: 600 }}>{item.name}</div>
          <div className="small">หน่วย: {item.unit} • เกณฑ์เตือน: ≤ {item.lowAt}</div>
          {isOut && <div className="small" style={{ fontWeight: 700 }}>❗ หมดสต๊อก</div>}
        </div>
      )}

      <div className="row" style={{ justifyContent: 'flex-end' }}>
        <button onClick={onDec} className="btn">-</button>
        <div className="num" style={{ width: 56, textAlign: 'center' }}>{item.qty}</div>
        <button onClick={onInc} className="btn">+</button>
      </div>

      <div className="center">
        {editing ? (
          <input
            type="number"
            min={0}
            className="input"
            style={{ width: 96 }}
            value={cost}
            onChange={(e) => setCost(parseInt(e.target.value || '0', 10))}
          />
        ) : (
          <div className="num">{formatCurrency(item.cost)}</div>
        )}
        <div className="small">ต้นทุน/หน่วย</div>
      </div>

      <div className="center">
        {editing ? (
          <input
            type="number"
            min={0}
            className="input"
            style={{ width: 80 }}
            value={lowAt}
            onChange={(e) => setLowAt(parseInt(e.target.value || '0', 10))}
          />
        ) : (
          <div className="num">≤ {item.lowAt}</div>
        )}
        <div className="small">เตือนเมื่อเหลือ</div>
      </div>

      <div className="center">
        <div className="num" style={{ fontWeight: 600 }}>{formatCurrency(value)}</div>
        <div className="row" style={{ justifyContent: 'flex-end', gap: 8, marginTop: 6 }}>
          {editing ? (
            <button onClick={save} className="btn primary" style={{ fontSize: 12 }}>Save</button>
          ) : (
            <button onClick={() => setEditing(true)} className="btn" style={{ fontSize: 12 }}>Edit</button>
          )}
          <button onClick={onDelete} className="btn danger" style={{ fontSize: 12 }}>Del</button>
        </div>
      </div>
    </div>
  );
}