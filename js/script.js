/**
 * CHILUKA RISHITH REDDY - PORTFOLIO INTERACTIVE APPLICATION ENGINE
 * Particle constellation canvas, 3D tilt cards, interactive RishithOS CLI,
 * dynamic typing, project filter, resume modal, and magnetic cursor.
 */

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initCustomCursor();
  initParticleCanvas();
  initRoleTyping();
  initTerminalEngine();
  initProjectFiltering();
  initSkillTabs();
  initScrollSpyAndNav();
  init3DCardTilt();
  initResumeModal();
  initContactForm();
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
    width += Math.floor(Math.random() * 18) + 8;
    if (width > 100) width = 100;
    
    if (progressBar) progressBar.style.width = width + '%';
    if (statusText) statusText.textContent = `INITIALIZING SYSTEM... ${width}%`;

    if (width >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        if (preloader) preloader.classList.add('hidden');
      }, 350);
    }
  }, 40);
}

// ==========================================================================
// 2. MAGNETIC CUSTOM CURSOR
// ==========================================================================
function initCustomCursor() {
  const cursorDot = document.getElementById('cursor-dot');
  const cursorOutline = document.getElementById('cursor-outline');
  if (!cursorDot || !cursorOutline) return;

  let mouseX = 0, mouseY = 0;
  let outlineX = 0, outlineY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  });

  // Smooth lerp for outer ring
  function animateCursor() {
    outlineX += (mouseX - outlineX) * 0.18;
    outlineY += (mouseY - outlineY) * 0.18;
    cursorOutline.style.left = `${outlineX}px`;
    cursorOutline.style.top = `${outlineY}px`;
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hover magnet expansions
  const hoverables = document.querySelectorAll('a, button, input, textarea, .project-3d-card, .skill-card-item, .spotlight-card, .term-chip-btn');
  hoverables.forEach(el => {
    el.addEventListener('mouseenter', () => cursorOutline.classList.add('hovered'));
    el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hovered'));
  });
}

// ==========================================================================
// 3. INTERACTIVE PARTICLE CONSTELLATION CANVAS
// ==========================================================================
function initParticleCanvas() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = Math.min(width > 768 ? 75 : 35, 90);
  const mouse = { x: null, y: null, radius: 140 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Particle Class
  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 1;
      this.vx = (Math.random() - 0.5) * 0.8;
      this.vy = (Math.random() - 0.5) * 0.8;
      this.color = Math.random() > 0.6 ? '#00F0FF' : (Math.random() > 0.5 ? '#8B5CF6' : '#FFB703');
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse interaction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 3;
          this.y -= (dy / dist) * force * 3;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.color;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      // Connect lines
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 240, 255, ${0.18 * (1 - dist / 110)})`;
          ctx.lineWidth = 0.75;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(render);
  }
  render();
}

// ==========================================================================
// 4. DYNAMIC ROLE TYPING EFFECT
// ==========================================================================
function initRoleTyping() {
  const roleEl = document.getElementById('typed-role-text');
  if (!roleEl) return;

  const roles = [
    "Full-Stack Software Developer",
    "B.Tech EIE @ VNR VJIET (CGPA 7.50)",
    "Embedded Systems & IoT Innovator",
    "AWS Cloud Specialist",
    "Published GNN/ML Researcher (ICAMSTA-2025)",
    "1st Prize Patent Summit Winner"
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typingSpeed = 75;

  function typeStep() {
    const currentRole = roles[roleIdx];

    if (isDeleting) {
      charIdx--;
      roleEl.textContent = currentRole.substring(0, charIdx);
      typingSpeed = 35;
    } else {
      charIdx++;
      roleEl.textContent = currentRole.substring(0, charIdx);
      typingSpeed = 75;
    }

    if (!isDeleting && charIdx === currentRole.length) {
      isDeleting = true;
      typingSpeed = 1800; // Pause at end
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      typingSpeed = 400; // Pause before next role
    }

    setTimeout(typeStep, typingSpeed);
  }
  typeStep();
}

// ==========================================================================
// 5. INTERACTIVE RishithOS CLI TERMINAL ENGINE
// ==========================================================================
function initTerminalEngine() {
  const terminalBody = document.getElementById('terminal-output');
  const inputField = document.getElementById('terminal-input');
  if (!terminalBody || !inputField) return;

  const commands = {
    help: () => `
<span class="term-cmd-highlight">AVAILABLE COMMANDS:</span>
  • <b style="color:var(--cyan);">about</b>       : Read full bio, background & core philosophy
  • <b style="color:var(--cyan);">skills</b>      : Display categorized technical proficiency matrix
  • <b style="color:var(--cyan);">projects</b>    : Explore academic & full-stack software projects
  • <b style="color:var(--cyan);">experience</b>  : Timeline of internships (Infosys, AWS, Internshala)
  • <b style="color:var(--cyan);">edu</b>         : Academic credentials (VNR VJIET, Narayana)
  • <b style="color:var(--cyan);">patent</b>      : 1st Prize Patent Summit & hardware innovation
  • <b style="color:var(--cyan);">paper</b>       : ICAMSTA-2025 GNN research paper details
  • <b style="color:var(--cyan);">resume</b>      : Launch live resume PDF viewer / download
  • <b style="color:var(--cyan);">contact</b>     : Direct communication coordinates (Email, Phone, LinkedIn)
  • <b style="color:var(--cyan);">hire</b>        : Open immediate interview / collaboration dialog
  • <b style="color:var(--cyan);">clear</b>       : Clear console buffer
    `,

    about: () => `
<b style="color:var(--gold);">CHILUKA RISHITH REDDY</b> — Full-Stack Developer & Embedded Systems Specialist
Pursuing B.Tech in Electronics & Instrumentation Engineering (EIE) at VNR VJIET, Hyderabad (CGPA: 7.50).
Passionate about building resilient distributed web systems (Django, React, PostgreSQL) integrated seamlessly with IoT telemetry & cloud infrastructure (AWS).
    `,

    skills: () => `
<b style="color:var(--cyan);">[PROGRAMMING LANGUAGES]</b> : Python, JavaScript (ES6+), C / Embedded C, Arduino, HTML5, CSS3, SQL
<b style="color:var(--purple);">[FRAMEWORKS & LIBS]</b>    : Django, Django REST Framework, React.js, Streamlit, Bootstrap, Tailwind
<b style="color:var(--gold);">[HARDWARE & IoT]</b>        : Arduino, ESP32, NI LabVIEW, NI Multisim, MATLAB, Sensors & Actuators, Auto-CAD
<b style="color:var(--emerald);">[CLOUD & DEV TOOLS]</b>      : AWS (EC2, S3, Lambda, IAM), Git, GitHub, PostgreSQL, SQLite, VS Code
    `,

    projects: () => `
1. <b style="color:var(--cyan);">TalentLink / Taskera</b> : Freelance marketplace platform (React, Django REST, PostgreSQL, JWT Auth).
2. <b style="color:var(--gold);">HeavyHaul Pro</b>        : Uber for Heavy Machinery & Contract Vehicles (Django REST, Leaflet Radar, Dynamic Billing).
3. <b style="color:var(--purple);">Smart EV Dashboard</b>   : Real-time IoT battery & vehicle telemetry dashboard (Arduino, Streamlit, NI Multisim).
4. <b style="color:var(--emerald);">Campus Career Hub</b>    : Student job readiness portal with ATS resume builders & mock interview tools.
    `,

    experience: () => `
• <b style="color:var(--cyan);">Infosys Springboard</b> (11/2025 - 01/2026) : "Taskera" freelance matchmaking platform development.
• <b style="color:var(--purple);">Internship Studio</b> (07/2025 - 01/2026) : 6-Month AWS Cloud Engineering internship (EC2, S3, IAM, Lambda).
• <b style="color:var(--gold);">Internshala / NSDC</b> (06/2025 - 08/2025) : Govt.-affiliated Full-Stack Web Development internship.
    `,

    edu: () => `
• <b style="color:var(--cyan);">B.Tech in EIE (2023 - 2027)</b> : VNR Vignana Jyothi Institute of Engineering and Technology | CGPA: 7.50
• <b style="color:var(--purple);">Intermediate MPC (2021 - 2023)</b> : Narayana Junior College | Score: 91.7%
• <b style="color:var(--gold);">SSC (2021)</b> : Narayana High School | GPA: 10.0 / 10.0
    `,

    patent: () => `
<b style="color:var(--gold);">🏆 1st PRIZE WINNER — PATENT SUMMIT COMPETITION</b>
Awarded at the National Workshop on Patent Analytics and Filing Framework, VNR VJIET for innovative hardware-software intellectual property design.
    `,

    paper: () => `
<b style="color:var(--cyan);">📄 RESEARCH PAPER PRESENTATION @ ICAMSTA-2025 (Osmania University):</b>
<i>"Hybrid Statistical Physics-Informed Graph Neural Network (SP-GNN) for Robust Fault Detection and Uncertainty Quantification in Distributed Sensor Systems"</i>
    `,

    resume: () => {
      openResumeModal();
      return `Launching official resume viewer... You can also download directly via <a href="/resume.pdf" download style="color:var(--cyan); text-decoration:underline;">resume.pdf</a>`;
    },

    contact: () => `
• <b>Email</b>: <a href="mailto:rishithreddyc45@gmail.com" style="color:var(--cyan);">rishithreddyc45@gmail.com</a>
• <b>Phone</b>: <a href="tel:+919494105486" style="color:var(--gold);">+91 9494105486</a>
• <b>GitHub</b>: <a href="https://github.com/rishithreddy46" target="_blank" style="color:var(--purple);">github.com/rishithreddy46</a>
• <b>Location</b>: Teachers Colony, BN Reddy, Ranga Reddy, Telangana, India - 500070
    `,

    hire: () => {
      const contactSection = document.getElementById('contact');
      if (contactSection) contactSection.scrollIntoView({ behavior: 'smooth' });
      return `<b style="color:var(--emerald);">Routing you to the Direct Connect form... Let's build something extraordinary!</b>`;
    },

    clear: () => {
      terminalBody.innerHTML = '';
      return '';
    }
  };

  function executeCommand(input) {
    const trimmed = input.trim().toLowerCase();
    if (!trimmed) return;

    const cmdRow = document.createElement('div');
    cmdRow.innerHTML = `<span class="term-line-prefix">rishith@terminal:~$</span> <span class="term-cmd-highlight">${input}</span>`;
    terminalBody.appendChild(cmdRow);

    if (commands[trimmed]) {
      const output = commands[trimmed]();
      if (output) {
        const outRow = document.createElement('div');
        outRow.style.margin = '4px 0 10px 0';
        outRow.innerHTML = output;
        terminalBody.appendChild(outRow);
      }
    } else {
      const errorRow = document.createElement('div');
      errorRow.style.color = '#F43F5E';
      errorRow.style.margin = '4px 0 10px 0';
      errorRow.innerHTML = `Command not recognized: "${trimmed}". Type <b style="color:var(--cyan);">help</b> to see all available commands.`;
      terminalBody.appendChild(errorRow);
    }

    terminalBody.scrollTop = terminalBody.scrollHeight;
    inputField.value = '';
  }

  inputField.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      executeCommand(inputField.value);
    }
  });

  // Quick Chips
  document.querySelectorAll('.term-chip-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const cmd = btn.dataset.cmd;
      executeCommand(cmd);
    });
  });
}

// ==========================================================================
// 6. PROJECTS MASONRY FILTERING
// ==========================================================================
function initProjectFiltering() {
  const filterBtns = document.querySelectorAll('.proj-filter-btn');
  const cards = document.querySelectorAll('.project-3d-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      cards.forEach(card => {
        const category = card.dataset.category;
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.opacity = '1';
          }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// ==========================================================================
// 7. SKILLS CATEGORY TABS
// ==========================================================================
function initSkillTabs() {
  const tabBtns = document.querySelectorAll('.skill-tab-btn');
  const skillCards = document.querySelectorAll('.skill-card-item');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.dataset.cat;
      skillCards.forEach(card => {
        if (cat === 'all' || card.dataset.category === cat) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Trigger progress bar widths on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fills = entry.target.querySelectorAll('.skill-bar-fill');
        fills.forEach(fill => {
          fill.style.width = fill.dataset.width;
        });
      }
    });
  }, { threshold: 0.2 });

  const skillsContainer = document.getElementById('skills');
  if (skillsContainer) observer.observe(skillsContainer);
}

// ==========================================================================
// 8. 3D CARD PERSPECTIVE TILT
// ==========================================================================
function init3DCardTilt() {
  const tiltCards = document.querySelectorAll('.project-3d-card, .spotlight-card, .hero-avatar-frame');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}

// ==========================================================================
// 9. SCROLL SPY & NAVBAR BLUR
// ==========================================================================
function initScrollSpyAndNav() {
  const navbar = document.getElementById('main-navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-item-link');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    if (navbar) {
      if (scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Scroll spy
    sections.forEach(sec => {
      const secHeight = sec.offsetHeight;
      const secTop = sec.offsetTop - 120;
      const secId = sec.getAttribute('id');

      if (scrollY > secTop && scrollY <= secTop + secHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${secId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });
}

// ==========================================================================
// 10. RESUME PDF VIEWER MODAL
// ==========================================================================
function openResumeModal() {
  const modal = document.getElementById('resume-modal');
  if (modal) modal.classList.add('active');
}

function closeResumeModal() {
  const modal = document.getElementById('resume-modal');
  if (modal) modal.classList.remove('active');
}

function initResumeModal() {
  const resumeBtn = document.getElementById('btn-open-resume');
  const modal = document.getElementById('resume-modal');
  const closeBtn = document.getElementById('btn-close-resume-modal');

  if (resumeBtn) resumeBtn.addEventListener('click', openResumeModal);
  if (closeBtn) closeBtn.addEventListener('click', closeResumeModal);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeResumeModal();
    });
  }
}

// ==========================================================================
// 11. CONTACT FORM HANDLING
// ==========================================================================
function initContactForm() {
  const form = document.getElementById('portfolio-contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('contact-name').value;
    const email = document.getElementById('contact-email').value;
    const message = document.getElementById('contact-msg').value;

    const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
    const body = encodeURIComponent(`Hi Rishith,\n\n${message}\n\nFrom: ${name} (${email})`);
    
    // Open default email client
    window.location.href = `mailto:rishithreddyc45@gmail.com?subject=${subject}&body=${body}`;

    alert(`Thank you, ${name}! Your email client will now open to dispatch your message to rishithreddyc45@gmail.com.`);
    form.reset();
  });
}
