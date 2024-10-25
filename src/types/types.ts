export interface Song {
  genre: string;
  lyrics: string;
  melody: string;
  vocals: {
    male: string;
    female: string;
  };
}

export interface GenerationOptions {
  genre: string;
  theme: string;
  mood: string;
}