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
  // FIXME: this is only for dev, later we don't need sqlite on web platform
  applyPolyfills().then(() => {
    jeepDefineCustomElements(window);
  });
  // Create the 'jeep-sqlite' Stencil component
  const jeepSqlite = document.createElement("jeep-sqlite");
  jeepSqlite.autoSave = true;
  document.body.appendChild(jeepSqlite);
  await customElements.whenDefined("jeep-sqlite");
  // Initialize the Web store
  await sqlite.initWebStore();

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
        console.log("storeVideo: fetching video at", url);
        const blob = await (
          await fetch(url, { credentials: "include" })
        ).blob();
        console.log("blob", blob.type, blob.text, blob.size);
        if (blob.type !== "video/mp4") {
          return Promise.reject(
            new Error("only supporting mp4 video: " + blob.type),
          );
        }
        const imageBuffer = Buffer.from(
          new Uint8Array(await blob.arrayBuffer()),
        );
        const ret = await db.run(
          "INSERT INTO videos (id, data, video_title) VALUES (?, ?, ?)",
          [video.$id, imageBuffer, video.title],
        );
        console.log("storeVideo", ret);
        if (ret.changes?.changes !== 1) {
          return Promise.reject(new Error("WriteImage failed"));
        }
        return ret.changes?.values;
      },
      getVideos: async (): Promise<SQLiteVideo[]> => {
        const ret = await db.query("SELECT * FROM videos");
        console.log("getVideos", ret);
        for (let video of ret.values!) {
          const arr = new Uint8Array(video.data);
          const blob = new Blob([arr], { type: "mp4" });
          video.data = URL.createObjectURL(blob);
        }
        return ret.values as SQLiteVideo[];
      },
      videoExist: async (id: string): Promise<boolean> => {
        const ret = await db.query("SELECT id FROM videos WHERE id = ?", [id]);
        if (ret.values?.length === 0) {
          return false;
        } else {
          return true;
        }
      },
      deleteVideo: async (id: string) => {
        const ret = await db.run("DELETE FROM videos WHERE id = ?", [id]);
        console.log("deleteVideo", ret);
      },
    },
  };
});
