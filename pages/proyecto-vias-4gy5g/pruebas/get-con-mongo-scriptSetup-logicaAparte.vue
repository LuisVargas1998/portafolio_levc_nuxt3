<template>
  <div>
    <h1>Documentos de la colección: la_calera-bogota</h1>
    <ul v-if="hasDataDetecciones">
      <pre>
        {{ DataGPSroute_ruta.geometry.coordinates[0][0] }}
      </pre>
    </ul>
    <div v-else>Cargando datos...</div>
  </div>
</template>

<script setup>
import { get_data_gps_routes } from "~/composables/proyecto-vias-4gy5g/get_gps_routes";
import { get_data_detecciones } from "~/composables/proyecto-vias-4gy5g/get_detecciones";

// GET de datos de rutas GPS
const {
  DataGPSroute_inicio,
  DataGPSroute_final,
  DataGPSroute_ruta,
  hasDataGPSroute,
} = get_data_gps_routes();

// GET de datos de detecciones
const { DataDetecciones, hasDataDetecciones } = get_data_detecciones();
</script>
