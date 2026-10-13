(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Aviso 18+ (lembra só durante a sessão) ---------- */
  var gate = document.getElementById('ageGate');
  var ok = false;
  try { ok = sessionStorage.getItem('xred-18') === '1'; } catch (e) {}
  if (gate && !ok) {
    gate.hidden = false;
    document.getElementById('ageYes').addEventListener('click', function () {
      gate.hidden = true;
      try { sessionStorage.setItem('xred-18', '1'); } catch (e) {}
    });
  }

  /* ---------- Menu mobile ---------- */
  var toggle = document.getElementById('menuToggle');
  var nav = document.getElementById('mainNav');
  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  /* ---------- Imagem de exemplo neutra (até você adicionar as suas) ---------- */
  var placeholder = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="750" viewBox="0 0 600 750">' +
    '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
    '<stop offset="0" stop-color="#1a1a1a"/><stop offset="1" stop-color="#3a0000"/></linearGradient></defs>' +
    '<rect width="600" height="750" fill="url(#g)"/>' +
    '<text x="300" y="365" fill="#e10600" font-family="Impact,sans-serif" font-size="64" text-anchor="middle">RED</text>' +
    '<text x="300" y="410" fill="#9a9a9a" font-family="sans-serif" font-size="22" text-anchor="middle">Adicione sua foto aqui</text>' +
    '</svg>');
  document.querySelectorAll('img[data-fallback]').forEach(function (img) {
    img.addEventListener('error', function () {
      if (img.src !== placeholder) { img.src = placeholder; }
    });
  });

  /* ---------- Lightbox ---------- */
  var lb = document.getElementById('lightbox');
  var lbImg = document.getElementById('lbImg');
  document.querySelectorAll('.g-item').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var img = btn.querySelector('img');
      lbImg.src = img.currentSrc || img.src;
      lbImg.alt = img.alt;
      if (lb.showModal) { lb.showModal(); } else { lb.setAttribute('open', ''); }
    });
  });
  document.getElementById('lbClose').addEventListener('click', function () { lb.close(); });
  lb.addEventListener('click', function (e) { if (e.target === lb) { lb.close(); } });

  /* ---------- Revelar ao rolar ---------- */
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Contadores demonstrativos (locais, sem salvar nem enviar nada) ---------- */
  var viewsEl = document.getElementById('views');
  var watchEl = document.getElementById('watch');
  var views = 32000;   // começa em 32.000 e cai 1 por segundo
  var watched = 0;     // segundos; +7 a cada 2 segundos reais

  var nf = new Intl.NumberFormat('pt-BR');
  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function fmtTime(s) {
    return pad(Math.floor(s / 3600)) + ':' + pad(Math.floor((s % 3600) / 60)) + ':' + pad(s % 60);
  }
  function flash(el) {
    if (reduceMotion) { return; }
    el.classList.remove('pulse');
    void el.offsetWidth; // reinicia a animação
    el.classList.add('pulse');
  }

  viewsEl.textContent = nf.format(views);
  watchEl.textContent = fmtTime(watched);

  // Views: -1 a cada segundo, nunca abaixo de zero
  setInterval(function () {
    if (views > 0) {
      views -= 1;
      viewsEl.textContent = nf.format(views);
      flash(viewsEl);
    }
  }, 1000);

  // Tempo assistido: +7 s a cada 2 s reais
  setInterval(function () {
    watched += 7;
    watchEl.textContent = fmtTime(watched);
    flash(watchEl);
  }, 2000);
})();
