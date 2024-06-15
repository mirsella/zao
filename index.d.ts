import type { Models } from "nuxt-appwrite";

export interface Pod extends Models.Document {
  title: string;
  description: string;
  type: "daily" | "capsule";
  tags: string[];
  key_points: string[];
  poster_id: string;
  file_id: string;
}

export interface SQLitePod {
  id: string;
  data: string;
  title: string;
  description: string;
  key_points: string[];
}
