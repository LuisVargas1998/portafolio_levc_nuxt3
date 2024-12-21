<template>
  <div class="container1">
    <div
      class="content1"
      :style="`font-size: ${fontSize}px; letter-spacing: ${letterSpacing}px; font-weight: ${fontWeight}`"
    >
      Registro de Videos Procesados Adiministrador
    </div>
  </div>
  <div class="addDataVideosProcesados">
    Añadir Video Admin
    <div class="subcontainer">
      <form>
        <!-- Entrada de Nombre de la Ruta -->
        <div class="boxInputLeft">
          <input
            v-model="nombre_ruta"
            type="text"
            class="form-control"
            id="exampleInputName"
            aria-describedby="nameHelp"
            placeholder="Nombre de la Ruta"
          />
        </div>
        <!-- Entrada de fecha de la Ruta -->
        <div class="boxInputLeft">
          <input
            v-model="video_fecha"
            type="date"
            class="form-control"
            id="exampleInputFecha"
            aria-describedby="nameHelp"
          />
        </div>
        <!-- Entrada de ID de la Ruta -->
        <div class="boxInputLeft">
          <input
            v-model="ruta_id"
            type="text"
            class="form-control"
            id="exampleInputID"
            aria-describedby="nameHelp"
            placeholder="Id de Ruta"
          />
        </div>
        <!-- Entrada de Id de Detecciones  -->
        <div class="boxInputLeft">
          <input
            v-model="detecciones_id"
            type="text"
            class="form-control"
            id="exampleInputName"
            aria-describedby="nameHelp"
            placeholder="Id de Detecciones"
          />
        </div>
        <!-- Entrada de URL Video  -->
        <div class="boxInputRight" style="position: relative; top: -115px">
          <input
            v-model="video_url"
            type="text"
            class="form-control2"
            id="exampleInputName"
            aria-describedby="nameHelp"
            placeholder="Url de Video"
          />
        </div>
        <!-- Entrada de Estado de Procesado de la Ruta -->
        <div class="boxInputRight">
          <label
            for="exampleInputProcesado"
            class="form-label"
            style="position: relative; top: -70px; margin-right: 2px"
            >Estado</label
          >
          <input
            v-model="procesadoBool"
            type="checkbox"
            class="form-check-input"
            id="exampleInputProcesado"
            aria-describedby="nameHelp"
            style="position: relative; top: -67px; margin-right: 150px"
          />
          {{ procesadoBool }}
        </div>
      </form>
    </div>
    <!-- Botón de Guardado -->
    <button
      type="button"
      class="btnProcess"
      @click.prevent="
        addDataProcesados(
          nombre_ruta,
          video_fecha,
          ruta_id,
          detecciones_id,
          video_url,
          procesadoBool
        )
      "
    >
      Procesar
    </button>
  </div>

  <div class="container2">
    <!-- Verifica si hay datos Procesados -->
    <div v-if="hasDataProcesados">
      <!-- Modal -->
      <!-- <div
          class="modal fade"
          id="exampleModal"
          tabindex="1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel">
                  Editar Video Procesado
                </h1>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div class="modal-body">
                <input
                  v-model="editedNombre_ruta"
                  type="text"
                  class="form-control"
                  id="exampleInputFecha"
                  aria-describedby="nameHelp"
                />
                {{ editedNombre_ruta }}
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button type="button" class="btn btn-primary">
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div> -->
      <!-- Despliega un aviso de error -->
      <div
        v-if="error"
        class="alert alert-danger alert-dismissible fade show"
        role="alert"
      >
        <strong>¡Error!</strong> Error al eliminar.
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="alert"
          aria-label="Close"
          @click="error = null"
        ></button>
      </div>

      <table class="custom-table">
        <thead>
          <tr>
            <!-- Encabezados de la tabla -->
            <th>#</th>
            <th>Nombre de la Ruta</th>
            <th>Fecha del Video</th>
            <th>ID de Ruta</th>
            <th>ID de Detecciones</th>
            <th>URL Video</th>
            <th>Procesado</th>
            <th>Ruta</th>
            <th>Editar</th>
            <th>Borrar</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(guarda, index) in DataProcesados" :key="index">
            <tr
              v-if="
                index < 10 &&
                currentPage * 10 + index - 10 < DataProcesados.length
              "
            >
              <!-- Filas generadas dinámicamente -->
              <td>{{ currentPage * 10 + (index + 1) - 10 }}</td>
              <td>
                {{ DataProcesados[currentPage * 10 + index - 10].ruta_name }}
              </td>
              <td>
                {{ DataProcesados[currentPage * 10 + index - 10].fecha_video }}
              </td>
              <td>
                {{ DataProcesados[currentPage * 10 + index - 10].id_ruta }}
              </td>
              <td>
                {{
                  DataProcesados[currentPage * 10 + index - 10].id_detecciones
                }}
              </td>
              <td>
                {{ DataProcesados[currentPage * 10 + index - 10].url_video }}
              </td>
              <td>
                <span
                  v-if="DataProcesados[currentPage * 10 + index - 10].procesado"
                  >&#10004;</span
                >
              </td>
              <td>
                <router-link
                  :to="`ver-el-detalle/${
                    DataProcesados[currentPage * 10 + index - 10].id_ruta
                  }`"
                  :key="uniqueKey"
                >
                  <button
                    type="button"
                    class="custom-button custom-view-button"
                    style="background-color: #1e88e5; color: white"
                    @click="
                      editDataIdes(
                        DataProcesados[currentPage * 10 + index - 10].id_ruta,
                        DataProcesados[currentPage * 10 + index - 10]
                          .id_detecciones
                      )
                    "
                  >
                    Ver en Mapa
                  </button>
                </router-link>
              </td>
              <td>
                <button
                  type="button"
                  class="btn btn-warning custom-button custom-edit-button"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                  @click="
                    {
                      editedNombre_ruta = DataProcesados.ruta_name;
                      editedVideo_fecha = DataProcesados.fecha_video;
                      editedRuta_id = DataProcesados.id_ruta;
                      editedProcesadoBool = DataProcesados.procesado;
                    }
                  "
                >
                  Editar
                </button>
              </td>
              <td>
                <button
                  type="button"
                  class="btn-danger custom-button custom-delete-button"
                  @click="
                    deleteDataProcesados(
                      DataProcesados[currentPage * 10 + index - 10].id
                    )
                  "
                >
                  Delete
                </button>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    <div v-else>Cargando datos...</div>
    <!-- Mensaje de carga de datos -->
  </div>
  <div class="container3">
    <div v-if="hasDataProcesados">
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

<script>
import { ref, onMounted, watch } from "vue";
import { H3Error } from "h3";

export default {
  setup() {
    // CONSULTA Y TRAE PROCESADOS
    const DataProcesados = ref({ value: null });
    const hasDataProcesados = ref(false);

    watch(DataProcesados, (newDataProcesados) => {
      hasDataProcesados.value = newDataProcesados !== null;
    });

    onMounted(async () => {
      DataProcesados.value = await getDataProcesados();
      console.log("La DataProcesados value es: ", DataProcesados.value);
    });

    async function getDataProcesados() {
      try {
        let result = await $fetch("/api/proyecto-vias-4gy5g/procesados");
        console.log("Resultado de la API:", result);

        return result;
      } catch (error) {
        console.error("Error al obtener los videos procesados:", error);
        return null;
      }
    }

    // AGREGA VIDEO A LISTA DE PROCESADOS

    const nombre_ruta = ref(null);
    const video_fecha = ref(null);
    const ruta_id = ref(null);
    const detecciones_id = ref(null);
    const video_url = ref(null);
    const procesadoBool = ref(false);

    async function addDataProcesados(
      nombre_ruta,
      video_fecha,
      ruta_id,
      detecciones_id,
      video_url,
      procesadoBool
    ) {
      let addedDataProcesados = null;

      if (nombre_ruta && video_fecha && ruta_id && detecciones_id && video_url)
        addedDataProcesados = await $fetch("/api/procesados", {
          method: "POST",
          body: {
            ruta_name: nombre_ruta,
            fecha_video: new Date(video_fecha),
            id_ruta: ruta_id,
            id_detecciones: detecciones_id,
            url_video: video_url,
            procesado: procesadoBool,
          },
        });

      if (addedDataProcesados) DataProcesados.value = await getDataProcesados();
    }

    // ELIMINA DATO DE LISTA DE VIDEOS PROCESADOS

    const error = ref(null);

    async function deleteDataProcesados(id) {
      let deleteDataProcesadosOrError = null;
      if (id)
        deleteDataProcesadosOrError = await $fetch(
          "/api/proyecto-vias-4gy5g/procesados",
          {
            method: "DELETE",
            body: {
              id: id,
            },
          }
        );

      if (deleteDataProcesadosOrError instanceof H3Error) {
        error.value = deleteDataProcesadosOrError;
        console.log("Error al eliminar el video procesado");
        return;
      }

      DataProcesados.value = await getDataProcesados();
    }

    // EDITA DATO DE LISTA DE VIDEOS PROCESADOS

    const editedNombre_ruta = ref(null);
    const editedVideo_fecha = ref(null);
    const editedRuta_id = ref(null);
    const editedProcesadoBool = ref(false);

    async function editDataProcesados(
      editedNombre_ruta,
      editedVideo_fecha,
      editedRuta_id,
      editedProcesadoBool
    ) {
      let DataProcesados = null;

      if (editedNombre_ruta && editedVideo_fecha && editedRuta_id)
        DataProcesados = await $fetch("/api/proyecto-vias-4gy5g/procesados", {
          method: "PUT",
          body: {
            ruta_name: editedNombre_ruta,
            fecha_video: new Date(editedVideo_fecha),
            id_ruta: editedRuta_id,
            procesado: editedProcesadoBool,
          },
        });

      if (DataProcesados) DataProcesados.value = await getDataProcesados();
    }

    // Paginación

    const currentPage = ref(1);
    const itemsPerPage = 10;
    const selectedPage = ref(1);

    const totalPages = computed(() => {
      const totalItems = DataProcesados.value.length;
      return Math.ceil(totalItems / itemsPerPage);
    });

    function previousPage() {
      if (currentPage.value > 1) {
        currentPage.value--;
      }
    }

    function nextPage() {
      if (currentPage.value < totalPages.value) {
        currentPage.value++;
      }
    }

    function goToPage() {
      if (selectedPage.value >= 1 && selectedPage.value <= totalPages.value) {
        currentPage.value = selectedPage.value;
      }
    }

    // EDITA LOS VALORES DE IDES PARA VER EN MAPA LA RUTA ELEGIDA
    let edited_id_ruta = null;
    let edited_id_detecciones = null;

    async function editDataIdes(edited_id_ruta, edited_id_detecciones) {
      let DataIdes = null;

      DataIdes = await $fetch("/api/proyecto-vias-4gy5g/ides", {
        method: "PUT",
        body: {
          id_geojson: edited_id_ruta,
          id_metadata: edited_id_detecciones,
        },
      });
    }

    return {
      // Consultar Procesados
      DataProcesados,
      hasDataProcesados,
      // Agregar Video
      addDataProcesados,
      procesadoBool,
      //Eliminar Video
      deleteDataProcesados,
      // Paginación
      currentPage,
      itemsPerPage,
      selectedPage,
      totalPages,
      previousPage,
      nextPage,
      goToPage,
      // Editar valores de Ides
      editDataIdes,
    };
  },
};
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

/* Estilos de Tabla */
.container2 {
  background-color: white;
  width: 100%; /* Ajusta el ancho del contenedor */
  height: 470px; /* 650 Ajusta la altura del contenedor */
  border-radius: 10px; /* Establece las esquinas redondeadas */
  margin-top: 10px; /* Establece la separación entre el contenedor y el resto del contenido */
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
  background-color: #1e88e5;
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
  text-align: center;
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

/* Agregar Video Procesado */
.addDataVideosProcesados {
  background-color: white;
  width: 100%; /* Ajusta el ancho del contenedor */
  height: 250 px; /* 650 Ajusta la altura del contenedor */
  border-radius: 10px; /* Establece las esquinas redondeadas */
  margin-top: 10px; /* Establece la separación entre el contenedor y el resto del contenido */
  text-align: center;
}

.subcontainer {
  background-color: transparent;
  width: 70%; /* Ajusta el ancho del contenedor */
  height: 40%; /* 650 Ajusta la altura del contenedor */
  border-radius: 10px; /* Establece las esquinas redondeadas */
  border: 1px solid #1e88e5;
  margin-top: 0px; /* Establece la separación entre el contenedor y el resto del contenido */
  margin-left: 5%; /* Establece la separación entre el contenedor y el resto del contenido */
  text-align: left;
}

.form-label {
  font-family: "Arial", sans-serif;
  font-size: 14px;
  padding: 10px;
  font-weight: normal bold;
  letter-spacing: 1px;
  color: black;
  background-color: none;
  border: 0px solid blue;
  text-align: left;
  text-transform: none;
  margin-left: 60px;
}

.form-control {
  font-family: "Arial", sans-serif;
  font-size: 10px;
  padding: 5px;
  font-weight: normal;
  letter-spacing: 2px;
  color: black;
  background-color: #eef5f9;
  border: 1px solid #1e88e5;
  text-align: center;
  text-transform: none;
  margin-left: 70px;
  margin-top: 7px;
  width: 300px;
}
.boxInputLeft {
  text-align: left;
}
.form-control2 {
  font-family: "Arial", sans-serif;
  font-size: 10px;
  padding: 5px;
  font-weight: normal;
  letter-spacing: 2px;
  color: black;
  background-color: #eef5f9;
  border: 1px solid #1e88e5;
  text-align: center;
  text-transform: none;
  margin-right: 70px;
  margin-top: -350px;
  width: 300px;
}
.boxInputRight {
  text-align: right;
}

.form-check-input {
  margin-left: 5px;
  margin-top: 7px;
  width: 15px;
  height: 15px;
  background-color: #1e88e5;
  border: 0px solid #1e88e5;
  /* text-align: center; */
  text-transform: none;
}

.btnProcess {
  position: absolute;
  font-family: "Poppins", sans-serif;
  font-size: 13px;
  padding: 7px;
  font-weight: bold;
  letter-spacing: 2px;
  color: white;
  background-color: #1e88e5;
  border: 1px solid #1e88e5;
  text-align: center;
  text-transform: none;
  height: 50px;
  width: 140px;
  margin-top: -120px;
  margin-left: 24%;
  border-radius: 10px;
}
</style>
