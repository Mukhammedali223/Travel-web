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
  const bgBtn = document.getElementById('bg-toggle');
  const colors = ['#f7f9fc','#fff7e6','#f0fff4','#fff0f6','#e8f0ff','#fffbe6'];
  if(bgBtn){
    bgBtn.addEventListener('click', function(){
      const c = colors[Math.floor(Math.random()*colors.length)];
      document.body.style.background = c;
    });
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
    console.log("Popup created");

    // events
    backdrop.addEventListener('click', function(e){
      if(e.target === backdrop) backdrop.remove();
    });
    backdrop.querySelector('.close').addEventListener('click', function(){ backdrop.remove(); });
    // attach validation for popup form (reuse validateForm function)
    const popupForm = document.getElementById('popup-form');
    if(popupForm){
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

// expose places for jQuery features
try { window.placesData = (typeof places !== 'undefined') ? places : [];} catch(e) { window.placesData = window.placesData || []; }



/* jQuery features for Assignment 7 */
$(document).ready(function() {
  console.log("jQuery is ready!");

  // Build search list from placesData or page titles
  function buildSearchList() {
    var list = $("#search-list");
    if (!list.length) {
      $("<ul id='search-list' class='list-group mt-2'></ul>").insertAfter("#search-input");
      list = $("#search-list");
    }
    list.empty();
    var source = [];
    if (window.placesData && window.placesData.length) {
      source = window.placesData.map(function(p){ return p.name || p.title || p; });
    } else {
      $(".card h3, .card-title, .card h5").each(function() { source.push($(this).text().trim()); });
    }
    source.forEach(function(item) {
      $("<li class='list-group-item list-group-item-action'></li>").text(item).appendTo(list);
    });
  }
  buildSearchList();

  // Real-time search, suggestions and highlighting
  $("#search-input").on("keyup", function() {
    var q = $(this).val().toLowerCase().trim();
    if (!q) { $("#suggestions").hide(); } else {
      var suggestions = [];
      $("#search-list li").each(function() {
        var txt = $(this).text();
        if (txt.toLowerCase().indexOf(q) !== -1) suggestions.push(txt);
      });
      var sugBox = $("#suggestions").empty();
      suggestions.slice(0,6).forEach(function(s) { $("<button class='list-group-item list-group-item-action'></button>").text(s).appendTo(sugBox); });
      if (suggestions.length) sugBox.show(); else sugBox.hide();
    }
    // live filter cards
    $(".card").each(function() {
      var text = $(this).text().toLowerCase();
      if (!q || text.indexOf(q) !== -1) $(this).show(); else $(this).hide();
    });
    // remove old highlights
    $(".search-highlight").each(function(){ $(this).replaceWith($(this).text()); });
    if (q) {
      var re = new RegExp('('+q+')', 'ig');
      $("p, h1, h2, h3, h4, h5, .card-title, .card-text").each(function() {
        var html = $(this).html();
        if (html) {
          html = html.replace(re, '<span class="search-highlight">$1</span>');
          $(this).html(html);
        }
      });
    }
  });

  // suggestions click
  $(document).on("click", "#suggestions .list-group-item", function() {
    $("#search-input").val($(this).text()).trigger("keyup");
    $("#suggestions").hide();
  });

  // hide suggestions when clicking outside
  $(document).on("click", function(e) {
    if (!$(e.target).closest("#suggestions, #search-input").length) $("#suggestions").hide();
  });

  // Scroll progress bar
  var $progress = $("#scroll-progress");
  if (!$progress.length) { $("body").prepend('<div id="scroll-progress"></div>'); $progress = $("#scroll-progress"); }
  $progress.css({position: "fixed", top:0, left:0, height: "4px", width: "0%", "z-index": 9999, "background": "linear-gradient(90deg,#ff8a00,#ff2d95)"});
  $(window).on("scroll resize", function() {
    var docHeight = $(document).height() - $(window).height();
    var scrollTop = $(window).scrollTop();
    var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    $progress.css("width", pct + "%");
  });

  // Animated counters when visible
  function animateCounters() {
    $(".counter").each(function() {
      var $this = $(this);
      var target = parseInt($this.attr("data-target") || $this.text()) || 0;
      if ($this.data("counted")) return;
      if ($this.is(":visible") && $(window).scrollTop() + $(window).height() > $this.offset().top) {
        $this.data("counted", true);
        $({count: 0}).animate({count: target}, {
          duration: 1200,
          easing: 'swing',
          step: function(now) { $this.text(Math.floor(now)); },
          complete: function() { $this.text(target); }
        });
      }
    });
  }
  $(window).on("scroll load resize", animateCounters);
  animateCounters();

  // Loading spinner on submit (contact form)
  $(document).on("submit", "#contact-form", function(e) {
    e.preventDefault();
    var $form = $(this);
    var $btn = $form.find('button[type="submit"]');
    var origHtml = $btn.html();
    $btn.prop("disabled", true).html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Please wait...');
    setTimeout(function() {
      $btn.prop("disabled", false).html(origHtml);
      $("#contact-feedback").html('<div class="alert alert-success">Form submitted successfully (simulated).</div>');
      showToast("Message sent successfully");
      $form.trigger("reset");
    }, 1000);
  });

  // Toast notifications
  if (!$("#toast-container").length) $("body").append('<div id="toast-container" style="position:fixed; bottom:20px; right:20px; z-index:99999;"></div>');
  function showToast(msg, timeout) {
    timeout = timeout || 2500;
    var $t = $('<div class="toast-item alert alert-info shadow-sm" role="alert">'+msg+'</div>');
    $("#toast-container").append($t);
    $t.hide().fadeIn(200).delay(timeout).fadeOut(400, function(){ $(this).remove(); });
  }

  // Copy to clipboard
  $(document).on("click", ".copy-btn", function() {
    var selector = $(this).data("copy");
    var text = $(selector).text();
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(function() { showToast("Copied to clipboard!"); })
      .catch(function(){ showToast("Copy failed"); });
    } else {
      var $temp = $("<textarea>");
      $("body").append($temp);
      $temp.val(text).select();
      try { document.execCommand("copy"); showToast("Copied to clipboard!"); } catch (e) { showToast("Copy failed"); }
      $temp.remove();
    }
    var $btn = $(this);
    var old = $btn.html();
    $btn.html('✓ Copied');
    setTimeout(function(){ $btn.html(old); }, 1200);
  });

  // Lazy loading images
  function lazyLoadImages() {
    $("img[data-src]").each(function() {
      var $img = $(this);
      var rectTop = $img.offset().top;
      var winBottom = $(window).scrollTop() + $(window).height() + 200;
      if (rectTop < winBottom) {
        $img.attr("src", $img.data("src"));
        $img.removeAttr("data-src");
      }
    });
  }
  $(window).on("scroll resize load", lazyLoadImages);
  lazyLoadImages();

  // initialize gallery thumbs data-src -> lazy loading
  $(".gallery-thumbs img").each(function() {
    var $img = $(this);
    if (!$img.attr("data-src") && $img.attr("src")) {
      $img.attr("data-src", $img.attr("src"));
      $img.attr("src", "");
    }
  });
  lazyLoadImages();

}); // end document ready
