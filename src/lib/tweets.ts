// Extract tweet IDs from content for embedding
// Matches both twitter.com and x.com URLs

const TWEET_URL_REGEX =
  /https?:\/\/(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/g;

export interface TweetMatch {
  url: string;
  id: string;
}

export function extractTweetUrls(html: string): TweetMatch[] {
  const matches: TweetMatch[] = [];
  let match;

  while ((match = TWEET_URL_REGEX.exec(html)) !== null) {
    matches.push({
      url: match[0],
      id: match[1],
    });
  }

  // Reset regex state
  TWEET_URL_REGEX.lastIndex = 0;

  return matches;
}

export function isTweetUrl(url: string): string | null {
  const match = url.match(
    /https?:\/\/(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/
  );
  return match ? match[1] : null;
}
