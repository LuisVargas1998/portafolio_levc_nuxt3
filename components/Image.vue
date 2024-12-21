<template>
    <img
      class="table-image"
      :src="'data:image/jpeg;base64,' + base64"
      alt="image"
    />
</template>
<script setup>
const props = defineProps({
  imagePath: {
    type: String,
  },
});
const base64 = await minioPlugin(props.imagePath);
</script>
<style>
.table-image {
  max-width: 30%;
}
</style>
