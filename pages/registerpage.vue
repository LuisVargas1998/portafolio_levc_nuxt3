<script setup lang="ts">
import { ref } from "vue";
import UiRegister from "~~/components/ui-components/UiRegister.vue";
definePageMeta({
  //middleware: ["auth"],
  layout: "blank",
});
</script>
<template>
  <UiRegister />
</template>
