/**
 * Preset ID Specimens & Biometric Data for AURA-SHIELD AI Screening System
 * High-fidelity synthetic documents with encoded forensic markers, tamper signals,
 * MRZ strings, and biometric selfie pairs.
 */

window.ID_SPECIMENS = [
  {
    id: "SPEC-2026-0891",
    name: "Specimen Alpha (Forged Passport)",
    docType: "PASSPORT",
    holderName: "ALEXANDER VICTORIA KANE",
    nationality: "UTOPIAN FEDERATION (UTO)",
    documentNumber: "E92837415",
    dob: "1988-04-12",
    sex: "F",
    issueDate: "2018-05-10",
    expiryDate: "2028-05-09", // Visual says 2028, but MRZ has forged checksum
    riskCategory: "CRITICAL",
    riskScore: 94,
    recommendedAction: "REJECT",
    fraudSignals: [
      { code: "TAMPER_PHOTO", title: "Photo Splice & Boundary Inconsistency", severity: "HIGH", detail: "High-pass ELA reveals digital clone stamping along left collarbone and unnatural JPEG grid alignment." },
      { code: "MRZ_CHECKSUM_FAIL", title: "MRZ Checksum Modulo 10 Failure", severity: "CRITICAL", detail: "Line 2 position 28 check digit is '8', calculated checksum for expiration date '280509' must be '2'." },
      { code: "FONT_ALTERATION", title: "Micro-Typography & Kerning Mismatch", severity: "HIGH", detail: "Expiry date '2028' uses Arial-derived glyphs instead of standard OCR-B ISO compliant vector fonts." },
      { code: "UV_CREST_MISSING", title: "Missing Fluorescent Security Coat", severity: "MEDIUM", detail: "Simulated 365nm UV luminescence fails to reveal required federal guilloche crest overlay." }
    ],
    mrz: {
      line1: "P<UTOKANE<<ALEXANDER<VICTORIA<<<<<<<<<<<<<<<",
      line2: "E928374154UTO8804126F2805098<<<<<<<<<<<<<<04", // 2805098 has invalid check digit 8
      docNumberValid: true,
      dobValid: true,
      expiryValid: false, // expected 2, got 8
      compositeValid: false
    },
    biometrics: {
      similarity: 32.4, // Face mismatch
      livenessScore: 41.2,
      deepfakeProbability: 78.6,
      verdict: "FAILED_FACE_MISMATCH",
      details: "Facial distance 0.74 exceeds threshold (0.45). ID portrait does not match live probe capture."
    },
    tamperZones: [
      { x: 18, y: 35, width: 28, height: 48, label: "Digital Photo Splicing (ELA 89%)", type: "CRITICAL" },
      { x: 62, y: 52, width: 25, height: 10, label: "Altered Expiry Date Font (OCR-B Fail)", type: "CRITICAL" },
      { x: 5, y: 84, width: 90, height: 12, label: "MRZ Check Digit Inconsistency", type: "CRITICAL" }
    ],
    // High quality SVG generator for document
    generateDocumentSvg: function() {
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 520" width="100%" height="100%">
          <defs>
            <linearGradient id="bgGrad1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#1e293b"/>
              <stop offset="50%" stop-color="#0f172a"/>
              <stop offset="100%" stop-color="#020617"/>
            </linearGradient>
            <pattern id="guilloche1" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 0 20 Q 10 0 20 20 T 40 20 M 0 20 Q 10 40 20 20 T 40 20" fill="none" stroke="rgba(56,189,248,0.12)" stroke-width="0.8"/>
              <circle cx="20" cy="20" r="14" fill="none" stroke="rgba(244,63,94,0.06)" stroke-width="0.5"/>
            </pattern>
            <filter id="elaNoise">
              <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="noise"/>
              <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.15 0"/>
              <feComposite in2="SourceGraphic" in="glitch" operator="atop"/>
            </filter>
          </defs>

          <!-- Passport Background with Guilloche Security Pattern -->
          <rect width="800" height="520" rx="18" fill="url(#bgGrad1)" stroke="#38bdf8" stroke-width="2"/>
          <rect width="800" height="520" rx="18" fill="url(#guilloche1)"/>

          <!-- Header Band -->
          <rect x="0" y="0" width="800" height="75" rx="18" fill="rgba(15, 23, 42, 0.85)"/>
          <text x="40" y="38" fill="#38bdf8" font-family="'Courier New', monospace" font-size="14" letter-spacing="3" font-weight="bold">UTOPIAN FEDERATION / FÉDÉRATION UTOPIENNE</text>
          <text x="40" y="58" fill="#94a3b8" font-family="'Inter', sans-serif" font-size="16" font-weight="bold" letter-spacing="4">PASSPORT / PASSEPORT</text>
          
          <!-- State Coat of Arms / Hologram Emulation -->
          <g transform="translate(710, 20)">
            <circle cx="20" cy="20" r="22" fill="none" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="4 2"/>
            <polygon points="20,5 24,16 36,17 27,24 30,35 20,29 10,35 13,24 4,17 16,16" fill="rgba(245,158,11,0.25)" stroke="#fbbf24"/>
          </g>

          <!-- Tampered ID Photo Container -->
          <g transform="translate(45, 95)">
            <rect width="210" height="260" rx="10" fill="#1e293b" stroke="#f43f5e" stroke-width="2.5" stroke-dasharray="6 3"/>
            <!-- Spliced Portrait representation -->
            <rect x="5" y="5" width="200" height="250" rx="8" fill="#334155"/>
            <!-- Stylized female portrait avatar -->
            <circle cx="105" cy="95" r="50" fill="#cbd5e1"/>
            <!-- Hair -->
            <path d="M 50 100 Q 105 20 160 100 Q 145 40 105 40 Q 65 40 50 100 Z" fill="#475569"/>
            <!-- Eyes & Glasses -->
            <circle cx="90" cy="95" r="5" fill="#1e293b"/>
            <circle cx="120" cy="95" r="5" fill="#1e293b"/>
            <rect x="78" y="88" width="24" height="15" rx="3" fill="none" stroke="#0ea5e9" stroke-width="2"/>
            <rect x="108" y="88" width="24" height="15" rx="3" fill="none" stroke="#0ea5e9" stroke-width="2"/>
            <line x1="102" y1="95" x2="108" y2="95" stroke="#0ea5e9" stroke-width="2"/>
            <!-- Shoulders / Torso with visible splice edge line -->
            <path d="M 35 250 C 45 170 165 170 175 250 Z" fill="#64748b"/>
            <!-- Visual Splice Forensic Marker -->
            <line x1="10" y1="185" x2="200" y2="185" stroke="#f43f5e" stroke-width="1.5" stroke-dasharray="3 3"/>
            <text x="15" y="200" fill="#f43f5e" font-size="10" font-family="monospace" font-weight="bold">! CLONE STAMP ARTIFACT</text>
          </g>

          <!-- Document Fields & Information -->
          <g transform="translate(285, 95)" font-family="'Inter', sans-serif">
            <!-- Field 1: Type / Code / Passport No -->
            <text x="0" y="15" fill="#64748b" font-size="11">Type/Type</text>
            <text x="0" y="32" fill="#f8fafc" font-size="15" font-weight="bold">P</text>

            <text x="90" y="15" fill="#64748b" font-size="11">Country Code/Code pays</text>
            <text x="90" y="32" fill="#f8fafc" font-size="15" font-weight="bold">UTO</text>

            <text x="260" y="15" fill="#64748b" font-size="11">Passport No./Passeport N°</text>
            <text x="260" y="32" fill="#38bdf8" font-size="17" font-weight="bold" font-family="monospace">E92837415</text>

            <!-- Field 2: Surname -->
            <text x="0" y="65" fill="#64748b" font-size="11">Surname / Nom</text>
            <text x="0" y="85" fill="#f8fafc" font-size="16" font-weight="bold">KANE</text>

            <!-- Field 3: Given Names -->
            <text x="0" y="115" fill="#64748b" font-size="11">Given Names / Prénoms</text>
            <text x="0" y="135" fill="#f8fafc" font-size="16" font-weight="bold">ALEXANDER VICTORIA</text>

            <!-- Field 4: Nationality / Sex -->
            <text x="0" y="165" fill="#64748b" font-size="11">Nationality / Nationalité</text>
            <text x="0" y="185" fill="#f8fafc" font-size="15" font-weight="bold">UTOPIAN</text>

            <text x="180" y="165" fill="#64748b" font-size="11">Sex / Sexe</text>
            <text x="180" y="185" fill="#f8fafc" font-size="15" font-weight="bold">F</text>

            <text x="260" y="165" fill="#64748b" font-size="11">Date of Birth / Date de naiss.</text>
            <text x="260" y="185" fill="#f8fafc" font-size="15" font-weight="bold">12 APR 1988</text>

            <!-- Field 5: Issue & Altered Expiry Date -->
            <text x="0" y="215" fill="#64748b" font-size="11">Date of Issue / Date d'émission</text>
            <text x="0" y="235" fill="#f8fafc" font-size="15" font-weight="bold">10 MAY 2018</text>

            <text x="230" y="215" fill="#f43f5e" font-size="11" font-weight="bold">Expiry Date [ALTERED FONT]</text>
            <!-- Highlight box around altered date -->
            <rect x="225" y="220" width="165" height="26" rx="4" fill="rgba(244,63,94,0.18)" stroke="#f43f5e" stroke-width="1.5"/>
            <text x="232" y="238" fill="#fda4af" font-size="16" font-weight="bold" font-family="'Arial', sans-serif">09 MAY 2028</text>
            <text x="400" y="238" fill="#f43f5e" font-size="11" font-weight="bold">⚠️ FONT MISMATCH</text>
          </g>

          <!-- MRZ Zone (Bottom) with Red checksum warning -->
          <g transform="translate(35, 410)">
            <rect width="730" height="85" rx="8" fill="rgba(2, 6, 23, 0.95)" stroke="#334155"/>
            <text x="20" y="32" fill="#cbd5e1" font-family="'Courier New', monospace" font-size="18" font-weight="bold" letter-spacing="4">
              P&lt;UTOKANE&lt;&lt;ALEXANDER&lt;VICTORIA&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
            </text>
            <text x="20" y="65" fill="#cbd5e1" font-family="'Courier New', monospace" font-size="18" font-weight="bold" letter-spacing="4">
              E928374154UTO8804126F280509<tspan fill="#f43f5e" font-weight="900" text-decoration="underline">8</tspan>&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;04
            </text>
          </g>
        </svg>
      `;
    },
    // Corresponding probe selfie
    generateSelfieSvg: function() {
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 360" width="100%" height="100%">
          <rect width="300" height="360" rx="12" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>
          <!-- Live probe selfie: Different individual (Male/Androgynous, different facial structure) -->
          <circle cx="150" cy="140" r="75" fill="#f8fafc"/>
          <path d="M 60 360 C 70 240 230 240 240 360 Z" fill="#0284c7"/>
          <!-- Hair -->
          <path d="M 75 140 C 75 60 225 60 225 140 C 200 80 100 80 75 140 Z" fill="#1e293b"/>
          <!-- Eyes -->
          <circle cx="120" cy="135" r="7" fill="#0f172a"/>
          <circle cx="180" cy="135" r="7" fill="#0f172a"/>
          <!-- Beard / Stubble -->
          <path d="M 115 180 Q 150 215 185 180" stroke="#64748b" stroke-width="3" fill="none" stroke-dasharray="2 2"/>
          <!-- 3D Biometric Landmarks Simulation -->
          <g stroke="rgba(56,189,248,0.7)" fill="#38bdf8" stroke-width="0.8">
            <circle cx="120" cy="135" r="2"/>
            <circle cx="180" cy="135" r="2"/>
            <circle cx="150" cy="155" r="2"/>
            <circle cx="135" cy="185" r="2"/>
            <circle cx="165" cy="185" r="2"/>
            <line x1="120" y1="135" x2="150" y2="155"/>
            <line x1="180" y1="135" x2="150" y2="155"/>
            <line x1="150" y1="155" x2="135" y2="185"/>
            <line x1="150" y1="155" x2="165" y2="185"/>
            <line x1="135" y1="185" x2="165" y2="185"/>
          </g>
          <!-- HUD indicator -->
          <rect x="20" y="315" width="260" height="30" rx="6" fill="rgba(244,63,94,0.25)" stroke="#f43f5e"/>
          <text x="150" y="335" fill="#f43f5e" font-size="12" font-family="monospace" font-weight="bold" text-anchor="middle">BIOMETRIC MISMATCH: 32.4%</text>
        </svg>
      `;
    }
  },

  {
    id: "SPEC-2026-0892",
    name: "Specimen Beta (Synthetic Deepfake & Clone Stamp)",
    docType: "DRIVERS_LICENSE",
    holderName: "MARCUS DEVON STERLING",
    nationality: "PACIFIC METRO (USA)",
    documentNumber: "DL-88294019-B",
    dob: "1994-11-23",
    sex: "M",
    issueDate: "2021-08-14",
    expiryDate: "2029-11-23",
    riskCategory: "HIGH",
    riskScore: 87,
    recommendedAction: "REJECT",
    fraudSignals: [
      { code: "DEEPFAKE_GAN_SIGNATURE", title: "Diffusion GAN Spectral Fingerprint", severity: "HIGH", detail: "2D Fourier Transform indicates checkerboard spatial artifacts characteristic of StyleGAN3 synthesis." },
      { code: "GHOST_PORTRAIT_FAIL", title: "Secondary Laser Ghost Portrait Missing", severity: "HIGH", detail: "The semi-transparent watermark portrait on right margin does not match primary photo landmarks." },
      { code: "SURFACE_LIVENESS_FAIL", title: "Screen Replay / Moiré Fringe Detected", severity: "HIGH", detail: "Probe camera detected 120Hz pixel scanlines indicative of photographing an iPad or monitor display." }
    ],
    mrz: {
      line1: "DLPAC<<STERLING<<MARCUS<DEVON<<<<<<<<<<<<<<<",
      line2: "88294019PAC9411234M2911234<<<<<<<<<<<<<<01",
      docNumberValid: true,
      dobValid: true,
      expiryValid: true,
      compositeValid: true
    },
    biometrics: {
      similarity: 88.2, // Visual looks similar, but is synthetic!
      livenessScore: 19.8,
      deepfakeProbability: 92.4,
      verdict: "FAILED_REPLAY_ATTACK",
      details: "Detected screen moiré patterns and zero pulse photoplethysmography (rPPG) response."
    },
    tamperZones: [
      { x: 12, y: 30, width: 32, height: 50, label: "Deepfake GAN Synthetic Artifacts (92%)", type: "CRITICAL" },
      { x: 74, y: 35, width: 18, height: 28, label: "Ghost Portrait Mismatch", type: "WARNING" }
    ],
    generateDocumentSvg: function() {
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
          <defs>
            <linearGradient id="bgGrad2" x1="0" y1="0" x2="1" y2="0.8">
              <stop offset="0%" stop-color="#042f2e"/>
              <stop offset="60%" stop-color="#0f172a"/>
              <stop offset="100%" stop-color="#134e4a"/>
            </linearGradient>
            <pattern id="cardPattern" width="30" height="30" patternUnits="userSpaceOnUse">
              <rect width="30" height="30" fill="none" stroke="rgba(45,212,191,0.08)" stroke-width="0.5"/>
              <path d="M 0 0 L 30 30 M 30 0 L 0 30" stroke="rgba(45,212,191,0.04)" stroke-width="0.5"/>
            </pattern>
          </defs>
          <rect width="800" height="500" rx="20" fill="url(#bgGrad2)" stroke="#14b8a6" stroke-width="2"/>
          <rect width="800" height="500" rx="20" fill="url(#cardPattern)"/>

          <!-- Top Banner -->
          <rect x="0" y="0" width="800" height="70" rx="20" fill="#115e59"/>
          <text x="35" y="44" fill="#ccfbf1" font-family="'Inter', sans-serif" font-size="22" font-weight="900" letter-spacing="2">STATE DRIVER LICENSE</text>
          <text x="640" y="44" fill="#fcd34d" font-family="'Inter', sans-serif" font-size="14" font-weight="bold">USA REAL ID ⭐</text>

          <!-- Portrait Section -->
          <g transform="translate(40, 95)">
            <rect width="200" height="240" rx="10" fill="#042f2e" stroke="#f43f5e" stroke-width="2"/>
            <circle cx="100" cy="85" r="45" fill="#fdba74"/>
            <path d="M 55 85 C 55 40 145 40 145 85 Z" fill="#1e293b"/>
            <!-- Eyes with synthetic iris asymmetry -->
            <circle cx="85" cy="85" r="5" fill="#0f172a"/>
            <circle cx="115" cy="86" r="4.2" fill="#0f172a"/>
            <path d="M 35 230 C 45 160 155 160 165 230 Z" fill="#334155"/>
            <!-- Deepfake Warning tag -->
            <rect x="10" y="195" width="180" height="24" rx="4" fill="rgba(244,63,94,0.85)"/>
            <text x="100" y="211" fill="#ffffff" font-size="10" font-family="monospace" font-weight="bold" text-anchor="middle">AI GAN SYNTHETIC FACE</text>
          </g>

          <!-- Document Fields -->
          <g transform="translate(265, 95)" font-family="'Inter', sans-serif">
            <text x="0" y="20" fill="#5eead4" font-size="12">LICENSE NUMBER / DL</text>
            <text x="0" y="42" fill="#f8fafc" font-size="20" font-weight="bold" font-family="monospace">DL-88294019-B</text>

            <text x="0" y="75" fill="#94a3b8" font-size="11">NAME</text>
            <text x="0" y="95" fill="#f8fafc" font-size="16" font-weight="bold">STERLING, MARCUS DEVON</text>

            <text x="0" y="125" fill="#94a3b8" font-size="11">ADDRESS</text>
            <text x="0" y="143" fill="#cbd5e1" font-size="14">742 EVERGREEN TERRACE, METRO CITY</text>

            <text x="0" y="175" fill="#94a3b8" font-size="11">DOB</text>
            <text x="0" y="193" fill="#f8fafc" font-size="14" font-weight="bold">11/23/1994</text>

            <text x="120" y="175" fill="#94a3b8" font-size="11">SEX</text>
            <text x="120" y="193" fill="#f8fafc" font-size="14" font-weight="bold">M</text>

            <text x="180" y="175" fill="#94a3b8" font-size="11">EXP</text>
            <text x="180" y="193" fill="#f8fafc" font-size="14" font-weight="bold">11/23/2029</text>

            <text x="280" y="175" fill="#94a3b8" font-size="11">CLASS</text>
            <text x="280" y="193" fill="#f8fafc" font-size="14" font-weight="bold">C - OPERATOR</text>
          </g>

          <!-- Ghost laser portrait area (Tampered / Missing match) -->
          <g transform="translate(620, 110)">
            <rect width="130" height="160" rx="8" fill="rgba(255,255,255,0.03)" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="4 2"/>
            <text x="65" y="75" fill="#f59e0b" font-size="10" font-family="monospace" text-anchor="middle">GHOST PORTRAIT</text>
            <text x="65" y="95" fill="#ef4444" font-size="11" font-family="monospace" font-weight="bold" text-anchor="middle">❌ MISMATCH</text>
          </g>

          <!-- Barcode Emulation (PDF417) -->
          <g transform="translate(40, 360)">
            <rect width="720" height="110" rx="6" fill="#020617" stroke="#334155"/>
            <!-- PDF417 stripes pattern -->
            <path d="M 20 20 H 700 M 20 40 H 700 M 20 60 H 700 M 20 80 H 700" stroke="#475569" stroke-width="8" stroke-dasharray="2 4 1 5 3 2 6 2 4 1 8 3 2"/>
            <text x="360" y="100" fill="#64748b" font-size="10" font-family="monospace" text-anchor="middle">AAMVA PDF417 STANDARD 2D BARCODE</text>
          </g>
        </svg>
      `;
    },
    generateSelfieSvg: function() {
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 360" width="100%" height="100%">
          <rect width="300" height="360" rx="12" fill="#0f172a" stroke="#14b8a6" stroke-width="1.5"/>
          <!-- Screen moiré pattern representation -->
          <pattern id="moire" width="4" height="4" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="4" y2="4" stroke="rgba(244,63,94,0.15)" stroke-width="0.8"/>
          </pattern>
          <rect width="300" height="360" rx="12" fill="url(#moire)"/>
          <circle cx="150" cy="140" r="70" fill="#fdba74"/>
          <path d="M 60 360 C 70 240 230 240 240 360 Z" fill="#334155"/>
          <circle cx="125" cy="135" r="5" fill="#0f172a"/>
          <circle cx="175" cy="135" r="5" fill="#0f172a"/>
          <!-- Visual Screen Reflection Glare -->
          <polygon points="50,30 180,30 110,260 20,260" fill="rgba(255,255,255,0.08)"/>
          <rect x="20" y="315" width="260" height="30" rx="6" fill="rgba(244,63,94,0.25)" stroke="#f43f5e"/>
          <text x="150" y="335" fill="#f43f5e" font-size="12" font-family="monospace" font-weight="bold" text-anchor="middle">SCREEN REPLAY DETECTED (MOIRÉ)</text>
        </svg>
      `;
    }
  },

  {
    id: "SPEC-2026-0893",
    name: "Specimen Gamma (Genuine EU Biometric ID)",
    docType: "NATIONAL_ID",
    holderName: "SOPHIE MARIE DUBOIS",
    nationality: "FRENCH REPUBLIC (FRA)",
    documentNumber: "220914800291",
    dob: "1992-06-18",
    sex: "F",
    issueDate: "2022-09-14",
    expiryDate: "2032-09-13",
    riskCategory: "LOW",
    riskScore: 3,
    recommendedAction: "APPROVE",
    fraudSignals: [],
    mrz: {
      line1: "IDFRADUBOIS<<<<<<<<<<<<<<<<<<220914",
      line2: "2209148002914SOPHIE<<MARIE<<9206182F",
      docNumberValid: true,
      dobValid: true,
      expiryValid: true,
      compositeValid: true
    },
    biometrics: {
      similarity: 98.4,
      livenessScore: 99.1,
      deepfakeProbability: 1.2,
      verdict: "PASSED_VERIFIED",
      details: "Biometric cosine similarity 0.984 matches threshold. Natural eye blink and micro-vascular blood flow pulse detected."
    },
    tamperZones: [],
    generateDocumentSvg: function() {
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
          <defs>
            <linearGradient id="bgGrad3" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#1e1b4b"/>
              <stop offset="50%" stop-color="#1e293b"/>
              <stop offset="100%" stop-color="#0f172a"/>
            </linearGradient>
            <pattern id="guilloche3" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 0 10 Q 5 0 10 10 T 20 10" fill="none" stroke="rgba(129,140,248,0.18)" stroke-width="0.7"/>
            </pattern>
          </defs>
          <rect width="800" height="500" rx="18" fill="url(#bgGrad3)" stroke="#10b981" stroke-width="2"/>
          <rect width="800" height="500" rx="18" fill="url(#guilloche3)"/>

          <!-- Header -->
          <rect x="0" y="0" width="800" height="70" rx="18" fill="#1e1b4b"/>
          <text x="35" y="32" fill="#a5b4fc" font-size="12" font-family="'Inter', sans-serif" letter-spacing="2">RÉPUBLIQUE FRANÇAISE / EUROPEAN UNION</text>
          <text x="35" y="54" fill="#f8fafc" font-size="18" font-weight="900" letter-spacing="3">CARTE NATIONALE D'IDENTITÉ / NATIONAL IDENTITY CARD</text>
          
          <!-- EU Flag emblem -->
          <g transform="translate(720, 20)">
            <rect width="45" height="30" rx="3" fill="#1d4ed8"/>
            <circle cx="22.5" cy="15" r="9" fill="none" stroke="#facc15" stroke-width="1.5" stroke-dasharray="2 2"/>
            <text x="22.5" y="19" fill="#f8fafc" font-size="10" font-weight="bold" text-anchor="middle">FR</text>
          </g>

          <!-- Portrait Section with Authentic Holographic Micro-Overlay -->
          <g transform="translate(45, 95)">
            <rect width="200" height="240" rx="8" fill="#0f172a" stroke="#10b981" stroke-width="2"/>
            <circle cx="100" cy="85" r="45" fill="#f1f5f9"/>
            <path d="M 55 85 C 55 30 145 30 145 85 Z" fill="#64748b"/>
            <!-- Eyes -->
            <circle cx="85" cy="85" r="5" fill="#0f172a"/>
            <circle cx="115" cy="85" r="5" fill="#0f172a"/>
            <path d="M 40 230 C 45 160 155 160 160 230 Z" fill="#475569"/>
            <!-- Laser Engraved Hologram Overlay simulation -->
            <path d="M 20 20 L 180 220 M 180 20 L 20 220" stroke="rgba(16,185,129,0.25)" stroke-width="2"/>
            <rect x="15" y="200" width="170" height="22" rx="4" fill="rgba(16,185,129,0.2)" stroke="#10b981"/>
            <text x="100" y="215" fill="#34d399" font-size="10" font-family="monospace" font-weight="bold" text-anchor="middle">✓ AUTHENTIC BIOMETRIC</text>
          </g>

          <!-- Fields -->
          <g transform="translate(275, 95)" font-family="'Inter', sans-serif">
            <text x="0" y="18" fill="#94a3b8" font-size="11">NOM / SURNAME</text>
            <text x="0" y="38" fill="#f8fafc" font-size="17" font-weight="bold">DUBOIS</text>

            <text x="0" y="70" fill="#94a3b8" font-size="11">PRÉNOMS / GIVEN NAMES</text>
            <text x="0" y="90" fill="#f8fafc" font-size="17" font-weight="bold">SOPHIE MARIE</text>

            <text x="0" y="122" fill="#94a3b8" font-size="11">SEXE / SEX</text>
            <text x="0" y="142" fill="#f8fafc" font-size="14" font-weight="bold">F</text>

            <text x="100" y="122" fill="#94a3b8" font-size="11">NATIONALITÉ / NATIONALITY</text>
            <text x="100" y="142" fill="#f8fafc" font-size="14" font-weight="bold">FRA</text>

            <text x="0" y="174" fill="#94a3b8" font-size="11">DATE DE NAISSANCE / DOB</text>
            <text x="0" y="194" fill="#f8fafc" font-size="14" font-weight="bold">18.06.1992</text>

            <text x="210" y="174" fill="#94a3b8" font-size="11">EXPIRATION / EXPIRY</text>
            <text x="210" y="194" fill="#34d399" font-size="14" font-weight="bold">13.09.2032</text>
          </g>

          <!-- Contactless Chip Icon -->
          <g transform="translate(680, 110)">
            <rect width="60" height="45" rx="5" fill="#d97706" stroke="#fbbf24"/>
            <path d="M 10 15 H 50 M 10 30 H 50 M 25 15 V 30 M 35 15 V 30" stroke="#78350f" stroke-width="2"/>
            <text x="30" y="40" fill="#451a03" font-size="8" font-weight="bold" text-anchor="middle">RFID</text>
          </g>

          <!-- 3-line ID MRZ (ICAO Doc 9303 TD1 Format) -->
          <g transform="translate(35, 360)">
            <rect width="730" height="110" rx="8" fill="rgba(2, 6, 23, 0.92)" stroke="#10b981" stroke-width="1.2"/>
            <text x="25" y="35" fill="#34d399" font-family="'Courier New', monospace" font-size="17" font-weight="bold" letter-spacing="4">
              IDFRADUBOIS&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;220914
            </text>
            <text x="25" y="68" fill="#34d399" font-family="'Courier New', monospace" font-size="17" font-weight="bold" letter-spacing="4">
              2209148002914SOPHIE&lt;&lt;MARIE&lt;&lt;9206182F
            </text>
            <text x="25" y="98" fill="#a7f3d0" font-family="monospace" font-size="11">✓ ICAO DOC 9303 CHECKSUM VERIFIED: 100% PASS</text>
          </g>
        </svg>
      `;
    },
    generateSelfieSvg: function() {
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 360" width="100%" height="100%">
          <rect width="300" height="360" rx="12" fill="#0f172a" stroke="#10b981" stroke-width="2"/>
          <circle cx="150" cy="140" r="70" fill="#f1f5f9"/>
          <path d="M 60 360 C 70 240 230 240 240 360 Z" fill="#475569"/>
          <path d="M 80 140 C 80 60 220 60 220 140 Z" fill="#64748b"/>
          <circle cx="125" cy="135" r="5" fill="#0f172a"/>
          <circle cx="175" cy="135" r="5" fill="#0f172a"/>
          <!-- 3D Biometric mesh in bright green -->
          <g stroke="rgba(16,185,129,0.8)" fill="#10b981" stroke-width="0.8">
            <circle cx="125" cy="135" r="2"/>
            <circle cx="175" cy="135" r="2"/>
            <circle cx="150" cy="155" r="2"/>
            <circle cx="135" cy="180" r="2"/>
            <circle cx="165" cy="180" r="2"/>
            <line x1="125" y1="135" x2="150" y2="155"/>
            <line x1="175" y1="135" x2="150" y2="155"/>
            <line x1="150" y1="155" x2="135" y2="180"/>
            <line x1="150" y1="155" x2="165" y2="180"/>
            <line x1="135" y1="180" x2="165" y2="180"/>
          </g>
          <rect x="20" y="315" width="260" height="30" rx="6" fill="rgba(16,185,129,0.2)" stroke="#10b981"/>
          <text x="150" y="335" fill="#34d399" font-size="12" font-family="monospace" font-weight="bold" text-anchor="middle">✓ MATCH: 98.4% (LIVENESS PASSED)</text>
        </svg>
      `;
    }
  },

  {
    id: "SPEC-2026-0894",
    name: "Specimen Delta (Suspicious Resident Permit - Flagged for Review)",
    docType: "RESIDENCE_PERMIT",
    holderName: "TARIQ HASSAN AL-MANSOOR",
    nationality: "EMIRATES (UAE)",
    documentNumber: "RP-77401928",
    dob: "1983-09-05",
    sex: "M",
    issueDate: "2020-03-12",
    expiryDate: "2025-03-11", // Expired permit
    riskCategory: "MEDIUM",
    riskScore: 54,
    recommendedAction: "REVIEW",
    fraudSignals: [
      { code: "EXPIRED_DOCUMENT", title: "Document Validity Expired", severity: "HIGH", detail: "Current system date 2026 exceeds document expiration date 2025-03-11." },
      { code: "SUSPICIOUS_GLARE", title: "Severe Specular Flash Glare on Hologram", severity: "MEDIUM", detail: "Excessive saturation on central seal obscures latent security guilloche elements." }
    ],
    mrz: {
      line1: "IRAREAL<MANSOOR<<TARIQ<HASSAN<<<<<<<<<<<<<<<",
      line2: "RP774019280ARE8309051M2503112<<<<<<<<<<<<<<44",
      docNumberValid: true,
      dobValid: true,
      expiryValid: true,
      compositeValid: true
    },
    biometrics: {
      similarity: 91.0,
      livenessScore: 88.5,
      deepfakeProbability: 14.2,
      verdict: "PASSED_BIOMETRIC",
      details: "Biometric face match high (91.0%), but compliance flag raised due to document expiration date."
    },
    tamperZones: [
      { x: 55, y: 45, width: 35, height: 20, label: "Document Expired (2025-03-11)", type: "WARNING" }
    ],
    generateDocumentSvg: function() {
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
          <defs>
            <linearGradient id="bgGrad4" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#451a03"/>
              <stop offset="50%" stop-color="#1e293b"/>
              <stop offset="100%" stop-color="#0f172a"/>
            </linearGradient>
          </defs>
          <rect width="800" height="500" rx="18" fill="url(#bgGrad4)" stroke="#f59e0b" stroke-width="2"/>
          <rect x="0" y="0" width="800" height="70" rx="18" fill="#78350f"/>
          <text x="35" y="44" fill="#fef3c7" font-family="'Inter', sans-serif" font-size="20" font-weight="900" letter-spacing="2">RESIDENCE PERMIT / TITRE DE SÉJOUR</text>

          <g transform="translate(45, 95)">
            <rect width="200" height="240" rx="8" fill="#1e293b" stroke="#f59e0b"/>
            <circle cx="100" cy="85" r="45" fill="#f8fafc"/>
            <path d="M 50 85 C 50 35 150 35 150 85 Z" fill="#334155"/>
            <circle cx="85" cy="85" r="5" fill="#0f172a"/>
            <circle cx="115" cy="85" r="5" fill="#0f172a"/>
            <path d="M 40 230 C 45 160 155 160 160 230 Z" fill="#64748b"/>
          </g>

          <g transform="translate(275, 95)" font-family="'Inter', sans-serif">
            <text x="0" y="20" fill="#fcd34d" font-size="12">PERMIT NUMBER</text>
            <text x="0" y="44" fill="#f8fafc" font-size="18" font-weight="bold">RP-77401928</text>

            <text x="0" y="80" fill="#94a3b8" font-size="11">NAME</text>
            <text x="0" y="100" fill="#f8fafc" font-size="17" font-weight="bold">AL-MANSOOR, TARIQ HASSAN</text>

            <text x="0" y="135" fill="#94a3b8" font-size="11">NATIONALITY</text>
            <text x="0" y="155" fill="#f8fafc" font-size="15" font-weight="bold">EMIRATES (UAE)</text>

            <text x="0" y="190" fill="#f43f5e" font-size="11" font-weight="bold">EXPIRY DATE (EXPIRED!)</text>
            <rect x="0" y="196" width="160" height="26" rx="4" fill="rgba(244,63,94,0.2)" stroke="#f43f5e"/>
            <text x="10" y="214" fill="#f43f5e" font-size="15" font-weight="bold">11-03-2025</text>
          </g>

          <g transform="translate(35, 360)">
            <rect width="730" height="110" rx="8" fill="rgba(2, 6, 23, 0.92)" stroke="#f59e0b"/>
            <text x="25" y="40" fill="#fde68a" font-family="'Courier New', monospace" font-size="17" font-weight="bold" letter-spacing="4">
              IRAREAL&lt;MANSOOR&lt;&lt;TARIQ&lt;HASSAN&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
            </text>
            <text x="25" y="75" fill="#fde68a" font-family="'Courier New', monospace" font-size="17" font-weight="bold" letter-spacing="4">
              RP774019280ARE8309051M2503112&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;44
            </text>
          </g>
        </svg>
      `;
    },
    generateSelfieSvg: function() {
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 360" width="100%" height="100%">
          <rect width="300" height="360" rx="12" fill="#0f172a" stroke="#f59e0b" stroke-width="1.5"/>
          <circle cx="150" cy="140" r="70" fill="#f8fafc"/>
          <path d="M 60 360 C 70 240 230 240 240 360 Z" fill="#64748b"/>
          <path d="M 75 140 C 75 60 225 60 225 140 Z" fill="#334155"/>
          <circle cx="125" cy="135" r="5" fill="#0f172a"/>
          <circle cx="175" cy="135" r="5" fill="#0f172a"/>
          <rect x="20" y="315" width="260" height="30" rx="6" fill="rgba(245,158,11,0.2)" stroke="#f59e0b"/>
          <text x="150" y="335" fill="#fde68a" font-size="12" font-family="monospace" font-weight="bold" text-anchor="middle">MANUAL REVIEW REQUIRED (EXPIRED)</text>
        </svg>
      `;
    }
  }
];
