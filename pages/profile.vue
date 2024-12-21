<template>
  <div>
    Bienvenido a su perfil
    <NuxtLink to="/home">Home page</NuxtLink>
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  //middleware: ["auth"],
});
</script>
