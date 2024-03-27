import { Client, Users } from "node-appwrite";

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
    !process.env.LEMONSQUEEZY_SECRET
  ) {
    throw new Error("missings env variables");
  }

  const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);
  const users = new Users(client);

  if (req.method !== "POST") {
    return res.send("only supporting POST", 405);
  }
  if (
    req.headers["x-event-name"] !== "subscription_updated" ||
    req.body.meta.event_name !== "subscription_updated"
  ) {
    return res.send("only supporting subscription_updated event", 405);
  }

  log(JSON.stringify(req.body));
};
