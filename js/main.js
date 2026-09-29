/* ==========================================================================
   PJ DESENVOLVIMENTO E GESTÃO — JavaScript
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. Header scroll ───────────────────────────────────────────────── */
  const hdr = document.getElementById('hdr');
  window.addEventListener('scroll', () => {
    hdr.classList.toggle('scrolled', window.scrollY > 30);
    hdr.classList.toggle('at-top', window.scrollY <= 30);
    updateNav();
  }, { passive: true });

  /* ── 2. Active nav ──────────────────────────────────────────────────── */
  const navLinks = document.querySelectorAll('.hdr-nav a');
  const sections = document.querySelectorAll('section[id]');

  function updateNav() {
    let cur = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 100) cur = s.id;
    });
    navLinks.forEach(l => {
      l.classList.toggle('on', l.getAttribute('href') === '#' + cur);
    });
  }

  /* ── 3. Mobile menu ─────────────────────────────────────────────────── */
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');

  burger?.addEventListener('click', () => {
    burger.classList.toggle('open');
    nav.classList.toggle('open');
    document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
  });

  nav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      burger.classList.remove('open');
      nav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ── 4. Scroll reveal ───────────────────────────────────────────────── */
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('up'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });

  document.querySelectorAll('.sr').forEach(el => obs.observe(el));

  /* ── 5. NPS Counter ─────────────────────────────────────────────────── */
  const npsEls = document.querySelectorAll('.nps-num[data-target]');
  const npsObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        count(e.target, parseInt(e.target.dataset.target));
        npsObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  npsEls.forEach(el => npsObs.observe(el));

  function count(el, end, dur = 1400) {
    const start = performance.now();
    const run = now => {
      const p = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(ease * end) + '%';
      if (p < 1) requestAnimationFrame(run);
    };
    requestAnimationFrame(run);
  }

  /* ── 6. Serviços filter ─────────────────────────────────────────────── */
  const filterBtns = document.querySelectorAll('.s-filter-btn');
  const cards = document.querySelectorAll('.s-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('on'));
      btn.classList.add('on');
      const f = btn.dataset.f;
      cards.forEach((c, i) => {
        const show = f === 'all' || c.dataset.cat === f;
        c.style.display = show ? 'flex' : 'none';
        if (show) {
          c.style.opacity = '0';
          c.style.transform = 'translateY(10px)';
          setTimeout(() => {
            c.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
            c.style.opacity = '1';
            c.style.transform = 'translateY(0)';
          }, i * 40);
        }
      });
    });
  });

  /* ── 7. Diagnóstico de Prioridades ──────────────────────────────────── */
  const data = {};

  // Option selection
  document.querySelectorAll('.sim-opt').forEach(opt => {
    opt.addEventListener('click', () => {
      const opts = opt.closest('.sim-opts').querySelectorAll('.sim-opt');
      opts.forEach(o => o.classList.remove('on'));
      opt.classList.add('on');
      const radio = opt.querySelector('input');
      if (radio) { radio.checked = true; data[radio.name] = radio.value; }
    });
  });

  function buildDiagText() {
    const momento  = data.p1 || 'Não informado';
    const resRadio = data.p2 || '';
    const situacao = document.getElementById('diagSituacao')?.value.trim() || '';
    const resultado = [resRadio, situacao].filter(Boolean).join(' | ') || 'Não informado';
    const melhorar = document.getElementById('diagMelhorar')?.value.trim() || 'Não informado';
    const nome     = document.getElementById('diagNome')?.value.trim() || '';
    const empresa  = document.getElementById('diagEmpresa')?.value.trim() || '';

    return {
      nome,
      empresa,
      subject: 'Solicitação de Diagnóstico Estratégico' + (empresa ? ' | ' + empresa : ''),
      bodyPlain:
        'Olá, Alessandra!\n\n' +
        'Gostaria de receber o diagnóstico de prioridades e agendar um bate-papo.\n\n' +
        (nome ? 'Nome: ' + nome + '\n' : '') +
        (empresa ? 'Empresa: ' + empresa + '\n' : '') +
        '\n1. Momento atual da empresa:\n' + momento + '\n' +
        '\n2. Como estão os resultados:\n' + resultado + '\n' +
        '\n3. O que desejo alterar ou melhorar:\n' + melhorar + '\n\n' +
        'Aguardo retorno para agendarmos uma conversa.',
      bodyWA:
        'Olá, Alessandra! Gostaria de receber o diagnóstico de prioridades e agendar um bate-papo.\n\n' +
        (nome ? '*Nome:* ' + nome + '\n' : '') +
        (empresa ? '*Empresa:* ' + empresa + '\n' : '') +
        '*1. Momento atual:* ' + momento + '\n' +
        '*2. Resultados:* ' + resultado + '\n' +
        '*3. O que deseja alterar/melhorar:* ' + melhorar
    };
  }

  document.getElementById('btnDiagEmail')?.addEventListener('click', () => {
    const info = buildDiagText();
    const mailto = 'mailto:contato@pjgestao.com?subject=' +
      encodeURIComponent(info.subject) +
      '&body=' + encodeURIComponent(info.bodyPlain);
    window.location.href = mailto;
  });

  document.getElementById('btnDiagWA')?.addEventListener('click', () => {
    const info = buildDiagText();
    window.open('https://wa.me/5511992704444?text=' + encodeURIComponent(info.bodyWA), '_blank');
  });

  /* ── 8. Formulário de contato ───────────────────────────────────────── */
  document.getElementById('cForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const nome    = document.getElementById('fNome').value.trim();
    const empresa = document.getElementById('fEmpresa').value.trim();
    const cargo   = document.getElementById('fCargo').value.trim();
    const servico = document.getElementById('fServico').value;
    const msg     = document.getElementById('fMsg').value.trim();

    if (!nome || !empresa) return;

    const text = encodeURIComponent(
      'Olá, Alessandra! Contato pelo site da PJ Desenvolvimento e Gestão:\n\n' +
      '*Nome:* ' + nome + '\n' +
      '*Empresa:* ' + empresa + '\n' +
      (cargo ? '*Cargo:* ' + cargo + '\n' : '') +
      '*Serviço:* ' + servico + '\n' +
      (msg ? '*Contexto:* ' + msg : '')
    );
    window.open('https://wa.me/5511992704444?text=' + text, '_blank');
  });

});
