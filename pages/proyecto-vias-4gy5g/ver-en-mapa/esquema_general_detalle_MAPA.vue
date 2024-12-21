<template>
  <div class="container-general">
    <div class="content-wrapper">
      <!-- Container Izquierda (2/3 del ancho) -->
      <div class="container_izquierda">
        <!-- Container Filtro Visual -->
        <div class="container_filtro_visual">
          <div>
            <!-- Botón Filtro Visual -->
            <button
              @click="clickFiltroVisual"
              :class="isEspacial ? 'btn-espacial' : 'btn-temporal'"
            >
              {{ isEspacial ? "Filtro Espacial" : "Filtro Temporal" }}
            </button>
          </div>
        </div>
        <!-- Container Título Mapa -->
        <div class="container_titulo_mapa">
          <div v-if="hasDataGPSroute">
            Ruta: {{ DataGPSroute_inicio.properties.name }}
            -
            {{ DataGPSroute_final.properties.name }}
          </div>
        </div>

        <!-- Container Mapa -->
        <div class="container_mapa">
          <div id="map-wrap" class="map-wrap">
            <l-map
              ref="map"
              :max-zoom="19"
              :min-zoom="5"
              :zoom="zoom"
              :center="{ lat: centerLat, lng: centerLng }"
              :useGlobalLeaflet="false"
              @ready="onLeafletReady"
            >
              <template v-if="leafletReady">
                <l-tile-layer :url="url" />
                <l-marker-cluster
                  :options="{
                    showCoverageOnHover: false,
                    chunkedLoading: true,
                    useGlobalLeaflet,
                  }"
                >
                  <template v-if="hasDataDetecciones">
                    <!-- Marcadores personalizados -->
                    <l-marker-mod
                      v-for="marker in customMarkers"
                      :key="marker.id"
                      :lat-lng="[marker.lat, marker.lng]"
                      @click="handleMarkerClick(marker)"
                    >
                      <l-popup-mod>{{ marker.popupContent }}</l-popup-mod>
                    </l-marker-mod>

                    <!-- Marcadores de inicio y fin de ruta -->
                    <l-marker
                      :lat-lng="[
                        DataGPSroute_inicio.geometry.coordinates[1],
                        DataGPSroute_inicio.geometry.coordinates[0],
                      ]"
                    >
                      <LIcon
                        :icon-url="iconUrl"
                        :icon-size="iconSize"
                        :iconAnchor="Anchor"
                        :popupAnchor="popupAnchor"
                      />
                      <l-popup>
                        Inicio: {{ DataGPSroute_inicio.properties.name }}
                      </l-popup>
                    </l-marker>
                    <l-marker
                      :lat-lng="[
                        DataGPSroute_final.geometry.coordinates[1],
                        DataGPSroute_final.geometry.coordinates[0],
                      ]"
                    >
                      <LIcon :icon-url="iconUrl" :icon-size="iconSize" />
                      <LIcon
                        :icon-url="iconUrl"
                        :icon-size="iconSize"
                        :iconAnchor="Anchor"
                        :popupAnchor="popupAnchor"
                      />
                      <l-popup
                        >Fin: {{ DataGPSroute_final.properties.name }}
                      </l-popup>
                    </l-marker>

                    <!-- Ruta GeoJSON -->
                    <l-geo-json :geojson="DataGPSroute_ruta" />

                    <!-- Marcadores de detecciones -->
                    <l-circle-marker
                      :key="index"
                      :lat-lng="currentPosition"
                      :radius="6"
                      :color="'gray'"
                      :fill-opacity="1"
                    />
                  </template>
                </l-marker-cluster>
              </template>
            </l-map>
          </div>
          <!-- Descomentar para ver los valores dinamicos de los bounds -->
          <!-- <div>Los bounds son: {{ bounds}</div> -->
          <!-- <div>ruta: {{ DataGPSroute_ruta }}</div> -->
          <!-- TimeLine -->
          <div v-if="!isEspacial" class="timeline-container">
            <input
              type="range"
              v-model="timelineValue"
              :min="0"
              :max="maxTL"
              @change="TimelineChange"
              class="timeline"
            />
          </div>
        </div>

        <!-- Detalles -->
        <div class="container_detalle">
          <div class="container_imagen">
            <img src="/images/img1.png" alt="Imagen de Detalle" />
          </div>
          <div v-if="mostrarDetalle" class="container_tabla_detalle">
            <table>
              <tr>
                <td>Clase:</td>
                <td>{{ Datos_mostrar[selectedIndex].class_name }}</td>
              </tr>
              <tr>
                <td>Model:</td>
                <td>{{ Datos_mostrar[selectedIndex].model }}</td>
              </tr>
              <tr>
                <td>ID Rastreo:</td>
                <td>{{ Datos_mostrar[selectedIndex].track_id }}</td>
              </tr>
              <tr>
                <td>Frame:</td>
                <td>{{ Datos_mostrar[selectedIndex].frame }}</td>
              </tr>
              <tr>
                <td>Lat-Lng:</td>
                <td>
                  [{{ Datos_mostrar[selectedIndex].lat }}] [{{
                    Datos_mostrar[selectedIndex].lng
                  }}]
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>

      <!-- Container Derecha (1/3 del ancho) -->
      <div class="container_derecha">
        <!-- Título Tabla -->
        <div class="container_titulo_tabla">Detecciones</div>

        <!-- Tabla -->
        <div class="container_tabla">
          <div v-if="hasDatos_mostrar">
            <!-- Verifica si hay datos Procesados -->
            <table class="tabla-registros-detecciones">
              <thead>
                <tr>
                  <!-- Encabezados de la tabla -->
                  <th>#</th>
                  <th>Clase</th>
                  <th>Confianza</th>
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
                      {{ Datos_mostrar[index].class_name }}
                    </td>
                    <td>
                      {{ (Datos_mostrar[index].confidence * 100).toFixed(2) }}%
                    </td>

                    <td>
                      <button
                        type="button"
                        class="custom-button custom-view-button"
                        @click="clickDetalle(index)"
                      >
                        Ver en Detalle
                      </button>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
          <div v-else>Cargando datos...</div>
        </div>

        <!-- Paginación -->
        <div class="container_paginacion">
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
                Pag {{ currentPage }} de {{ totalPages }}
              </div>
              <div class="prev-next">
                <div>
                  <button @click="previousPage" :disabled="currentPage === 1">
                    &lt;
                  </button>
                  <button
                    @click="nextPage"
                    :disabled="currentPage === totalPages"
                  >
                    &gt;
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Título Filtro Objeto -->
        <div class="container_titulo_filtro_objeto">Filtro por objeto</div>

        <!-- Filtro Objeto -->
        <div class="container_filtro_objeto">Filtro por Objeto</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import "leaflet/dist/leaflet.css";
import {
  LMap,
  LMarker,
  LTileLayer,
  LPopup,
  LGeoJson,
  LIcon,
  LCircleMarker,
} from "@vue-leaflet/vue-leaflet/src/lib";
import LMarkerCluster from "~~/components/cluster/components/LMarkerCluster.vue";
import LMarkerMod from "~~/components/cluster/components/LMarkerMod.vue";
import LPopupMod from "~~/components/cluster/components/LPopupMod.vue";
import { ref, computed, onMounted, nextTick, watch } from "vue";
import { useDisplay } from "vuetify";
import { useClusterStore } from "~/stores/clusterStore";
import { get_data_gps_routes } from "~/composables/proyecto-vias-4gy5g/get_gps_routes";
import { get_data_detecciones } from "~/composables/proyecto-vias-4gy5g/get_detecciones";
import { paginacion } from "~/composables/proyecto-vias-4gy5g/paginacion_tablas";

// GET de datos de rutas GPS
const {
  DataGPSroute_inicio,
  DataGPSroute_final,
  DataGPSroute_ruta,
  hasDataGPSroute,
} = get_data_gps_routes();

// GET de datos de detecciones
const { DataDetecciones, hasDataDetecciones } = get_data_detecciones();

// FILTRO VISUAL
const isEspacial = ref(true);
const clickFiltroVisual = () => {
  isEspacial.value = !isEspacial.value;
  filtroVisual();
};

// LEAFLET
const url = ref("https://{s}.tile.osm.org/{z}/{x}/{y}.png"); // URL de los tiles
const zoom = ref(8); // Zoom inicial
const centerLat = ref(4.60971); // Latitud inicial
const centerLng = ref(-74.08175); // Longitud inicial
const leafletReady = ref(false); // Indica si Leaflet está listo
const leafletObject = ref(null); // Objeto de Leaflet
const map = ref(null); // Referencia al mapa
const bounds = ref(null); // Referencia reactiva para los bounds del mapa

// Marcadores personalizados // SOLO PARA PRUEBAS
const customMarkers = ref([]);

// Gestión de marcadores
const handleMarkerClick = (marker) => {
  console.log(`Marcador clickeado:`, marker);
  // Puedes añadir lógica adicional aquí, como abrir un modal, etc.
};

// Computada para usar Leaflet globalmente
const useGlobalLeaflet = computed(() => LMap.props.useGlobalLeaflet);

// Método que se ejecuta cuando Leaflet está listo
const onLeafletReady = async () => {
  await nextTick();
  leafletObject.value = map.value.leafletObject;
  leafletReady.value = true;

  // Obtener los valores iniciales de los bounds del mapa
  bounds.value = leafletObject.value.getBounds();
  // console.log("Bounds del mapa:", bounds.value);

  // Añadir listener para el evento moveend. Osea actualiza los valores de los bounds al mover en el mapa
  leafletObject.value.on("moveend", () => {
    const newBounds = leafletObject.value.getBounds();
    if (bounds.value.equals(newBounds)) {
      return;
    }
    bounds.value = newBounds;
    if (isEspacial.value) {
      filtroVisual();
    }
  });
};

// Método para imprimir información del mapa
const imprimir = () => {
  if (leafletObject.value) {
    console.log("Centro del mapa:", leafletObject.value.getCenter());
    console.log("Zoom actual:", leafletObject.value.getZoom());
  }
};

// Añadir más marcadores dinámicamente // SOLO PARA PRUEBAS
const addMarker = (lat, lng, popupContent) => {
  const newMarker = {
    id: customMarkers.value.length + 1,
    lat,
    lng,
    popupContent,
  };
  customMarkers.value.push(newMarker);
};

// Función para agregar marcadores de con los datos de detecciones
const addDetectionMarkers = () => {
  console.time("Adicionado de Marcadores");
  DataDetecciones.value.forEach((detection, index) => {
    if (detection.lat && detection.lng) {
      const lat = detection.lat;
      const lng = detection.lng;
      addMarker(lat, lng, `Detección ${index + 1}`);
    } else {
      console.warn(
        `Detección ${index + 1} no tiene coordenadas válidas:`,
        detection
      );
    }
  });
  console.timeEnd("Adicionado de Marcadores");
};

// FILTRO VISUAL

const filtradoVisualDataDetecciones = ref([]); // Variable reactiva para almacenar las detecciones filtradas por la visualización
// Función para filtrar detecciones por la Visualización
const filtroVisual = () => {
  if (!bounds.value) return;

  if (isEspacial.value) {
    filtradoVisualDataDetecciones.value = DataDetecciones.value.filter(
      (detection) => {
        return (
          detection.lat >= bounds.value.getSouthWest().lat &&
          detection.lat <= bounds.value.getNorthEast().lat &&
          detection.lng >= bounds.value.getSouthWest().lng &&
          detection.lng <= bounds.value.getNorthEast().lng
        );
      }
    );
  } else {
    filtradoVisualDataDetecciones.value = DataDetecciones.value;
  }
  updateDatosMostrar();
};

// Verificar cuando los datos de detecciones estén disponibles
watch(hasDataDetecciones, (newVal) => {
  if (newVal) {
    console.log("Datos de detecciones disponibles:", DataDetecciones.value);
    addDetectionMarkers();
    if (isEspacial.value) {
      filtroVisual();
    }
  }
});

// Ejemplo de uso en un hook de montaje
onMounted(async () => {
  try {
    // Verificar si la página ya se ha recargado una vez
    if (!localStorage.getItem("pageReloaded")) {
      // Esperar 1 segundo y luego refrescar la página
      setTimeout(() => {
        localStorage.setItem("pageReloaded", "true");
        location.reload();
      }, 1000);
    }
    // // Ejemplo de obtención de datos y añadir marcadores
    // let data = await useCountResultsLocalitiesByCity([
    //   -74.11829863999992, 4.637411584847779,
    // ]);
    // console.log("Datos de localidades:", data);

    // Si quieres añadir marcadores basados en los datos
    if (data && data.length > 0) {
      data.forEach((location) => {
        addMarker(
          location.latitude,
          location.longitude,
          location.name || "Ubicación"
        );
      });
    }
  } catch (error) {
    console.error("Error al obtener datos:", error);
  }
});

// Exportar métodos útiles si es necesario
defineExpose({
  addMarker,
  imprimir,
  map,
});

// Leaflet Icon
onMounted(() => {
  import("leaflet");
});
const iconAnchor = [0, 0];
const iconUrl = `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png`;
const iconSize = [25, 40];
const popupAnchor = [0, -18];

// TIMELINE
const timeLine = ref(0);

// TABLA

// lógica para mostrar los datos en la tabla según la paginación
const Datos_mostrar = ref([]); // Variable reactiva para los Datos_mostrar a mostrar
const hasDatos_mostrar = ref(false); // Variable booleana para indicar si hasDatos_mostrar tiene datos

const updateDatosMostrar = () => {
  const start = (currentPage.value - 1) * 10;
  const end = start + 10;
  Datos_mostrar.value = filtradoVisualDataDetecciones.value.slice(start, end);
  hasDatos_mostrar.value = Datos_mostrar.value.length > 0;
}; // Función para actualizar Datos_mostrar

// PAGINACIÓN
const {
  currentPage,
  itemsPerPage,
  selectedPage,
  totalPages,
  previousPage,
  nextPage,
  goToPage,
} = paginacion(filtradoVisualDataDetecciones);

watch(currentPage, updateDatosMostrar); // Actualizar DataDetecciones_mostrar cuando currentPage cambie

watch(
  DataDetecciones,
  () => {
    if (isEspacial.value) {
      filtroVisual();
    } else {
      updateDatosMostrar();
    }
  },
  { immediate: true }
);

// DETALLE
const mostrarDetalle = ref(false);
const selectedIndex = ref(null);

const clickDetalle = (numeroDeteccion) => {
  selectedIndex.value = numeroDeteccion;
  mostrarDetalle.value = true;
};

// TIMELINE
const timelineValue = ref(0);
const maxTL = computed(() => {
  if (
    DataGPSroute_ruta.value &&
    DataGPSroute_ruta.value.geometry &&
    DataGPSroute_ruta.value.geometry.coordinates
  ) {
    return DataGPSroute_ruta.value.geometry.coordinates[0].length - 1;
  }
  return 0;
}); // Número máximo de coordenadas

const currentPosition = computed(() => {
  if (
    DataGPSroute_ruta.value &&
    DataGPSroute_ruta.value.geometry &&
    DataGPSroute_ruta.value.geometry.coordinates
  ) {
    const coords =
      DataGPSroute_ruta.value.geometry.coordinates[0][timelineValue.value];
    return [coords[1], coords[0]]; // Latitud y Longitud
  }
  return null;
});

const TimelineChange = (event) => {};
</script>

<style scoped>
/* ESQUEMA*/
.container-general {
  background-color: "primary";
  width: 100%;
  height: 80vh;
  padding: 1px;
  box-sizing: border-box;
}

.content-wrapper {
  display: flex;
  width: 100%;
  height: 100%;
}

.container_izquierda {
  background-color: primary; /* Fucsia */
  width: 66.66%;
  display: flex;
  flex-direction: column;
  padding: 10px;
}

.container_derecha {
  background-color: "primary";
  width: 33.33%;
  display: flex;
  flex-direction: column;
  padding: 10px;
}

.container_filtro_visual {
  background-color: #e7e9ed;
  height: 10%;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.container_titulo_mapa {
  background-color: #19485f;
  height: 5%;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.container_mapa {
  background-color: #e7e9ed;
  height: 55%;
  margin-top: 0%;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
}

.container_detalle {
  background-color: #e7e9ed;
  display: flex;
  height: 30%;
}

.container_imagen {
  background-color: #ffff00; /* Amarillo */
  width: 50%;
  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: auto;
}

.container_tabla_detalle {
  background-color: #e7e9ed;
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 85%;
}

.container_titulo_tabla {
  background-color: #19485f;
  height: 5%;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.container_tabla {
  background-color: #ffffff; /* Azul */
  height: 60%;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.container_paginacion {
  background-color: #ffffff; /* Gris */
  height: 5%;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.container_titulo_filtro_objeto {
  background-color: #19485f;
  height: 5%;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.container_filtro_objeto {
  background-color: #ffffff; /* Azul */
  height: 30%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* MAPA */
#map-wrap {
  height: 35vh; /* 30% de la altura del viewport */
  width: 100%; /* 50% del ancho del viewport */
  margin: 0%;
  position: relative;
}
/*TIMELINE*/
.timeline-container {
  width: 100%;
  margin-top: 0px;
  background-color: transparent;
}
.timeline {
  width: 100%;
  background-color: #19485f;
}

/* Estilos para los iconos de Material Icons */
.material-icons {
  margin-right: 0%; /* Espacio entre el icono y el texto */
  margin-left: 1%; /* Espacio entre el icono y el texto */
}

/* TABLA */

.tabla-registros-detecciones {
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
  font-family: "Arial", sans-serif;
}

.tabla-registros-detecciones th,
.tabla-registros-detecciones td {
  padding: 4px; /* Reduce el padding para disminuir el espacio entre filas */
  border-bottom: 1px solid #ddd;
  text-align: center;
}

.tabla-registros-detecciones td {
  font-size: 0.6875em; /* Relativo al tamaño de la fuente del elemento padre */
  line-height: 50%; /* Ajusta la altura de las filas */
  text-align: center;
}

.tabla-registros-detecciones th {
  background-color: white;
  position: sticky;
  top: 0;
  font-weight: bold;
  font-size: 10px;
  padding: 7px;
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
  width: 30%;
  height: 27%;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 12px;
  text-align: center;
  margin-top: 44%;
  margin-left: -70%;
}

.button-selectPage {
  position: relative;
  width: 70%;
  height: 20%;
  border-radius: 4px;
  border: 1px solid #ccc;
  padding: 0px;
  font-size: 10px;
  background-color: #ccc;
  top: -50%;
  left: 1%;
  font-weight: bold;
}

.page-navigation {
  position: relative;
  top: 0%;
  left: 0%;
  font-size: 0px;
}

.current-page {
  position: relative;
  top: -3vh;
  right: -60%;
  font-size: 13px;
}
.prev-next {
  position: relative;
  top: -7.5vh;
  left: 145%;
  font-weight: normal;
  font-size: 25px;
}

/* BOTÓN FILTRO VISUAL */
.btn-espacial {
  height: 5vh;
  width: 100%;
  background-color: #2980b9;
  color: white;
  padding: 0vh 2vw;
  border: 1px solid black;
  cursor: pointer;
  border-radius: 5px;
}

.btn-temporal {
  height: 5vh;
  width: 100%;
  padding: 0vh 2vw;
  background-color: #7f8c8d;
  color: white;
  border: 1px solid black;
  cursor: pointer;
  border-radius: 5px;
}

/* IMÁGEN */
img {
  width: 100%;
  height: 100%;

  border-radius: 5px;
  border: 1px solid black;
}
</style>
