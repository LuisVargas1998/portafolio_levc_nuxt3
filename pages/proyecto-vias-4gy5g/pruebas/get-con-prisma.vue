<template>
  <div>
    <div v-if="hasDataGeoespacial">
      <p>
        Es:
        {{ DataGeoespacial.coordinates[101][1] }}
      </p>
    </div>
    <div v-else>Cargando datos...</div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from "vue";

export default {
  setup() {
    const DataGeoespacial = ref({ value: null });

    // Utilizamos un ref adicional para indicar si tenemos coordenadas o no
    const hasDataGeoespacial = ref(false);

    // Watch para observar cambios en coordinates.value
    watch(DataGeoespacial, (newDataGeoespacial) => {
      hasDataGeoespacial.value = newDataGeoespacial !== null;
    });

    onMounted(async () => {
      DataGeoespacial.value = await getDataGeoespacial();
      console.log("La DataGeoespacial value es: ", DataGeoespacial.value);
    });

    async function getDataGeoespacial() {
      try {
        let result = await $fetch("/api/metadata");
        console.log("Resultado de la API:", result);

        return result;
      } catch (error) {
        console.error("Error al obtener las coordenadas:", error);
        return null;
      }
    }

    return {
      DataGeoespacial,
      hasDataGeoespacial,
    };
  },
};
</script>
