<script setup lang="ts">
import type { Comment } from "~/utils/databases";

const user = await useAccount();
const { database } = useAppwrite();
const props = defineProps<{ data: Comment }>();

function deleteComment() {
  try {
    database.deleteDocument("classes", "comment", props.data.$id);
  } catch (e) {
    console.error(e);
    showError("impossible de supprimer le commentaire: " + e);
  }
}
</script>
<template>
  <div class="card card-compact">
    <div class="card-title">
      <span class="font-normal">auteur:</span>
      {{ data.user.name }}
    </div>
    <div class="card-body">{{ data.content }}</div>
    <div class="card-actions justify-end">
      <button
        @click="deleteComment()"
        v-if="data.user.$id === user?.$id"
        class="btn bg-error i-carbon-trash-can btn-sm"
      ></button>
    </div>
  </div>
</template>
