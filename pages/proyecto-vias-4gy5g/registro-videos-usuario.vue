<template>
  <div class="container-titulo-tabla">
    <div class="content1">Registro de Videos</div>
  </div>
  <div class="container-tabla">
    <div v-if="hasDatos_mostrar">
      <!-- Verifica si hay datos Procesados -->
      <table class="tabla-registros-videos">
        <thead>
          <tr>
            <!-- Encabezados de la tabla -->
            <th>#</th>
            <th>Ruta</th>
            <th>Fecha del video</th>
            <th>Procesado</th>
            <th>Ver</th>
          </tr>
        </thead>
        <tbody>
          <!-- Recorre el vector -->
          <template v-for="(guarda, index) in Datos_mostrar" :key="index">
            <!-- Limita la vista a sólo 10 elementos y muestra la cantidad de elementos que haya -->
            <tr>
              <td>{{ index + 1 + currentPage * 10 - 10 }}</td>
              <td>
                {{ Datos_mostrar[index].ruta }}
              </td>
              <td>
                {{ Datos_mostrar[index].fecha_grabacion }}
              </td>
              <td>
                <span v-if="Datos_mostrar[index].procesado">&#10004;</span>
              </td>
              <td>
                <button
                  type="button"
                  class="custom-button custom-view-button"
                  :class="{
                    'disabled-button':
                      !Data_RegistroVideos[currentPage * 10 + index - 10]
                        .procesado,
                  }"
                  :disabled="
                    !Data_RegistroVideos[currentPage * 10 + index - 10]
                      .procesado
                  "
                  @click="nombreColeccion2Backend(index)"
                >
                  Ver en Mapa
                </button>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    <div v-else>Cargando datos...</div>
  </div>
  <div class="container-paginacion">
    <div v-if="hasDatos_mostrar">
      <div class="content3">
        <div class="page-navigation">
          <div>
            <input
              type="number"
              v-model="selectedPage"
              min="1"
              :max="totalPages"
              class="input-selectPage"
            />
            <button @click="goToPage" class="button-selectPage">
              Go to page
            </button>
          </div>
        </div>
        <div class="current-page">
          Pag {{ currentPage }} of {{ totalPages }}
        </div>
        <div class="prev-next">
          <div>
            <button @click="previousPage" :disabled="currentPage === 1">
              &lt;
            </button>
            <button @click="nextPage" :disabled="currentPage === totalPages">
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { useRouter } from "vue-router";
import { get_data_registro_videos } from "~/composables/proyecto-vias-4gy5g/requests_registro_videos";
import { paginacion } from "~/composables/proyecto-vias-4gy5g/paginacion_tablas";

// Obtiene los datos de los videos registrados
const { Data_RegistroVideos, hasData_RegistroVideos } =
  get_data_registro_videos();

// PAGINACIÓN
const {
  currentPage,
  itemsPerPage,
  selectedPage,
  totalPages,
  previousPage,
  nextPage,
  goToPage,
} = paginacion(Data_RegistroVideos);

// LÓGICA PARA MUESTRA DE DATOS EN LA TABLA SEGUN LA PAGINACION

const Datos_mostrar = ref([]); // Variable reactiva para los Datos_mostrar a mostrar

const hasDatos_mostrar = ref(false); // Variable booleana para indicar si hasDatos_mostrar tiene datos

const updateDatosMostrar = () => {
  const start = (currentPage.value - 1) * 10;
  const end = start + 10;
  Datos_mostrar.value = Data_RegistroVideos.value.slice(start, end);
  hasDatos_mostrar.value = Datos_mostrar.value.length > 0;
}; // Función para actualizar Datos_mostrar

watch(Data_RegistroVideos, updateDatosMostrar, { immediate: true }); // Inicializar Datos_mostrar

watch(currentPage, updateDatosMostrar); // Actualizar Datos_mostrar cuando currentPage cambie

// LÓGICA PARA EDITAR EL NOMBRE DE LA COLECCIÓN EN LA BASE DE DE DATOS,
// PARA QUE SE PUEDA VISUALIZAR EN EL MAPA
const router = useRouter();

async function nombreColeccion2Backend(index) {
  const nombre_coleccion =
    Data_RegistroVideos.value[index + currentPage.value * 10 - 10].ruta;
  try {
    await $fetch("/api/proyecto-vias-4gy5g/variables_de_procesamiento", {
      method: "PUT",
      body: {
        ruta_mapa: nombre_coleccion,
      },
    });
    // Redirigir a la página dinámica después de que se complete el PUT
    router.push(`/proyecto-vias-4gy5g/ver-en-mapa/${nombre_coleccion}`);
  } catch (error) {
    console.error("Error al editar el nombre de la ruta:", error);
  }
}

// Refrescar la página una vez después de un segundo
onMounted(() => {
  if (!localStorage.getItem("pageReloaded")) {
    setTimeout(() => {
      localStorage.setItem("pageReloaded", "true");
      location.reload();
    }, 1000);
  }
});
</script>

<style scoped>
/* ESQUEMA */
.container-titulo-tabla {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 7vh;
  background-color: white;
  border-radius: 5px;
}

.container-tabla {
  background-color: white;
  width: 100%; /* Ajusta el ancho del contenedor */
  height: 65vh; /* 650 Ajusta la altura del contenedor */
  border-radius: 10px; /* Establece las esquinas redondeadas */
  margin-top: 10px; /* Establece la separación entre el contenedor y el resto del contenido */
  overflow-y: auto; /* Habilita el desplazamiento vertical */
}

.container-paginacion {
  background-color: white;
  width: 100%; /* Ajusta el ancho del contenedor */
  height: 6vh; /* 650 Ajusta la altura del contenedor */
  border-radius: 0px; /* Establece las esquinas redondeadas */
  margin-top: 2px; /* Establece la separación entre el contenedor y el resto del contenido */
}

.content1 {
  text-align: center;
  font-family: "Poppins", sans-serif;
  font-size: 30px;
  padding: 20px;
  font-weight: 1px;
  letter-spacing: 7px;
}

/* TABLA */
.tabla-registros-videos {
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
  font-family: "Arial", sans-serif;
}

.tabla-registros-videos th,
.tabla-registros-videos td {
  padding: 4px; /* Reduce el padding para disminuir el espacio entre filas */
  border-bottom: 1px solid #ddd;
  text-align: center;
}

.tabla-registros-videos td {
  font-size: 0.6875em; /* Relativo al tamaño de la fuente del elemento padre */
  line-height: 180%; /* Ajusta la altura de las filas */
}

.tabla-registros-videos th {
  background-color: white;
  position: sticky;
  top: 0;
  font-weight: bold;
  font-size: 13px;
}

.custom-button {
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
}

.custom-edit-button {
  background-color: #ffc107;
}

.custom-delete-button {
  background-color: #dc3545;
}

.custom-view-button {
  background-color: #19485f;
}

.disabled-button {
  background-color: #ccc;
  cursor: not-allowed;
}

/* PAGINACIÓN */

.content3 {
  font-family: "Poppins", sans-serif;
  padding: 0px;
  letter-spacing: 0px;
}

.input-selectPage {
  width: 70px;
  height: 27px;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 12px;
  text-align: center;
  margin-top: 6px;
}

.button-selectPage {
  position: relative;
  width: 100px;
  height: 30px;
  border-radius: 4px;
  border: 1px solid #ccc;
  padding: 4px;
  font-size: 12px;
  background-color: #ccc;
  top: 0px;
  left: 1%;
  font-weight: bold;
}

.page-navigation {
  position: relative;
  top: -5x;
  left: 1%;
  font-size: 13px;
}

.current-page {
  position: relative;
  top: -3.8vh;
  right: -88%;
  font-size: 13px;
}
.prev-next {
  position: relative;
  top: -51px;
  left: 97%;
  font-weight: normal;
  font-size: 25px;
}
</style>
