import { ref, onMounted, watch } from "vue";

export function get_data_gps_routes() {
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

  return {
    DataGPSroute_inicio,
    DataGPSroute_final,
    DataGPSroute_ruta,
    hasDataGPSroute,
  };
}
