import { useId } from "react";
// Nexora monogram; brand colors and component contract are preserved.
const ORANGE_LOOP = "M9 23V5";
const GREEN_LOOP = "M9 5L39 23V5";
export function BrandMark({
  className = "brand-mark",
  tone = "color",
  weight = 4.2,
}: {
  className?: string;
  /** "mono" paints with currentColor, for watermarks on brand surfaces. */
  tone?: "color" | "mono";
  /** Loop stroke in mark units (48×28); thinner reads better at large scale. */
  weight?: number;
}) {
  const id = useId();
  const orange = tone === "color" ? `url(#${id}o)` : "currentColor";
  const green = tone === "color" ? `url(#${id}g)` : "currentColor";
  return (
    <svg
      className={className}
      viewBox="0 0 48 28"
      aria-hidden="true"
      focusable="false"
    >
      {tone === "color" && (
        <defs>
          <linearGradient id={`${id}o`} x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#fbb900" />
            <stop offset="1" stopColor="#ee8100" />
          </linearGradient>
          <linearGradient id={`${id}g`} x1="1" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1ba14a" />
            <stop offset="1" stopColor="#a6cf5e" />
          </linearGradient>
        </defs>
      )}
      <g className="loop-orange">
        <path
          d={ORANGE_LOOP}
          fill="none"
          stroke={orange}
          strokeWidth={weight}
          strokeLinecap="round"
        />
      </g>
      <g className="loop-green">
        <path
          d={GREEN_LOOP}
          fill="none"
          stroke={green}
          strokeWidth={weight}
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
export function Loader({ label }: { label: string }) {
  return (
    <div className="loader" role="status">
      <BrandMark className="loader-mark" />
      <span>{label}</span>
    </div>
  );
}
