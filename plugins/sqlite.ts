import {
  CapacitorSQLite,
  SQLiteConnection,
  SQLiteDBConnection,
} from "@capacitor-community/sqlite";
import type { SQLiteVideo, Video } from "~";

const sqlite = new SQLiteConnection(CapacitorSQLite);

export default defineNuxtPlugin(async () => {
  if (!useMobile()) return {};

  let db: SQLiteDBConnection;
  try {
    db = await sqlite.createConnection(
      "video",
      false,
      "no-encryption",
      1,
      false,
    );
    await db.open();
    await db.execute(`
      CREATE TABLE IF NOT EXISTS videos (
        id TEXT PRIMARY KEY,
        data BLOB NOT NULL,
        video_title TEXT NOT NULL
      );
    `);
  } catch (e) {
    console.error(e);
  }

  return {
    provide: {
      storeVideo: async (url: string, video: Video) => {
        const response = await fetch(url);
        const blob = await response.blob();
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = async function () {
          const base64data = reader.result;
          console.log("storing a video", typeof base64data);
          const change = await db.executeSet([
            {
              statement: `INSERT INTO videos (id, data, video_title) VALUES (?, ?, ?)`,
              values: [video.$id, base64data, video.title],
            },
          ]);
          console.log(change);
        };
        console.log("returning from storeVideo");
      },

      getVideo: async (id: string): Promise<SQLiteVideo | null> => {
        const result = await db.query(`SELECT * FROM videos WHERE id = ?`, [
          id,
        ]);
        console.log(result);
        return result.values?.[0] as SQLiteVideo;
      },
    },
  };
});
