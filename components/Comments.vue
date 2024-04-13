<script setup lang="ts">
import type { Comment } from "~/utils/databases";
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
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
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
  <div>
    <div class="max-w-6xl grid" v-if="premium">
      <textarea
        class="textarea !w-full bg-base-300"
        placeholder="Commentaire..."
        v-model="newcomment"
      ></textarea>
      <button
        @click="postComment()"
        class="m-4 justify-self-end btn px-8 btn-accent"
        :class="newcomment.length === 0 && 'btn-disabled'"
      >
        <span v-if="!postLoading"> Poster </span>
        <span v-else class="loading"> </span>
      </button>
    </div>
    <div
      :data="comment"
      v-for="comment of comments"
      class="bg-base-200 my-2 p-2 rounded-md card card-compact"
    >
      <div class="card-title">
        <span class="font-normal">auteur:</span>
        {{ comment.user.name }}
      </div>
      <div class="card-body">{{ comment.content }}</div>
      <div class="card-actions justify-end">
        <button
          v-if="comment.user.$id === user?.$id"
          @click="deleteComment(comment.$id)"
          class="btn bg-error i-carbon-trash-can btn-sm"
        ></button>
      </div>
    </div>
  </div>
</template>
