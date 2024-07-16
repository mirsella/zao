import {
  Client,
  Users,
  Databases,
  Query,
  ID,
  type Models,
} from "node-appwrite";
import crypto from "crypto";

type Context = {
  req: any;
  res: any;
  log: (msg: any) => void;
  error: (msg: any) => void;
};

function is_signature_valid(rawbody: string, xsignature: string): boolean {
  const secret = process.env.LEMONSQUEEZY_SECRET;
  const hmac = crypto.createHmac("sha256", secret || "");
  const digest = Buffer.from(hmac.update(rawbody).digest("hex"), "utf8");
  const signature = Buffer.from(xsignature || "", "utf8");

  return crypto.timingSafeEqual(digest, signature);
}

export default async ({ req, res, log, error }: Context) => {
  log(JSON.stringify(req.body));
  log(JSON.stringify(req.headers));

  if (
    !process.env.APPWRITE_FUNCTION_PROJECT_ID ||
    !process.env.APPWRITE_API_KEY ||
    !process.env.LEMONSQUEEZY_SECRET
  ) {
    throw new Error("missings env variables");
  }

  if (req.method !== "POST") {
    return res.send("only supporting POST", 405);
  }
  if (
    req.headers["x-event-name"] !== "subscription_updated" ||
    req.body.meta.event_name !== "subscription_updated"
  ) {
    return res.send("only supporting subscription_updated event", 405);
  }

  if (!is_signature_valid(req.bodyRaw, req.headers["x-signature"])) {
    error("invalid signature");
    return res.send("invalid signature", 403);
  }
  log("signature is valid");

  const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);
  const users = new Users(client);
  const databases = new Databases(client);

  const email = req.body.data.attributes.user_email;
  let userslist = await users.list([Query.equal("email", [email])]);
  log("userlist:" + JSON.stringify(userslist));
  let user: Models.User<Models.Preferences>;
  if (userslist.total === 1) {
    user = userslist.users[0];
  } else if (userslist.total === 0) {
    user = await users.create(ID.unique(), email);
    // wait for the user to be created in the `users` collection by the users functions
    log("waiting for the users document to be created");
    while (true) {
      try {
        await databases.getDocument("podcasts", "user", user.$id);
        break;
      } catch {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }
  } else {
    throw new Error("multiple users with same email");
  }
  log("finished retrieving/creating the user");

  let labels = user.labels;
  const status = req.body.data.attributes.status;
  if (status === "active") {
    labels.push("premium");
    await databases.updateDocument("podcasts", "user", user.$id, {
      lemonsqueezy_id: req.body.data.attributes.customer_id.toString(),
    });
    await users.updateLabels(user.$id, labels);
  } else if (status === "expired") {
    labels = labels.filter((label) => label !== "premium");
    await users.updateLabels(user.$id, labels);
  }
  const message = `Authuser ${user.$id} updated labels: '${labels}' becauses of subscription status: ${status}`;
  log(message);
  return res.send(message);
};
