// Categories for articles
export const categories = ['art', 'it', 'games', 'music', 'science', 'sports', 'travel', 'movies', 'other'] as const;

export type Category = (typeof categories)[number];
