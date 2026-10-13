// shared by the home page and the films pages.
export const stars = (r: number | null) => r == null ? '' : '★'.repeat(Math.floor(r)) + (r % 1 ? '½' : '');

export const favourites = [
  ['The Odyssey', 'https://letterboxd.com/film/the-odyssey-2026/'],
  ['Pacific Rim', 'https://letterboxd.com/film/pacific-rim/'],
  ['Across the Spider-Verse', 'https://letterboxd.com/film/spider-man-across-the-spider-verse/'],
  ['Shutter Island', 'https://letterboxd.com/film/shutter-island/'],
];
