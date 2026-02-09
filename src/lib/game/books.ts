// Book data and platform generation for Book Platformer

import type { BookPlatform } from './types';
import { GAME_CONFIG, BOOK_COLORS } from './physics';

export interface BookData {
  title: string;
  author: string;
  isbn?: string;
  amazonUrl?: string;
  spineColor: string; // Theme-matched spine color for each book cover
}

// The 27 books from the user's reading list
// Spine colors are hand-picked to complement each book's cover art
export const BOOKS_DATA: BookData[] = [
  { title: "Abundance", author: "Ezra Klein", isbn: "9781668064580", spineColor: "#2D6A4F" },          // forest green (green cover)
  { title: "The Accidental President", author: "A.J. Baime", isbn: "9781328505682", spineColor: "#1B3A5C" }, // navy (historical blue)
  { title: "Chip War", author: "Chris Miller", isbn: "9781982172008", spineColor: "#8B1A1A" },          // deep red (red tech cover)
  { title: "The Psychology of Money", author: "Morgan Housel", isbn: "9780857197689", spineColor: "#6B5B3E" }, // warm brown (tan/beige cover)
  { title: "Elon Musk", author: "Walter Isaacson", isbn: "9781982181284", spineColor: "#2A2A2A" },      // near-black (stark dark cover)
  { title: "The Smartest Guys in the Room", author: "Bethany McLean", isbn: "9781591846604", spineColor: "#8B6914" }, // amber (yellow cover)
  { title: "Ready Player One", author: "Ernest Cline", isbn: "9780307887443", spineColor: "#1A1A5C" },  // dark indigo (retro sci-fi)
  { title: "Outlive", author: "Peter Attia", isbn: "9780593236598", spineColor: "#1A6B3C" },            // emerald (green health cover)
  { title: "The Gifts of Imperfection", author: "Brene Brown", isbn: "9781592858491", spineColor: "#7B4A5C" }, // dusty rose (warm cover)
  { title: "Unreasonable Hospitality", author: "Will Guidara", isbn: "9780593418574", spineColor: "#7B2D3B" }, // burgundy (red cover)
  { title: "The Obstacle is the Way", author: "Ryan Holiday", isbn: "9781591846352", spineColor: "#8B4513" }, // saddle brown (orange/stoic)
  { title: "This is Water", author: "David Foster Wallace", isbn: "9780316068222", spineColor: "#2C5F7C" },  // ocean blue (blue cover)
  { title: "Four Thousand Weeks", author: "Oliver Burkeman", isbn: "9780374159122", spineColor: "#7C3030" }, // brick red (warm red cover)
  { title: "The Ruthless Elimination of Hurry", author: "John Mark Comer", isbn: "9780525653097", spineColor: "#3B5978" }, // slate blue (calm blue)
  { title: "The Almanack of Naval Ravikant", author: "Eric Jorgenson", isbn: "9781544514215", spineColor: "#2B4570" }, // navy blue (blue/white)
  { title: "Atomic Habits", author: "James Clear", isbn: "9780735211292", spineColor: "#B8860B" },      // dark goldenrod (yellow cover)
  { title: "Range", author: "David Epstein", isbn: "9780735214484", spineColor: "#8B2252" },             // deep pink (colorful cover)
  { title: "Steve Jobs", author: "Walter Isaacson", isbn: "9781451648539", spineColor: "#3A3A3A" },      // charcoal (minimal white/black)
  { title: "Creativity Inc", author: "Ed Catmull", isbn: "9780812993011", spineColor: "#5B2C6F" },      // deep purple (purple cover)
  { title: "Zero to One", author: "Peter Thiel", isbn: "9780804139298", spineColor: "#1A5276" },        // steel blue (blue/white)
  { title: "So Good They Can't Ignore You", author: "Cal Newport", isbn: "9781455509126", spineColor: "#1F4788" }, // cobalt (blue cover)
  { title: "Antifragile", author: "Nassim Nicholas Taleb", isbn: "9780812979688", spineColor: "#1C1C1C" }, // near-black (dark cover)
  { title: "The Black Swan", author: "Nassim Nicholas Taleb", isbn: "9780812973815", spineColor: "#1A4D2E" }, // dark emerald (green/dark)
  { title: "Grit", author: "Angela Duckworth", isbn: "9781501111112", spineColor: "#943126" },          // brick red (red cover)
  { title: "Deep Work", author: "Cal Newport", isbn: "9781455586691", spineColor: "#1A237E" },          // midnight blue (dark blue)
  { title: "The Alchemist", author: "Paulo Coelho", isbn: "9780062315007", spineColor: "#B07D2B" },     // ochre (golden desert)
  { title: "Love Does", author: "Bob Goff", isbn: "9781400203758", spineColor: "#2E86C1" },             // bright blue (blue cover)
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
