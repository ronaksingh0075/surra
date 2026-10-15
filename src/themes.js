/* ================= Surra colour themes =================
   Each theme repaints the app's tokens in light and dark. "Mysig" is the stylesheet's own palette.
   Rewards (stars, flame, bee), right/wrong colours and fact colours stay the same in every theme. */
const THEME_VARS = ['bg', 'bg-2', 'surface', 'surface-2', 'ink', 'ink-2', 'ink-3', 'line', 'glow', 'glow-2', 'glow-ink', 'glow-soft', 'falu', 'sea', 'land', 'land-edge', 'lake', 'neighbour', 'aurora-a', 'aurora-b'];
const THEMES = [
  {
    id: 'mysig', sv: 'Mysig', en: 'Candlelight', base: true,
    light: { bg: '#FCEFE6', 'bg-2': '#F7E3D5', surface: '#FFF9F4', 'surface-2': '#F8E8DC', ink: '#2B2142', 'ink-2': '#6B5D77', 'ink-3': '#9C8DA3', line: '#EBD6C6', glow: '#F2A93B', 'glow-2': '#DD8E1E', 'glow-ink': '#2A1906', 'glow-soft': '#FCE3BD', falu: '#A93A2F', sea: '#E3ECEE', land: '#F3DCC2', 'land-edge': '#C7A27C', lake: '#CEDFE7', neighbour: '#EDE3D9', 'aurora-a': '#5FD0A2', 'aurora-b': '#A28BEA' },
    dark: { bg: '#16122A', 'bg-2': '#1C1733', surface: '#221C3B', 'surface-2': '#2B2448', ink: '#F8EDE0', 'ink-2': '#BDAFC4', 'ink-3': '#85799A', line: '#3A3157', glow: '#F6B44E', 'glow-2': '#FFC874', 'glow-ink': '#261804', 'glow-soft': '#4A3620', falu: '#EC7A64', sea: '#120F25', land: '#2A2347', 'land-edge': '#4E4475', lake: '#1B1F47', neighbour: '#1B1733', 'aurora-a': '#4FE6A6', 'aurora-b': '#9C7BFF' },
  },
  {
    id: 'skargard', sv: 'Skärgård', en: 'Archipelago',
    light: { bg: '#EAF1F5', 'bg-2': '#DCE8EF', surface: '#F9FBFD', 'surface-2': '#E5EEF4', ink: '#132A3E', 'ink-2': '#4A6073', 'ink-3': '#7D90A1', line: '#D2E0E9', glow: '#2A72A8', 'glow-2': '#1C5784', 'glow-ink': '#FFFFFF', 'glow-soft': '#D5E7F4', falu: '#B0382C', sea: '#D3E6F1', land: '#E8EEE4', 'land-edge': '#9AB0A0', lake: '#BCD8E8', neighbour: '#E1E8ED', 'aurora-a': '#4CC9B0', 'aurora-b': '#8AA2EE' },
    dark: { bg: '#0D1B2A', 'bg-2': '#112237', surface: '#15283D', 'surface-2': '#1C324B', ink: '#EAF2F8', 'ink-2': '#A8BCCB', 'ink-3': '#6D8699', line: '#27405A', glow: '#63B3EA', 'glow-2': '#8FCBF4', 'glow-ink': '#04192A', 'glow-soft': '#1C3D5A', falu: '#F28C74', sea: '#081320', land: '#1A2F46', 'land-edge': '#3B5976', lake: '#113049', neighbour: '#0E1D2D', 'aurora-a': '#4FE6C8', 'aurora-b': '#8FA6FF' },
  },
  {
    id: 'skog', sv: 'Skog', en: 'Forest',
    light: { bg: '#EEF2E8', 'bg-2': '#E2E9D9', surface: '#FAFCF6', 'surface-2': '#E9EFE0', ink: '#1D2A20', 'ink-2': '#536356', 'ink-3': '#879587', line: '#D6E0CD', glow: '#3A7652', 'glow-2': '#2A5A3D', 'glow-ink': '#FFFFFF', 'glow-soft': '#D6E8DA', falu: '#9C5216', sea: '#E2EBEC', land: '#E4EBD8', 'land-edge': '#93A884', lake: '#CBDDE2', neighbour: '#E9ECE3', 'aurora-a': '#5FD0A2', 'aurora-b': '#9C9BEA' },
    dark: { bg: '#0F1A14', 'bg-2': '#13211A', surface: '#182A20', 'surface-2': '#1F3529', ink: '#EAF4EC', 'ink-2': '#A9C2B0', 'ink-3': '#6D8A75', line: '#2A4434', glow: '#74C792', 'glow-2': '#9BE0B2', 'glow-ink': '#062012', 'glow-soft': '#1F4630', falu: '#F0B27A', sea: '#09120D', land: '#1C3326', 'land-edge': '#3D5F49', lake: '#10283A', neighbour: '#0D1711', 'aurora-a': '#4FE6A6', 'aurora-b': '#9C9BFF' },
  },
  {
    id: 'ljung', sv: 'Ljung', en: 'Heather',
    light: { bg: '#F4EFF7', 'bg-2': '#E9E1F0', surface: '#FCFAFE', 'surface-2': '#EEE7F4', ink: '#261C33', 'ink-2': '#5E5270', 'ink-3': '#9285A3', line: '#DED3E8', glow: '#8549BB', 'glow-2': '#69379A', 'glow-ink': '#FFFFFF', 'glow-soft': '#E6D7F4', falu: '#A32F66', sea: '#E6E9F2', land: '#EADFEF', 'land-edge': '#A98FBA', lake: '#D3DAEC', neighbour: '#EEE8F2', 'aurora-a': '#5FD0A2', 'aurora-b': '#B18BEA' },
    dark: { bg: '#161125', 'bg-2': '#1C1630', surface: '#221B3A', 'surface-2': '#2C2448', ink: '#F3ECFA', 'ink-2': '#BFB1D0', 'ink-3': '#85799C', line: '#3B3158', glow: '#B98AF0', 'glow-2': '#D2B0FF', 'glow-ink': '#1E0B33', 'glow-soft': '#3B2A5C', falu: '#F08CB8', sea: '#100C1E', land: '#2A2245', 'land-edge': '#52457A', lake: '#1C1E47', neighbour: '#191330', 'aurora-a': '#4FE6A6', 'aurora-b': '#B48CFF' },
  },
  {
    id: 'midnattssol', sv: 'Midnattssol', en: 'Midnight sun',
    unlock: { hint: 'Unlocks at a 3-day streak', test: s => (s.streak.best || 0) >= 3 },
    light: { bg: '#FFF1E8', 'bg-2': '#FBE2D3', surface: '#FFFAF6', 'surface-2': '#FCE9DE', ink: '#2C1B2E', 'ink-2': '#6B5466', 'ink-3': '#A08A98', line: '#F1D6C9', glow: '#F07850', 'glow-2': '#D45A33', 'glow-ink': '#2B0D04', 'glow-soft': '#FCD9CA', falu: '#6B3FA0', sea: '#EFE6EE', land: '#F8DCCB', 'land-edge': '#CC9C83', lake: '#E2D8EA', neighbour: '#F3E5DD', 'aurora-a': '#F7B267', 'aurora-b': '#B48BEA' },
    dark: { bg: '#1B1024', 'bg-2': '#22142D', surface: '#2A1A36', 'surface-2': '#352244', ink: '#FFEFE6', 'ink-2': '#CDB2C4', 'ink-3': '#937A8E', line: '#46304F', glow: '#FF8C66', 'glow-2': '#FFB094', 'glow-ink': '#2B0B02', 'glow-soft': '#4E2733', falu: '#C7A4FF', sea: '#130B1A', land: '#36223F', 'land-edge': '#604468', lake: '#251E44', neighbour: '#1A0F22', 'aurora-a': '#FFB36B', 'aurora-b': '#C7A4FF' },
  },
  {
    id: 'norrsken', sv: 'Norrsken', en: 'Northern lights',
    unlock: { hint: 'Unlocks at 1,000 XP', test: s => (s.xp || 0) >= 1000 },
    light: { bg: '#EAF4F2', 'bg-2': '#DCEDEA', surface: '#F8FCFB', 'surface-2': '#E3F1EE', ink: '#10263A', 'ink-2': '#45606B', 'ink-3': '#7B949C', line: '#CDE4DF', glow: '#19A07E', 'glow-2': '#127A60', 'glow-ink': '#03201A', 'glow-soft': '#CDEFE5', falu: '#6A45C9', sea: '#DDEBF0', land: '#E2EFEA', 'land-edge': '#8FB3AA', lake: '#C6E0E6', neighbour: '#E3ECEC', 'aurora-a': '#3FD6A0', 'aurora-b': '#8E6BF0' },
    dark: { bg: '#0A1324', 'bg-2': '#0E1A30', surface: '#12203A', 'surface-2': '#192A48', ink: '#E8F6F4', 'ink-2': '#A3C0C8', 'ink-3': '#6A8794', line: '#233A5A', glow: '#3EE0A8', 'glow-2': '#84F2C9', 'glow-ink': '#03211A', 'glow-soft': '#123F3A', falu: '#B79BFF', sea: '#060D1A', land: '#142640', 'land-edge': '#2F4D73', lake: '#0F2A4A', neighbour: '#0B1527', 'aurora-a': '#3EE0A8', 'aurora-b': '#A58BFF' },
  },
];
const themeById = id => THEMES.find(t => t.id === id) || THEMES[0];
const themeOpen = (s, t) => !t.unlock || t.unlock.test(s);
function themeMode(settings) {
  const m = (settings && settings.mode) || 'auto';
  if (m === 'light' || m === 'dark') return m;
  return window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
function applyTheme(settings) {
  const root = document.documentElement;
  let t = themeById(settings && settings.palette);
  if (!themeOpen(S(), t)) t = THEMES[0];
  const forced = settings && (settings.mode === 'light' || settings.mode === 'dark');
  const mode = themeMode(settings);
  if (forced) root.setAttribute('data-theme', mode); else root.removeAttribute('data-theme');
  root.setAttribute('data-palette', t.id);
  for (const k of THEME_VARS) { if (t.base) root.style.removeProperty('--' + k); else root.style.setProperty('--' + k, t[mode][k]); }
  root.style.colorScheme = mode;
  root.style.background = t[mode].bg;
  document.querySelectorAll('meta[name="theme-color"]').forEach(m => { m.setAttribute('content', t[mode].bg); m.removeAttribute('media'); });
}
function watchSystemTheme() {
  if (!window.matchMedia) return;
  const mq = matchMedia('(prefers-color-scheme: dark)');
  const onChange = () => { const st = S().settings; if (!st.mode || st.mode === 'auto') applyTheme(st); };
  try { mq.addEventListener('change', onChange); } catch (e) { try { mq.addListener(onChange); } catch (e2) { /* old browsers */ } }
}
