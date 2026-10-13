// every project. the home page shows the featured six, the work page shows all of them.
export const featured = [
  { name: 'tokenpilot', url: 'https://tokenpilot.nicktrim.com', code: 'https://github.com/nitrimandylis/tokenpilot', what: 'reads an anthropic or openai admin api and tells you what every model, key and team costs. built at omilia, in production.' },
  { name: 'llm-mafia', url: 'https://mafia.nicktrim.com', code: 'https://github.com/nitrimandylis/LLM-Mafia', what: 'mafia where every seat is a language model, lying to the others. each game is replayed as a noir episode you can watch.' },
  { name: 'aidetect', url: 'https://github.com/nitrimandylis/aidetect', what: 'scores a draft for how ai-written it reads, paragraph by paragraph, fully offline. also counts words the way the ib counts them.' },
  { name: 'bacpack', url: 'https://github.com/nitrimandylis/bacpack', what: 'managebac from the terminal: what is due, what a task actually asks, cas logging and portfolio entries. the school site, minus the school site.' },
  { name: 'gridcast', url: 'https://gridcast.nicktrim.com', code: 'https://github.com/nitrimandylis/gridcast', what: 'f1 race probabilities committed to git before every race and scored in public afterwards. a raspberry pi runs the weekend.' },
  { name: 'blither', url: 'https://blither.nicktrim.com', code: 'https://github.com/nitrimandylis/blither', what: 'names for your next cli, app or startup, from a character model that runs in your browser. give it hint words, it gives you fifty options.' },
];
export const rest = [
  ['apex', 'https://apex.nicktrim.com', 'f1 dashboard with live standings and replayable telemetry'],
  ['petal.ai', 'https://github.com/nitrimandylis/Petal.AI', 'a soft-skills coach for iphone, in swiftui'],
  ['whimprflow', 'https://github.com/nitrimandylis/WhimprFlow', 'a voice dictation app for the mac, polished and translated'],
  ['swatch', 'https://github.com/nitrimandylis/swatch', 'one palette, twenty-two mac apps themed to match'],
  ['agent-wrapped', 'https://github.com/nitrimandylis/agent-wrapped', 'your claude code month as a scored card, offline'],
  ['brushwork', 'https://github.com/nitrimandylis/brushwork', 'turns a photo into visible brush strokes'],
  ['nous', 'https://github.com/nitrimandylis/nous', 'any folder of linked markdown as a force graph'],
  ['nocturne', 'https://github.com/nitrimandylis/nocturne', 'a music visualiser shaped like a building at night'],
  ['jukebox', 'https://github.com/nitrimandylis/jukebox', 'apple music in the terminal'],
  ['jazz', 'https://github.com/nitrimandylis/jazz', 'focus videos playing inside the terminal'],
  ['cine', 'https://github.com/nitrimandylis/cine', 'athens cinema showtimes with verdicts attached'],
  ['dovetail', 'https://github.com/nitrimandylis/dovetail', 'finds, backs up and diffs mac app configs'],
  ['shelf', 'https://github.com/nitrimandylis/shelf', 'every repo you have, github and local, in one table'],
  ['gridwatch', 'https://github.com/nitrimandylis/gridwatch', 'f1 standings and what it takes to clinch'],
  ['excali', 'https://github.com/nitrimandylis/excali', 'opens excalidraw files from the terminal, autosaving'],
  ['lamp', 'https://github.com/nitrimandylis/lamp', 'a bedside lamp, controlled from the shell'],
  ['bootlog', 'https://github.com/nitrimandylis/bootlog', "today's commits as a kernel boot log"],
  ['loosethreads', 'https://loosethreads.nicktrim.com', 'anonymous gossip on a detective corkboard'],
  ['clawdarium', 'https://github.com/nitrimandylis/clawdarium', 'an aquarium of pixel crab animations'],
  ['ib news site', 'https://news.nicktrim.com', 'a school newspaper with its own cms'],
  ['starspace', 'https://starspace.nicktrim.com', 'three fields of computer science, explained for school'],
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

// every project in one shape, featured first: what the work pages list
export const all = [
  ...featured.map(f => ({ name: f.name, url: f.url, what: f.what, links: links(f.url, f.code) })),
  ...rest.map(([name, url, what]) => ({ name, url, what, links: links(url) })),
];
