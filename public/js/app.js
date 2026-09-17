/* app.js — lee los CSV tal cual, sin extenderlos. Sin datos sintéticos. */
(function () {
  'use strict';

  // Iconos por equipo (no van en el CSV, solo aquí para no extender el dataset).
  // Clave normalizada (minúsculas, sin tildes) -> { icon, bg, fg }
  var TEAM_META = {
    'los que reprobaron calculo': { icon: 'calculate', bg: '#fee2e2', fg: '#b91c1c' },
    'deportivo tesis pendiente': { icon: 'menu_book', bg: '#dce1ff', fg: '#0037b0' },
    'atletico sin beca': { icon: 'money_off', bg: '#ffddb8', fg: '#653e00' },
    'el reencarnado en el ordinario': { icon: 'autorenew', bg: '#e9d5ff', fg: '#6b21a8' },
    'nunca ganan fc': { icon: 'sentiment_dissatisfied', bg: '#e2e8f0', fg: '#475569' },
    'los hijos del cafe soluble': { icon: 'local_cafe', bg: '#d6a86c', fg: '#3f2300' },
    'real sociedad de amigos del sueno': { icon: 'bedtime', bg: '#c7d2fe', fg: '#312e81' },
    'fc chancla de mama': { icon: 'footprints', bg: '#82f5c1', fg: '#002114' }
  };

  function norm(s) {
    return String(s || '')
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ').trim();
  }

  function teamMeta(nombre) {
    var m = TEAM_META[norm(nombre)];
    if (m) return m;
    var initials = String(nombre || '?').trim().split(/\s+/).map(function (w) { return w[0]; }).join('').slice(0, 2).toUpperCase();
    return { icon: 'sports_soccer', bg: '#ebedfc', fg: '#0037b0', initials: initials };
  }

  function initialsOf(nombre) {
    var words = String(nombre || '?').trim().split(/\s+/);
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  }

  // fetch tolerante a Latin-1 (los CSV actuales vienen en Latin-1 con tildes)
  // En GitHub Pages los CSV viven en public/datos/ (raíz del sitio);
  // en local sirviendo la raíz del repo caen en ../datos/. Se prueban ambas.
  function fetchText(url) {
    var fresh = url + (url.indexOf('?') === -1 ? '?' : '&') + 't=' + Date.now();
    return fetch(fresh, { cache: 'no-store' }).then(function (res) {
      if (!res.ok) throw new Error('No se pudieron cargar los datos');
      return res.arrayBuffer();
    }).then(function (buf) {
      try {
        var dec = new TextDecoder('utf-8', { fatal: true });
        return dec.decode(buf);
      } catch (e) {
        return new TextDecoder('windows-1252').decode(buf);
      }
    });
  }

  function fetchCSV(name) {
    // file:// no permite fetch: se avisa en vez de mostrar vacío.
    if (window.location.protocol === 'file:') {
      return Promise.reject(new Error('Abre el sitio con un servidor local (por ejemplo: python3 -m http.server dentro de la carpeta public) en vez de doble clic, para poder leer los datos.'));
    }
    // Lee AMBAS ubicaciones (public/datos/ y datos/ de la raíz) y usa la
    // que tenga más filas, para que editar en cualquiera de las dos se vea.
    function attempt(url) { return fetchText(url).catch(function () { return null; }); }
    return Promise.all([attempt('datos/' + name), attempt('../datos/' + name)]).then(function (texts) {
      var best = null, bestRows = -1;
      texts.forEach(function (t) {
        if (t === null) return;
        var n = parseCSV(t).rows.length;
        if (n > bestRows) { bestRows = n; best = t; }
      });
      if (best === null) throw new Error('No se pudieron cargar los datos');
      return best;
    });
  }

  function detectDelim(headerLine) {
    var counts = {
      ';': headerLine.split(';').length,
      '\t': headerLine.split('\t').length,
      ',': headerLine.split(',').length
    };
    if (counts[';'] >= counts['\t'] && counts[';'] >= counts[',']) return ';';
    if (counts['\t'] >= counts[',']) return '\t';
    return ',';
  }

  function parseCSV(text) {
    var lines = String(text || '').replace(/^\uFEFF/, '').split(/\r?\n/).filter(function (l) { return l.trim() !== ''; });
    if (!lines.length) return { headers: [], rows: [] };
    var delim = detectDelim(lines[0]);
    function splitLine(l) {
      // split simple; los datasets actuales no usan comillas anidadas
      return l.split(delim).map(function (c) { return c.trim(); });
    }
    var headers = splitLine(lines[0]).map(function (h) { return norm(h).replace(/\//g, ''); });
    // alias: "ganopierdio" viene de "gano/perdio"
    var rows = lines.slice(1).map(function (l) {
      var cells = splitLine(l);
      var o = {};
      headers.forEach(function (h, i) { o[h] = cells[i] !== undefined ? cells[i] : ''; });
      return o;
    });
    return { headers: headers, rows: rows, delim: delim };
  }

  function getField(row, names) {
    for (var i = 0; i < names.length; i++) {
      var k = names[i];
      if (row[k] !== undefined && row[k] !== '') return row[k];
      // búsqueda difusa por inclusión
      for (var key in row) {
        if (key.indexOf(k) !== -1 && row[key] !== '') return row[key];
      }
    }
    return '';
  }

  function faseAlcanzada(eq) {
    // columnas tal cual: juegacontra_octavos, _cuartos, _semis, _final
    var oct = getField(eq, ['juegacontra_octavos', 'octavos']);
    var cua = getField(eq, ['juegacontra_cuartos', 'cuartos']);
    var sem = getField(eq, ['juegacontra_semis', 'semis']);
    var fin = getField(eq, ['juegacontra_final', 'final']);
    if (fin) return { fase: 'Final', rival: fin };
    if (sem) return { fase: 'Semifinal', rival: sem };
    if (cua) return { fase: 'Cuartos', rival: cua };
    if (oct) return { fase: 'Octavos', rival: oct };
    return { fase: 'Por definir', rival: '' };
  }

  function estadoEquipo(eq) {
    var raw = norm(getField(eq, ['ganopierdio', 'gano', 'gano per dio']));
    var f = faseAlcanzada(eq);
    var fecha = getField(eq, ['fecha_partido', 'fecha']);
    if (!raw) return { label: 'Pendiente', cls: 'chip-pending', fase: f.fase, fecha: fecha };
    if (raw.indexOf('gan') !== -1 || raw.indexOf('pas') !== -1 || raw.indexOf('clasif') !== -1)
      return { label: 'Ganó · ' + f.fase, cls: 'chip-final', fase: f.fase, fecha: fecha };
    if (raw.indexOf('perd') !== -1 || raw.indexOf('elim') !== -1)
      return { label: 'Perdió · ' + f.fase, cls: 'chip chip-live', fase: f.fase, fecha: fecha };
    return { label: row0(raw), cls: 'chip-pending', fase: f.fase, fecha: fecha };
    function row0(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  }

  function badgeHTML(nombre, size) {
    var m = teamMeta(nombre);
    var px = size === 'lg' ? 'width:2.5rem;height:2.5rem;font-size:14px;' : '';
    return '<span class="team-badge" style="background:' + m.bg + ';color:' + m.fg + ';' + px + '" title="' + escapeHtml(nombre) + '">' +
      '<span class="material-symbols-outlined" style="font-size:20px">' + m.icon + '</span></span>';
  }

  function escapeHtml(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function emptyState(msg) {
    return '<div class="match-card reveal p-6 text-center flex flex-col items-center gap-2">' +
      '<span class="material-symbols-outlined text-[32px] text-slate-400">inbox</span>' +
      '<p class="font-body-md text-slate-600">' + escapeHtml(msg) + '</p></div>';
  }

  function skeletonRows(n, cols) {
    var h = '';
    for (var i = 0; i < n; i++) {
      h += '<tr><td colspan="' + cols + '" class="p-2"><div class="loading-shimmer" style="height:3.2rem"></div></td></tr>';
    }
    return h;
  }

  // Botón "atrás": vuelve en el historial o a index.html si no hay historial.
  function goBack() {
    if (window.history.length > 1) window.history.back();
    else window.location.href = 'index.html';
  }

  // Intro: el balón aparece a lo lejos y se acerca lentamente a la pantalla
  // hasta cubrirla; ahí termina la animación y se muestran los datos.
  function playIntro() {
    var overlay = document.getElementById('intro');
    if (!overlay) return;
    function dismiss() {
      overlay.style.display = 'none';
      try { sessionStorage.setItem('introSeen', '1'); } catch (e) {}
    }
    try { if (sessionStorage.getItem('introSeen')) { dismiss(); return; } } catch (e) {}
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !window.anime) { dismiss(); return; }
    document.body.style.overflow = 'hidden';
    var tl = anime.timeline({
      complete: function () { document.body.style.overflow = ''; dismiss(); }
    });
    tl
      .add({ targets: '#intro-ball', scale: [0.25, 0.25], opacity: [0, 1], duration: 600, easing: 'easeOutQuad' }, 0)
      .add({ targets: '#intro-shadow', scaleX: [0.2, 0.3], opacity: [0, 0.12], duration: 600, easing: 'easeOutQuad' }, 0)
      .add({ targets: ['#intro-title', '#intro-sub'], opacity: [0, 1], translateY: [12, 0], duration: 800, easing: 'easeOutQuad' }, 200)
      .add({ targets: '#intro-ball', scale: [0.25, 1.5], duration: 3200, easing: 'easeInOutSine' }, 600)
      .add({ targets: '#intro-shadow', scaleX: [0.3, 0.9], opacity: [0.12, 0.32], duration: 3200, easing: 'easeInOutSine' }, 600)
      .add({ targets: '#intro-ball', scale: [1.5, 9], duration: 900, easing: 'easeInQuad' }, '+=400')
      .add({ targets: '#intro-shadow', opacity: [0.32, 0], duration: 400, easing: 'linear' }, '-=900')
      .add({ targets: '#intro', opacity: [1, 0], duration: 400, easing: 'linear' }, '-=350');
    setTimeout(function () {
      if (overlay.style.display !== 'none' && !tl.completed) {
        tl.pause();
        document.body.style.overflow = '';
        dismiss();
      }
    }, 12000);
  }

  /* ---------- Renders ---------- */

  function renderEquipos(tbodyId, countId) {
    var tb = document.getElementById(tbodyId);
    if (!tb) return;
    fetchCSV('equipos.csv').then(function (t) {
      var parsed = parseCSV(t);
      var rows = parsed.rows;
      if (countId) {
        var el = document.getElementById(countId);
        if (el) el.textContent = rows.length + ' equipos';
      }
      if (!rows.length) { tb.innerHTML = '<tr><td colspan="5" class="p-4">' + emptyState('Aún no hay equipos registrados') + '</td></tr>'; return; }
      tb.innerHTML = rows.map(function (r, i) {
        var nombre = getField(r, ['nombre']);
        var f = faseAlcanzada(r);
        var est = estadoEquipo(r);
        var fecha = getField(r, ['fecha_partido', 'fecha']) || '—';
        return '<tr class="row-anim border-b border-slate-100 hover:bg-slate-50" style="--d:' + (i * 60) + 'ms">' +
          '<td class="p-3"><div class="flex items-center gap-2">' + badgeHTML(nombre) +
          '<div><div class="font-bold text-[14px]">' + escapeHtml(nombre) + '</div>' +
          '<div class="font-label-xs text-slate-500">' + escapeHtml(initialsOf(nombre)) + ' · ' + escapeHtml(f.fase) + '</div></div></div></td>' +
          '<td class="p-3 text-[13px]">' + escapeHtml(f.rival || '—') + '</td>' +
          '<td class="p-3 text-[13px]">' + escapeHtml(fecha) + '</td>' +
          '<td class="p-3"><span class="chip ' + est.cls + '">' + escapeHtml(est.label) + '</span></td>' +
          '</tr>';
      }).join('');
    }).catch(function (e) { tb.innerHTML = '<tr><td class="p-4">' + emptyState(e.message) + '</td></tr>'; });
  }

  function renderGoles(tbodyId) {
    var tb = document.getElementById(tbodyId);
    if (!tb) return;
    fetchCSV('goles.csv').then(function (t) {
      var rows = parseCSV(t).rows
        .map(function (r) {
          return {
            nombre: getField(r, ['nombre']),
            equipo: getField(r, ['equipo']),
            goles: parseInt(getField(r, ['goles']), 10) || 0
          };
        })
        .filter(function (r) { return r.nombre; })
        .sort(function (a, b) { return b.goles - a.goles; });
      if (!rows.length) { tb.innerHTML = '<tr><td colspan="4" class="p-4">' + emptyState('Aún no hay goleadores registrados') + '</td></tr>'; return; }
      tb.innerHTML = rows.map(function (r, i) {
        var rank = i + 1;
        var hl = rank === 1 ? 'bg-amber-50' : '';
        return '<tr class="row-anim border-b border-slate-100 ' + hl + '" style="--d:' + (i * 60) + 'ms">' +
          '<td class="p-3 font-bold">' + rank + '</td>' +
          '<td class="p-3"><div class="flex items-center gap-2">' + badgeHTML(r.equipo) +
          '<div><div class="font-bold text-[14px]">' + escapeHtml(r.nombre) + '</div>' +
          '<div class="font-label-xs text-slate-500">' + escapeHtml(r.equipo) + '</div></div></div></td>' +
          '<td class="p-3 hidden sm:table-cell text-[13px] text-slate-600">' + escapeHtml(r.equipo) + '</td>' +
          '<td class="p-3 text-right font-extrabold text-[18px] text-[#0037b0]">' + r.goles + '</td></tr>';
      }).join('');
    }).catch(function (e) { tb.innerHTML = '<tr><td class="p-4">' + emptyState(e.message) + '</td></tr>'; });
  }

  function renderAsistencias(tbodyId) {
    var tb = document.getElementById(tbodyId);
    if (!tb) return;
    fetchCSV('asistencias.csv').then(function (t) {
      var rows = parseCSV(t).rows
        .map(function (r) {
          return {
            nombre: getField(r, ['nombre']),
            equipo: getField(r, ['equipo']),
            asist: parseInt(getField(r, ['asistencias', 'asistencia']), 10) || 0
          };
        })
        .filter(function (r) { return r.nombre; })
        .sort(function (a, b) { return b.asist - a.asist; });
      if (!rows.length) { tb.innerHTML = '<tr><td colspan="4" class="p-4">' + emptyState('Aún no hay asistencias registradas') + '</td></tr>'; return; }
      tb.innerHTML = rows.map(function (r, i) {
        return '<tr class="row-anim border-b border-slate-100" style="--d:' + (i * 60) + 'ms">' +
          '<td class="p-3 font-bold">' + (i + 1) + '</td>' +
          '<td class="p-3"><div class="flex items-center gap-2">' + badgeHTML(r.equipo) +
          '<div><div class="font-bold text-[14px]">' + escapeHtml(r.nombre) + '</div>' +
          '<div class="font-label-xs text-slate-500">' + escapeHtml(r.equipo) + '</div></div></div></td>' +
          '<td class="p-3 hidden sm:table-cell text-[13px] text-slate-600">' + escapeHtml(r.equipo) + '</td>' +
          '<td class="p-3 text-right font-extrabold text-[18px] text-[#006c4a]">' + r.asist + '</td></tr>';
      }).join('');
    }).catch(function (e) { tb.innerHTML = '<tr><td class="p-4">' + emptyState(e.message) + '</td></tr>'; });
  }

  /* ---------- Bracket simétrico: Cuartos → Semis → Final central ----------
     Modelo solo-frontend: rondas con partidos; cada partido tiene 2 slots y un
     slot de destino. El ganador avanza automáticamente al slot predeterminado.
     slot: { kind:'team', name } | { kind:'winner', from:'m1' } | { kind:'tbd' } */
  var ROUND_RANK = { 'Octavos': 0, 'Cuartos': 1, 'Semifinal': 2, 'Final': 3 };
  var LINKS = [
    { from: 'm1', to: 'm5' }, { from: 'm2', to: 'm5' },
    { from: 'm3', to: 'm6' }, { from: 'm4', to: 'm6' },
    { from: 'm5', to: 'm7' }, { from: 'm6', to: 'm7' }
  ];
  var BRACKET_CACHE = {};

  function faseRank(f) { return ROUND_RANK[f] !== undefined ? ROUND_RANK[f] : -1; }

  function teamWonRound(name, rank, byName) {
    if (!name || !byName[norm(name)]) return false;
    var st = estadoEquipo(byName[norm(name)]);
    return st.label.indexOf('Gan') === 0 && faseRank(st.fase) > rank;
  }

  function teamLostRound(name, round, byName) {
    if (!name || !byName[norm(name)]) return false;
    var st = estadoEquipo(byName[norm(name)]);
    return st.label.indexOf('Perdi') === 0 && st.fase === round;
  }

  function resolveSlot(s, matches) {
    if (!s) return { name: null, ghost: 'tbd' };
    if (s.kind === 'team') return { name: s.name, ghost: null };
    if (s.kind === 'winner') {
      var w = matches[s.from] ? matches[s.from].winner : null;
      return w ? { name: w, ghost: null, src: s.from } : { name: null, ghost: 'winner', src: s.from };
    }
    return { name: null, ghost: 'tbd' };
  }

  function winnerOf(m, matches, byName) {
    var rank = ROUND_RANK[m.round];
    var ra = resolveSlot(m.a, matches), rb = resolveSlot(m.b, matches);
    var wa = teamWonRound(ra.name, rank, byName);
    var wb = teamWonRound(rb.name, rank, byName);
    if (wa && !wb) return ra.name;
    if (wb && !wa) return rb.name;
    if (teamLostRound(ra.name, m.round, byName) && rb.name && !teamLostRound(rb.name, m.round, byName)) return rb.name;
    if (teamLostRound(rb.name, m.round, byName) && ra.name && !teamLostRound(ra.name, m.round, byName)) return ra.name;
    return null;
  }

  // Empareja cuartos con los rivales declarados; el resto por orden de lista.
  function pairCuartos(teams, byName) {
    var used = {}, pairs = [];
    teams.forEach(function (tm) {
      var k = norm(tm.name);
      if (used[k]) return;
      var rv = getField(tm.row, ['juegacontra_cuartos', 'cuartos']);
      if (rv && !used[norm(rv)]) {
        pairs.push([tm.name, rv]);
        used[k] = 1; used[norm(rv)] = 1;
      }
    });
    var rest = teams.filter(function (tm) { return !used[norm(tm.name)]; });
    for (var i = 0; i < rest.length; i += 2) {
      pairs.push([rest[i].name, rest[i + 1] ? rest[i + 1].name : null]);
    }
    while (pairs.length < 4) pairs.push([null, null]);
    return pairs.slice(0, 4);
  }

  function buildBracket(rows) {
    var teams = rows.map(function (r) { return { name: getField(r, ['nombre']), row: r }; });
    var byName = {};
    teams.forEach(function (tm) { byName[norm(tm.name)] = tm.row; });
    var pairs = pairCuartos(teams, byName);
    function T(n) { return n ? { kind: 'team', name: n } : { kind: 'tbd' }; }
    function W(f) { return { kind: 'winner', from: f }; }
    var defs = [
      { id: 'm1', round: 'Cuartos', side: 'L', a: T(pairs[0][0]), b: T(pairs[0][1]) },
      { id: 'm2', round: 'Cuartos', side: 'L', a: T(pairs[1][0]), b: T(pairs[1][1]) },
      { id: 'm3', round: 'Cuartos', side: 'R', a: T(pairs[2][0]), b: T(pairs[2][1]) },
      { id: 'm4', round: 'Cuartos', side: 'R', a: T(pairs[3][0]), b: T(pairs[3][1]) },
      { id: 'm5', round: 'Semifinal', side: 'L', a: W('m1'), b: W('m2') },
      { id: 'm6', round: 'Semifinal', side: 'R', a: W('m3'), b: W('m4') },
      { id: 'm7', round: 'Final', side: 'C', a: W('m5'), b: W('m6') }
    ];
    var matches = {};
    defs.forEach(function (d) { matches[d.id] = d; });
    ['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7'].forEach(function (id) {
      matches[id].winner = winnerOf(matches[id], matches, byName);
    });
    return matches;
  }

  function slotHTML(s, matches, winner) {
    var r = resolveSlot(s, matches);
    if (!r.name) {
      var label = r.ghost === 'winner' ? 'Ganador ' + r.src.toUpperCase() : 'Por definir';
      return '<div class="bslot is-ghost"><span class="material-symbols-outlined text-[18px]">hourglass_empty</span>' +
        '<span class="text-[13px]">' + label + '</span></div>';
    }
    var isW = winner && norm(winner) === norm(r.name);
    var src = r.src ? '<span class="block text-[11px] text-slate-400">⤷ Ganador ' + r.src.toUpperCase() + '</span>' : '';
    return '<div class="bslot' + (isW ? ' is-winner' : '') + '">' + badgeHTML(r.name) +
      '<div class="flex-1 min-w-0"><div class="font-bold text-[13px] truncate">' + escapeHtml(r.name) + '</div>' + src + '</div>' +
      (isW ? '<span class="material-symbols-outlined text-[18px] text-emerald-600">trophy</span>' : '') + '</div>';
  }

  function matchCardHTML(m, matches, d) {
    var isFinal = m.round === 'Final';
    var st = m.winner
      ? '<span class="chip chip-final">Definido</span>'
      : '<span class="chip chip-pending">Pendiente</span>';
    var foot = m.winner
      ? 'Avanza: <b>' + escapeHtml(m.winner) + '</b>'
      : 'En espera de ganadores';
    return '<div class="bmatch reveal' + (isFinal ? ' bmatch-final' : '') + '" id="bm-' + m.id + '" style="--d:' + d + 'ms">' +
      '<div class="bmatch-head"><span class="font-label-xs text-slate-500 uppercase">' + m.id.toUpperCase() + ' · ' + m.round + '</span>' + st + '</div>' +
      slotHTML(m.a, matches, m.winner) + slotHTML(m.b, matches, m.winner) +
      '<div class="bmatch-foot">' + foot + '</div></div>';
  }

  function edgePoint(rect, base, dir, scrollL, scrollT) {
    var x = rect.left - base.left + scrollL, y = rect.top - base.top + scrollT;
    if (dir === 'R') return { x: x + rect.width, y: y + rect.height / 2 };
    if (dir === 'L') return { x: x, y: y + rect.height / 2 };
    if (dir === 'B') return { x: x + rect.width / 2, y: y + rect.height };
    return { x: x + rect.width / 2, y: y };
  }

  function drawBracketLines() {
    var inner = document.getElementById('bracket-inner');
    var svg = document.getElementById('bracket-lines');
    if (!inner || !svg) return;
    var W = inner.scrollWidth, H = inner.scrollHeight;
    if (!W || !H) return;
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    svg.style.width = W + 'px'; svg.style.height = H + 'px';
    var base = inner.getBoundingClientRect();
    var paths = '';
    LINKS.forEach(function (L) {
      var a = document.getElementById('bm-' + L.from), b = document.getElementById('bm-' + L.to);
      if (!a || !b) return;
      var ma = BRACKET_CACHE[L.from], mb = BRACKET_CACHE[L.to];
      var out = L.out || (ma && ma.side === 'R' ? 'L' : 'R');
      var inn = L.inn || (mb && mb.side === 'C' && ma && ma.side === 'R' ? 'R' : (mb && mb.side === 'R' ? 'R' : 'L'));
      var p1 = edgePoint(a.getBoundingClientRect(), base, out, inner.scrollLeft, inner.scrollTop);
      var p2 = edgePoint(b.getBoundingClientRect(), base, inn, inner.scrollLeft, inner.scrollTop);
      var d;
      if (out === 'B' || out === 'T' || inn === 'B' || inn === 'T') {
        var my = (p1.y + p2.y) / 2;
        d = 'M' + p1.x + ' ' + p1.y + ' C' + p1.x + ' ' + my + ' ' + p2.x + ' ' + my + ' ' + p2.x + ' ' + p2.y;
      } else {
        var mx = (p1.x + p2.x) / 2;
        d = 'M' + p1.x + ' ' + p1.y + ' C' + mx + ' ' + p1.y + ' ' + mx + ' ' + p2.y + ' ' + p2.x + ' ' + p2.y;
      }
      paths += '<path class="blink' + (ma && ma.winner ? ' won' : '') + '" d="' + d + '"/>';
    });
    svg.innerHTML = paths;
  }

  var bracketResizeT = null;
  window.addEventListener('resize', function () {
    if (bracketResizeT) clearTimeout(bracketResizeT);
    bracketResizeT = setTimeout(drawBracketLines, 150);
  });
  window.addEventListener('load', function () { setTimeout(drawBracketLines, 300); });

  function renderBracket() {
    var wrap = document.getElementById('bracket');
    if (!wrap) return;
    wrap.innerHTML = '<div class="loading-shimmer" style="height:5rem"></div>' +
      '<div class="loading-shimmer" style="height:16rem"></div>';
    fetchCSV('equipos.csv').then(function (t) {
      var rows = parseCSV(t).rows.filter(function (r) { return getField(r, ['nombre']); });
      if (!rows.length) { wrap.innerHTML = emptyState('Aún no hay equipos registrados'); return; }
      var matches = buildBracket(rows);
      BRACKET_CACHE = matches;
      function col(ids, head, d0) {
        return '<div class="bcol"><div class="bcol-head">' + head + '</div>' +
          ids.map(function (id, i) { return matchCardHTML(matches[id], matches, d0 + i * 90); }).join('') + '</div>';
      }
      wrap.innerHTML =
        '<div class="bracket-scroll"><div class="bracket-grid" id="bracket-inner">' +
        '<svg id="bracket-lines"></svg>' +
        col(['m1', 'm2'], 'Cuartos · Izq', 0) +
        col(['m5'], 'Semifinal · Izq', 200) +
        col(['m7'], 'Gran final', 350) +
        col(['m6'], 'Semifinal · Der', 200) +
        col(['m3', 'm4'], 'Cuartos · Der', 0) +
        '</div></div>';
      requestAnimationFrame(function () { setTimeout(drawBracketLines, 60); });
    }).catch(function () { wrap.innerHTML = emptyState('No se pudieron cargar los datos'); });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var page = document.body.getAttribute('data-page');
    var backBtns = document.querySelectorAll('[data-back]');
    for (var i = 0; i < backBtns.length; i++) {
      backBtns[i].addEventListener('click', goBack);
    }
    // Botones ←/→ del cuadro: desplazan la barra horizontal del bracket.
    var scrollBtns = document.querySelectorAll('[data-bscroll]');
    for (var j = 0; j < scrollBtns.length; j++) {
      (function (btn) {
        btn.addEventListener('click', function () {
          var scroller = btn.closest('section').querySelector('.bracket-scroll');
          if (!scroller) scroller = document.querySelector('.bracket-scroll');
          if (scroller) scroller.scrollBy({ left: 340 * parseFloat(btn.getAttribute('data-bscroll')), behavior: 'smooth' });
        });
      })(scrollBtns[j]);
    }
    if (page === 'equipos') renderEquipos('equipos-body', 'equipos-count');
    if (page === 'goles') renderGoles('goles-body');
    if (page === 'asistencias') renderAsistencias('asistencias-body');
    if (page === 'index') {
      playIntro();
      renderBracket();
      renderGoles('goles-mini');
      renderAsistencias('asistencias-mini');
    }
  });
})();
