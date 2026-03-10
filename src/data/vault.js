// ---------------------------------------------------------------------------
// Vault static data
//
// PROJECTS    -- interactive bookshelves. Each entry drives a hotspot polygon,
//               a project card (state 1), and the expanded panel (state 2).
//               cardAnchor left > 65% flips to right-anchored in resolveCardAnchor.
//
// CATS        -- easter egg hotspots. Click triggers an affirmation from Supabase.
//               affirmationTheme maps to the meeko_affirmations / mayu_affirmations table.
//
// LIGHT_SOURCES -- canvas percentage coordinates for atmosphere rendering.
//               Used by VaultAtmosphere to position god rays and lantern glows.
//               LANTERNS and ROSE_WINDOW are pre-filtered convenience exports.
// ---------------------------------------------------------------------------

export const PROJECTS = [
  {
    slug: 'ironiq',
    title: 'IronIQ',
    subtitle: 'Offline-first workout tracking. The most technically ambitious project in the vault.',
    shelf: 'Architecture vault',
    hotspot: { points: [[29.21, 37.96], [38.46, 42.18], [38.38, 50.28], [29.87, 47.72], [28.84, 45.06]] },
    cardAnchor: { left: '32.95%', top: '44.64%' },
  },
  {
    slug: 'engineering-gym',
    title: 'Eng Gym',
    subtitle: 'Quiz-based learning system. Doubles as a teaching tool for A-Level CS.',
    shelf: 'Architecture vault',
    hotspot: { points: [[29.5, 23.64], [37.13, 29.08], [37.27, 35.96], [29.21, 31.96]] },
    cardAnchor: { left: '33.28%', top: '30.16%' },
  },
  {
    slug: 'homeserver',
    title: 'HomeServer',
    subtitle: 'Self-hosted VPS infrastructure. The backbone that unblocks everything else.',
    shelf: 'Architecture vault',
    hotspot: { points: [[99.5, 53.05], [87.51, 54.27], [87.14, 60.93], [99.13, 60.71]] },
    cardAnchor: { left: '93.32%', top: '57.24%' },
  },
  {
    slug: 'drewbrew',
    title: 'drewBrew',
    subtitle: 'Coffee tracking app. An architecture case study in earning complexity.',
    shelf: 'Architecture vault',
    hotspot: { points: [[86.77, 44.06], [86.92, 49.83], [99.13, 48.39], [98.98, 41.29], [92.18, 42.73]] },
    cardAnchor: { left: '92.8%', top: '45.26%' },
  },
  {
    slug: 'drew-portfolio',
    title: 'drew-portfolio',
    subtitle: 'This site. The meta-narrative: building a portfolio that documents itself being built.',
    shelf: 'Architecture vault',
    hotspot: { points: [[39.12, 54.94], [34.02, 54.5], [35.72, 59.16], [35.5, 63.04], [39.05, 63.04]] },
    cardAnchor: { left: '36.68%', top: '58.94%' },
  },
  {
    slug: 'quitrx',
    title: 'QuitRx',
    subtitle: 'Cross-platform stop-smoking tracker. Local-first health data, honest stats, and a one-time Pro unlock -- no subscriptions, no data leaving your device.',
    shelf: 'Architecture vault',
    hotspot: { points: [[98.02, 25.31], [87.74, 28.63], [80.04, 32.96], [79.97, 37.62], [87.88, 33.85], [98.24, 30.85]] },
    cardAnchor: { left: '88.65%', top: '31.54%' },
  },
]

export const CATS = [
  {
    id: 'meeko',
    label: 'Meeko',
    affirmationTheme: 'light',
    points: [[78.26, 51.83], [75.16, 55.49], [73.9, 68.04], [76.93, 84.68], [79.45, 85.79], [84.63, 86.68], [90.47, 84.79], [89.96, 75.58], [84.55, 66.93], [82.7, 64.48], [82.48, 56.94], [80.93, 53.39]],
    bubbleAnchor: { left: '63%', top: '48%' },
  },
  {
    id: 'mayu',
    label: 'Mayu',
    affirmationTheme: 'dark',
    points: [[14.19, 32.74], [9.53, 36.07], [8.27, 44.06], [7.68, 52.39], [11.08, 53.61], [14.04, 57.27], [19.29, 52.94], [26.32, 54.72], [32.17, 63.71], [33.72, 60.71], [25.66, 47.39], [18.92, 43.84], [18.26, 37.62], [16.48, 34.63]],
    bubbleAnchor: { left: '1%', top: '28%' },
  },
]

// Light source positions as percentage of canvas width/height.
// Coordinates set via scripts/hotspot-editor.html -- update there first,
// then paste new values here.
export const LIGHT_SOURCES = [
  { id: 'rose-window', x: 63.41, y: 16.70 },
  { id: 'lantern-1',  x: 32.23, y: 11.62 },
  { id: 'lantern-2',  x: 90.82, y: 15.33 },
  { id: 'lantern-3',  x: 92.77, y: 48.54 },
  { id: 'lantern-4',  x: 73.50, y: 19.92 },
  { id: 'lantern-5',  x: 46.81, y: 55.27 },
  { id: 'lantern-6',  x: 53.39, y: 73.63 },
  { id: 'lantern-7',  x: 66.54, y: 43.85 },
  { id: 'lantern-8',  x: 40.49, y: 33.89 },
]

export const LANTERNS    = LIGHT_SOURCES.filter(s => s.id !== 'rose-window')
export const ROSE_WINDOW = LIGHT_SOURCES.find(s => s.id === 'rose-window')
