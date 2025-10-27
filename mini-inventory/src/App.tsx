import { useEffect, useMemo, useState } from 'react';
import type { Item, Filter, SortKey } from './types';
import { formatCurrency, uid } from './utils/storage';
import { useLocalStorageObject } from './hooks/useLocalStorageObject';
import ItemForm from './components/ItemForm';
import ItemRow from './components/ItemRow';
import Summary from './components/Summary';
import './styles.css';

const STORAGE_KEY = 'mini-inventory-v1';

type PersistShape = { items: Item[]; filter: Filter; sortBy: SortKey; query: string };

export default function App() {
  const [items, setItems] = useState<Item[]>(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    try { return (JSON.parse(raw) as PersistShape).items ?? []; } catch { return []; }
  });
  const [filter, setFilter] = useState<Filter>(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    try { return raw ? (JSON.parse(raw) as PersistShape).filter ?? 'all' : 'all'; } catch { return 'all'; }
  });
  const [sortBy, setSortBy] = useState<SortKey>(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    try { return raw ? (JSON.parse(raw) as PersistShape).sortBy ?? 'name' : 'name'; } catch { return 'name'; }
  });
  const [query, setQuery] = useState<string>(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    try { return raw ? (JSON.parse(raw) as PersistShape).query ?? '' : ''; } catch { return ''; }
  });

  useLocalStorageObject<PersistShape>(STORAGE_KEY, { items, filter, sortBy, query }, [items, filter, sortBy, query]);

  useEffect(() => {
    const total = items.reduce((acc, it) => acc + it.qty * it.cost, 0);
    document.title = `${formatCurrency(total)} • Mini Inventory`;
  }, [items]);

  // actions
  function add(item: Item) { setItems((prev) => [item, ...prev]); }
  function inc(id: string) { setItems((prev) => prev.map((it) => it.id === id ? { ...it, qty: it.qty + 1 } : it)); }
  function dec(id: string) { setItems((prev) => prev.map((it) => it.id === id ? { ...it, qty: Math.max(0, it.qty - 1) } : it)); }
  function remove(id: string) { setItems((prev) => prev.filter((it) => it.id !== id)); }
  function edit(id: string, next: Partial<Item>) { setItems((prev) => prev.map((it) => it.id === id ? { ...it, ...next } : it)); }
  function clearAll() { if (confirm('ลบทั้งหมด?')) setItems([]); }
  function importJSON(text: string) {
    try {
      const parsed = JSON.parse(text) as Item[];
      const mapped = parsed.map((p) => ({ ...p, id: uid() }));
      setItems((prev) => [...mapped, ...prev]);
    } catch {
      alert('ไฟล์ไม่ถูกต้อง');
    }
  }
  function exportJSON() {
    const blob = new Blob([JSON.stringify(items, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'inventory.json'; a.click();
    URL.revokeObjectURL(url);
  }

  // derived
  const view = useMemo(() => {
    let list = items;
    const q = query.trim().toLowerCase();
    if (q) list = list.filter((it) => it.name.toLowerCase().includes(q));
    if (filter === 'low') list = list.filter((it) => it.qty <= it.lowAt);
    if (filter === 'in') list = list.filter((it) => it.qty > it.lowAt);

    list = [...list].sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'qty') return b.qty - a.qty;
      if (sortBy === 'cost') return b.cost - a.cost;
      const va = a.qty * a.cost, vb = b.qty * b.cost;
      return vb - va;
    });
    return list;
  }, [items, filter, sortBy, query]);

  return (
    <div style={{ minHeight: '100svh' }}>
      <div className="container">
        <h1 className="h1">Mini Inventory</h1>
        <p className="muted">จัดการสต็อกง่ายๆ — บันทึกในเครื่อง (localStorage)</p>

        <ItemForm onAdd={add} />

        <div className="row wrap" style={{ alignItems: 'stretch', marginTop: 12, gap: 8 }}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ค้นหา…"
            className="input"
            style={{ flex: 1 }}
          />

          <select value={filter} onChange={(e) => setFilter(e.target.value as Filter)} className="select">
            <option value="all">ทั้งหมด</option>
            <option value="low">ใกล้หมด</option>
            <option value="in">มีเพียงพอ</option>
          </select>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortKey)} className="select">
            <option value="name">ชื่อ</option>
            <option value="qty">จำนวน</option>
            <option value="cost">ต้นทุน/หน่วย</option>
            <option value="value">มูลค่ารวม</option>
          </select>

          <div className="row" style={{ gap: 8 }}>
            <button onClick={exportJSON} className="btn">Export JSON</button>
            <label className="btn" style={{ cursor: 'pointer' }}>
              Import JSON
              <input
                type="file"
                accept="application/json"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  const r = new FileReader();
                  r.onload = () => importJSON(String(r.result));
                  r.readAsText(f);
                }}
              />
            </label>
            <button onClick={clearAll} className="btn danger">ลบทั้งหมด</button>
          </div>
        </div>

        <div style={{ marginTop: 8 }}>
          <Summary items={items} />
        </div>

        <div className="table" style={{ marginTop: 8 }}>
          {view.map((it) => (
            <ItemRow
              key={it.id}
              item={it}
              onInc={() => inc(it.id)}
              onDec={() => dec(it.id)}
              onDelete={() => remove(it.id)}
              onEdit={(next) => edit(it.id, next)}
            />
          ))}
          {view.length === 0 && <div className="hr-dash center">ไม่พบรายการ</div>}
        </div>
      </div>
    </div>
  );
}
