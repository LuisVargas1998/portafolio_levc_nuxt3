import { ref, computed } from "vue";

export function paginacion(items) {
  const currentPage = ref(1);
  const itemsPerPage = 10;
  const selectedPage = ref(1);

  // Calcula el número total de páginas
  const totalPages = computed(() => {
    const totalItems = items.value.length;
    return Math.ceil(totalItems / itemsPerPage);
  });

  // Función para ir a la página anterior
  function previousPage() {
    if (currentPage.value > 1) {
      currentPage.value--;
    }
  }

  // Función para ir a la página siguiente
  function nextPage() {
    if (currentPage.value < totalPages.value) {
      currentPage.value++;
    }
  }

  // Función para ir a una página específica
  function goToPage() {
    if (selectedPage.value >= 1 && selectedPage.value <= totalPages.value) {
      currentPage.value = selectedPage.value;
    }
  }

  return {
    currentPage,
    itemsPerPage,
    selectedPage,
    totalPages,
    previousPage,
    nextPage,
    goToPage,
  };
}
