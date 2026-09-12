export default function Loader({ label = "Loading" }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-neutral-400">
      <div className="relative h-10 w-10">
        <div className="absolute inset-0 rounded-full border-2 border-ink-600" />
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-pulse" />
      </div>
      <p className="text-sm tracking-wide">{label}</p>
    </div>
  );
}
