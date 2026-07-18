document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // --- THEME TOGGLE (LIGHT / DARK) ---
  const themeToggleBtn = document.getElementById('theme-toggle');
  const body = document.body;

  themeToggleBtn.addEventListener('click', () => {
    body.classList.toggle('light-mode');
    body.classList.toggle('dark-mode');
    
    // Save preference to localStorage
    const currentTheme = body.classList.contains('light-mode') ? 'light' : 'dark';
    localStorage.setItem('theme', currentTheme);
  });

  // Load theme preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    body.classList.remove('dark-mode');
    body.classList.add('light-mode');
  }

  // --- MOBILE NAV MENU ---
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  function toggleMobileMenu() {
    mobileNavToggle.classList.toggle('active');
    mobileMenuOverlay.classList.toggle('active');
    
    const menuIcon = mobileNavToggle.querySelector('.menu-icon');
    const closeIcon = mobileNavToggle.querySelector('.close-icon');
    
    if (mobileMenuOverlay.classList.contains('active')) {
      menuIcon.style.display = 'none';
      closeIcon.style.display = 'block';
      document.body.style.overflow = 'hidden'; // Disable scroll
    } else {
      menuIcon.style.display = 'block';
      closeIcon.style.display = 'none';
      document.body.style.overflow = 'auto'; // Enable scroll
    }
  }

  mobileNavToggle.addEventListener('click', toggleMobileMenu);
  
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileMenuOverlay.classList.contains('active')) {
        toggleMobileMenu();
      }
    });
  });

  // --- TYPEWRITER EFFECT IN HERO ---
  const roleTextSpan = document.getElementById('role-text');
  const roles = [
    'MBA INCAE',
    'Ingeniero Industrial',
    'Geólogo',
    'Líder en Gobierno Tecnológico',
    'Especialista en Estrategia de IA'
  ];
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function typeEffect() {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
      // Deleting letters
      roleTextSpan.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      // Typing letters
      roleTextSpan.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }

    // Handle lifecycle states
    if (!isDeleting && charIndex === currentRole.length) {
      // Pause at full word
      isDeleting = true;
      typingSpeed = 2000; // Wait 2s before deleting
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 500; // Pause before typing next word
    }

    setTimeout(typeEffect, typingSpeed);
  }

  // Start the typewriter effect
  if (roleTextSpan) {
    typeEffect();
  }

  // --- TIMELINE FILTERING ---
  const filterButtons = document.querySelectorAll('.filter-btn');
  const timelineItems = document.querySelectorAll('.timeline-item');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons and add to clicked
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      timelineItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  // --- COLLAPSIBLE DETAILS FOR JOB 1 ---
  const collapsibleTrigger = document.querySelector('.collapsible-trigger');
  const collapsibleContent = document.querySelector('.collapsible-content');

  if (collapsibleTrigger && collapsibleContent) {
    collapsibleTrigger.addEventListener('click', () => {
      collapsibleTrigger.classList.toggle('active');
      collapsibleContent.classList.toggle('expanded');
      
      const triggerText = collapsibleTrigger.querySelector('span');
      if (collapsibleContent.classList.contains('expanded')) {
        triggerText.textContent = 'Ocultar áreas a cargo y detalles';
      } else {
        triggerText.textContent = 'Ver áreas a cargo y detalles';
      }
    });
  }

  // --- PRINT / PDF EXPORT MODAL ---
  const printModal = document.getElementById('print-modal');
  const openModalBtns = [
    document.getElementById('download-cv'),
    document.getElementById('download-cv-mobile'),
    document.getElementById('print-direct')
  ];
  const closeModalBtns = [
    document.getElementById('close-modal'),
    document.getElementById('cancel-print')
  ];
  const proceedPrintBtn = document.getElementById('proceed-print');

  function openPrintModal() {
    printModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closePrintModal() {
    printModal.classList.add('hidden');
    document.body.style.overflow = 'auto';
  }

  openModalBtns.forEach(btn => {
    if (btn) btn.addEventListener('click', openPrintModal);
  });

  closeModalBtns.forEach(btn => {
    if (btn) btn.addEventListener('click', closePrintModal);
  });

  if (proceedPrintBtn) {
    proceedPrintBtn.addEventListener('click', () => {
      closePrintModal();
      
      // Expand the collapsible section temporarily before printing to ensure all text is printed
      const isAlreadyExpanded = collapsibleContent ? collapsibleContent.classList.contains('expanded') : false;
      if (collapsibleContent && !isAlreadyExpanded) {
        collapsibleContent.classList.add('expanded');
      }
      
      // Delay printing slightly to let layout adjust
      setTimeout(() => {
        window.print();
        
        // Restore collapse state if it was collapsed before
        if (collapsibleContent && !isAlreadyExpanded) {
          collapsibleContent.classList.remove('expanded');
        }
      }, 300);
    });
  }

  // Close modal when clicking outside the content card
  printModal.addEventListener('click', (e) => {
    if (e.target === printModal) {
      closePrintModal();
    }
  });

  // --- QUICK CLIPBOARD COPY FOR EMAIL ---
  const copyEmailBtn = document.getElementById('copy-email');
  const toastMessage = document.getElementById('toast-message');

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const emailText = 'leovab@gmail.com';
      
      // Use clipboard API
      navigator.clipboard.writeText(emailText).then(() => {
        // Show Toast
        toastMessage.classList.remove('hidden');
        toastMessage.style.opacity = '1';
        
        // Hide Toast after 2.5 seconds
        setTimeout(() => {
          toastMessage.style.opacity = '0';
          setTimeout(() => {
            toastMessage.classList.add('hidden');
          }, 300);
        }, 2500);
      }).catch(err => {
        console.error('No se pudo copiar el correo: ', err);
      });
    });
  }

  // --- DYNAMIC NAV LINK HIGHLIGHTING ON SCROLL ---
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function scrollActive() {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const matchingLink = document.querySelector(`.nav-menu a[href*=${sectionId}]`);

      if (matchingLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          matchingLink.classList.add('active');
        } else {
          matchingLink.classList.remove('active');
        }
      }
    });
  }

  window.addEventListener('scroll', scrollActive);

  // --- CARD MOUSE GLOW EFFECT ---
  const glassCards = document.querySelectorAll('.glass');
  glassCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // --- TECH DATA FLOW CANVAS BACKGROUND ---
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    let mouse = { x: null, y: null, radius: 150 };

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
    window.addEventListener('mouseout', () => {
      mouse.x = null;
      mouse.y = null;
    });

    class DataNode {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 0.5;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
        if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

        // Interaction
        if (mouse.x !== null && mouse.y !== null) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouse.radius) {
            const force = (mouse.radius - distance) / mouse.radius;
            this.x -= (dx / distance) * force * 2;
            this.y -= (dy / distance) * force * 2;
          }
        }
      }
      draw() {
        const isLight = document.body.classList.contains('light-mode');
        ctx.fillStyle = isLight ? 'rgba(16, 185, 129, 0.4)' : 'rgba(16, 185, 129, 0.6)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function initDataFlow() {
      particlesArray = [];
      const numberOfNodes = Math.floor((canvas.width * canvas.height) / 10000);
      for (let i = 0; i < numberOfNodes; i++) {
        particlesArray.push(new DataNode());
      }
    }
    initDataFlow();
    window.addEventListener('resize', initDataFlow);

    function connectNodes() {
      const isLight = document.body.classList.contains('light-mode');
      let maxDistance = 120;
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          let dx = particlesArray[a].x - particlesArray[b].x;
          let dy = particlesArray[a].y - particlesArray[b].y;
          let distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            let opacity = 1 - (distance / maxDistance);
            ctx.strokeStyle = isLight ? `rgba(16, 185, 129, ${opacity * 0.25})` : `rgba(16, 185, 129, ${opacity * 0.15})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }
      }
    }

    function animateDataFlow() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }
      connectNodes();
      requestAnimationFrame(animateDataFlow);
    }
    animateDataFlow();
  }
});
