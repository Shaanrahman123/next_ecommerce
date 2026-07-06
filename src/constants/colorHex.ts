import { PRESET_COLORS } from '@/constants/presetColors';

export const COLOR_HEX: Record<string, string> = {
  ...Object.fromEntries(
    PRESET_COLORS.filter((c) => !c.multi).map((c) => [c.name.toLowerCase().replace(/\s+/g, '-'), c.hex])
  ),
  black: '#1a1a1a',
  white: '#ffffff',
  blue: '#2563eb',
  red: '#dc2626',
  green: '#16a34a',
  gray: '#6b7280',
  grey: '#6b7280',
  navy: '#1e3a5f',
  'navy-blue': '#1e3a5f',
  brown: '#92400e',
  beige: '#d4b896',
  pink: '#ec4899',
  yellow: '#eab308',
  orange: '#ea580c',
  purple: '#9333ea',
  maroon: '#800000',
  olive: '#556b2f',
  teal: '#008080',
  mustard: '#ffdb58',
  burgundy: '#722f37',
};
