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
      "user",
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
      const response = await createCheckout(storeid, variantid, {
        checkoutData: {
          email: authuser.email,
          name: user.name,
          billingAddress: { country: "FR" },
        },
      });
      console.log(response);
      if (response.error) {
        throw new Error(JSON.stringify(error));
      }
      log(`created lemonsqueezy checkout for ${userid}`);
      return res.send(response.data?.data.attributes.url);
    }
  }

  if (req.path === "/name") {
    const { name } = req.body;
    if (!name) {
      res.send("no name in query", 400);
    }
    const withName = await databases.listDocuments("classes", "user", [
      Query.equal("name", [name]),
    ]);
    if (withName.total > 0) {
      res.send("name already taken", 409);
    }
    await databases.updateDocument("classes", "user", userid, { name });
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
    const new_comment: any = await databases.createDocument(
      "classes",
      "comment",
      ID.unique(),
      {
        user: userid,
        content,
        verified: false,
        class: classid,
      },
      [Permission.delete(Role.user(userid))],
    );
    // const cl: any = await databases.getDocument("classes", "class", classid);
    // await databases.updateDocument("classes", "class", classid, {
    //   comments: [...cl.comments.map((c: any) => c.$id), new_comment.$id],
    // });
    return res.send(new_comment);
  }

  return res.send("not found", 404);
};
