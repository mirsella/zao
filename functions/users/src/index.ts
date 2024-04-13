import {
  createCheckout,
  getCustomer,
  lemonSqueezySetup,
} from "@lemonsqueezy/lemonsqueezy.js";
import {
  Client,
  Users,
  Databases,
  Query,
  Permission,
  Models,
  Role,
  ID,
} from "node-appwrite";

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
  log(JSON.stringify(req.url));
  log(JSON.stringify(req.body));
  log(JSON.stringify(req.headers));

  if (
    !process.env.APPWRITE_FUNCTION_PROJECT_ID ||
    !process.env.APPWRITE_API_KEY ||
    !process.env.LEMONSQUEEZY_API_KEY
  ) {
    throw new Error("missings env variables");
  }

  const userid = req.headers["x-appwrite-user-id"];
  if (!userid) {
    res.send("no user id", 400);
  }

  const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);
  const databases = new Databases(client);
  const users = new Users(client);
  lemonSqueezySetup({ apiKey: process.env.LEMONSQUEEZY_API_KEY });

  if (req.path === "/customer_portal") {
    const user = (await databases.getDocument(
      "classes",
      "users",
      userid,
    )) as User;
    if (user.lemonsqueezy_id) {
      log(
        `getting lemonsqueezy customer for ${userid}, with lemonsqueezy_id ${user.lemonsqueezy_id}`,
      );
      const { error, data } = await getCustomer(user.lemonsqueezy_id);
      if (error) {
        throw new Error(JSON.stringify(error));
      }
      log(`got lemonsqueezy customer for ${userid}: ${data}`);
      return res.send(data?.data.attributes.urls.customer_portal);
    } else {
      log(`no lemonsqueezy customer for ${userid}`);
      const { storeid, variantid } = req.body;
      if (!storeid || !variantid) {
        return res.send("missing storeid or variantid in body", 400);
      }
      const authuser = await users.get(userid);
      const { error, data } = await createCheckout(storeid, variantid, {
        checkoutData: {
          email: authuser.email,
          name: user.name,
          billingAddress: { country: "FR" },
        },
      });
      if (error) {
        throw new Error(JSON.stringify(error));
      }
      log(`created lemonsqueezy checkout for ${userid}`);
      return res.send(data?.data.attributes.url);
    }
  }

  if (req.path === "/name") {
    const { name } = req.body;
    if (!name) {
      res.send("no name in query", 400);
    }
    const withName = await databases.listDocuments("classes", "users", [
      Query.equal("name", [name]),
    ]);
    if (withName.total > 0) {
      res.send("name already taken", 409);
    }
    await databases.updateDocument("classes", "users", userid, { name });
    await users.updateName(userid, name);
    log(`updated name for ${userid} to ${name}`);
    return res.send("ok");
  }

  if (req.path === "/comment") {
    const authuser = await users.get(userid);
    if (!authuser.labels.includes("premium")) {
      return res.send("not authorized", 403);
    }
    const { classid, content } = req.body;
    if (!classid || !content) {
      return res.send("missing classid or content in body", 400);
    }
    const current_comments: any = await databases.getDocument(
      "classes",
      "class",
      classid,
      // [Query.select(["comments"])],
    );
    const comment_id = ID.unique();
    log("creating comment with id " + comment_id);
    const response: any = await databases.updateDocument(
      "classes",
      "class",
      classid,
      {
        comments: [
          ...current_comments.comments.map((c: any) => c.$id),
          {
            $id: comment_id,
            user: userid,
            content,
            verified: false,
            $permissions: [Permission.delete(Role.user(userid))],
          },
        ],
      },
    );
    log("response: " + response);
    const comment = response.comments.find((c: any) => c.$id === comment_id);
    log("created comment: " + comment);
    res.send(comment);
  }

  res.send("not found", 404);
};
