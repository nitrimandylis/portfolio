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
  '2nd nationally, ja greece (akademix, cco)',
  '1st, mit raise futurebuilders uk (mindreset)',
  '3rd, acstac day of ai hackathon',
  'product and service promotion award, ja greece trade fair',
  'semi-finals, young business talents',
];

// the man page's HISTORY: [year, what happened], newest first. the rest of the results live on the cv.
export const history = [
  ['2026', 'tokenpilot, in production at omilia'],
  ['2026', '3rd, acstac day of ai hackathon'],
  ['????', '2nd nationally, ja greece (akademix)'],
  ['2025', '1st, mit raise futurebuilders uk'],
];

// the man page's EXAMPLES: four prints by file name, in the order shown. edit this list to change them.
const exampleFiles = ['concert', 'siena-after-dark', 'dinner', 'corfu'];
export const examples = exampleFiles.map(file => {
  const i = photos.findIndex(p => p.file === file);
  if (i < 0) throw new Error(`EXAMPLES: no print called ${file} in data/photos.json`);
  return { ...photos[i], num: i + 1 };
});

// [section, where, what, result]. the section label only shows on the first row of each group.
export const cv = [
  ['work', 'omilia, athens', 'intern reporting to the cto. built tokenpilot', 'in production'],
  ['', 'algroup aluminium, athens', 'digitised sales proposals and client quotes', ''],
  ['results', 'akademix, ja greece', 'chief commercial officer · 12 finalists from 100+ plans', '2nd nationally'],
  ['', 'ja greece trade fair', 'product/service promotion', 'award'],
  ['', 'mit raise futurebuilders uk', 'innovation demo', '1st place'],
  ['', 'acstac day of ai hackathon', 'pitch', '3rd place'],
  ['', 'young business talents', 'four rounds of running a simulated company', 'national semi-finals'],
  ['', 'cgsmun', 'head of press · two newspaper issues and all conference photography', ''],
  ['education', 'costeas-geitonas, 2025-27', 'ib diploma · hl maths aa, cs, english b', ''],
  ['', 'costeas-geitonas', 'national academic merit award', 'three years running'],
  ['languages', 'greek', 'native', ''],
  ['', 'english', 'c2 · cambridge proficiency 2023', ''],
  ['', 'spanish', 'a2 · instituto cervantes 2023', ''],
  ['skills', 'python · typescript', 'full-stack web', ''],
];

// content/songs.txt: one "title, artist" per line, # lines are comments. one is picked per build.
const songs = songsTxt.split('\n').map(s => s.trim()).filter(s => s && !s.startsWith('#'));
export const song = songs[Math.floor(Math.random() * songs.length)].toLowerCase();

// "october 2026", for the man page footer and the cv
export const month = new Date().toLocaleString('en-GB', { month: 'long', year: 'numeric' }).toLowerCase();
