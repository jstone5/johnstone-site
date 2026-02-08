// Book data and platform generation for Book Platformer

import type { BookPlatform } from './types';
import { GAME_CONFIG, BOOK_COLORS } from './physics';

export interface BookData {
  title: string;
  author: string;
  isbn?: string;
  amazonUrl?: string;
}

// The 27 books from the user's reading list
export const BOOKS_DATA: BookData[] = [
  { title: "Abundance", author: "Ezra Klein", isbn: "9781668064580" },
  { title: "The Accidental President", author: "A.J. Baime", isbn: "9781328505682" },
  { title: "Chip War", author: "Chris Miller", isbn: "9781982172008" },
  { title: "The Psychology of Money", author: "Morgan Housel", isbn: "9780857197689" },
  { title: "Elon Musk", author: "Walter Isaacson", isbn: "9781982181284" },
  { title: "The Smartest Guys in the Room", author: "Bethany McLean", isbn: "9781591846604" },
  { title: "Ready Player One", author: "Ernest Cline", isbn: "9780307887443" },
  { title: "Outlive", author: "Peter Attia", isbn: "9780593236598" },
  { title: "The Gifts of Imperfection", author: "Brene Brown", isbn: "9781592858491" },
  { title: "Unreasonable Hospitality", author: "Will Guidara", isbn: "9780593418574" },
  { title: "The Obstacle is the Way", author: "Ryan Holiday", isbn: "9781591846352" },
  { title: "This is Water", author: "David Foster Wallace", isbn: "9780316068222" },
  { title: "Four Thousand Weeks", author: "Oliver Burkeman", isbn: "9780374159122" },
  { title: "The Ruthless Elimination of Hurry", author: "John Mark Comer", isbn: "9780525653097" },
  { title: "The Almanack of Naval Ravikant", author: "Eric Jorgenson", isbn: "9781544514215" },
  { title: "Atomic Habits", author: "James Clear", isbn: "9780735211292" },
  { title: "Range", author: "David Epstein", isbn: "9780735214484" },
  { title: "Steve Jobs", author: "Walter Isaacson", isbn: "9781451648539" },
  { title: "Creativity Inc", author: "Ed Catmull", isbn: "9780812993011" },
  { title: "Zero to One", author: "Peter Thiel", isbn: "9780804139298" },
  { title: "So Good They Can't Ignore You", author: "Cal Newport", isbn: "9781455509126" },
  { title: "Antifragile", author: "Nassim Nicholas Taleb", isbn: "9780812979688" },
  { title: "The Black Swan", author: "Nassim Nicholas Taleb", isbn: "9780812973815" },
  { title: "Grit", author: "Angela Duckworth", isbn: "9781501111112" },
  { title: "Deep Work", author: "Cal Newport", isbn: "9781455586691" },
  { title: "The Alchemist", author: "Paulo Coelho", isbn: "9780062315007" },
  { title: "Love Does", author: "Bob Goff", isbn: "9781400203758" },
];

// Generate platform positions for books (legacy — used by SVG BookPlatformer)
export function generatePlatforms(
  startX: number,
  groundY: number
): BookPlatform[] {
  const platforms: BookPlatform[] = [];
  let currentX = startX;

  const heightPatterns = [
    [0.6, 0.5, 0.4, 0.5, 0.6],
    [0.4, 0.5, 0.6, 0.5, 0.4],
    [0.5, 0.4, 0.5, 0.6, 0.5],
    [0.4, 0.4, 0.5, 0.5, 0.6],
    [0.6, 0.5, 0.5, 0.4, 0.4],
  ];

  BOOKS_DATA.forEach((book, index) => {
    const patternIndex = Math.floor(index / 5) % heightPatterns.length;
    const positionInPattern = index % 5;
    const heightMultiplier = heightPatterns[patternIndex][positionInPattern];

    const maxHeight = groundY - GAME_CONFIG.BOOK_HEIGHT - 50;
    const minHeight = groundY - GAME_CONFIG.BOOK_HEIGHT - 250;
    const y = groundY - GAME_CONFIG.BOOK_HEIGHT - (maxHeight - minHeight) * heightMultiplier - 50;

    const spacing = GAME_CONFIG.BOOK_SPACING_MIN +
      Math.random() * (GAME_CONFIG.BOOK_SPACING_MAX - GAME_CONFIG.BOOK_SPACING_MIN);

    platforms.push({
      id: `book-${index}`,
      title: book.title,
      author: book.author,
      x: currentX,
      y: Math.max(100, Math.min(y, groundY - GAME_CONFIG.BOOK_HEIGHT - 30)),
      width: GAME_CONFIG.BOOK_WIDTH,
      height: GAME_CONFIG.BOOK_HEIGHT,
      color: BOOK_COLORS[index % BOOK_COLORS.length],
      amazonUrl: book.amazonUrl,
    });

    currentX += GAME_CONFIG.BOOK_WIDTH + spacing;
  });

  return platforms;
}

// Get Open Library cover URL from ISBN
export function getBookCoverUrl(isbn: string): string {
  return `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`;
}

// Get Amazon search URL for a book
export function getAmazonSearchUrl(title: string, author: string): string {
  const query = encodeURIComponent(`${title} ${author}`);
  return `https://www.amazon.com/s?k=${query}&i=stripbooks`;
}
