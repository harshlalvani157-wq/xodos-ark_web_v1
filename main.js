/* XoDos-Ark — lightweight progressive enhancement */
(function() {
  'use strict';
  
  var els = document.querySelectorAll('.rv');
  if (!('IntersectionObserver' in window)) {
    for (var i = 0; i < els.length; i++) els[i].classList.add('in');
  } else {
    var io = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach(function(el) { io.observe(el); });
  }
  
  var toggle = document.getElementById('navToggle');
  var menu = document.getElementById('navMenu');
  if (!toggle || !menu) return;
  
  function closeMenu() {
    menu.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }
  
  toggle.addEventListener('click', function() {
    var open = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  menu.addEventListener('click', function(event) {
    if (event.target.closest('a')) closeMenu();
  });
  document.addEventListener('click', function(event) {
    if (!menu.contains(event.target) && !toggle.contains(event.target)) closeMenu();
  });
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') closeMenu();
  });
}());