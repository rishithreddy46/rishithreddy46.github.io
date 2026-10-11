/**
 * DEVPORTFOLIO & TERMINAL HYBRID ENGINE
 * Fast, lightweight interactive logic for Chiluka Rishith Reddy
 */

document.addEventListener('DOMContentLoaded', () => {
  initTypewriter();
  initTerminal();
  initProjectFilter();
  initCaseModals();
  initResumeModal();
  initContactForm();
  initMobileNav();
});

// ==========================================================================
// 1. TYPEWRITER EFFECT
// ==========================================================================
function initTypewriter() {
  const el = document.getElementById('typing-text');
  if (!el) return;

  const roles = [
    'Embedded Systems Innovator',
    'STM32 Firmware Developer',
    'Full-Stack Software Developer',
    'SP-GNN ML Researcher',
    'Signal Processing & DAQ Specialist'
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;

  function tick() {
    const current = roles[roleIdx];
    if (isDeleting) {
      el.textContent = current.substring(0, charIdx - 1);
      charIdx--;
    } else {
      el.textContent = current.substring(0, charIdx + 1);
      charIdx++;
    }

    let delay = isDeleting ? 30 : 65;

    if (!isDeleting && charIdx === current.length) {
      delay = 1800;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      delay = 350;
    }

    setTimeout(tick, delay);
  }
  tick();
}

// ==========================================================================
// 2. INTERACTIVE TERMINAL
// ==========================================================================
function initTerminal() {
  const input = document.getElementById('term-input');
  const output = document.getElementById('term-out');
  const quickBtns = document.querySelectorAll('.quick-cmd-btn');
  if (!input || !output) return;

  const history = [];
  let histIdx = -1;

  const COMMANDS = {
    help: `Available commands:
  - <b style="color:var(--accent-cyan);">about</b>       : Academic status, discipline &amp; career vision
  - <b style="color:var(--accent-cyan);">skills</b>      : Technical competencies &amp; engineering toolset
  - <b style="color:var(--accent-cyan);">projects</b>    : 4 flagship engineering case studies
  - <b style="color:var(--accent-cyan);">stm32</b>       : STM32 PPG Atrial Fibrillation detection pipeline
  - <b style="color:var(--accent-cyan);">spgnn</b>       : ICAMSTA-2025 Physics-GNN research (0.028 error)
  - <b style="color:var(--accent-cyan);">patent</b>      : 1st Prize Patent Summit automotive safety system
  - <b style="color:var(--accent-cyan);">research</b>    : Osmania University ICAMSTA-2025 conference paper
  - <b style="color:var(--accent-cyan);">resume</b>      : Launch Curriculum Vitae viewer
  - <b style="color:var(--accent-cyan);">contact</b>     : Direct phone, email &amp; LinkedIn coordinates
  - <b style="color:var(--accent-cyan);">clear</b>       : Clear console buffer`,

    about: `<b style="color:#fff;">Chiluka Rishith Reddy</b>
• Discipline: B.Tech in Electronics &amp; Instrumentation Engineering (EIE)
• Institution: VNR Vignana Jyothi Institute of Engineering &amp; Technology (VNR VJIET)
• Status: Pursuing 7th Semester &bull; CGPA: 7.52 &bull; Batch 2023–2027
• Objective: Seeking to apply knowledge of sensors, data acquisition, electronics, and signal processing to support efficient industrial operations, equipment monitoring, process reliability, and continuous improvement.`,

    skills: `================== SKILLS MATRIX ==================
<b style="color:var(--accent-green);">[Embedded Systems]</b>    : STM32, Arduino, ESP32, Microcontrollers, GPIO, ADC, DMA
<b style="color:var(--accent-cyan);">[Instrumentation]</b>     : Sensors, Sensor Interfacing, Data Acquisition (DAQ), Signal Conditioning
<b style="color:var(--accent-purple);">[Control &amp; Signals]</b>   : Control Systems, Digital Filtering, FFT, HR/HRV Analysis
<b style="color:var(--accent-blue);">[Programming]</b>         : C, Embedded C, Python (NPTEL Elite Certification)
<b style="color:var(--accent-amber);">[Electronics]</b>         : Analog &amp; Digital Circuits, Circuit Fundamentals, Op-Amps
<b style="color:var(--accent-cyan);">[Engineering Tools]</b>   : MATLAB, LabVIEW, STM32CubeIDE, Arduino IDE, Git`,

    projects: `================ CASE STUDIES ================
1. <b style="color:var(--accent-cyan);">PPG-Based AF Detection on STM32</b> (Edge Signal Processing &amp; Arrhythmia Classification)
2. <b style="color:var(--accent-purple);">Hybrid SP-GNN Sensor Fault Detector</b> (ICAMSTA-2025 Paper, 0.028 Recon Error)
3. <b style="color:var(--accent-green);">Embedded EV Monitoring System</b> (Arduino DAQ, Real-Time Telemetry Dashboard)
4. <b style="color:var(--accent-amber);">Passive Alcohol Detection System</b> (1st Prize Winner, Patent Summit Competition)`,

    stm32: `<b style="color:var(--accent-cyan);">PPG-Based AF Detection on STM32 — Inter-Patient Validation</b>
• Target: ARM Cortex-M (STM32) via STM32CubeIDE
• Pipeline: Optical PPG DAQ &rarr; DMA Buffer &rarr; 0.5–5 Hz Digital Bandpass &rarr; Peak Detection &rarr; HR/HRV Analysis
• Validation: Patient-disjoint validation for generalisation to unseen subjects.`,

    spgnn: `<b style="color:var(--accent-purple);">SP-GNN Sensor Fault Detection &amp; Uncertainty Quantification</b>
• Dataset: Intel Berkeley Research Lab (54 sensors, ~2.3 Million readings)
• Formulation: PyTorch Geometric + Statistical Physics Diffusion Message Passing
• Results: Mean reconstruction error: <b style="color:var(--accent-green);">0.028</b> (Standard GCN: 0.072, Physics-GNN: 0.049)
• Paper: Presented at ICAMSTA-2025, Osmania University.`,

    patent: `<b style="color:var(--accent-amber);">Patent Summit Competition — 1st Prize Winner</b>
• Title: Passive Alcohol Detection System for Vehicle Safety
• Host: National Workshop on Patent Analytics and Filing Framework, VNR VJIET
• Mechanism: Non-intrusive ambient gas sensing array + ignition interlock logic.`,

    research: `<b style="color:var(--accent-purple);">ICAMSTA-2025 International Conference Presentation</b>
Presented: "Hybrid Statistical Physics-Informed Graph Neural Network (SP-GNN) for Robust Fault Detection and Uncertainty Quantification in Distributed Sensor Systems"
Venue: Osmania University, Hyderabad.`,

    resume: `Opening Curriculum Vitae modal viewer...`,

    contact: `<b style="color:#fff;">Direct Communication Channels:</b>
• Email   : <a href="mailto:rishithreddyc45@gmail.com" style="color:var(--accent-cyan);">rishithreddyc45@gmail.com</a>
• Phone   : <a href="tel:+919494105486" style="color:var(--accent-amber);">+91 9494105486</a>
• GitHub  : <a href="https://github.com/rishithreddy46/" target="_blank" style="color:var(--accent-cyan);">github.com/rishithreddy46</a>
• LinkedIn: <a href="https://www.linkedin.com/in/rishith-reddy-9aa6902a0/" target="_blank" style="color:var(--accent-purple);">linkedin.com/in/rishith-reddy-9aa6902a0</a>
• Location: Hyderabad, Telangana, India (Open to Relocation)`
  };

  function exec(cmd) {
    const raw = cmd.trim();
    const clean = raw.toLowerCase();
    if (!clean) return;

    history.push(raw);
    histIdx = history.length;

    const line = document.createElement('div');
    line.className = 'term-out-line';
    line.innerHTML = `<span class="term-prompt-green">rishith@telemetry:~$</span> ${escapeHTML(raw)}`;
    output.appendChild(line);

    if (clean === 'clear') {
      output.innerHTML = '';
      return;
    }

    if (clean === 'resume') {
      const modal = document.getElementById('modal-resume');
      if (modal) modal.classList.add('active');
    }

    const res = COMMANDS[clean];
    const outDiv = document.createElement('div');
    outDiv.className = 'term-out-line';

    if (res) {
      outDiv.innerHTML = res.replace(/\n/g, '<br>');
    } else {
      outDiv.innerHTML = `<span style="color:#ef4444;">command not found: ${escapeHTML(clean)}.</span> Type <b style="color:var(--accent-amber);">help</b> for commands.`;
    }

    output.appendChild(outDiv);
    output.scrollTop = output.scrollHeight;
  }

  function escapeHTML(s) {
    return s.replace(/[&<>'"]/g, 
      t => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[t] || t)
    );
  }

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = input.value;
      input.value = '';
      exec(val);
    } else if (e.key === 'ArrowUp') {
      if (histIdx > 0) {
        histIdx--;
        input.value = history[histIdx];
      }
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      if (histIdx < history.length - 1) {
        histIdx++;
        input.value = history[histIdx];
      } else {
        histIdx = history.length;
        input.value = '';
      }
      e.preventDefault();
    }
  });

  quickBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      exec(btn.getAttribute('data-cmd'));
    });
  });
}

// ==========================================================================
// 3. PROJECT FILTERING
// ==========================================================================
function initProjectFilter() {
  const chips = document.querySelectorAll('.filter-chip');
  const cards = document.querySelectorAll('.project-card');

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const filter = chip.getAttribute('data-filter');

      cards.forEach(card => {
        const cat = card.getAttribute('data-category') || '';
        if (filter === 'all' || cat.includes(filter)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// ==========================================================================
// 4. CASE STUDY MODAL
// ==========================================================================
function initCaseModals() {
  const modal = document.getElementById('modal-case');
  const title = document.getElementById('modal-case-title');
  const body = document.getElementById('modal-case-body');
  const closeBtn = document.getElementById('btn-close-case');

  const DATA = {
    'stm32-af': {
      title: 'PPG-Based Atrial Fibrillation (AF) Detection on STM32',
      html: `
        <h4 style="color:var(--accent-cyan); margin-bottom:8px;">1. Engineering Challenge</h4>
        <p style="color:var(--text-muted); font-size:14px; margin-bottom:16px;">
          Traditional clinical Holter monitoring is invasive, while cloud-reliant wearables introduce network latency and battery depletion. Edge-based inference on microcontrollers faces severe memory constraints and morphological variance across unseen patients.
        </p>

        <h4 style="color:var(--accent-cyan); margin-bottom:8px;">2. Firmware &amp; DSP Architecture</h4>
        <div style="background:#090d16; border:1px solid var(--border-subtle); border-radius:8px; padding:12px; font-family:var(--font-mono); font-size:13px; margin-bottom:16px;">
          • <strong>Optical PPG DAQ</strong>: Continuous 100 Hz sampling into DMA ring buffer.<br>
          • <strong>Bandpass Filter (0.5 – 5.0 Hz)</strong>: 2nd-order section IIR filter to eliminate baseline wander and high-frequency motion artifacts.<br>
          • <strong>Peak Detection &amp; HRV</strong>: Real-time R-peak identification, computing RMSSD and SDNN metrics.<br>
          • <strong>Patient-Disjoint Validation</strong>: Trained across strict patient splits to guarantee generalisation on unseen subjects.
        </div>

        <h4 style="color:var(--accent-cyan); margin-bottom:8px;">3. Embedded C Implementation Snippet</h4>
        <pre class="code-block"><code>// STM32 ADC DMA Buffer &amp; IIR Filter Section
#define FS 100
float iir_filter(float raw) {
    static float x[3] = {0}, y[3] = {0};
    x[0] = raw;
    y[0] = 0.1245f*(x[0] - x[2]) - (-1.654f*y[1] + 0.751f*y[2]);
    x[2] = x[1]; x[1] = x[0];
    y[2] = y[1]; y[1] = y[0];
    return y[0];
}</code></pre>
      `
    },

    'sp-gnn': {
      title: 'Hybrid Statistical Physics-Informed Graph Neural Network (SP-GNN)',
      html: `
        <h4 style="color:var(--accent-purple); margin-bottom:8px;">1. Problem Formulation</h4>
        <p style="color:var(--text-muted); font-size:14px; margin-bottom:16px;">
          Industrial sensor networks face harsh operational environments leading to sensor drift and erratic readings. Standard Graph Convolutional Networks ignore physical diffusion constraints and fail to quantify uncertainty in anomalous sensor readings.
        </p>

        <h4 style="color:var(--accent-purple); margin-bottom:8px;">2. Physical Modeling &amp; Architecture</h4>
        <div style="background:#090d16; border:1px solid var(--border-subtle); border-radius:8px; padding:12px; font-family:var(--font-mono); font-size:13px; margin-bottom:16px;">
          • <strong>Graph Construction</strong>: 54 distributed sensors modeled as an adjacency graph with distance weights.<br>
          • <strong>Physics Message-Passing</strong>: Constrained by thermodynamic and physical diffusion laws.<br>
          • <strong>Dataset Scale</strong>: Evaluated on ~2.3 Million readings from the Intel Berkeley Research Lab dataset.<br>
          • <strong>Uncertainty Quantification</strong>: Propagates Bayesian variance across graph edges.
        </div>

        <h4 style="color:var(--accent-purple); margin-bottom:8px;">3. Comparative Performance Benchmark</h4>
        <table style="width:100%; border-collapse:collapse; margin-bottom:16px; font-family:var(--font-mono); font-size:13px;">
          <tr style="border-bottom:1px solid var(--border-subtle); color:var(--accent-cyan);">
            <th style="text-align:left; padding:6px 0;">Model</th>
            <th style="text-align:left; padding:6px 0;">Mean Reconstruction Error</th>
            <th style="text-align:left; padding:6px 0;">Improvement</th>
          </tr>
          <tr>
            <td style="padding:6px 0;">Standard GCN</td>
            <td style="padding:6px 0; color:#ef4444;">0.072</td>
            <td style="padding:6px 0;">Baseline</td>
          </tr>
          <tr>
            <td style="padding:6px 0;">Physics-GNN</td>
            <td style="padding:6px 0; color:var(--accent-amber);">0.049</td>
            <td style="padding:6px 0;">+31.9%</td>
          </tr>
          <tr style="color:var(--accent-green); font-weight:700;">
            <td style="padding:6px 0;">SP-GNN (Ours)</td>
            <td style="padding:6px 0;">0.028</td>
            <td style="padding:6px 0;">+61.1% vs GCN</td>
          </tr>
        </table>
        <p style="font-size:13px; color:var(--accent-purple);">Peer-reviewed &amp; presented at ICAMSTA-2025, Osmania University.</p>
      `
    },

    'ev-monitor': {
      title: 'Embedded EV Monitoring System using Arduino',
      html: `
        <h4 style="color:var(--accent-green); margin-bottom:8px;">1. System Objectives</h4>
        <p style="color:var(--text-muted); font-size:14px; margin-bottom:16px;">
          Real-time acquisition and monitoring of key EV operational metrics—battery pack voltage, current load, thermal slope, and vehicle speed—to provide dynamic driving range estimation.
        </p>

        <h4 style="color:var(--accent-green); margin-bottom:8px;">2. Hardware &amp; Telemetry Pipeline</h4>
        <div style="background:#090d16; border:1px solid var(--border-subtle); border-radius:8px; padding:12px; font-family:var(--font-mono); font-size:13px; margin-bottom:16px;">
          • <strong>Multi-Channel DAQ</strong>: Voltage divider network, current shunt sensor, and thermal thermistors.<br>
          • <strong>Speed Odometry</strong>: Magnetic hall sensor interfaced via MCU external interrupts.<br>
          • <strong>Serial Protocol</strong>: Calibrated UART telemetry transmitted to software dashboard.<br>
          • <strong>State of Charge (SOC)</strong>: Real-time calculation feeding dynamic driving range estimation.
        </div>
      `
    },

    'alcohol-patent': {
      title: 'Passive Alcohol Detection System for Vehicle Safety',
      html: `
        <h4 style="color:var(--accent-amber); margin-bottom:8px;">1. Patent Summit 1st Prize Award</h4>
        <p style="color:var(--text-muted); font-size:14px; margin-bottom:16px;">
          Awarded <strong>1st Prize</strong> at the <em>Patent Summit Competition: National Workshop on Patent Analytics and Filing Framework</em>, held at VNR VJIET.
        </p>

        <h4 style="color:var(--accent-amber); margin-bottom:8px;">2. Innovation Architecture</h4>
        <div style="background:#090d16; border:1px solid var(--border-subtle); border-radius:8px; padding:12px; font-family:var(--font-mono); font-size:13px; margin-bottom:16px;">
          • <strong>Passive Sampling</strong>: Non-intrusive sensor array situated in the steering column and cabin air stream.<br>
          • <strong>Automatic Interlock</strong>: Triggered without requiring the driver to actively blow into a tube.<br>
          • <strong>Starter Relay Cutoff</strong>: Prevents ignition start if ethanol levels exceed calibrated legal thresholds.
        </div>
      `
    }
  };

  const openBtns = document.querySelectorAll('.btn-open-modal');
  openBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-modal');
      const item = DATA[key];
      if (!item) return;

      title.textContent = item.title;
      body.innerHTML = item.html;
      modal.classList.add('active');
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  }
}

// ==========================================================================
// 5. RESUME MODAL
// ==========================================================================
function initResumeModal() {
  const modal = document.getElementById('modal-resume');
  const topBtn = document.getElementById('btn-top-resume');
  const heroBtn = document.getElementById('btn-hero-resume');
  const closeBtn = document.getElementById('btn-close-resume');

  function open() { if (modal) modal.classList.add('active'); }
  function close() { if (modal) modal.classList.remove('active'); }

  if (topBtn) topBtn.addEventListener('click', open);
  if (heroBtn) heroBtn.addEventListener('click', open);
  if (closeBtn) closeBtn.addEventListener('click', close);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) close();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      close();
      const caseModal = document.getElementById('modal-case');
      if (caseModal) caseModal.classList.remove('active');
    }
  });
}

// ==========================================================================
// 6. CONTACT FORM
// ==========================================================================
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('form-name').value;
    const email = document.getElementById('form-email').value;
    const msg = document.getElementById('form-msg').value;

    const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
    const body = encodeURIComponent(`Hi Rishith,\n\n${msg}\n\nFrom: ${name} (${email})`);

    window.location.href = `mailto:rishithreddyc45@gmail.com?subject=${subject}&body=${body}`;
    alert(`Thank you, ${name}! Your default email client will open with a pre-filled dispatch.`);
    form.reset();
  });
}

// ==========================================================================
// 7. MOBILE NAVIGATION
// ==========================================================================
function initMobileNav() {
  const btn = document.getElementById('btn-mobile-toggle');
  const menu = document.getElementById('nav-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    menu.classList.toggle('show');
  });

  const links = menu.querySelectorAll('a');
  links.forEach(l => {
    l.addEventListener('click', () => {
      menu.classList.remove('show');
    });
  });
}
