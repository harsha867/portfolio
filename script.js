/* ===================================================================
   T. Sri Harsha — Portfolio JavaScript
   Features: Loader, Custom Cursor, Navbar, Particles, Type Animation,
             Counter Animation, Skill Bars, Scroll Reveal, Smooth Nav
=================================================================== */

(function () {
  'use strict';

  /* ===========================
     1. DOM REFERENCES
  =========================== */
  const loader        = document.getElementById('loader');
  const cursor        = document.getElementById('cursor');
  const cursorFollow  = document.getElementById('cursor-follower');
  const navbar        = document.getElementById('navbar');
  const hamburger     = document.getElementById('hamburger');
  const navLinks      = document.getElementById('nav-links');
  const canvas        = document.getElementById('particles-canvas');
  const dynamicTitle  = document.getElementById('dynamic-title');

  /* ===========================
     2. LOADER
  =========================== */
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = 'auto';
      initCounters();
    }, 1200);
  });

  /* ===========================
     3. CUSTOM CURSOR
  =========================== */
  if (window.innerWidth > 640) {
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top  = mouseY + 'px';
    });

    function animateFollower() {
      followerX += (mouseX - followerX) * 0.12;
      followerY += (mouseY - followerY) * 0.12;
      cursorFollow.style.left = followerX + 'px';
      cursorFollow.style.top  = followerY + 'px';
      requestAnimationFrame(animateFollower);
    }
    animateFollower();

    document.querySelectorAll('a, button, .tech-tag, .skill-category, .project-card').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(2)';
        cursorFollow.style.transform = 'translate(-50%, -50%) scale(1.5)';
        cursorFollow.style.borderColor = 'rgba(0, 212, 255, 0.7)';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorFollow.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorFollow.style.borderColor = 'rgba(0, 212, 255, 0.4)';
      });
    });
  }

  /* ===========================
     4. NAVBAR — SCROLL
  =========================== */
  const navLinkItems = document.querySelectorAll('.nav-link');
  const sections     = document.querySelectorAll('section[id]');

  function onScroll() {
    // Scrolled class
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active nav link
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) {
        current = sec.getAttribute('id');
      }
    });
    navLinkItems.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  /* ===========================
     5. HAMBURGER MENU
  =========================== */
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close menu on nav link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  /* ===========================
     6. PARTICLES CANVAS
  =========================== */
  function initParticles() {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const COUNT = Math.min(80, Math.floor(canvas.width * canvas.height / 18000));
    const particles = [];

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x    = Math.random() * canvas.width;
        this.y    = Math.random() * canvas.height;
        this.vx   = (Math.random() - 0.5) * 0.4;
        this.vy   = (Math.random() - 0.5) * 0.4;
        this.size = Math.random() * 2 + 0.5;
        this.alpha = Math.random() * 0.5 + 0.1;
        this.color = Math.random() > 0.5 ? '37, 99, 235' : '6, 182, 212';
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width)  this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height)  this.vy *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < COUNT; i++) particles.push(new Particle());

    function drawLines() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx   = particles[i].x - particles[j].x;
          const dy   = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.15;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(37, 99, 235, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      drawLines();
      requestAnimationFrame(animate);
    }
    animate();
  }
  initParticles();

  /* ===========================
     7. TYPEWRITER EFFECT
  =========================== */
  const titles = [
    'Aspiring Data Analyst',
    'Data Science Enthusiast',
    'Machine Learning Learner',
    'Python Developer',
    'Problem Solver',
  ];
  let titleIdx  = 0;
  let charIdx   = 0;
  let isDeleting = false;
  let typeDelay  = 100;

  function typeWriter() {
    if (!dynamicTitle) return;
    const current = titles[titleIdx];

    if (!isDeleting) {
      dynamicTitle.textContent = current.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        isDeleting = true;
        typeDelay  = 1800; // pause before deleting
      } else {
        typeDelay = 80;
      }
    } else {
      dynamicTitle.textContent = current.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        isDeleting = false;
        titleIdx   = (titleIdx + 1) % titles.length;
        typeDelay  = 300;
      } else {
        typeDelay = 40;
      }
    }
    setTimeout(typeWriter, typeDelay);
  }
  setTimeout(typeWriter, 1400);

  /* ===========================
     8. COUNTER ANIMATION
  =========================== */
  function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    counters.forEach(counter => {
      const target   = parseInt(counter.dataset.count);
      const duration = 1800;
      const start    = performance.now();
      const isYear   = target > 1000;

      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased    = 1 - Math.pow(1 - progress, 3);
        const value    = isYear
          ? Math.round(2020 + (target - 2020) * eased)
          : Math.round(target * eased);
        counter.textContent = value;
        if (progress < 1) requestAnimationFrame(update);
        else counter.textContent = target;
      }
      requestAnimationFrame(update);
    });
  }

  /* ===========================
     9. SCROLL REVEAL
  =========================== */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  // Add reveal class to sections
  document.querySelectorAll('.skill-category, .project-card, .ach-card, .contact-card, .achievement-col').forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
  });

  // Timeline items
  document.querySelectorAll('.timeline-item').forEach(el => {
    revealObserver.observe(el);
  });

  /* ===========================
     10. SKILL BARS
  =========================== */
  const skillBarObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.skill-fill').forEach(bar => {
          const width = bar.dataset.width;
          setTimeout(() => { bar.style.width = width + '%'; }, 200);
        });
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.skill-category').forEach(cat => skillBarObserver.observe(cat));

  /* ===========================
     11. SMOOTH SCROLL
  =========================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ===========================
     12. PROJECT CARD TILT
  =========================== */
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const cx     = rect.width  / 2;
      const cy     = rect.height / 2;
      const tiltX  = ((y - cy) / cy) * -6;
      const tiltY  = ((x - cx) / cx) * 6;
      card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ===========================
     13. SECTION TAG REVEAL
  =========================== */
  const sectionTagObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.section-header').forEach(header => {
    header.style.opacity = '0';
    header.style.transform = 'translateY(20px)';
    header.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    sectionTagObserver.observe(header);
  });

  /* ===========================
     14. ORBIT ICONS — PAUSE ON HOVER
  =========================== */
  const avatarOrbit = document.querySelector('.avatar-orbit');
  if (avatarOrbit) {
    avatarOrbit.addEventListener('mouseenter', () => {
      avatarOrbit.style.animationPlayState = 'paused';
    });
    avatarOrbit.addEventListener('mouseleave', () => {
      avatarOrbit.style.animationPlayState = 'running';
    });
  }

  /* ===========================
     15. TECH TAG STAGGER
  =========================== */
  const techTagObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.tech-tag').forEach((tag, i) => {
          tag.style.transitionDelay = `${i * 40}ms`;
          tag.style.opacity = '1';
          tag.style.transform = 'translateY(0)';
        });
      }
    });
  }, { threshold: 0.2 });

  const techTagsSection = document.querySelector('.tech-tags-section');
  if (techTagsSection) {
    document.querySelectorAll('.tech-tag').forEach(tag => {
      tag.style.opacity = '0';
      tag.style.transform = 'translateY(10px)';
      tag.style.transition = 'opacity 0.4s ease, transform 0.4s ease, background 0.3s ease, border-color 0.3s ease, color 0.3s ease';
    });
    techTagObserver.observe(techTagsSection);
  }

})();
