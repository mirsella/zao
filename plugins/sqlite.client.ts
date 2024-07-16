import {
  CapacitorSQLite,
  SQLiteConnection,
  SQLiteDBConnection,
} from "@capacitor-community/sqlite";
import { Buffer } from "buffer";
import type { SQLitePod, Pod } from "~";
import { JeepSqlite } from "jeep-sqlite/dist/components/jeep-sqlite";
customElements.define("jeep-sqlite", JeepSqlite);
// https://github.com/capacitor-community/sqlite/blob/master/docs/Web-Usage.md

export default defineNuxtPlugin(async (nuxtApp) => {
  const sqlite = new SQLiteConnection(CapacitorSQLite);

  // Function to initialize SQLite
  const initializeSQLite = async () => {
    if (!isNative()) {
      // Create the 'jeep-sqlite' Stencil component
      const jeepSqlite = document.createElement("jeep-sqlite");
      jeepSqlite.autoSave = true;
      document.body.appendChild(jeepSqlite);
      await customElements.whenDefined("jeep-sqlite");
      // Initialize the Web store
      await sqlite.initWebStore();
    }

    const db: SQLiteDBConnection = await sqlite.createConnection(
      "podcasts",
      false,
      "no-encryption",
      1,
      false,
    );
    await db.open();
    await db.execute(`
      CREATE TABLE IF NOT EXISTS podcasts (
        id TEXT PRIMARY KEY,
        data BLOB NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        key_points TEXT NOT NULL
      );
    `);

    return db;
  };

  let db: SQLiteDBConnection;
  onMounted(async () => {
    db = await initializeSQLite();
  });

  return {
    provide: {
      storePodcast: async (url: string, pod: Pod) => {
        if (!db) {
          throw new Error("Database is not initialized yet");
        }

        const blob = await (
          await fetch(url, { credentials: "include" })
        ).blob();
        if (blob.type !== "audio/mp3") {
          return Promise.reject(
            new Error("only supporting audio/mp3 podcast: " + blob.type),
          );
        }
        const imageBuffer = Buffer.from(
          new Uint8Array(await blob.arrayBuffer()),
        );
        const ret = await db.run(
          "INSERT INTO podcasts (id, data, title, description, key_points) VALUES (?, ?, ?, ?, ?)",
          [pod.$id, imageBuffer, pod.title, pod.key_points, pod.description],
        );
        if (ret.changes?.changes !== 1) {
          return Promise.reject(new Error("WriteImage failed"));
        }
        return ret.changes?.values;
      },
      getPodcasts: async (): Promise<SQLitePod[]> => {
        if (!db) {
          throw new Error("Database is not initialized yet");
        }

        const ret = await db.query("SELECT * FROM podcasts");
        for (let podcast of ret.values!) {
          const arr = new Uint8Array(podcast.data);
          const blob = new Blob([arr], { type: "audio/mp3" });
          podcast.data = URL.createObjectURL(blob);
        }
        return ret.values as SQLitePod[];
      },
      podcastExist: async (id: string): Promise<boolean> => {
        if (!db) {
          throw new Error("Database is not initialized yet");
        }

        const ret = await db.query("SELECT id FROM podcasts WHERE id = ?", [
          id,
        ]);
        return ret.values?.length !== 0;
      },
      deletePodcast: async (id: string) => {
        if (!db) {
          throw new Error("Database is not initialized yet");
        }

        await db.run("DELETE FROM podcasts WHERE id = ?", [id]);
      },
    },
  };
});
