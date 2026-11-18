import { FingerId, KeyDef, KeyboardLayoutId } from '../types/typing';

export const FINGER_COLORS: Record<
  FingerId,
  { bg: string; border: string; text: string; activeBg: string; label: string; hex: string }
> = {
  'left-pinky': {
    bg: 'bg-rose-50',
    border: 'border-rose-300',
    text: 'text-rose-800',
    activeBg: 'bg-rose-500 text-white border-rose-600',
    label: 'Kleiner Finger links',
    hex: '#f43f5e',
  },
  'left-ring': {
    bg: 'bg-amber-50',
    border: 'border-amber-300',
    text: 'text-amber-800',
    activeBg: 'bg-amber-500 text-white border-amber-600',
    label: 'Ringfinger links',
    hex: '#f59e0b',
  },
  'left-middle': {
    bg: 'bg-emerald-50',
    border: 'border-emerald-300',
    text: 'text-emerald-800',
    activeBg: 'bg-emerald-500 text-white border-emerald-600',
    label: 'Mittelfinger links',
    hex: '#10b981',
  },
  'left-index': {
    bg: 'bg-sky-50',
    border: 'border-sky-300',
    text: 'text-sky-800',
    activeBg: 'bg-sky-500 text-white border-sky-600',
    label: 'Zeigefinger links',
    hex: '#0ea5e9',
  },
  thumb: {
    bg: 'bg-violet-50',
    border: 'border-violet-300',
    text: 'text-violet-800',
    activeBg: 'bg-violet-500 text-white border-violet-600',
    label: 'Daumen (Leertaste)',
    hex: '#8b5cf6',
  },
  'right-index': {
    bg: 'bg-cyan-50',
    border: 'border-cyan-300',
    text: 'text-cyan-800',
    activeBg: 'bg-cyan-500 text-white border-cyan-600',
    label: 'Zeigefinger rechts',
    hex: '#06b6d4',
  },
  'right-middle': {
    bg: 'bg-teal-50',
    border: 'border-teal-300',
    text: 'text-teal-800',
    activeBg: 'bg-teal-500 text-white border-teal-600',
    label: 'Mittelfinger rechts',
    hex: '#14b8a6',
  },
  'right-ring': {
    bg: 'bg-orange-50',
    border: 'border-orange-300',
    text: 'text-orange-800',
    activeBg: 'bg-orange-500 text-white border-orange-600',
    label: 'Ringfinger rechts',
    hex: '#f97316',
  },
  'right-pinky': {
    bg: 'bg-pink-50',
    border: 'border-pink-300',
    text: 'text-pink-800',
    activeBg: 'bg-pink-500 text-white border-pink-600',
    label: 'Kleiner Finger rechts',
    hex: '#ec4899',
  },
};

export const LAYOUT_LABELS: Record<KeyboardLayoutId, { name: string; short: string; flag: string }> = {
  'de-qwertz': { name: 'Deutsch (QWERTZ)', short: 'DE QWERTZ', flag: '🇩🇪' },
  'ch-qwertz': { name: 'Schweiz (QWERTZ)', short: 'CH QWERTZ', flag: '🇨🇭' },
  'en-qwerty': { name: 'Englisch (QWERTY)', short: 'EN QWERTY', flag: '🇬🇧' },
};

const DE_QWERTZ_ROWS: KeyDef[][] = [
  [
    { id: 'de-caret', label: '^', shiftLabel: '°', code: 'Backquote', finger: 'left-pinky' },
    { id: 'de-1', label: '1', shiftLabel: '!', code: 'Digit1', finger: 'left-pinky' },
    { id: 'de-2', label: '2', shiftLabel: '"', code: 'Digit2', finger: 'left-ring' },
    { id: 'de-3', label: '3', shiftLabel: '§', code: 'Digit3', finger: 'left-middle' },
    { id: 'de-4', label: '4', shiftLabel: '$', code: 'Digit4', finger: 'left-index' },
    { id: 'de-5', label: '5', shiftLabel: '%', code: 'Digit5', finger: 'left-index' },
    { id: 'de-6', label: '6', shiftLabel: '&', code: 'Digit6', finger: 'right-index' },
    { id: 'de-7', label: '7', shiftLabel: '/', code: 'Digit7', finger: 'right-index' },
    { id: 'de-8', label: '8', shiftLabel: '(', code: 'Digit8', finger: 'right-middle' },
    { id: 'de-9', label: '9', shiftLabel: ')', code: 'Digit9', finger: 'right-ring' },
    { id: 'de-0', label: '0', shiftLabel: '=', code: 'Digit0', finger: 'right-pinky' },
    { id: 'de-ss', label: 'ß', shiftLabel: '?', code: 'Minus', finger: 'right-pinky' },
    { id: 'de-bksp', label: '⌫', code: 'Backspace', finger: 'right-pinky', width: 2 },
  ],
  [
    { id: 'de-tab', label: 'Tab', code: 'Tab', finger: 'left-pinky', width: 1.5 },
    { id: 'de-q', label: 'q', shiftLabel: 'Q', code: 'KeyQ', finger: 'left-pinky' },
    { id: 'de-w', label: 'w', shiftLabel: 'W', code: 'KeyW', finger: 'left-ring' },
    { id: 'de-e', label: 'e', shiftLabel: 'E', code: 'KeyE', finger: 'left-middle' },
    { id: 'de-r', label: 'r', shiftLabel: 'R', code: 'KeyR', finger: 'left-index' },
    { id: 'de-t', label: 't', shiftLabel: 'T', code: 'KeyT', finger: 'left-index' },
    { id: 'de-z', label: 'z', shiftLabel: 'Z', code: 'KeyY', finger: 'right-index' },
    { id: 'de-u', label: 'u', shiftLabel: 'U', code: 'KeyU', finger: 'right-index' },
    { id: 'de-i', label: 'i', shiftLabel: 'I', code: 'KeyI', finger: 'right-middle' },
    { id: 'de-o', label: 'o', shiftLabel: 'O', code: 'KeyO', finger: 'right-ring' },
    { id: 'de-p', label: 'p', shiftLabel: 'P', code: 'KeyP', finger: 'right-pinky' },
    { id: 'de-ue', label: 'ü', shiftLabel: 'Ü', code: 'BracketLeft', finger: 'right-pinky' },
    { id: 'de-plus', label: '+', shiftLabel: '*', code: 'BracketRight', finger: 'right-pinky', width: 1.5 },
  ],
  [
    { id: 'de-caps', label: 'Caps', code: 'CapsLock', finger: 'left-pinky', width: 1.75 },
    { id: 'de-a', label: 'a', shiftLabel: 'A', code: 'KeyA', finger: 'left-pinky', isHomeRow: true },
    { id: 'de-s', label: 's', shiftLabel: 'S', code: 'KeyS', finger: 'left-ring', isHomeRow: true },
    { id: 'de-d', label: 'd', shiftLabel: 'D', code: 'KeyD', finger: 'left-middle', isHomeRow: true },
    { id: 'de-f', label: 'f', shiftLabel: 'F', code: 'KeyF', finger: 'left-index', isHomeRow: true, hasBump: true },
    { id: 'de-g', label: 'g', shiftLabel: 'G', code: 'KeyG', finger: 'left-index' },
    { id: 'de-h', label: 'h', shiftLabel: 'H', code: 'KeyH', finger: 'right-index' },
    { id: 'de-j', label: 'j', shiftLabel: 'J', code: 'KeyJ', finger: 'right-index', isHomeRow: true, hasBump: true },
    { id: 'de-k', label: 'k', shiftLabel: 'K', code: 'KeyK', finger: 'right-middle', isHomeRow: true },
    { id: 'de-l', label: 'l', shiftLabel: 'L', code: 'KeyL', finger: 'right-ring', isHomeRow: true },
    { id: 'de-oe', label: 'ö', shiftLabel: 'Ö', code: 'Semicolon', finger: 'right-pinky', isHomeRow: true },
    { id: 'de-ae', label: 'ä', shiftLabel: 'Ä', code: 'Quote', finger: 'right-pinky' },
    { id: 'de-enter', label: '↵', code: 'Enter', finger: 'right-pinky', width: 1.75 },
  ],
  [
    { id: 'de-lshift', label: '⇧ Shift', code: 'ShiftLeft', finger: 'left-pinky', width: 2.25 },
    { id: 'de-y', label: 'y', shiftLabel: 'Y', code: 'KeyZ', finger: 'left-pinky' },
    { id: 'de-x', label: 'x', shiftLabel: 'X', code: 'KeyX', finger: 'left-ring' },
    { id: 'de-c', label: 'c', shiftLabel: 'C', code: 'KeyC', finger: 'left-middle' },
    { id: 'de-v', label: 'v', shiftLabel: 'V', code: 'KeyV', finger: 'left-index' },
    { id: 'de-b', label: 'b', shiftLabel: 'B', code: 'KeyB', finger: 'left-index' },
    { id: 'de-n', label: 'n', shiftLabel: 'N', code: 'KeyN', finger: 'right-index' },
    { id: 'de-m', label: 'm', shiftLabel: 'M', code: 'KeyM', finger: 'right-index' },
    { id: 'de-comma', label: ',', shiftLabel: ';', code: 'Comma', finger: 'right-middle' },
    { id: 'de-dot', label: '.', shiftLabel: ':', code: 'Period', finger: 'right-ring' },
    { id: 'de-minus', label: '-', shiftLabel: '_', code: 'Slash', finger: 'right-pinky' },
    { id: 'de-rshift', label: '⇧ Shift', code: 'ShiftRight', finger: 'right-pinky', width: 2.25 },
  ],
  [
    { id: 'de-space', label: 'Leertaste', code: 'Space', finger: 'thumb', width: 7 },
  ],
];

const CH_QWERTZ_ROWS: KeyDef[][] = [
  [
    { id: 'ch-sec', label: '§', shiftLabel: '°', code: 'Backquote', finger: 'left-pinky' },
    { id: 'ch-1', label: '1', shiftLabel: '+', code: 'Digit1', finger: 'left-pinky' },
    { id: 'ch-2', label: '2', shiftLabel: '"', code: 'Digit2', finger: 'left-ring' },
    { id: 'ch-3', label: '3', shiftLabel: '*', code: 'Digit3', finger: 'left-middle' },
    { id: 'ch-4', label: '4', shiftLabel: 'ç', code: 'Digit4', finger: 'left-index' },
    { id: 'ch-5', label: '5', shiftLabel: '%', code: 'Digit5', finger: 'left-index' },
    { id: 'ch-6', label: '6', shiftLabel: '&', code: 'Digit6', finger: 'right-index' },
    { id: 'ch-7', label: '7', shiftLabel: '/', code: 'Digit7', finger: 'right-index' },
    { id: 'ch-8', label: '8', shiftLabel: '(', code: 'Digit8', finger: 'right-middle' },
    { id: 'ch-9', label: '9', shiftLabel: ')', code: 'Digit9', finger: 'right-ring' },
    { id: 'ch-0', label: '0', shiftLabel: '=', code: 'Digit0', finger: 'right-pinky' },
    { id: 'ch-apo', label: "'", shiftLabel: '?', code: 'Minus', finger: 'right-pinky' },
    { id: 'ch-bksp', label: '⌫', code: 'Backspace', finger: 'right-pinky', width: 2 },
  ],
  [
    { id: 'ch-tab', label: 'Tab', code: 'Tab', finger: 'left-pinky', width: 1.5 },
    { id: 'ch-q', label: 'q', shiftLabel: 'Q', code: 'KeyQ', finger: 'left-pinky' },
    { id: 'ch-w', label: 'w', shiftLabel: 'W', code: 'KeyW', finger: 'left-ring' },
    { id: 'ch-e', label: 'e', shiftLabel: 'E', code: 'KeyE', finger: 'left-middle' },
    { id: 'ch-r', label: 'r', shiftLabel: 'R', code: 'KeyR', finger: 'left-index' },
    { id: 'ch-t', label: 't', shiftLabel: 'T', code: 'KeyT', finger: 'left-index' },
    { id: 'ch-z', label: 'z', shiftLabel: 'Z', code: 'KeyY', finger: 'right-index' },
    { id: 'ch-u', label: 'u', shiftLabel: 'U', code: 'KeyU', finger: 'right-index' },
    { id: 'ch-i', label: 'i', shiftLabel: 'I', code: 'KeyI', finger: 'right-middle' },
    { id: 'ch-o', label: 'o', shiftLabel: 'O', code: 'KeyO', finger: 'right-ring' },
    { id: 'ch-p', label: 'p', shiftLabel: 'P', code: 'KeyP', finger: 'right-pinky' },
    { id: 'ch-ue', label: 'ü', shiftLabel: 'è', code: 'BracketLeft', finger: 'right-pinky' },
    { id: 'ch-dia', label: '¨', shiftLabel: '!', code: 'BracketRight', finger: 'right-pinky', width: 1.5 },
  ],
  [
    { id: 'ch-caps', label: 'Caps', code: 'CapsLock', finger: 'left-pinky', width: 1.75 },
    { id: 'ch-a', label: 'a', shiftLabel: 'A', code: 'KeyA', finger: 'left-pinky', isHomeRow: true },
    { id: 'ch-s', label: 's', shiftLabel: 'S', code: 'KeyS', finger: 'left-ring', isHomeRow: true },
    { id: 'ch-d', label: 'd', shiftLabel: 'D', code: 'KeyD', finger: 'left-middle', isHomeRow: true },
    { id: 'ch-f', label: 'f', shiftLabel: 'F', code: 'KeyF', finger: 'left-index', isHomeRow: true, hasBump: true },
    { id: 'ch-g', label: 'g', shiftLabel: 'G', code: 'KeyG', finger: 'left-index' },
    { id: 'ch-h', label: 'h', shiftLabel: 'H', code: 'KeyH', finger: 'right-index' },
    { id: 'ch-j', label: 'j', shiftLabel: 'J', code: 'KeyJ', finger: 'right-index', isHomeRow: true, hasBump: true },
    { id: 'ch-k', label: 'k', shiftLabel: 'K', code: 'KeyK', finger: 'right-middle', isHomeRow: true },
    { id: 'ch-l', label: 'l', shiftLabel: 'L', code: 'KeyL', finger: 'right-ring', isHomeRow: true },
    { id: 'ch-oe', label: 'ö', shiftLabel: 'é', code: 'Semicolon', finger: 'right-pinky', isHomeRow: true },
    { id: 'ch-ae', label: 'ä', shiftLabel: 'à', code: 'Quote', finger: 'right-pinky' },
    { id: 'ch-enter', label: '↵', code: 'Enter', finger: 'right-pinky', width: 1.75 },
  ],
  [
    { id: 'ch-lshift', label: '⇧ Shift', code: 'ShiftLeft', finger: 'left-pinky', width: 2.25 },
    { id: 'ch-y', label: 'y', shiftLabel: 'Y', code: 'KeyZ', finger: 'left-pinky' },
    { id: 'ch-x', label: 'x', shiftLabel: 'X', code: 'KeyX', finger: 'left-ring' },
    { id: 'ch-c', label: 'c', shiftLabel: 'C', code: 'KeyC', finger: 'left-middle' },
    { id: 'ch-v', label: 'v', shiftLabel: 'V', code: 'KeyV', finger: 'left-index' },
    { id: 'ch-b', label: 'b', shiftLabel: 'B', code: 'KeyB', finger: 'left-index' },
    { id: 'ch-n', label: 'n', shiftLabel: 'N', code: 'KeyN', finger: 'right-index' },
    { id: 'ch-m', label: 'm', shiftLabel: 'M', code: 'KeyM', finger: 'right-index' },
    { id: 'ch-comma', label: ',', shiftLabel: ';', code: 'Comma', finger: 'right-middle' },
    { id: 'ch-dot', label: '.', shiftLabel: ':', code: 'Period', finger: 'right-ring' },
    { id: 'ch-minus', label: '-', shiftLabel: '_', code: 'Slash', finger: 'right-pinky' },
    { id: 'ch-rshift', label: '⇧ Shift', code: 'ShiftRight', finger: 'right-pinky', width: 2.25 },
  ],
  [
    { id: 'ch-space', label: 'Leertaste', code: 'Space', finger: 'thumb', width: 7 },
  ],
];

const EN_QWERTY_ROWS: KeyDef[][] = [
  [
    { id: 'en-grave', label: '`', shiftLabel: '~', code: 'Backquote', finger: 'left-pinky' },
    { id: 'en-1', label: '1', shiftLabel: '!', code: 'Digit1', finger: 'left-pinky' },
    { id: 'en-2', label: '2', shiftLabel: '@', code: 'Digit2', finger: 'left-ring' },
    { id: 'en-3', label: '3', shiftLabel: '#', code: 'Digit3', finger: 'left-middle' },
    { id: 'en-4', label: '4', shiftLabel: '$', code: 'Digit4', finger: 'left-index' },
    { id: 'en-5', label: '5', shiftLabel: '%', code: 'Digit5', finger: 'left-index' },
    { id: 'en-6', label: '6', shiftLabel: '^', code: 'Digit6', finger: 'right-index' },
    { id: 'en-7', label: '7', shiftLabel: '&', code: 'Digit7', finger: 'right-index' },
    { id: 'en-8', label: '8', shiftLabel: '*', code: 'Digit8', finger: 'right-middle' },
    { id: 'en-9', label: '9', shiftLabel: '(', code: 'Digit9', finger: 'right-ring' },
    { id: 'en-0', label: '0', shiftLabel: ')', code: 'Digit0', finger: 'right-pinky' },
    { id: 'en-minus', label: '-', shiftLabel: '_', code: 'Minus', finger: 'right-pinky' },
    { id: 'en-bksp', label: '⌫', code: 'Backspace', finger: 'right-pinky', width: 2 },
  ],
  [
    { id: 'en-tab', label: 'Tab', code: 'Tab', finger: 'left-pinky', width: 1.5 },
    { id: 'en-q', label: 'q', shiftLabel: 'Q', code: 'KeyQ', finger: 'left-pinky' },
    { id: 'en-w', label: 'w', shiftLabel: 'W', code: 'KeyW', finger: 'left-ring' },
    { id: 'en-e', label: 'e', shiftLabel: 'E', code: 'KeyE', finger: 'left-middle' },
    { id: 'en-r', label: 'r', shiftLabel: 'R', code: 'KeyR', finger: 'left-index' },
    { id: 'en-t', label: 't', shiftLabel: 'T', code: 'KeyT', finger: 'left-index' },
    { id: 'en-y', label: 'y', shiftLabel: 'Y', code: 'KeyY', finger: 'right-index' },
    { id: 'en-u', label: 'u', shiftLabel: 'U', code: 'KeyU', finger: 'right-index' },
    { id: 'en-i', label: 'i', shiftLabel: 'I', code: 'KeyI', finger: 'right-middle' },
    { id: 'en-o', label: 'o', shiftLabel: 'O', code: 'KeyO', finger: 'right-ring' },
    { id: 'en-p', label: 'p', shiftLabel: 'P', code: 'KeyP', finger: 'right-pinky' },
    { id: 'en-lb', label: '[', shiftLabel: '{', code: 'BracketLeft', finger: 'right-pinky' },
    { id: 'en-rb', label: ']', shiftLabel: '}', code: 'BracketRight', finger: 'right-pinky', width: 1.5 },
  ],
  [
    { id: 'en-caps', label: 'Caps', code: 'CapsLock', finger: 'left-pinky', width: 1.75 },
    { id: 'en-a', label: 'a', shiftLabel: 'A', code: 'KeyA', finger: 'left-pinky', isHomeRow: true },
    { id: 'en-s', label: 's', shiftLabel: 'S', code: 'KeyS', finger: 'left-ring', isHomeRow: true },
    { id: 'en-d', label: 'd', shiftLabel: 'D', code: 'KeyD', finger: 'left-middle', isHomeRow: true },
    { id: 'en-f', label: 'f', shiftLabel: 'F', code: 'KeyF', finger: 'left-index', isHomeRow: true, hasBump: true },
    { id: 'en-g', label: 'g', shiftLabel: 'G', code: 'KeyG', finger: 'left-index' },
    { id: 'en-h', label: 'h', shiftLabel: 'H', code: 'KeyH', finger: 'right-index' },
    { id: 'en-j', label: 'j', shiftLabel: 'J', code: 'KeyJ', finger: 'right-index', isHomeRow: true, hasBump: true },
    { id: 'en-k', label: 'k', shiftLabel: 'K', code: 'KeyK', finger: 'right-middle', isHomeRow: true },
    { id: 'en-l', label: 'l', shiftLabel: 'L', code: 'KeyL', finger: 'right-ring', isHomeRow: true },
    { id: 'en-semi', label: ';', shiftLabel: ':', code: 'Semicolon', finger: 'right-pinky', isHomeRow: true },
    { id: 'en-quote', label: "'", shiftLabel: '"', code: 'Quote', finger: 'right-pinky' },
    { id: 'en-enter', label: '↵', code: 'Enter', finger: 'right-pinky', width: 1.75 },
  ],
  [
    { id: 'en-lshift', label: '⇧ Shift', code: 'ShiftLeft', finger: 'left-pinky', width: 2.25 },
    { id: 'en-z', label: 'z', shiftLabel: 'Z', code: 'KeyZ', finger: 'left-pinky' },
    { id: 'en-x', label: 'x', shiftLabel: 'X', code: 'KeyX', finger: 'left-ring' },
    { id: 'en-c', label: 'c', shiftLabel: 'C', code: 'KeyC', finger: 'left-middle' },
    { id: 'en-v', label: 'v', shiftLabel: 'V', code: 'KeyV', finger: 'left-index' },
    { id: 'en-b', label: 'b', shiftLabel: 'B', code: 'KeyB', finger: 'left-index' },
    { id: 'en-n', label: 'n', shiftLabel: 'N', code: 'KeyN', finger: 'right-index' },
    { id: 'en-m', label: 'm', shiftLabel: 'M', code: 'KeyM', finger: 'right-index' },
    { id: 'en-comma', label: ',', shiftLabel: '<', code: 'Comma', finger: 'right-middle' },
    { id: 'en-dot', label: '.', shiftLabel: '>', code: 'Period', finger: 'right-ring' },
    { id: 'en-slash', label: '/', shiftLabel: '?', code: 'Slash', finger: 'right-pinky' },
    { id: 'en-rshift', label: '⇧ Shift', code: 'ShiftRight', finger: 'right-pinky', width: 2.25 },
  ],
  [
    { id: 'en-space', label: 'Space', code: 'Space', finger: 'thumb', width: 7 },
  ],
];

export const KEYBOARD_LAYOUTS: Record<KeyboardLayoutId, KeyDef[][]> = {
  'de-qwertz': DE_QWERTZ_ROWS,
  'ch-qwertz': CH_QWERTZ_ROWS,
  'en-qwerty': EN_QWERTY_ROWS,
};

export interface TargetKeyInfo {
  keyDef: KeyDef | null;
  needsShift: boolean;
  shiftSide: 'left' | 'right' | null;
}

export function findTargetKey(char: string, layoutId: KeyboardLayoutId): TargetKeyInfo {
  const rows = KEYBOARD_LAYOUTS[layoutId];
  if (char === ' ') {
    const space = rows[4][0];
    return { keyDef: space, needsShift: false, shiftSide: null };
  }

  for (const row of rows) {
    for (const key of row) {
      if (key.label === char) {
        return { keyDef: key, needsShift: false, shiftSide: null };
      }
      if (key.shiftLabel === char) {
        const isLeftHand = key.finger.startsWith('left');
        return {
          keyDef: key,
          needsShift: true,
          shiftSide: isLeftHand ? 'right' : 'left',
        };
      }
    }
  }
  return { keyDef: null, needsShift: false, shiftSide: null };
}
