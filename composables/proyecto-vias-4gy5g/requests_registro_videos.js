// composables/useRegistroVideos.js
import { ref, watch, onMounted } from "vue";

export function get_data_registro_videos() {
  const Data_RegistroVideos = ref([]);
  const hasData_RegistroVideos = ref(false);

  watch(Data_RegistroVideos, (newData_RegistroVideos) => {
    hasData_RegistroVideos.value = newData_RegistroVideos.length > 0;
  });

  onMounted(async () => {
    Data_RegistroVideos.value = await getData_RegistroVideos();
  });

  async function getData_RegistroVideos() {
    try {
      let result = await $fetch("/api/proyecto-vias-4gy5g/registro-videos");
      return result;
    } catch (error) {
      console.error("Error al obtener las coordenadas:", error);
      return [];
    }
  }

  return {
    Data_RegistroVideos,
    hasData_RegistroVideos,
  };
}

export async function post_data_registro_videos(
  startPoint,
  endPoint,
  recordingDate
) {
  try {
    const response = await fetch("/api/proyecto-vias-4gy5g/registro-videos", {
      method: "POST",
      body: JSON.stringify({
        ruta: `${startPoint}-${endPoint}`,
        fecha_grabacion: new Date(recordingDate),
        id_almacenamiento_video: " ",
        id_almacenamiento_archivo: " ",
        procesado: false,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log("Datos guardados en la base de datos:", data);
  } catch (error) {
    console.error("Error guardando los datos en la base de datos:", error);
  }
}
