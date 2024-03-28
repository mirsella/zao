import {
  createCustomer,
  lemonSqueezySetup,
} from "@lemonsqueezy/lemonsqueezy.js";
import { Client, Users, Databases, Query } from "node-appwrite";
import { isJSDocFunctionType } from "typescript";

type Context = {
  req: any;
  res: any;
  log: (msg: any) => void;
  error: (msg: any) => void;
};

export default async ({ req, res, log, error }: Context) => {
  if (
    !process.env.APPWRITE_FUNCTION_PROJECT_ID ||
    !process.env.APPWRITE_API_KEY ||
    !process.env.LEMONSQUEEZY_SECRET ||
    !process.env.LEMONSQUEEZY_API_KEY
  ) {
    throw new Error("missings env variables");
  }

  const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);
  const databases = new Databases(client);
  lemonSqueezySetup({ apiKey: process.env.LEMONSQUEEZY_API_KEY });

  log(JSON.stringify(req.body));
  log(JSON.stringify(req.headers));

  if (req.headers["x-appwrite-event"] === "users.*.create") {
    let name = "";
    while (true) {
      name = `anonyme-${Math.floor(Math.random() * 1_000_000_000)}`;
      let res = await databases.listDocuments("classes", "users", [
        Query.equal("name", name),
      ]);
      if (res.total === 0) break;
    }
    databases.createDocument(
      "classes",
      "users",
      req.headers["x-appwrite-user-id"],
      { name },
    );
    return;
  }

  // request lm customer page

  // change user name
};
