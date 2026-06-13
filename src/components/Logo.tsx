export default function Logo({ size = "sm" }: { size?: "sm" | "lg" }) {
  const iconSize = size === "lg" ? 48 : 32;
  const textSize = size === "lg" ? "text-3xl" : "text-xl";

  return (
    <a href="#hero" className={`flex items-center gap-3 font-bold tracking-tight text-white ${textSize}`}>
      <svg width={iconSize} height={iconSize} viewBox="0 0 48 48" fill="none">
        <rect x="4" y="4" width="40" height="40" rx="10" stroke="#d97706" strokeWidth="2.5" fill="none" />
        <path d="M16 16L24 24L16 32" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M28 30H32" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
      <span>
        <span className="text-amber-500">F</span>orja
      </span>
    </a>
  );
}
