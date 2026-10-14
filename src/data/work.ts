import repos from '../../data/repos.json';

// every project. the home page shows the featured six, the work page shows all of them.
export const featured = [
  { name: 'tokenpilot', url: 'https://tokenpilot.nicktrim.com', code: 'https://github.com/nitrimandylis/tokenpilot', what: "what every model, key and team costs on an Anthropic or OpenAI account. built for Omilia's CTO" },
  { name: 'LLM-Mafia', url: 'https://mafia.nicktrim.com', code: 'https://github.com/nitrimandylis/LLM-Mafia', what: 'Mafia where every seat is a language model, replayed as a noir episode' },
  { name: 'aidetect', url: 'https://github.com/nitrimandylis/aidetect', what: 'how AI-written a draft reads, offline, plus IB word counts' },
  { name: 'bacpack', url: 'https://github.com/nitrimandylis/bacpack', what: 'ManageBac from the terminal, minus the school site' },
  { name: 'gridcast', url: 'https://gridcast.nicktrim.com', code: 'https://github.com/nitrimandylis/gridcast', what: 'F1 race probabilities committed before every race, scored in public after' },
  { name: 'blither', url: 'https://blither.nicktrim.com', code: 'https://github.com/nitrimandylis/blither', what: 'names for your next CLI, app or startup, from a model in your browser' },
];
export const rest = [
  ['apex', 'https://apex.nicktrim.com', 'F1 dashboard with live standings and replayable telemetry'],
  ['Petal.AI', 'https://github.com/nitrimandylis/Petal.AI', 'a soft-skills coach for iPhone, in SwiftUI'],
  ['WhimprFlow', 'https://github.com/nitrimandylis/WhimprFlow', 'a polished fork of a voice dictation app for the Mac'],
  ['swatch', 'https://github.com/nitrimandylis/swatch', 'one palette, twenty-two surfaces themed to match'],
  ['agent-wrapped', 'https://github.com/nitrimandylis/agent-wrapped', 'your Claude Code month as a scored card, offline'],
  ['brushwork', 'https://github.com/nitrimandylis/brushwork', 'turns a photo into visible brush strokes'],
  ['nous', 'https://github.com/nitrimandylis/nous', 'any folder of linked Markdown as a force graph'],
  ['nocturne', 'https://github.com/nitrimandylis/nocturne', 'a music visualiser shaped like a building at night'],
  ['jukebox', 'https://github.com/nitrimandylis/jukebox', 'Apple Music in the terminal'],
  ['jazz', 'https://github.com/nitrimandylis/jazz', 'focus videos playing inside the terminal'],
  ['cine', 'https://github.com/nitrimandylis/cine', 'Athens cinema showtimes with verdicts attached'],
  ['dovetail', 'https://github.com/nitrimandylis/dovetail', 'finds, backs up and diffs Mac app configs'],
  ['shelf', 'https://github.com/nitrimandylis/shelf', 'every repo you have, GitHub and local, in one table'],
  ['gridwatch', 'https://github.com/nitrimandylis/gridwatch', 'F1 standings and what it takes to clinch'],
  ['excali', 'https://github.com/nitrimandylis/excali', 'opens Excalidraw files from the terminal, autosaving'],
  ['lamp', 'https://github.com/nitrimandylis/lamp', 'a bedside lamp, controlled from the shell'],
  ['bootlog', 'https://github.com/nitrimandylis/bootlog', "today's commits as a kernel boot log"],
  ['loosethreads', 'https://loosethreads.nicktrim.com', 'anonymous gossip on a detective corkboard'],
  ['clawdarium', 'https://github.com/nitrimandylis/clawdarium', 'an aquarium of pixel crab animations'],
  ['IB news site', 'https://news.nicktrim.com', 'a school newspaper with its own CMS'],
  ['Starspace', 'https://starspace.nicktrim.com', 'three fields of computer science, explained for school'],
  ['night shift', 'https://os.nicktrim.com', 'the old site, disguised as an operating system'],
];
// the right-hand cell: 'live' when the project has a site, 'code' when it has a repo
export const links = (url: string, code?: string) => {
  const out: [string, string][] = [];
  if (!url.includes('github.com')) out.push(['live', url]);
  if (code) out.push(['code', code]);
  else if (url.includes('github.com')) out.push(['code', url]);
  return out;
};

// repos never shown: this site and the profile readme
const hidden = ['portfolio', 'nitrimandylis'];

// data/repos.json is rewritten daily by the work action. a repo shows up here, newest first,
// until it is hidden or named above (by repo name or by its homepage)
const written = JSON.stringify([featured, rest]).toLowerCase();
const fresh = repos.filter(r =>
  !hidden.includes(r.name) &&
  !written.includes('/nitrimandylis/' + r.name.toLowerCase() + '"') &&   // the closing quote stops Petal.AI matching Petal.AI-finetuning
  !(r.homepage && written.includes(r.homepage.toLowerCase()))
);

// every project in one shape, featured first: what the work pages list
export const all = [
  ...featured.map(f => ({ name: f.name, url: f.url, what: f.what, links: links(f.url, f.code) })),
  ...rest.map(([name, url, what]) => ({ name, url, what, links: links(url) })),
  ...fresh.map(r => ({ name: r.name, url: r.homepage || r.code, what: r.what, links: links(r.homepage || r.code, r.code) })),
];
