// Book data and platform generation for Book Platformer

import type { BookPlatform } from './types';
import { GAME_CONFIG, BOOK_COLORS } from './physics';

export interface BookData {
  title: string;
  author: string;
  amazonUrl?: string;
}

// The 28 books from the user's reading list
export const BOOKS_DATA: BookData[] = [
  { title: "Abundance", author: "Peter Diamandis" },
  { title: "The Accidental President", author: "A.J. Baime" },
  { title: "Chip War", author: "Chris Miller" },
  { title: "The Psychology of Money", author: "Morgan Housel" },
  { title: "Elon Musk", author: "Walter Isaacson" },
  { title: "The Smartest Guys in the Room", author: "Bethany McLean" },
  { title: "Ready Player One", author: "Ernest Cline" },
  { title: "Outlive", author: "Peter Attia" },
  { title: "The Gifts of Imperfection", author: "Brene Brown" },
  { title: "Unreasonable Hospitality", author: "Will Guidara" },
  { title: "The Obstacle is the Way", author: "Ryan Holiday" },
  { title: "This is Water", author: "David Foster Wallace" },
  { title: "Four Thousand Weeks", author: "Oliver Burkeman" },
  { title: "The Ruthless Elimination of Hurry", author: "John Mark Comer" },
  { title: "The Almanack of Naval Ravikant", author: "Eric Jorgenson" },
  { title: "Atomic Habits", author: "James Clear" },
  { title: "Range", author: "David Epstein" },
  { title: "Steve Jobs", author: "Walter Isaacson" },
  { title: "Creativity Inc", author: "Ed Catmull" },
  { title: "Zero to One", author: "Peter Thiel" },
  { title: "So Good They Can't Ignore You", author: "Cal Newport" },
  { title: "Antifragile", author: "Nassim Nicholas Taleb" },
  { title: "The Black Swan", author: "Nassim Nicholas Taleb" },
  { title: "Grit", author: "Angela Duckworth" },
  { title: "Deep Work", author: "Cal Newport" },
  { title: "The Alchemist", author: "Paulo Coelho" },
  { title: "Love Does", author: "Bob Goff" },
];

// Generate platform positions for books
export function generatePlatforms(
  startX: number,
  groundY: number
): BookPlatform[] {
  const platforms: BookPlatform[] = [];
  let currentX = startX;

  // Create varied height patterns
  const heightPatterns = [
    [0.6, 0.5, 0.4, 0.5, 0.6], // Valley
    [0.4, 0.5, 0.6, 0.5, 0.4], // Hill
    [0.5, 0.4, 0.5, 0.6, 0.5], // Zigzag
    [0.4, 0.4, 0.5, 0.5, 0.6], // Ascending
    [0.6, 0.5, 0.5, 0.4, 0.4], // Descending
  ];

  BOOKS_DATA.forEach((book, index) => {
    const patternIndex = Math.floor(index / 5) % heightPatterns.length;
    const positionInPattern = index % 5;
    const heightMultiplier = heightPatterns[patternIndex][positionInPattern];

    // Calculate Y position (higher multiplier = higher platform from ground)
    const maxHeight = groundY - GAME_CONFIG.BOOK_HEIGHT - 50;
    const minHeight = groundY - GAME_CONFIG.BOOK_HEIGHT - 250;
    const y = groundY - GAME_CONFIG.BOOK_HEIGHT - (maxHeight - minHeight) * heightMultiplier - 50;

    // Vary spacing between books
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

// Fetch book cover from Google Books API
export async function fetchBookCover(
  title: string,
  author: string
): Promise<string | null> {
  try {
    const query = encodeURIComponent(`${title} ${author}`);
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=1`
    );

    if (!response.ok) return null;

    const data = await response.json();

    if (data.items && data.items.length > 0) {
      const volumeInfo = data.items[0].volumeInfo;
      if (volumeInfo.imageLinks) {
        // Prefer larger images, fall back to thumbnail
        return (
          volumeInfo.imageLinks.medium ||
          volumeInfo.imageLinks.small ||
          volumeInfo.imageLinks.thumbnail
        )?.replace('http://', 'https://');
      }
    }

    return null;
  } catch (error) {
    console.warn(`Failed to fetch cover for ${title}:`, error);
    return null;
  }
}

// Batch fetch book covers with rate limiting
export async function fetchAllBookCovers(
  books: BookData[],
  batchSize: number = 5,
  delayMs: number = 200
): Promise<Map<string, string>> {
  const covers = new Map<string, string>();

  for (let i = 0; i < books.length; i += batchSize) {
    const batch = books.slice(i, i + batchSize);

    const results = await Promise.all(
      batch.map(async (book) => {
        const cover = await fetchBookCover(book.title, book.author);
        return { title: book.title, cover };
      })
    );

    results.forEach(({ title, cover }) => {
      if (cover) {
        covers.set(title, cover);
      }
    });

    // Add delay between batches to avoid rate limiting
    if (i + batchSize < books.length) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }

  return covers;
}

// Get Amazon search URL for a book
export function getAmazonSearchUrl(title: string, author: string): string {
  const query = encodeURIComponent(`${title} ${author}`);
  return `https://www.amazon.com/s?k=${query}&i=stripbooks`;
}
