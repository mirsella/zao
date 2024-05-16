import type { Class } from "~";

let call: any = null;
let network = true;

export const useClasses = async () => {
  const { database, Query } = useAppwrite();
  const classes = useState("classes", () => [] as Class[]);

  if (!classes.value.length) {
    try {
      if (!call || network === false)
        call = database.listDocuments("classes", "class", [Query.limit(1000)]);
      classes.value = (await call).documents as Class[];
      network = true;
    } catch (e) {
      if ((e as Error).message.includes("NetworkError")) {
        network = false;
      } else {
        showError("Impossible de récupérer les classes: " + e);
      }
    }
  }

  return classes;
};
