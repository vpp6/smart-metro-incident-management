export function PulseDot({ color }: { color: string }) {
  return (
    <span className="relative inline-flex w-2 h-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ background: color }} />
      <span className="relative inline-flex rounded-full w-2 h-2" style={{ background: color }} />
    </span>
  );
}
