import type { Models } from "nuxt-appwrite";

export interface Pod extends Models.Document {
  title: string;
  description: string;
  tags: string[];
  key_points: string[];
  poster: string;
  file_id: string;
  type: "history" | "mental";
}

export interface SQLitePod {
  id: string;
  data: string;
  title: string;
  key_points: string[];
  description: string;
}
