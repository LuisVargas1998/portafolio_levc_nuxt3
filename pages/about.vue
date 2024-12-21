<template>
  <div>This is about page <NuxtLink to="/home">Home page</NuxtLink></div>
</template>
<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
});
</script>


