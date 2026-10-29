/**
 * AURA-SHIELD AI: Forensic Identity & Document Screening System
 * Core Application Engine & Interactive Forensic Studio
 */

(function () {
  'use strict';

  // State Management
  const state = {
    user: null,
    currentSpecimen: null,
    customDocument: null,
    customSelfie: null,
    isScanning: false,
    activeTab: 'screening',
    activeFilter: 'NORMAL',
    soundEnabled: true,
    verificationQueue: [],
    webcamStream: null,
    zoomActive: false
  };

  // Web Audio Procedural Sound Synthesizer
  let audioCtx = null;
  function playCyberSound(type) {
    if (!state.soundEnabled) return;
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      const now = audioCtx.currentTime;

      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'scan') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.linearRampToValueAtTime(1200, now + 0.4);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.start(now);
        osc.stop(now + 0.45);
      } else if (type === 'alert') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(620, now);
        osc.frequency.setValueAtTime(440, now + 0.15);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'success') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.start(now);
        osc.stop(now + 0.45);
      }
    } catch (e) {
      console.warn("Audio Context init warning:", e);
    }
  }

  // Toast Notifications
  function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icon = type === 'success' ? '✓' : type === 'error' ? '⚠️' : 'ℹ️';
    toast.innerHTML = `<span style="font-weight:bold">${icon}</span> <span>${message}</span>`;
    container.appendChild(toast);
    playCyberSound(type === 'error' ? 'alert' : type === 'success' ? 'success' : 'click');
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3800);
  }

  // Demo User Profiles
  const DEMO_USERS = {
    analyst: {
      name: "Dr. Elena Vance",
      email: "e.vance@aurashield.gov",
      role: "Lead Forensic Investigator",
      agency: "Interpol Cyber & Identity Fraud Taskforce",
      clearance: "LEVEL-4 SIU CLEARANCE"
    },
    compliance: {
      name: "Marcus Brody",
      email: "m.brody@globalbank.corp",
      role: "KYC/AML Compliance Officer",
      agency: "FinTech Global Risk Systems",
      clearance: "LEVEL-2 VERIFICATION"
    },
    auditor: {
      name: "Sarah Chen",
      email: "s.chen@audit.eu",
      role: "Regulatory Identity Auditor",
      agency: "EU Digital Identity Trust Authority",
      clearance: "AUDIT READ-ONLY"
    }
  };

  // Auth Operations
  async function checkAuth() {
    const saved = localStorage.getItem('aurashield_auth');
    if (saved) {
      try {
        state.user = JSON.parse(saved);
        updateUserUI();
        return;
      } catch (e) {
        localStorage.removeItem('aurashield_auth');
      }
    }
    // If not authenticated, open login modal
    openAuthModal('signin');
  }

  async function apiSignIn(email, password) {
    try {
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        const data = await res.json();
        return data.user;
      }
    } catch (err) {
      console.warn("Backend API offline, using client session mode.");
    }
    return null;
  }

  async function apiSignUp(userData, password) {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...userData, password })
      });
      if (res.ok) {
        const data = await res.json();
        return data.user;
      }
    } catch (err) {
      console.warn("Backend API offline, using client session mode.");
    }
    return null;
  }

  async function apiSaveRecord(record) {
    try {
      await fetch('/api/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record)
      });
    } catch (e) {
      // Offline fallback silent
    }
  }

  function loginUser(userData) {
    state.user = userData;
    localStorage.setItem('aurashield_auth', JSON.stringify(userData));
    updateUserUI();
    closeAuthModal();
    showToast(`Welcome back, ${userData.name}!`, 'success');
  }

  function logoutUser() {
    state.user = null;
    localStorage.removeItem('aurashield_auth');
    updateUserUI();
    openAuthModal('signin');
    showToast('Signed out of secure workstation.', 'info');
  }

  function updateUserUI() {
    const userContainer = document.getElementById('userControlsContainer');
    if (!userContainer) return;

    if (state.user) {
      userContainer.innerHTML = `
        <div class="user-badge">
          <div class="user-avatar">${state.user.name.charAt(0)}</div>
          <div>
            <div style="font-weight: 700; line-height: 1.1;">${state.user.name}</div>
            <div style="font-size: 0.68rem; color: var(--color-cyan);">${state.user.role}</div>
          </div>
        </div>
        <button id="logoutBtn" class="btn btn-secondary btn-sm" title="Sign Out">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        </button>
      `;
      document.getElementById('logoutBtn')?.addEventListener('click', logoutUser);
    } else {
      userContainer.innerHTML = `
        <button id="loginHeaderBtn" class="btn btn-primary btn-sm">
          Sign In
        </button>
      `;
      document.getElementById('loginHeaderBtn')?.addEventListener('click', () => openAuthModal('signin'));
    }
  }

  function openAuthModal(mode = 'signin') {
    const modal = document.getElementById('authModal');
    if (!modal) return;
    modal.classList.add('active');
    setAuthTab(mode);
  }

  function closeAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) modal.classList.remove('active');
  }

  function setAuthTab(tab) {
    const signinForm = document.getElementById('authSigninSection');
    const signupForm = document.getElementById('authSignupSection');
    const tabSignin = document.getElementById('tabAuthSignin');
    const tabSignup = document.getElementById('tabAuthSignup');

    if (tab === 'signin') {
      signinForm.style.display = 'block';
      signupForm.style.display = 'none';
      tabSignin.classList.add('active');
      tabSignup.classList.remove('active');
    } else {
      signinForm.style.display = 'none';
      signupForm.style.display = 'block';
      tabSignin.classList.remove('active');
      tabSignup.classList.add('active');
    }
  }

  // Load Specimen Documents
  function initSpecimens() {
    const container = document.getElementById('specimenCardsContainer');
    if (!container || !window.ID_SPECIMENS) return;

    container.innerHTML = '';
    window.ID_SPECIMENS.forEach((spec, idx) => {
      const card = document.createElement('div');
      card.className = `specimen-card ${idx === 0 ? 'active' : ''}`;
      card.id = `specimenCard-${spec.id}`;

      const badgeClass = spec.riskCategory === 'CRITICAL' ? 'badge-critical' 
                      : spec.riskCategory === 'HIGH' ? 'badge-high' 
                      : spec.riskCategory === 'MEDIUM' ? 'badge-medium' : 'badge-pass';

      card.innerHTML = `
        <div class="specimen-header">
          <span class="badge ${badgeClass}">${spec.riskCategory} RISK</span>
          <span class="mono" style="font-size:0.75rem; color:var(--text-muted);">${spec.docType}</span>
        </div>
        <div class="specimen-title">${spec.name}</div>
        <div style="font-size:0.75rem; color:var(--text-muted); margin-top:0.25rem;">
          ${spec.holderName}
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:0.6rem; font-size:0.75rem;">
          <span style="color:var(--text-dim);">${spec.documentNumber}</span>
          <span class="mono" style="font-weight:bold; color:${spec.riskScore > 70 ? 'var(--color-rose)' : spec.riskScore > 40 ? 'var(--color-amber)' : 'var(--color-emerald)'}">
            Fraud Score: ${spec.riskScore}%
          </span>
        </div>
      `;

      card.addEventListener('click', () => {
        selectSpecimen(spec);
      });

      container.appendChild(card);
    });

    // Select first specimen by default
    if (window.ID_SPECIMENS.length > 0) {
      selectSpecimen(window.ID_SPECIMENS[0]);
    }
  }

  function selectSpecimen(spec) {
    state.currentSpecimen = spec;
    state.customDocument = null;
    state.customSelfie = null;

    document.querySelectorAll('.specimen-card').forEach(c => c.classList.remove('active'));
    document.getElementById(`specimenCard-${spec.id}`)?.classList.add('active');

    renderDocumentDisplay();
    renderBiometricsDisplay();
    renderMRZDisplay();
    renderVerdictDisplay();
    playCyberSound('click');
  }

  // Render Document on Stage & Canvas Filters
  function renderDocumentDisplay() {
    const stage = document.getElementById('docCanvasStage');
    if (!stage || !state.currentSpecimen) return;

    // Generate SVG string
    const svgCode = state.customDocument ? state.customDocument : state.currentSpecimen.generateDocumentSvg();
    stage.innerHTML = `
      <div id="svgContainer" class="doc-svg-render filter-${state.activeFilter.toLowerCase()}">
        ${svgCode}
      </div>
      <div id="tamperBoxesOverlay" class="tamper-overlay"></div>
    `;

    applyCanvasFilter(state.activeFilter);
    renderTamperBoundingBoxes();
  }

  // Forensic Filter Shader / Simulation
  function applyCanvasFilter(filterType) {
    state.activeFilter = filterType;
    const container = document.getElementById('svgContainer');
    if (!container) return;

    // Reset base styles
    container.style.filter = 'none';
    container.style.mixBlendMode = 'normal';

    if (filterType === 'ELA') {
      // Error Level Analysis filter: High contrast, inverted frequency, highlighting compression variance
      container.style.filter = 'contrast(260%) brightness(140%) saturate(220%) hue-rotate(180deg) invert(15%)';
    } else if (filterType === 'UV') {
      // 365nm Ultraviolet Fluorescence filter: Deep violet glow, fluorescent green/cyan highlights
      container.style.filter = 'contrast(200%) brightness(75%) hue-rotate(240deg) saturate(300%)';
    } else if (filterType === 'EDGE') {
      // High-Pass Edge Inconsistency filter
      container.style.filter = 'contrast(300%) grayscale(100%) invert(100%)';
    } else if (filterType === 'HEATMAP') {
      // Thermal Tamper Probability Colormap
      container.style.filter = 'contrast(190%) saturate(350%) hue-rotate(90deg)';
    }

    // Update active button state
    document.querySelectorAll('.stage-mode-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === filterType);
    });
  }

  function renderTamperBoundingBoxes() {
    const overlay = document.getElementById('tamperBoxesOverlay');
    if (!overlay || !state.currentSpecimen) return;

    overlay.innerHTML = '';
    if (!state.currentSpecimen.tamperZones || state.currentSpecimen.tamperZones.length === 0) {
      return;
    }

    state.currentSpecimen.tamperZones.forEach(zone => {
      const box = document.createElement('div');
      box.className = `tamper-box tamper-box-${zone.type.toLowerCase()}`;
      box.style.position = 'absolute';
      box.style.left = `${zone.x}%`;
      box.style.top = `${zone.y}%`;
      box.style.width = `${zone.width}%`;
      box.style.height = `${zone.height}%`;
      box.style.border = zone.type === 'CRITICAL' ? '2px dashed #f43f5e' : '2px dashed #f59e0b';
      box.style.backgroundColor = zone.type === 'CRITICAL' ? 'rgba(244,63,94,0.18)' : 'rgba(245,158,11,0.18)';
      box.style.borderRadius = '4px';
      box.style.pointerEvents = 'auto';
      box.style.cursor = 'help';
      box.title = zone.label;

      const tag = document.createElement('span');
      tag.style.position = 'absolute';
      tag.style.top = '-20px';
      tag.style.left = '0';
      tag.style.background = zone.type === 'CRITICAL' ? '#f43f5e' : '#f59e0b';
      tag.style.color = '#fff';
      tag.style.fontSize = '9px';
      tag.style.fontWeight = 'bold';
      tag.style.padding = '1px 5px';
      tag.style.borderRadius = '3px';
      tag.style.whiteSpace = 'nowrap';
      tag.textContent = zone.label;

      box.appendChild(tag);
      overlay.appendChild(box);
    });
  }

  // Biometrics Studio Render
  function renderBiometricsDisplay() {
    const docPhotoBox = document.getElementById('bioDocPhotoBox');
    const probePhotoBox = document.getElementById('bioProbePhotoBox');
    const similarityMeter = document.getElementById('bioSimilarityScore');
    const livenessMeter = document.getElementById('bioLivenessScore');
    const deepfakeMeter = document.getElementById('bioDeepfakeScore');
    const bioVerdictText = document.getElementById('bioVerdictText');

    if (!state.currentSpecimen) return;

    if (docPhotoBox) {
      docPhotoBox.innerHTML = `
        <div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center;">
          <svg viewBox="0 0 100 120" width="80%" height="80%">
            <rect width="100" height="120" rx="6" fill="#1e293b"/>
            <circle cx="50" cy="45" r="22" fill="#cbd5e1"/>
            <path d="M 20 110 C 25 75 75 75 80 110 Z" fill="#64748b"/>
            <circle cx="42" cy="45" r="3" fill="#0f172a"/>
            <circle cx="58" cy="45" r="3" fill="#0f172a"/>
          </svg>
        </div>
      `;
    }

    if (probePhotoBox) {
      probePhotoBox.innerHTML = state.customSelfie ? 
        `<img src="${state.customSelfie}" style="width:100%; height:100%; object-fit:cover; border-radius:8px;"/>` : 
        state.currentSpecimen.generateSelfieSvg();
    }

    const bio = state.currentSpecimen.biometrics;
    if (similarityMeter) similarityMeter.textContent = `${bio.similarity}%`;
    if (livenessMeter) livenessMeter.textContent = `${bio.livenessScore}%`;
    if (deepfakeMeter) deepfakeMeter.textContent = `${bio.deepfakeProbability}%`;

    if (bioVerdictText) {
      const isPass = bio.similarity >= 80 && bio.livenessScore >= 75 && bio.deepfakeProbability < 30;
      bioVerdictText.innerHTML = `
        <div style="font-weight:bold; color:${isPass ? 'var(--color-emerald)' : 'var(--color-rose)'}">
          ${bio.verdict}
        </div>
        <div style="font-size:0.75rem; color:var(--text-muted); margin-top:0.25rem;">
          ${bio.details}
        </div>
      `;
    }
  }

  // MRZ Decoder & Checksum Breakdown
  function renderMRZDisplay() {
    const container = document.getElementById('mrzLinesContainer');
    const detailsContainer = document.getElementById('mrzValidationBreakdown');
    if (!container || !state.currentSpecimen) return;

    const m = state.currentSpecimen.mrz;
    container.innerHTML = `
      <div class="mrz-stream">
        <div>${highlightMRZLine(m.line1)}</div>
        <div>${highlightMRZLine(m.line2, m.expiryValid)}</div>
      </div>
    `;

    if (detailsContainer) {
      detailsContainer.innerHTML = `
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap:0.65rem; margin-top:0.75rem;">
          <div style="padding:0.5rem; background:rgba(2,6,23,0.4); border-radius:6px; border:1px solid #334155;">
            <div style="font-size:0.7rem; color:var(--text-muted);">Doc No. Checksum</div>
            <div style="font-weight:bold; color:${m.docNumberValid ? 'var(--color-emerald)' : 'var(--color-rose)'}">
              ${m.docNumberValid ? '✓ PASS (Modulo 10)' : '❌ CHECKSUM FAIL'}
            </div>
          </div>
          <div style="padding:0.5rem; background:rgba(2,6,23,0.4); border-radius:6px; border:1px solid #334155;">
            <div style="font-size:0.7rem; color:var(--text-muted);">DOB Checksum</div>
            <div style="font-weight:bold; color:${m.dobValid ? 'var(--color-emerald)' : 'var(--color-rose)'}">
              ${m.dobValid ? '✓ PASS (Modulo 10)' : '❌ CHECKSUM FAIL'}
            </div>
          </div>
          <div style="padding:0.5rem; background:rgba(2,6,23,0.4); border-radius:6px; border:1px solid #334155;">
            <div style="font-size:0.7rem; color:var(--text-muted);">Expiry Date Checksum</div>
            <div style="font-weight:bold; color:${m.expiryValid ? 'var(--color-emerald)' : 'var(--color-rose)'}">
              ${m.expiryValid ? '✓ PASS (Modulo 10)' : '❌ FORGERY DETECTED'}
            </div>
          </div>
          <div style="padding:0.5rem; background:rgba(2,6,23,0.4); border-radius:6px; border:1px solid #334155;">
            <div style="font-size:0.7rem; color:var(--text-muted);">Composite Overall Check</div>
            <div style="font-weight:bold; color:${m.compositeValid ? 'var(--color-emerald)' : 'var(--color-rose)'}">
              ${m.compositeValid ? '✓ 100% VALID' : '❌ COMPOSITE MISMATCH'}
            </div>
          </div>
        </div>
      `;
    }
  }

  function highlightMRZLine(line, isLine2Valid = true) {
    if (!line) return '';
    return line.split('').map((char, idx) => {
      // Highlight forged expiry check digit on line 2 (typically around pos 27-28)
      if (!isLine2Valid && idx === 27) {
        return `<span class="mrz-char-error" title="Forged Check Digit! Expected modulo checksum 2, got ${char}">${char}</span>`;
      }
      return `<span class="mrz-char-valid">${char}</span>`;
    }).join('');
  }

  // Verdict & Fraud Signals Dossier
  function renderVerdictDisplay() {
    const dialScore = document.getElementById('riskScoreValue');
    const dialCategory = document.getElementById('riskCategoryBadge');
    const signalsList = document.getElementById('fraudSignalsList');
    const recActionText = document.getElementById('recommendedActionText');

    if (!state.currentSpecimen) return;

    const spec = state.currentSpecimen;
    if (dialScore) {
      dialScore.textContent = `${spec.riskScore}%`;
      dialScore.style.color = spec.riskScore > 70 ? 'var(--color-rose)' : spec.riskScore > 40 ? 'var(--color-amber)' : 'var(--color-emerald)';
    }

    if (dialCategory) {
      const cls = spec.riskCategory === 'CRITICAL' ? 'badge-critical' 
                : spec.riskCategory === 'HIGH' ? 'badge-high' 
                : spec.riskCategory === 'MEDIUM' ? 'badge-medium' : 'badge-pass';
      dialCategory.className = `badge ${cls}`;
      dialCategory.textContent = `${spec.riskCategory} RISK DETECTED`;
    }

    if (recActionText) {
      recActionText.textContent = `RECOMMENDED DECISION: ${spec.recommendedAction}`;
      recActionText.style.color = spec.recommendedAction === 'REJECT' ? 'var(--color-rose)' : spec.recommendedAction === 'REVIEW' ? 'var(--color-amber)' : 'var(--color-emerald)';
    }

    if (signalsList) {
      if (spec.fraudSignals.length === 0) {
        signalsList.innerHTML = `
          <div style="padding:1.5rem; text-align:center; color:var(--color-emerald); background:rgba(16,185,129,0.06); border-radius:8px; border:1px solid rgba(16,185,129,0.3);">
            <div style="font-size:1.5rem; margin-bottom:0.25rem;">✓</div>
            <div style="font-weight:bold;">No Fraud Signals Detected</div>
            <div style="font-size:0.75rem; color:var(--text-muted); margin-top:0.25rem;">Document micro-patterns, security inks, and biometric embeddings passed full cryptographic validation.</div>
          </div>
        `;
      } else {
        signalsList.innerHTML = spec.fraudSignals.map(signal => `
          <div class="signal-item severity-${signal.severity.toLowerCase()}">
            <div class="signal-title">
              <span>${signal.title}</span>
              <span class="badge ${signal.severity === 'CRITICAL' ? 'badge-critical' : signal.severity === 'HIGH' ? 'badge-high' : 'badge-medium'}">${signal.severity}</span>
            </div>
            <div class="signal-desc">${signal.detail}</div>
          </div>
        `).join('');
      }
    }
  }

  // Automated 7-Stage Screening Animation
  function startScreeningPipeline() {
    if (state.isScanning) return;
    state.isScanning = true;

    const scanLine = document.getElementById('scannerLaserLine');
    if (scanLine) scanLine.classList.add('active');

    const steps = [
      { id: 'pipeStep1', name: 'Stage 1: Document Classification & Edge Rectification' },
      { id: 'pipeStep2', name: 'Stage 2: OCR Optical Character Extraction & MRZ Modulo Check' },
      { id: 'pipeStep3', name: 'Stage 3: Error Level Analysis (ELA) & Compression Splicing' },
      { id: 'pipeStep4', name: 'Stage 4: Microprint & Guilloche Waveform Consistency' },
      { id: 'pipeStep5', name: 'Stage 5: Biometric FaceNet-512 Vector Embedding' },
      { id: 'pipeStep6', name: 'Stage 6: 3D Depth & Presentation Attack (PAD) Liveness' },
      { id: 'pipeStep7', name: 'Stage 7: Global Sanctions & Fraud Risk Scoring Engine' }
    ];

    let currentStepIdx = 0;
    playCyberSound('scan');

    function advanceStep() {
      if (currentStepIdx < steps.length) {
        const step = steps[currentStepIdx];
        const el = document.getElementById(step.id);
        if (el) {
          el.className = 'pipeline-step running';
          el.innerHTML = `<span>${step.name}</span> <span class="mono" style="color:var(--color-cyan);">SCANNING...</span>`;
        }

        setTimeout(() => {
          if (el) {
            const hasError = state.currentSpecimen.riskScore > 50 && (currentStepIdx === 1 || currentStepIdx === 2 || currentStepIdx === 4 || currentStepIdx === 5);
            el.className = hasError ? 'pipeline-step failed' : 'pipeline-step success';
            el.innerHTML = `<span>${step.name}</span> <span class="mono" style="font-weight:bold; color:${hasError ? 'var(--color-rose)' : 'var(--color-emerald)'}">${hasError ? 'ANOMALY FLAGGED' : 'PASSED'}</span>`;
          }
          currentStepIdx++;
          playCyberSound('scan');
          advanceStep();
        }, 350);
      } else {
        // Complete
        state.isScanning = false;
        if (scanLine) scanLine.classList.remove('active');
        playCyberSound(state.currentSpecimen.riskScore > 60 ? 'alert' : 'success');
        showToast(`Screening complete. Final Verdict: ${state.currentSpecimen.recommendedAction}`, state.currentSpecimen.riskScore > 60 ? 'error' : 'success');
        
        // Add to adjudication queue
        recordScanInQueue(state.currentSpecimen);
      }
    }

    advanceStep();
  }

  // Adjudication Queue & Audit History
  function recordScanInQueue(spec) {
    const record = {
      id: `VERIF-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toLocaleTimeString(),
      document: spec.name,
      holder: spec.holderName,
      type: spec.docType,
      riskScore: spec.riskScore,
      status: spec.recommendedAction,
      analyst: state.user ? state.user.name : "System AI"
    };

    state.verificationQueue.unshift(record);
    renderQueueTable();

    // Persist to SQLite backend if online
    apiSaveRecord({
      id: record.id,
      timestamp: new Date().toISOString(),
      docName: spec.name,
      docType: spec.docType,
      holderName: spec.holderName,
      documentNumber: spec.documentNumber,
      riskScore: spec.riskScore,
      riskCategory: spec.riskCategory,
      decision: spec.recommendedAction,
      fraudSignals: spec.fraudSignals,
      analystName: record.analyst
    });
  }

  function renderQueueTable() {
    const tbody = document.getElementById('queueTableBody');
    if (!tbody) return;

    if (state.verificationQueue.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align:center; color:var(--text-muted); padding:2rem;">
            No documents screened in this session yet. Run screening above.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = state.verificationQueue.map(item => `
      <tr>
        <td class="mono" style="color:var(--color-cyan); font-weight:bold;">${item.id}</td>
        <td>${item.timestamp}</td>
        <td>
          <div style="font-weight:600;">${item.holder}</div>
          <div style="font-size:0.7rem; color:var(--text-muted);">${item.document}</div>
        </td>
        <td><span class="mono" style="font-size:0.75rem;">${item.type}</span></td>
        <td>
          <span class="mono" style="font-weight:bold; color:${item.riskScore > 70 ? 'var(--color-rose)' : item.riskScore > 40 ? 'var(--color-amber)' : 'var(--color-emerald)'}">
            ${item.riskScore}%
          </span>
        </td>
        <td>
          <span class="badge ${item.status === 'REJECT' ? 'badge-critical' : item.status === 'REVIEW' ? 'badge-medium' : 'badge-pass'}">
            ${item.status}
          </span>
        </td>
      </tr>
    `).join('');
  }

  // Interactive Magnifier Tool
  function setupMagnifier() {
    const stage = document.getElementById('docCanvasStage');
    const lens = document.getElementById('magnifierLens');
    if (!stage || !lens) return;

    stage.addEventListener('mousemove', (e) => {
      if (!state.zoomActive) return;
      const rect = stage.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
        lens.style.display = 'none';
        return;
      }

      lens.style.display = 'block';
      lens.style.left = `${x}px`;
      lens.style.top = `${y}px`;

      // Zoom effect background computation
      const zoomLevel = 2.8;
      lens.style.backgroundImage = 'radial-gradient(circle, rgba(56,189,248,0.15) 0%, transparent 70%)';
      lens.style.border = '2px solid #38bdf8';
    });

    stage.addEventListener('mouseleave', () => {
      lens.style.display = 'none';
    });
  }

  // Custom File Upload & Webcam Capture Handling
  function setupUploadAndWebcam() {
    const uploadInput = document.getElementById('docFileInput');
    const dropzone = document.getElementById('uploadDropzone');

    if (dropzone && uploadInput) {
      dropzone.addEventListener('click', () => uploadInput.click());

      dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
      });

      dropzone.addEventListener('dragleave', () => {
        dropzone.classList.remove('dragover');
      });

      dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          handleUploadedFile(e.dataTransfer.files[0]);
        }
      });

      uploadInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
          handleUploadedFile(e.target.files[0]);
        }
      });
    }

    // Camera Capture Modal
    const openCamBtn = document.getElementById('openCameraBtn');
    const camModal = document.getElementById('cameraModal');
    const closeCamBtn = document.getElementById('closeCamModalBtn');
    const captureSnapBtn = document.getElementById('captureSnapBtn');
    const video = document.getElementById('webcamVideo');

    if (openCamBtn && camModal && video) {
      openCamBtn.addEventListener('click', async () => {
        camModal.classList.add('active');
        try {
          state.webcamStream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
          video.srcObject = state.webcamStream;
        } catch (err) {
          showToast('Could not access webcam: ' + err.message, 'error');
          camModal.classList.remove('active');
        }
      });

      closeCamBtn.addEventListener('click', () => {
        if (state.webcamStream) {
          state.webcamStream.getTracks().forEach(t => t.stop());
          state.webcamStream = null;
        }
        camModal.classList.remove('active');
      });

      captureSnapBtn.addEventListener('click', () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');

        // Stop stream
        if (state.webcamStream) {
          state.webcamStream.getTracks().forEach(t => t.stop());
          state.webcamStream = null;
        }
        camModal.classList.remove('active');

        // Update custom probe selfie
        state.customSelfie = dataUrl;
        renderBiometricsDisplay();
        showToast('Live probe selfie captured successfully!', 'success');
      });
    }
  }

  function handleUploadedFile(file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const result = e.target.result;
      state.customDocument = `
        <div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; background:#020617;">
          <img src="${result}" style="max-width:100%; max-height:100%; object-fit:contain; border-radius:10px;"/>
        </div>
      `;

      // Mock AI detection on custom upload
      const customSpec = {
        id: `UPLOAD-${Date.now().toString().slice(-4)}`,
        name: `Uploaded Document: ${file.name}`,
        docType: "USER_CUSTOM_ID",
        holderName: "CUSTOM SUBJECT",
        nationality: "DETECTED REGION",
        documentNumber: "ID-" + Math.floor(10000000 + Math.random() * 90000000),
        dob: "1990-01-01",
        sex: "U",
        issueDate: "2020-01-01",
        expiryDate: "2030-01-01",
        riskCategory: "HIGH",
        riskScore: 68,
        recommendedAction: "REVIEW",
        fraudSignals: [
          { code: "CUSTOM_UPLOAD_HEURISTIC", title: "Manual Inspection Flagged", severity: "HIGH", detail: "File submitted via ad-hoc channel. Micro-security Guilloche vector analysis inconclusive." },
          { code: "METADATA_TIMESTAMP", title: "EXIF Editing Software Trace", severity: "MEDIUM", detail: "Metadata indicates Adobe Photoshop / GIMP re-encoding header detected." }
        ],
        mrz: {
          line1: "P<USACUSTOM<<SUBJECT<<<<<<<<<<<<<<<<<<<<<<<<",
          line2: "9988776654USA9001015U3001012<<<<<<<<<<<<<<02",
          docNumberValid: true,
          dobValid: true,
          expiryValid: true,
          compositeValid: true
        },
        biometrics: {
          similarity: 72.1,
          livenessScore: 65.4,
          deepfakeProbability: 38.0,
          verdict: "MANUAL_REVIEW_REQUIRED",
          details: "Biometric distance within acceptable margin, but requires manual forensic sign-off."
        },
        tamperZones: [
          { x: 30, y: 30, width: 40, height: 40, label: "Uploaded Image Forensic ROI", type: "WARNING" }
        ],
        generateDocumentSvg: () => state.customDocument,
        generateSelfieSvg: window.ID_SPECIMENS[0].generateSelfieSvg
      };

      state.currentSpecimen = customSpec;
      renderDocumentDisplay();
      renderBiometricsDisplay();
      renderMRZDisplay();
      renderVerdictDisplay();
      showToast(`Analyzed uploaded file: ${file.name}`, 'info');
    };
    reader.readAsDataURL(file);
  }

  // Export Forensic Dossier
  function exportAuditReport() {
    if (!state.currentSpecimen) return;
    const reportData = {
      reportId: `DOSSIER-${Date.now()}`,
      generatedAt: new Date().toISOString(),
      examiner: state.user ? state.user : { name: "System Investigator" },
      documentEvaluated: {
        id: state.currentSpecimen.id,
        name: state.currentSpecimen.name,
        type: state.currentSpecimen.docType,
        documentNumber: state.currentSpecimen.documentNumber,
        holderName: state.currentSpecimen.holderName
      },
      forensicAssessment: {
        compositeRiskScore: state.currentSpecimen.riskScore,
        category: state.currentSpecimen.riskCategory,
        finalAction: state.currentSpecimen.recommendedAction,
        detectedSignals: state.currentSpecimen.fraudSignals
      },
      mrzVerification: state.currentSpecimen.mrz,
      biometrics: state.currentSpecimen.biometrics,
      cryptographicSignature: {
        hashAlgorithm: "SHA-256",
        signatureDigest: "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
        complianceStandards: ["ICAO Doc 9303", "ISO/IEC 19794-5", "NIST FRVT", "FIDO2 / PAD Level 2"]
      }
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AURA_SHIELD_AUDIT_${state.currentSpecimen.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('Cryptographic forensic audit dossier exported!', 'success');
  }

  // Main UI Event Listeners
  function initEventListeners() {
    // Nav Tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        state.activeTab = tab.dataset.tab;

        // Tab Views Switching
        document.querySelectorAll('.tab-view-section').forEach(view => {
          view.style.display = view.id === `view-${state.activeTab}` ? 'block' : 'none';
        });

        playCyberSound('click');
      });
    });

    // Run Screening Pipeline Button
    document.getElementById('runScanBtn')?.addEventListener('click', startScreeningPipeline);

    // Filter Buttons (Normal, ELA, UV, Edge, Heatmap)
    document.querySelectorAll('.stage-mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        applyCanvasFilter(btn.dataset.filter);
        playCyberSound('click');
      });
    });

    // Magnifier Zoom Toggle
    const zoomBtn = document.getElementById('toggleZoomBtn');
    if (zoomBtn) {
      zoomBtn.addEventListener('click', () => {
        state.zoomActive = !state.zoomActive;
        zoomBtn.classList.toggle('active', state.zoomActive);
        zoomBtn.style.color = state.zoomActive ? 'var(--color-cyan)' : 'var(--text-muted)';
        showToast(state.zoomActive ? 'Magnifier Loupe Activated (Hover over document)' : 'Magnifier Deactivated', 'info');
      });
    }

    // Audio Mute Toggle
    const soundBtn = document.getElementById('toggleAudioBtn');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        state.soundEnabled = !state.soundEnabled;
        soundBtn.innerHTML = state.soundEnabled ? '🔊 Sound: ON' : '🔇 Sound: OFF';
        soundBtn.style.color = state.soundEnabled ? 'var(--color-cyan)' : 'var(--text-dim)';
      });
    }

    // Adjudication Decision Buttons (Approve, Review, SIU Escalate)
    document.getElementById('btnDecideApprove')?.addEventListener('click', () => {
      showToast('Status Override: Document Manually Approved by Officer', 'success');
      recordScanInQueue({ ...state.currentSpecimen, recommendedAction: 'MANUAL_APPROVED', riskScore: 5 });
    });

    document.getElementById('btnDecideReview')?.addEventListener('click', () => {
      showToast('Escalated: Flagged for Tier-2 Compliance In-Depth Review', 'info');
      recordScanInQueue({ ...state.currentSpecimen, recommendedAction: 'FLAGGED_REVIEW', riskScore: 50 });
    });

    document.getElementById('btnDecideReject')?.addEventListener('click', () => {
      showToast('Critical Action: Document Rejected & Fraud Profile Logged to SIU', 'error');
      recordScanInQueue({ ...state.currentSpecimen, recommendedAction: 'REJECTED_SIU', riskScore: 99 });
    });

    // Dossier Export & Print Buttons
    document.getElementById('exportJsonReportBtn')?.addEventListener('click', exportAuditReport);
    document.getElementById('printDossierBtn')?.addEventListener('click', () => window.print());

    // Auth Switcher Tabs in Modal
    document.getElementById('tabAuthSignin')?.addEventListener('click', () => setAuthTab('signin'));
    document.getElementById('tabAuthSignup')?.addEventListener('click', () => setAuthTab('signup'));
    document.getElementById('closeAuthModalBtn')?.addEventListener('click', closeAuthModal);

    // Demo Quick-Login Buttons
    document.querySelectorAll('.demo-login-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const role = btn.dataset.demoRole;
        if (DEMO_USERS[role]) {
          loginUser(DEMO_USERS[role]);
        }
      });
    });

    // Sign In Form Submission
    document.getElementById('signinForm')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('signinEmail').value;
      const pass = document.getElementById('signinPass').value;

      const serverUser = await apiSignIn(email, pass);
      if (serverUser) {
        loginUser(serverUser);
      } else {
        // Fallback local login
        const user = {
          name: email.split('@')[0].toUpperCase(),
          email: email,
          role: "Senior Forensic Officer",
          agency: "Cyber Defense Group",
          clearance: "LEVEL-3 STANDARD"
        };
        loginUser(user);
      }
    });

    // Sign Up Form Submission
    document.getElementById('signupForm')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('signupName').value;
      const email = document.getElementById('signupEmail').value;
      const org = document.getElementById('signupOrg').value;
      const role = document.getElementById('signupRole').value;
      const pass = document.getElementById('signupPass').value;

      const userData = { name, email, role, agency: org };
      const serverUser = await apiSignUp(userData, pass);
      if (serverUser) {
        loginUser(serverUser);
      } else {
        // Fallback local registration
        loginUser({
          ...userData,
          clearance: "NEWLY ENROLLED ANALYST"
        });
      }
    });

    // Password strength check
    const signupPass = document.getElementById('signupPass');
    const meterFill = document.getElementById('passStrengthBar');
    if (signupPass && meterFill) {
      signupPass.addEventListener('input', (e) => {
        const val = e.target.value;
        let score = 0;
        if (val.length >= 8) score += 25;
        if (/[A-Z]/.test(val)) score += 25;
        if (/[0-9]/.test(val)) score += 25;
        if (/[^A-Za-z0-9]/.test(val)) score += 25;

        meterFill.style.width = `${score}%`;
        meterFill.style.backgroundColor = score < 50 ? '#f43f5e' : score < 75 ? '#f59e0b' : '#10b981';
      });
    }

    // Modal click outside to close
    document.getElementById('authModal')?.addEventListener('click', (e) => {
      if (e.target.id === 'authModal') closeAuthModal();
    });
  }

  // Application Entry Point
  window.addEventListener('DOMContentLoaded', () => {
    initEventListeners();
    initSpecimens();
    setupMagnifier();
    setupUploadAndWebcam();
    checkAuth();
    renderQueueTable();
  });

})();
