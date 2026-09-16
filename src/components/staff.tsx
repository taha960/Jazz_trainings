import type { PlayedCell } from "@/lib/types";
import { cn } from "@/lib/utils";

function staffY(steps: number, e4Steps: number, lineGap: number, top: number): number {
  const delta = steps - e4Steps;
  return top + 4 * lineGap - delta * (lineGap / 2);
}

interface StaffProps {
  cellA: PlayedCell;
  cellB: PlayedCell | null;
  activeIndex?: number | null;
  className?: string;
}

export function Staff({ cellA, cellB, activeIndex = null, className }: StaffProps) {
  const displays = [...cellA.display, ...(cellB?.display ?? [])];
  const steps = [...cellA.steps, ...(cellB?.steps ?? [])];
  const split = cellA.display.length;

  const e4 = 4 * 7 + 2;
  const lineGap = 10;
  const top = 22;
  const left = 36;
  const noteGap = 22;
  const width = left + displays.length * noteGap + (cellB ? 18 : 8) + 16;
  const height = 92;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={cn("w-full max-w-lg text-ink", className)}
      role="img"
      aria-label={displays.join(" ")}
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <line
          key={i}
          x1={8}
          x2={width - 8}
          y1={top + i * lineGap}
          y2={top + i * lineGap}
          stroke="currentColor"
          strokeOpacity={0.28}
          strokeWidth={1}
        />
      ))}
      <text x={12} y={top + 3.15 * lineGap} fontSize={28} fontFamily="Georgia, serif" fill="currentColor">
        𝄞
      </text>
      {cellB ? (
        <line
          x1={left + split * noteGap - 4}
          x2={left + split * noteGap - 4}
          y1={top - 6}
          y2={top + 4 * lineGap + 6}
          stroke="currentColor"
          strokeOpacity={0.35}
          strokeWidth={1}
          strokeDasharray="2 3"
        />
      ) : null}
      {displays.map((disp, i) => {
        const y = staffY(steps[i]!, e4, lineGap, top);
        const x = left + i * noteGap + (cellB && i >= split ? 10 : 0);
        const acc = disp.slice(1);
        const bottomLine = top + 4 * lineGap;
        const topLine = top;
        const ledgers: number[] = [];
        if (y < topLine) {
          for (let ly = topLine - lineGap; ly >= y - 1; ly -= lineGap) ledgers.push(ly);
        }
        if (y > bottomLine) {
          for (let ly = bottomLine + lineGap; ly <= y + 1; ly += lineGap) ledgers.push(ly);
        }
        const active = activeIndex === i;
        return (
          <g key={i}>
            {ledgers.map((ly) => (
              <line
                key={ly}
                x1={x - 8}
                x2={x + 8}
                y1={ly}
                y2={ly}
                stroke="currentColor"
                strokeOpacity={0.4}
                strokeWidth={1}
              />
            ))}
            {acc ? (
              <text
                x={x - 11}
                y={y + 4}
                fontSize={11}
                fontFamily="Georgia, serif"
                fill="currentColor"
              >
                {acc}
              </text>
            ) : null}
            <ellipse
              cx={x}
              cy={y}
              rx={5.2}
              ry={3.7}
              transform={`rotate(-18 ${x} ${y})`}
              fill={active ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth={1.2}
            />
          </g>
        );
      })}
    </svg>
  );
}
