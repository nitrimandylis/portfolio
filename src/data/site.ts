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

// the man page's EXAMPLES: four prints by file name, in the order shown. edit this list to change them.
const exampleFiles = ['siena-il-campo-at-night', 'oaka-concert', 'corfu-old-fortress', 'lycabettus-sunset'];
export const examples = exampleFiles.map(file => {
  const i = photos.findIndex(p => p.file === file);
  if (i < 0) throw new Error(`EXAMPLES: no print called ${file} in data/photos.json`);
  return { ...photos[i], num: i + 1 };
});

// [section, where, what, result]. the section label only shows on the first row of each group.
export const cv = [
  ['work', 'Omilia, Athens', 'intern reporting to the CTO. built tokenpilot', 'shipped'],
  ['', 'AL Group, Athens', 'digitised sales proposals and client quotes', ''],
  ['results', 'Akademix, JA Greece', 'co-founder, commercial lead · 12 finalists from 100+ plans', '2nd nationally'],
  ['', 'JA Greece trade fair', 'product/service promotion', 'award'],
  ['', 'MIT FutureBuilders', 'innovation demo', '1st place'],
  ['', 'ACSTAC Day of AI', 'pitch', '3rd place'],
  ['', 'Young Business Talents', 'four rounds of running a simulated company', 'semi-finals'],
  ['', 'CGSMUN', 'co-head of press · two newspaper issues and all conference photography', ''],
  ['education', 'Costeas-Geitonas', 'IB Diploma 2025-27 · HL Maths AA, CS, English B', ''],
  ['', 'Costeas-Geitonas', 'national academic merit award', '3 years running'],
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
