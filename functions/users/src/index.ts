import { getCustomer, lemonSqueezySetup } from "@lemonsqueezy/lemonsqueezy.js";
import { Client, Users, Databases, Query } from "node-appwrite";

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

  log(JSON.stringify(req.body));
  log(JSON.stringify(req.headers));

  // if user is created, create it's document in the users collection
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

  lemonSqueezySetup({ apiKey: process.env.LEMONSQUEEZY_API_KEY });
  const user_id = req.headers["x-appwrite-user-id"];
  if (!user_id) {
    throw new Error("missing user id header");
  }

  if (req.method === "GET" && req.path === "/customer_portal") {
    const user = await databases.getDocument("classes", "users", user_id);
    // @ts-ignore we know the users collection has a lemonsqueezy_id field
    const { error, statusCode, data } = await getCustomer(user.lemonsqueezy_id);
    if (error) {
      throw new Error(JSON.stringify(error));
    }
    // https://docs.lemonsqueezy.com/api/customers#retrieve-a-customer
    // res.send(customer.);
    return;
  }

  // change user name
};
