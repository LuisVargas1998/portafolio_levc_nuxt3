import { ref, onMounted } from "vue";

export function useFetchData(url) {
  const data = ref([]);
  const error = ref(null);

  onMounted(async () => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log("Datos recibidos:", result); // Mensaje de depuración
      data.value = result;
    } catch (err) {
      console.error("Error al obtener los datos:", err);
      error.value = err;
    }
  });

  return { data, error };
}
