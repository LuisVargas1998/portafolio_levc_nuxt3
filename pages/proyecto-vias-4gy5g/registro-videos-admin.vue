<template>
  <div class="container1">
    <div
      class="content1"
      :style="`font-size: ${fontSize}px; letter-spacing: ${letterSpacing}px; font-weight: ${fontWeight}`"
    >
      Registro de Videos (Admin Panel)
    </div>
  </div>
  <div class="container2">
    <div v-if="hasData_RegistroVideos">
      <!-- Verifica si hay datos Procesados -->
      <table class="custom-table">
        <thead>
          <tr>
            <!-- Encabezados de la tabla -->
            <th>#</th>
            <th>Ruta</th>
            <th>Fecha del video</th>
            <th>ID registro MongoDB</th>
            <th>ID video Drive</th>
            <th>ID archivo Drive</th>
            <th>Procesado</th>
            <th>Ver</th>
          </tr>
        </thead>
        <tbody>
          <!-- Recorre el vector -->
          <template v-for="(guarda, index) in Data_RegistroVideos" :key="index">
            <!-- Limita la vista a sólo 10 elementos y muestra la cantidad de elementos que haya -->
            <tr
              v-if="
                index < 10 &&
                currentPage * 10 + index - 10 < Data_RegistroVideos.length
              "
            >
              <td>{{ currentPage * 10 + (index + 1) - 10 }}</td>
              <td>
                {{ Data_RegistroVideos[currentPage * 10 + index - 10].ruta }}
              </td>
              <td>
                {{
                  Data_RegistroVideos[currentPage * 10 + index - 10]
                    .fecha_grabacion
                }}
              </td>
              <td>
                {{
                  Data_RegistroVideos[currentPage * 10 + index - 10].id_registro
                }}
              </td>
              <td>
                {{
                  Data_RegistroVideos[currentPage * 10 + index - 10]
                    .id_almacenamiento_video
                }}
              </td>
              <td>
                {{
                  Data_RegistroVideos[currentPage * 10 + index - 10]
                    .id_almacenamiento_archivo
                }}
              </td>
              <td>
                <span
                  v-if="
                    Data_RegistroVideos[currentPage * 10 + index - 10].procesado
                  "
                  >&#10004;</span
                >
              </td>
              <td>
                <router-link
                  :to="`ver-el-detalle/${
                    Data_RegistroVideos[currentPage * 10 + index - 10].id_ruta
                  }`"
                  :key="uniqueKey"
                >
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
                    @click="
                      editDataIdes(
                        Data_RegistroVideos[currentPage * 10 + index - 10]
                          .id_ruta,
                        Data_RegistroVideos[currentPage * 10 + index - 10]
                          .id_detecciones
                      )
                    "
                  >
                    Ver en Mapa
                  </button>
                </router-link>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    <div v-else>Cargando datos...</div>
  </div>
  <div class="container3">
    <div v-if="hasData_RegistroVideos">
      <div
        class="content3"
        :style="`font-size: ${fontSize}px; letter-spacing: ${letterSpacing}px; font-weight: ${fontWeight}`"
      >
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
import { get_data_registro_videos } from "~/composables/proyecto-vias-4gy5g/requests_registro_videos";
import { paginacion } from "~/composables/proyecto-vias-4gy5g/paginacion_tablas";

// Obtiene los datos de los videos registrados
const { Data_RegistroVideos, hasData_RegistroVideos } =
  get_data_registro_videos();

// Paginación
const {
  currentPage,
  itemsPerPage,
  selectedPage,
  totalPages,
  previousPage,
  nextPage,
  goToPage,
} = paginacion(Data_RegistroVideos);

// Edita los valores de ID para ver en el mapa la ruta elegida
async function editDataIdes(edited_id_ruta, edited_id_detecciones) {
  try {
    await $fetch("/api/proyecto-vias-4gy5g/ides", {
      method: "PUT",
      body: {
        id_geojson: edited_id_ruta,
        id_metadata: edited_id_detecciones,
      },
    });
  } catch (error) {
    console.error("Error al editar los ID:", error);
  }
}
</script>

<style scoped>
.container1 {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  background-color: white;
  border-radius: 10px;
}

.content1 {
  text-align: center;
  font-family: "Poppins", sans-serif;
  font-size: 30px;
  padding: 20px;
  font-weight: 1px;
  letter-spacing: 7px;
}
.container2 {
  background-color: white;
  width: 100%; /* Ajusta el ancho del contenedor */
  height: 470px; /* 650 Ajusta la altura del contenedor */
  border-radius: 10px; /* Establece las esquinas redondeadas */
  margin-top: 20px; /* Establece la separación entre el contenedor y el resto del contenido */
  overflow-y: auto; /* Habilita el desplazamiento vertical */
}

.custom-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
  font-family: "Arial", sans-serif;
}

.custom-table th,
.custom-table td {
  padding: 8px;
  border-bottom: 1px solid #ddd;
  text-align: center;
  font-size: 12px;
}

.custom-table td {
  font-size: 11px;
}

.custom-table th {
  background-color: white;
  position: sticky;
  top: 0;
  font-weight: Bold;
  font-size: 12px;
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

/* Estilo para el botón deshabilitado */
.disabled-button {
  background-color: #ccc;
  cursor: not-allowed;
}

/* Paginación */
.container3 {
  background-color: white;
  width: 100%; /* Ajusta el ancho del contenedor */
  height: 40px; /* 650 Ajusta la altura del contenedor */
  border-radius: 0px; /* Establece las esquinas redondeadas */
  margin-top: 2px; /* Establece la separación entre el contenedor y el resto del contenido */
}

.content3 {
  font-family: "Poppins", sans-serif;
  padding: 2px;
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
  top: -24px;
  right: -90%;
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
