export interface PresetColor {
  name: string;
  hex: string;
  border?: boolean;
  multi?: boolean;
}

export const PRESET_COLORS: PresetColor[] = [
  { name: 'Blue', hex: '#2563eb' },
  { name: 'Black', hex: '#1a1a1a' },
  { name: 'Grey', hex: '#6b7280' },
  { name: 'White', hex: '#ffffff', border: true },
  { name: 'Navy Blue', hex: '#1e3a5f' },
  { name: 'Beige', hex: '#d4b896' },
  { name: 'Charcoal', hex: '#36454f' },
  { name: 'Green', hex: '#16a34a' },
  { name: 'Multi', hex: '#ffffff', multi: true },
  { name: 'Brown', hex: '#92400e' },
  { name: 'Olive', hex: '#556b2f' },
  { name: 'Off White', hex: '#f5f5f0', border: true },
  { name: 'Cream', hex: '#fffdd0', border: true },
  { name: 'Khaki', hex: '#c3b091' },
  { name: 'Silver', hex: '#c0c0c0' },
  { name: 'Turquoise Blue', hex: '#40e0d0' },
  { name: 'Coffee Brown', hex: '#6f4e37' },
  { name: 'Grey Melange', hex: '#9ca3af' },
  { name: 'Tan', hex: '#d2b48c' },
  { name: 'Sea Green', hex: '#2e8b57' },
  { name: 'Rust', hex: '#b7410e' },
  { name: 'Purple', hex: '#9333ea' },
  { name: 'Taupe', hex: '#8b8589' },
  { name: 'Pink', hex: '#ec4899' },
  { name: 'Mauve', hex: '#e0b0ff' },
  { name: 'Maroon', hex: '#800000' },
  { name: 'Teal', hex: '#008080' },
  { name: 'Rose', hex: '#ff007f' },
  { name: 'Mustard', hex: '#ffdb58' },
  { name: 'Lime Green', hex: '#32cd32' },
  { name: 'Camel Brown', hex: '#c19a6b' },
  { name: 'Burgundy', hex: '#722f37' },
  { name: 'Red', hex: '#dc2626' },
  { name: 'Yellow', hex: '#eab308' },
  { name: 'Orange', hex: '#ea580c' },
  { name: 'Gold', hex: '#d4af37' },
  { name: 'Indigo', hex: '#4b0082' },
  { name: 'Coral', hex: '#ff7f50' },
  { name: 'Peach', hex: '#ffcba4', border: true },
  { name: 'Lavender', hex: '#e6e6fa', border: true },
];

export function getHexForColorName(name: string): string | undefined {
  const found = PRESET_COLORS.find((c) => c.name.toLowerCase() === name.toLowerCase());
  return found?.hex;
}
