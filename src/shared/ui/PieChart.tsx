
export function PieChart({ open, pending, closed }:{open:number;pending:number;closed:number}) {
  const total = open + pending + closed || 1;
  const o = (open/total)*100;
  const p = (pending/total)*100;
  return (
    <div style={{
      width:140,
      height:140,
      borderRadius:"50%",
      background:`conic-gradient(#2563eb 0% ${o}%, #f59e0b ${o}% ${o+p}%, #16a34a ${o+p}% 100%)`
    }} />
  );
}
