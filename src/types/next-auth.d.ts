import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    username: string;
    favorites: {
      movies: string[];
      series: string[];
      books: string[];
      songs: string[];
    };
    searchHistory: Array<{
      query: string;
      filters?: {
        genre?: string[];
        language?: string[];
        yearRange?: { start: number; end: number };
        imdbRating?: number;
      };
      timestamp: Date;
    }>;
  }

  interface Session {
    user: {
      id: string;
      username: string;
      email: string;
      favorites: {
        movies: string[];
        series: string[];
        books: string[];
        songs: string[];
      };
      searchHistory: Array<{
        query: string;
        filters?: {
          genre?: string[];
          language?: string[];
          yearRange?: { start: number; end: number };
          imdbRating?: number;
        };
        timestamp: Date;
      }>;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
    email: string;
    favorites: {
      movies: string[];
      series: string[];
      books: string[];
      songs: string[];
    };
    searchHistory: Array<{
      query: string;
      filters?: {
        genre?: string[];
        language?: string[];
        yearRange?: { start: number; end: number };
        imdbRating?: number;
      };
      timestamp: Date;
    }>;
  }
}
