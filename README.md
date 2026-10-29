# AURA-SHIELD AI (v4.2-SENTINEL)
### Enterprise-Grade AI-Based Fake Identity & Document Screening System

**AURA-SHIELD AI** is an interactive, high-level computer vision and biometric forensic screening workstation designed to detect counterfeit credentials, digital document tampering, synthetic deepfakes, and presentation attacks.

---

## 🌟 Key Features & Capabilities

### 1. Multi-Stage AI Forensic Pipeline
- **Document Edge Rectification & Template Alignment**: Identifies government-issued credential layouts, aspect ratios, and bounding margins.
- **Optical Character Recognition (OCR) & Cross-Validation**: Cross-checks visual inspection zone (VIZ) dates, names, and numbers with encrypted machine zones.
- **Machine Readable Zone (MRZ) Cryptographic Engine**: Implements **ICAO Doc 9303** standard modulo 10 checksum weighting (`7, 3, 1, 7, 3, 1...`) for Passports (TD3) and National IDs (TD1). Flags forged check digits in red.
- **Error Level Analysis (ELA)**: Detects compression quantization variance to highlight spliced photos, digitally altered text, and clone-stamped pixels.
- **Micro-Typography & Font Kerning Auditing**: Exposes non-standard fonts (e.g. Arial glyphs instead of standard OCR-B ISO vectors).
- **Physical Security Feature Simulation**:
  - **365nm Ultraviolet (UV) Luminescence**: Simulates fluorescent security crests and embedded fiber verification.
  - **High-Pass Edge Density**: Exposes sharp cut-and-paste boundaries.
  - **Thermal Tamper Probability Heatmap**: False-color colormap showing anomaly concentration.

### 2. Biometric Facial Verification & Anti-Spoofing
- **FaceNet-512 Embedding Matching**: Computes vector cosine similarity between extracted ID portrait and live probe capture.
- **Liveness & Presentation Attack Detection (PAD)**:
  - Screen moiré fringe pattern detection (flags replayed video/photos on iPad or monitor displays).
  - Micro-vascular blood flow pulse (rPPG) simulation.
  - 3D facial landmark mesh and gaze dynamics.
- **Synthetic / Deepfake Detector**: Spectral 2D Fourier Transform frequency domain check to intercept StyleGAN and diffusion-generated identities.

### 3. Interactive Forensic Tooling
- **3x Optical Magnifier Loupe**: Real-time cursor-following lens for inspecting microprint lines and guilloche waveforms.
- **Preset Test Suite (1-Click Evaluation)**:
  1. **Specimen Alpha**: Forged Passport (Altered Expiry Date & Photo Splicing) — *Critical Risk (94%) -> REJECT*
  2. **Specimen Beta**: Tampered Driver's License (StyleGAN3 Deepfake & Screen Replay) — *High Risk (87%) -> REJECT*
  3. **Specimen Gamma**: Genuine EU Biometric ID Card — *Pass (3%) -> AUTO APPROVE*
  4. **Specimen Delta**: Expired Resident Permit — *Medium Risk (54%) -> MANUAL REVIEW*
- **Custom Upload & Live Camera**: Drag-and-drop your own ID images (PNG, JPG, SVG) or take a live probe selfie using your webcam.

### 4. Authentication & Operator Workstation
- **Sign In & Sign Up Modals**: Full form with real-time password entropy strength meter.
- **1-Click Demo Clearance Profiles**:
  - **Dr. Elena Vance**: Lead Forensic Investigator (Interpol Cyber Taskforce)
  - **Marcus Brody**: KYC/AML Compliance Officer (Global Fintech Risk)
  - **Sarah Chen**: Regulatory Identity Auditor (EU Digital Identity Authority)
- **Role-Based Clearance Badges & Session Management**: SQLite-backed session tokens and local offline recovery.

### 5. Adjudication & Audit Dossier
- **Analyst Decision Bar**: One-click actions: Approve, Flag for Review, or Escalate to SIU (Special Investigations Unit).
- **Export Audit Dossier (JSON / Print)**: Generates timestamped cryptographic dossiers with SHA-256 integrity digest and ICAO Doc 9303 compliance badges.

---

## 🚀 How to Run

### Method 1: Python Standard Library Server (Recommended)
From the project folder:
```powershell
python server.py
```
Open your browser at: **`http://127.0.0.1:8000`**

### Method 2: Double-Click Launcher
Double-click **`start.bat`** (Windows Batch) or run **`start.ps1`** (PowerShell).

### Method 3: Standalone Direct Browser Execution (Zero Dependencies)
You can directly open `public/index.html` in any modern web browser (Edge, Chrome, Firefox, Brave) without any server. The client-side AI mock engine and LocalStorage session manager run completely offline.

---

## 📂 Project Architecture

```
ai-identity-screening/
│
├── server.py              # Python 3 standard library HTTP + REST API + SQLite DB
├── screening_system.db    # Auto-created SQLite database for users & audit records
├── start.bat              # Quick 1-click launcher for Windows
├── start.ps1              # PowerShell quick launcher
├── README.md              # Documentation & user manual
│
└── public/
    ├── index.html         # Main application shell with HUD, Canvases, Modals
    ├── styles.css         # Cyber dark theme, glassmorphism, scanlines, telemetry
    ├── app.js             # Forensic engine, 7-stage pipeline, ELA filters, audio synth
    └── samples.js          # High-resolution synthetic SVG specimens & biometric pairs
```

---

## 🔒 Security & Privacy Standards
- Simulated compliance with **ICAO Doc 9303**, **ISO/IEC 19794-5 (Biometrics)**, **FIDO2 / PAD Level 2**, and **NIST FRVT**.
- Zero external tracking or external third-party cloud uploads.
