/*
 * Aadhaar QR decoding and verification.
 *
 * Supports the two public QR formats printed on Aadhaar documents:
 *  - Secure QR (a very large decimal number): decimal -> bytes -> gzip -> 0xFF-delimited fields
 *    followed by a photo and a 256-byte RSA-SHA256 signature made by UIDAI.
 *  - Legacy XML QR (<PrintLetterBarcodeData .../>): plain, unsigned attributes.
 *
 * The signature can only be verified with UIDAI's public certificate, which is not bundled here.
 * Provide it as PEM (uidai_cert.pem next to index.html, or via the certificate picker on the page).
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.AadhaarQR = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const TEXT_FIELDS = [
    'refId', 'name', 'dob', 'gender', 'careOf', 'district', 'landmark', 'house',
    'location', 'pincode', 'postOffice', 'state', 'street', 'subDistrict', 'vtc'
  ];

  function decimalToBytes(dec) {
    let hex = BigInt(dec).toString(16);
    if (hex.length % 2) hex = '0' + hex;
    const out = new Uint8Array(hex.length / 2);
    for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.substr(i * 2, 2), 16);
    return out;
  }

  async function gunzip(bytes) {
    const ds = new DecompressionStream('gzip');
    const stream = new Blob([bytes]).stream().pipeThrough(ds);
    return new Uint8Array(await new Response(stream).arrayBuffer());
  }

  function decodeUtf8(bytes) {
    return new TextDecoder('utf-8', { fatal: false }).decode(bytes);
  }

  // Classify raw QR text: 'secure' (digits only), 'xml' (legacy), or null
  function classifyQrText(text) {
    const t = (text || '').trim();
    if (/^\d{200,}$/.test(t)) return 'secure';
    if (/^<\?xml|^<PrintLetterBarcodeData/i.test(t)) return 'xml';
    return null;
  }

  async function parseSecureQr(decimalText) {
    const compressed = decimalToBytes(decimalText.trim());
    const data = await gunzip(compressed);
    if (data.length < 300) throw new Error('Secure QR payload too short');

    const signature = data.slice(data.length - 256);
    const signedBytes = data.slice(0, data.length - 256);

    // Collect leading 0xFF-delimited text tokens
    const tokens = [];
    let start = 0;
    for (let i = 0; i < signedBytes.length && tokens.length < 20; i++) {
      if (signedBytes[i] === 0xff) {
        tokens.push(decodeUtf8(signedBytes.slice(start, i)));
        start = i + 1;
      }
    }

    let idx = 0;
    let version = null;
    if (/^V\d+$/i.test(tokens[0] || '')) { version = tokens[0]; idx = 1; }
    const indicator = tokens[idx++];
    if (!/^[0-3]$/.test(indicator || '')) throw new Error('Unrecognised Secure QR layout');

    const fields = {};
    TEXT_FIELDS.forEach((key, n) => { fields[key] = (tokens[idx + n] || '').trim(); });
    if (!/^\d{4}/.test(fields.refId) || !fields.name) throw new Error('Secure QR fields missing');

    return {
      kind: 'secure',
      version,
      indicator: Number(indicator),
      ...fields,
      last4: fields.refId.slice(0, 4),
      signature,
      signedBytes
    };
  }

  function parseXmlQr(text) {
    const attr = n => {
      const m = new RegExp('\\b' + n + '="([^"]*)"', 'i').exec(text);
      return m ? m[1].trim() : '';
    };
    const uid = attr('uid');
    const name = attr('name');
    if (!uid || !name) throw new Error('Legacy XML QR missing uid/name');
    return {
      kind: 'xml',
      name,
      dob: attr('dob') || attr('yob'),
      gender: attr('gender'),
      last4: uid.slice(-4),
      uid,
      pincode: attr('pc'),
      state: attr('state')
    };
  }

  // ---- Minimal DER reader to pull the public key out of an X.509 certificate ----
  function pemToDer(pem) {
    const b64 = pem.replace(/-----[^-]+-----/g, '').replace(/\s+/g, '');
    const bin = atob(b64);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }

  function readTlv(buf, pos) {
    const tag = buf[pos];
    let len = buf[pos + 1];
    let hdr = 2;
    if (len & 0x80) {
      const n = len & 0x7f;
      len = 0;
      for (let i = 0; i < n; i++) len = (len * 256) + buf[pos + 2 + i];
      hdr = 2 + n;
    }
    return { tag, hdr, len, start: pos, valueStart: pos + hdr, end: pos + hdr + len };
  }

  function extractSpki(der) {
    const cert = readTlv(der, 0);                  // Certificate
    const tbs = readTlv(der, cert.valueStart);     // TBSCertificate
    let pos = tbs.valueStart;
    let el = readTlv(der, pos);
    if (el.tag === 0xa0) { pos = el.end; el = readTlv(der, pos); } // optional version
    // serial, signature alg, issuer, validity, subject
    for (let i = 0; i < 5; i++) { pos = el.end; el = readTlv(der, pos); }
    // el is now SubjectPublicKeyInfo
    return der.slice(el.start, el.end);
  }

  async function verifySignature(parsed, certPem) {
    if (parsed.kind !== 'secure') throw new Error('Only Secure QR codes are signed');
    const spki = extractSpki(pemToDer(certPem));
    const key = await crypto.subtle.importKey(
      'spki', spki, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']
    );
    return crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, parsed.signature, parsed.signedBytes);
  }

  // ---- Compare QR contents with what was read off the printed card ----
  function normalizeName(s) {
    return (s || '').toLowerCase().replace(/[^a-z\s]/g, ' ').split(/\s+/).filter(w => w.length > 1);
  }
  function dobVariants(dob) {
    const m = /^(\d{2})[-/](\d{2})[-/](\d{4})$/.exec(dob || '');
    if (!m) return /^\d{4}$/.test(dob || '') ? [dob] : [];
    const [, d, mo, y] = m;
    return [`${d}/${mo}/${y}`, `${d}-${mo}-${y}`, `${d}.${mo}.${y}`, y];
  }

  function crossCheck(qr, ocrText, ocrAadhaarNumber) {
    const result = { last4Match: null, nameMatch: null, dobMatch: null };
    if (ocrAadhaarNumber) result.last4Match = ocrAadhaarNumber.replace(/\s/g, '').slice(-4) === qr.last4;
    if (ocrText && ocrText.trim().length > 10) {
      const text = ocrText.toLowerCase();
      const words = normalizeName(qr.name);
      if (words.length) {
        const hit = words.filter(w => text.includes(w)).length;
        result.nameMatch = hit / words.length >= 0.5;
      }
      const variants = dobVariants(qr.dob);
      if (variants.length) result.dobMatch = variants.some(v => ocrText.includes(v));
    }
    return result;
  }

  return {
    classifyQrText, parseSecureQr, parseXmlQr, verifySignature, crossCheck,
    // exposed for testing
    _decimalToBytes: decimalToBytes, _extractSpki: extractSpki, _pemToDer: pemToDer
  };
});
