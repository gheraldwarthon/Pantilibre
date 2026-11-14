// High-fidelity 3D metallic gold balloon PANTILIBRE logo SVG generator
import fs from 'node:fs';

const letters = [
  {
    char: 'P',
    paths: [
      { d: 'M 60,38 L 60,118' },
      { d: 'M 60,38 L 84,38 C 112,38 112,78 84,78 L 60,78' }
    ],
    highlights: [
      // Curved sheen on top loop
      'M 62,42 L 82,42 C 102,42 102,72 82,74',
      // Vertical sheen down the left spine
      'M 56,46 L 56,110'
    ],
    secondaryHighlights: [
      'M 64,114 L 64,88'
    ],
    creases: [
      'M 60,78 L 74,78'
    ]
  },
  {
    char: 'A',
    paths: [
      { d: 'M 160,38 L 130,118' },
      { d: 'M 160,38 L 190,118' },
      { d: 'M 143,84 L 177,84' }
    ],
    highlights: [
      'M 158,42 L 133,110',
      'M 162,42 L 172,68',
      'M 148,82 L 172,82'
    ],
    secondaryHighlights: [
      'M 182,90 L 187,112'
    ],
    creases: [
      'M 143,84 L 148,84',
      'M 172,84 L 177,84'
    ]
  },
  {
    char: 'N',
    paths: [
      { d: 'M 222,38 L 222,118' },
      { d: 'M 222,38 L 268,118' },
      { d: 'M 268,38 L 268,118' }
    ],
    highlights: [
      'M 218,44 L 218,110',
      'M 226,42 L 264,110',
      'M 272,44 L 272,110'
    ],
    secondaryHighlights: [
      'M 224,42 L 235,42',
      'M 255,114 L 265,114'
    ],
    creases: [
      'M 222,46 L 230,56',
      'M 260,100 L 268,110'
    ]
  },
  {
    char: 'T',
    paths: [
      { d: 'M 300,38 L 358,38' },
      { d: 'M 329,38 L 329,118' }
    ],
    highlights: [
      'M 304,36 L 354,36',
      'M 325,48 L 325,110'
    ],
    secondaryHighlights: [
      'M 333,70 L 333,112'
    ],
    creases: [
      'M 329,38 L 329,48'
    ]
  },
  {
    char: 'I',
    paths: [
      { d: 'M 388,38 L 388,118' }
    ],
    highlights: [
      'M 385,44 L 385,110'
    ],
    secondaryHighlights: [
      'M 391,60 L 391,102'
    ],
    creases: []
  },
  {
    char: 'L',
    paths: [
      { d: 'M 428,38 L 428,118' },
      { d: 'M 428,118 L 476,118' }
    ],
    highlights: [
      'M 424,44 L 424,112',
      'M 432,115 L 472,115'
    ],
    secondaryHighlights: [
      'M 432,121 L 472,121'
    ],
    creases: [
      'M 428,118 L 436,118'
    ]
  },
  {
    char: 'I',
    paths: [
      { d: 'M 504,38 L 504,118' }
    ],
    highlights: [
      'M 501,44 L 501,110'
    ],
    secondaryHighlights: [
      'M 507,60 L 507,102'
    ],
    creases: []
  },
  {
    char: 'B',
    paths: [
      { d: 'M 542,38 L 542,118' },
      { d: 'M 542,38 L 568,38 C 594,38 594,76 568,76 L 542,76' },
      { d: 'M 542,76 L 572,76 C 598,76 598,118 572,118 L 542,118' }
    ],
    highlights: [
      'M 538,44 L 538,112',
      'M 546,42 L 566,42 C 584,42 584,68 568,72',
      'M 546,80 L 570,80 C 588,80 588,110 570,114'
    ],
    secondaryHighlights: [
      'M 548,72 L 560,72'
    ],
    creases: [
      'M 542,76 L 554,76'
    ]
  },
  {
    char: 'R',
    paths: [
      { d: 'M 632,38 L 632,118' },
      { d: 'M 632,38 L 658,38 C 684,38 684,76 658,76 L 632,76' },
      { d: 'M 654,76 L 684,118' }
    ],
    highlights: [
      'M 628,44 L 628,112',
      'M 636,42 L 656,42 C 674,42 674,68 658,72',
      'M 658,80 L 680,110'
    ],
    secondaryHighlights: [
      'M 636,72 L 650,72'
    ],
    creases: [
      'M 632,76 L 644,76',
      'M 654,76 L 658,82'
    ]
  },
  {
    char: 'E',
    paths: [
      { d: 'M 720,38 L 720,118' },
      { d: 'M 720,38 L 766,38' },
      { d: 'M 720,77 L 760,77' },
      { d: 'M 720,118 L 766,118' }
    ],
    highlights: [
      'M 716,44 L 716,112',
      'M 724,36 L 762,36',
      'M 724,75 L 756,75',
      'M 724,115 L 762,115'
    ],
    secondaryHighlights: [
      'M 726,42 L 762,42'
    ],
    creases: [
      'M 720,77 L 728,77'
    ]
  }
];

function renderLayer(stroke, width, strokeLinecap = 'round', strokeLinejoin = 'round', extra = '') {
  return letters.map(letter => {
    return letter.paths.map(p => {
      return `    <path d="${p.d}" stroke="${stroke}" stroke-width="${width}" stroke-linecap="${strokeLinecap}" stroke-linejoin="${strokeLinejoin}" ${extra} fill="none" />`;
    }).join('\n');
  }).join('\n');
}

function renderHighlights() {
  return letters.map(letter => {
    const main = letter.highlights.map(d => {
      return `    <path d="${d}" stroke="url(#specular-white)" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" fill="none" filter="url(#glow-specular)" />`;
    }).join('\n');
    const sec = (letter.secondaryHighlights || []).map(d => {
      return `    <path d="${d}" stroke="url(#specular-soft)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none" />`;
    }).join('\n');
    return `${main}\n${sec}`;
  }).join('\n');
}

function renderCreases() {
  return letters.map(letter => {
    return (letter.creases || []).map(d => {
      return `    <path d="${d}" stroke="#3A1C01" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.8" />`;
    }).join('\n');
  }).join('\n');
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 830 160" width="100%" height="100%" fill="none">
  <defs>
    <!-- Soft 3D Elevation Drop Shadow -->
    <filter id="balloon-shadow" x="-15%" y="-20%" width="135%" height="150%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="7" stdDeviation="6" flood-color="#2B1400" flood-opacity="0.38" />
      <feDropShadow dx="0" dy="2" stdDeviation="2.5" flood-color="#180A00" flood-opacity="0.25" />
    </filter>

    <!-- Specular Glow Filter -->
    <filter id="glow-specular" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="0.8" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    <!-- Star Glow -->
    <filter id="sparkle-glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="2" result="glow" />
      <feMerge>
        <feMergeNode in="glow" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    <!-- Outer Seam / Heat-Seal Contour Gradient -->
    <linearGradient id="seam-rim" x1="0" y1="25" x2="0" y2="135" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#592E04" />
      <stop offset="50%" stop-color="#421E01" />
      <stop offset="100%" stop-color="#2A1100" />
    </linearGradient>

    <!-- 3D Under-Extrusion / Deep Ambient Shadow -->
    <linearGradient id="extrude-bronze" x1="0" y1="25" x2="0" y2="135" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#8C4E05" />
      <stop offset="40%" stop-color="#6E3A02" />
      <stop offset="100%" stop-color="#3A1C01" />
    </linearGradient>

    <!-- Inflatable Metallic Gold Foil Body Gradient (Rich 24K Gold) -->
    <linearGradient id="gold-foil-body" x1="0" y1="25" x2="0" y2="135" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFF3A2" />
      <stop offset="12%" stop-color="#FCD24A" />
      <stop offset="30%" stop-color="#EAA11A" />
      <stop offset="55%" stop-color="#D6860E" />
      <stop offset="78%" stop-color="#B66708" />
      <stop offset="92%" stop-color="#8E4804" />
      <stop offset="100%" stop-color="#5E2C01" />
    </linearGradient>

    <!-- Inner Luminous Pillowy Core Gradient -->
    <linearGradient id="gold-core-pillow" x1="0" y1="25" x2="0" y2="135" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.92" />
      <stop offset="18%" stop-color="#FFF4AF" stop-opacity="0.85" />
      <stop offset="45%" stop-color="#FCE16B" stop-opacity="0.65" />
      <stop offset="75%" stop-color="#E6A621" stop-opacity="0.25" />
      <stop offset="100%" stop-color="#BD7409" stop-opacity="0" />
    </linearGradient>

    <!-- Pure Curved Gloss Reflection (Specular Sheen) -->
    <linearGradient id="specular-white" x1="0" y1="25" x2="0" y2="135" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.95" />
      <stop offset="50%" stop-color="#FFFFFF" stop-opacity="0.98" />
      <stop offset="100%" stop-color="#FFFBE8" stop-opacity="0.8" />
    </linearGradient>

    <!-- Secondary Bounce Specular -->
    <linearGradient id="specular-soft" x1="0" y1="25" x2="0" y2="135" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFF2B8" stop-opacity="0.5" />
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0.8" />
    </linearGradient>

    <!-- Sparkle Star Radial Gradient -->
    <radialGradient id="star-burst" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="35%" stop-color="#FFF6D0" />
      <stop offset="70%" stop-color="#F6C844" stop-opacity="0.85" />
      <stop offset="100%" stop-color="#DE9D18" stop-opacity="0" />
    </radialGradient>
  </defs>

  <g filter="url(#balloon-shadow)">
    <!-- LAYER 1: Heat-Sealed Contour Base -->
    <g opacity="0.95">
${renderLayer('url(#seam-rim)', 31)}
    </g>

    <!-- LAYER 2: 3D Under-Extruded Rim -->
    <g transform="translate(0, 3)" opacity="0.85">
${renderLayer('url(#extrude-bronze)', 27)}
    </g>

    <!-- LAYER 3: Inflated Gold Foil Body -->
    <g>
${renderLayer('url(#gold-foil-body)', 23)}
    </g>

    <!-- LAYER 4: Inner Luminous Pillow Core -->
    <g transform="translate(-1, -2)">
${renderLayer('url(#gold-core-pillow)', 15)}
    </g>

    <!-- LAYER 5: Balloon Creases -->
    <g>
${renderCreases()}
    </g>

    <!-- LAYER 6: Specular Sheen Streaks -->
    <g>
${renderHighlights()}
    </g>

    <!-- LAYER 7: Sparkles -->
    <!-- Star 1: Top-left of P (44, 26) -->
    <g transform="translate(44, 26)" filter="url(#sparkle-glow)">
      <path d="M 0,-14 Q 0,0 -14,0 Q 0,0 0,14 Q 0,0 14,0 Q 0,0 0,-14 Z" fill="url(#star-burst)" />
      <circle cx="0" cy="0" r="2.5" fill="#FFFFFF" />
      <line x1="-18" y1="0" x2="18" y2="0" stroke="#FFFFFF" stroke-width="0.8" opacity="0.9" />
      <line x1="0" y1="-18" x2="0" y2="18" stroke="#FFFFFF" stroke-width="0.8" opacity="0.9" />
    </g>

    <!-- Star 2: Top cross of T (356, 26) -->
    <g transform="translate(356, 26)" filter="url(#sparkle-glow)" opacity="0.85">
      <path d="M 0,-10 Q 0,0 -10,0 Q 0,0 0,10 Q 0,0 10,0 Q 0,0 0,-10 Z" fill="url(#star-burst)" />
      <circle cx="0" cy="0" r="1.8" fill="#FFFFFF" />
      <line x1="-13" y1="0" x2="13" y2="0" stroke="#FFFFFF" stroke-width="0.7" opacity="0.8" />
      <line x1="0" y1="-13" x2="0" y2="13" stroke="#FFFFFF" stroke-width="0.7" opacity="0.8" />
    </g>

    <!-- Star 3: Top-right tip of E (776, 28) -->
    <g transform="translate(776, 28)" filter="url(#sparkle-glow)">
      <path d="M 0,-13 Q 0,0 -13,0 Q 0,0 0,13 Q 0,0 13,0 Q 0,0 0,-13 Z" fill="url(#star-burst)" />
      <circle cx="0" cy="0" r="2.2" fill="#FFFFFF" />
      <line x1="-16" y1="0" x2="16" y2="0" stroke="#FFFFFF" stroke-width="0.8" opacity="0.85" />
      <line x1="0" y1="-16" x2="0" y2="16" stroke="#FFFFFF" stroke-width="0.8" opacity="0.85" />
    </g>
  </g>
</svg>`;

fs.writeFileSync('./public/logo-pantilibre.svg', svg.trim());
console.log('Successfully written perfected 3D gold balloon logo to ./public/logo-pantilibre.svg');
