/* Spirit Family – web (akcie, rezervácie, novinky, galéria) */
(() => {
  'use strict';

  const CFG = window.SF_CONFIG || {};
  const API = String(CFG.API_URL || '').trim();
  const DEMO = !API;
  const MAX_OSOB = CFG.MAX_OSOB || 6;
  const TEL = CFG.TELEFON || '';
  const TEL_HREF = 'tel:+421' + TEL.replace(/\D/g, '').replace(/^0/, '');
  const FB = CFG.FACEBOOK || '#';

  const MES = ['január', 'február', 'marec', 'apríl', 'máj', 'jún', 'júl', 'august', 'september', 'október', 'november', 'december'];
  const MES_GEN = ['januára', 'februára', 'marca', 'apríla', 'mája', 'júna', 'júla', 'augusta', 'septembra', 'októbra', 'novembra', 'decembra'];
  const MES_LOK = ['januári', 'februári', 'marci', 'apríli', 'máji', 'júni', 'júli', 'auguste', 'septembri', 'októbri', 'novembri', 'decembri'];
  const DNI = ['nedeľa', 'pondelok', 'utorok', 'streda', 'štvrtok', 'piatok', 'sobota'];
  const DNI_KR = ['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'];
  const ALKO = ['rum', 'whisky', 'tequila', 'gin', 'pivo', 'degustacia'];

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pauza = ms => new Promise(r => setTimeout(r, ms));

  const sklon = (n, jeden, dva, vela) => (n === 1 ? jeden : n >= 2 && n <= 4 ? dva : vela);
  const miesta = n => `${n} ${sklon(n, 'voľné miesto', 'voľné miesta', 'voľných miest')}`;
  const osob = n => `${n} ${sklon(n, 'osobu', 'osoby', 'osôb')}`;
  const fKratko = d => `${d.getDate()}.${d.getMonth() + 1}.`;
  const fDlho = d => `${d.getDate()}. ${MES_GEN[d.getMonth()]}`;
  const fDatum = iso => {
    const d = new Date(iso);
    return isNaN(d) ? '' : `${d.getDate()}. ${d.getMonth() + 1}. ${d.getFullYear()}`;
  };
  const cena = c => (/^\d+([.,]\d+)?$/.test(String(c || '').trim()) ? `${String(c).trim()} €` : String(c || ''));

  const svg = p => `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
  const IKONY = {
    rum: svg('<ellipse cx="18" cy="11" rx="10" ry="3.2"/><path d="M8 11c-2.2 8.7-2.2 17.3 0 26M28 11c2.2 8.7 2.2 17.3 0 26"/><ellipse cx="18" cy="37" rx="10" ry="3.2"/><path d="M7 19.5h22M7 28.5h22"/><circle cx="18" cy="24" r="1.6"/><path d="M33 23h10l-1.2 15.5a1.5 1.5 0 0 1-1.5 1.5h-4.6a1.5 1.5 0 0 1-1.5-1.5z"/><path d="M34 31h8"/>'),
    whisky: svg('<path d="M13 5h7v7c4.5 1.8 7 5 7 9.5V41a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V21.5C6 17 8.5 13.8 13 12z"/><rect x="9.5" y="25" width="14" height="9" rx="1"/><path d="M36 20c-3.5 5.5-3.5 11.5 1.5 14 5-2.5 5-8.5 1.5-14z"/><path d="M37.5 34v6M33.5 41h8"/>'),
    tequila: svg('<path d="M24 41C21 29 20 18 24 6c4 12 3 23 0 35z"/><path d="M23 41C19 31 13 22 5 17c4 10 10 18 18 24z"/><path d="M25 41c4-10 10-19 18-24-4 10-10 18-18 24z"/><path d="M22 41C16 35 10 32 3 31c6 4 12 8 19 10z"/><path d="M26 41c6-6 12-9 19-10-6 4-12 8-19 10z"/><path d="M14 43h20"/>'),
    tanec: svg('<path d="M19 36V11l20-5v25"/><path d="M19 17l20-5"/><circle cx="14" cy="36" r="5"/><circle cx="34" cy="31" r="5"/>'),
    gin: svg('<path d="M17 5h8v6l3 4v26a2 2 0 0 1-2 2H16a2 2 0 0 1-2-2V15l3-4z"/><path d="M14 24h14"/><path d="M33 18h10l-3 22h-4z"/><path d="M34.5 26h7"/>'),
    pivo: svg('<path d="M11 13h20v26a3 3 0 0 1-3 3H14a3 3 0 0 1-3-3z"/><path d="M31 18h4a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4h-4"/><path d="M11 13c0-4 3-6 6-5 1-3 6-3 8 0 3-1 6 1 6 5"/><path d="M17 21v15M25 21v15"/>'),
    ine: svg('<path d="M9 6h12l-1.2 12a4.8 4.8 0 0 1-9.6 0z"/><path d="M15 23v14M10 38h10"/><path d="M27 10h12l-1.2 12a4.8 4.8 0 0 1-9.6 0z"/><path d="M33 27v11M28 38h10"/>')
  };
  IKONY.latino = IKONY.tanec;
  IKONY.degustacia = IKONY.whisky;

  /* ---------- Dáta ---------- */
  async function getJSON(url) {
    const r = await fetch(url, { cache: 'no-store' });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const d = await r.json();
    if (d && d.ok === false) throw new Error(d.chyba || 'Chyba servera');
    return d;
  }

  let akcieCache = null;
  function nacitajAkcie() {
    if (!akcieCache) {
      akcieCache = getJSON(DEMO ? 'data/akcie.json' : API + '?a=akcie')
        .then(d => (d.akcie || []).map(pripravAkciu).filter(Boolean).sort((a, b) => a.start - b.start));
    }
    return akcieCache;
  }

  function pripravAkciu(a) {
    const [y, m, d] = String(a.datum || '').split('-').map(Number);
    if (!y || !m || !d) return null;
    const bezCasu = !/^\d{1,2}:\d{2}$/.test(String(a.cas || ''));
    const [hh, mm] = bezCasu ? [23, 59] : String(a.cas).split(':').map(Number);
    const start = new Date(y, m - 1, d, hh, mm);
    const kapacita = Number(a.kapacita) || 0;
    const volne = kapacita ? Math.max(0, Number(a.volne ?? kapacita)) : 0;
    return { ...a, typ: String(a.typ || 'ine'), cas: bezCasu ? '' : a.cas, start, kapacita, volne, minula: start < new Date() };
  }

  function nacitajNovinky() {
    return getJSON(DEMO ? 'data/novinky.json' : API + '?a=novinky').then(d =>
      (d.novinky || [])
        .map(n => ({ ...n, video: n.video_id || ytId(n.odkaz) }))
        .sort((a, b) => String(b.datum).localeCompare(String(a.datum)))
    );
  }

  function ytId(url) {
    const m = String(url || '').match(/(?:youtu\.be\/|[?&]v=|\/shorts\/|\/embed\/|\/live\/)([\w-]{11})/);
    return m ? m[1] : '';
  }

  async function rezervuj(data) {
    if (DEMO) {
      await pauza(700);
      const a = (await nacitajAkcie()).find(x => x.id === data.akcia_id);
      if (!a) return { ok: false, chyba: 'Akciu sme nenašli.' };
      if (data.pocet > a.volne) return { ok: false, chyba: `Zostáva už len ${miesta(a.volne)}.` };
      return { ok: true, volne: a.volne - data.pocet };
    }
    // text/plain = bez CORS preflightu, Apps Script si JSON prečíta z postData
    const r = await fetch(API, { method: 'POST', body: JSON.stringify({ a: 'rezervacia', ...data }) });
    return r.json();
  }

  /* ---------- Akcie ---------- */
  function stav(a) {
    if (a.minula) return { cls: 'st-past', text: 'Prebehlo', moze: false };
    if (!a.kapacita) return { cls: 'st-free', text: 'Bez rezervácie', moze: false };
    if (a.volne <= 0) return { cls: 'st-full', text: 'Vypredané', moze: false };
    if (a.volne <= 5) return { cls: 'st-low', text: 'Už len ' + miesta(a.volne), moze: true };
    return { cls: 'st-open', text: miesta(a.volne), moze: true };
  }

  const kedy = a => `${DNI[a.start.getDay()]}${a.cas ? ' · ' + esc(a.cas) : ''}`;

  function kartaAkcie(a) {
    const s = stav(a);
    return `<article class="ev-card t-${esc(a.typ)}${a.minula ? ' is-past' : ''}">
      <a class="ev-link" href="akcie.html#${encodeURIComponent(a.id)}" data-akcia="${esc(a.id)}">
        <span class="ev-ico" aria-hidden="true">${IKONY[a.typ] || IKONY.ine}</span>
        <span class="ev-date"><span class="ev-d">${fKratko(a.start)}</span><span class="ev-w">${kedy(a)}</span></span>
        <h3 class="ev-title">${esc(a.nazov)}</h3>
        ${a.podnadpis ? `<p class="ev-sub">${esc(a.podnadpis)}</p>` : ''}
        <span class="ev-foot"><span class="ev-price">${esc(cena(a.cena))}</span><span class="ev-state ${s.cls}">${s.text}</span></span>
      </a>
    </article>`;
  }

  function detailAkcie(a) {
    const s = stav(a);
    const popis = String(a.popis || '').split(/\n+/).filter(Boolean).map(p => `<p>${esc(p)}</p>`).join('');
    const obsadene = a.kapacita ? a.kapacita - a.volne : 0;
    const pct = a.kapacita ? Math.min(100, Math.round((obsadene / a.kapacita) * 100)) : 0;
    const fakty = [
      ['Termín', `${DNI[a.start.getDay()]} ${fDlho(a.start)}`],
      a.cas && ['Začiatok', a.cas],
      a.cena && ['Cena', cena(a.cena)],
      ['Kde', 'Stromová 1, Trenčín']
    ].filter(Boolean);

    let spodok;
    if (s.moze) spodok = formular(a);
    else if (a.minula) spodok = `<p class="note">Táto akcia už prebehla. Pozrite si <a href="akcie.html" data-close>ďalšie termíny</a>.</p>`;
    else if (!a.kapacita) spodok = `<p class="note">Na túto akciu sa miesto nerezervuje, stačí prísť.</p>`;
    else spodok = `<p class="note">Kapacita je naplnená. Ak sa miesto uvoľní, dáme vedieť na <a href="${esc(FB)}" target="_blank" rel="noopener">Facebooku</a>, alebo sa informujte na <a href="${TEL_HREF}">${esc(TEL)}</a>.</p>`;

    return `<div class="ev-detail t-${esc(a.typ)}">
      <div class="ev-detail-head">
        <span class="ev-ico" aria-hidden="true">${IKONY[a.typ] || IKONY.ine}</span>
        <div>
          <p class="eyebrow">${fKratko(a.start)} · ${kedy(a)}</p>
          <h2>${esc(a.nazov)}</h2>
          ${a.podnadpis ? `<p class="ev-sub">${esc(a.podnadpis)}</p>` : ''}
        </div>
      </div>
      ${a.obrazok ? `<img class="ev-img" src="${esc(a.obrazok)}" alt="">` : ''}
      ${popis ? `<div class="ev-body">${popis}</div>` : ''}
      <dl class="ev-facts">${fakty.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
      ${a.kapacita && !a.minula ? `<div class="cap"><span class="cap-bar"><i style="width:${pct}%"></i></span><span>${s.text}</span></div>` : ''}
      ${spodok}
    </div>`;
  }

  function formular(a) {
    const max = Math.max(1, Math.min(MAX_OSOB, a.volne));
    const moznosti = Array.from({ length: max }, (_, i) => `<option value="${i + 1}">${osob(i + 1)}</option>`).join('');
    const alko = ALKO.includes(a.typ);
    return `<form class="book" novalidate>
      <h3>Rezervovať miesto</h3>
      <div class="hp" aria-hidden="true"><label>Nevypĺňajte <input name="web" tabindex="-1" autocomplete="off"></label></div>
      <div class="row2">
        <label class="fld"><span>Meno a priezvisko</span><input name="meno" autocomplete="name" maxlength="80" required></label>
        <label class="fld"><span>Počet miest</span><select name="pocet">${moznosti}</select></label>
      </div>
      <div class="row2">
        <label class="fld"><span>E-mail</span><input type="email" name="email" autocomplete="email" maxlength="120" required></label>
        <label class="fld"><span>Telefón</span><input type="tel" name="telefon" autocomplete="tel" maxlength="30" placeholder="09xx xxx xxx" required></label>
      </div>
      <label class="fld"><span>Poznámka <em>(nepovinné)</em></span><textarea name="poznamka" rows="2" maxlength="500"></textarea></label>
      ${alko ? '<label class="chk"><input type="checkbox" name="vek"> <span>Všetci, pre ktorých rezervujem, majú viac ako 18 rokov.</span></label>' : ''}
      <label class="chk"><input type="checkbox" name="suhlas"> <span>Beriem na vedomie <a href="ochrana-udajov.html" target="_blank">informácie o spracovaní osobných údajov</a>.</span></label>
      <p class="form-msg" role="alert"></p>
      <button class="btn" type="submit">Rezervovať</button>
      <p class="fine">Platí sa na mieste. ${DEMO ? '' : 'Potvrdenie vám príde e-mailom.'}</p>
    </form>`;
  }

  async function odoslat(e, a, f) {
    e.preventDefault();
    const msg = $('.form-msg', f);
    const btn = $('button[type=submit]', f);
    const fd = new FormData(f);
    const txt = k => String(fd.get(k) || '').trim();
    const data = {
      akcia_id: a.id, meno: txt('meno'), email: txt('email'), telefon: txt('telefon'),
      pocet: parseInt(fd.get('pocet'), 10) || 1, poznamka: txt('poznamka'), suhlas: !!fd.get('suhlas'), web: txt('web')
    };

    $$('.bad', f).forEach(x => x.classList.remove('bad'));
    const chyby = [];
    const zle = (meno, text) => { f.elements[meno] && f.elements[meno].classList.add('bad'); chyby.push(text); };
    if (data.meno.length < 2) zle('meno', 'Vyplňte meno.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email)) zle('email', 'Skontrolujte e-mail.');
    if (data.telefon.replace(/\D/g, '').length < 9) zle('telefon', 'Skontrolujte telefónne číslo.');
    if (f.elements.vek && !f.elements.vek.checked) zle('vek', 'Degustácie sú len pre plnoletých.');
    if (!data.suhlas) zle('suhlas', 'Potvrďte, prosím, informácie o spracovaní údajov.');
    if (chyby.length) {
      msg.textContent = chyby[0];
      $('.bad', f).focus();
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Odosielam…';
    msg.textContent = '';
    try {
      const res = await rezervuj(data);
      if (!res || !res.ok) throw new Error((res && res.chyba) || 'Rezerváciu sa nepodarilo uložiť.');
      if (typeof res.volne === 'number') a.volne = res.volne;
      const box = document.createElement('div');
      box.className = 'ok-box';
      box.tabIndex = -1;
      box.innerHTML = `<h3>Miesto je vaše</h3>
        <p>Ďakujeme, ${esc(data.meno.split(/\s+/)[0])}! Rezervovali sme <strong>${osob(data.pocet)}</strong> na ${esc(a.nazov)}, ${DNI[a.start.getDay()]} ${fDlho(a.start)}${a.cas ? ' o ' + esc(a.cas) : ''}.</p>
        <p>${DEMO ? '<em>Ukážkový režim – rezervácia sa nikam neuložila.</em>' : `Potvrdenie sme poslali na <strong>${esc(data.email)}</strong>.`} Ak nemôžete prísť, dajte nám vedieť na <a href="${TEL_HREF}">${esc(TEL)}</a>.</p>`;
      f.replaceWith(box);
      box.focus();
      const cap = $('.cap', box.parentNode);
      if (cap) cap.remove();
      document.dispatchEvent(new CustomEvent('sf:zmena'));
    } catch (err) {
      msg.textContent = /fetch|network/i.test(err.message)
        ? `Nepodarilo sa spojiť so serverom. Skúste to znova alebo zavolajte na ${TEL}.`
        : err.message;
      btn.disabled = false;
      btn.textContent = 'Rezervovať';
    }
  }

  function otvorAkciu(a) {
    const m = otvorModal(detailAkcie(a), 'm-akcia', `Detail akcie ${a.nazov}`);
    const f = $('form.book', m);
    if (f) f.addEventListener('submit', e => odoslat(e, a, f));
    history.replaceState(null, '', '#' + encodeURIComponent(a.id));
  }

  /* ---------- Modálne okno ---------- */
  let poslednyFokus = null;
  function otvorModal(html, cls, label) {
    zatvorModal(true);
    poslednyFokus = document.activeElement;
    const m = document.createElement('div');
    m.className = 'modal ' + (cls || '');
    m.innerHTML = `<div class="modal-bg" data-close></div>
      <div class="modal-box" role="dialog" aria-modal="true" aria-label="${esc(label || 'Okno')}">
        <button class="modal-x" type="button" data-close aria-label="Zavrieť">&times;</button>${html}
      </div>`;
    document.body.appendChild(m);
    document.body.classList.add('modal-open');
    requestAnimationFrame(() => m.classList.add('in'));
    m.addEventListener('click', e => { if (e.target.closest('[data-close]')) { zatvorModal(); } });
    $('.modal-x', m).focus({ preventScroll: true });
    return m;
  }

  function zatvorModal(tiho) {
    const m = $('.modal');
    if (!m) return;
    m.remove();
    document.body.classList.remove('modal-open');
    if (tiho) return;
    if (location.hash) history.replaceState(null, '', location.pathname + location.search);
    if (poslednyFokus && poslednyFokus.focus) poslednyFokus.focus({ preventScroll: true });
  }

  function otvorVideo(id, titul) {
    otvorModal(`<div class="vid"><iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0" title="${esc(titul || 'Video')}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe></div>`, 'm-video', titul);
  }

  /* ---------- Novinky ---------- */
  function kartaNovinky(n) {
    const img = n.obrazok || (n.video ? `https://i.ytimg.com/vi/${n.video}/hqdefault.jpg` : 'img/galeria/bar-pult-m.webp');
    const href = n.odkaz || (n.video ? 'https://www.youtube.com/watch?v=' + n.video : 'novinky.html');
    const ext = /^https?:/i.test(href);
    return `<article class="nw-card">
      <a href="${esc(href)}"${ext ? ' target="_blank" rel="noopener"' : ''}${n.video ? ` data-video="${esc(n.video)}" data-title="${esc(n.titulok)}"` : ''}>
        <span class="nw-img"><img src="${esc(img)}" alt="" loading="lazy">${n.video ? '<span class="play" aria-hidden="true"></span>' : ''}</span>
        <span class="nw-meta">${n.video ? 'Video' : 'Oznam'}${n.datum ? ' · ' + fDatum(n.datum) : ''}</span>
        <h3>${esc(n.titulok)}</h3>
        ${!n.video && n.text ? `<p>${esc(n.text)}</p>` : ''}
      </a>
    </article>`;
  }

  const prazdne = html => `<p class="empty">${html}</p>`;
  const chybaHtml = t => prazdne(`${t} Aktuality nájdete na <a href="${esc(FB)}" target="_blank" rel="noopener">Facebooku</a> alebo zavolajte na <a href="${TEL_HREF}">${esc(TEL)}</a>.`);

  /* ---------- Stránky ---------- */
  async function initHomeAkcie() {
    const grid = $('#home-akcie');
    const bar = $('#nextbar');
    try {
      const buduce = (await nacitajAkcie()).filter(a => !a.minula);
      grid.innerHTML = buduce.length
        ? buduce.slice(0, 3).map(kartaAkcie).join('')
        : prazdne(`Program na ďalšie týždne práve pripravujeme. Sledujte nás na <a href="${esc(FB)}" target="_blank" rel="noopener">Facebooku</a>.`);
      const a = buduce[0];
      if (a && bar) {
        bar.innerHTML = `<div class="wrap"><span class="lbl">Najbližšie</span><strong>${fKratko(a.start)} ${esc(a.nazov)}</strong><span class="muted">${kedy(a)}</span><a class="btn btn-sm" href="akcie.html#${encodeURIComponent(a.id)}">${stav(a).moze ? 'Rezervovať miesto' : 'Detail akcie'}</a></div>`;
        bar.hidden = false;
      }
    } catch (err) {
      console.error(err);
      grid.innerHTML = chybaHtml('Program sa nepodarilo načítať.');
    }
  }

  async function initHomeNovinky() {
    const grid = $('#home-novinky');
    if (!grid) return;
    try {
      const n = await nacitajNovinky();
      grid.innerHTML = n.length ? n.slice(0, 3).map(kartaNovinky).join('') : prazdne('Zatiaľ tu nič nie je.');
    } catch (err) {
      console.error(err);
      grid.innerHTML = chybaHtml('Novinky sa nepodarilo načítať.');
    }
  }

  async function initAkcie() {
    const cal = $('#kalendar');
    const list = $('#zoznam');
    const listTitul = $('#zoznam-titul');
    let akcie;
    try {
      akcie = await nacitajAkcie();
    } catch (err) {
      console.error(err);
      cal.innerHTML = chybaHtml('Kalendár sa nepodarilo načítať.');
      list.innerHTML = '';
      return;
    }

    const dnes = new Date();
    const vMesiaci = (y, m) => akcie.filter(a => a.start.getFullYear() === y && a.start.getMonth() === m);
    let mes = new Date(dnes.getFullYear(), dnes.getMonth(), 1);
    if (!vMesiaci(mes.getFullYear(), mes.getMonth()).some(a => !a.minula)) {
      const dalsia = akcie.find(a => !a.minula);
      if (dalsia) mes = new Date(dalsia.start.getFullYear(), dalsia.start.getMonth(), 1);
    }

    const render = () => {
      const y = mes.getFullYear();
      const m = mes.getMonth();
      const posun = (new Date(y, m, 1).getDay() + 6) % 7;
      const bunky = Math.ceil((posun + new Date(y, m + 1, 0).getDate()) / 7) * 7;
      let h = `<div class="cal-head">
          <button class="cal-nav" type="button" data-m="-1" aria-label="Predchádzajúci mesiac">&lsaquo;</button>
          <h2 aria-live="polite">${MES[m]} ${y}</h2>
          <button class="cal-nav" type="button" data-m="1" aria-label="Nasledujúci mesiac">&rsaquo;</button>
        </div><div class="cal-grid">${DNI_KR.map(d => `<div class="cal-dow">${d}</div>`).join('')}`;
      for (let k = 0; k < bunky; k++) {
        const d = new Date(y, m, 1 - posun + k);
        const ev = akcie.filter(a => a.start.toDateString() === d.toDateString());
        const cls = ['cal-cell', d.getMonth() !== m && 'other', d.toDateString() === dnes.toDateString() && 'today'].filter(Boolean).join(' ');
        h += `<div class="${cls}"><span class="cal-num">${d.getDate()}</span>${ev
          .map(a => `<button type="button" class="cal-ev t-${esc(a.typ)}${a.minula ? ' past' : ''}" data-akcia="${esc(a.id)}">${esc(a.nazov)}</button>`)
          .join('')}</div>`;
      }
      cal.innerHTML = h + '</div>';

      const tieto = vMesiaci(y, m);
      listTitul.textContent = `Akcie v ${MES_LOK[m]}`;
      const neskor = akcie.some(a => !a.minula && a.start > new Date(y, m + 1, 0, 23, 59));
      list.innerHTML = tieto.length
        ? tieto.map(kartaAkcie).join('')
        : prazdne(`V ${MES_LOK[m]} zatiaľ nič naplánované nemáme.` + (neskor ? ' Pozrite sa na ďalší mesiac.' : ` Novinky dávame aj na <a href="${esc(FB)}" target="_blank" rel="noopener">Facebook</a>.`));
    };

    cal.addEventListener('click', e => {
      const b = e.target.closest('[data-m]');
      if (!b) return;
      mes = new Date(mes.getFullYear(), mes.getMonth() + Number(b.dataset.m), 1);
      render();
    });
    document.addEventListener('click', e => {
      const t = e.target.closest('[data-akcia]');
      if (!t || t.closest('.modal')) return;
      const a = akcie.find(x => x.id === t.dataset.akcia);
      if (!a) return;
      e.preventDefault();
      otvorAkciu(a);
    });
    document.addEventListener('sf:zmena', render);
    render();

    const otvorZHashu = () => {
      const hash = decodeURIComponent(location.hash.slice(1));
      const a = hash && akcie.find(x => x.id === hash);
      if (!a) return;
      mes = new Date(a.start.getFullYear(), a.start.getMonth(), 1);
      render();
      otvorAkciu(a);
    };
    window.addEventListener('hashchange', otvorZHashu);
    otvorZHashu();
  }

  async function initNovinky() {
    const grid = $('#novinky-grid');
    const filter = $('#novinky-filter');
    let vsetky;
    try {
      vsetky = await nacitajNovinky();
    } catch (err) {
      console.error(err);
      grid.innerHTML = chybaHtml('Novinky sa nepodarilo načítať.');
      return;
    }
    const render = typ => {
      const z = vsetky.filter(n => typ === 'vsetko' || (typ === 'video' ? n.video : !n.video));
      grid.innerHTML = z.length ? z.map(kartaNovinky).join('') : prazdne('V tejto kategórii zatiaľ nič nie je.');
    };
    if (filter) {
      filter.addEventListener('click', e => {
        const b = e.target.closest('button[data-f]');
        if (!b) return;
        $$('button', filter).forEach(x => x.setAttribute('aria-pressed', String(x === b)));
        render(b.dataset.f);
      });
    }
    render('vsetko');
  }

  function initGaleria() {
    const polozky = $$('.gal a');
    if (!polozky.length) return;
    let i = 0;
    let m = null;
    const ukaz = () => {
      const a = polozky[i];
      const alt = $('img', a).alt;
      const img = $('.lb img', m);
      img.src = a.getAttribute('href');
      img.alt = alt;
      $('.lb figcaption', m).textContent = `${alt} · ${i + 1} / ${polozky.length}`;
    };
    const krok = d => { i = (i + d + polozky.length) % polozky.length; ukaz(); };
    polozky.forEach((a, k) =>
      a.addEventListener('click', e => {
        e.preventDefault();
        i = k;
        m = otvorModal('<figure class="lb"><img src="" alt=""><figcaption></figcaption></figure><button class="lb-nav lb-prev" type="button" aria-label="Predchádzajúca fotka">&lsaquo;</button><button class="lb-nav lb-next" type="button" aria-label="Ďalšia fotka">&rsaquo;</button>', 'm-lb', 'Galéria');
        $('.lb-prev', m).addEventListener('click', () => krok(-1));
        $('.lb-next', m).addEventListener('click', () => krok(1));
        let x0 = null;
        m.addEventListener('touchstart', ev => { x0 = ev.touches[0].clientX; }, { passive: true });
        m.addEventListener('touchend', ev => {
          if (x0 === null) return;
          const dx = ev.changedTouches[0].clientX - x0;
          if (Math.abs(dx) > 50) krok(dx < 0 ? 1 : -1);
          x0 = null;
        });
        ukaz();
      })
    );
    document.addEventListener('keydown', e => {
      if (!m || !m.isConnected) return;
      if (e.key === 'ArrowRight') krok(1);
      if (e.key === 'ArrowLeft') krok(-1);
    });
  }

  function initHlavicka() {
    const hdr = $('#hdr');
    const burger = $('.burger');
    const zmenaScrollu = () => hdr && hdr.classList.toggle('solid', window.scrollY > 30);
    zmenaScrollu();
    window.addEventListener('scroll', zmenaScrollu, { passive: true });
    const nastav = otvor => {
      document.body.classList.toggle('nav-open', otvor);
      if (burger) burger.setAttribute('aria-expanded', String(otvor));
    };
    if (burger) burger.addEventListener('click', () => nastav(!document.body.classList.contains('nav-open')));
    $$('#nav a').forEach(a => a.addEventListener('click', () => nastav(false)));
  }

  function initReveal() {
    const el = $$('.rv');
    if (!('IntersectionObserver' in window)) { el.forEach(x => x.classList.add('in')); return; }
    const io = new IntersectionObserver(zaznamy => zaznamy.forEach(z => {
      if (z.isIntersecting) { z.target.classList.add('in'); io.unobserve(z.target); }
    }), { rootMargin: '0px 0px -8% 0px' });
    el.forEach(x => io.observe(x));
  }

  function initMapa() {
    const btn = $('#mapa-btn');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const w = $('#mapa');
      w.innerHTML = `<iframe src="${esc(w.dataset.src)}" title="Mapa – Spirit Family, Stromová 1, Trenčín" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>`;
    });
  }

  /* ---------- Štart ---------- */
  document.addEventListener('keydown', e => { if (e.key === 'Escape') zatvorModal(); });
  document.addEventListener('click', e => {
    const v = e.target.closest('[data-video]');
    if (!v || e.ctrlKey || e.metaKey || e.shiftKey) return;
    e.preventDefault();
    otvorVideo(v.dataset.video, v.dataset.title);
  });
  $$('[data-rok]').forEach(x => { x.textContent = new Date().getFullYear(); });

  initHlavicka();
  initReveal();
  initGaleria();
  initMapa();

  const stranka = document.body.dataset.page;
  if (stranka === 'index') { initHomeAkcie(); initHomeNovinky(); }
  if (stranka === 'akcie') initAkcie();
  if (stranka === 'novinky') initNovinky();

  if (DEMO) {
    const b = document.createElement('div');
    b.className = 'demo-badge';
    b.textContent = 'Ukážkový režim';
    b.title = 'Web ešte nie je napojený na Google tabuľku. Akcie sú z data/akcie.json a rezervácie sa neukladajú.';
    document.body.appendChild(b);
  }
})();
