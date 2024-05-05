import type { Class } from "~";

let call: any = null;
export const useClasses = async () => {
  const { database, Query } = useAppwrite();
  const query = () =>
    database.listDocuments("classes", "class", [Query.limit(1000)]);
  const classes = useState("classes", () => [] as Class[]);
  try {
    if (!classes.value.length) {
      if (!call) call = query();
      const res = await call;
      classes.value = res.documents as Class[];
    }
  } catch (e) {
    showError("Impossible de récupérer les classes: " + e);
  }
  return classes;
};
