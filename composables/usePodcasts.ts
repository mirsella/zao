import type { Pod } from "~";

let call: any = null;
let network = true;

export const usePodcasts = async () => {
  const { database, Query } = useAppwrite();
  const podcasts = useState("podcasts", () => [] as Pod[]);

  if (!podcasts.value.length) {
    try {
      if (!call || network === false)
        call = database.listDocuments("podcasts", "pod", [
          Query.limit(1000),
          Query.orderDesc("$createdAt"),
        ]);
      podcasts.value = (await call).documents as Pod[];
      // FIXME: for dev only
      podcasts.value = [
        ...podcasts.value,
        ...podcasts.value,
        ...podcasts.value,
        ...podcasts.value,
        ...podcasts.value,
      ];
      network = true;
    } catch (e) {
      if ((e as Error).message.includes("NetworkError")) {
        network = false;
      } else {
        showError("Impossible de récupérer les podcasts: " + e);
      }
    }
  }

  return podcasts;
};
