import type { Item } from '../types';
import { formatCurrency } from '../utils/storage';

interface Props {
  items: Item[];
}

export default function Summary({ items }: Props) {
  const totalValue = items.reduce((acc, it) => acc + it.qty * it.cost, 0);
  const lowCount = items.filter((it) => it.qty <= it.lowAt).length;

  return (
    <div className="row wrap" style={{ alignItems: 'center' }}>
      <div className="badge">รวมมูลค่าสต็อก: <b>{formatCurrency(totalValue)}</b></div>
      <div className={`badge ${lowCount ? 'warn' : ''}`}>ของใกล้หมด: <b>{lowCount}</b> รายการ</div>
      <div className="badge">จำนวนทั้งหมด: <b>{items.length}</b> ชนิด</div>
    </div>
  );
}
