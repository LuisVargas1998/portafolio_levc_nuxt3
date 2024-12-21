import { ref, onMounted, watch } from "vue";

export function get_data_detecciones() {
  const DataDetecciones = ref([]);
  const hasDataDetecciones = ref(false);

  onMounted(async () => {
    try {
      const response = await fetch("/api/proyecto-vias-4gy5g/detecciones");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const dataRecibida = await response.json();
      //console.log("Datos recibidos:", dataRecibida); // Mensaje de depuración
      DataDetecciones.value = dataRecibida.data;
    } catch (error) {
      //console.error("Error al obtener los datos:", error);
    }
  });

  watch(DataDetecciones, (newDataDetecciones) => {
    hasDataDetecciones.value = newDataDetecciones !== null;
  });

  return {
    DataDetecciones,
    hasDataDetecciones,
  };
}
