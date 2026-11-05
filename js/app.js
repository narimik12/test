/* ============================================
   ArduInfo — роутер и UI
   ============================================ */

const app = document.getElementById('app');

/* ---------- Роутинг ---------- */
function navigate() {
  const hash = location.hash.slice(1) || '/';
  const parts = hash.split('/').filter(Boolean);
  const page = parts[0] || 'home';

  document.title = 'ArduInfo — проекты, калькуляторы, справочники';

  window.scrollTo({ top: 0, behavior: 'smooth' });

  switch (page) {
    case '':
    case 'home':
      renderHome();
      break;
    case 'projects':
      renderProjects();
      break;
    case 'project':
      renderProject(parts[1] || '');
      break;
    case 'tools':
      renderTools();
      break;
    case 'resistor':
      renderResistor();
      break;
    case 'basics':
      renderBasics();
      break;
    case 'about':
      renderAbout();
      break;
    default:
      render404();
  }

  // Активный пункт меню
  document.querySelectorAll('.nav a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + hash);
  });
}

/* ---------- Копирование ---------- */
async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return true;
  }
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.left = '-9999px';
  document.body.appendChild(ta);
  ta.select();
  let ok = false;
  try { ok = document.execCommand('copy'); } catch (e) {}
  ta.remove();
  return ok;
}

function bindCopyButtons() {
  document.querySelectorAll('[data-copy]').forEach(btn => {
    if (btn.dataset.bound) return;
    btn.dataset.bound = '1';
    btn.addEventListener('click', async () => {
      const pre = btn.closest('.code-wrap')?.querySelector('pre');
      if (!pre) return;
      const original = btn.textContent;
      try {
        const ok = await copyText(pre.innerText);
        if (!ok) throw new Error('copy failed');
        btn.textContent = 'Скопировано';
        btn.classList.add('copied');
        showToast('Код скопирован');
      } catch (e) {
        showToast('Не удалось скопировать');
      }
      clearTimeout(btn._copyTimer);
      btn._copyTimer = setTimeout(() => {
        btn.textContent = original;
        btn.classList.remove('copied');
      }, 1500);
    });
  });
}

/* ---------- Тост ---------- */
function showToast(message) {
  let toast = document.getElementById('siteToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'siteToast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 2200);
}

/* ---------- Тема ---------- */
(function initTheme() {
  let saved = null;
  try { saved = localStorage.getItem('arduinfo-theme'); } catch (e) {}
  if (!saved) {
    saved = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  document.documentElement.setAttribute('data-theme', saved);
  const btn = document.getElementById('themeToggle');
  if (btn) btn.innerHTML = icon(saved === 'dark' ? 'sun' : 'moon', 18);
})();

document.getElementById('themeToggle').addEventListener('click', () => {
  const cur = document.documentElement.getAttribute('data-theme');
  const next = cur === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  document.getElementById('themeToggle').innerHTML = icon(next === 'dark' ? 'sun' : 'moon', 18);
  try { localStorage.setItem('arduinfo-theme', next); } catch (e) {}
});

/* ---------- Меню ---------- */
document.getElementById('menuBtn').addEventListener('click', (e) => {
  e.stopPropagation();
  const nav = document.getElementById('nav');
  const open = nav.classList.toggle('open');
  document.getElementById('menuBtn').setAttribute('aria-expanded', String(open));
});

document.querySelectorAll('#nav a').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('nav').classList.remove('open');
    document.getElementById('menuBtn').setAttribute('aria-expanded', 'false');
  });
});

document.addEventListener('click', (e) => {
  const nav = document.getElementById('nav');
  if (nav.classList.contains('open') && !nav.contains(e.target) && e.target.id !== 'menuBtn') {
    nav.classList.remove('open');
    document.getElementById('menuBtn').setAttribute('aria-expanded', 'false');
  }
});

/* ---------- Кнопка наверх ---------- */
const toTop = document.createElement('button');
toTop.className = 'to-top';
toTop.innerHTML = '↑';
toTop.setAttribute('aria-label', 'Наверх');
toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
document.body.appendChild(toTop);

window.addEventListener('scroll', () => {
  toTop.classList.toggle('show', window.scrollY > 400);
}, { passive: true });

/* ---------- Год ---------- */
document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- AI-чат ---------- */
(function() {
  const AI_URL = 'https://arduinfo-ai.n03182243.workers.dev';
  const toggle = document.getElementById('aiToggle');
  const win = document.getElementById('aiWindow');
  const close = document.getElementById('aiClose');
  const body = document.getElementById('aiBody');
  const input = document.getElementById('aiText');
  const send = document.getElementById('aiSend');
  let busy = false;

  if (toggle) {
    if (!localStorage.getItem('arduinfo-ai-opened')) toggle.classList.add('pulse');
    toggle.addEventListener('click', () => {
      win.classList.toggle('open');
      toggle.classList.remove('pulse');
      try { localStorage.setItem('arduinfo-ai-opened', '1'); } catch (e) {}
      if (win.classList.contains('open')) setTimeout(() => input.focus(), 100);
    });
  }
  if (close) close.addEventListener('click', () => win.classList.remove('open'));

  function addMsg(text, who) {
    const div = document.createElement('div');
    div.className = 'msg ' + who;
    div.textContent = text;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
    return div;
  }

  async function ask() {
    const text = input.value.trim();
    if (!text || busy) return;
    input.value = '';
    addMsg(text, 'user');
    busy = true;
    send.disabled = true;
    const loading = addMsg('Думаю…', 'bot');
    loading.classList.add('typing');
    try {
      const res = await fetch(AI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });
      const data = await res.json();
      loading.classList.remove('typing');
      loading.textContent = data.reply || data.error || 'Не удалось получить ответ.';
    } catch (e) {
      loading.classList.remove('typing');
      loading.textContent = 'Ошибка соединения. Попробуйте ещё раз.';
    }
    busy = false;
    send.disabled = false;
    body.scrollTop = body.scrollHeight;
  }

  if (send) send.addEventListener('click', ask);
  if (input) input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ask(); }
  });
})();

/* ---------- Старт ---------- */
window.addEventListener('hashchange', navigate);
navigate();
