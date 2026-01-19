// Basic interactivity for the portfolio
(function(){
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  const themeToggle = document.getElementById('themeToggle');
  const modal = document.getElementById('projectModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalLink = document.getElementById('modalLink');
  const modalClose = modal.querySelector('.modal-close');
  const yearEl = document.getElementById('year');

  yearEl.textContent = new Date().getFullYear();

  navToggle.addEventListener('click', ()=>{
    const expanded = mainNav.style.display === 'flex';
    mainNav.style.display = expanded ? '' : 'flex';
  });

  themeToggle.addEventListener('click', ()=>{
    document.documentElement.classList.toggle('light');
    document.body.classList.toggle('light');
  });

  // Project modal handlers
  document.querySelectorAll('.viewProject').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      const card = e.target.closest('.project');
      modalTitle.textContent = card.dataset.title;
      modalDesc.textContent = card.dataset.desc;
      modalLink.href = card.dataset.link || '#';
      modal.setAttribute('aria-hidden','false');
    });
  });
  modalClose.addEventListener('click', ()=> modal.setAttribute('aria-hidden','true'));
  modal.addEventListener('click', (e)=>{ if(e.target===modal) modal.setAttribute('aria-hidden','true'); });

  // Simple contact form handler (no backend) — validate and show success message
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const data = new FormData(form);
    const name = data.get('name').trim();
    const email = data.get('email').trim();
    const message = data.get('message').trim();
    if(!name || !email || !message){
      status.textContent = 'Please fill out all fields.';
      return;
    }
    status.textContent = 'Thanks — message sent (demo).';
    form.reset();
    setTimeout(()=> status.textContent = '', 3000);
  });

  // Dynamic color change for skills on mouse move
  const skillsList = document.querySelector('.skills-list');
  const skillsSection = document.getElementById('skills');
  if(skillsList && skillsSection){
    let raf = null;
    function setHue(x){
      const rect = skillsSection.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (x - rect.left) / rect.width));
      // map pct to hue between 180 and 320
      const hue = Math.round(180 + pct * 140);
      document.documentElement.style.setProperty('--hue', hue);
    }

    skillsSection.addEventListener('mousemove', (e)=>{
      if(raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(()=> setHue(e.clientX));
      skillsList.classList.add('active');
    });
    skillsSection.addEventListener('mouseleave', ()=>{
      skillsList.classList.remove('active');
      document.documentElement.style.setProperty('--hue', 220);
    });

    // touch support: use touchmove and touchend
    skillsSection.addEventListener('touchmove', (e)=>{
      const touch = e.touches[0];
      if(!touch) return;
      if(raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(()=> setHue(touch.clientX));
      skillsList.classList.add('active');
    }, {passive:true});
    skillsSection.addEventListener('touchend', ()=>{
      skillsList.classList.remove('active');
      document.documentElement.style.setProperty('--hue', 220);
    });
  }
})();

// mark inputs as filled when they have content
(function(){
  const controls = document.querySelectorAll('.contact-form input, .contact-form textarea');
  if(!controls) return;
  function check(el){
    if(el.value && el.value.trim() !== '') el.classList.add('filled'); else el.classList.remove('filled');
  }
  controls.forEach(c=>{
    // initial
    check(c);
    c.addEventListener('input', ()=> check(c));
    c.addEventListener('blur', ()=> check(c));
  });
})();

// project card hover tint based on cursor position
(function(){
  const cards = document.querySelectorAll('.project');
  if(!cards || cards.length===0) return;
  let raf = null;
  function setCardHue(card, x){
    const rect = card.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (x - rect.left) / rect.width));
    const hue = Math.round(200 + pct * 120); // 200..320
    card.style.setProperty('--proj-hue', hue);
  }
  cards.forEach(card=>{
    card.addEventListener('mousemove', (e)=>{
      if(raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(()=> setCardHue(card, e.clientX));
      card.classList.add('active');
    });
    card.addEventListener('mouseleave', ()=>{
      card.classList.remove('active');
    });
    card.addEventListener('touchmove', (e)=>{
      const t = e.touches[0]; if(!t) return;
      if(raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(()=> setCardHue(card, t.clientX));
      card.classList.add('active');
    }, {passive:true});
    card.addEventListener('touchend', ()=> card.classList.remove('active'));
  });
})();
