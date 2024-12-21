<template>
  <div v-if="hasDataDetecciones">
    <!-- Renderiza los datos aquí -->
    <pre>
      {{ DataDetecciones[0].lat }}
    </pre>
  </div>
  <div v-else>
    <!-- Mensaje de carga o spinner -->
    Cargando datos...
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

// Data de las RUTAS GPS
const DataGPSroute_inicio = ref([]);
const DataGPSroute_final = ref([]);
const DataGPSroute_ruta = ref([]);
const hasDataGPSroute = ref(false);

onMounted(async () => {
  try {
    const response = await fetch("/api/proyecto-vias-4gy5g/gps_routes");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const dataRecibida = await response.json();
    console.log("Datos recibidos:", dataRecibida); // Mensaje de depuración
    DataGPSroute_inicio.value = dataRecibida.data[0].features[0];
    DataGPSroute_final.value = dataRecibida.data[0].features[1];
    DataGPSroute_ruta.value = dataRecibida.data[0].features[2];
  } catch (error) {
    console.error("Error al obtener los datos:", error);
  }
});

watch(DataGPSroute_inicio, (newDataGPSroute) => {
  hasDataGPSroute.value = newDataGPSroute !== null;
});

// Data de las Detecciones
const DataDetecciones = ref([]);
const hasDataDetecciones = ref(false);

onMounted(async () => {
  try {
    const response = await fetch("/api/proyecto-vias-4gy5g/detecciones");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const dataRecibida = await response.json();
    console.log("Datos recibidos:", dataRecibida); // Mensaje de depuración
    DataDetecciones.value = dataRecibida.data;
  } catch (error) {
    console.error("Error al obtener los datos:", error);
  }
});

watch(DataDetecciones, (newDataDetecciones) => {
  hasDataDetecciones.value = newDataDetecciones !== null;
});
</script>
