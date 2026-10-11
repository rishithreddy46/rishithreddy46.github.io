/**
 * SIGNAL LAB — Engineering, Visualized
 * Application Engine for Chiluka Rishith Reddy
 * Features:
 * - Real-Time Oscilloscope Waveform Simulation
 * - Formspree Form Dispatch with End-to-End Feedback
 * - Keyboard-Accessible Engineering Console
 * - Editorial Case Study Detail Modals
 * - Active ScrollSpy Navigation
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeroOscilloscope();
  initNavigationScrollSpy();
  initMobileNavigation();
  initContactFormspree();
  initEngineeringConsole();
  initEditorialCaseStudies();
});

// ==========================================================================
// 1. HERO OSCILLOSCOPE WAVEFORM SIMULATION
// ==========================================================================
function initHeroOscilloscope() {
  const canvas = document.getElementById('hero-scope-canvas');
  if (!canvas) return;

  // Respect reduced-motion preferences
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
    ctx.fillStyle = '#060A10';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#48DDE8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
    return;
  }

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = canvas.parentElement.clientWidth);
  let height = (canvas.height = canvas.parentElement.clientHeight);

  window.addEventListener('resize', () => {
    if (!canvas.parentElement) return;
    width = canvas.width = canvas.parentElement.clientWidth;
    height = canvas.height = canvas.parentElement.clientHeight;
  });

  const buffer = new Array(width).fill(height / 2);
  let t = 0;

  function getPhysiologicalPPG(timeVal) {
    // 1.25 Hz pulse rate (~75 bpm)
    const phase = (timeVal * 1.25 * Math.PI * 2) % (Math.PI * 2);
    // Systolic wave + dicrotic notch
    const systolic = Math.exp(-Math.pow(phase - 1.1, 2) / 0.18) * (height * 0.38);
    const dicrotic = Math.exp(-Math.pow(phase - 2.3, 2) / 0.38) * (height * 0.16);
    return systolic + dicrotic;
  }

  function renderScope() {
    t += 0.016;

    // Shift buffer and push new sample
    buffer.shift();
    const ppgSample = getPhysiologicalPPG(t);
    const yCoord = (height * 0.65) - ppgSample;
    buffer.push(yCoord);

    // Dark grid background
    ctx.fillStyle = '#060A10';
    ctx.fillRect(0, 0, width, height);

    // Oscilloscope grid lines
    ctx.strokeStyle = 'rgba(154, 169, 186, 0.07)';
    ctx.lineWidth = 1;
    const gridStep = 24;
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

    // Baseline reference
    ctx.strokeStyle = 'rgba(72, 221, 232, 0.15)';
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(0, height * 0.65);
    ctx.lineTo(width, height * 0.65);
    ctx.stroke();
    ctx.setLineDash([]);

    // Signal trace
    ctx.beginPath();
    ctx.moveTo(0, buffer[0]);
    for (let i = 1; i < buffer.length; i++) {
      ctx.lineTo(i, buffer[i]);
    }
    ctx.strokeStyle = '#48DDE8';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#48DDE8';
    ctx.shadowBlur = 8;
    ctx.stroke();
    ctx.shadowBlur = 0;

    requestAnimationFrame(renderScope);
  }
  renderScope();
}

// ==========================================================================
// 2. ACTIVE NAVIGATION SCROLLSPY
// ==========================================================================
function initNavigationScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-anchor');
  if (!sections.length || !navLinks.length) return;

  function onScroll() {
    const scrollPos = window.scrollY + 120;
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
}

// ==========================================================================
// 3. MOBILE MENU
// ==========================================================================
function initMobileNavigation() {
  const btn = document.getElementById('mobile-toggle-btn');
  const menu = document.getElementById('nav-links');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    menu.classList.toggle('open-mobile');
  });

  const links = menu.querySelectorAll('a');
  links.forEach(l => {
    l.addEventListener('click', () => {
      menu.classList.remove('open-mobile');
    });
  });
}

// ==========================================================================
// 4. FORMSPREE CONTACT FORM DISPATCH
// ==========================================================================
function initContactFormspree() {
  const form = document.getElementById('signallab-contact-form');
  const feedback = document.getElementById('form-feedback-status');
  const submitBtn = document.getElementById('btn-submit-form');
  if (!form || !feedback || !submitBtn) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const inquiry = document.getElementById('contact-inquiry').value;
    const msg = document.getElementById('contact-message').value.trim();

    if (!name || !email || !msg) {
      feedback.textContent = 'Please complete all required fields.';
      feedback.className = 'form-status-msg error';
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Transmitting Dispatch...';
    feedback.className = 'form-status-msg';
    feedback.style.display = 'none';

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          email: email,
          inquiry_type: inquiry,
          message: msg
        })
      });

      if (response.ok) {
        feedback.innerHTML = '<i class="fa-solid fa-circle-check"></i> Message transmitted successfully! Thank you for reaching out. I will respond to your inquiry shortly.';
        feedback.className = 'form-status-msg success';
        form.reset();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Submission failed');
      }
    } catch (err) {
      // Graceful mailto fallback if endpoint is pending verification
      feedback.innerHTML = `Notice: Direct API dispatch encountered a network delay. Opening your email client to send directly to <strong>rishithreddyc45@gmail.com</strong>...`;
      feedback.className = 'form-status-msg error';

      const subject = encodeURIComponent(`[${inquiry}] Portfolio Inquiry from ${name}`);
      const body = encodeURIComponent(`Hi Rishith,\n\n${msg}\n\nFrom: ${name} (${email})`);
      window.location.href = `mailto:rishithreddyc45@gmail.com?subject=${subject}&body=${body}`;
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
    }
  });
}

// ==========================================================================
// 5. INTERACTIVE ENGINEERING CONSOLE
// ==========================================================================
function initEngineeringConsole() {
  const input = document.getElementById('console-input');
  const output = document.getElementById('console-output');
  const chips = document.querySelectorAll('.c-chip-btn');
  if (!input || !output) return;

  const history = [];
  let histIdx = -1;

  const COMMANDS = {
    help: `Available engineering commands:
  - <b style="color:var(--signal-cyan);">about</b>       : Academic status, discipline &amp; career vision
  - <b style="color:var(--signal-cyan);">skills</b>      : Summary of verified instrumentation &amp; programming skills
  - <b style="color:var(--signal-cyan);">projects</b>    : 4 flagship engineering case studies
  - <b style="color:var(--signal-cyan);">research</b>    : ICAMSTA-2025 SP-GNN conference paper (0.028 MSE)
  - <b style="color:var(--signal-cyan);">education</b>   : B.Tech EIE at VNR VJIET (CGPA: 7.52)
  - <b style="color:var(--signal-cyan);">resume</b>      : Download official verified resume PDF
  - <b style="color:var(--signal-cyan);">contact</b>     : Direct communication coordinates
  - <b style="color:var(--signal-cyan);">clear</b>       : Clear console buffer`,

    about: `<b style="color:#fff;">Chiluka Rishith Reddy</b>
• Discipline: B.Tech in Electronics &amp; Instrumentation Engineering (EIE)
• Institution: Vallurupalli Nageswara Rao Vignana Jyothi Institute of Engineering &amp; Technology (VNR VJIET)
• Current Status: Pursuing 7th Semester &bull; CGPA: 7.52 &bull; Batch 2023–2027
• Objective: Seeking to apply knowledge of C programming, microcontrollers, signal processing, and real-time data acquisition to contribute to embedded product development, testing, and system validation.`,

    skills: `================== SKILLS MATRIX ==================
<b style="color:var(--signal-cyan);">[Programming]</b>         : C, Embedded C, Python (NPTEL Elite Certification)
<b style="color:var(--inst-amber);">[Embedded Systems]</b>    : STM32, Arduino, ESP32, Microcontrollers, GPIO, ADC
<b style="color:var(--signal-cyan);">[Sensors &amp; DAQ]</b>       : Sensor Interfacing, Data Acquisition, Signal Conditioning, UWB, PPG
<b style="color:var(--inst-amber);">[Signal Processing]</b>   : Digital Filtering, FFT/Fourier Transform, HR/HRV Analysis
<b style="color:var(--signal-cyan);">[Tools &amp; Platforms]</b>   : STM32CubeIDE, Arduino IDE, MATLAB, LabVIEW`,

    projects: `================ SELECTED PROJECTS ================
1. <b style="color:var(--signal-cyan);">PPG-Based AF Detection on STM32</b> (Status: In Progress)
   Optical PPG DAQ &rarr; Digital Preprocessing &rarr; HRV Extraction &rarr; Patient-Disjoint Validation.
2. <b style="color:var(--signal-cyan);">Hybrid SP-GNN Sensor Fault Detector</b> (Status: Research Publication)
   IBRL Dataset (54 sensors, ~2.3M readings) &rarr; 0.028 Mean Reconstruction Error.
3. <b style="color:var(--signal-cyan);">Embedded EV Monitoring System</b> (Status: Hardware Prototype)
   Arduino-based real-time multi-parameter telemetry dashboard.
4. <b style="color:var(--inst-amber);">Passive Alcohol Detection System</b> (Status: 1st Prize Winner)
   Non-intrusive automotive cabin safety &amp; ignition relay lockout.`,

    research: `<b style="color:var(--signal-cyan);">ICAMSTA-2025 International Conference Presentation</b>
• Paper Title: "Hybrid Statistical Physics-Informed Graph Neural Network (SP-GNN) for Robust Fault Detection and Uncertainty Quantification in Distributed Sensor Systems"
• Venue: Osmania University, Hyderabad
• Dataset: Intel Berkeley Research Lab (54 sensors, ~2.3 Million readings)
• Results: Mean reconstruction error of <b style="color:var(--signal-green);">0.028</b> (Standard GCN: 0.072, Physics-GNN: 0.049).`,

    education: `<b style="color:#fff;">Academic Background:</b>
• B.Tech in Electronics &amp; Instrumentation Engineering
• VNR VJIET (2023 — 2027) &bull; Pursuing 7th Semester &bull; CGPA: 7.52
• Certifications: Coursera Google Data Analytics &bull; NPTEL Python Elite (2025).`,

    resume: `Initiating download of official verified resume: Chiluka_Rishith_Reddy_Resume.pdf`,

    contact: `<b style="color:#fff;">Direct Communication Coordinates:</b>
• Email   : <a href="mailto:rishithreddyc45@gmail.com" style="color:var(--signal-cyan);">rishithreddyc45@gmail.com</a>
• Phone   : <a href="tel:+919494105486" style="color:var(--inst-amber);">+91 9494105486</a>
• GitHub  : <a href="https://github.com/rishithreddy46/" target="_blank" style="color:var(--signal-cyan);">github.com/rishithreddy46</a>
• LinkedIn: <a href="https://www.linkedin.com/in/rishith-reddy-9aa6902a0/" target="_blank" style="color:var(--signal-cyan);">linkedin.com/in/rishith-reddy-9aa6902a0</a>
• Location: Hyderabad, Telangana, India (Open to Relocation)`
  };

  function execute(rawCmd) {
    const trimmed = rawCmd.trim();
    const clean = trimmed.toLowerCase();
    if (!clean) return;

    history.push(trimmed);
    histIdx = history.length;

    const cmdEcho = document.createElement('div');
    cmdEcho.className = 'console-line-out';
    cmdEcho.innerHTML = `<span class="console-prompt-label">crr@signallab:~$</span> ${escapeHTML(trimmed)}`;
    output.appendChild(cmdEcho);

    if (clean === 'clear') {
      output.innerHTML = '';
      return;
    }

    if (clean === 'resume') {
      window.open('Chiluka_Rishith_Reddy_Resume.pdf', '_blank');
    }

    const res = COMMANDS[clean];
    const outDiv = document.createElement('div');
    outDiv.className = 'console-line-out';

    if (res) {
      outDiv.innerHTML = res.replace(/\n/g, '<br>');
    } else {
      outDiv.innerHTML = `<span style="color:var(--signal-rose);">command not found: ${escapeHTML(clean)}.</span> Type <b style="color:var(--inst-amber);">help</b> for commands.`;
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
      execute(val);
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
      execute(chip.getAttribute('data-cmd'));
    });
  });
}

// ==========================================================================
// 6. EDITORIAL CASE STUDY DETAIL MODALS
// ==========================================================================
function initEditorialCaseStudies() {
  const modal = document.getElementById('case-study-modal');
  const headline = document.getElementById('modal-headline');
  const content = document.getElementById('modal-content-area');
  const closeBtn = document.getElementById('btn-close-modal');

  const CASE_LIBRARY = {
    'stm32-af': {
      title: 'PPG-Based AF Detection on STM32 — Inter-Patient Validation',
      body: `
        <h4 class="modal-section-h4">1. Problem Statement &amp; Clinical Context</h4>
        <p style="color:var(--text-secondary); margin-bottom:1rem;">
          Atrial Fibrillation (AF) is characterized by irregular atrial electrical activity, often leading to heart failure or stroke. Clinical ECG Holter monitoring is cumbersome, while cloud-reliant wearable systems introduce latency, privacy concerns, and heavy battery discharge. Crucially, many existing ML approaches overfit to training subjects and experience severe performance drops when evaluated on unseen patients.
        </p>

        <h4 class="modal-section-h4">2. Engineering Objectives</h4>
        <ul style="color:var(--text-secondary); padding-left:1.5rem; margin-bottom:1rem;">
          <li>Acquire optical PPG pulses reliably at 100 Hz using ARM Cortex-M ADC with DMA circular buffering.</li>
          <li>Implement digital bandpass filtering (0.5 – 5.0 Hz) to eliminate baseline wander and high-frequency motion artifacts.</li>
          <li>Extract robust time-domain Heart Rate and HRV features (RMSSD, SDNN, pNN50).</li>
          <li>Deploy lightweight classification with strict patient-disjoint validation to test generalization on unseen subjects.</li>
        </ul>

        <h4 class="modal-section-h4">3. System Architecture &amp; Firmware Pipeline</h4>
        <div style="background:var(--bg-inset); border:1px solid var(--border-panel); border-radius:8px; padding:1rem; font-family:var(--font-mono); font-size:0.82rem; margin-bottom:1rem;">
          [PPG Optical Sensor] &rarr; [ADC DMA Ring Buffer] &rarr; [2nd-Order IIR Bandpass] &rarr; [Peak Detection &amp; HRV Extraction] &rarr; [Lightweight Edge Classifier]
        </div>

        <h4 class="modal-section-h4">4. Key Implementation Details (Embedded C)</h4>
        <pre class="modal-code-box"><code>// Digital Bandpass Filter (0.5 - 5.0 Hz Section @ 100 Hz Fs)
float filter_ppg_sample(float raw_in) {
    static float x[3] = {0}, y[3] = {0};
    x[0] = raw_in;
    // Direct Form II Biquad realization
    y[0] = 0.1245f * (x[0] - x[2]) - (-1.654f * y[1] + 0.751f * y[2]);
    x[2] = x[1]; x[1] = x[0];
    y[2] = y[1]; y[1] = y[0];
    return y[0];
}</code></pre>

        <h4 class="modal-section-h4">5. Results, Limitations &amp; Future Work</h4>
        <p style="color:var(--text-secondary); margin-bottom:0.5rem;">
          <strong>Implemented Work:</strong> Signal acquisition firmware, digital filter implementation, and feature extraction pipeline on STM32CubeIDE with synthetic &amp; recorded pulse databases.
        </p>
        <p style="color:var(--text-secondary); margin-bottom:0.5rem;">
          <strong>Verified Scope:</strong> Distinct from clinical certification—this work focuses on embedded hardware-software signal processing and patient-disjoint validation feasibility.
        </p>
        <p style="color:var(--text-secondary);">
          <strong>Future Work (Planned):</strong> Optimization of integer fixed-point arithmetic on lower-power Cortex-M0 targets and extended multi-patient bench trials.
        </p>
      `
    },

    'sp-gnn': {
      title: 'Hybrid Statistical Physics-Informed GNN (SP-GNN)',
      body: `
        <h4 class="modal-section-h4">1. Problem Statement</h4>
        <p style="color:var(--text-secondary); margin-bottom:1rem;">
          Distributed sensor systems (environmental telemetry, industrial process monitoring, smart infrastructure) are susceptible to drift, transmission corruption, and hardware failures. Standard deep learning and Graph Convolutional Networks (GCNs) treat sensors as purely data-driven black boxes, ignoring physical laws (spatial heat diffusion, conservation of energy) and failing to quantify uncertainty in anomalous readings.
        </p>

        <h4 class="modal-section-h4">2. Engineering Approach &amp; Physical Modeling</h4>
        <ul style="color:var(--text-secondary); padding-left:1.5rem; margin-bottom:1rem;">
          <li><strong>Dataset:</strong> Intel Berkeley Research Lab (IBRL) dataset comprising 54 spatial sensors and approximately 2.3 million readings.</li>
          <li><strong>Graph Relational Modeling:</strong> Sensors represented as graph nodes connected by physical spatial distance weights.</li>
          <li><strong>Physics Message-Passing:</strong> Integrates thermal and physical diffusion equations into node message-passing steps.</li>
          <li><strong>Graph-Laplacian Regularization:</strong> Enforces spatial smoothness constraints across adjacent physical sensors.</li>
          <li><strong>Monte-Carlo Dropout:</strong> Performs uncertainty quantification during inference to distinguish genuine environmental events from sensor hardware failures.</li>
        </ul>

        <h4 class="modal-section-h4">3. Quantitative Evaluation Results</h4>
        <p style="color:var(--text-secondary); margin-bottom:0.75rem;">
          Evaluation metric: <strong>Mean Reconstruction Error (MSE)</strong>. Lower error demonstrates that the model accurately models normal physical sensor relationships, enabling clear isolation of anomalies.
        </p>
        <table style="width:100%; border-collapse:collapse; margin-bottom:1rem; font-family:var(--font-mono); font-size:0.82rem;">
          <tr style="border-bottom:1px solid var(--border-subtle); color:var(--signal-cyan);">
            <th style="text-align:left; padding:8px 4px;">Model Framework</th>
            <th style="text-align:left; padding:8px 4px;">Mean Reconstruction Error</th>
            <th style="text-align:left; padding:8px 4px;">Performance Delta</th>
          </tr>
          <tr>
            <td style="padding:6px 4px;">Standard GCN</td>
            <td style="padding:6px 4px; color:#FB7185;">0.072</td>
            <td style="padding:6px 4px;">Baseline</td>
          </tr>
          <tr>
            <td style="padding:6px 4px;">Physics-GNN</td>
            <td style="padding:6px 4px; color:var(--inst-amber);">0.049</td>
            <td style="padding:6px 4px;">+31.9% improvement</td>
          </tr>
          <tr style="color:var(--signal-green); font-weight:700;">
            <td style="padding:6px 4px;">SP-GNN (Ours)</td>
            <td style="padding:6px 4px;">0.028</td>
            <td style="padding:6px 4px;">+61.1% improvement vs GCN</td>
          </tr>
        </table>

        <h4 class="modal-section-h4">4. Conference Presentation</h4>
        <p style="color:var(--text-secondary);">
          Presented at the <strong>ICAMSTA-2025 International Conference, Osmania University</strong>, Hyderabad. Recognized for bridging statistical physics principles with geometric deep learning in sensor systems.
        </p>
      `
    },

    'ev-monitor': {
      title: 'Embedded EV Monitoring System Using Arduino',
      body: `
        <h4 class="modal-section-h4">1. Problem Statement &amp; Prototype Goals</h4>
        <p style="color:var(--text-secondary); margin-bottom:1rem;">
          Electric vehicles require continuous monitoring of safety-critical operational variables—battery pack State of Charge (SOC), terminal voltage, instantaneous current, pack temperature, and speed—to prevent thermal runaway and calculate remaining driving range.
        </p>

        <h4 class="modal-section-h4">2. Hardware-Software Architecture</h4>
        <div style="background:var(--bg-inset); border:1px solid var(--border-panel); border-radius:8px; padding:1rem; font-family:var(--font-mono); font-size:0.82rem; margin-bottom:1rem;">
          [Sensors: Voltage Divider, Current Shunt, NTC Thermistor, Hall Effect] &rarr; [Arduino ATmega DAQ Firmware] &rarr; [UART Serial Telemetry] &rarr; [Software Dashboard]
        </div>

        <h4 class="modal-section-h4">3. Verified Engineering Contributions</h4>
        <ul style="color:var(--text-secondary); padding-left:1.5rem; margin-bottom:1rem;">
          <li>Interfaced multi-channel sensors with signal conditioning circuitry to measure battery pack voltage, load current, and thermal slope.</li>
          <li>Implemented interrupt-driven wheel speed measurement using a magnetic Hall-effect sensor.</li>
          <li>Formulated estimated driving-range monitoring combining real-time battery capacity with discharge current draw.</li>
          <li>Developed a responsive software telemetry dashboard for real-time visualization.</li>
        </ul>

        <h4 class="modal-section-h4">4. Limitations &amp; Future Work</h4>
        <p style="color:var(--text-secondary);">
          <strong>Prototype Note:</strong> Validated on a laboratory embedded prototype bench without production automotive certification. Future work includes CAN bus (Controller Area Network) transceiver integration for industrial vehicle bus architectures.
        </p>
      `
    },

    'alcohol-patent': {
      title: 'Passive Alcohol Detection System for Vehicle Safety',
      body: `
        <h4 class="modal-section-h4">1. Recognition: 1st Prize – Patent Summit Competition</h4>
        <p style="color:var(--text-secondary); margin-bottom:1rem;">
          Awarded <strong>1st Prize</strong> at the <em>Patent Summit Competition: National Workshop on Patent Analytics and Filing Framework</em>, held at <strong>VNR VJIET</strong>. Evaluated by patent attorneys and senior engineering faculty for novelty, commercial viability, and social safety impact.
        </p>

        <h4 class="modal-section-h4">2. Engineering Innovation: Passive Sensing</h4>
        <p style="color:var(--text-secondary); margin-bottom:1rem;">
          Conventional breathalyzers require active driver compliance (blowing into a mouthpiece), which can be avoided, bypassed, or refused. This prototype implements continuous, passive ambient air sampling situated in the steering column/cabin air stream.
        </p>

        <h4 class="modal-section-h4">3. System Mechanism</h4>
        <ul style="color:var(--text-secondary); padding-left:1.5rem; margin-bottom:1rem;">
          <li><strong>Gas Sensing:</strong> Calibrated ethanol sensor array positioned in vehicle cabin air currents.</li>
          <li><strong>Comparator &amp; MCU Logic:</strong> Continuously converts sensor voltages and verifies against calibrated legal intoxication thresholds.</li>
          <li><strong>Ignition Interlock:</strong> Actuates an electromechanical relay in the starter motor circuit, cutting ignition when intoxication is detected.</li>
        </ul>

        <h4 class="modal-section-h4">4. Patent Analytics Framework</h4>
        <p style="color:var(--text-secondary);">
          Structured prior-art search, patentability claims, and system block schematics formulated under the guidance of the National Workshop on Patent Analytics and Filing Framework.
        </p>
      `
    }
  };

  const triggers = document.querySelectorAll('.btn-case-study');
  triggers.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-project');
      const item = CASE_LIBRARY[id];
      if (!item) return;

      headline.innerHTML = `<i class="fa-solid fa-microchip" style="color:var(--signal-cyan);"></i> ${item.title}`;
      content.innerHTML = item.body;
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  function closeModal() {
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}
