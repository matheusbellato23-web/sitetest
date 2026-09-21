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

  /* ── 7. Simulador ───────────────────────────────────────────────────── */
  const steps = document.querySelectorAll('.sim-step');
  const bars  = [document.getElementById('sp1'), document.getElementById('sp2'), document.getElementById('sp3')];
  const result = document.getElementById('simResult');
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

  function goStep(n) {
    steps.forEach((s, i) => s.classList.toggle('on', i + 1 === n));
    bars.forEach((b, i) => b.classList.toggle('on', i + 1 <= n));
  }

  function validate(step) {
    const s = document.querySelector(`.sim-step[data-step="${step}"]`);
    const checked = s?.querySelector('input:checked');
    if (!checked) {
      s?.querySelectorAll('.sim-opt').forEach(o => {
        o.style.borderColor = 'rgba(184,64,48,0.4)';
        setTimeout(() => o.style.borderColor = '', 1200);
      });
      return false;
    }
    return true;
  }

  document.getElementById('sn1')?.addEventListener('click', () => validate(1) && goStep(2));
  document.getElementById('sp2btn')?.addEventListener('click', () => goStep(1));
  document.getElementById('sn2')?.addEventListener('click', () => validate(2) && goStep(3));
  document.getElementById('sp3btn')?.addEventListener('click', () => goStep(2));

  document.getElementById('sfinish')?.addEventListener('click', () => {
    if (!validate(3)) return;
    steps.forEach(s => s.classList.remove('on'));
    bars.forEach(b => b.classList.add('on'));
    result.classList.add('on');

    let title, desc, bullets;

    if (data.p1 === 'm_and_a' || data.p1 === 'crescimento') {
      title = 'Prioridade: Transformação Organizacional & M&A';
      desc = 'Seu momento exige ancoragem cultural rápida para evitar descompasso entre metas de negócio e retenção de talentos-chave.';
      bullets = [
        'Alinhamento com Conselho e C-Level dos impactos operacionais',
        'Plano de comunicação estratégica para estancar ruídos',
        'Mapeamento de líderes críticos via Insights Discovery',
        'Estruturação de novos rituais de governança e EVP'
      ];
    } else if (data.p1 === 'sucessao') {
      title = 'Prioridade: Sucessão Executiva & Governança';
      desc = 'A transferência de comando requer blindagem técnica e emocional para assegurar a continuidade sustentável do negócio.';
      bullets = [
        'Análise do estilo decisório do Fundador / CEO atual',
        'Mapeamento e preparação de sucessores internos e externos',
        'Metodologia Board Academy aplicada ao processo de transição',
        'Plano transparente que reduz riscos reputacionais no mercado'
      ];
    } else {
      title = 'Prioridade: Cultura & Segurança Psicológica';
      desc = 'A produtividade e saúde organizacional dependem de um ambiente onde as pessoas confiem e comuniquem com clareza.';
      bullets = [
        'Diagnóstico Cultural Hofstede / Schein — Real vs. Desejada',
        'Aplicação do FOS (Fearless Organization Scan)',
        'Capacitação de líderes para feedbacks corajosos e autonomia',
        'People Analytics para reduzir turnover e absenteísmo'
      ];
    }

    document.getElementById('rTitle').textContent = title;
    document.getElementById('rDesc').textContent = desc;
    document.getElementById('rBullets').innerHTML = bullets.map(b => `<li>${b}</li>`).join('');

    const msg = encodeURIComponent(
      'Olá, Alessandra! Realizei o Diagnóstico de Prontidão no site da PJ Gestão.\n\n' +
      '*Momento:* ' + (data.p1 || '') + '\n' +
      '*Desafio:* ' + (data.p2 || '') + '\n' +
      '*Porte:* ' + (data.p3 || '') + '\n' +
      '*Diagnóstico:* ' + title + '\n\n' +
      'Gostaria de agendar uma conversa consultiva.'
    );
    document.getElementById('rWA').href = 'https://wa.me/5511992704444?text=' + msg;
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
