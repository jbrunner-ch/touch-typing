import React from 'react';
import { KeyboardLayoutId } from '../types/typing';
import { FINGER_COLORS, findTargetKey, KEYBOARD_LAYOUTS } from '../data/keyboardLayouts';

interface VirtualKeyboardProps {
  layoutId: KeyboardLayoutId;
  targetChar: string | null;
  pressedCode: string | null;
  lastPressCorrect: boolean | null;
}

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  layoutId,
  targetChar,
  pressedCode,
  lastPressCorrect,
}) => {
  const rows = KEYBOARD_LAYOUTS[layoutId];
  const target =
    targetChar !== null
      ? findTargetKey(targetChar, layoutId)
      : { keyDef: null, needsShift: false, shiftSide: null };

  return (
    <div className="w-full max-w-4xl mx-auto select-none bg-stone-200 border-2 border-stone-300 border-b-4 rounded-2xl p-3 sm:p-4 shadow-sm">
      <div className="flex flex-col gap-1.5">
        {rows.map((row, rIdx) => (
          <div key={rIdx} className="flex justify-center gap-1 sm:gap-1.5">
            {row.map((key) => {
              const color = FINGER_COLORS[key.finger];
              const isTargetKey = target.keyDef?.id === key.id;
              const isTargetShift =
                target.needsShift &&
                ((target.shiftSide === 'left' && key.code === 'ShiftLeft') ||
                  (target.shiftSide === 'right' && key.code === 'ShiftRight'));
              const isPressed = pressedCode === key.code;

              let stateClass = `${color.bg} ${color.border} ${color.text} keycap-3d`;
              if (isPressed) {
                stateClass =
                  lastPressCorrect === false
                    ? 'bg-red-600 text-white border-red-800 keycap-3d-active'
                    : 'bg-emerald-600 text-white border-emerald-800 keycap-3d-active';
              } else if (isTargetKey || isTargetShift) {
                stateClass = `${color.activeBg} keycap-3d ring-2 ring-stone-900 -translate-y-0.5`;
              }

              const flexGrow = key.width ?? 1;

              return (
                <div
                  key={key.id}
                  style={{ flex: `${flexGrow} 1 0%` }}
                  className={`relative h-10 sm:h-12 rounded-lg border flex flex-col items-center justify-center transition-all duration-75 ${stateClass}`}
                >
                  {key.shiftLabel && (
                    <span className="text-[9px] sm:text-[10px] leading-none opacity-65 mb-0.5">
                      {key.shiftLabel}
                    </span>
                  )}
                  <span className="text-xs sm:text-sm font-bold leading-none">{key.label}</span>
                  {key.hasBump && (
                    <span className="absolute bottom-1 w-3.5 h-0.5 rounded-full bg-current opacity-65" />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Finger legend */}
      <div className="mt-3 pt-2.5 border-t border-stone-300/80 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-stone-700">
        {target.keyDef ? (
          <div className="flex items-center gap-2 font-semibold">
            <span
              className="inline-block w-2.5 h-2.5 rounded-full border border-stone-900/20"
              style={{ backgroundColor: FINGER_COLORS[target.keyDef.finger].hex }}
            />
            <span>
              Finger: <strong className="text-stone-900">{FINGER_COLORS[target.keyDef.finger].label}</strong>
              {target.needsShift && (
                <span className="text-blue-700 font-bold">
                  {' '}
                  + {target.shiftSide === 'left' ? 'Kleiner Finger links (Shift)' : 'Kleiner Finger rechts (Shift)'}
                </span>
              )}
            </span>
          </div>
        ) : (
          <span className="font-medium">Grundstellung: A S D F — J K L Ö (Daumen auf Leertaste)</span>
        )}
      </div>
    </div>
  );
};
