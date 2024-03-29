import { getCustomer, lemonSqueezySetup } from "@lemonsqueezy/lemonsqueezy.js";
import { Client, Users, Databases, Query } from "node-appwrite";

type Context = {
  req: any;
  res: any;
  log: (msg: any) => void;
  error: (msg: any) => void;
};

export default async ({ req, res, log, error }: Context) => {
  log(JSON.stringify(req.body));
  log(JSON.stringify(req.headers));

  if (
    !process.env.APPWRITE_FUNCTION_PROJECT_ID ||
    !process.env.APPWRITE_API_KEY ||
    !process.env.LEMONSQUEEZY_API_KEY
  ) {
    throw new Error("missings env variables");
  }

  const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);
  const databases = new Databases(client);
  const users = new Users(client);

  // if user is created, create it's document in the users collection
  if (req.headers["x-appwrite-trigger"] === "event") {
    const userid = (req.headers["x-appwrite-event"] as string).match(
      /users\.(.+)\.create/,
    )?.[1];
    if (!userid) {
      throw new Error("event wasn't user.*.create");
    }
    let name = "";
    while (true) {
      name = `anonyme-${Math.floor(Math.random() * 1_000_000_000)}`;
      let res = await databases.listDocuments("classes", "users", [
        Query.equal("name", [name]),
      ]);
      if (res.total === 0) break;
    }
    const doc = await databases.createDocument("classes", "users", userid, {
      name,
    });
    log(`created document ${JSON.stringify(doc)} for user ${userid}`);
    return res.empty();
  }

  const user_id = req.headers["x-appwrite-user-id"];
  if (!user_id) {
    res.send("no user id");
  }

  if (req.method === "GET" && req.path === "/customer_portal") {
    const user = await databases.getDocument("classes", "users", user_id);
    lemonSqueezySetup({ apiKey: process.env.LEMONSQUEEZY_API_KEY });
    // @ts-ignore we know the users collection has a lemonsqueezy_id field
    const { error, statusCode, data } = await getCustomer(user.lemonsqueezy_id);
    if (error) {
      throw new Error(JSON.stringify(error));
    }
    log(`got lemonsqueezy customer for ${user_id}: ${data}`);
    return res.send(data?.data.attributes.urls.customer_portal);
  }

  if (req.method === "PUT" && req.path === "/name") {
    const name = req.body.name;
    if (!name) {
      res.send("no name in body");
    }
    const withName = await databases.listDocuments("classes", "users", [
      Query.equal("name", [name]),
    ]);
    if (withName.total > 0) {
      res.send("name already taken");
    }
    await databases.updateDocument("classes", "users", user_id, { name });
    await users.updateName(user_id, name);
    log(`updated name for ${user_id} to ${name}`);
    return res.send("ok");
  }

  res.send("not found");
};
