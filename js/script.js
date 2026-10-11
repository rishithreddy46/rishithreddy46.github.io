/**
 * CHILUKA RISHITH REDDY - PORTFOLIO INTERACTIVE APPLICATION ENGINE
 * Features:
 * - Oscilloscope DSP Signal Lab (Simulated PPG with Live Bandpass Filter & AF Injection)
 * - RishithOS Telemetry CLI Terminal Emulator with History & Rich Commands
 * - Case Study Deep-Dive Modal with Full Architecture & Firmware Snippets
 * - Dynamic Role Typewriter
 * - Constellation Particles Canvas
 * - Project & Skill Category Filtering
 * - Interactive Resume PDF Viewer
 */

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initCustomCursor();
  initParticleCanvas();
  initRoleTyping();
  initOscilloscopeSignalLab();
  initTerminalEngine();
  initProjectFiltering();
  initSkillTabs();
  initCaseStudyModals();
  initResumeModal();
  initContactForm();
  initMobileMenu();
});

// ==========================================================================
// 1. PRELOADER
// ==========================================================================
function initPreloader() {
  const preloader = document.getElementById('preloader');
  const progressBar = document.getElementById('preloader-progress');
  const statusText = document.getElementById('preloader-status');

  let width = 0;
  const interval = setInterval(() => {
    width += Math.floor(Math.random() * 15) + 10;
    if (width > 100) width = 100;
    
    if (progressBar) progressBar.style.width = width + '%';
    if (statusText) statusText.textContent = `INITIALIZING TELEMETRY ENGINE... ${width}%`;

    if (width >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        if (preloader) preloader.classList.add('hidden');
      }, 300);
    }
  }, 35);
}

// ==========================================================================
// 2. MAGNETIC CUSTOM CURSOR
// ==========================================================================
function initCustomCursor() {
  const cursorDot = document.getElementById('cursor-dot');
  const cursorOutline = document.getElementById('cursor-outline');
  if (!cursorDot || !cursorOutline) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let outlineX = mouseX;
  let outlineY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
  });

  function renderCursor() {
    outlineX += (mouseX - outlineX) * 0.18;
    outlineY += (mouseY - outlineY) * 0.18;
    cursorOutline.style.transform = `translate3d(${outlineX - 16}px, ${outlineY - 16}px, 0)`;
    requestAnimationFrame(renderCursor);
  }
  renderCursor();

  // Hover expansion on interactive elements
  const interactives = document.querySelectorAll('a, button, input, textarea, .case-study-card, .skill-chip-item');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorOutline.style.width = '48px';
      cursorOutline.style.height = '48px';
      cursorOutline.style.borderColor = 'rgba(0, 240, 255, 0.8)';
    });
    el.addEventListener('mouseleave', () => {
      cursorOutline.style.width = '32px';
      cursorOutline.style.height = '32px';
      cursorOutline.style.borderColor = 'rgba(0, 240, 255, 0.45)';
    });
  });
}

// ==========================================================================
// 3. BACKGROUND CONSTELLATION CANVAS
// ==========================================================================
function initParticleCanvas() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particleCount = Math.min(Math.floor((width * height) / 18000), 75);
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 1.6 + 0.8,
      alpha: Math.random() * 0.5 + 0.2
    });
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 240, 255, ${p.alpha})`;
      ctx.fill();

      // Draw faint connections
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(0, 240, 255, ${(1 - dist / 110) * 0.12})`;
          ctx.lineWidth = 0.75;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
}

// ==========================================================================
// 4. DYNAMIC ROLE TYPEWRITER
// ==========================================================================
function initRoleTyping() {
  const typedEl = document.getElementById('typed-role-text');
  if (!typedEl) return;

  const roles = [
    'Embedded Systems Innovator',
    'STM32 Firmware Engineer',
    'Full-Stack Software Developer',
    'SP-GNN Machine Learning Researcher',
    'Signal Processing & DAQ Specialist'
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typeSpeed = 70;

  function typeTick() {
    const current = roles[roleIdx];
    if (isDeleting) {
      typedEl.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      typeSpeed = 35;
    } else {
      typedEl.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      typeSpeed = 65;
    }

    if (!isDeleting && charIdx === current.length) {
      typeSpeed = 2200; // Pause at full word
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      typeSpeed = 400;
    }

    setTimeout(typeTick, typeSpeed);
  }
  typeTick();
}

// ==========================================================================
// 5. LIVE OSCILLOSCOPE DSP TELEMETRY LAB
// ==========================================================================
function initOscilloscopeSignalLab() {
  const canvas = document.getElementById('oscilloscope-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = canvas.parentElement.clientWidth);
  let height = (canvas.height = canvas.parentElement.clientHeight);

  window.addEventListener('resize', () => {
    if (!canvas.parentElement) return;
    width = canvas.width = canvas.parentElement.clientWidth;
    height = canvas.height = canvas.parentElement.clientHeight;
  });

  let mode = 'filtered'; // 'filtered' | 'raw' | 'arrhythmia'
  let time = 0;
  const buffer = new Array(width).fill(height / 2);

  // Mode buttons
  const modeBtns = document.querySelectorAll('.scope-mode-btn');
  const hrValEl = document.getElementById('scope-hr-val');
  const hrvValEl = document.getElementById('scope-hrv-val');
  const rhythmValEl = document.getElementById('scope-rhythm-val');

  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      mode = btn.getAttribute('data-mode');

      if (mode === 'filtered') {
        if (hrValEl) hrValEl.textContent = '74 BPM';
        if (hrvValEl) hrvValEl.textContent = '38 ms';
        if (rhythmValEl) {
          rhythmValEl.textContent = 'NORMAL SINUS';
          rhythmValEl.className = 'emerald';
        }
      } else if (mode === 'raw') {
        if (hrValEl) hrValEl.textContent = '74 BPM';
        if (hrvValEl) hrvValEl.textContent = '44 ms (Noisy)';
        if (rhythmValEl) {
          rhythmValEl.textContent = 'RAW DAQ (+50Hz)';
          rhythmValEl.className = 'cyan';
        }
      } else if (mode === 'arrhythmia') {
        if (hrValEl) hrValEl.textContent = '118 BPM (Irregular)';
        if (hrvValEl) hrvValEl.textContent = '89 ms (High)';
        if (rhythmValEl) {
          rhythmValEl.textContent = 'ATRIAL FIBRILLATION DETECTED';
          rhythmValEl.className = '';
          rhythmValEl.style.color = 'var(--rose)';
        }
      }
    });
  });

  function getPPGSample(t, currentMode) {
    // Fundamental cardiac cycle frequency: normal ~ 1.2 Hz (72 bpm), AF ~ 1.9 Hz (114 bpm)
    let freq = currentMode === 'arrhythmia' ? 1.95 : 1.22;
    let phase = (t * freq * Math.PI * 2) % (Math.PI * 2);

    // Synthetic PPG waveform equation (systolic wave + dicrotic notch)
    let systolic = Math.exp(-Math.pow(phase - 1.2, 2) / 0.15) * 55;
    let dicrotic = (currentMode === 'arrhythmia') ? 0 : Math.exp(-Math.pow(phase - 2.4, 2) / 0.35) * 22;
    let cleanVal = systolic + dicrotic;

    if (currentMode === 'raw') {
      // Add 50Hz electrical mains noise + baseline respiratory drift
      let mainsNoise = Math.sin(t * 50 * Math.PI * 2) * 9;
      let respDrift = Math.sin(t * 0.25 * Math.PI * 2) * 18;
      let highFreqJitter = (Math.random() - 0.5) * 7;
      return cleanVal + mainsNoise + respDrift + highFreqJitter;
    } else if (currentMode === 'arrhythmia') {
      // Add irregular amplitude fluctuations
      let irregularity = Math.sin(t * 3.4) * 14 + (Math.random() - 0.5) * 8;
      return cleanVal + irregularity;
    }

    return cleanVal;
  }

  function renderScope() {
    time += 0.016;

    // Shift buffer
    buffer.shift();
    const sample = getPPGSample(time, mode);
    const yCoord = (height / 2) - sample;
    buffer.push(yCoord);

    // Draw grid background
    ctx.fillStyle = '#05080f';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = 'rgba(0, 240, 255, 0.07)';
    ctx.lineWidth = 1;
    const gridStep = 30;
    for (let x = 0; x < width; x += gridStep) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridStep) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw center baseline
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw PPG Waveform
    ctx.beginPath();
    ctx.moveTo(0, buffer[0]);
    for (let i = 1; i < buffer.length; i++) {
      ctx.lineTo(i, buffer[i]);
    }

    if (mode === 'arrhythmia') {
      ctx.strokeStyle = '#f43f5e';
      ctx.shadowColor = '#f43f5e';
    } else if (mode === 'raw') {
      ctx.strokeStyle = '#00f0ff';
      ctx.shadowColor = '#00f0ff';
    } else {
      ctx.strokeStyle = '#10b981';
      ctx.shadowColor = '#10b981';
    }

    ctx.lineWidth = 2.2;
    ctx.shadowBlur = 10;
    ctx.stroke();
    ctx.shadowBlur = 0;

    requestAnimationFrame(renderScope);
  }
  renderScope();
}

// ==========================================================================
// 6. RISHITHOS TELEMETRY CLI TERMINAL
// ==========================================================================
function initTerminalEngine() {
  const input = document.getElementById('terminal-input');
  const output = document.getElementById('terminal-output');
  const chips = document.querySelectorAll('.term-chip-btn');
  if (!input || !output) return;

  const history = [];
  let histIdx = -1;

  const COMMANDS = {
    help: `Available commands:
  - <b style="color:var(--cyan);">about</b>       : Academic status, EIE discipline &amp; career vision
  - <b style="color:var(--cyan);">skills</b>      : Summary of embedded, instrumentation, control &amp; coding tools
  - <b style="color:var(--cyan);">projects</b>    : List of 4 flagship engineering case studies
  - <b style="color:var(--cyan);">stm32</b>       : Deep dive into STM32 PPG Atrial Fibrillation Detection
  - <b style="color:var(--cyan);">spgnn</b>       : Deep dive into ICAMSTA-2025 Physics-GNN research (0.028 error)
  - <b style="color:var(--cyan);">ev</b>          : Arduino EV telemetry acquisition architecture
  - <b style="color:var(--cyan);">patent</b>      : 1st Prize Patent Summit automotive safety system
  - <b style="color:var(--cyan);">research</b>    : Osmania University ICAMSTA-2025 conference paper
  - <b style="color:var(--cyan);">resume</b>      : Launch interactive resume PDF viewer
  - <b style="color:var(--cyan);">contact</b>     : Direct communication coordinates
  - <b style="color:var(--cyan);">clear</b>       : Clear terminal window buffer`,

    about: `<b style="color:var(--text-highlight);">Chiluka Rishith Reddy</b>
Discipline: B.Tech in Electronics &amp; Instrumentation Engineering (EIE)
Institution: VNR Vignana Jyothi Institute of Engineering &amp; Technology (VNR VJIET)
Status: Pursuing 7th Semester &bull; CGPA: 7.52 &bull; Batch 2023–2027
Objective: Seeking to apply knowledge of sensors, data acquisition, electronics, and signal processing to support efficient industrial operations, equipment monitoring, process reliability, and continuous improvement.`,

    skills: `================== SKILLS MATRIX ==================
<b style="color:var(--emerald);">[Embedded Systems]</b>    : STM32, Arduino, ESP32, Microcontrollers, GPIO, ADC, DMA
<b style="color:var(--cyan);">[Instrumentation]</b>     : Sensors, Sensor Interfacing, Data Acquisition (DAQ), Signal Conditioning
<b style="color:var(--purple);">[Control &amp; Signals]</b>   : Control Systems, Digital Filtering, FFT, HR/HRV Analysis
<b style="color:var(--blue);">[Programming]</b>         : C, Embedded C, Python (NPTEL Elite Certification)
<b style="color:var(--gold);">[Electronics]</b>         : Analog &amp; Digital Circuits, Op-Amps, Circuit Fundamentals
<b style="color:var(--cyan);">[Engineering Tools]</b>   : MATLAB, LabVIEW, STM32CubeIDE, Arduino IDE, Git`,

    projects: `================ CASE STUDIES ================
1. <b style="color:var(--cyan);">PPG-Based AF Detection on STM32</b> (Edge Signal Processing &amp; Arrhythmia Classification)
2. <b style="color:var(--purple);">Hybrid SP-GNN Sensor Fault Detector</b> (ICAMSTA-2025 Paper, 0.028 Recon Error)
3. <b style="color:var(--emerald);">Embedded EV Monitoring System</b> (Arduino DAQ, Real-Time Telemetry Dashboard)
4. <b style="color:var(--gold);">Passive Alcohol Detection System</b> (1st Prize Winner, Patent Summit Competition)`,

    stm32: `<b style="color:var(--cyan);">PPG-Based AF Detection on STM32 — Inter-Patient Validation</b>
&bull; Target: ARM Cortex-M (STM32) via STM32CubeIDE
&bull; Pipeline: Optical PPG DAQ &rarr; DMA Buffer &rarr; 0.5–5 Hz Digital Bandpass &rarr; Peak Detection &rarr; HR/HRV Analysis
&bull; Highlight: Inter-patient disjoint validation for robust generalization to unseen subjects.`,

    spgnn: `<b style="color:var(--purple);">SP-GNN Sensor Fault Detection &amp; Uncertainty Quantification</b>
&bull; Dataset: Intel Berkeley Research Lab (54 sensors, ~2.3 Million readings)
&bull; Framework: PyTorch Geometric + Statistical Physics Diffusion Message Passing
&bull; Results: Mean reconstruction error: <b style="color:var(--emerald);">0.028</b> (Standard GCN: 0.072, Physics-GNN: 0.049)
&bull; Status: Presented at ICAMSTA-2025, Osmania University.`,

    ev: `<b style="color:var(--emerald);">Embedded EV Monitoring System using Arduino</b>
&bull; Hardware: Arduino ATmega, Voltage Divider, Current Sensor, Temperature Probe
&bull; Telemetry: Multi-channel ADC acquisition, calibrated UART serial telemetry
&bull; Output: Live software dashboard visualizing battery SOC, vehicle speed, and estimated driving range.`,

    patent: `<b style="color:var(--gold);">Patent Summit Competition — 1st Prize Winner</b>
&bull; Title: Passive Alcohol Detection System for Vehicle Safety
&bull; Host: National Workshop on Patent Analytics and Filing Framework, VNR VJIET
&bull; Mechanism: Non-intrusive ambient gas sensing array + ignition interlock logic.`,

    research: `<b style="color:var(--purple);">ICAMSTA-2025 International Conference Presentation</b>
Presented: "Hybrid Statistical Physics-Informed Graph Neural Network (SP-GNN) for Robust Fault Detection and Uncertainty Quantification in Distributed Sensor Systems"
Venue: Osmania University, Hyderabad.`,

    resume: `Opening official Curriculum Vitae viewer...`,

    contact: `<b style="color:var(--text-highlight);">Direct Communication Channels:</b>
&bull; Email   : <a href="mailto:rishithreddyc45@gmail.com" style="color:var(--cyan);">rishithreddyc45@gmail.com</a>
&bull; Phone   : <a href="tel:+919494105486" style="color:var(--gold);">+91 9494105486</a>
&bull; GitHub  : <a href="https://github.com/rishithreddy46/" target="_blank" style="color:var(--cyan);">github.com/rishithreddy46</a>
&bull; LinkedIn: <a href="https://www.linkedin.com/in/rishith-reddy-9aa6902a0/" target="_blank" style="color:var(--purple);">linkedin.com/in/rishith-reddy-9aa6902a0</a>
&bull; Location: Hyderabad, Telangana, India (Open to Relocation)`
  };

  function executeCommand(cmdStr) {
    const trimmed = cmdStr.trim().toLowerCase();
    if (!trimmed) return;

    history.push(cmdStr);
    histIdx = history.length;

    // Echo command
    const cmdLine = document.createElement('div');
    cmdLine.className = 'term-line-output';
    cmdLine.innerHTML = `<span class="term-prompt-line">rishith@telemetry:~$</span> ${escapeHTML(cmdStr)}`;
    output.appendChild(cmdLine);

    if (trimmed === 'clear') {
      output.innerHTML = '';
      return;
    }

    if (trimmed === 'resume') {
      const resumeModal = document.getElementById('resume-modal');
      if (resumeModal) resumeModal.classList.add('active');
    }

    const res = COMMANDS[trimmed];
    const outLine = document.createElement('div');
    outLine.className = 'term-line-output';

    if (res) {
      outLine.innerHTML = res.replace(/\n/g, '<br>');
    } else {
      outLine.innerHTML = `<span style="color:var(--rose);">command not found: ${escapeHTML(trimmed)}.</span> Type <b style="color:var(--gold);">help</b> for command list.`;
    }

    output.appendChild(outLine);
    output.scrollTop = output.scrollHeight;
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = input.value;
      input.value = '';
      executeCommand(val);
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

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd');
      executeCommand(cmd);
    });
  });
}

// ==========================================================================
// 7. PROJECT FILTERING
// ==========================================================================
function initProjectFiltering() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.case-study-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat.includes(filter)) {
          card.style.display = 'flex';
          card.style.animation = 'fadeInCard 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// ==========================================================================
// 8. SKILL CATEGORY TABS
// ==========================================================================
function initSkillTabs() {
  const tabs = document.querySelectorAll('.skill-tab-btn');
  const cards = document.querySelectorAll('.skill-category-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const cat = tab.getAttribute('data-cat');

      cards.forEach(card => {
        const cardCat = card.getAttribute('data-cat');
        if (cat === 'all' || cardCat === cat) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// ==========================================================================
// 9. CASE STUDY DEEP DIVE MODAL
// ==========================================================================
function initCaseStudyModals() {
  const modal = document.getElementById('case-study-modal');
  const modalTitle = document.getElementById('case-modal-title');
  const modalBody = document.getElementById('case-modal-body');
  const closeBtn = document.getElementById('btn-close-case-modal');

  const CASE_DETAILS = {
    'stm32-af': {
      title: 'PPG-Based Atrial Fibrillation (AF) Detection on STM32',
      html: `
        <div class="case-modal-section-title"><i class="fa-solid fa-triangle-exclamation"></i> 1. Problem Statement</div>
        <p class="case-modal-text">
          Cardiac arrhythmias like Atrial Fibrillation (AF) are leading causes of stroke and heart failure. Traditional clinical Holter monitors are bulky, while cloud-dependent wearables suffer from transmission latency, battery drain, and privacy constraints. Furthermore, machine learning models frequently overfit to specific patient morphologies, collapsing during evaluation on unseen individuals.
        </p>

        <div class="case-modal-section-title"><i class="fa-solid fa-microchip"></i> 2. Technical Approach &amp; Firmware Architecture</div>
        <p class="case-modal-text">
          Engineered an embedded processing pipeline executed directly on an ARM Cortex-M (STM32) microcontroller.
        </p>
        
        <div class="case-flow-diagram">
          <div style="font-family:var(--font-mono); font-size:12px; color:var(--cyan); margin-bottom:8px;">[SYSTEM FIRMWARE SIGNAL FLOW]</div>
          <div style="font-size:13px; line-height:1.8; color:var(--text-main);">
            1. <strong>Optical Transduction</strong>: Green light PPG sensor samples peripheral pulsatile blood volume.<br>
            2. <strong>DMA Circular Buffer</strong>: 12-bit ADC converts signal at 100 Hz into a DMA ring buffer without CPU overhead.<br>
            3. <strong>Digital Bandpass Filter (0.5 – 5.0 Hz)</strong>: 4th-order IIR Butterworth filter attenuates baseline drift (respiration) and high-frequency noise.<br>
            4. <strong>Feature Extraction</strong>: Computes peak-to-peak intervals, RMSSD (Root Mean Square of Successive Differences), and SDNN.<br>
            5. <strong>Inter-Patient Validation</strong>: Trained and evaluated using patient-disjoint folds to guarantee generalization to new subjects.
          </div>
        </div>

        <div class="case-modal-section-title"><i class="fa-solid fa-code"></i> 3. Key Firmware Algorithm (C / STM32)</div>
        <pre class="case-code-snippet"><code>// Circular Buffer &amp; Peak Threshold Detection
#define SAMPLE_RATE 100
#define BUFFER_SIZE 256

uint16_t adc_dma_buffer[BUFFER_SIZE];
float filtered_sample;

float apply_bandpass_filter(float raw_in) {
    static float x[3] = {0}, y[3] = {0};
    // 2nd-order section coefficients for 0.5-5Hz @ 100Hz
    x[0] = raw_in;
    y[0] = 0.1245f*(x[0] - x[2]) - (-1.654f*y[1] + 0.751f*y[2]);
    x[2] = x[1]; x[1] = x[0];
    y[2] = y[1]; y[1] = y[0];
    return y[0];
}</code></pre>

        <div class="case-modal-section-title"><i class="fa-solid fa-chart-line"></i> 4. Quantifiable Outcomes</div>
        <ul style="padding-left:1.5rem; color:var(--text-main); font-size:14px; line-height:1.7;">
          <li>Real-time execution running completely within the RAM/Flash constraints of an STM32 MCU.</li>
          <li>Patient-disjoint validation verifying true generalization across distinct human physiological profiles.</li>
          <li>Sub-25ms classification inference delay for immediate arrhythmia alert notification.</li>
        </ul>
      `
    },

    'sp-gnn': {
      title: 'Hybrid Statistical Physics-Informed Graph Neural Network (SP-GNN)',
      html: `
        <div class="case-modal-section-title"><i class="fa-solid fa-triangle-exclamation"></i> 1. Problem Statement</div>
        <p class="case-modal-text">
          In large-scale distributed sensor networks (e.g., environmental telemetry, smart grid, industrial automation), sensor readings degrade over time due to drift, decalibration, and hardware faults. Standard Deep Learning and Graph Convolutional Networks (GCNs) act as black boxes—they ignore governing physical laws (conservation of energy, spatial heat/pressure diffusion) and fail to quantify uncertainty in anomalous sensor readings.
        </p>

        <div class="case-modal-section-title"><i class="fa-solid fa-atom"></i> 2. Mathematical Formulation &amp; Architecture</div>
        <p class="case-modal-text">
          Formulated an unsupervised SP-GNN architecture that integrates statistical physics message-passing into graph relational modeling:
        </p>

        <div class="case-flow-diagram">
          <div style="font-family:var(--font-mono); font-size:12px; color:var(--purple); margin-bottom:8px;">[PHYSICS-INFORMED RELATIONAL GRAPH]</div>
          <div style="font-size:13px; line-height:1.8; color:var(--text-main);">
            &bull; <strong>Graph Topology</strong>: Modeled 54 heterogeneous sensors as an adjacency graph weighted by physical spatial distances.<br>
            &bull; <strong>Physics-Constrained Loss</strong>: Penalizes predictions that violate physical diffusion principles (&nabla;&sup2;&Phi; = 0).<br>
            &bull; <strong>Dataset Scale</strong>: Evaluated on ~2.3 Million readings from the Intel Berkeley Research Lab dataset.<br>
            &bull; <strong>Uncertainty Quantification</strong>: Propagates Bayesian variance across graph edges to distinguish true physical events from sensor failures.
          </div>
        </div>

        <div class="case-modal-section-title"><i class="fa-solid fa-table"></i> 3. Comparative Benchmark Results</div>
        <table style="width:100%; border-collapse:collapse; margin:1rem 0; font-family:var(--font-mono); font-size:13px;">
          <thead>
            <tr style="border-bottom:1px solid var(--border-medium); color:var(--cyan); text-align:left;">
              <th style="padding:8px;">Model Architecture</th>
              <th style="padding:8px;">Mean Reconstruction Error (MSE)</th>
              <th style="padding:8px;">Improvement</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom:1px solid var(--border-subtle);">
              <td style="padding:8px;">Standard GCN</td>
              <td style="padding:8px; color:var(--rose);">0.072</td>
              <td style="padding:8px;">Baseline</td>
            </tr>
            <tr style="border-bottom:1px solid var(--border-subtle);">
              <td style="padding:8px;">Physics-GNN</td>
              <td style="padding:8px; color:var(--gold);">0.049</td>
              <td style="padding:8px;">+31.9%</td>
            </tr>
            <tr style="background:rgba(16,185,129,0.1);">
              <td style="padding:8px; font-weight:700; color:var(--emerald);">SP-GNN (Ours)</td>
              <td style="padding:8px; font-weight:700; color:var(--emerald);">0.028</td>
              <td style="padding:8px; font-weight:700; color:var(--emerald);">+61.1% vs GCN</td>
            </tr>
          </tbody>
        </table>

        <div class="case-modal-section-title"><i class="fa-solid fa-award"></i> 4. Academic Recognition</div>
        <p class="case-modal-text">
          Research paper successfully accepted and presented at the <strong>ICAMSTA-2025 International Conference, Osmania University</strong>, receiving praise for bridging rigorous statistical physics with modern geometric deep learning.
        </p>
      `
    },

    'ev-monitor': {
      title: 'Embedded EV Monitoring System using Arduino',
      html: `
        <div class="case-modal-section-title"><i class="fa-solid fa-triangle-exclamation"></i> 1. Problem Statement</div>
        <p class="case-modal-text">
          Electric vehicle battery health, operating temperature, and actual available driving range fluctuate drastically under dynamic driving loads. Affordable, robust embedded telemetry is critical to monitor cell voltage balance, motor temperature, and vehicle speed without excessive computational overhead.
        </p>

        <div class="case-modal-section-title"><i class="fa-solid fa-car-battery"></i> 2. System Hardware &amp; Dashboard Telemetry</div>
        <p class="case-modal-text">
          Built an end-to-end telemetry acquisition prototype integrating physical sensors with microcontrollers:
        </p>
        <div class="case-flow-diagram">
          <div style="font-size:13px; line-height:1.8; color:var(--text-main);">
            &bull; <strong>Battery Pack Monitoring</strong>: High-precision voltage divider array + ACS712 current shunt sensor.<br>
            &bull; <strong>Thermal Telemetry</strong>: Interfaced multi-point NTC thermistors to capture battery pack and inverter heat dissipation.<br>
            &bull; <strong>Speed &amp; Odometry</strong>: Hall-effect magnetic speed sensor interfaced via external hardware interrupts.<br>
            &bull; <strong>Software Dashboard</strong>: Serial telemetry stream decoded and visualized on a dynamic dashboard showing live battery state-of-charge (SOC) and estimated remaining distance.
          </div>
        </div>

        <div class="case-modal-section-title"><i class="fa-solid fa-check"></i> 3. Key Achievements</div>
        <ul style="padding-left:1.5rem; color:var(--text-main); font-size:14px; line-height:1.7;">
          <li>Real-time multi-parameter data acquisition running stably on an Arduino microcontroller.</li>
          <li>Accurate dynamic driving-range estimation combining current draw and battery discharge slope.</li>
          <li>Comprehensive sensor calibration and noise filtering on noisy 12V/48V vehicle rails.</li>
        </ul>
      `
    },

    'alcohol-patent': {
      title: 'Passive Alcohol Detection System for Vehicle Safety (1st Prize Patent Summit)',
      html: `
        <div class="case-modal-section-title"><i class="fa-solid fa-trophy"></i> 1. Award &amp; Recognition</div>
        <p class="case-modal-text">
          Awarded <strong>1st Prize</strong> at the <em>Patent Summit Competition: National Workshop on Patent Analytics and Filing Framework</em>, held at <strong>VNR VJIET</strong>. Evaluated by intellectual property attorneys and senior engineering faculty for novelty, commercial viability, and life-safety impact.
        </p>

        <div class="case-modal-section-title"><i class="fa-solid fa-shield-halved"></i> 2. Technical Innovation: Passive vs. Active</div>
        <p class="case-modal-text">
          Conventional breathalyzers require the driver to actively blow into a tube, allowing drunk drivers to bypass the system by having a passenger blow or refusing the test.
        </p>
        <div class="case-flow-diagram">
          <div style="font-size:13px; line-height:1.8; color:var(--text-main);">
            &bull; <strong>Passive Cabin Sensing</strong>: Embedded high-sensitivity gas sensor array into steering column and cabin air intake.<br>
            &bull; <strong>Continuous Threshold Verification</strong>: Microcontroller continuously samples ethanol vapor concentration without requiring driver awareness.<br>
            &bull; <strong>Fail-Safe Ignition Interlock</strong>: If blood alcohol threshold exceeds legal limit, the starter motor relay is automatically locked out and hazard beacons are activated.
          </div>
        </div>

        <div class="case-modal-section-title"><i class="fa-solid fa-file-contract"></i> 3. Patent Analytics &amp; Filing Framework</div>
        <p class="case-modal-text">
          Drafted complete patent specifications, prior art search, independent &amp; dependent claim structures, and block schematic drawings adhering to Indian Patent Office (IPO) filing guidelines.
        </p>
      `
    }
  };

  const openBtns = document.querySelectorAll('.btn-case-modal');
  openBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const projKey = btn.getAttribute('data-project');
      const data = CASE_DETAILS[projKey];
      if (!data) return;

      modalTitle.innerHTML = `<i class="fa-solid fa-microchip" style="color:var(--cyan);"></i> ${data.title}`;
      modalBody.innerHTML = data.html;
      modal.classList.add('active');
    });
  });
}

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('active');
  });
}

// ==========================================================================
// 10. RESUME MODAL
// ==========================================================================
function initResumeModal() {
  const modal = document.getElementById('resume-modal');
  const openBtn = document.getElementById('btn-open-resume');
  const heroBtn = document.getElementById('btn-hero-resume');
  const closeBtn = document.getElementById('btn-close-resume-modal');

  function openModal() {
    if (modal) modal.classList.add('active');
  }

  function closeModal() {
    if (modal) modal.classList.remove('active');
  }

  if (openBtn) openBtn.addEventListener('click', openModal);
  if (heroBtn) heroBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      const caseModal = document.getElementById('case-study-modal');
      if (caseModal) caseModal.classList.remove('active');
    }
  });
}

// ==========================================================================
// 11. CONTACT FORM
// ==========================================================================
function initContactForm() {
  const form = document.getElementById('portfolio-contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('contact-name').value;
    const email = document.getElementById('contact-email').value;
    const msg = document.getElementById('contact-msg').value;

    const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
    const body = encodeURIComponent(`Hi Rishith,\n\n${msg}\n\nFrom: ${name} (${email})`);
    
    // Direct mailto trigger
    window.location.href = `mailto:rishithreddyc45@gmail.com?subject=${subject}&body=${body}`;

    alert(`Thank you, ${name}! Your email client will now open with a pre-filled dispatch to rishithreddyc45@gmail.com.`);
    form.reset();
  });
}

// ==========================================================================
// 12. MOBILE MENU TOGGLE
// ==========================================================================
function initMobileMenu() {
  const toggle = document.getElementById('btn-mobile-toggle');
  const menu = document.querySelector('.nav-menu-links');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    menu.classList.toggle('show-mobile');
  });
}

  const links = menu.querySelectorAll('a');
  links.forEach(l => {
    l.addEventListener('click', () => {
      menu.classList.remove('show-mobile');
    });
  });
}
