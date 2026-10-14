// everything both bake-off sites say about nick, so the two differ only in how they say it.
import songsTxt from '../../content/songs.txt?raw';
import photosJson from '../../data/photos.json';
import { featured, rest } from './work';

export const photos = photosJson.photos;
export const projectCount = featured.length + rest.length;

export const contact = [
  ['nicktrim8@duck.com', 'mailto:nicktrim8@duck.com'],
  ['linkedin.com/in/nitrimandylis', 'https://www.linkedin.com/in/nitrimandylis'],
  ['github.com/nitrimandylis', 'https://github.com/nitrimandylis'],
];

export const results = [
  '2nd nationally, JA Greece (Akademix, CCO)',
  '1st, MIT RAISE FutureBuilders UK (MindReset)',
  '3rd, ACSTAC Day of AI hackathon',
  'product and service promotion award, JA Greece trade fair',
  'semi-finals, Young Business Talents',
];

// the man page's HISTORY: [year, what happened], newest first. the rest of the results live on the cv.
export const history = [
  ['2026', 'tokenpilot, in production at Omilia'],
  ['2026', '3rd, ACSTAC Day of AI hackathon'],
  ['2025', '2nd nationally, JA Greece (Akademix)'],
  ['2025', '1st, MIT RAISE FutureBuilders UK'],
];

// the man page's EXAMPLES: four prints by file name, in the order shown. edit this list to change them.
const exampleFiles = ['siena-il-campo-at-night', 'oaka-concert', 'corfu-old-fortress', 'lycabettus-sunset'];
export const examples = exampleFiles.map(file => {
  const i = photos.findIndex(p => p.file === file);
  if (i < 0) throw new Error(`EXAMPLES: no print called ${file} in data/photos.json`);
  return { ...photos[i], num: i + 1 };
});

// [section, where, what, result]. the section label only shows on the first row of each group.
export const cv = [
  ['work', 'Omilia, Athens', 'intern reporting to the CTO. built tokenpilot', 'in production'],
  ['', 'ALGroup Aluminium, Athens', 'digitised sales proposals and client quotes', ''],
  ['results', 'Akademix, JA Greece', 'chief commercial officer · 12 finalists from 100+ plans', '2nd nationally'],
  ['', 'JA Greece trade fair', 'product/service promotion', 'award'],
  ['', 'MIT RAISE FutureBuilders UK', 'innovation demo', '1st place'],
  ['', 'ACSTAC Day of AI hackathon', 'pitch', '3rd place'],
  ['', 'Young Business Talents', 'four rounds of running a simulated company', 'national semi-finals'],
  ['', 'CGSMUN', 'head of press · two newspaper issues and all conference photography', ''],
  ['education', 'Costeas-Geitonas, 2025-27', 'IB Diploma · HL Maths AA, CS, English B', ''],
  ['', 'Costeas-Geitonas', 'national academic merit award', 'three years running'],
  ['languages', 'Greek', 'native', ''],
  ['', 'English', 'C2 · Cambridge Proficiency 2023', ''],
  ['', 'Spanish', 'A2 · Instituto Cervantes 2023', ''],
  ['skills', 'Python · TypeScript', 'full-stack web', ''],
];

// content/songs.txt: one "title, artist" per line, # lines are comments. one is picked per build.
const songs = songsTxt.split('\n').map(s => s.trim()).filter(s => s && !s.startsWith('#'));
export const song = songs[Math.floor(Math.random() * songs.length)];

// "October 2026", for the man page footer and the cv
export const month = new Date().toLocaleString('en-GB', { month: 'long', year: 'numeric' });
