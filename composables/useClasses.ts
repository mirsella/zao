export const useClasses = async () => {
  const { database, Query } = useAppwrite();
  const classes = useState("classes", () => [] as Class[]);
  await callOnce(async () => {
    try {
      classes.value = (
        await database.listDocuments("classes", "class", [Query.limit(1000)])
      ).documents as Class[];
    } catch (e: any) {
      showError(e);
    }
  });
  return classes;
};
