// script.js — advanced JS features for Assignment 6
// All features: DOM manipulation, events, keyboard navigation, animations, sound, theme toggle

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------
     Data: places (objects array)
     --------------------------- */
  const places = [
    { id: 1, name: "Big Almaty Lake", image: "images/big_almaty_lake.jpg", short: "Mountain lake with turquoise water.", long: "Big Almaty Lake is a beautiful high-altitude reservoir surrounded by alpine scenery. Great for photography and short hikes." },
    { id: 2, name: "Charyn Canyon", image: "images/charyn_canyon.jpg", short: "Canyon with unique rock formations.", long: "Charyn Canyon is known for its red sandstone cliffs and scenic valleys. Bring water and good footwear." },
    { id: 3, name: "Kaindy Lake", image: "images/kaindy.jpeg", short: "Submerged forest lake.", long: "Kaindy Lake is famous for the submerged pine trunks that protrude from the clear water — very photogenic." },
    { id: 4, name: "Kolsai Lakes", image: "images/kolsai.jpeg", short: "Chain of alpine lakes in a forest.", long: "Kolsai Lakes offer several levels of alpine lakes connected by hiking trails; a peaceful nature escape." }
  ];

  /* ---------------------------
     Render places cards (DOM, loops)
     --------------------------- */
  const placesContainer = document.getElementById('places-container');
  if (placesContainer) {
    placesContainer.innerHTML = '';
    places.forEach(place => {
      const col = document.createElement('div');
      col.className = 'col-12 col-md-6 col-lg-4';
      col.innerHTML = `
        <div class="card h-100">
          <img src="${place.image}" alt="${place.name}" class="place-img card-img-top">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${place.name}</h5>
            <p class="card-text description" data-short="${place.short}" data-long="${place.long}">${place.short}</p>
            <div class="mt-auto d-flex justify-content-between align-items-center">
              <div class="rating" data-id="${place.id}" aria-label="Rating for ${place.name}"></div>
              <div>
                <button class="btn btn-sm btn-readmore">Read more</button>
              </div>
            </div>
          </div>
        </div>`;
      placesContainer.appendChild(col);

      // create star rating inside the rating container
      const ratingEl = col.querySelector('.rating');
      createStarRating(ratingEl);
      loadStoredRating(ratingEl);
    });
  }

  /* ---------------------------
     Read more toggle (delegation)
     --------------------------- */
  document.body.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-readmore')) {
      const btn = e.target;
      const desc = btn.closest('.card').querySelector('.description');
      if (!desc) return;
      const expanded = btn.getAttribute('data-expanded') === 'true';
      if (expanded) {
        desc.textContent = desc.dataset.short;
        btn.textContent = 'Read more';
        btn.setAttribute('data-expanded', 'false');
      } else {
        desc.textContent = desc.dataset.long;
        btn.textContent = 'Read less';
        btn.setAttribute('data-expanded', 'true');
      }
    }
  });

  /* ---------------------------
     Create star rating buttons
     --------------------------- */
  function createStarRating(container) {
    if (!container) return;
    container.innerHTML = '';
    for (let i = 1; i <= 5; i++) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'star-btn';
      btn.setAttribute('data-value', i);
      btn.setAttribute('aria-label', i + ' star');
      btn.innerHTML = '★';
      container.appendChild(btn);
    }

    // click handler (delegated on container)
    container.addEventListener('click', (ev) => {
      const btn = ev.target.closest('button[data-value]');
      if (!btn) return;
      const value = parseInt(btn.dataset.value, 10);
      setStarVisuals(container, value);
      const id = container.dataset.id;
      if (id) localStorage.setItem('rating_' + id, value);
      playClickTone();
    });
  }

  function setStarVisuals(container, value) {
    container.querySelectorAll('button[data-value]').forEach(b => {
      const v = parseInt(b.dataset.value, 10);
      if (v <= value) b.classList.add('on'); else b.classList.remove('on');
    });
  }

  function loadStoredRating(container) {
    const id = container.dataset.id;
    if (!id) return;
    const stored = localStorage.getItem('rating_' + id);
    if (stored) setStarVisuals(container, parseInt(stored, 10));
  }

  /* ---------------------------
     Gallery: thumbnails change main image; keyboard navigation
     --------------------------- */
  const mainImg = document.getElementById('gallery-main-img');
  const thumbButtons = Array.from(document.querySelectorAll('.thumb'));
  let activeThumb = 0;
  if (thumbButtons.length) {
    // set tabindex and event listeners
    thumbButtons.forEach((btn, idx) => {
      btn.setAttribute('tabindex', '0');
      btn.addEventListener('click', () => {
        const src = btn.getAttribute('data-src');
        if (src && mainImg) mainImg.src = src;
        thumbButtons.forEach(t => t.classList.remove('active'));
        btn.classList.add('active');
        activeThumb = idx;
        playClickTone();
      });
      btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); btn.click(); }
      });
    });

    // keyboard nav for gallery (global)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        activeThumb = (activeThumb + 1) % thumbButtons.length;
        thumbButtons[activeThumb].focus();
        thumbButtons[activeThumb].click();
      } else if (e.key === 'ArrowLeft') {
        activeThumb = (activeThumb - 1 + thumbButtons.length) % thumbButtons.length;
        thumbButtons[activeThumb].focus();
        thumbButtons[activeThumb].click();
      }
    });
  }

  /* ---------------------------
     Show current time button
     --------------------------- */
  const timeBtn = document.getElementById('show-time-btn');
  const timeDisplay = document.getElementById('time-display');
  if (timeBtn && timeDisplay) {
    timeBtn.addEventListener('click', () => {
      const now = new Date();
      timeDisplay.textContent = now.toLocaleTimeString();
      playClickTone();
    });
  }

  /* ---------------------------
     Theme toggle (day/night) with CSS variables
     --------------------------- */
  const themeButtons = Array.from(document.querySelectorAll('.theme-toggle'));
  function applySavedTheme() {
    if (localStorage.getItem('site-theme') === 'night') {
      document.body.classList.add('dark-mode');
      themeButtons.forEach(b => b.setAttribute('aria-pressed', 'true'));
    } else {
      document.body.classList.remove('dark-mode');
      themeButtons.forEach(b => b.setAttribute('aria-pressed', 'false'));
    }
  }
  themeButtons.forEach(btn => btn.addEventListener('click', () => {
    const isNight = document.body.classList.toggle('dark-mode');
    btn.setAttribute('aria-pressed', String(isNight));
    if (isNight) localStorage.setItem('site-theme', 'night'); else localStorage.removeItem('site-theme');
  }));
  applySavedTheme();

  /* ---------------------------
     Greeting by time (switch)
     --------------------------- */
  const greetEl = document.getElementById('greeting');
  if (greetEl) {
    const hour = new Date().getHours();
    let mode;
    if (hour < 12) mode = 'morning';
    else if (hour < 18) mode = 'afternoon';
    else mode = 'evening';

    switch (mode) {
      case 'morning': greetEl.textContent = 'Good morning'; break;
      case 'afternoon': greetEl.textContent = 'Good afternoon'; break;
      default: greetEl.textContent = 'Good evening'; break;
    }
  }

  /* ---------------------------
     Contact form: simulated async POST
     --------------------------- */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    const feedback = document.getElementById('contact-feedback');
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.textContent = 'Sending...';
      // simulate async request
      setTimeout(() => {
        btn.disabled = false;
        btn.textContent = 'Send message';
        if (feedback) {
          feedback.innerHTML = `<div class="alert alert-success">Message sent (simulation). Thank you!</div>`;
        }
        contactForm.reset();
        playClickTone();
      }, 900);
    });
  }

  /* ---------------------------
     Tips keyboard navigation
     --------------------------- */
  const tips = Array.from(document.querySelectorAll('.tip'));
  let tipIndex = 0;
  if (tips.length) {
    // highlight first
    tips.forEach(t => t.classList.remove('focused-tip'));
    tips[0].classList.add('focused-tip');

    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        tips[tipIndex].classList.remove('focused-tip');
        tipIndex = (tipIndex + 1) % tips.length;
        tips[tipIndex].classList.add('focused-tip');
        tips[tipIndex].focus();
      } else if (e.key === 'ArrowLeft') {
        tips[tipIndex].classList.remove('focused-tip');
        tipIndex = (tipIndex - 1 + tips.length) % tips.length;
        tips[tipIndex].classList.add('focused-tip');
        tips[tipIndex].focus();
      }
    });
  }

  /* ---------------------------
     Higher-order function example
     --------------------------- */
  window.filterPlaces = function(minRating, callback) {
    // example usage: filterPlaces(4, res => console.log(res));
    const results = places.filter(p => {
      const stored = localStorage.getItem('rating_' + p.id);
      const r = stored ? parseInt(stored, 10) : 0;
      return r >= minRating;
    });
    if (typeof callback === 'function') callback(results);
  };

  /* ---------------------------
     Sound: WebAudio click tone (short)
     --------------------------- */
  function playClickTone() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = 700;
      g.gain.value = 0.03;
      o.connect(g); g.connect(ctx.destination);
      o.start();
      setTimeout(() => { o.stop(); ctx.close(); }, 120);
    } catch (err) {
      // ignore if not allowed
      // console.warn('Audio error', err);
    }
  }

  /* ---------------------------
     Small helpers: set initial states
     --------------------------- */
  // if gallery present, ensure first thumb active
  if (thumbButtons.length && mainImg) {
    thumbButtons.forEach(b => b.classList.remove('active'));
    thumbButtons[0].classList.add('active');
  }
});}



  /* ===== Task 3: Popup subscription/contact form ===== */
  const openPopup = document.getElementById('open-popup');
  function createModal(){
    // modal HTML
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.innerHTML = `
      <div class="modal" role="dialog" aria-modal="true">
        <button class="close" aria-label="Close">&times;</button>
        <h3>Subscribe</h3>
        <form id="popup-form" class="simple-form">
          <label for="popup-email">Email</label>
          <input id="popup-email" name="email" type="text" placeholder="you@example.com" required>
          <label for="popup-password">Password</label>
          <input id="popup-password" name="password" type="password" placeholder="min 6 chars" required>
          <label for="popup-password2">Confirm password</label>
          <input id="popup-password2" name="password2" type="password" placeholder="confirm" required>
          <button class="btn submit" type="submit">Subscribe</button>
        </form>
      </div>
    `;
    document.body.appendChild(backdrop);
    // events
    backdrop.addEventListener('click', function(e){
      if(e.target === backdrop) backdrop.remove();
    });
    backdrop.querySelector('.close').addEventListener('click', function(){ backdrop.remove(); });
    // attach validation for popup form (reuse validateForm function)
    const popupForm = document.getElementById('popup-form');
    popupForm.addEventListener('submit', function(e){
      e.preventDefault();
      const email = popupForm.querySelector('input[name="email"]').value.trim();
      const p1 = popupForm.querySelector('input[name="password"]').value;
      const p2 = popupForm.querySelector('input[name="password2"]').value;
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if(!emailRe.test(email)){
        alert('Please enter a valid email');
        return;
      }
      if(p1.length < 6){ alert('Password too short'); return; }
      if(p1 !== p2){ alert('Passwords do not match'); return; }
      alert('Thank you for subscribing!');
      backdrop.remove();
    });
  }
  if(openPopup) openPopup.addEventListener('click', createModal);

  /* ===== Task 2: Accordion ===== */
  const accItems = document.querySelectorAll('.accordion-item');
  accItems.forEach(item => {
    const title = item.querySelector('.accordion-title');
    const content = item.querySelector('.accordion-content');
    title.addEventListener('click', function(){
      const open = item.classList.toggle('open');
      if(open){
        content.style.maxHeight = content.scrollHeight + 'px';
      } else {
        content.style.maxHeight = null;
      }
    });
    if(item.classList.contains('open')){
      content.style.maxHeight = content.scrollHeight + 'px';
    }
  });

  /* ===== Task 1: Form validation for contact form ===== */
  const contactForm = document.getElementById('contact-form');
  if(contactForm){
    contactForm.addEventListener('submit', function(e){
      e.preventDefault();
      clearErrors(contactForm);
      let ok = true;
      const name = contactForm.querySelector('input[name="name"]');
      const email = contactForm.querySelector('input[name="email"]');
      const password = contactForm.querySelector('input[name="password"]');
      const password2 = contactForm.querySelector('input[name="password2"]');
      const message = contactForm.querySelector('textarea[name="message"]');

      if(name && name.value.trim() === ''){ showError(name, 'Name is required'); ok = false; }
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if(email && !emailRe.test(email.value.trim())){ showError(email, 'Valid email required'); ok = false; }
      if(password){
        if(password.value.length < 6){ showError(password, 'Password must be at least 6 characters'); ok = false; }
        if(password2 && password.value !== password2.value){ showError(password2, 'Passwords do not match'); ok = false; }
      }
      if(message && message.value.trim() === ''){ showError(message, 'Message is required'); ok = false; }

      if(ok){
        alert('Form submitted successfully (demo).');
        contactForm.reset();
      }
    });
  }

  function showError(el, msg){
    const p = document.createElement('div');
    p.className = 'field-error';
    p.style.color = 'crimson';
    p.style.marginTop = '6px';
    p.textContent = msg;
    el.parentNode.insertBefore(p, el.nextSibling);
    el.focus();
  }
  function clearErrors(form){
    form.querySelectorAll('.field-error').forEach(x => x.remove());
  }
});
