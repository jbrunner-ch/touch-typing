import React from 'react';
import { FingerId, KeyboardLayoutId } from '../types/typing';
import { FINGER_COLORS, findTargetKey } from '../data/keyboardLayouts';

interface HandGuideProps {
  layoutId: KeyboardLayoutId;
  targetChar: string | null;
}

export const HandGuide: React.FC<HandGuideProps> = ({ layoutId, targetChar }) => {
  const target = targetChar !== null ? findTargetKey(targetChar, layoutId) : { keyDef: null, needsShift: false, shiftSide: null };
  const activeFinger: FingerId | null = target.keyDef?.finger ?? null;
  const shiftFinger: FingerId | null = target.needsShift
    ? target.shiftSide === 'left'
      ? 'left-pinky'
      : 'right-pinky'
    : null;

  const isHighlighted = (finger: FingerId) => activeFinger === finger || shiftFinger === finger;

  const renderFinger = (finger: FingerId, x: number, y: number, h: number, label: string) => {
    const active = isHighlighted(finger);
    const color = FINGER_COLORS[finger].hex;
    return (
      <g key={finger}>
        <rect
          x={x}
          y={y}
          width={16}
          height={h}
          rx={8}
          fill={active ? color : '#e2e8f0'}
          stroke={active ? '#1e293b' : '#cbd5e1'}
          strokeWidth={active ? 2 : 1}
          className="transition-all duration-150"
        />
        {active && (
          <circle cx={x + 8} cy={y + 8} r={4} fill="#ffffff" />
        )}
        <title>{label}</title>
      </g>
    );
  };

  return (
    <div className="flex items-center justify-center gap-8 py-1 select-none">
      {/* Left Hand */}
      <svg width="118" height="78" viewBox="0 0 118 78" aria-label="Linke Hand">
        {/* Palm */}
        <rect x="18" y="42" width="70" height="32" rx="14" fill="#f1f5f9" stroke="#cbd5e1" />
        {renderFinger('left-pinky', 14, 16, 36, FINGER_COLORS['left-pinky'].label)}
        {renderFinger('left-ring', 33, 8, 42, FINGER_COLORS['left-ring'].label)}
        {renderFinger('left-middle', 52, 4, 46, FINGER_COLORS['left-middle'].label)}
        {renderFinger('left-index', 71, 10, 40, FINGER_COLORS['left-index'].label)}
        {/* Thumb */}
        <rect
          x="90"
          y="42"
          width="24"
          height="14"
          rx={7}
          transform="rotate(-18 90 42)"
          fill={isHighlighted('thumb') ? FINGER_COLORS.thumb.hex : '#e2e8f0'}
          stroke={isHighlighted('thumb') ? '#1e293b' : '#cbd5e1'}
          strokeWidth={isHighlighted('thumb') ? 2 : 1}
        />
      </svg>

      {/* Right Hand */}
      <svg width="118" height="78" viewBox="0 0 118 78" aria-label="Rechte Hand">
        {/* Palm */}
        <rect x="30" y="42" width="70" height="32" rx="14" fill="#f1f5f9" stroke="#cbd5e1" />
        {/* Thumb */}
        <rect
          x="4"
          y="36"
          width="24"
          height="14"
          rx={7}
          transform="rotate(18 4 36)"
          fill={isHighlighted('thumb') ? FINGER_COLORS.thumb.hex : '#e2e8f0'}
          stroke={isHighlighted('thumb') ? '#1e293b' : '#cbd5e1'}
          strokeWidth={isHighlighted('thumb') ? 2 : 1}
        />
        {renderFinger('right-index', 31, 10, 40, FINGER_COLORS['right-index'].label)}
        {renderFinger('right-middle', 50, 4, 46, FINGER_COLORS['right-middle'].label)}
        {renderFinger('right-ring', 69, 8, 42, FINGER_COLORS['right-ring'].label)}
        {renderFinger('right-pinky', 88, 16, 36, FINGER_COLORS['right-pinky'].label)}
      </svg>
    </div>
  );
};
