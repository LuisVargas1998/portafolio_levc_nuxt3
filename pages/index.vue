<script setup lang="ts">
import UiLogin from "~~/components/ui-components/UiLogin.vue";
definePageMeta({
  middleware: ["auth"],
  layout: "blank",
});
</script>
<template>
  <div>
    <!-------Banner-------->
    <UiLogin />
    <!--------------------->
  </div>
</template>
