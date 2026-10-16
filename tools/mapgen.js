/* Builds src/mapdata.json for Surra's journey map. Run with: npm run map
   - Coastlines and borders: Natural Earth 1:10m (world-atlas). Each shared arc is simplified once, so Sweden's
     borders with Norway and Finland stay identical and no gaps open up between them.
   - Lakes: Natural Earth 1:50m (sane-topojson).
   - Cities: real coordinates; a city that falls in the water on the simplified coast moves to the nearest
     point safely on land.
   - Roads: real routes through waypoints, smoothed with a centripetal Catmull-Rom spline. Every road is checked
     against the coast and lakes; where a curve strays into water an extra waypoint is added on land.
   tools/validate.js re-checks the result on every build. */
const fs = require('fs');
const path = require('path');
const { feature } = require('topojson-client');
const world = require('world-atlas/countries-10m.json');
const europe = require('sane-topojson/dist/europe_50m.json');

// ---------- projection (Mercator in a 400-wide box; unchanged so region markers keep their places)
const LON0 = 10.6, LON1 = 24.6, LAT0 = 55.0, LAT1 = 69.4, W = 400;
const merc = lat => Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI / 180) / 2));
const SCALE = W / ((LON1 - LON0) * Math.PI / 180);
const H = Math.round((merc(LAT1) - merc(LAT0)) * SCALE);
const project = ([lon, lat]) => [((lon - LON0) * Math.PI / 180) * SCALE, (merc(LAT1) - merc(lat)) * SCALE];
const r1 = n => Math.round(n * 10) / 10;

// ---------- geometry helpers
function simplify(pts, tol) { // Douglas-Peucker, keeps both ends
  if (pts.length < 3) return pts.slice();
  const keep = new Uint8Array(pts.length); keep[0] = keep[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop();
    const [ax, ay] = pts[a], [bx, by] = pts[b], dx = bx - ax, dy = by - ay, len = Math.hypot(dx, dy);
    let maxD = 0, idx = -1;
    for (let i = a + 1; i < b; i++) {
      const [px, py] = pts[i];
      const d = len ? Math.abs(dy * px - dx * py + bx * ay - by * ax) / len : Math.hypot(px - ax, py - ay);
      if (d > maxD) { maxD = d; idx = i; }
    }
    if (maxD > tol && idx > 0) { keep[idx] = 1; stack.push([a, idx], [idx, b]); }
  }
  return pts.filter((_, i) => keep[i]);
}
const area = pts => { let s = 0; for (let i = 0; i < pts.length; i++) { const [x1, y1] = pts[i], [x2, y2] = pts[(i + 1) % pts.length]; s += x1 * y2 - x2 * y1; } return Math.abs(s / 2); };
function clipRect(pts, x0, y0, x1, y1) { // Sutherland-Hodgman against a rectangle
  const edges = [[p => p[0] >= x0, (a, b) => [x0, a[1] + (b[1] - a[1]) * (x0 - a[0]) / (b[0] - a[0])]],
    [p => p[0] <= x1, (a, b) => [x1, a[1] + (b[1] - a[1]) * (x1 - a[0]) / (b[0] - a[0])]],
    [p => p[1] >= y0, (a, b) => [a[0] + (b[0] - a[0]) * (y0 - a[1]) / (b[1] - a[1]), y0]],
    [p => p[1] <= y1, (a, b) => [a[0] + (b[0] - a[0]) * (y1 - a[1]) / (b[1] - a[1]), y1]]];
  let out = pts;
  for (const [inside, cut] of edges) {
    const inp = out; out = [];
    for (let i = 0; i < inp.length; i++) {
      const a = inp[(i + inp.length - 1) % inp.length], b = inp[i];
      if (inside(b)) { if (!inside(a)) out.push(cut(a, b)); out.push(b); } else if (inside(a)) out.push(cut(a, b));
    }
    if (!out.length) break;
  }
  return out;
}
const segDist = (p, a, b) => { const dx = b[0] - a[0], dy = b[1] - a[1], l = dx * dx + dy * dy; let t = l ? ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / l : 0; t = Math.max(0, Math.min(1, t)); return Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy); };

// ---------- coastlines: decode the quantized arcs, project, simplify each arc once
// Sweden's arcs (its coast and its borders) get the most detail, Denmark's (just across the Öresund) a little less,
// everything else is background: medium detail near Sweden, coarse further out where only wide screens look.
const NEAR = [-200, -60, W + 200, H + 60], OUTER = [-640, -260, W + 640, H + 360];
const inBox = ([x, y], b) => x >= b[0] && x <= b[2] && y >= b[1] && y <= b[3];
const T = world.transform, geoms = world.objects.countries.geometries;
const arcUse = new Map(); // arc index -> set of country ids
geoms.forEach(g => (g.type === 'Polygon' ? [g.arcs] : g.type === 'MultiPolygon' ? g.arcs : []).forEach(poly => poly.forEach(ring => ring.forEach(i => {
  const k = i < 0 ? ~i : i; if (!arcUse.has(k)) arcUse.set(k, new Set()); arcUse.get(k).add(String(g.id));
}))));
function simplifyZoned(pts, tolNear, tolFar) { // split where the arc crosses the NEAR frame, simplify each run on its own
  const out = []; let run = [pts[0]], near = inBox(pts[0], NEAR);
  for (let i = 1; i < pts.length; i++) {
    const n = inBox(pts[i], NEAR); run.push(pts[i]);
    if (n !== near || i === pts.length - 1) { const s = simplify(run, near ? tolNear : tolFar); out.push(...(out.length ? s.slice(1) : s)); run = [pts[i]]; near = n; }
  }
  return out.length ? out : pts.slice();
}
const arcs = world.arcs.map((arc, idx) => {
  let x = 0, y = 0;
  const pts = arc.map(([dx, dy]) => { x += dx; y += dy; return project([x * T.scale[0] + T.translate[0], y * T.scale[1] + T.translate[1]]); });
  const use = arcUse.get(idx) || new Set();
  if (use.has('752')) return simplify(pts, 0.28);
  if (use.has('208')) return simplify(pts, 0.5);
  return simplifyZoned(pts, 2.0, 4.0);
});
const countries = feature({ type: 'Topology', objects: world.objects, arcs }, world.objects.countries).features;
// rings that cross the 180° meridian (Russia's far east) jump a whole world-width; unwrap them so clipping stays clean
const WRAP = 2 * Math.PI * SCALE;
function unwrap(ring) {
  const out = [ring[0]]; let shift = 0;
  for (let i = 1; i < ring.length; i++) {
    const dx = ring[i][0] + shift - out[i - 1][0];
    if (dx > WRAP / 2) shift -= WRAP; else if (dx < -WRAP / 2) shift += WRAP;
    out.push([ring[i][0] + shift, ring[i][1]]);
  }
  return out;
}
function rings(f, { minArea, clip }) {
  const polys = f.geometry ? (f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.type === 'MultiPolygon' ? f.geometry.coordinates : []) : [];
  const out = [];
  for (const poly of polys) {
    let ring = unwrap(poly[0].slice(0, -1));
    if (clip) ring = clipRect(ring, ...clip);
    if (ring.length < 3 || area(ring) < minArea) continue;
    out.push(ring.map(([x, y]) => [r1(x), r1(y)]));
  }
  return out;
}
const sweden = rings(countries.find(c => String(c.id) === '752'), { minArea: 2.5 });
// every other country that reaches into the area the map can ever show, so no edge of the world shows when panning
const neighbours = countries.filter(f => String(f.id) !== '752' && f.geometry).flatMap(f => {
  const all = (f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates).flatMap(p => p[0]);
  if (!all.some(q => inBox(q, OUTER))) return [];
  return rings(f, { minArea: 8, clip: OUTER }).filter(r => area(r) >= 30 || r.some(q => inBox(q, NEAR)));
});

// ---------- lakes (1:50m)
const lakes = [];
for (const f of feature(europe, europe.objects.lakes).features) {
  const g = f.geometry; if (!g) continue;
  for (const poly of g.type === 'Polygon' ? [g.coordinates] : g.type === 'MultiPolygon' ? g.coordinates : []) {
    const ring = poly[0];
    const pts = ring.slice(0, -1).map(project);
    if (!pts.some(q => inBox(q, OUTER))) continue;
    if (area(pts) < 4) continue;
    let far = 0, fd = -1;
    pts.forEach(([x, y], i) => { const d = Math.hypot(x - pts[0][0], y - pts[0][1]); if (d > fd) { fd = d; far = i; } });
    const tol = pts.some(q => inBox(q, [0, 0, W, H])) ? 0.4 : 1.6; // Swedish lakes in detail, distant ones coarse
    const s = simplify(pts.slice(0, far + 1), tol).concat(simplify(pts.slice(far).concat([pts[0]]), tol).slice(1, -1));
    if (s.length >= 4) lakes.push(s.map(([x, y]) => [r1(x), r1(y)]));
  }
}

// ---------- how far a point is from water (map units; negative = in water), with a spatial index for speed
const CAP = 6, CELL = 2;
function indexRings(rs) {
  const cells = new Map(), bands = new Map();
  const add = (m, k, e) => { let a = m.get(k); if (!a) m.set(k, (a = [])); a.push(e); };
  rs.forEach((r, ri) => r.forEach((b, i) => {
    const a = r[(i + r.length - 1) % r.length], e = [a, b, ri];
    const x0 = Math.floor(Math.min(a[0], b[0]) / CELL), x1 = Math.floor(Math.max(a[0], b[0]) / CELL);
    const y0 = Math.floor(Math.min(a[1], b[1]) / CELL), y1 = Math.floor(Math.max(a[1], b[1]) / CELL);
    for (let x = x0; x <= x1; x++) for (let y = y0; y <= y1; y++) add(cells, x + ',' + y, e);
    for (let y = Math.floor(Math.min(a[1], b[1])); y <= Math.floor(Math.max(a[1], b[1])); y++) add(bands, y, e);
  }));
  return { cells, bands, n: rs.length };
}
const SE_IDX = indexRings(sweden), LAKE_IDX = indexRings(lakes);
function inside(p, idx) { // ray casting, using only the edges that cross this point's row
  const flips = new Uint8Array(idx.n);
  for (const [a, b, ri] of idx.bands.get(Math.floor(p[1])) || []) {
    if ((a[1] > p[1]) !== (b[1] > p[1]) && p[0] < (b[0] - a[0]) * (p[1] - a[1]) / (b[1] - a[1]) + a[0]) flips[ri] ^= 1;
  }
  return flips.some(f => f);
}
function nearest(p, idx) {
  const cx = Math.floor(p[0] / CELL), cy = Math.floor(p[1] / CELL), reach = Math.ceil(CAP / CELL) + 1;
  let d = CAP;
  for (let x = cx - reach; x <= cx + reach; x++) for (let y = cy - reach; y <= cy + reach; y++) {
    for (const [a, b] of idx.cells.get(x + ',' + y) || []) d = Math.min(d, segDist(p, a, b));
  }
  return d;
}
function margin(p) {
  const dCoast = nearest(p, SE_IDX), dLake = nearest(p, LAKE_IDX);
  if (!inside(p, SE_IDX)) return -dCoast;
  if (inside(p, LAKE_IDX)) return -dLake;
  return Math.min(dCoast, dLake);
}
function toLand(p, need, maxR = 8) { // nearest point with at least `need` units of land around it (or the best found)
  if (margin(p) >= need) return p;
  let best = { q: p, m: margin(p) };
  for (let rad = 0.1; rad <= maxR; rad += 0.1) {
    let hit = null;
    const steps = Math.max(12, Math.round(rad * 40));
    for (let k = 0; k < steps; k++) {
      const a = (k / steps) * Math.PI * 2, q = [p[0] + rad * Math.cos(a), p[1] + rad * Math.sin(a)], m = margin(q);
      if (m > best.m) best = { q, m };
      if (m >= need && (!hit || m > hit.m)) hit = { q, m };
    }
    if (hit) return hit.q;
  }
  return best.q;
}
// shortest path over land between two points (A* on a 0.3-unit grid), kept away from the shore where it can be
function landPath(a, b, need = 0.9) {
  const S = 0.3, pad = 24;
  const x0 = Math.min(a[0], b[0]) - pad, y0 = Math.min(a[1], b[1]) - pad;
  const nx = Math.ceil((Math.abs(a[0] - b[0]) + 2 * pad) / S), ny = Math.ceil((Math.abs(a[1] - b[1]) + 2 * pad) / S);
  const cellOf = p => [Math.round((p[0] - x0) / S), Math.round((p[1] - y0) / S)];
  const posOf = (i, j) => [x0 + i * S, y0 + j * S];
  const mg = new Float32Array(nx * ny).fill(NaN);
  const getM = (i, j) => { const k = j * nx + i; if (Number.isNaN(mg[k])) mg[k] = margin(posOf(i, j)); return mg[k]; };
  const [si, sj] = cellOf(a), [ti, tj] = cellOf(b);
  const nearEnd = (i, j) => Math.hypot(i - si, j - sj) * S < 1.6 || Math.hypot(i - ti, j - tj) * S < 1.6;
  const ok = (i, j) => i >= 0 && j >= 0 && i < nx && j < ny && getM(i, j) >= (nearEnd(i, j) ? 0.2 : need);
  const g = new Float64Array(nx * ny).fill(Infinity), from = new Int32Array(nx * ny).fill(-1);
  const heap = []; // binary heap of [f, k]
  const push = (f, k) => { heap.push([f, k]); let i = heap.length - 1; while (i > 0) { const pa = (i - 1) >> 1; if (heap[pa][0] <= heap[i][0]) break; [heap[pa], heap[i]] = [heap[i], heap[pa]]; i = pa; } };
  const pop = () => { const top = heap[0], last = heap.pop(); if (heap.length) { heap[0] = last; let i = 0; for (;;) { const l = 2 * i + 1, r = l + 1; let m = i; if (l < heap.length && heap[l][0] < heap[m][0]) m = l; if (r < heap.length && heap[r][0] < heap[m][0]) m = r; if (m === i) break; [heap[m], heap[i]] = [heap[i], heap[m]]; i = m; } } return top; };
  const sk = sj * nx + si, tk = tj * nx + ti;
  g[sk] = 0; push(0, sk);
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
  while (heap.length) {
    const [, k] = pop();
    if (k === tk) break;
    const i = k % nx, j = (k - i) / nx;
    for (const [di, dj] of dirs) {
      const ii = i + di, jj = j + dj; if (!ok(ii, jj)) continue;
      const kk = jj * nx + ii, step = Math.hypot(di, dj) * S, m = getM(ii, jj);
      const cost = g[k] + step * (1 + 0.8 / Math.max(0.3, Math.min(m, 3))); // prefer the middle of the land
      if (cost < g[kk]) { g[kk] = cost; from[kk] = k; push(cost + Math.hypot(ii - ti, jj - tj) * S, kk); }
    }
  }
  if (from[tk] < 0) return null;
  const out = []; for (let k = tk; k >= 0; k = from[k]) { const i = k % nx; out.push(posOf(i, (k - i) / nx)); if (k === sk) break; }
  return out.reverse();
}

// ---------- cities
const ORDER = ['malmo', 'ystad', 'lund', 'helsingborg', 'goteborg', 'jonkoping', 'linkoping', 'norrkoping', 'orebro', 'vasteras',
  'uppsala', 'stockholm', 'gavle', 'sundsvall', 'ostersund', 'umea', 'lulea', 'jokkmokk', 'gallivare', 'kiruna'];
const CITY_LL = {
  malmo: [13.000, 55.605], ystad: [13.820, 55.429], lund: [13.191, 55.705], helsingborg: [12.694, 56.046],
  goteborg: [11.974, 57.709], jonkoping: [14.162, 57.783], linkoping: [15.622, 58.411], norrkoping: [16.192, 58.588],
  orebro: [15.213, 59.275], vasteras: [16.545, 59.611], uppsala: [17.639, 59.859], stockholm: [18.069, 59.329],
  gavle: [17.141, 60.675], sundsvall: [17.307, 62.391], ostersund: [14.636, 63.176], umea: [20.263, 63.826],
  lulea: [22.155, 65.584], jokkmokk: [19.823, 66.607], gallivare: [20.660, 67.133], kiruna: [20.225, 67.856],
};
// Luleå's centre sits on the south-west bank of the Lule River mouth; on the simplified coast its real point
// falls in the estuary, so pin it to that bank rather than letting it jump to the far side.
const CITY_AT = { lulea: [22.060, 65.566] };
const CITY_MARGIN = 0.9;
const cities = {}, moved = [];
for (const sid of ORDER) {
  const p = project(CITY_LL[sid]), q = toLand(project(CITY_AT[sid] || CITY_LL[sid]), CITY_MARGIN);
  const d = Math.hypot(q[0] - p[0], q[1] - p[1]);
  if (d > 0.01) moved.push(`${sid} ${d.toFixed(2)}`);
  cities[sid] = [r1(q[0]), r1(q[1])];
}

// ---------- roads: real routes as [lon, lat] waypoints between the cities ('@uppsala-e4' is the E4 junction east of Uppsala)
const J_UPPSALA = [17.700, 59.845];
const PIECES = {
  'malmo-ystad': ['malmo', [13.234, 55.508], [13.500, 55.477], [13.640, 55.465], 'ystad'], // E65 via Svedala, Skurup
  'ystad-lund': ['ystad', [13.735, 55.530], [13.706, 55.631], [13.530, 55.660], [13.349, 55.665], 'lund'], // road 13 to Sjöbo, west via Dalby
  'lund-helsingborg': ['lund', [13.100, 55.780], [12.960, 55.860], [12.870, 55.960], [12.770, 56.030], 'helsingborg'], // E6 past Landskrona
  'helsingborg-goteborg': ['helsingborg', [12.820, 56.130], [12.880, 56.240], [12.850, 56.380], [13.020, 56.500], [12.930, 56.630], [12.880, 56.700],
    [12.700, 56.810], [12.550, 56.910], [12.400, 57.010], [12.300, 57.120], [12.200, 57.300], [12.090, 57.480], [12.020, 57.620], 'goteborg'], // E6 via Halmstad, Falkenberg, Varberg, Kungsbacka
  'goteborg-jonkoping': ['goteborg', [12.200, 57.690], [12.600, 57.700], [12.940, 57.720], [13.410, 57.790], [13.800, 57.770], 'jonkoping'], // road 40 via Borås, Ulricehamn
  'jonkoping-linkoping': ['jonkoping', [14.280, 57.800], [14.420, 57.930], [14.500, 58.030], [14.650, 58.230], [14.900, 58.300], [15.130, 58.320], [15.400, 58.380], 'linkoping'], // E4 via Gränna, Ödeshög, Mjölby
  'linkoping-norrkoping': ['linkoping', [15.850, 58.470], [16.050, 58.550], 'norrkoping'], // E4
  'norrkoping-orebro': ['norrkoping', [15.950, 58.660], [15.770, 58.710], [15.600, 58.850], [15.450, 59.000], [15.300, 59.150], 'orebro'], // road 51 via Finspång
  'orebro-vasteras': ['orebro', [15.450, 59.340], [15.840, 59.400], [15.990, 59.520], [16.250, 59.570], 'vasteras'], // E18 via Arboga, Köping
  'vasteras-uppsala': ['vasteras', [16.800, 59.640], [17.080, 59.650], [17.350, 59.740], 'uppsala'], // E18 to Enköping, road 55
  'uppsala-e4': ['uppsala', J_UPPSALA], // into town from the E4
  'e4-stockholm': [J_UPPSALA, [17.790, 59.720], [17.920, 59.650], [17.910, 59.520], [17.950, 59.430], 'stockholm'], // E4 past Arlanda
  'e4-gavle': [J_UPPSALA, [17.640, 59.990], [17.470, 60.200], [17.350, 60.400], [17.210, 60.580], 'gavle'], // E4 north past Tierp
  'gavle-sundsvall': ['gavle', [17.150, 60.850], [17.100, 61.050], [17.000, 61.300], [17.050, 61.500], [17.050, 61.730], [17.150, 61.950], [17.250, 62.150], 'sundsvall'], // E4 via Söderhamn, Hudiksvall
  'sundsvall-ostersund': ['sundsvall', [16.900, 62.430], [16.500, 62.480], [15.660, 62.520], [15.420, 62.750], [15.100, 62.950], 'ostersund'], // E14 via Ånge, Bräcke
  'ostersund-umea': ['ostersund', [15.000, 63.350], [15.350, 63.590], [15.900, 63.800], [16.200, 64.110], [17.350, 64.160], [18.400, 64.080], [19.220, 63.930], [19.800, 63.860], 'umea'], // inland via Hoting, Åsele, Bjurholm
  'umea-lulea': ['umea', [20.550, 64.000], [20.850, 64.190], [20.950, 64.450], [20.950, 64.750], [21.210, 64.950], [21.330, 65.150], [21.230, 65.310],
    [21.260, 65.400], [21.450, 65.455], [21.700, 65.475], [21.800, 65.555], [21.930, 65.572], 'lulea'], // E4 via Skellefteå, round the Pite and Lule estuaries
  'lulea-jokkmokk': ['lulea', [21.930, 65.600], [21.790, 65.660], [21.700, 65.740], [21.690, 65.830], [21.300, 66.050], [21.000, 66.250], [20.600, 66.430], [20.200, 66.550], 'jokkmokk'], // road 97 up the Lule River via Boden, Vuollerim
  'jokkmokk-gallivare': ['jokkmokk', [20.050, 66.800], [20.350, 66.980], 'gallivare'], // E45
  'gallivare-kiruna': ['gallivare', [20.750, 67.300], [20.840, 67.500], [20.850, 67.650], [20.550, 67.800], 'kiruna'], // E10 via Svappavaara
};
// each step of the journey is one or more pieces; a leading '-' runs a piece backwards
const SEGS = Object.fromEntries(ORDER.slice(0, -1).map((a, i) => [a + '-' + ORDER[i + 1], [a + '-' + ORDER[i + 1]]]));
SEGS['uppsala-stockholm'] = ['uppsala-e4', 'e4-stockholm'];
SEGS['stockholm-gavle'] = ['-e4-stockholm', 'e4-gavle'];

// centripetal Catmull-Rom through the points, as cubic Bézier pieces (the same maths as d3-shape's curveCatmullRom)
function spline(pts) {
  const P = [pts[0], ...pts, pts[pts.length - 1]], out = [];
  for (let i = 1; i < P.length - 2; i++) {
    const [p0, p1, p2, p3] = [P[i - 1], P[i], P[i + 1], P[i + 2]];
    const l01 = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]), l12 = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]), l23 = Math.hypot(p3[0] - p2[0], p3[1] - p2[1]);
    const a01 = Math.sqrt(l01), a12 = Math.sqrt(l12), a23 = Math.sqrt(l23);
    let c1 = p1.slice(), c2 = p2.slice();
    if (a01 > 1e-6) { const a = 2 * l01 + 3 * a01 * a12 + l12, n = 3 * a01 * (a01 + a12); c1 = [(p1[0] * a - p0[0] * l12 + p2[0] * l01) / n, (p1[1] * a - p0[1] * l12 + p2[1] * l01) / n]; }
    if (a23 > 1e-6) { const b = 2 * l23 + 3 * a23 * a12 + l12, m = 3 * a23 * (a23 + a12); c2 = [(p2[0] * b + p1[0] * l23 - p3[0] * l12) / m, (p2[1] * b + p1[1] * l23 - p3[1] * l12) / m]; }
    out.push([p1, c1, c2, p2]);
  }
  return out;
}
const bez = ([a, b, c, d], t) => { const m = 1 - t; return [0, 1].map(j => m * m * m * a[j] + 3 * m * m * t * b[j] + 3 * m * t * t * c[j] + t * t * t * d[j]); };
// open stretches keep about 2 km of land on either side so the road reads as inland even at low zoom;
// near a town (which may sit on the shore) the road may run closer to the water
const OPEN_MARGIN = 1.0, TOWN_MARGIN = 0.4, TOWN_ZONE = 5;
function firstBad(curves, ends, open) {
  for (let ci = 0; ci < curves.length; ci++) {
    const cv = curves[ci], n = Math.max(8, Math.ceil(Math.hypot(cv[3][0] - cv[0][0], cv[3][1] - cv[0][1]) / 0.12));
    for (let k = 1; k < n; k++) {
      const q = bez(cv, k / n), dEnd = Math.min(...ends.map(e => Math.hypot(q[0] - e[0], q[1] - e[1])));
      const need = dEnd < 1.6 ? 0.2 : dEnd < TOWN_ZONE ? TOWN_MARGIN : open;
      if (margin(q) < need) return { q, ci };
    }
  }
  return null;
}
function buildPiece(id, spec, open = OPEN_MARGIN) {
  const at = s => (typeof s === 'string' ? cities[s] : project(s));
  const pts = spec.map((s, i) => (i === 0 || i === spec.length - 1 ? at(s) : toLand(at(s), open + 0.6)));
  const ends = [pts[0], pts[pts.length - 1]];
  let routed = 0;
  for (let iter = 0; iter < 40; iter++) {
    const curves = spline(pts), bad = firstBad(curves, ends, open);
    if (!bad) return { curves, routed, open };
    // reroute the failing stretch over land, then keep just enough of the route to follow it
    const a = pts[bad.ci], b = pts[bad.ci + 1];
    const route = landPath(a, b, open + 0.4) || landPath(a, b, open) || landPath(a, b, 0.6);
    if (!route) throw new Error(`${id}: no land route between ${a.map(r1)} and ${b.map(r1)}`);
    const tol = iter < 4 ? 0.8 : iter < 10 ? 0.45 : 0.25;
    const keep = simplify(route, tol).slice(1, -1);
    if (!keep.length) keep.push(route[Math.floor(route.length / 2)]);
    if (process.env.MAPDEBUG) console.log(id, 'iter', iter, 'stretch', bad.ci, 'bad at', bad.q.map(r1), margin(bad.q).toFixed(2), '-> +', keep.length, 'points');
    pts.splice(bad.ci + 1, 0, ...keep);
    routed += keep.length;
  }
  if (open > 0.55) { console.warn(`${id}: land is narrow here, allowing the road closer to the water`); return buildPiece(id, spec, 0.55); }
  throw new Error(`could not keep ${id} on land`);
}
const fmtC = cv => cv.map(p => p.map(r1));
const pieces = {}, report = [];
for (const [id, spec] of Object.entries(PIECES)) {
  const { curves, routed, open } = buildPiece(id, spec);
  pieces[id] = curves.map(fmtC);
  if (routed || open < OPEN_MARGIN) report.push(`${id}: +${routed}${open < OPEN_MARGIN ? ' (narrow land)' : ''}`);
}
const pathOf = cvs => `M${cvs[0][0][0]} ${cvs[0][0][1]}` + cvs.map(([, c1, c2, p]) => `C${c1[0]} ${c1[1]} ${c2[0]} ${c2[1]} ${p[0]} ${p[1]}`).join('');
const reverse = cvs => cvs.slice().reverse().map(([a, b, c, d]) => [d, c, b, a]);
const roads = { pieces: {}, segs: {} };
for (const [id, cvs] of Object.entries(pieces)) roads.pieces[id] = pathOf(cvs);
for (const [seg, list] of Object.entries(SEGS)) {
  const cvs = list.flatMap(p => (p[0] === '-' ? reverse(pieces[p.slice(1)]) : pieces[p]));
  // arc length and the point halfway along, for the road-number shield
  const samples = cvs.flatMap(cv => Array.from({ length: 24 }, (_, k) => bez(cv, k / 24))).concat([cvs[cvs.length - 1][3]]);
  const acc = [0]; for (let i = 1; i < samples.length; i++) acc.push(acc[i - 1] + Math.hypot(samples[i][0] - samples[i - 1][0], samples[i][1] - samples[i - 1][1]));
  const len = acc[acc.length - 1], half = acc.findIndex(v => v >= len / 2);
  roads.segs[seg] = { p: list, mid: samples[half].map(r1), len: r1(len) };
}

// MAPDEBUG_EXPORT=1 lets a debugging script require() the generated geometry without writing the file
if (process.env.MAPDEBUG_EXPORT) { module.exports = { project, sweden, lakes, neighbours, margin, cities, PIECES, pieces }; return; }
// ---------- write
const fmt = rs => rs.map(r => r.map(([x, y]) => `${x},${y}`).join(' '));
const out = { W, H, sweden: fmt(sweden), neighbours: fmt(neighbours), lakes: fmt(lakes), cities, roads };
const json = JSON.stringify(out);
fs.writeFileSync(path.join(__dirname, '..', 'src', 'mapdata.json'), json);
const count = rs => rs.reduce((s, r) => s + r.length, 0);
console.log(`mapdata.json ${(json.length / 1024).toFixed(1)} KB · Sweden ${sweden.length} rings / ${count(sweden)} points · neighbours ${neighbours.length} / ${count(neighbours)} · lakes ${lakes.length} / ${count(lakes)}`);
console.log('cities moved onto land:', moved.join(', ') || 'none');
console.log('roads needing extra waypoints:', report.join('; ') || 'none');
