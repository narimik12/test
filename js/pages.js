/* ============================================
   Рендеры страниц ArduInfo
   ============================================ */

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function highlight(src) {
  let t = esc(src);
  const kw = HL_KEYWORDS.join('|');
  const fn = HL_FUNCS.join('|');
  const rx = new RegExp(
    '(\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/)' +
    '|("(?:[^"\\\\]|\\\\.)*")' +
    "|('(?:[^'\\\\]|\\\\.)*')" +
    '|(#(?:include|define)[^\\n]*)' +
    '|\\b(' + kw + ')\\b' +
    '|\\b(' + fn + ')\\b' +
    '|\\b([0-9]+(?:\\.[0-9]+)?)\\b',
    'g'
  );
  t = t.replace(rx, (m, cmt, str, str2, macro, kw, fn, num) => {
    if (cmt)  return '<span class="cmt">' + cmt + '</span>';
    if (str)  return '<span class="str">' + str + '</span>';
    if (str2) return '<span class="str">' + str2 + '</span>';
    if (macro)return '<span class="macro">' + macro + '</span>';
    if (kw)   return '<span class="kw">' + kw + '</span>';
    if (fn)   return '<span class="fn">' + fn + '</span>';
    if (num)  return '<span class="num">' + num + '</span>';
    return m;
  });
  return t;
}

function renderCode(code, name) {
  return '<div class="code-wrap">' +
    '<div class="code-head">' +
      '<span>' + esc(name || 'sketch.ino') + '</span>' +
      '<button class="copy-btn" data-copy>Копировать</button>' +
    '</div>' +
    '<pre><code>' + highlight(code) + '</code></pre>' +
  '</div>';
}

function renderWiring(text) {
  if (!text || !text.trim()) return '';
  return '<div class="wiring"><pre>' + esc(text.trim()) + '</pre></div>';
}

function projectCard(p) {
  return '<article class="project-card" data-id="' + p.id + '">' +
    '<div class="project-header">' +
      '<div class="project-icon">' + icon(p.icon, 28) + '</div>' +
      '<span class="badge">' + esc(p.time) + '</span>' +
    '</div>' +
    '<div class="project-body">' +
      '<h3>' + esc(p.title) + '</h3>' +
      '<p>' + esc(p.short) + '</p>' +
      '<div class="project-footer">' +
        '<span class="badge badge-accent">' + esc(p.category) + '</span>' +
        '<span class="badge">' + esc(p.level) + '</span>' +
      '</div>' +
    '</div>' +
  '</article>';
}

/* ---------- Главная ---------- */
function renderHome() {
  const featured = ['blink','button-led','ultrasonic','dht11','servo','lcd1602']
    .map(id => PROJECTS.find(p => p.id === id)).filter(Boolean);

  app.innerHTML = `
  <section class="hero">
    <div class="container hero-grid">
      <div>
        <h1>Проекты и инструменты <em>для Arduino</em></h1>
        <p class="lead">Готовые скетчи, калькуляторы компонентов и справочные материалы. Для тех, кто начинает с железа.</p>
        <div class="hero-actions">
          <a class="btn btn-primary" href="#/projects">Все проекты →</a>
          <a class="btn btn-ghost" href="#/resistor">Расчёт резисторов</a>
        </div>
        <div class="hero-stats">
          <div class="hero-stat"><b>${PROJECTS.length}</b><span>Проектов</span></div>
          <div class="hero-stat"><b>6</b><span>Калькуляторов</span></div>
          <div class="hero-stat"><b>100%</b><span>Бесплатно</span></div>
        </div>
      </div>
      <div class="hero-art">
        <div class="hero-art-header">
          <div class="hero-art-dot"></div>
          <div class="hero-art-dot"></div>
          <div class="hero-art-dot"></div>
        </div>
        <div class="hero-art-body">
          <div style="color:#6a9955">// blink.ino</div>
          <div>&nbsp;</div>
          <div><span style="color:#569cd6">void</span> <span style="color:#dcdcaa">setup</span>() {</div>
          <div>&nbsp;&nbsp;<span style="color:#dcdcaa">pinMode</span>(LED_BUILTIN, OUTPUT);</div>
          <div>}</div>
          <div>&nbsp;</div>
          <div><span style="color:#569cd6">void</span> <span style="color:#dcdcaa">loop</span>() {</div>
          <div>&nbsp;&nbsp;<span style="color:#dcdcaa">digitalWrite</span>(LED_BUILTIN, HIGH);</div>
          <div>&nbsp;&nbsp;<span style="color:#dcdcaa">delay</span>(<span style="color:#b5cea8">1000</span>);</div>
          <div>&nbsp;&nbsp;<span style="color:#dcdcaa">digitalWrite</span>(LED_BUILTIN, LOW);</div>
          <div>&nbsp;&nbsp;<span style="color:#dcdcaa">delay</span>(<span style="color:#b5cea8">1000</span>);</div>
          <div>}</div>
        </div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="section-head">
        <h2>Калькуляторы</h2>
        <p>Расчёты прямо в браузере: резисторы, закон Ома, светодиоды, АЦП.</p>
      </div>
      <div class="tools-grid">
        <a href="#/resistor" class="tool-card">
          <div class="tool-icon">${icon('ruler', 22)}</div>
          <h3>Маркировка резисторов</h3>
          <p>Цветовые полосы 4, 5, 6 — прямой и обратный расчёт.</p>
          <div class="arrow">→</div>
        </a>
        <a href="#/tools" class="tool-card">
          <div class="tool-icon">${icon('bulb', 22)}</div>
          <h3>Резистор для LED</h3>
          <p>Подбор номинала и мощности под параметры светодиода.</p>
          <div class="arrow">→</div>
        </a>
        <a href="#/tools" class="tool-card">
          <div class="tool-icon">${icon('bolt', 22)}</div>
          <h3>Закон Ома</h3>
          <p>U, I, R, P — известны два, считаем остальные.</p>
          <div class="arrow">→</div>
        </a>
        <a href="#/tools" class="tool-card">
          <div class="tool-icon">${icon('chart', 22)}</div>
          <h3>Пересчёт АЦП</h3>
          <p>Из raw-значения analogRead() в вольты.</p>
          <div class="arrow">→</div>
        </a>
      </div>
    </div>
  </section>

  <section class="section section-alt">
    <div class="container">
      <div class="section-head">
        <h2>Проекты для старта</h2>
        <p>Каждый — со схемой подключения, кодом и пояснениями.</p>
      </div>
      <div class="projects-grid">
        ${featured.map(projectCard).join('')}
      </div>
      <div class="text-center mt-md">
        <a class="btn btn-primary" href="#/projects">Все проекты →</a>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="section-head">
        <h2>Что внутри</h2>
        <p>Не развод, а конкретика.</p>
      </div>
      <div class="features-list">
        <div class="feature-row">
          <div class="feature-icon">${icon('code', 22)}</div>
          <div class="feature-text">
            <h3>Прокомментированный код</h3>
            <p>Каждый скетч с пояснениями. Без «магических чисел» — только понятные константы.</p>
          </div>
        </div>
        <div class="feature-row">
          <div class="feature-icon">${icon('plug', 22)}</div>
          <div class="feature-text">
            <h3>Схемы подключения</h3>
            <p>Кто куда подключён: пины, цвета проводов, полярность. Не нужно гадать по фото.</p>
          </div>
        </div>
        <div class="feature-row">
          <div class="feature-icon">${icon('calculator', 22)}</div>
          <div class="feature-text">
            <h3>Живые расчёты</h3>
            <p>Не нужно открывать Excel — считайте номиналы и токи в браузере.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
  `;
  bindProjectClicks();
  bindCopyButtons();
}

function bindProjectClicks() {
  document.querySelectorAll('.project-card').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      location.hash = '#/project/' + card.dataset.id;
    });
  });
}

/* ---------- Проекты (список) ---------- */
function renderProjects() {
  app.innerHTML = `
  <section class="section">
    <div class="container">
      <div class="breadcrumbs"><a href="#/">Главная</a><span>/</span><span>Проекты</span></div>
      <h1>Проекты на Arduino</h1>
      <p class="lead">Готовые схемы с кодом, компонентами и пошаговой сборкой.</p>

      <div class="filters mt-sm">
        <input type="search" class="search-input" id="projectSearch" placeholder="Поиск: дальномер, дисплей, PWM…">
      </div>
      <div class="chips" id="categoryChips" style="margin-bottom:24px"></div>
      <div class="projects-grid" id="projectsGrid"></div>
    </div>
  </section>`;

  const chipsWrap = document.getElementById('categoryChips');
  const searchInput = document.getElementById('projectSearch');
  const grid = document.getElementById('projectsGrid');
  let activeCategory = 'Все', query = '';

  CATEGORIES.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'chip' + (cat === 'Все' ? ' active' : '');
    btn.textContent = cat;
    btn.addEventListener('click', () => {
      activeCategory = cat;
      chipsWrap.querySelectorAll('.chip').forEach(c => c.classList.toggle('active', c === btn));
      render();
    });
    chipsWrap.appendChild(btn);
  });

  function render() {
    const list = PROJECTS.filter(p => {
      const okCat = activeCategory === 'Все' || p.category === activeCategory;
      const hay = (p.title + ' ' + p.short + ' ' + p.category + ' ' + p.level).toLowerCase();
      return okCat && (!query || hay.includes(query));
    });
    if (!list.length) {
      grid.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:60px 20px; color:var(--muted)">Ничего не найдено</div>';
      return;
    }
    grid.innerHTML = list.map(projectCard).join('');
    bindProjectClicks();
  }

  searchInput.addEventListener('input', () => { query = searchInput.value.trim().toLowerCase(); render(); });
  render();
}

/* ---------- Страница проекта ---------- */
function renderProject(id) {
  const p = PROJECTS.find(x => x.id === id);
  if (!p) {
    app.innerHTML = '<section class="section"><div class="container"><div style="text-align:center; padding:80px;"><h2>Проект не найден</h2><a class="btn btn-primary" href="#/projects" style="margin-top:20px;">Все проекты</a></div></div></section>';
    return;
  }
  document.title = p.title + ' — ArduInfo';

  const related = PROJECTS.filter(x => x.id !== p.id && x.category === p.category).slice(0, 3);
  const fallback = PROJECTS.filter(x => x.id !== p.id).slice(0, 3);
  const rel = related.length ? related : fallback;

  app.innerHTML = `
  <section class="section">
    <div class="container" style="max-width:900px">
      <div class="breadcrumbs">
        <a href="#/">Главная</a><span>/</span>
        <a href="#/projects">Проекты</a><span>/</span>
        <span>${esc(p.title)}</span>
      </div>

      <div style="margin-bottom:16px; color:var(--accent)">${icon(p.icon, 48)}</div>
      <h1 style="margin-bottom:16px">${esc(p.title)}</h1>
      <div style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:28px;">
        <span class="badge badge-accent">${esc(p.category)}</span>
        <span class="badge">${esc(p.level)}</span>
        <span class="badge">${esc(p.time)}</span>
      </div>
      <p class="lead">${esc(p.description)}</p>

      <div class="mt-md">
        <h2>Компоненты</h2>
        <ul class="comp-list">
          ${p.components.map(c => '<li class="comp-item">' + esc(c) + '</li>').join('')}
        </ul>
      </div>

      ${renderWiring(p.wiring)}

      <div class="mt-md">
        <h2>Сборка</h2>
        <ol class="step-list">
          ${p.steps.map(s => '<li class="step-item"><div class="step-num"></div><b>' + esc(s.t) + '</b><p>' + esc(s.d) + '</p></li>').join('')}
        </ol>
      </div>

      <div class="mt-md">
        <h2>Код</h2>
        ${renderCode(p.code, p.id + '.ino')}
      </div>

      <div class="mt-md">
        <h2>Советы</h2>
        <ul class="tip-list">
          ${p.tips.map(t => '<li class="tip-item">' + esc(t) + '</li>').join('')}
        </ul>
      </div>

      <div style="display:flex; gap:12px; flex-wrap:wrap; margin:40px 0;">
        <a class="btn btn-ghost" href="#/projects">← Все проекты</a>
        <a class="btn btn-primary" href="#/resistor">Расчёт резисторов</a>
      </div>
    </div>
  </section>

  <section class="section section-alt">
    <div class="container">
      <h2>Похожие проекты</h2>
      <div class="projects-grid mt-sm">${rel.map(projectCard).join('')}</div>
    </div>
  </section>`;

  bindProjectClicks();
  bindCopyButtons();
}

/* ---------- Калькулятор резисторов ---------- */
function fmtOhm(v) {
  if (!isFinite(v) || v <= 0) return '—';
  if (v >= 1e9) return (v / 1e9).toFixed(2).replace(/\.?0+$/, '') + ' ГОм';
  if (v >= 1e6) return (v / 1e6).toFixed(2).replace(/\.?0+$/, '') + ' МОм';
  if (v >= 1e3) return (v / 1e3).toFixed(2).replace(/\.?0+$/, '') + ' кОм';
  return v.toFixed(2).replace(/\.?0+$/, '') + ' Ом';
}

function renderResistor() {
  app.innerHTML = `
  <section class="section">
    <div class="container">
      <div class="breadcrumbs"><a href="#/">Главная</a><span>/</span><a href="#/tools">Инструменты</a><span>/</span><span>Резисторы</span></div>
      <h1>Калькулятор резисторов</h1>
      <p class="lead">Определение номинала по цветным полосам и обратный расчёт.</p>

      <div class="tool-panel mt-sm">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px; margin-bottom:24px;">
          <h2 style="margin:0">По полосам</h2>
          <div class="chips" id="bandChips">
            <button type="button" class="chip active" data-bands="4">4 полосы</button>
            <button type="button" class="chip" data-bands="5">5 полос</button>
            <button type="button" class="chip" data-bands="6">6 полос</button>
          </div>
        </div>

        <div class="resistor-visual" aria-label="Визуальное представление резистора">
          <div class="r-lead"></div>
          <div class="r-body">
            <span class="band b1" id="vBand1"></span>
            <span class="band" id="vBand2"></span>
            <span class="band" id="vBand3"></span>
            <span class="band" id="vBandMult"></span>
            <span class="band b-tol" id="vBandTol"></span>
            <span class="band b-tol" id="vBandTemp"></span>
          </div>
          <div class="r-lead"></div>
        </div>

        <div class="form-row" style="margin-top:28px">
          <div class="field"><label for="band1">Полоса 1</label><select id="band1"></select></div>
          <div class="field"><label for="band2">Полоса 2</label><select id="band2"></select></div>
          <div class="field" id="wrapBand3"><label for="band3">Полоса 3</label><select id="band3"></select></div>
          <div class="field"><label for="bandMult">Множитель</label><select id="bandMult"></select></div>
          <div class="field"><label for="bandTol">Точность</label><select id="bandTol"></select></div>
          <div class="field" id="wrapBandTemp" style="display:none"><label for="bandTemp">ТКС</label><select id="bandTemp"></select></div>
        </div>
        <div class="result-box" id="resistorResult" aria-live="polite"></div>
      </div>

      <div class="tool-panel">
        <h2 style="margin-bottom:20px">Обратный расчёт</h2>
        <div class="form-row">
          <div class="field"><label for="reverseInput">Сопротивление</label><input type="number" id="reverseInput" inputmode="decimal" placeholder="470" step="any" min="0"></div>
          <div class="field"><label for="reverseUnit">Единица</label><select id="reverseUnit">
            <option value="1">Ом</option><option value="1000" selected>кОм</option><option value="1000000">МОм</option>
          </select></div>
          <div class="field" style="justify-content:flex-end"><label>&nbsp;</label><button type="button" class="btn btn-primary" id="reverseBtn">Подобрать</button></div>
        </div>
        <div class="result-box" id="reverseResult" aria-live="polite"><p>Введите значение и нажмите «Подобрать».</p></div>
      </div>

      <div class="mt-md">
        <h2>Таблица цветовой маркировки</h2>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Цвет</th><th>Цифра</th><th>Множитель</th><th>Точность</th><th>ТКС, ppm/°C</th></tr>
            </thead>
            <tbody>
              ${COLORS.map(c => '<tr><td>' + esc(c.name) + '</td><td>' + (c.digit !== null ? c.digit : '—') + '</td><td>×' + c.mult + '</td><td>' + (c.tol !== null ? '±' + c.tol + '%' : '—') + '</td><td>' + (c.temp !== null ? c.temp : '—') + '</td></tr>').join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>`;

  let bands = 4;
  const $ = id => document.getElementById(id);

  function fillSelect(id, filterFn, selectedName) {
    const sel = $(id);
    sel.innerHTML = '';
    COLORS.forEach((c, i) => {
      if (filterFn && !filterFn(c)) return;
      const opt = document.createElement('option');
      opt.value = String(i);
      opt.textContent = c.name;
      sel.appendChild(opt);
    });
    if (selectedName) {
      const idx = COLORS.findIndex(c => c.name === selectedName && (!filterFn || filterFn(c)));
      if (idx >= 0) sel.value = String(idx);
    }
  }

  function calculate() {
    const c1 = COLORS[Number($('band1').value)];
    const c2 = COLORS[Number($('band2').value)];
    const c3 = bands >= 5 ? COLORS[Number($('band3').value)] : null;
    const cm = COLORS[Number($('bandMult').value)];
    const ct = COLORS[Number($('bandTol').value)];
    const cc = bands === 6 ? COLORS[Number($('bandTemp').value)] : null;

    if (!c1 || !c2 || !cm || !ct || (bands >= 5 && !c3) || (bands === 6 && !cc)) {
      $('resistorResult').innerHTML = '<p>Выберите все полосы.</p>';
      return;
    }

    const base = bands >= 5
      ? c1.digit * 100 + c2.digit * 10 + c3.digit
      : c1.digit * 10 + c2.digit;
    const value = base * cm.mult;
    const tol = ct.tol ?? 20;

    const paint = (el, c) => {
      if (!el) return;
      el.style.background = c ? c.hex : 'transparent';
      el.style.boxShadow = c && c.name === 'Белый' ? 'inset 0 0 0 1px #bbb' : 'inset 0 0 3px rgba(0,0,0,.35)';
    };
    paint($('vBand1'), c1);
    paint($('vBand2'), c2);
    paint($('vBand3'), c3);
    paint($('vBandMult'), cm);
    paint($('vBandTol'), ct);
    paint($('vBandTemp'), cc);
    $('vBand3').style.display = bands >= 5 ? '' : 'none';
    $('vBandTemp').style.display = bands === 6 ? '' : 'none';

    $('resistorResult').innerHTML =
      '<div class="result-main">' + fmtOhm(value) + ' ± ' + tol + '%</div>' +
      '<p style="margin-top:8px">Диапазон: ' + fmtOhm(value * (1 - tol / 100)) + ' — ' + fmtOhm(value * (1 + tol / 100)) + '</p>' +
      '<div class="result-grid">' +
        '<div class="result-item"><span>Номинал</span><b>' + fmtOhm(value) + '</b></div>' +
        '<div class="result-item"><span>Точность</span><b>± ' + tol + '%</b></div>' +
        '<div class="result-item"><span>Полос</span><b>' + bands + '</b></div>' +
        (bands === 6 ? '<div class="result-item"><span>ТКС</span><b>' + cc.temp + ' ppm/°C</b></div>' : '') +
      '</div>';
  }

  function setupBands(n) {
    bands = n;
    const isDigit = c => c.digit !== null;
    const isMult  = c => c.mult !== null;
    const isTol   = c => c.tol !== null;
    const isTemp  = c => c.temp !== null;

    fillSelect('band1', isDigit, 'Коричневый');
    fillSelect('band2', isDigit, 'Чёрный');
    fillSelect('band3', isDigit, 'Красный');
    fillSelect('bandMult', isMult, n >= 5 ? 'Коричневый' : 'Красный');
    fillSelect('bandTol', isTol, 'Золотой');
    fillSelect('bandTemp', isTemp, 'Коричневый');

    $('wrapBand3').style.display = n >= 5 ? '' : 'none';
    $('wrapBandTemp').style.display = n === 6 ? '' : 'none';
    document.querySelectorAll('#bandChips [data-bands]').forEach(b => b.classList.toggle('active', Number(b.dataset.bands) === n));
    calculate();
  }

  document.querySelectorAll('#bandChips [data-bands]').forEach(btn => {
    btn.addEventListener('click', () => setupBands(Number(btn.dataset.bands)));
  });
  ['band1','band2','band3','bandMult','bandTol','bandTemp'].forEach(id => $(id).addEventListener('change', calculate));

  function reverseCalculate() {
    const raw = String($('reverseInput').value).trim().replace(',', '.');
    const amount = Number(raw);
    const unit = Number($('reverseUnit').value);
    const result = $('reverseResult');
    if (!Number.isFinite(amount) || amount <= 0 || !Number.isFinite(unit)) {
      result.innerHTML = '<p>Введите положительное число.</p>';
      return;
    }

    const target = amount * unit;
    const exp = Math.floor(Math.log10(target));
    let best = null, bestDiff = Infinity;

    for (let e = Math.max(0, exp - 2); e <= exp + 2; e++) {
      for (const m of E24) {
        const cand = m * Math.pow(10, e - 1);
        if (cand <= 0) continue;
        const diff = Math.abs(cand - target);
        if (diff < bestDiff) { bestDiff = diff; best = cand; }
      }
    }

    function nearestE24(v) {
      const e = Math.floor(Math.log10(v));
      let b = null, bd = Infinity;
      for (const m of E24) {
        const c = m * Math.pow(10, e - 1);
        if (c <= 0) continue;
        const d = Math.abs(c - v);
        if (d < bd) { bd = d; b = c; }
      }
      return b;
    }

    function bands4(v) {
      const e = Math.floor(Math.log10(v));
      const m = Math.round(v / Math.pow(10, e - 1));
      if (m < 10 || m > 99) return null;
      const d1 = Math.floor(m / 10);
      const d2 = m % 10;
      const mult = Math.pow(10, e - 1);
      const c1 = COLORS.find(c => c.digit === d1);
      const c2 = COLORS.find(c => c.digit === d2);
      const cm = COLORS.find(c => Math.abs(c.mult - mult) < 1e-12);
      if (!c1 || !c2 || !cm) return null;
      return [c1, c2, null, cm];
    }

    function bands5(v) {
      const e = Math.floor(Math.log10(v));
      const m = Math.round(v / Math.pow(10, e - 2));
      if (m < 100 || m > 999) return null;
      const d1 = Math.floor(m / 100);
      const d2 = Math.floor((m % 100) / 10);
      const d3 = m % 10;
      const mult = Math.pow(10, e - 2);
      const c1 = COLORS.find(c => c.digit === d1);
      const c2 = COLORS.find(c => c.digit === d2);
      const c3 = COLORS.find(c => c.digit === d3);
      const cm = COLORS.find(c => Math.abs(c.mult - mult) < 1e-12);
      if (!c1 || !c2 || !c3 || !cm) return null;
      return [c1, c2, c3, cm];
    }

    let html = '<div class="result-main">' + fmtOhm(target) + '</div>';
    html += '<p style="margin-top:8px">Ближайший стандарт E24: <b>' + fmtOhm(best) + '</b> (отклонение ' + ((bestDiff/target)*100).toFixed(2) + '%)</p>';

    const b4 = bands4(best);
    const b5 = bands5(best);
    if (b4) {
      html += '<div style="margin-top:16px"><b>4 полосы:</b> ' + b4.map(c => '<span style="display:inline-block;width:14px;height:14px;border-radius:3px;background:' + c.hex + ';vertical-align:middle;margin:0 4px;border:1px solid rgba(0,0,0,.2)"></span>' + esc(c.name)).join(' ') + '</div>';
    }
    if (b5) {
      html += '<div style="margin-top:8px"><b>5 полос:</b> ' + b5.map(c => '<span style="display:inline-block;width:14px;height:14px;border-radius:3px;background:' + c.hex + ';vertical-align:middle;margin:0 4px;border:1px solid rgba(0,0,0,.2)"></span>' + esc(c.name)).join(' ') + '</div>';
    }
    result.innerHTML = html;
  }

  $('reverseBtn').addEventListener('click', reverseCalculate);
  $('reverseInput').addEventListener('keydown', e => { if (e.key === 'Enter') reverseCalculate(); });

  setupBands(4);
}

/* ---------- Инструменты ---------- */
function renderTools() {
  app.innerHTML = `
  <section class="section">
    <div class="container">
      <div class="breadcrumbs"><a href="#/">Главная</a><span>/</span><span>Инструменты</span></div>
      <h1>Калькуляторы</h1>
      <p class="lead">Расчёты для повседневной работы с Arduino и аналоговой электроникой.</p>

      <div class="tool-panel mt-sm">
        <h2>Закон Ома</h2>
        <p>Заполните любые два поля — остальные пересчитаются.</p>
        <div class="form-row">
          <div class="field"><label>U, В</label><input type="number" id="ohmU" min="0" step="any" placeholder="Напряжение"></div>
          <div class="field"><label>I, А</label><input type="number" id="ohmI" min="0" step="any" placeholder="Ток"></div>
          <div class="field"><label>R, Ом</label><input type="number" id="ohmR" min="0" step="any" placeholder="Сопротивление"></div>
          <div class="field"><label>P, Вт</label><input type="number" id="ohmP" min="0" step="any" placeholder="Мощность"></div>
        </div>
        <button class="btn btn-primary" id="ohmBtn">Рассчитать</button>
        <div class="result-box"><div class="result-main" id="ohmResult">—</div></div>
      </div>

      <div class="tool-panel">
        <h2>Резистор для светодиода</h2>
        <p>Подбор номинала и проверка мощности резистора.</p>
        <div class="form-row">
          <div class="field"><label>Напряжение питания, В</label><input type="number" id="ledVs" value="5" min="0" step="any"></div>
          <div class="field"><label>Падение на LED, В</label><input type="number" id="ledVf" value="2" min="0" step="any"></div>
          <div class="field"><label>Ток, мА</label><input type="number" id="ledIf" value="20" min="0" step="any"></div>
        </div>
        <button class="btn btn-primary" id="ledBtn">Рассчитать</button>
        <div class="result-box"><div class="result-main" id="ledResult">—</div></div>
      </div>

      <div class="tool-panel">
        <h2>Делитель напряжения</h2>
        <p>Применяется для согласования уровней или измерения высокого напряжения.</p>
        <div class="form-row">
          <div class="field"><label>Vin, В</label><input type="number" id="divVin" value="12" min="0" step="any"></div>
          <div class="field"><label>R1 (верх), Ом</label><input type="number" id="divR1" value="10000" min="0" step="any"></div>
          <div class="field"><label>R2 (низ), Ом</label><input type="number" id="divR2" value="10000" min="0" step="any"></div>
        </div>
        <button class="btn btn-primary" id="divBtn">Рассчитать</button>
        <div class="result-box"><div class="result-main" id="divResult">—</div></div>
      </div>

      <div class="tool-panel">
        <h2>RC-цепочка</h2>
        <p>Постоянная времени τ = R × C. Конденсатор заряжается до 63% за время τ.</p>
        <div class="form-row">
          <div class="field"><label>R, Ом</label><input type="number" id="rcR" value="10000" min="0" step="any"></div>
          <div class="field"><label>C, мкФ</label><input type="number" id="rcC" value="100" min="0" step="any"></div>
        </div>
        <button class="btn btn-primary" id="rcBtn">Рассчитать</button>
        <div class="result-box"><div class="result-main" id="rcResult">—</div></div>
      </div>

      <div class="tool-panel">
        <h2>Время работы от батареи</h2>
        <p>Оценка по ёмкости и среднему току потребления.</p>
        <div class="form-row">
          <div class="field"><label>Ёмкость, мА·ч</label><input type="number" id="batCap" value="2000" min="0" step="any"></div>
          <div class="field"><label>Ток, мА</label><input type="number" id="batCur" value="50" min="0" step="any"></div>
        </div>
        <button class="btn btn-primary" id="batBtn">Рассчитать</button>
        <div class="result-box"><div class="result-main" id="batResult">—</div></div>
      </div>

      <div class="tool-panel">
        <h2>Пересчёт АЦП</h2>
        <p>Перевод raw-значения analogRead() в вольты.</p>
        <div class="form-row">
          <div class="field"><label>analogRead()</label><input type="number" id="adcRaw" value="512" min="0" step="1"></div>
          <div class="field"><label>Vref, В</label><input type="number" id="adcVref" value="5" min="0" step="any"></div>
          <div class="field"><label>Разрядность</label><select id="adcBits"><option value="10" selected>10 бит</option><option value="12">12 бит</option><option value="16">16 бит</option></select></div>
        </div>
        <button class="btn btn-primary" id="adcBtn">Рассчитать</button>
        <div class="result-box"><div class="result-main" id="adcResult">—</div></div>
      </div>
    </div>
  </section>`;

  const num = id => {
    const el = document.getElementById(id);
    if (!el) return NaN;
    const raw = String(el.value).trim().replace(',', '.');
    if (raw === '' || !Number.isFinite(Number(raw))) return NaN;
    return Number(raw);
  };
  const put = (id, t) => { const el = document.getElementById(id); if (el) el.textContent = t; };
  const validPos = (...v) => v.every(x => Number.isFinite(x) && x > 0);
  const fmt = (v, d) => {
    if (!isFinite(v)) return '—';
    d = d === undefined ? 3 : d;
    if (Math.abs(v) >= 1e6 || (Math.abs(v) < 0.001 && v !== 0)) return v.toExponential(3);
    return parseFloat(v.toFixed(d)).toString();
  };

  document.getElementById('ohmBtn').addEventListener('click', () => {
    let U = num('ohmU'), I = num('ohmI'), R = num('ohmR'), P = num('ohmP');
    const has = v => Number.isFinite(v) && v > 0;
    const supplied = [U, I, R, P].filter(v => !Number.isNaN(v));
    if (supplied.some(v => !Number.isFinite(v) || v <= 0)) { put('ohmResult', 'Значения должны быть > 0'); return; }
    if (supplied.length < 2) { put('ohmResult', 'Заполните минимум два поля'); return; }
    if (has(U) && has(I)) { R = U / I; P = U * I; }
    else if (has(U) && has(R)) { I = U / R; P = U * U / R; }
    else if (has(U) && has(P)) { I = P / U; R = U * U / P; }
    else if (has(I) && has(R)) { U = I * R; P = I * I * R; }
    else if (has(I) && has(P)) { U = P / I; R = P / (I * I); }
    else if (has(R) && has(P)) { U = Math.sqrt(P * R); I = Math.sqrt(P / R); }
    document.getElementById('ohmU').value = isFinite(U) ? U.toFixed(4) : '';
    document.getElementById('ohmI').value = isFinite(I) ? I.toFixed(4) : '';
    document.getElementById('ohmR').value = isFinite(R) ? R.toFixed(4) : '';
    document.getElementById('ohmP').value = isFinite(P) ? P.toFixed(4) : '';
    put('ohmResult', 'I = ' + fmt(I) + ' А · R = ' + fmt(R) + ' Ом · P = ' + fmt(P) + ' Вт');
  });

  function ledCalc() {
    const Vs = num('ledVs'), Vf = num('ledVf'), If = num('ledIf');
    if (!validPos(Vs, If) || !Number.isFinite(Vf) || Vf < 0) { put('ledResult', 'Введите корректные значения'); return; }
    if (Vs <= Vf) { put('ledResult', 'Vs должно быть больше Vf'); return; }
    const R = (Vs - Vf) / (If / 1000);
    const P = (Vs - Vf) * (If / 1000);
    let std = null;
    const exp = Math.floor(Math.log10(R));
    for (let e = exp; e <= exp + 2 && !std; e++) {
      for (const m of E24) {
        const cand = m * Math.pow(10, e - 1);
        if (cand >= R) { std = cand; break; }
      }
    }
    put('ledResult', 'R = ' + fmt(R) + ' Ом → станд. ' + fmt(std) + ' Ом | P = ' + fmt(P * 1000, 2) + ' мВт' + (P > 0.125 ? ' ⚠️ > 0.125 Вт — нужен мощный резистор' : ' (достаточно 0.125 Вт)'));
  }
  document.getElementById('ledBtn').addEventListener('click', ledCalc);
  ['ledVs','ledVf','ledIf'].forEach(id => document.getElementById(id).addEventListener('input', debounce(ledCalc, 250)));
  ledCalc();

  document.getElementById('divBtn').addEventListener('click', () => {
    const Vin = num('divVin'), R1 = num('divR1'), R2 = num('divR2');
    if (!Number.isFinite(Vin) || Vin < 0 || !validPos(R1, R2)) { put('divResult', 'Введите корректные значения'); return; }
    const Vout = Vin * (R2 / (R1 + R2));
    const I = Vin / (R1 + R2);
    put('divResult', 'Vout = ' + fmt(Vout) + ' В | I = ' + fmt(I * 1000, 2) + ' мА | P = ' + fmt(Vin * I * 1000, 1) + ' мВт');
  });

  document.getElementById('rcBtn').addEventListener('click', () => {
    const R = num('rcR'), C = num('rcC');
    if (!validPos(R, C)) { put('rcResult', 'R и C должны быть > 0'); return; }
    const tau = R * C * 1e-6;
    put('rcResult', 'τ = ' + fmt(tau * 1000) + ' мс | 5τ (99%) = ' + fmt(tau * 5000) + ' мс');
  });

  document.getElementById('batBtn').addEventListener('click', () => {
    const cap = num('batCap'), cur = num('batCur');
    if (!validPos(cap, cur)) { put('batResult', 'Значения должны быть > 0'); return; }
    const hours = cap / cur;
    put('batResult', '≈ ' + fmt(hours, 1) + ' ч | ≈ ' + fmt(hours / 24, 2) + ' суток');
  });

  document.getElementById('adcBtn').addEventListener('click', () => {
    const raw = num('adcRaw'), vref = num('adcVref'), bits = num('adcBits');
    if (!Number.isInteger(raw) || !Number.isFinite(vref) || vref <= 0 || ![10, 12, 16].includes(bits)) { put('adcResult', 'Ошибка ввода'); return; }
    const maxVal = Math.pow(2, bits) - 1;
    if (raw < 0 || raw > maxVal) { put('adcResult', 'Диапазон: 0…' + maxVal); return; }
    const V = raw * vref / maxVal;
    put('adcResult', V.toFixed(4) + ' В (' + (V * 1000).toFixed(2) + ' мВ)');
  });

  // Enter на полях
  ['ohmU','ohmI','ohmR','ohmP'].forEach(id => document.getElementById(id).addEventListener('keydown', e => { if (e.key === 'Enter') document.getElementById('ohmBtn').click(); }));
  ['ledVs','ledVf','ledIf'].forEach(id => document.getElementById(id).addEventListener('keydown', e => { if (e.key === 'Enter') document.getElementById('ledBtn').click(); }));
  ['divVin','divR1','divR2'].forEach(id => document.getElementById(id).addEventListener('keydown', e => { if (e.key === 'Enter') document.getElementById('divBtn').click(); }));
  ['rcR','rcC'].forEach(id => document.getElementById(id).addEventListener('keydown', e => { if (e.key === 'Enter') document.getElementById('rcBtn').click(); }));
  ['batCap','batCur'].forEach(id => document.getElementById(id).addEventListener('keydown', e => { if (e.key === 'Enter') document.getElementById('batBtn').click(); }));
  ['adcRaw','adcVref'].forEach(id => document.getElementById(id).addEventListener('keydown', e => { if (e.key === 'Enter') document.getElementById('adcBtn').click(); }));
}

function debounce(fn, ms) {
  let t;
  return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
}

/* ---------- Основы ---------- */
function renderBasics() {
  app.innerHTML = `
  <section class="section">
    <div class="container" style="max-width:820px">
      <div class="breadcrumbs"><a href="#/">Главная</a><span>/</span><span>Основы</span></div>
      <h1>Основы Arduino</h1>
      <p class="lead">Краткий справочник по платформе.</p>

      <div class="mt-md">
        <h2>Что такое Arduino</h2>
        <p>Плата с микроконтроллером ATmega (или ESP32/STM32), программируемая через USB в среде Arduino IDE. Язык — C++ с упрощённым API.</p>
      </div>

      <div class="mt-md">
        <h2>Выбор платы</h2>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Плата</th><th>Пинов</th><th>Назначение</th></tr></thead>
            <tbody>
              <tr><td><b>Uno R3</b></td><td>20</td><td>Обучение, прототипирование. Самая распространённая.</td></tr>
              <tr><td><b>Nano</b></td><td>22</td><td>Компактные устройства, макетные платы.</td></tr>
              <tr><td><b>Mega 2560</b></td><td>70</td><td>Много датчиков, сложные шилды.</td></tr>
              <tr><td><b>ESP32</b></td><td>34</td><td>Wi-Fi, Bluetooth, высокая производительность.</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="mt-md">
        <h2>Пины</h2>
        <ul class="comp-list">
          <li class="comp-item"><b>Цифровые (0–13)</b> — HIGH (5 В) или LOW (0 В).</li>
          <li class="comp-item"><b>С ШИМ (~3, ~5, ~6, ~9, ~10, ~11)</b> — плавное управление analogWrite().</li>
          <li class="comp-item"><b>Аналоговые (A0–A5)</b> — вход 0–5 В, разрешение 10 бит (0–1023).</li>
        </ul>
      </div>

      <div class="mt-md">
        <h2>Структура скетча</h2>
        ${renderCode(`void setup() {
  // Выполняется один раз при старте
  pinMode(13, OUTPUT);
}

void loop() {
  // Выполняется циклически
  digitalWrite(13, HIGH);
  delay(500);
  digitalWrite(13, LOW);
  delay(500);
}`, 'структура.ino')}
      </div>

      <div class="alert alert-danger mt-md">
        <b>Безопасность</b><br>
        Всегда используйте токоограничивающий резистор со светодиодами. Не подавайте на пины напряжение выше 5 В (3,3 В для ESP32).
      </div>

      <div class="mt-lg" style="background:var(--surface); border:1px solid var(--border); padding:32px; border-radius:var(--radius); text-align:center;">
        <h3>Первый проект</h3>
        <p style="margin-bottom:20px">Начните с классического Blink.</p>
        <a class="btn btn-primary" href="#/project/blink">Открыть Blink →</a>
      </div>
    </div>
  </section>`;
  bindCopyButtons();
}

/* ---------- О сайте ---------- */
function renderAbout() {
  app.innerHTML = `
  <section class="section">
    <div class="container" style="max-width:800px">
      <div class="breadcrumbs"><a href="#/">Главная</a><span>/</span><span>О сайте</span></div>
      <h1>О проекте</h1>
      <p class="lead">ArduInfo — сборник готовых проектов и инструментов для работы с Arduino.</p>

      <div class="mt-md">
        <h2>Цель</h2>
        <p>Собрать в одном месте проверенные схемы, рабочий код и справочные данные. Без рекламы и платных подписок.</p>
      </div>

      <div class="mt-md">
        <h2>Состав</h2>
        <div class="tools-grid" style="margin-top:20px">
          <div class="tool-card">
            <div class="tool-icon">${icon('package', 22)}</div>
            <h3>Проекты</h3>
            <p>Скетчи с пошаговой сборкой и схемами.</p>
          </div>
          <div class="tool-card">
            <div class="tool-icon">${icon('calculator', 22)}</div>
            <h3>Калькуляторы</h3>
            <p>Резисторы, закон Ома, LED, АЦП, батареи.</p>
          </div>
        </div>
      </div>

      <div class="alert alert-warn mt-md">
        <b>Отказ от ответственности</b><br>
        ArduInfo — независимый проект. Не аффилирован с Arduino LLC / Arduino S.r.l. Все материалы предоставляются как есть, в образовательных целях.
      </div>
    </div>
  </section>`;
}

/* ---------- 404 ---------- */
function render404() {
  app.innerHTML = `
  <section class="section">
    <div class="container" style="text-align:center; max-width:600px;">
      <div style="font-size:5rem; margin-bottom:20px;">🔌</div>
      <h1>Страница не найдена</h1>
      <p style="margin-bottom:28px;">Возможно, проект переименован или ссылка устарела.</p>
      <a class="btn btn-primary" href="#/">На главную</a>
      <a class="btn btn-ghost" href="#/projects">Проекты</a>
    </div>
  </section>`;
}
