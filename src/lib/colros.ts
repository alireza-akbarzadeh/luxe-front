/**
 * Returns black (#000000) or white (#ffffff) depending on the perceived brightness of the given color.
 * Supports hex codes (#RGB, #RRGGBB) and CSS named colors (e.g., 'red', 'copper').
 * For named colors, uses a heuristic list of light colors; all others default to white text.
 */
export const getContrastColor = (color: string): string => {
  // Handle hex codes
  if (color.startsWith('#')) {
    let hex = color.slice(1);
    if (hex.length === 3) {
      hex = hex
        .split('')
        .map((c) => c + c)
        .join('');
    }
    if (hex.length === 6) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      return luminance > 0.5 ? '#000000' : '#ffffff';
    }
  }

  // Handle named colors with a simple light‑color heuristic
  const lightColorNames = [
    'white',
    'ivory',
    'beige',
    'light',
    'yellow',
    'pink',
    'coral',
    'gold',
    'silver',
    'aliceblue',
    'antiquewhite',
    'aqua',
    'aquamarine',
    'azure',
    'bisque',
    'blanchedalmond',
    'cornsilk',
    'floralwhite',
    'ghostwhite',
    'honeydew',
    'khaki',
    'lavender',
    'lemonchiffon',
    'lightblue',
    'lightcoral',
    'lightcyan',
    'lightgoldenrodyellow',
    'lightgray',
    'lightgreen',
    'lightpink',
    'lightsalmon',
    'lightseagreen',
    'lightskyblue',
    'lightslategray',
    'lightsteelblue',
    'lightyellow',
    'lime',
    'limegreen',
    'moccasin',
    'navajowhite',
    'oldlace',
    'palegoldenrod',
    'palegreen',
    'paleturquoise',
    'palevioletred',
    'papayawhip',
    'peachpuff',
    'peru',
    'powderblue',
    'seashell',
    'snow'
  ];

  const lowerColor = color.toLowerCase();
  const isLight = lightColorNames.some((name) => lowerColor.includes(name));
  return isLight ? '#000000' : '#ffffff';
};
