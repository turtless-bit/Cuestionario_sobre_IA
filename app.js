/* ════════════════════════════════════════
   FORM LOGIC
   ════════════════════════════════════════ */

function selectBtn(btn, groupId) {
  document.querySelectorAll('#' + groupId + ' .btn-opt').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
}

function selectLikert(btn, groupId) {
  document.querySelectorAll('#' + groupId + ' .likert-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
}

function updateSlider(val) {
  document.getElementById('sliderVal').textContent = Math.round(val) + '%';
}

function toggleContact(show) {
  document.getElementById('contactField').style.display = show ? 'block' : 'none';
}

function updateProgress(current) {
  for (let i = 1; i <= 5; i++) {
    const p = document.getElementById('pill' + i);
    p.className = i < current ? 'step-pill done' : i === current ? 'step-pill active' : 'step-pill';
  }
  document.getElementById('progressLabel').textContent = current + ' / 5';
}

function goNext(from) {
  document.getElementById('sec' + from).classList.remove('active');
  document.getElementById('sec' + (from + 1)).classList.add('active');
  updateProgress(from + 1);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goBack(from) {
  document.getElementById('sec' + from).classList.remove('active');
  document.getElementById('sec' + (from - 1)).classList.add('active');
  updateProgress(from - 1);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ── Supabase config ── */
const SUPABASE_URL = 'https://rttlxajrakrcosyyssnv.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0dGx4YWpyYWtyY29zeXlzc252Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4OTM1MzcsImV4cCI6MjA5NDQ2OTUzN30.R-1G58MfZWAinAl0QiOm4koUdSt1GDeX-ot00Bs3728';

function collectData() {
  const data = {};
  data.carrera = document.getElementById('q_carrera').value;

  // Ciclo: viene de botones
  const ciclo = document.querySelector('#q_ciclo .selected');
  data.ciclo = ciclo ? ciclo.textContent.trim() : '';

  // Edad: viene del slider directamente
  data.edad = parseInt(document.getElementById('q_edad').value);

  const camposBD = {'q_genero':'genero','q_desde':'desde_cuando','q_frecuencia':'frecuencia'};
  Object.entries(camposBD).forEach(([f, col]) => {
    const s = document.querySelector('#' + f + ' .selected');
    data[col] = s ? s.textContent.trim() : '';
  });

  data.pct_trabajo = parseInt(document.getElementById('q_pct').value);

  [
    'q2a1','q2a2','q2a3','q2a4','q2a5','q2a6',
    'q2b2','q2b3',
    'q3_1','q3_2','q3_3','q3_4','q3_5','q3_6',
    'q4_1','q4_2','q4_3','q4_5','q4_6',
    'q5_1','q5_2','q5_3','q5_4','q5_5'
  ].forEach(id => {
    const s = document.querySelector('#' + id + ' .selected');
    data[id] = s ? s.textContent.trim() : '';
  });

  const e = document.querySelector('#q5_entrevista .selected');
  data.q5_entrevista = e ? e.textContent.trim() : '';
  data.contacto = document.getElementById('q_contacto').value;
  return data;
}

async function submitForm() {
  const btn = document.querySelector('.btn-submit');
  btn.textContent = 'Enviando…';
  btn.disabled = true;

  const data = collectData();

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/respuestas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(JSON.stringify(err));
    }

    // Éxito
    document.getElementById('sec5').classList.remove('active');
    document.getElementById('thankYou').classList.add('active');
    document.getElementById('progressBar').style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });

  } catch (err) {
    console.error('Error al guardar:', err);
    btn.textContent = 'Error al enviar ✕';
    btn.style.background = '#D85A30';
    btn.disabled = false;
    setTimeout(() => {
      btn.textContent = 'Enviar respuestas ✓';
      btn.style.background = '';
      btn.disabled = false;
    }, 3000);
  }
}


/* ════════════════════════════════════════
   BACKGROUND CANVAS ANIMATION
   ════════════════════════════════════════ */

(function () {
  var gap = 40, radiusVmin = 30, speedIn = 0.5, speedOut = 0.6;
  var restScale = 0.09, minHS = 1, maxHS = 3, waveSpeed = 1200, waveWidth = 180;

  var PALETTE = [
    { type: 'solid', value: '#22c55e' }, { type: 'solid', value: '#06b6d4' },
    { type: 'solid', value: '#f97316' }, { type: 'solid', value: '#ef4444' },
    { type: 'solid', value: '#facc15' }, { type: 'solid', value: '#ec4899' },
    { type: 'solid', value: '#9ca3af' }, { type: 'solid', value: '#a78bfa' },
    { type: 'solid', value: '#60a5fa' }, { type: 'solid', value: '#34d399' },
    { type: 'gradient', stops: ['#6366f1', '#3b82f6'] },
    { type: 'gradient', stops: ['#06b6d4', '#6366f1'] },
    { type: 'gradient', stops: ['#22c55e', '#06b6d4'] },
    { type: 'gradient', stops: ['#f97316', '#ef4444'] },
    { type: 'gradient', stops: ['#8b5cf6', '#06b6d4'] },
    { type: 'gradient', stops: ['#3b82f6', '#8b5cf6'] },
    { type: 'gradient', stops: ['#34d399', '#3b82f6'] },
  ];

  var SHAPES = ['circle', 'pill', 'star', 'star'];
  var canvas = document.getElementById('bg-canvas'), ctx = canvas.getContext('2d');
  var grid = null, pointer = null, activity = 0, waves = [];

  function rnd(a, b) { return Math.random() * (b - a) + a; }
  function rndI(a, b) { return Math.floor(rnd(a, b + 1)); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function ss(t) { var c = Math.max(0, Math.min(1, t)); return c * c * (3 - 2 * c); }
  function dtf(s) { if (s <= 0) return 1; return 1 - Math.pow(0.05, 1 / (60 * s)); }

  function dC(c, s) { c.beginPath(); c.arc(0, 0, s, 0, Math.PI * 2); c.fill(); }
  function dP(c, s) { var w = s * .48, h = s; c.beginPath(); c.roundRect(-w, -h, w * 2, h * 2, w); c.fill(); }
  function dS(c, s, p, r) {
    c.beginPath();
    for (var i = 0; i < p * 2; i++) {
      var a = (i * Math.PI) / p - Math.PI / 2, rd = i % 2 === 0 ? s : s * r;
      i === 0 ? c.moveTo(Math.cos(a) * rd, Math.sin(a) * rd) : c.lineTo(Math.cos(a) * rd, Math.sin(a) * rd);
    }
    c.closePath(); c.fill();
  }
  function draw(c, sh) {
    if (sh.type === 'circle') dC(c, sh.size / 1.5);
    else if (sh.type === 'pill') dP(c, sh.size / 1.4);
    else dS(c, sh.size, sh.points, sh.innerRatio);
  }
  function fill(c, d, sz) {
    if (d.type === 'solid') return d.value;
    var g = c.createRadialGradient(0, -sz * .3, 0, 0, sz * .3, sz * 1.5);
    g.addColorStop(0, d.stops[0]); g.addColorStop(1, d.stops[1]); return g;
  }
  function sp() { return { points: rndI(4, 10), innerRatio: rnd(0.1, 0.5) }; }

  function buildGrid() {
    var W = window.innerWidth, H = window.innerHeight;
    var cols = Math.floor(W / gap), rows = Math.floor(H / gap);
    var ox = (W - (cols - 1) * gap) / 2, oy = (H - (rows - 1) * gap) / 2, shapes = [];
    for (var r = 0; r < rows; r++) for (var c2 = 0; c2 < cols; c2++) {
      var t = pick(SHAPES);
      var sh = {
        x: ox + c2 * gap, y: oy + r * gap, type: t, color: pick(PALETTE),
        angle: rnd(0, Math.PI * 2), size: gap * .38, scale: restScale,
        maxScale: rnd(minHS, maxHS), hovered: false
      };
      if (t === 'star') Object.assign(sh, sp());
      shapes.push(sh);
    }
    return { shapes: shapes, width: W, height: H };
  }

  function init() {
    var W = window.innerWidth, H = window.innerHeight, dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.scale(dpr, dpr);
    grid = buildGrid();
  }

  function tick() {
    if (!grid) { requestAnimationFrame(tick); return; }
    var shapes = grid.shapes, W = grid.width, H = grid.height;
    var radius = Math.min(W, H) * (radiusVmin / 100), now = performance.now();
    ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#080808'; ctx.fillRect(0, 0, W, H);
    activity *= 0.93;
    var mxD = Math.sqrt(W * W + H * H);
    waves = waves.filter(function (w) { return (now - w.startTime) / 1000 * waveSpeed < mxD + waveWidth; });
    for (var i = 0; i < shapes.length; i++) {
      var sh = shapes[i], pi = 0;
      if (pointer && activity > 0.001) {
        var dx = sh.x - pointer.x, dy = sh.y - pointer.y, d = Math.sqrt(dx * dx + dy * dy);
        pi = ss(1 - d / radius) * activity;
        if (pi > 0.05 && !sh.hovered) {
          sh.hovered = true; sh.maxScale = rnd(minHS, maxHS);
          sh.angle = rnd(0, Math.PI * 2); if (sh.type === 'star') Object.assign(sh, sp());
        } else if (pi <= 0.05) sh.hovered = false;
      } else sh.hovered = false;
      var wi = 0;
      for (var j = 0; j < waves.length; j++) {
        var wv = waves[j], wr = (now - wv.startTime) / 1000 * waveSpeed;
        var wd = Math.sqrt((sh.x - wv.x) * (sh.x - wv.x) + (sh.y - wv.y) * (sh.y - wv.y));
        var t = 1 - Math.abs(wd - wr) / waveWidth;
        if (t > 0) wi = Math.max(wi, Math.sin(Math.PI * t));
      }
      var target = Math.max(restScale + pi * (sh.maxScale - restScale), restScale + wi * (sh.maxScale - restScale));
      sh.scale += (target - sh.scale) * (target > sh.scale ? dtf(speedIn) : dtf(speedOut));
      if (sh.scale < restScale * .15) continue;
      ctx.save(); ctx.translate(sh.x, sh.y); ctx.rotate(sh.angle); ctx.scale(sh.scale, sh.scale);
      ctx.fillStyle = fill(ctx, sh.color, sh.size); draw(ctx, sh); ctx.restore();
    }
    requestAnimationFrame(tick);
  }

  window.triggerWave = function (x, y) {
    waves.push({
      x: x !== undefined ? x : window.innerWidth / 2,
      y: y !== undefined ? y : window.innerHeight / 2,
      startTime: performance.now()
    });
  };

  document.addEventListener('pointermove', function (e) { pointer = { x: e.clientX, y: e.clientY }; activity = 1; });
  document.addEventListener('click', function (e) {
    if (e.target.closest('.btn-opt,.likert-btn,.btn-nav')) triggerWave(e.clientX, e.clientY);
  }, true);
  window.addEventListener('resize', init);
  init();
  requestAnimationFrame(tick);
  setTimeout(function () { triggerWave(); }, 150);
})();
