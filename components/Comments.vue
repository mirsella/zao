<script setup lang="ts">
import type { Comment } from "~";

const { database, functions } = useAppwrite();

const user = await useAccount();
const premium = computed(() => user.value?.labels.includes("premium"));
const props = defineProps<{ comments: Comment[]; classid: string }>();

const comments = computed(() => {
  const c = props.comments
    .filter((c) => c.verified || c.user.$id === user.value?.$id)
    .sort((a, b) => {
      // put self comments first, then sort by date
      if (a.user.$id !== b.user.$id) {
        if (a.user.$id === user.value?.$id) return -1;
        else if (b.user.$id === user.value?.$id) return 1;
      }
      return (
        new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime()
      );
    });
  return c;
});

const newcomment = ref("");
const postLoading = ref(false);
async function postComment() {
  postLoading.value = true;
  try {
    const res = await functions.createExecution(
      "users",
      JSON.stringify({ classid: props.classid, content: newcomment.value }),
      false,
      "/comment",
      "POST",
      { "Content-Type": "application/json" },
    );
    if (res.responseStatusCode !== 200) {
      throw new Error(res.responseBody);
    }
    const comment = JSON.parse(res.responseBody);
    props.comments.push(comment);
    newcomment.value = "";
  } catch (e) {
    console.error(e);
    showError("impossible de poster le commentaire: " + e);
  } finally {
    postLoading.value = false;
  }
}

function deleteComment(id: string) {
  try {
    database.deleteDocument("classes", "comment", id);
    props.comments.splice(
      props.comments.findIndex((c) => c.$id === id),
      1,
    );
  } catch (e) {
    console.error(e);
    showError("impossible de supprimer le commentaire: " + e);
  }
}
</script>
<template>
  <div class="mx-auto">
    <div class="grid" v-if="premium">
      <textarea
        class="textarea !w-full bg-base-300 mx-auto"
        placeholder="Commentaire..."
        v-model="newcomment"
        maxlength="1024"
      ></textarea>
      <button
        @click="postComment()"
        class="my-4 justify-self-end btn btn-accent"
        :class="newcomment.length === 0 && 'btn-disabled'"
      >
        <span v-if="!postLoading"> Poster </span>
        <span v-else class="loading"> </span>
      </button>
    </div>
    <div
      :data="comment"
      v-for="comment of comments"
      class="bg-base-200 my-2 p-2 rounded-md card card-compact prose mx-auto"
    >
      <div class="card-title">
        <span class="font-normal">auteur:</span>
        <span
          class="grow font-medium"
          :class="{ 'font-semibold': comment.user.name === user?.name }"
        >
          {{ comment.user.name }}
        </span>
        <span class="font-medium">
          {{ new Date(comment.$createdAt).toLocaleDateString() }}
        </span>
      </div>
      <div class="card-body">{{ comment.content }}</div>
      <div class="card-actions justify-end">
        <span
          class="italic text-sm my-auto m-2 tooltip"
          v-if="!comment.verified"
          data-tip="votre commentaire sera vérifié par un modérateur avant d'être affiché publiquement, afin eviter les spam et contenu inapproprié."
          >en attente de vérification</span
        >
        <button
          v-if="comment.user.$id === user?.$id"
          @click="deleteComment(comment.$id)"
          class="btn bg-error i-carbon-trash-can btn-sm"
        ></button>
      </div>
    </div>
  </div>
</template>
