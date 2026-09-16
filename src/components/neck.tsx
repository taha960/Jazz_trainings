import type { FretPos } from "@/lib/music";
import { STRING_NAMES } from "@/lib/music";
import { cn } from "@/lib/utils";

interface NeckProps {
  fingering: FretPos[] | null;
  className?: string;
}

export function Neck({ fingering, className }: NeckProps) {
  if (!fingering?.length) {
    return (
      <p className={cn("text-xs text-ink-muted", className)}>
        Doigté laissé libre — travailler les notes, pas une box.
      </p>
    );
  }
  const frets = fingering.map((p) => p.fret);
  const minF = Math.max(0, Math.min(...frets) - 1);
  const maxF = Math.min(19, Math.max(...frets, minF + 5));
  const cols = maxF - minF + 1;
  const cellW = 28;
  const cellH = 16;
  const nut = minF === 0;
  const w = 28 + cols * cellW;
  const h = 14 + 6 * cellH;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={cn("w-full max-w-md text-ink", className)}>
      {STRING_NAMES.map((name, s) => {
        const y = 10 + s * cellH;
        return (
          <g key={name}>
            <text x={2} y={y + 4} fontSize={8} fill="currentColor" opacity={0.45} fontFamily="ui-monospace, monospace">
              {name}
            </text>
            <line
              x1={22}
              x2={w - 4}
              y1={y}
              y2={y}
              stroke="currentColor"
              strokeOpacity={0.35}
              strokeWidth={s === 0 || s === 5 ? 1.4 : 1}
            />
          </g>
        );
      })}
      {Array.from({ length: cols + 1 }, (_, i) => {
        const x = 22 + i * cellW;
        const isNut = nut && i === 0;
        return (
          <line
            key={i}
            x1={x}
            x2={x}
            y1={10}
            y2={10 + 5 * cellH}
            stroke="currentColor"
            strokeOpacity={isNut ? 0.8 : 0.22}
            strokeWidth={isNut ? 3 : 1}
          />
        );
      })}
      {fingering.map((p, i) => {
        const cx = p.fret === 0 ? 16 : 22 + (p.fret - minF - 0.5) * cellW;
        const y = 10 + p.string * cellH;
        return (
          <g key={`${p.string}-${p.fret}-${i}`}>
            <circle cx={cx} cy={y} r={6.2} fill="currentColor" />
            <text
              x={cx}
              y={y + 3}
              textAnchor="middle"
              fontSize={8}
              fill="var(--color-sheet)"
              fontFamily="ui-monospace, monospace"
            >
              {i + 1}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
