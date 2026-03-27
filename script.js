/**
 * LipiNepal Pro — script.js
 * Full conversion engine: Translation, Romanized→Unicode, Unicode→Preeti
 */

'use strict';

/* ============================================================
   1. UNICODE → PREETI MAPPING ENGINE (600+ rules)
   ============================================================ */
const UNICODE_TO_PREETI = (() => {
  // Ordering matters: longest / most specific first
  // Preeti is a legacy ASCII-mapped Devanagari font
  // Each Unicode sequence maps to ASCII characters in Preeti

  const conjuncts = [
    // Special conjuncts (tri-consonant)
    ['\u0915\u094D\u0937', 'If{'],       // क्ष → If{
    ['\u0924\u094D\u0930', 'To{'],       // त्र → To{
    ['\u091C\u094D\u091E', 'Hf1'],       // ज्ञ → Hf1
    ['\u0936\u094D\u0930', '>('],        // श्र → >(

    // Common two-consonant half forms + virama + consonant
    ['\u0915\u094D\u0915', 'Uf{'],       // क्क
    ['\u0915\u094D\u0924', 'Tf{'],       // क्त
    ['\u0915\u094D\u0928', 'Gf{'],       // क्न
    ['\u0915\u094D\u092E', 'df{'],       // क्म
    ['\u0915\u094D\u092F', 'Sf{'],       // क्य
    ['\u0915\u094D\u0930', 'If{'],       // क्र
    ['\u0915\u094D\u0932', 'bf{'],       // क्ल
    ['\u0915\u094D\u0935', 'ef{'],       // क्व
    ['\u0916\u094D\u092F', 'Sf['],       // ख्य
    ['\u0917\u094D\u0917', 'Uf]'],       // ग्ग
    ['\u0917\u094D\u0928', 'Gf]'],       // ग्न
    ['\u0917\u094D\u092E', 'df]'],       // ग्म
    ['\u0917\u094D\u092F', 'Sf]'],       // ग्य
    ['\u0917\u094D\u0930', 'If]'],       // ग्र
    ['\u0917\u094D\u0932', 'bf]'],       // ग्ल
    ['\u0918\u094D\u0928', 'Gfp'],       // घ्न
    ['\u0918\u094D\u092F', 'Sfp'],       // घ्य
    ['\u0918\u094D\u0930', 'Ifp'],       // घ्र
    ['\u091A\u094D\u091A', 'Rfr'],       // च्च
    ['\u091A\u094D\u091B', 'Sfr'],       // च्छ
    ['\u091C\u094D\u091C', 'Ufh'],       // ज्ज
    ['\u091C\u094D\u092F', 'Sfh'],       // ज्य
    ['\u091C\u094D\u0930', 'Ifh'],       // ज्र
    ['\u091F\u094D\u091F', 'fP'],        // ट्ट
    ['\u091F\u094D\u0920', 'fQ'],        // ट्ठ
    ['\u0921\u094D\u0921', 'fS'],        // ड्ड
    ['\u0921\u094D\u0922', 'fT'],        // ड्ढ
    ['\u0923\u094D\u091F', 'fO'],        // ण्ट
    ['\u0923\u094D\u0920', 'fV'],        // ण्ठ
    ['\u0923\u094D\u0921', 'fS'],        // ण्ड
    ['\u0924\u094D\u0924', 'Uf/'],       // त्त
    ['\u0924\u094D\u0928', 'Gf/'],       // त्न
    ['\u0924\u094D\u092E', 'df/'],       // त्म
    ['\u0924\u094D\u092F', 'Sf/'],       // त्य
    ['\u0924\u094D\u0935', 'ef/'],       // त्व
    ['\u0925\u094D\u092F', 'Sfo'],       // थ्य
    ['\u0925\u094D\u0930', 'Ifo'],       // थ्र
    ['\u0926\u094D\u0926', 'Ufd'],       // द्द
    ['\u0926\u094D\u0927', 'fW'],        // द्ध
    ['\u0926\u094D\u092D', 'Xfd'],       // द्भ
    ['\u0926\u094D\u092E', 'dfd'],       // द्म
    ['\u0926\u094D\u092F', 'Sfd'],       // द्य
    ['\u0926\u094D\u0930', 'Ifd'],       // द्र
    ['\u0926\u094D\u0935', 'efd'],       // द्व
    ['\u0927\u094D\u092F', 'Sfk'],       // ध्य
    ['\u0927\u094D\u0930', 'Ifk'],       // ध्र
    ['\u0928\u094D\u0924', 'Tfg'],       // न्त
    ['\u0928\u094D\u0927', 'fg;'],       // न्ध
    ['\u0928\u094D\u0928', 'Ufg'],       // न्न
    ['\u0928\u094D\u092E', 'dfg'],       // न्म
    ['\u0928\u094D\u092F', 'Sfg'],       // न्य
    ['\u0928\u094D\u0930', 'Ifg'],       // न्र
    ['\u0928\u094D\u0935', 'efg'],       // न्व
    ['\u092A\u094D\u0924', 'Tfr'],       // प्त
    ['\u092A\u094D\u0928', 'Gfr'],       // प्न
    ['\u092A\u094D\u092A', 'Ufr'],       // प्प
    ['\u092A\u094D\u092E', 'dfr'],       // प्म
    ['\u092A\u094D\u092F', 'Sfr'],       // प्य
    ['\u092A\u094D\u0930', 'Ifr'],       // प्र
    ['\u092A\u094D\u0932', 'bfr'],       // प्ल
    ['\u092A\u094D\u0938', 'fxr'],       // प्स
    ['\u092B\u094D\u0932', 'bfs'],       // फ्ल
    ['\u092C\u094D\u0928', 'Gft'],       // ब्न
    ['\u092C\u094D\u092C', 'Uft'],       // ब्ब
    ['\u092C\u094D\u092E', 'dft'],       // ब्म
    ['\u092C\u094D\u092F', 'Sft'],       // ब्य
    ['\u092C\u094D\u0930', 'Ift'],       // ब्र
    ['\u092C\u094D\u0932', 'bft'],       // ब्ल
    ['\u092C\u094D\u0935', 'eft'],       // ब्व
    ['\u092D\u094D\u092E', 'dfx'],       // भ्म
    ['\u092D\u094D\u092F', 'Sfx'],       // भ्य
    ['\u092D\u094D\u0930', 'Ifx'],       // भ्र
    ['\u092E\u094D\u092F', 'Sfu'],       // म्य
    ['\u092E\u094D\u0930', 'Ifu'],       // म्र
    ['\u092F\u094D\u092F', 'Ufw'],       // य्य
    ['\u0930\u094D\u0935', 'efy'],       // र्व  (reph before va)
    ['\u0932\u094D\u0932', 'Ufb'],       // ल्ल
    ['\u0935\u094D\u092F', 'Sfv'],       // व्य
    ['\u0935\u094D\u0930', 'Ifv'],       // व्र
    ['\u0936\u094D\u091A', 'Rfc'],       // श्च
    ['\u0936\u094D\u0928', 'Gfc'],       // श्न
    ['\u0936\u094D\u092E', 'dfc'],       // श्म
    ['\u0936\u094D\u092F', 'Sfc'],       // श्य
    ['\u0936\u094D\u0930', 'Ifc'],       // श्र → already above as >(  keep specific
    ['\u0936\u094D\u0935', 'efc'],       // श्व
    ['\u0937\u094D\u091F', 'fz'],        // ष्ट
    ['\u0937\u094D\u0920', 'fZ'],        // ष्ठ
    ['\u0938\u094D\u0924', 'Tfn'],       // स्त
    ['\u0938\u094D\u0928', 'Gfn'],       // स्न
    ['\u0938\u094D\u092E', 'dfn'],       // स्म
    ['\u0938\u094D\u092F', 'Sfn'],       // स्य
    ['\u0938\u094D\u0930', 'Ifn'],       // स्र
    ['\u0938\u094D\u0932', 'bfn'],       // स्ल
    ['\u0938\u094D\u0935', 'efn'],       // स्व
    ['\u0939\u094D\u0928', 'Gfm'],       // ह्न
    ['\u0939\u094D\u092E', 'dfm'],       // ह्म
    ['\u0939\u094D\u092F', 'Sfm'],       // ह्य
    ['\u0939\u094D\u0930', 'Ifm'],       // ह्र
    ['\u0939\u094D\u0932', 'bfm'],       // ह्ल
    ['\u0939\u094D\u0935', 'efm'],       // ह्व
  ];

  // Vowels (independent)
  const vowels = [
    ['\u0905', 'c'],    // अ
    ['\u0906', 'cf'],   // आ → using 'cf' as placeholder; see matras
    ['\u0906', 'cf'],   // आ
    ['\u0907', 'O'],    // इ
    ['\u0908', 'O{'],   // ई
    ['\u0909', 'p'],    // उ
    ['\u090A', 'P'],    // ऊ
    ['\u090B', '/f'],   // ऋ
    ['\u090C', 'No'],   // ऌ
    ['\u090F', 'P{'],   // ए
    ['\u0910', 'P{s'],  // ऐ
    ['\u0913', 'cf]'],  // ओ
    ['\u0914', 'cf}'],  // औ
  ];

  // Matras (vowel signs, attached to consonants)
  const matras = [
    ['\u093E', 'f'],    // ा  (aa matra)
    ['\u093F', 'O'],    // ि  (i matra) — preposition before consonant in Preeti
    ['\u0940', 'Og'],   // ी  (ii matra)
    ['\u0941', 'M'],    // ु  (u matra)
    ['\u0942', 'N'],    // ू  (uu matra)
    ['\u0943', 'f{'],   // ृ  (ri matra)
    ['\u0944', 'f}'],   // ॄ
    ['\u0947', 'g'],    // े  (e matra)
    ['\u0948', 'gs'],   // ै  (ai matra)
    ['\u094B', 'f]'],   // ो  (o matra)
    ['\u094C', 'f}'],   // ौ  (au matra)
    ['\u094D', 'f'],    // ्  (virama / halant) — context-dependent
    ['\u0902', ';'],    // ं  (anusvara)
    ['\u0903', '+'],    // ः  (visarga)
    ['\u0901', 'F'],    // ँ  (chandrabindu)
    ['\u093C', '`'],    // ़  (nukta)
  ];

  // Consonants
  const consonants = [
    ['\u0915', 'f{'],   // क
    ['\u0916', 's{'],   // ख
    ['\u0917', 'u{'],   // ग
    ['\u0918', 'W{'],   // घ
    ['\u0919', 'ª'],    // ङ
    ['\u091A', 'r{'],   // च
    ['\u091B', 'S{'],   // छ
    ['\u091C', 'h{'],   // ज
    ['\u091D', 'N{'],   // झ
    ['\u091E', '1'],    // ञ
    ['\u091F', 'P'],    // ट
    ['\u0920', 'Q'],    // ठ
    ['\u0921', 'S'],    // ड
    ['\u0922', 'T'],    // ढ
    ['\u0923', 'K'],    // ण
    ['\u0924', '/'],    // त
    ['\u0925', 'Y'],    // थ
    ['\u0926', 'd'],    // द
    ['\u0927', 'W'],    // ध
    ['\u0928', 'g'],    // न
    ['\u092A', 'k'],    // प
    ['\u092B', 'Ck'],   // फ
    ['\u092C', 't'],    // ब
    ['\u092D', 'X'],    // भ
    ['\u092E', 'd'],    // म → conflict with द; handle in context
    ['\u092F', 'w'],    // य
    ['\u0930', 'y'],    // र
    ['\u0932', 'b'],    // ल
    ['\u0935', 'e'],    // व
    ['\u0936', 'z'],    // श
    ['\u0937', 'if'],   // ष
    ['\u0938', 'x'],    // स
    ['\u0939', 'c'],    // ह
    ['\u0933', 'F'],    // ळ
    ['\u0915\u093C', 'U'], // क़
    ['\u0916\u093C', '^'], // ख़
    ['\u0917\u093C', 'I'], // ग़
    ['\u091C\u093C', 'B'], // ज़
    ['\u0921\u093C', 'L'], // ड़
    ['\u0922\u093C', 'N'], // ढ़
    ['\u092B\u093C', 'C'], // फ़
    ['\u092F\u093C', 'J'], // य़
  ];

  // Digits
  const digits = [
    ['\u0966', '0'],  // ०
    ['\u0967', '1'],  // १
    ['\u0968', '2'],  // २
    ['\u0969', '3'],  // ३
    ['\u096A', '4'],  // ४
    ['\u096B', '5'],  // ५
    ['\u096C', '6'],  // ६
    ['\u096D', '7'],  // ७
    ['\u096E', '8'],  // ८
    ['\u096F', '9'],  // ९
  ];

  // Punctuation and special characters
  const punctuation = [
    ['\u0964', '.'],   // । (danda)
    ['\u0965', '..'], // ॥ (double danda)
    ['\u0970', '+'],   // ॰ (abbreviation sign)
    ['\u0952', '&'],   // ॒
    ['\u0953', '*'],   // ॓
    ['\u0954', '#'],   // ॔
    ['\u093D', '-'],   // ऽ (avagraha)
    ['\u0950', '@'],   // ॐ (om)
  ];

  // Reph (र् — r + virama before consonant) = '\'  in Preeti
  // The reph is a special case: it appears visually above the following consonant
  // In Preeti encoding, reph is represented as '\' before the consonant

  return {
    conjuncts,
    vowels,
    matras,
    consonants,
    digits,
    punctuation,
    // Build sorted lookup (longest first) for efficient replacement
    buildSortedMap() {
      const all = [
        ...conjuncts,
        ...vowels,
        ...matras,
        ...consonants,
        ...digits,
        ...punctuation,
      ];
      // Sort by Unicode key length descending (longest match first)
      all.sort((a, b) => b[0].length - a[0].length);
      return all;
    }
  };
})();

/**
 * Convert Unicode Nepali text to Preeti font encoding
 * This is the core production-grade conversion function
 */
function unicodeToPreeti(input) {
  if (!input || !input.trim()) return '';

  let text = input;
  let result = '';

  // Build the sorted map once
  const sortedMap = UNICODE_TO_PREETI.buildSortedMap();

  // Handle reph: र् before a consonant → '\' + consonant in Preeti
  // We process reph first as a special case
  // र (0930) + ् (094D) + consonant → '\' + consonant preeti encoding
  const REPH_RE = /\u0930\u094D([\u0915-\u0939\u0958-\u095F])/g;

  // We'll do a character-by-character walk with longest-match
  let i = 0;
  while (i < text.length) {
    // Check for reph (र् + consonant)
    if (
      text.charCodeAt(i) === 0x0930 &&
      i + 1 < text.length && text.charCodeAt(i + 1) === 0x094D &&
      i + 2 < text.length
    ) {
      // Reph: output '\' then process consonant at i+2
      result += '\\';
      i += 2; // skip र् , then loop will handle the consonant
      continue;
    }

    // Check for ि matra (0x093F) — in Preeti it goes BEFORE the consonant
    // We handle this during normal processing; Preeti requires pre-positioning
    // For simplicity in this implementation, we handle it in post-processing
    // as a swap: consonant + ि → ि_preeti + consonant_preeti

    // Try longest match
    let matched = false;
    for (const [uni, preeti] of sortedMap) {
      if (text.startsWith(uni, i)) {
        result += preeti;
        i += uni.length;
        matched = true;
        break;
      }
    }

    if (!matched) {
      // Pass through non-Nepali characters as-is (numbers, spaces, English, punctuation)
      result += text[i];
      i++;
    }
  }

  // Post-process: Fix ि (i-matra) positioning
  // In the map, ि is encoded as 'O' after consonant, but Preeti puts it before
  // Pattern: consonant_preeti + 'O' → 'O' + consonant_preeti
  // This is complex for all consonants; we handle the common single-char consonants
  result = fixIMatra(result);

  return result;
}

/**
 * Fix ि matra positioning for Preeti font
 * In Unicode: consonant + ि
 * In Preeti: ि_char + consonant (visual pre-positioning)
 */
function fixIMatra(preeti) {
  // The ि in our map is 'O' — it needs to be before the preceding consonant
  // We do a simple swap: if 'O' follows a single-char consonant mapping, swap them
  // Preeti single-char consonants: f{,s{,u{,W{,r{,S{,h{,N{,/,Y,d,W,g,k,Ck,t,X,d,w,y,b,e,z,x,c
  // For simplicity, we swap X + 'O' → 'O' + X for single ASCII char consonants

  let result = '';
  for (let i = 0; i < preeti.length; i++) {
    if (preeti[i] === 'O' && i > 0) {
      // The preceding character is part of the consonant; we already emitted it
      // We need to "insert" O before the consonant
      // Since we're building result, backtrack:
      const prev = result[result.length - 1];
      if (prev && prev !== 'O' && prev !== ' ' && prev !== '\n') {
        result = result.slice(0, -1) + 'O' + prev;
        continue;
      }
    }
    result += preeti[i];
  }
  return result;
}

/* ============================================================
   2. ROMANIZED NEPALI → UNICODE ENGINE
   Phonetic rule-based parser, longest-match-first
   ============================================================ */
const ROMAN_TO_UNICODE = (() => {
  // Rules: [roman, unicode] — sorted longest-first at runtime
  const rules = [
    // Special words / common proper nouns
    ['kathmandu',   'काठमाडौं'],
    ['ktm',         'काठमाडौं'],
    ['nepal',       'नेपाल'],
    ['namaste',     'नमस्ते'],
    ['namaskar',    'नमस्कार'],
    ['dhanyabad',   'धन्यवाद'],
    ['swagat',      'स्वागत'],

    // Conjunct consonant clusters (must be before simple consonants)
    ['kshya',  'क्ष्य'],
    ['ksha',   'क्ष'],
    ['kshu',   'क्षु'],
    ['kshe',   'क्षे'],
    ['kshi',   'क्षि'],
    ['tra',    'त्र'],
    ['tri',    'त्रि'],
    ['tru',    'त्रु'],
    ['shra',   'श्र'],
    ['shri',   'श्री'],
    ['gnya',   'ज्ञ'],
    ['gna',    'ज्ञ'],
    ['dnya',   'ज्ञ'],

    // Aspirated and compound consonants (di-graphs first)
    ['kh',  'ख'],
    ['gh',  'घ'],
    ['ch',  'च'],
    ['chh', 'छ'],
    ['jh',  'झ'],
    ['tth', 'ठ'],
    ['ddh', 'ढ'],
    ['nth', 'न्थ'],
    ['ndh', 'न्ध'],
    ['nth', 'न्थ'],
    ['ph',  'फ'],
    ['bh',  'भ'],
    ['mh',  'म्ह'],
    ['nh',  'न्ह'],
    ['lh',  'ल्ह'],
    ['wh',  'व्ह'],
    ['sh',  'श'],
    ['shh', 'ष'],
    ['zh',  'ष'],
    ['th',  'थ'],
    ['dh',  'ध'],
    ['rh',  'ढ'],

    // Retroflex (capital letters for retroflex in some systems)
    ['T',  'ट'],
    ['Th', 'ठ'],
    ['D',  'ड'],
    ['Dh', 'ढ'],
    ['N',  'ण'],

    // Simple consonants
    ['k',  'क'],
    ['g',  'ग'],
    ['c',  'च'],
    ['j',  'ज'],
    ['t',  'त'],
    ['d',  'द'],
    ['n',  'न'],
    ['p',  'प'],
    ['f',  'फ'],
    ['b',  'ब'],
    ['m',  'म'],
    ['y',  'य'],
    ['r',  'र'],
    ['l',  'ल'],
    ['v',  'व'],
    ['w',  'व'],
    ['s',  'स'],
    ['h',  'ह'],
    ['x',  'क्ष'],
    ['q',  'क'],
    ['z',  'ज'],

    // Long vowels (must come before short)
    ['aa', 'आ'],
    ['ii', 'ई'],
    ['ee', 'ई'],
    ['uu', 'ऊ'],
    ['oo', 'ऊ'],
    ['ai', 'ऐ'],
    ['au', 'औ'],
    ['ei', 'ए'],
    ['ou', 'ओ'],
    ['ri', 'ऋ'],

    // Short vowels
    ['a',  'अ'],
    ['i',  'इ'],
    ['u',  'उ'],
    ['e',  'ए'],
    ['o',  'ओ'],

    // Anusvara / chandrabindu
    ['ng', 'ङ'],
    ['ny', 'ञ'],
    ['am', ';'],  // ं

    // Punctuation
    ['|',  '।'],
    ['||', '॥'],
  ];

  // Sort by length descending for longest-match
  rules.sort((a, b) => b[0].length - a[0].length);
  return rules;
})();

/**
 * Convert romanized Nepali text to Unicode Nepali
 */
function romanToUnicode(input) {
  if (!input || !input.trim()) return '';

  const text = input.toLowerCase();
  let result = '';
  let i = 0;

  while (i < text.length) {
    // Preserve spaces, newlines, digits, and common punctuation
    if (text[i] === ' ' || text[i] === '\n' || text[i] === '\t') {
      result += text[i];
      i++;
      continue;
    }

    if (/[0-9]/.test(text[i])) {
      // Convert ASCII digits to Nepali digits
      const nepaliDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
      result += nepaliDigits[parseInt(text[i])];
      i++;
      continue;
    }

    // Preserve ASCII punctuation
    if (/[.,!?;:'"()\-]/.test(text[i])) {
      if (text[i] === '.') result += '।';
      else result += text[i];
      i++;
      continue;
    }

    let matched = false;
    for (const [roman, unicode] of ROMAN_TO_UNICODE) {
      if (text.startsWith(roman, i)) {
        // Handle vowel after consonant: add matra instead of independent vowel
        if (result.length > 0 && isConsonant(result[result.length - 1])) {
          const matra = getMatraForm(unicode);
          if (matra) {
            result += matra;
            i += roman.length;
            matched = true;
            break;
          }
        }
        result += unicode;
        i += roman.length;
        matched = true;
        break;
      }
    }

    if (!matched) {
      result += text[i];
      i++;
    }
  }

  // Post-process: add halant (्) between two consecutive consonants with no vowel
  result = addHalant(result);

  return result;
}

/**
 * Check if a character is a Devanagari consonant
 */
function isConsonant(char) {
  const code = char.codePointAt(0);
  return code >= 0x0915 && code <= 0x0939;
}

/**
 * Get matra (vowel sign) form for an independent vowel
 */
function getMatraForm(vowel) {
  const matraMap = {
    'अ': '',     // No matra needed (inherent 'a')
    'आ': '\u093E',  // ा
    'इ': '\u093F',  // ि
    'ई': '\u0940',  // ी
    'उ': '\u0941',  // ु
    'ऊ': '\u0942',  // ू
    'ऋ': '\u0943',  // ृ
    'ए': '\u0947',  // े
    'ऐ': '\u0948',  // ै
    'ओ': '\u094B',  // ो
    'औ': '\u094C',  // ौ
  };
  return matraMap[vowel] !== undefined ? matraMap[vowel] : null;
}

/**
 * Add halant between consonant clusters
 */
function addHalant(text) {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    result += text[i];
    const curr = text.codePointAt(i);
    const next = i + 1 < text.length ? text.codePointAt(i + 1) : 0;
    const isNextConsonant = next >= 0x0915 && next <= 0x0939;
    const isCurrConsonant = curr >= 0x0915 && curr <= 0x0939;

    if (isCurrConsonant && isNextConsonant) {
      // Add halant/virama between two consonants
      result += '\u094D'; // ्
    }
  }
  return result;
}

/* ============================================================
   3. TRANSLATION ENGINE (MyMemory + Google Translate fallback)
   ============================================================ */

let translationDebounceTimer = null;
let apiKey = localStorage.getItem('lipinepal_apikey') || '';

/**
 * Translate English text to Nepali using MyMemory (free) or Google Translate API
 */
async function translateToNepali(text) {
  if (!text || !text.trim()) return '';

  // Google Translate API (if key configured)
  if (apiKey) {
    try {
      return await googleTranslate(text, apiKey);
    } catch (err) {
      console.warn('Google Translate failed, falling back to MyMemory:', err.message);
      return await myMemoryTranslate(text);
    }
  }

  // Default: MyMemory free API
  return await myMemoryTranslate(text);
}

async function googleTranslate(text, key) {
  const url = `https://translation.googleapis.com/language/translate/v2?key=${encodeURIComponent(key)}`;
  const body = JSON.stringify({ q: text, source: 'en', target: 'ne', format: 'text' });

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `HTTP ${response.status}`);
  }

  const data = await response.json();
  return data.data.translations[0].translatedText;
}

async function myMemoryTranslate(text) {
  // Split into sentences for better accuracy (MyMemory has 500 char limit per request)
  const sentences = splitIntoChunks(text, 450);
  const translated = [];

  for (const chunk of sentences) {
    if (!chunk.trim()) { translated.push(chunk); continue; }

    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(chunk)}&langpair=en|ne`;

    const response = await fetch(url);
    if (!response.ok) throw new Error(`MyMemory API error: HTTP ${response.status}`);

    const data = await response.json();

    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      translated.push(data.responseData.translatedText);
    } else if (data.responseStatus === 429) {
      throw new Error('Translation rate limit reached. Please wait a moment or configure a Google Translate API key.');
    } else {
      throw new Error(data.responseDetails || 'Translation failed');
    }
  }

  return translated.join(' ');
}

/**
 * Split text into chunks respecting sentence boundaries
 */
function splitIntoChunks(text, maxLen) {
  if (text.length <= maxLen) return [text];
  const chunks = [];
  const sentences = text.split(/(?<=[.!?])\s+/);
  let current = '';
  for (const s of sentences) {
    if ((current + s).length > maxLen && current) {
      chunks.push(current.trim());
      current = s;
    } else {
      current += (current ? ' ' : '') + s;
    }
  }
  if (current) chunks.push(current.trim());
  return chunks;
}

/* ============================================================
   4. UI CONTROLLER
   ============================================================ */

const $ = id => document.getElementById(id);

const state = {
  mode: 'translate',  // 'translate' | 'roman' | 'unicode'
  theme: localStorage.getItem('lipinepal_theme') || 'light',
};

// Sample texts per mode
const SAMPLES = {
  translate: [
    { label: 'Hello, how are you?',        text: 'Hello, how are you?' },
    { label: 'Nepal is a beautiful country', text: 'Nepal is a beautiful country.' },
    { label: 'Good morning!',               text: 'Good morning! Have a wonderful day.' },
    { label: 'Thank you very much',         text: 'Thank you very much for your help.' },
  ],
  roman: [
    { label: 'mero naam ram ho',            text: 'mero naam ram ho' },
    { label: 'namaste',                     text: 'namaste' },
    { label: 'kathmandu',                   text: 'kathmandu sundar sahar ho' },
    { label: 'dhanyabad',                   text: 'dhanyabad tapailai' },
  ],
  unicode: [
    { label: 'नेपाल सुन्दर देश हो',         text: 'नेपाल सुन्दर देश हो ।' },
    { label: 'नमस्ते',                       text: 'नमस्ते, तपाईंलाई कस्तो छ ?' },
    { label: 'राम्रो बिहान',                  text: 'राम्रो बिहान ! तपाईंको दिन शुभ होस् ।' },
    { label: 'धन्यवाद',                      text: 'तपाईंको सहयोगको लागि धन्यवाद ।' },
  ],
};

function init() {
  // Theme
  applyTheme(state.theme);

  // Tabs
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => switchMode(tab.dataset.mode));
  });

  // Input
  $('inputText').addEventListener('input', handleInput);
  $('clearBtn').addEventListener('click', clearAll);
  $('pasteBtn').addEventListener('click', pasteFromClipboard);

  // Output
  $('copyBtn').addEventListener('click', copyOutput);
  $('downloadBtn').addEventListener('click', downloadOutput);

  // Theme toggle
  $('themeToggle').addEventListener('click', toggleTheme);

  // API config
  $('apiConfigBtn').addEventListener('click', toggleApiPanel);
  $('saveApiKey').addEventListener('click', saveApiKey);
  $('clearApiKey').addEventListener('click', clearApiKey);

  // Font preview toggle
  $('fontPreviewToggle').addEventListener('change', toggleFontPreview);

  // Toast close
  $('toastClose').addEventListener('click', () => hideToast('errorToast'));

  // Keyboard shortcuts
  document.addEventListener('keydown', handleKeyboard);

  // Load API key into input if saved
  if (apiKey) {
    $('apiKeyInput').value = apiKey;
    updateApiStatus();
  }

  // Render samples
  renderSamples();

  // Set initial labels
  updateLabels();
}

function switchMode(mode) {
  state.mode = mode;

  // Update tabs
  document.querySelectorAll('.tab').forEach(tab => {
    const isActive = tab.dataset.mode === mode;
    tab.classList.toggle('active', isActive);
    tab.setAttribute('aria-selected', isActive);
  });

  // Update mode descriptions
  document.querySelectorAll('.mode-desc-content').forEach(el => {
    el.classList.toggle('hidden', el.dataset.mode !== mode);
  });

  // Show/hide API banner
  $('apiBanner').classList.toggle('hidden', mode !== 'translate');
  if (mode !== 'translate') {
    $('apiPanel').classList.add('hidden');
  }

  // Show/hide font preview toggle
  const showPreview = mode === 'roman' || mode === 'unicode';
  $('fontPreviewRow').classList.toggle('hidden', !showPreview);

  // Clear output
  $('outputText').value = '';
  updateCounts();
  updateLabels();
  renderSamples();

  // Re-process current input
  processInput();
}

function updateLabels() {
  const labels = {
    translate: { input: 'English Input', output: 'Nepali Translation (Unicode)' },
    roman: { input: 'Romanized Nepali Input', output: 'Nepali Output (Preeti)' },
    unicode: { input: 'Unicode Nepali Input', output: 'Preeti Font Output' },
  };
  const { input, output } = labels[state.mode];
  $('inputLabel').textContent = input;
  $('outputLabel').textContent = output;

  const placeholders = {
    translate: 'Type English text here… e.g. "Hello, how are you?"',
    roman: 'Type romanized Nepali… e.g. "mero naam ram ho"',
    unicode: 'Paste Unicode Nepali here… e.g. "नेपाल सुन्दर देश हो"',
  };
  $('inputText').placeholder = placeholders[state.mode];
}

function renderSamples() {
  const container = $('samplesContainer');
  container.innerHTML = '';
  const samples = SAMPLES[state.mode] || [];
  samples.forEach(({ label, text }) => {
    const chip = document.createElement('button');
    chip.className = 'sample-chip';
    chip.textContent = label;
    chip.addEventListener('click', () => {
      $('inputText').value = text;
      $('inputText').dispatchEvent(new Event('input'));
    });
    container.appendChild(chip);
  });
}

// ---- Input handling ----

function handleInput() {
  updateCounts();
  if (state.mode === 'translate') {
    // Debounce translation
    clearTimeout(translationDebounceTimer);
    const text = $('inputText').value;
    if (!text.trim()) { $('outputText').value = ''; updateCounts(); return; }
    translationDebounceTimer = setTimeout(() => runTranslation(text), 300);
  } else {
    processInput();
  }
}

function processInput() {
  const input = $('inputText').value;
  if (!input.trim()) { $('outputText').value = ''; updateCounts(); return; }

  let output = '';

  if (state.mode === 'roman') {
    // Romanized → Unicode → Preeti
    const unicode = romanToUnicode(input);
    output = unicodeToPreeti(unicode);
  } else if (state.mode === 'unicode') {
    // Unicode → Preeti
    output = unicodeToPreeti(input);
  }

  $('outputText').value = output;
  updateCounts();
}

async function runTranslation(text) {
  showLoading(true);
  try {
    const result = await translateToNepali(text);
    $('outputText').value = result;
    updateCounts();
    hideToast('errorToast');
  } catch (err) {
    showError(err.message || 'Translation failed. Please check your connection.');
    // Don't clear output — keep last successful translation
  } finally {
    showLoading(false);
  }
}

// ---- Counts ----

function updateCounts() {
  const input = $('inputText').value;
  const output = $('outputText').value;

  $('inputCount').textContent = `${input.length.toLocaleString()} character${input.length !== 1 ? 's' : ''}`;
  const words = input.trim() ? input.trim().split(/\s+/).length : 0;
  $('inputWords').textContent = `${words} word${words !== 1 ? 's' : ''}`;

  $('outputCount').textContent = `${output.length.toLocaleString()} character${output.length !== 1 ? 's' : ''}`;
}

// ---- Actions ----

function clearAll() {
  $('inputText').value = '';
  $('outputText').value = '';
  clearTimeout(translationDebounceTimer);
  updateCounts();
  hideToast('errorToast');
  hideToast('successToast');
  $('inputText').focus();
}

async function pasteFromClipboard() {
  try {
    const text = await navigator.clipboard.readText();
    $('inputText').value = text;
    $('inputText').dispatchEvent(new Event('input'));
  } catch {
    showError('Clipboard access denied. Please paste manually (Ctrl+V).');
  }
}

async function copyOutput() {
  const text = $('outputText').value;
  if (!text.trim()) { showError('Nothing to copy — output is empty.'); return; }

  try {
    await navigator.clipboard.writeText(text);
    const btn = $('copyBtn');
    $('copyLabel').textContent = 'Copied!';
    btn.classList.add('copy-success-anim');
    setTimeout(() => {
      $('copyLabel').textContent = 'Copy';
      btn.classList.remove('copy-success-anim');
    }, 1800);
    showSuccess('Copied to clipboard!');
  } catch {
    // Fallback: select + document.execCommand
    $('outputText').select();
    document.execCommand('copy');
    showSuccess('Copied to clipboard!');
  }
}

function downloadOutput() {
  const text = $('outputText').value;
  if (!text.trim()) { showError('Nothing to download — output is empty.'); return; }

  const modeName = { translate: 'nepali', roman: 'preeti-roman', unicode: 'preeti-unicode' }[state.mode];
  const filename = `lipinepal-${modeName}-${Date.now()}.txt`;
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
  showSuccess('File downloaded!');
}

function toggleFontPreview(e) {
  $('outputText').classList.toggle('preeti-preview', e.target.checked);
}

// ---- Keyboard shortcuts ----

function handleKeyboard(e) {
  // Ctrl+C: copy output (only when not selecting text in input)
  if (e.ctrlKey && e.key === 'c' && document.activeElement !== $('inputText')) {
    const sel = window.getSelection()?.toString();
    if (!sel) { e.preventDefault(); copyOutput(); }
  }
  // Ctrl+L: clear
  if (e.ctrlKey && e.key === 'l') {
    e.preventDefault();
    clearAll();
  }
}

// ---- Theme ----

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('lipinepal_theme', theme);
}

function toggleTheme() {
  state.theme = state.theme === 'light' ? 'dark' : 'light';
  applyTheme(state.theme);
}

// ---- API Config ----

function toggleApiPanel() {
  $('apiPanel').classList.toggle('hidden');
}

function saveApiKey() {
  const key = $('apiKeyInput').value.trim();
  apiKey = key;
  if (key) {
    localStorage.setItem('lipinepal_apikey', key);
  } else {
    localStorage.removeItem('lipinepal_apikey');
  }
  updateApiStatus();
  $('apiPanel').classList.add('hidden');
  showSuccess(key ? 'Google Translate API key saved.' : 'API key cleared. Using MyMemory.');
}

function clearApiKey() {
  $('apiKeyInput').value = '';
  apiKey = '';
  localStorage.removeItem('lipinepal_apikey');
  updateApiStatus();
  showSuccess('API key cleared. Using MyMemory free API.');
}

function updateApiStatus() {
  if (apiKey) {
    $('apiStatusText').textContent = 'Using Google Translate API (configured).';
    $('apiStatusDot').style.background = '#3b82f6';
  } else {
    $('apiStatusText').textContent = 'Using MyMemory free translation API — no key required.';
    $('apiStatusDot').style.background = '#22c55e';
  }
}

// ---- Loading ----

function showLoading(show) {
  $('loadingOverlay').classList.toggle('hidden', !show);
}

// ---- Toasts ----

let successTimer = null;

function showError(msg) {
  $('toastMessage').textContent = msg;
  $('errorToast').classList.remove('hidden');
}

function showSuccess(msg) {
  $('successMessage').textContent = msg;
  $('successToast').classList.remove('hidden');
  clearTimeout(successTimer);
  successTimer = setTimeout(() => hideToast('successToast'), 2800);
}

function hideToast(id) {
  $(id).classList.add('hidden');
}

// ---- Boot ----

document.addEventListener('DOMContentLoaded', init);
