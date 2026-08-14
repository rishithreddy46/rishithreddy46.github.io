/* ============================================================
   PORTFOLIO SCRIPT — Rishith Reddy
   All interactivity & animations
============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  gsap.registerPlugin(ScrollTrigger);

  /* ==========================================================
     0. PRELOADER
  ========================================================== */
  const preloader = document.getElementById('preloader');
  const preloaderFill = document.getElementById('preloaderFill');
  const preloaderPercent = document.getElementById('preloaderPercent');

  let progress = 0;
  const loadInterval = setInterval(() => {
    progress += Math.random() * 18;
    if (progress >= 100) {
      progress = 100;
      clearInterval(loadInterval);
      preloaderFill.style.width = '100%';
      preloaderPercent.textContent = '100%';
      setTimeout(() => {
        preloader.classList.add('loaded');
        document.body.style.overflow = '';
        playHeroIntro();
        ScrollTrigger.refresh();
      }, 400);
    } else {
      preloaderFill.style.width = progress + '%';
      preloaderPercent.textContent = Math.floor(progress) + '%';
    }
  }, 150);

  document.body.style.overflow = 'hidden';

  /* ==========================================================
     1. CUSTOM CURSOR
  ========================================================== */
  const cursorDot = document.getElementById('cursorDot');
  const cursorOutline = document.getElementById('cursorOutline');
  const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  if (!isTouch) {
    let mouseX = 0, mouseY = 0;
    let outlineX = 0, outlineY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top = mouseY + 'px';
    });

    function animateOutline() {
      outlineX += (mouseX - outlineX) * 0.18;
      outlineY += (mouseY - outlineY) * 0.18;
      cursorOutline.style.left = outlineX + 'px';
      cursorOutline.style.top = outlineY + 'px';
      requestAnimationFrame(animateOutline);
    }
    animateOutline();

    const hoverTargets = 'a, button, .magnetic, .project-card, .stat-box, input, textarea, .filter-btn';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(hoverTargets)) cursorOutline.classList.add('hovered');
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(hoverTargets)) cursorOutline.classList.remove('hovered');
    });
  } else {
    cursorDot.style.display = 'none';
    cursorOutline.style.display = 'none';
  }

  /* ==========================================================
     2. SCROLL PROGRESS BAR
  ========================================================== */
  const scrollProgress = document.getElementById('scrollProgress');
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = (scrollTop / docHeight) * 100;
    scrollProgress.style.width = pct + '%';
  });

  /* ==========================================================
     3. NAVBAR: scroll shrink + active link indicator
  ========================================================== */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const navIndicator = document.getElementById('navIndicator');
  const sections = document.querySelectorAll('main section, .hero');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    toggleBackToTop();
  });

  function moveIndicator(el) {
    if (!el) return;
    navIndicator.style.width = el.offsetWidth + 'px';
    navIndicator.style.transform = `translateX(${el.offsetLeft}px)`;
  }

  function setActiveLink(link) {
    navLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    moveIndicator(link);
  }

  navLinks.forEach(link => {
    link.addEventListener('click', () => setActiveLink(link));
    link.addEventListener('mouseenter', () => moveIndicator(link));
  });

  document.querySelector('.nav-links').addEventListener('mouseleave', () => {
    const activeLink = document.querySelector('.nav-link.active');
    moveIndicator(activeLink);
  });

  // init indicator position after fonts/layout settle
  window.addEventListener('load', () => {
    moveIndicator(document.querySelector('.nav-link.active'));
  });

  // IntersectionObserver to update active link on scroll
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        const matchingLink = document.querySelector(`.nav-link[data-section="${id}"]`);
        if (matchingLink) setActiveLink(matchingLink);
      }
    });
  }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

  sections.forEach(sec => { if (sec.id) sectionObserver.observe(sec); });

  /* ==========================================================
     4. MOBILE MENU
  ========================================================== */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
  });
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
    });
  });

  /* ==========================================================
     5. THEME TOGGLE
  ========================================================== */
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;
  const savedTheme = localStorage.getItem('portfolio-theme');
  if (savedTheme) root.setAttribute('data-theme', savedTheme);

  themeToggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    if (current === 'light') {
      root.setAttribute('data-theme', 'light');
    } else {
      root.removeAttribute('data-theme');
    }
    localStorage.setItem('portfolio-theme', current);
  });

  /* ==========================================================
     6. MAGNETIC BUTTONS
  ========================================================== */
  if (!isTouch) {
    document.querySelectorAll('.magnetic').forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(el, { x: x * 0.35, y: y * 0.45, duration: 0.4, ease: 'power2.out' });
      });
      el.addEventListener('mouseleave', () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
      });
    });
  }

  /* ==========================================================
     7. HERO INTRO ANIMATION (Compound / Timeline)
  ========================================================== */
  function playHeroIntro() {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    tl.from('.hero-badge', { y: -30, opacity: 0, duration: 0.7 })
      .from('[data-line] [data-split]', {
        y: '110%',
        opacity: 0,
        duration: 1,
        stagger: 0.15
      }, '-=0.3')
      .from('.hero-role', { y: 30, opacity: 0, duration: 0.7 }, '-=0.5')
      .from('.hero-desc', { y: 30, opacity: 0, duration: 0.7 }, '-=0.5')
      .from('.hero-buttons', { y: 30, opacity: 0, duration: 0.7 }, '-=0.5')
      .from('.hero-socials', { y: 30, opacity: 0, duration: 0.7 }, '-=0.5')
      .from('.orbit-wrapper', { scale: 0.5, opacity: 0, duration: 1.2, ease: 'elastic.out(1, 0.6)' }, '-=1.2')
      .from('.scroll-down', { opacity: 0, y: -10, duration: 0.6 }, '-=0.4');

    // remove reveal-up class effect duplication on hero-badge etc. (already animated via GSAP -> mark in-view)
    document.querySelectorAll('.hero .reveal-up').forEach(el => el.classList.add('in-view'));
  }

  /* ==========================================================
     8. TYPEWRITER EFFECT
  ========================================================== */
  const roles = [
    'Web Developer',
    'Software Engineer',
    'Full-Stack Enthusiast',
    'Problem Solver',
    'B.Tech Final Year Student'
  ];
  const typewriterEl = document.getElementById('typewriter');
  let roleIndex = 0, charIndex = 0, isDeleting = false;

  function typeLoop() {
    const currentRole = roles[roleIndex];
    if (!isDeleting) {
      charIndex++;
      typewriterEl.textContent = currentRole.substring(0, charIndex);
      if (charIndex === currentRole.length) {
        isDeleting = true;
        setTimeout(typeLoop, 1600);
        return;
      }
    } else {
      charIndex--;
      typewriterEl.textContent = currentRole.substring(0, charIndex);
      if (charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }
    setTimeout(typeLoop, isDeleting ? 40 : 90);
  }
  typeLoop();

  /* ==========================================================
     9. SCROLL REVEAL ANIMATIONS (reveal-up/left/right)
  ========================================================== */
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('in-view'), i * 60);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => {
    // hero elements are already handled by GSAP timeline
    if (!el.closest('.hero')) revealObserver.observe(el);
  });

  /* ==========================================================
     10. COUNTER ANIMATION
  ========================================================== */
  const counters = document.querySelectorAll('.counter');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));

  function animateCounter(el) {
    const target = parseFloat(el.getAttribute('data-count'));
    const isDecimal = target % 1 !== 0;
    let current = 0;
    const duration = 1800;
    const startTime = performance.now();

    function update(time) {
      const elapsed = time - startTime;
      const progressRatio = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progressRatio, 3);
      current = target * eased;
      el.textContent = isDecimal ? current.toFixed(1) : Math.floor(current);
      if (progressRatio < 1) requestAnimationFrame(update);
      else el.textContent = isDecimal ? target.toFixed(1) : target;
    }
    requestAnimationFrame(update);
  }

  /* ==========================================================
     11. SKILL BARS ANIMATION
  ========================================================== */
  const barFills = document.querySelectorAll('.bar-fill');
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const width = entry.target.getAttribute('data-width');
        entry.target.style.width = width + '%';
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  barFills.forEach(b => barObserver.observe(b));

  /* ==========================================================
     12. PROJECT FILTER
  ========================================================== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  function applyFilter(filter) {
    projectCards.forEach(card => {
      const match = filter === 'all' || card.getAttribute('data-category') === filter;
      card.classList.toggle('show', match);
      if (match) {
        gsap.fromTo(card, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
      }
    });
  }
  applyFilter('all');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilter(btn.getAttribute('data-filter'));
    });
  });

  /* ==========================================================
     13. TILT EFFECT ON PROJECT CARDS & ABOUT FRAME
  ========================================================== */
  if (!isTouch) {
    document.querySelectorAll('.tilt-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;
        gsap.to(card, {
          rotateX, rotateY,
          transformPerspective: 900,
          duration: 0.4,
          ease: 'power2.out'
        });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'power3.out' });
      });
    });

    const aboutFrame = document.getElementById('aboutFrame');
    if (aboutFrame) {
      aboutFrame.addEventListener('mousemove', (e) => {
        const rect = aboutFrame.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rotateX = ((y - rect.height / 2) / rect.height) * -14;
        const rotateY = ((x - rect.width / 2) / rect.width) * 14;
        gsap.to(aboutFrame, { rotateX, rotateY, transformPerspective: 900, duration: 0.4, ease: 'power2.out' });
      });
      aboutFrame.addEventListener('mouseleave', () => {
        gsap.to(aboutFrame, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'power3.out' });
      });
    }
  }

  /* ==========================================================
     14. TIMELINE LINE DRAW ON SCROLL
  ========================================================== */
  const timelineLine = document.getElementById('timelineLine');
  const timeline = document.getElementById('timeline');
  if (timelineLine && timeline) {
    ScrollTrigger.create({
      trigger: timeline,
      start: 'top 70%',
      end: 'bottom 80%',
      scrub: 0.6,
      onUpdate: (self) => {
        timelineLine.style.height = (self.progress * 100) + '%';
      }
    });
  }

  /* ==========================================================
     15. GSAP SCROLL-TRIGGERED SECTION TITLE PARALLAX
  ========================================================== */
  gsap.utils.toArray('.section-title').forEach(title => {
    gsap.fromTo(title, { y: 40, opacity: 0 }, {
      y: 0, opacity: 1, duration: 1,
      scrollTrigger: { trigger: title, start: 'top 90%' }
    });
  });

  // Parallax blobs on scroll
  gsap.to('.blob-1', { y: 150, scrollTrigger: { scrub: 1 } });
  gsap.to('.blob-2', { y: -120, scrollTrigger: { scrub: 1 } });
  gsap.to('.blob-3', { y: 100, scrollTrigger: { scrub: 1 } });

  /* ==========================================================
     16. CONTACT FORM SUBMIT (front-end demo)
  ========================================================== */
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  const submitText = document.getElementById('submitText');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    submitText.textContent = 'Sending...';

    setTimeout(() => {
      submitText.textContent = 'Send Message';
      formSuccess.classList.add('show');
      contactForm.reset();
      setTimeout(() => formSuccess.classList.remove('show'), 4000);
    }, 1200);
  });

  /* ==========================================================
     17. BACK TO TOP
  ========================================================== */
  const backToTop = document.getElementById('backToTop');
  function toggleBackToTop() {
    backToTop.classList.toggle('show', window.scrollY > 500);
  }
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ==========================================================
     18. FOOTER YEAR
  ========================================================== */
  document.getElementById('year').textContent = new Date().getFullYear();

});
