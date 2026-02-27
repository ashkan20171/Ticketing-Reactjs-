export function Skeleton({
  h = 50,
  w = "100%",
  r = 12,
}: { h?: number; w?: number | string; r?: number }) {
  return (
    <div
      className="sk"
      style={{
        height: h,
        width: w,
        borderRadius: r,
      }}
      aria-hidden="true"
    />
  );
}
