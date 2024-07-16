import { Client, Users, Databases, Query, type Models } from "node-appwrite";

interface Context {
  req: any;
  res: any;
  log: (msg: any) => void;
  error: (msg: any) => void;
}

interface User extends Models.Document {
  lemonsqueezy_id?: string;
  name: string;
}

export default async ({ req, res, log, error }: Context) => {
  log(JSON.stringify(req.body));
  log(JSON.stringify(req.headers));

  if (
    !process.env.APPWRITE_FUNCTION_PROJECT_ID ||
    !process.env.APPWRITE_API_KEY
  ) {
    throw new Error("missings env variables");
  }

  if (
    req.headers["x-appwrite-trigger"] !== "event" ||
    !req.headers["x-appwrite-event"]
  ) {
    throw new Error("not an event");
  }

  const match = (req.headers["x-appwrite-event"] as string).match(
    /users\.(.+)\.(create|update|delete)/,
  )!;
  log("match: " + match);
  const userid = match[1];
  const event = match[2];
  if (!userid || !event) {
    throw new Error("invalid event");
  }

  const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);
  const databases = new Databases(client);
  const users = new Users(client);

  if (event === "create") {
    let name = "";
    while (true) {
      name = `anonyme-${Math.floor(Math.random() * 1_000_000_000)}`;
      let res = await databases.listDocuments("podcasts", "user", [
        Query.equal("name", [name]),
      ]);
      if (res.total === 0) break;
    }
    const doc = await databases.createDocument("podcasts", "user", userid, {
      name,
    });
    await users.updateName(userid, name);
    log(`created document ${JSON.stringify(doc)} for user ${userid}`);
  } else if (event === "delete") {
    await databases.deleteDocument("podcasts", "user", userid);
    log(`deleted document for user ${userid}`);
  } else if (event === "update") {
    const user = (await databases.getDocument(
      "podcasts",
      "user",
      userid,
    )) as User;
    const authuser = await users.get(userid);
    if (authuser.name !== user.name) {
      await users.updateName(userid, user.name);
      log(`updated document for user ${userid} with name ${user.name}`);
    }
  } else {
    throw new Error("event didn't match any case");
  }

  return res.empty();
};
