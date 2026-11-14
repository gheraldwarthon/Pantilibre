// Script to generate ultra-luxury 3D semi-gloss gold PANTILIBRE logo SVG
import fs from 'node:fs';

// Helper to create an SVG with true 3D beveled semi-gloss gold letterforms
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 920 160" width="100%" height="100%" fill="none">
  <defs>
    <!-- Soft 3D Elevation Drop Shadow -->
    <filter id="elevation-3d" x="-10%" y="-15%" width="125%" height="145%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="5" stdDeviation="5" flood-color="#3A2202" flood-opacity="0.35" />
      <feDropShadow dx="0" dy="1" stdDeviation="2" flood-color="#1A0D00" flood-opacity="0.25" />
    </filter>

    <!-- Front Face Semi-Gloss Gold Gradient (Multi-stage satin gold) -->
    <linearGradient id="satin-gold-face" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFDF5" />
      <stop offset="6%" stop-color="#FBF0CC" />
      <stop offset="22%" stop-color="#F5DA86" />
      <stop offset="42%" stop-color="#EAB947" />
      <stop offset="62%" stop-color="#D49926" />
      <stop offset="82%" stop-color="#B27613" />
      <stop offset="100%" stop-color="#7A4B05" />
    </linearGradient>

    <!-- Top & Left Bevel Highlight (Bright Satin Chamfer) -->
    <linearGradient id="bevel-light" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="35%" stop-color="#FFF5D8" />
      <stop offset="70%" stop-color="#FBE08A" />
      <stop offset="100%" stop-color="#DDA02A" />
    </linearGradient>

    <!-- Bottom & Right Bevel Shadow (Deep Bronzed Gold) -->
    <linearGradient id="bevel-dark" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#A56E10" />
      <stop offset="40%" stop-color="#7A4A05" />
      <stop offset="100%" stop-color="#4E2B01" />
    </linearGradient>

    <!-- Extruded 3D Depth Block Gradient -->
    <linearGradient id="extrusion-3d" x1="20%" y1="0%" x2="80%" y2="100%">
      <stop offset="0%" stop-color="#80500A" />
      <stop offset="30%" stop-color="#5E3703" />
      <stop offset="70%" stop-color="#462500" />
      <stop offset="100%" stop-color="#2D1500" />
    </linearGradient>

    <!-- Satin Semi-Gloss Diagonal Light Glaze (Smooth metallic reflection) -->
    <linearGradient id="semi-gloss-glaze" x1="0%" y1="0%" x2="100%" y2="50%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0" />
      <stop offset="22%" stop-color="#FFFFFF" stop-opacity="0" />
      <stop offset="32%" stop-color="#FFFFFF" stop-opacity="0.38" />
      <stop offset="37%" stop-color="#FFFFFF" stop-opacity="0.75" />
      <stop offset="42%" stop-color="#FFFFFF" stop-opacity="0.4" />
      <stop offset="52%" stop-color="#FFFFFF" stop-opacity="0" />
      <stop offset="70%" stop-color="#FFFFFF" stop-opacity="0" />
      <stop offset="78%" stop-color="#FFFFFF" stop-opacity="0.45" />
      <stop offset="83%" stop-color="#FFFFFF" stop-opacity="0.65" />
      <stop offset="88%" stop-color="#FFFFFF" stop-opacity="0.2" />
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0" />
    </linearGradient>

    <!-- Inner Soft Ambient Core Light -->
    <linearGradient id="inner-gold-glow" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" stop-color="#C6891B" stop-opacity="0" />
      <stop offset="60%" stop-color="#FCEAB0" stop-opacity="0.35" />
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0.7" />
    </linearGradient>

    <!-- Star Sparkle Gradient -->
    <linearGradient id="star-gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="45%" stop-color="#FFF2C6" />
      <stop offset="100%" stop-color="#E5AD35" />
    </linearGradient>
  </defs>

  <g filter="url(#elevation-3d)">
    <!-- ========================================================
         LAYER 1: 3D EXTRUDED SIDES (Depth block - 6px down, 4px right)
         ======================================================== -->
    <g fill="url(#extrusion-3d)">
      <!-- P extrusion -->
      <polygon points="40,34 44,40 44,136 40,130" />
      <polygon points="40,130 44,136 66,136 62,130" />
      <polygon points="62,130 66,136 66,88 62,84" />
      <polygon points="62,84 66,88 108,88 104,82" />
      <path d="M 104,34 L 108,40 C 122,54 122,68 108,88 L 104,82 C 117,66 117,50 104,34 Z" />

      <!-- A extrusion -->
      <polygon points="126,130 130,136 150,136 146,130" />
      <polygon points="186,130 190,136 210,136 206,130" />
      <polygon points="206,130 210,136 169,38 165,34" />
      <polygon points="144,98 148,104 188,104 184,98" />

      <!-- N extrusion -->
      <polygon points="222,130 226,136 248,136 244,130" />
      <polygon points="244,130 248,136 248,58 244,52" />
      <polygon points="274,130 278,136 298,136 294,130" />
      <polygon points="294,34 298,40 298,136 294,130" />

      <!-- T extrusion -->
      <polygon points="314,50 318,56 384,56 380,50" />
      <polygon points="380,34 384,40 384,56 380,50" />
      <polygon points="336,130 340,136 360,136 356,130" />
      <polygon points="356,50 360,56 360,136 356,130" />

      <!-- I extrusion -->
      <polygon points="400,130 404,136 424,136 420,130" />
      <polygon points="420,34 424,40 424,136 420,130" />

      <!-- L extrusion -->
      <polygon points="440,130 444,136 508,136 504,130" />
      <polygon points="504,112 508,118 508,136 504,130" />
      <polygon points="460,34 464,40 464,112 460,112" />

      <!-- I extrusion -->
      <polygon points="524,130 528,136 548,136 544,130" />
      <polygon points="544,34 548,40 548,136 544,130" />

      <!-- B extrusion -->
      <polygon points="564,130 568,136 588,136 584,130" />
      <polygon points="584,130 588,136 630,136 626,130" />
      <path d="M 626,34 L 630,40 C 644,52 644,66 630,78 L 626,74 C 638,64 638,50 626,34 Z" />
      <path d="M 630,76 L 634,82 C 648,96 648,114 630,136 L 626,130 C 642,110 642,94 630,76 Z" />

      <!-- R extrusion -->
      <polygon points="654,130 658,136 678,136 674,130" />
      <polygon points="674,130 678,136 678,86 674,82" />
      <path d="M 718,34 L 722,40 C 736,54 736,70 718,84 L 714,80 C 730,68 730,52 714,34 Z" />
      <polygon points="710,130 714,136 734,136 730,130" />
      <polygon points="730,130 734,136 698,88 694,82" />

      <!-- E extrusion -->
      <polygon points="746,130 750,136 816,136 812,130" />
      <polygon points="812,34 816,40 816,54 812,48" />
      <polygon points="768,48 772,54 816,54 812,48" />
      <polygon points="800,74 804,80 804,92 800,86" />
      <polygon points="768,86 772,92 804,92 800,86" />
      <polygon points="812,114 816,120 816,136 812,130" />
    </g>

    <!-- ========================================================
         LAYER 2: 3D BEVELED CHAMFER BASE (Sculpted edge lighting)
         ======================================================== -->
    <!-- Top & Left Light Bevels -->
    <g fill="url(#bevel-light)">
      <!-- P top/left -->
      <polygon points="38,32 40,34 40,130 38,130" />
      <polygon points="38,32 104,32 102,34 40,34" />
      <polygon points="60,54 62,56 86,56 86,54" />
      <!-- A top/left -->
      <polygon points="163,32 165,34 128,130 126,130" />
      <polygon points="144,98 146,100 186,100 186,98" />
      <!-- N top/left -->
      <polygon points="220,32 222,34 222,130 220,130" />
      <polygon points="222,34 224,36 296,130 294,130" />
      <polygon points="272,32 274,34 274,130 272,130" />
      <!-- T top/left -->
      <polygon points="312,32 382,32 380,34 314,34" />
      <polygon points="334,34 336,36 336,130 334,130" />
      <!-- I top/left -->
      <polygon points="398,32 400,34 400,130 398,130" />
      <polygon points="398,32 422,32 420,34 400,34" />
      <!-- L top/left -->
      <polygon points="438,32 440,34 440,130 438,130" />
      <polygon points="438,32 462,32 460,34 440,34" />
      <polygon points="460,110 506,110 504,112 460,112" />
      <!-- I top/left -->
      <polygon points="522,32 524,34 524,130 522,130" />
      <polygon points="522,32 546,32 544,34 524,34" />
      <!-- B top/left -->
      <polygon points="562,32 564,34 564,130 562,130" />
      <polygon points="562,32 626,32 624,34 564,34" />
      <polygon points="584,54 586,56 612,56 612,54" />
      <polygon points="584,94 586,96 616,96 616,94" />
      <!-- R top/left -->
      <polygon points="652,32 654,34 654,130 652,130" />
      <polygon points="652,32 714,32 712,34 654,34" />
      <polygon points="674,54 676,56 702,56 702,54" />
      <!-- E top/left -->
      <polygon points="744,32 746,34 746,130 744,130" />
      <polygon points="744,32 814,32 812,34 746,34" />
      <polygon points="766,72 802,72 800,74 766,74" />
      <polygon points="766,110 814,110 812,112 766,112" />
    </g>

    <!-- Bottom & Right Shaded Bevels -->
    <g fill="url(#bevel-dark)">
      <!-- P bottom/right -->
      <polygon points="60,128 62,130 40,130 40,128" />
      <polygon points="102,34 104,36 104,80 102,78" />
      <polygon points="62,82 104,82 102,80 62,80" />
      <!-- A bottom/right -->
      <polygon points="165,34 167,34 206,130 204,130" />
      <polygon points="146,114 186,114 184,112 146,112" />
      <!-- N bottom/right -->
      <polygon points="242,128 244,130 222,130 222,128" />
      <polygon points="292,34 294,36 294,130 292,130" />
      <!-- T bottom/right -->
      <polygon points="314,48 380,48 380,50 314,50" />
      <polygon points="354,50 356,52 356,130 354,130" />
      <!-- I bottom/right -->
      <polygon points="418,34 420,36 420,130 418,130" />
      <!-- L bottom/right -->
      <polygon points="440,128 504,128 504,130 440,130" />
      <polygon points="502,112 504,114 504,130 502,130" />
      <!-- I bottom/right -->
      <polygon points="542,34 544,36 544,130 542,130" />
      <!-- B bottom/right -->
      <polygon points="584,72 626,72 624,74 584,74" />
      <polygon points="584,128 626,128 624,130 584,130" />
      <!-- R bottom/right -->
      <polygon points="674,80 714,80 712,82 674,82" />
      <polygon points="692,82 696,82 730,130 726,130" />
      <!-- E bottom/right -->
      <polygon points="766,48 812,48 812,50 766,50" />
      <polygon points="766,86 800,86 800,88 766,88" />
      <polygon points="746,128 812,128 812,130 746,130" />
    </g>

    <!-- ========================================================
         LAYER 3: MAIN FRONT FACE (Semi-Gloss Satin Gold 24K)
         ======================================================== -->
    <g fill="url(#satin-gold-face)">
      <!-- P -->
      <path d="M 40,34 L 104,34 C 118,34 126,44 126,58 C 126,72 118,82 104,82 L 62,82 L 62,130 L 40,130 Z M 62,52 L 100,52 C 106,52 108,55 108,58 C 108,61 106,64 100,64 L 62,64 Z" fill-rule="evenodd" />

      <!-- A -->
      <path d="M 165,34 L 143,130 L 163,130 L 168,108 L 194,108 L 199,130 L 219,130 L 197,34 Z M 172,92 L 181,54 L 190,92 Z" fill-rule="evenodd" />

      <!-- N -->
      <path d="M 222,34 L 244,34 L 274,102 L 274,34 L 294,34 L 294,130 L 272,130 L 242,62 L 242,130 L 222,130 Z" />

      <!-- T -->
      <path d="M 314,34 L 380,34 L 380,50 L 357,50 L 357,130 L 337,130 L 337,50 L 314,50 Z" />

      <!-- I -->
      <path d="M 400,34 L 420,34 L 420,130 L 400,130 Z" />

      <!-- L -->
      <path d="M 440,34 L 460,34 L 460,112 L 504,112 L 504,130 L 440,130 Z" />

      <!-- I -->
      <path d="M 524,34 L 544,34 L 544,130 L 524,130 Z" />

      <!-- B -->
      <path d="M 564,34 L 624,34 C 636,34 644,42 644,54 C 644,63 638,70 628,73 C 640,76 648,85 648,98 C 648,112 638,130 622,130 L 564,130 Z M 586,50 L 618,50 C 624,50 626,53 626,56 C 626,59 624,62 618,62 L 586,62 Z M 586,78 L 620,78 C 626,78 628,82 628,86 C 628,90 626,94 620,94 L 586,94 Z" fill-rule="evenodd" />

      <!-- R -->
      <path d="M 654,34 L 714,34 C 728,34 736,44 736,58 C 736,70 728,78 716,80 L 734,130 L 712,130 L 696,82 L 676,82 L 676,130 L 654,130 Z M 676,50 L 708,50 C 714,50 716,53 716,56 C 716,59 714,62 708,62 L 676,62 Z" fill-rule="evenodd" />

      <!-- E -->
      <path d="M 746,34 L 812,34 L 812,50 L 768,50 L 768,74 L 800,74 L 800,90 L 768,90 L 768,114 L 812,114 L 812,130 L 746,130 Z" />
    </g>

    <!-- ========================================================
         LAYER 4: INNER SATIN AMBIENT GLOW (Cylindrical subtle dome)
         ======================================================== -->
    <g fill="url(#inner-gold-glow)" opacity="0.32">
      <!-- P -->
      <rect x="42" y="36" width="18" height="92" rx="2" />
      <path d="M 62,36 C 88,36 108,42 108,58 C 108,74 88,80 62,80 Z" />
      <!-- A -->
      <polygon points="172,38 186,38 206,128 196,128 183,56 167,128 155,128" />
      <!-- N -->
      <rect x="224" y="36" width="18" height="92" rx="2" />
      <polygon points="224,36 242,36 292,128 274,128" />
      <rect x="274" y="36" width="18" height="92" rx="2" />
      <!-- T -->
      <rect x="316" y="36" width="62" height="12" rx="2" />
      <rect x="339" y="48" width="16" height="80" rx="2" />
      <!-- I -->
      <rect x="402" y="36" width="16" height="92" rx="2" />
      <!-- L -->
      <rect x="442" y="36" width="16" height="92" rx="2" />
      <rect x="442" y="114" width="60" height="14" rx="2" />
      <!-- I -->
      <rect x="526" y="36" width="16" height="92" rx="2" />
      <!-- B -->
      <rect x="566" y="36" width="18" height="92" rx="2" />
      <!-- R -->
      <rect x="656" y="36" width="18" height="92" rx="2" />
      <polygon points="694,82 708,82 724,128 710,128" />
      <!-- E -->
      <rect x="748" y="36" width="18" height="92" rx="2" />
      <rect x="766" y="36" width="44" height="12" rx="2" />
      <rect x="766" y="74" width="32" height="12" rx="2" />
      <rect x="766" y="116" width="44" height="12" rx="2" />
    </g>

    <!-- ========================================================
         LAYER 5: SEMI-GLOSS METALLIC SATIN GLAZE (Sweeping Luster)
         ======================================================== -->
    <g fill="url(#semi-gloss-glaze)">
      <!-- P -->
      <path d="M 40,34 L 104,34 C 118,34 126,44 126,58 C 126,72 118,82 104,82 L 62,82 L 62,130 L 40,130 Z M 62,52 L 100,52 C 106,52 108,55 108,58 C 108,61 106,64 100,64 L 62,64 Z" fill-rule="evenodd" />
      <!-- A -->
      <path d="M 165,34 L 143,130 L 163,130 L 168,108 L 194,108 L 199,130 L 219,130 L 197,34 Z M 172,92 L 181,54 L 190,92 Z" fill-rule="evenodd" />
      <!-- N -->
      <path d="M 222,34 L 244,34 L 274,102 L 274,34 L 294,34 L 294,130 L 272,130 L 242,62 L 242,130 L 222,130 Z" />
      <!-- T -->
      <path d="M 314,34 L 380,34 L 380,50 L 357,50 L 357,130 L 337,130 L 337,50 L 314,50 Z" />
      <!-- I -->
      <path d="M 400,34 L 420,34 L 420,130 L 400,130 Z" />
      <!-- L -->
      <path d="M 440,34 L 460,34 L 460,112 L 504,112 L 504,130 L 440,130 Z" />
      <!-- I -->
      <path d="M 524,34 L 544,34 L 544,130 L 524,130 Z" />
      <!-- B -->
      <path d="M 564,34 L 624,34 C 636,34 644,42 644,54 C 644,63 638,70 628,73 C 640,76 648,85 648,98 C 648,112 638,130 622,130 L 564,130 Z M 586,50 L 618,50 C 624,50 626,53 626,56 C 626,59 624,62 618,62 L 586,62 Z M 586,78 L 620,78 C 626,78 628,82 628,86 C 628,90 626,94 620,94 L 586,94 Z" fill-rule="evenodd" />
      <!-- R -->
      <path d="M 654,34 L 714,34 C 728,34 736,44 736,58 C 736,70 728,78 716,80 L 734,130 L 712,130 L 696,82 L 676,82 L 676,130 L 654,130 Z M 676,50 L 708,50 C 714,50 716,53 716,56 C 716,59 714,62 708,62 L 676,62 Z" fill-rule="evenodd" />
      <!-- E -->
      <path d="M 746,34 L 812,34 L 812,50 L 768,50 L 768,74 L 800,74 L 800,90 L 768,90 L 768,114 L 812,114 L 812,130 L 746,130 Z" />
    </g>

    <!-- ========================================================
         LAYER 6: CRISP SPECULAR HIGHLIGHT ACCENTS (Semi-gloss rim)
         ======================================================== -->
    <g stroke="#FFFFFF" stroke-linecap="round" opacity="0.85">
      <!-- Top crest highlights -->
      <line x1="42" y1="35" x2="98" y2="35" stroke-width="2.5" />
      <line x1="41" y1="36" x2="41" y2="72" stroke-width="2.2" />
      <!-- A apex -->
      <line x1="164" y1="35" x2="182" y2="35" stroke-width="2.5" />
      <!-- N left corner -->
      <line x1="223" y1="35" x2="242" y2="35" stroke-width="2.2" />
      <!-- T top bar -->
      <line x1="316" y1="35" x2="378" y2="35" stroke-width="2.5" />
      <!-- I top -->
      <line x1="401" y1="35" x2="419" y2="35" stroke-width="2.2" />
      <!-- L spine -->
      <line x1="441" y1="35" x2="459" y2="35" stroke-width="2.2" />
      <line x1="441" y1="36" x2="441" y2="70" stroke-width="2" />
      <line x1="462" y1="113" x2="502" y2="113" stroke-width="2" />
      <!-- I top -->
      <line x1="525" y1="35" x2="543" y2="35" stroke-width="2.2" />
      <!-- B top bar -->
      <line x1="565" y1="35" x2="620" y2="35" stroke-width="2.5" />
      <!-- R top bar -->
      <line x1="655" y1="35" x2="710" y2="35" stroke-width="2.5" />
      <!-- E top bar -->
      <line x1="747" y1="35" x2="810" y2="35" stroke-width="2.5" />
      <line x1="769" y1="75" x2="798" y2="75" stroke-width="1.8" />
      <line x1="769" y1="115" x2="810" y2="115" stroke-width="1.8" />
    </g>

    <!-- ========================================================
         LAYER 7: LUXURY JEWELRY SPARKLES (Refined 4-point star glints)
         ======================================================== -->
    <!-- Sparkle 1: Top Right of 'E' -->
    <g transform="translate(826, 26)">
      <path d="M 0 -13 Q 0 0 13 0 Q 0 0 0 13 Q 0 0 -13 0 Q 0 0 0 -13 Z" fill="url(#star-gold)" />
      <circle cx="0" cy="0" r="2.5" fill="#FFFFFF" />
      <path d="M 0 -8 L 0 8 M -8 0 L 8 0" stroke="#FFFFFF" stroke-width="0.8" opacity="0.9" />
    </g>

    <!-- Sparkle 2: Apex of 'A' -->
    <g transform="translate(182, 28) scale(0.7)">
      <path d="M 0 -13 Q 0 0 13 0 Q 0 0 0 13 Q 0 0 -13 0 Q 0 0 0 -13 Z" fill="url(#star-gold)" />
      <circle cx="0" cy="0" r="2.5" fill="#FFFFFF" />
    </g>

    <!-- Sparkle 3: Corner of 'P' -->
    <g transform="translate(36, 28) scale(0.65)">
      <path d="M 0 -13 Q 0 0 13 0 Q 0 0 0 13 Q 0 0 -13 0 Q 0 0 0 -13 Z" fill="url(#star-gold)" />
      <circle cx="0" cy="0" r="2.5" fill="#FFFFFF" />
    </g>

    <!-- Sparkle 4: Corner of 'T' -->
    <g transform="translate(382, 30) scale(0.6)">
      <path d="M 0 -13 Q 0 0 13 0 Q 0 0 0 13 Q 0 0 -13 0 Q 0 0 0 -13 Z" fill="url(#star-gold)" />
      <circle cx="0" cy="0" r="2.5" fill="#FFFFFF" />
    </g>
  </g>
</svg>
`;

fs.writeFileSync('./public/logo-pantilibre.svg', svgContent.trim());
console.log('Successfully generated 3D semi-gloss gold PANTILIBRE logo SVG!');
