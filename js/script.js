// script.js - handles form validation, accordion, popup, bg color, and date/time
document.addEventListener('DOMContentLoaded', function() {
  /* ===== Task 5: Date and time display ===== */
  const dtElem = document.getElementById('datetime');
  function updateDateTime(){
    if(!dtElem) return;
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = now.toLocaleDateString(undefined, options);
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2,'0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = (hours % 12) || 12;
    dtElem.textContent = `${date}, ${hours}:${minutes} ${ampm}`;
  }
  updateDateTime();
  setInterval(updateDateTime, 1000);

  /* ===== Task 4: Change background color ===== */
let isBlue = false;

function toggleBackground() {
  const body = document.body;

  if (isBlue) {
    body.style.background = "#ffffff";
  } else {
    body.style.background = "#b3d9ff";
  }

  isBlue = !isBlue;
}

const colorBtn = document.getElementById("colorToggleBtn");
if (colorBtn) {
  colorBtn.addEventListener("click", toggleBackground);
}



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
