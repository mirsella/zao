import {
  CapacitorSQLite,
  SQLiteConnection,
  SQLiteDBConnection,
} from "@capacitor-community/sqlite";
import { Buffer } from "buffer";
import type { SQLiteVideo, Video } from "~";
import {
  defineCustomElements as jeepDefineCustomElements,
  applyPolyfills,
} from "jeep-sqlite/loader";

// TODO: https://github.com/capacitor-community/sqlite/blob/master/docs/Web-Usage.md

const sqlite = new SQLiteConnection(CapacitorSQLite);

export default defineNuxtPlugin(async () => {
  if (!useMobile()) {
    // FIXME: this is only for dev, later we don't need sqlite on web platform
    // return {};
    applyPolyfills().then(() => {
      jeepDefineCustomElements(window);
    });
    // Create the 'jeep-sqlite' Stencil component
    const jeepSqlite = document.createElement("jeep-sqlite");
    document.body.appendChild(jeepSqlite);
    await customElements.whenDefined("jeep-sqlite");
    // Initialize the Web store
    await sqlite.initWebStore();
  }

  const db: SQLiteDBConnection = await sqlite.createConnection(
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

  // https://github.com/capacitor-community/sqlite/blob/master/docs/SQLiteBlob.md
  return {
    provide: {
      storeVideo: async (url: string, video: Video) => {
        const blob = await (await fetch(url)).blob();
        const imageBuffer = Buffer.from(
          new Uint8Array(await blob.arrayBuffer()),
        );
        const ret = await db.run(
          "INSERT INTO videos (id, data, video_title) VALUES (?, ?, ?)",
          [video.$id, imageBuffer, video.title],
        );
        console.log(ret);
        if (ret.changes?.changes !== 1) {
          return Promise.reject(new Error("WriteImage failed"));
        }
        return ret.changes?.values;
      },

      // getVideoData: async (id: string): Promise<SQLiteVideo | null> => {
      //   const result = await db.query(`SELECT * FROM videos WHERE id = ?`, [
      //     id,
      //   ]);
      //   console.log(result);
      //   return result.values?.[0] as SQLiteVideo;
      // },

      getVideos: async (): Promise<SQLiteVideo[]> => {
        // TODO:
        return [];
      },
      deleteVideo: async (id: string) => {
        // TODO:
      },
    },
  };
});
