/*
 * Text-based checks on OCR output: sample/demo markings, PAN numbers and issuer wording.
 * Tolerant of common OCR mistakes, but conservative so genuine documents are not affected.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.DocTextChecks = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  function levenshtein(a, b) {
    const m = a.length, n = b.length;
    if (!m) return n;
    if (!n) return m;
    let prev = Array.from({ length: n + 1 }, (_, j) => j);
    for (let i = 1; i <= m; i++) {
      const cur = [i];
      for (let j = 1; j <= n; j++) {
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      }
      prev = cur;
    }
    return prev[n];
  }

  // Short words must match exactly; longer words tolerate one OCR error.
  const EXACT_WORDS = ['demo', 'dummy', 'fake', 'void', 'mock', 'test'];
  const FUZZY_WORDS = ['sample', 'specimen', 'samples', 'specimens'];

  function sampleMarking(text) {
    const tokens = (text || '').toLowerCase().match(/[a-z]{3,}/g) || [];
    for (const t of tokens) {
      if (EXACT_WORDS.includes(t)) {
        // "test" alone is too common; require a sample-like context for it
        if (t === 'test' && !/test\s+(card|document|specimen)/i.test(text)) continue;
        return t;
      }
      if (t.length >= 6) {
        for (const w of FUZZY_WORDS) {
          if (Math.abs(t.length - w.length) <= 1 && levenshtein(t, w) <= 1) return w;
        }
      }
    }
    return null;
  }

  // PAN format: 5 letters, 4 digits, 1 letter (e.g. ABCPS1234D). Fix common OCR swaps by position.
  const TO_DIGIT = { O: '0', Q: '0', D: '0', I: '1', L: '1', S: '5', B: '8', Z: '2', G: '6' };
  const TO_LETTER = { '0': 'O', '1': 'I', '5': 'S', '8': 'B', '2': 'Z', '6': 'G' };
  function normalizePanToken(tok) {
    if (tok.length !== 10) return null;
    let out = '';
    for (let i = 0; i < 10; i++) {
      const ch = tok[i];
      const wantDigit = i >= 5 && i <= 8;
      if (wantDigit) out += /\d/.test(ch) ? ch : (TO_DIGIT[ch] || '?');
      else out += /[A-Z]/.test(ch) ? ch : (TO_LETTER[ch] || '?');
    }
    return /^[A-Z]{5}\d{4}[A-Z]$/.test(out) ? out : null;
  }
  function panNumber(text) {
    const tokens = (text || '').toUpperCase().match(/[A-Z0-9]{10}/g) || [];
    for (const t of tokens) {
      // must contain at least some letters and digits to avoid matching ordinary long words / numbers
      if (!/[A-Z]/.test(t) || !/\d/.test(t)) continue;
      const n = normalizePanToken(t);
      if (n) return n;
    }
    return null;
  }
  function panLabel(text) {
    // "PAN" written as a standalone upper-case label (a PAN card / PAN field)
    return /(^|[^A-Za-z])PAN(\s*(no\.?|number|card))?\s*[:\-]/.test(text || '');
  }

  const ISSUER_RE = /(government\s+of\s+india|unique\s+identification|uidai|aadhaar|aadhar|आधार)/i;
  // Fuzzy substring search over letters only (OCR often drops the spaces between words)
  function fuzzyContains(letters, target, maxDist) {
    const n = letters.length;
    for (let len = target.length - 1; len <= target.length + 1; len++) {
      for (let i = 0; i + len <= n; i++) {
        if (letters[i] !== target[0] && letters[i + 1] !== target[0]) continue; // cheap prefilter
        if (levenshtein(letters.substr(i, len), target) <= maxDist) return true;
      }
    }
    return false;
  }
  function issuerWording(text) {
    if (ISSUER_RE.test(text || '')) return true;
    const letters = (text || '').toLowerCase().replace(/[^a-z]/g, '');
    return fuzzyContains(letters, 'governmentofindia', 3);
  }

  return { levenshtein, sampleMarking, panNumber, panLabel, issuerWording };
});
