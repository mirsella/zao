import { Client, Users, Databases, Query, ID, Models } from "node-appwrite";

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

  if (req.method !== "POST") {
    return res.send("only supporting POST", 405);
  }
  if (
    req.headers["x-event-name"] !== "subscription_updated" ||
    req.body.meta.event_name !== "subscription_updated"
  ) {
    return res.send("only supporting subscription_updated event", 405);
  }

  const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);
  const users = new Users(client);
  const databases = new Databases(client);

  const email = req.body.data.attributes.user_email;
  let userslist = await users.list([Query.equal("email", email)]);
  let user: Models.User<Models.Preferences>;
  if (userslist.total === 1) {
    user = userslist.users[0];
  } else if (userslist.total === 0) {
    user = await users.create(ID.unique(), email);
    // wait for the user to be created in the `users` collection by the users functions
    log("waiting for the users document to be created");
    while (true) {
      try {
        await databases.getDocument("classes", "users", user.$id);
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
  if (req.body.data.attributes.status === "active") {
    labels.push("premium");
    await databases.updateDocument("classes", "users", user.$id, {
      lemonsqueezy_id: req.body.data.attributes.customer_id,
    });
    await users.updateLabels(user.$id, labels);
  } else if (req.body.data.attributes.status === "expired") {
    labels.splice(labels.indexOf("premium"), 1);
    await users.updateLabels(user.$id, labels);
  }
  log(
    `User ${req.headers["x-appwrite-user-id"]} updated labels: ${labels} becauses of subscription status: ${req.body.data.attributes.status}`,
  );
};
