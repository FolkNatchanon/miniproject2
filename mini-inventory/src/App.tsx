import { useEffect, useMemo, useState } from "react";
import type { Filter, Item, SortKey } from "./types";
import ItemForm from "./components/ItemForm";
import ItemRow from "./components/ItemRow";
import Summary from "./components/Summary";
import AuthBox from "./components/AuthBox";
import { authApi, itemsApi } from "./api";
import "./styles.css";

export default function App() {
  const [user, setUser] = useState<{ id: string; username: string } | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [sortBy, setSortBy] = useState<SortKey>("name");
  const [query, setQuery] = useState("");

  // 1) เช็ก login
  useEffect(() => {
    authApi
      .me()
      .then((u) => setUser(u))
      .catch(() => setUser(null));
  }, []);

  // 2) โหลด items หลังจาก login
  useEffect(() => {
    if (!user) return;
    itemsApi
      .list()
      .then(setItems)
      .catch((e) => alert(e.message));
  }, [user]);

  async function onLogout() {
    await authApi.logout();
    setUser(null);
    setItems([]);
  }

  async function add(item: Item) {
    const { id: _drop, ...payload } = item; // id เดิมทิ้ง ให้ DB ออก id ใหม่
    const created = await itemsApi.create(payload);
    setItems((p) => [created, ...p]);
  }

  async function inc(id: string) {
    const found = items.find((x) => x.id === id);
    if (!found) return;
    const updated = await itemsApi.patch(id, { qty: found.qty + 1 });
    setItems((p) => p.map((it) => (it.id === id ? updated : it)));
  }

  async function dec(id: string) {
    const found = items.find((x) => x.id === id);
    if (!found) return;
    const updated = await itemsApi.patch(id, { qty: Math.max(0, found.qty - 1) });
    setItems((p) => p.map((it) => (it.id === id ? updated : it)));
  }

  async function remove(id: string) {
    await itemsApi.remove(id);
    setItems((p) => p.filter((it) => it.id !== id));
  }

  async function edit(id: string, next: Partial<Item>) {
    const updated = await itemsApi.patch(id, next);
    setItems((p) => p.map((it) => (it.id === id ? updated : it)));
  }

  const view = useMemo(() => {
    let list = items;

    const q = query.trim().toLowerCase();
    if (q) list = list.filter((it) => it.name.toLowerCase().includes(q));

    if (filter === "low") list = list.filter((it) => it.qty <= it.lowAt);
    if (filter === "in") list = list.filter((it) => it.qty > it.lowAt);

    list = [...list].sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "qty") return b.qty - a.qty;
      if (sortBy === "cost") return b.cost - a.cost;
      return b.qty * b.cost - a.qty * a.cost;
    });

    return list;
  }, [items, filter, sortBy, query]);

  // ถ้ายังไม่ login -> show auth
  if (!user) {
    return <AuthBox onAuthed={(u) => setUser(u)} />;
  }

  return (
    <div style={{ minHeight: "100svh" }}>
      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
          <h1 className="h1">Stock Management</h1>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div className="badge">👤 {user.username}</div>
            <button className="btn btn-ghost" onClick={onLogout}>Logout</button>
          </div>
        </div>

        <ItemForm onAdd={add} />

        <div className="controls">
          <input
            className="input"
            placeholder="ค้นหาชื่อสินค้า..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <select className="select" value={filter} onChange={(e) => setFilter(e.target.value as Filter)}>
            <option value="all">ทั้งหมด</option>
            <option value="in">ปกติ</option>
            <option value="low">ใกล้หมด</option>
          </select>

          <select className="select" value={sortBy} onChange={(e) => setSortBy(e.target.value as SortKey)}>
            <option value="name">เรียงชื่อ</option>
            <option value="qty">เรียงจำนวน</option>
            <option value="cost">เรียงต้นทุน</option>
            <option value="value">เรียงมูลค่า</option>
          </select>
        </div>

        <Summary items={view} />

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