// شفرة العهد القديم — منطق اللعبة
const $ = s => document.querySelector(s), app = $('#app'), md = $('#md'), dg = $('#dg');
const TY = {mc:['📜','سؤال'], ma:['🏺','مطابقة'], sq:['📚','ترتيب'], hd:['🔍','دليل خفي'], ci:['🔐','شفرة'], lk:['🔢','قفل أرقام']};
const AB = 'ابتثجحخدذرزسشصضطظعغفقكلمنهوي';
const KEY = 'shifra_ot_v1';
const norm = s => String(s).replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace(/[\u064B-\u0652\u0640]/g, '').replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').replace(/\s+/g, '');
const fm = s => Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
const def = () => ({started:0, sec:0, mis:0, hu:0, sv:{}, pm:{}, ph:{}, won:0});
let S = load(), scr = 'home', R = 0, P = null, askFn = null, tt;
function load() { try { const x = JSON.parse(localStorage.getItem(KEY)); if (x && x.sv) return Object.assign(def(), x); } catch (e) {} return def(); }
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
const key = (r, p) => r + '-' + p, sol = (r, p) => !!S.sv[key(r, p)];
const cnt = r => ROOMS[r].P.filter((_, p) => sol(r, p)).length;
const done = r => cnt(r) === ROOMS[r].P.length;
const unl = r => r === 0 || done(r - 1);
const base = () => Object.keys(S.sv).reduce((a, k) => a + Math.max(30, 100 - 20 * (S.pm[k] || 0)), 0);
const bonus = () => Math.max(0, 600 - Math.floor(S.sec / 6));
const score = () => Math.max(0, base() - S.hu * 15) + (S.won ? bonus() : 0);
function toast(m) { const e = $('#ts'); e.textContent = m; e.className = 'ts show'; clearTimeout(tt); tt = setTimeout(() => e.className = 'ts', 2400); }
function shuf(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function go(s, r) { scr = s; if (r != null) R = r; closeMd(); render(); scrollTo(0, 0); }
function closeMd() { md.innerHTML = ''; P = null; }
function ask(m, fn) { askFn = fn; dg.innerHTML = `<div class="ov"><div class="mdl" role="alertdialog" aria-modal="true"><p class="q">${m}</p><button class="b gold" data-d="y">نعم</button><button class="b" data-d="n">لا، إلغاء</button></div></div>`; }
dg.addEventListener('click', e => { const t = e.target.closest('[data-d]'); if (!t) return; const f = askFn; dg.innerHTML = ''; askFn = null; if (t.dataset.d === 'y' && f) f(); });
function newGame() { if (S.started) ask('سيتم مسح تقدمك الحالي والبدء من جديد. هل أنت متأكد؟', restart); else restart(); }
function restart() { S = def(); S.started = 1; save(); go('map'); }
function cont() { go(S.won ? 'win' : 'map'); }
function enter(i) { if (!unl(i)) toast('🔒 أكمل الغرفة السابقة أولًا لفتح هذه الغرفة'); else go('room', i); }
function door() { if (!done(R)) toast('🔒 الباب مغلق: حُلّ كل الألغاز أولًا (' + cnt(R) + '/' + ROOMS[R].P.length + ')'); else go('room', R + 1); }

// ---------- الشاشات ----------
function nav() { return `<header class="top"><span><button onclick="go('home')" aria-label="الرئيسية">🏠</button><button onclick="go('map')" aria-label="الخريطة">🗺️</button><button onclick="go('nb')" aria-label="دفتر الأدلة">📓</button></span><span id="h-t">⏱ ${fm(S.sec)}</span><span id="h-s">⭐ ${score()}</span><span id="h-m">❌ ${S.mis}</span><span id="h-h">💡 ${HINTS_MAX - S.hu}</span></header>`; }
function updHud() { const m = {'h-t':'⏱ ' + fm(S.sec), 'h-s':'⭐ ' + score(), 'h-m':'❌ ' + S.mis, 'h-h':'💡 ' + (HINTS_MAX - S.hu)}; for (const k in m) { const e = document.getElementById(k); if (e) e.textContent = m[k]; } }
const V = {
home: () => `<main class="wrap c"><div class="seal">🗝️</div><h1>شفرة العهد القديم</h1><div class="band"></div><p class="sub">مغامرة غرف ألغاز في قصص الكتاب المقدس</p><button class="b gold" onclick="newGame()">🗝️ ابدأ المغامرة</button>${S.started ? `<button class="b" onclick="cont()">▶ ${S.won ? 'عرض النتيجة' : 'متابعة'}</button>` : ''}<button class="b" onclick="go('inst')">📖 التعليمات</button></main>`,
inst: () => `<main class="wrap c"><h1>التعليمات</h1><div class="band"></div><div class="inst" style="text-align:right">١. تنقّل بين ثماني غرف، وفي كل غرفة ٤ ألغاز (والغرفة الأخيرة ٥).<br>٢. اضغط على أي غرض في الغرفة لتحلّ لغزه: سؤال، مطابقة، ترتيب، دليل خفي، شفرة، أو قفل أرقام.<br>٣. كل حل صحيح يمنحك 🔑 مفتاحًا ويُظهر الشرح والمرجع الكتابي.<br>٤. عند حل كل ألغاز الغرفة ينفتح الباب وتحصل على رقم من رمز الصندوق الأخير.<br>٥. لديك ${HINTS_MAX} تلميحات فقط في اللعبة كلها، وكل تلميح يخصم ١٥ نقطة.<br>٦. النقاط: ١٠٠ لكل لغز تحله من أول مرة، وتنقص ٢٠ عن كل خطأ، مع مكافأة سرعة في النهاية.<br>٧. يُحفظ تقدمك تلقائيًا، ويمكنك العودة إلى أي غرفة أنهيتها لمراجعة الحلول.<br>٨. <b>المفاتيح والرموز والغرف من خيال اللعبة وليست أحداثًا في الكتاب المقدس</b>، أما الأسئلة وأجوبتها فمبنية على النص الكتابي مع ذكر المراجع.</div><button class="b gold" onclick="${S.started ? "cont()" : "newGame()"}">${S.started ? '▶ متابعة' : '🗝️ ابدأ المغامرة'}</button><button class="b" onclick="go('home')">🏠 الرئيسية</button></main>`,
map: () => `<main class="wrap"><h2 class="c">🗺️ خريطة الغرف</h2><div class="band"></div><ol class="path">${ROOMS.map((rm, i) => { const d = done(i), u = unl(i); return `<li><button class="nd ${d ? 'dn' : u ? 'op' : 'lc'}" onclick="enter(${i})"><span class="ni">${d ? '✅' : u ? rm.i : '🔒'}</span><span><b>${i < 8 ? 'الغرفة ' + (i + 1) + ':' : ''}</b> ${rm.t}<small>${u ? cnt(i) + '/' + rm.P.length + ' ألغاز محلولة' : 'مغلقة — أكمل الغرفة السابقة'}</small></span></button></li>`; }).join('')}</ol><button class="b" onclick="ask('هل تريد إعادة اللعب من البداية؟ سيُمسح تقدمك.', restart)">🔄 إعادة اللعب</button></main>`,
room: () => { const rm = ROOMS[R], n = rm.P.length, dn = done(R), fin = R === 8; return `<main class="wrap"><h2 class="c">${rm.i} ${fin ? '' : 'الغرفة ' + (R + 1) + ': '}${rm.t}</h2><div class="band"></div><p class="sc">🎮 مشهد اللعبة (من الخيال): ${rm.sc}</p><div class="scene">${rm.P.map((pz, p) => { const s = sol(R, p); return `<button class="obj ${s ? 'ok' : ''}" onclick="openPz(${R},${p})"><span class="oi">${TY[pz.k][0]}</span><span>${TY[pz.k][1]}</span><small>${s ? '✅ تم الحل — راجِع' : 'اضغط للحل'}</small></button>`; }).join('')}</div><div class="keys" aria-label="المفاتيح المجموعة">${rm.P.map((_, p) => `<span class="${sol(R, p) ? 'on' : ''}">🔑</span>`).join('')}</div>${fin ? `<button class="chest ${dn ? 'ready' : ''}" onclick="chest()"><span>🧰</span>${dn ? 'افتح الصندوق الأخير' : 'الصندوق مقفل (' + cnt(R) + '/' + n + ')'}</button>` : `<button class="door ${dn ? 'open' : ''}" onclick="door()">${dn ? '🚪 الباب مفتوح — إلى الغرفة التالية' : '🔒 الباب مغلق (' + cnt(R) + '/' + n + ')'}</button>`}${dn && !fin ? `<button class="b" onclick="showRc(${R})">📓 رمز الغرفة والدليل</button>` : ''}${R > 0 ? `<button class="b" onclick="go('room',${R - 1})">▶ الغرفة السابقة</button>` : ''}<p class="note">🔑 المفاتيح والرموز والغرف من عناصر اللعبة، أما الأسئلة فمأخوذة من الكتاب المقدس.</p></main>`; },
nb: () => `<main class="wrap"><h2 class="c">📓 دفتر الأدلة</h2><div class="band"></div><p class="c">رمز الصندوق الأخير (من عناصر اللعبة):</p><div class="slots">${[...CODE].map((c, i) => `<span>${done(i) ? c : '؟'}</span>`).join('')}</div><div class="pan">⏱ الوقت: ${fm(S.sec)} · ⭐ النقاط: ${score()} · ❌ الأخطاء: ${S.mis} · 💡 التلميحات المتبقية: ${HINTS_MAX - S.hu}</div>${ROOMS.slice(0, 8).map((rm, i) => done(i) ? `<div class="story"><b>${rm.i} الغرفة ${i + 1}: ${rm.t}</b> — الرقم <b>${CODE[i]}</b><br>${rm.s}<br><small>📖 ${rm.sf}</small></div>` : '').join('') || '<p class="c">لم تجمع أي أدلة بعد. أكمل غرفة لتظهر هنا.</p>'}<button class="b" onclick="go('map')">🗺️ الخريطة</button></main>`,
win: () => `<main class="wrap"><div class="c"><div class="seal">🏆</div><h1>انفتح الصندوق!</h1></div><div class="band"></div><div class="pan">⏱ ${fm(S.sec)} · ⭐ ${score()} (تشمل مكافأة وقت ${bonus()}) · ❌ ${S.mis} أخطاء · 💡 ${S.hu} تلميحات</div><h2>القصص التي استكشفتها</h2>${ROOMS.slice(0, 8).map(rm => `<div class="story"><b>${rm.i} ${rm.t}</b><br>${rm.s}<br><small>📖 ${rm.sf}</small></div>`).join('')}<p class="note">الصندوق والرمز من عناصر اللعبة؛ أما القصص أعلاه فمن الكتاب المقدس، ننصحك بقراءتها كاملة من المراجع.</p><button class="b gold" onclick="go('map')">🗺️ العودة إلى الغرف</button><button class="b" onclick="ask('هل تريد اللعب من جديد؟ سيُمسح تقدمك.', restart)">🔄 لعب من جديد</button><button class="b" onclick="go('home')">🏠 الرئيسية</button></main>`
};
function render() { app.innerHTML = (['map', 'room', 'nb'].includes(scr) ? nav() : '') + V[scr](); }

// ---------- الألغاز ----------
function ans(pz) {
  if (pz.k === 'mc') return pz.o[pz.a];
  if (pz.k === 'hd') return pz.o[pz.a][1];
  if (pz.k === 'ma') return pz.p.map(x => x[0] + ' ← ' + x[1]).join('، ');
  if (pz.k === 'sq') return pz.i.join(' ← ');
  return pz.k === 'ci' ? pz.w : pz.a;
}
function openPz(r, p) {
  const pz = ROOMS[r].P[p], k = key(r, p), h = S.ph[k] || 0;
  P = {r, p, pz, k, h, msg: '', rev: sol(r, p), just: 0, bad: new Set()};
  if (pz.k === 'sq') { const n = pz.i.length; let rest; do { rest = shuf([...Array(n - h).keys()].map(x => x + h)); } while (rest.length > 1 && rest.every((v, i) => v === h + i)); P.o = [...Array(h).keys(), ...rest]; }
  if (pz.k === 'ma') { P.R = shuf([...pz.p.keys()]); P.m = new Set([...Array(h).keys()]); P.sel = null; }
  drawPz();
}
function removed() { const pz = P.pz, w = pz.o.map((_, i) => i).filter(i => i !== pz.a); return new Set(w.slice(0, Math.min(P.h * 2, w.length))); }
function body(pz) {
  if (pz.k === 'mc' || pz.k === 'hd') { const rm = removed(), hd = pz.k === 'hd'; return `<div class="${hd ? 'tiles' : 'opts'}">${pz.o.map((o, i) => `<button class="${hd ? 'tile' : 'op'} ${P.bad.has(i) ? 'bad' : ''}" data-c="o" data-v="${i}" ${P.bad.has(i) || rm.has(i) ? 'disabled' : ''}>${hd ? `<span>${o[0]}</span><small>${o[1]}</small>` : o}</button>`).join('')}</div>`; }
  if (pz.k === 'ma') return `<div class="cols"><div>${pz.p.map((x, i) => `<button class="mi ${P.m.has(i) ? 'ok' : ''} ${P.sel === i ? 'sel' : ''}" data-c="l" data-v="${i}" ${P.m.has(i) ? 'disabled' : ''}>${x[0]}</button>`).join('')}</div><div>${P.R.map((pi, j) => `<button class="mi ${P.m.has(pi) ? 'ok' : ''}" data-c="r" data-v="${j}" ${P.m.has(pi) ? 'disabled' : ''}>${pz.p[pi][1]}</button>`).join('')}</div></div><p>اختر عنصرًا من العمود الأول ثم ما يطابقه من الثاني.</p>`;
  if (pz.k === 'sq') return `<p><small>✋ امسك أي بطاقة واسحبها لأعلى أو لأسفل لتضعها في مكانها (أو استخدم ▲ ▼).</small></p><div>${P.o.map((id, pos) => { const lk = pos < P.h; return `<div class="sqi ${lk ? 'lk' : ''}"><b class="gp">${lk ? '🔒' : '⠿'}</b><span>${pos + 1}. ${pz.i[id]}</span>${lk ? '' : `<button data-c="u" data-v="${pos}" aria-label="تحريك لأعلى">▲</button><button data-c="d" data-v="${pos}" aria-label="تحريك لأسفل">▼</button>`}</div>`; }).join('')}</div><button class="b gold" data-c="chk">✔ تحقق من الترتيب</button>`;
  if (pz.k === 'ci') return `<p class="cn">${[...norm(pz.w)].map(c => AB.indexOf(c) + 1).join(' · ')}</p><div class="tb">${[...AB].map((c, i) => `<span>${c}=${i + 1}</span>`).join('')}</div>${P.h ? `<p><b>تلميح:</b> يبدأ بـ «${pz.w.slice(0, P.h)}»</p>` : ''}<input id="in" autocomplete="off" placeholder="اكتب الكلمة" aria-label="الإجابة"><button class="b gold" data-c="chk">🔓 جرّب الشفرة</button>`;
  return `<div class="lock">${[...pz.a].map((c, i) => `<span>${i < P.h ? c : '؟'}</span>`).join('')}</div><input id="in" inputmode="numeric" autocomplete="off" maxlength="${pz.a.length}" placeholder="أدخل الرقم" aria-label="الرقم"><button class="b gold" data-c="chk">🔓 افتح القفل</button>`;
}
function drawPz() {
  const pz = P.pz, [ic, tn] = TY[pz.k];
  let b = `<div class="mh"><b>${ic} ${tn} — ${ROOMS[P.r].t}</b><button class="x" data-c="close" aria-label="إغلاق">✖</button></div><div class="band"></div><p class="q">${pz.q}</p>`;
  if (P.rev) b += `<div class="ans">${P.just ? '<div class="rw">🔑 حصلت على مفتاح جديد! <small>(عنصر من اللعبة)</small></div>' : ''}<p><b>الحل:</b> ${ans(pz)}</p><p>${pz.x}</p><p class="rf">📖 ${pz.f}</p></div><button class="b gold" data-c="close">${P.just ? 'متابعة' : 'إغلاق'}</button>`;
  else b += body(pz) + `<p class="ms" role="alert">${P.msg}</p><button class="b" data-c="hint">💡 تلميح (${HINTS_MAX - S.hu} متبقٍ، −15 نقطة)</button>`;
  const o0 = md.querySelector('.ov'), first = !o0, st = o0 ? o0.scrollTop : 0;
  md.innerHTML = `<div class="ov"><div class="mdl ${first ? 'pop' : ''}" role="dialog" aria-modal="true">${b}</div></div>`;
  if (!first) md.querySelector('.ov').scrollTop = st;
  const i = md.querySelector('input'); if (i) i.focus({preventScroll: true});
}
function wrongA(m) { S.mis++; S.pm[P.k] = (S.pm[P.k] || 0) + 1; P.msg = m; save(); updHud(); drawPz(); }
function solveA() { S.sv[P.k] = 1; P.rev = 1; P.just = 1; P.msg = ''; save(); render(); drawPz(); }
function canHint() { const pz = P.pz, h = P.h; if (pz.k === 'mc' || pz.k === 'hd') { const w = pz.o.length - 1; return Math.min(h * 2, w) < w; } if (pz.k === 'sq') return h < pz.i.length - 1; if (pz.k === 'ma') return h < pz.p.length - 1; if (pz.k === 'ci') return h < norm(pz.w).length - 1; return h < pz.a.length - 1; }
function hintA() {
  if (S.hu >= HINTS_MAX) { P.msg = 'انتهت تلميحاتك (الحد الأقصى ' + HINTS_MAX + ')'; return drawPz(); }
  if (!canHint()) { P.msg = 'لا يوجد تلميح إضافي لهذا اللغز'; return drawPz(); }
  S.hu++; S.ph[P.k] = ++P.h;
  if (P.pz.k === 'sq') { const h = P.h - 1, j = P.o.indexOf(h); [P.o[h], P.o[j]] = [P.o[j], P.o[h]]; }
  if (P.pz.k === 'ma') P.m.add(P.h - 1);
  P.msg = '💡 تم استخدام تلميح (−15 نقطة)'; save(); updHud(); drawPz();
}
function pzAct(c, v) {
  const pz = P && P.pz;
  if (c === 'close') { const jr = P && P.just && done(P.r) ? P.r : null; closeMd(); render(); if (jr !== null) showRc(jr); return; }
  if (!P || P.rev) return;
  if (c === 'hint') return hintA();
  if (c === 'o') { if (v === pz.a) solveA(); else { P.bad.add(v); wrongA('إجابة غير صحيحة، جرّب مرة أخرى.'); } return; }
  if (c === 'l') { P.sel = v; P.msg = ''; return drawPz(); }
  if (c === 'r') {
    if (P.sel == null) { P.msg = 'اختر عنصرًا من العمود الأول أولًا'; return drawPz(); }
    const pi = P.R[v];
    if (pi === P.sel) { P.m.add(pi); P.sel = null; P.msg = ''; if (P.m.size === pz.p.length) solveA(); else drawPz(); }
    else { P.sel = null; wrongA('هذان العنصران غير متطابقين.'); }
    return;
  }
  if (c === 'u' || c === 'd') { const q = v + (c === 'u' ? -1 : 1); if (q < P.h || q >= P.o.length || v < P.h) return; [P.o[v], P.o[q]] = [P.o[q], P.o[v]]; P.msg = ''; drawPz(); const b = md.querySelectorAll('.sqi')[q].querySelector(`[data-c="${c}"]`); if (b) b.focus(); return; }
  if (c === 'chk') {
    if (pz.k === 'sq') { if (P.o.every((x, i) => x === i)) solveA(); else wrongA('الترتيب غير صحيح بعد. أعد المحاولة.'); return; }
    const val = norm(md.querySelector('#in').value);
    if (!val) { P.msg = 'اكتب إجابتك أولًا'; return drawPz(); }
    if (pz.k === 'ci') { if (val === norm(pz.w)) solveA(); else wrongA('الشفرة غير صحيحة. استعن بجدول الأرقام.'); }
    else { if (val === pz.a) solveA(); else wrongA('الرقم غير صحيح، فكّر مرة أخرى.'); }
  }
}
md.addEventListener('click', e => {
  const t = e.target.closest('[data-c]'); if (!t) return;
  const c = t.dataset.c, v = t.dataset.v === undefined ? undefined : +t.dataset.v;
  if (c === 'copen') return openChest();
  if (c === 'cnb') return go('nb');
  if (c === 'cclose') { closeMd(); return render(); }
  pzAct(c, v);
});

// سحب بطاقات الترتيب بالإصبع أو الفأرة
md.addEventListener('pointerdown', e => {
  const el = e.target.closest('.sqi');
  if (!el || !P || P.rev || P.pz.k !== 'sq' || e.target.closest('button') || el.classList.contains('lk')) return;
  e.preventDefault();
  const items = [...md.querySelectorAll('.sqi')], from = items.indexOf(el), r0 = items.map(x => x.getBoundingClientRect());
  const sy = e.clientY, ov = md.querySelector('.ov'), sc0 = ov.scrollTop, sh = r0[from].height + 6;
  let idx = from, ly = sy;
  el.classList.add('drag');
  const upd = () => {
    const dy = ly - sy + (ov.scrollTop - sc0);
    el.style.transform = `translateY(${dy}px)`;
    const cy = r0[from].top + r0[from].height / 2 + dy;
    idx = 0; items.forEach((x, j) => { if (j !== from && r0[j].top + r0[j].height / 2 < cy) idx++; });
    idx = Math.max(idx, P.h);
    items.forEach((x, j) => { if (j === from) return; let s = 0; if (idx > from && j > from && j <= idx) s = -sh; if (idx < from && j < from && j >= idx) s = sh; x.style.transform = s ? `translateY(${s}px)` : ''; });
  };
  const mv = ev => { ly = ev.clientY; if (ly < 90) ov.scrollTop -= 14; else if (ly > innerHeight - 90) ov.scrollTop += 14; upd(); };
  const up = () => {
    removeEventListener('pointermove', mv); removeEventListener('pointerup', up); removeEventListener('pointercancel', up);
    if (idx !== from) { const [v] = P.o.splice(from, 1); P.o.splice(idx, 0, v); P.msg = ''; }
    drawPz();
  };
  addEventListener('pointermove', mv); addEventListener('pointerup', up); addEventListener('pointercancel', up);
});
md.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.tagName === 'INPUT') { if (e.target.id === 'cin') openChest(); else pzAct('chk'); } });
addEventListener('keydown', e => { if (e.key === 'Escape' && md.innerHTML) { if (P) pzAct('close'); else { closeMd(); render(); } } });

// ---------- إكمال الغرفة والصندوق ----------
function showRc(r) {
  const rm = ROOMS[r], fin = r === 8;
  md.innerHTML = `<div class="ov"><div class="mdl" role="dialog" aria-modal="true"><div class="mh"><b>${fin ? '🧰 اكتملت المراجعة!' : '🚪 اكتملت الغرفة ' + (r + 1) + '!'}</b><button class="x" data-c="cclose" aria-label="إغلاق">✖</button></div><div class="band"></div>${fin ? '<div class="rw">الصندوق جاهز للفتح. أدخل الرمز المكوّن من ٨ أرقام.</div>' : `<div class="rw">🔑 رقم الغرفة: <span class="dg">${CODE[r]}</span><br><small>(جزء من رمز الصندوق — عنصر من اللعبة وليس من الكتاب المقدس)</small></div>`}<p><b>${fin ? '' : 'الدليل: '}</b>${rm.s}</p>${rm.sf ? `<p class="rf">📖 ${rm.sf}</p>` : ''}<button class="b gold" data-c="cclose">متابعة</button></div></div></div>`;
}
function chest() {
  if (!done(8)) { toast('🔒 أكمل ألغاز الغرفة الأخيرة أولًا'); return; }
  md.innerHTML = `<div class="ov"><div class="mdl" role="dialog" aria-modal="true"><div class="mh"><b>🧰 الصندوق الأخير</b><button class="x" data-c="cclose" aria-label="إغلاق">✖</button></div><div class="band"></div><p class="q">أدخل الرمز المكوّن من ٨ أرقام الذي جمعته من الغرف الثماني بالترتيب.</p><p><small>(الرمز من عناصر اللعبة)</small></p><input id="cin" inputmode="numeric" maxlength="8" autocomplete="off" placeholder="٨ أرقام" aria-label="رمز الصندوق"><p class="ms" id="cm" role="alert"></p><button class="b gold" data-c="copen">🔓 افتح الصندوق</button><button class="b" data-c="cnb">📓 دفتر الأدلة</button></div></div>`;
  $('#cin').focus({preventScroll: true});
}
function openChest() {
  const v = norm($('#cin').value), m = $('#cm');
  if (v.length !== 8) { m.textContent = 'الرمز مكوّن من ٨ أرقام.'; return; }
  if (v === CODE) { S.won = 1; save(); go('win'); }
  else { S.mis++; save(); updHud(); m.textContent = 'الرمز غير صحيح. راجع دفتر الأدلة وأدخل الأرقام بترتيب الغرف.'; }
}

// ---------- المؤقت ----------
setInterval(() => {
  if (S.started && !S.won && ['map', 'room', 'nb'].includes(scr)) { S.sec++; updHud(); if (S.sec % 5 === 0) save(); }
}, 1000);
addEventListener('pagehide', save);
render();
