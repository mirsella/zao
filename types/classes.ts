import type { Models } from "nuxt-appwrite";

export interface Class extends Models.Document {
  title: string;
  description: string;
  trailer: string;
  tags: string[];
  videos: Video[];
  comments: Comment[];
}

export interface Video extends Models.Document {
  title: string;
  description: string;
  file_id: string;
}

export interface Comment extends Models.Document {
  author_id: string;
  content: string;
  verified: boolean;
  like: number;
}
