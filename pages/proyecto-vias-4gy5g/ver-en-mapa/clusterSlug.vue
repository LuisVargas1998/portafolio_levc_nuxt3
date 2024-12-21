<template>
  <div>
    <div
      class="ContainerTitulo"
      style="
        width: 900px;
        height: 50px;
        background-color: rgba(30, 136, 229, 0.1);
        position: relative;
        top: -25px;
        left: -170px;
      "
    >
      <!-- Switch en pantalla -->
      <v-switch
        v-model="model"
        hide-details
        inset
        class="custom-switch"
        @change="handleSwitchChange()"
      ></v-switch>
      <div v-if="model" class="temporal-view">
        <p class="view-title" style="margin-top: -55px; margin-left: 270px">
          Vista Temporal
        </p>
      </div>
      <div v-else class="spatial-view">
        <p class="view-title" style="margin-top: -55px; margin-left: 270px">
          Vista Espacial
        </p>
      </div>
    </div>

    <div
      class="ContainerMapa"
      style="
        width: 895px;
        height: 420px;
        background-color: #e7e9ed;
        position: relative;
        top: -15px;
        left: -167px;
      "
    >
      <div v-if="hasDataGeoespacial">
        <p
          style="
            margin-top: 0px;
            margin-left: 100px;
            font-size: 12px;
            font-family: Helvetica;
            color: #1e88e5;
          "
        >
          Trayectoria
          {{ DataGeoespacial?.features[0].properties.name }}
          -
          {{ DataGeoespacial?.features[1].properties.name }}
        </p>
        <p
          v-if="model"
          style="
            margin-top: -1.9%;
            text-align: right;
            margin-right: 14%;
            font-size: 10px;
            font-family: Poppins;
            color: black;
            font-weight: bold;
          "
        >
          Frame {{ timelineValue }}; FrameR
          {{ parseInt(timelineValue) + parseInt(inicio) }}; inicio {{ inicio }};
          final {{ final }}
        </p>
        <!-- eliminar esto después de la prueba -->
        <!-- <span style="font-size: 12px; font-family: Helvetica; color: #1e88e5"
            >Bounds: {{ bounds }} ___ Zoom: {{ zoom }} ____ Center:
            {{ center }}</span
          > -->

        <div
          id="map-wrap"
          style="height: 40vh; width: 35vw; margin-top: 5px; margin-left: 105px"
        >
          <l-map
            ref="map"
            :max-zoom="19"
            :min-zoom="0"
            :zoom="defaultZoom"
            :center="defaultCenter"
            :useGlobalLeaflet="false"
            :bounds="bounds"
            @ready="onLeafletReady"
            @update:zoom="zoomUpdated"
            @update:center="centerUpdated"
            @update:bounds="boundsUpdated"
          >
            <l-marker-cluster
              :options="{
                showCoverageOnHover: false,
                chunkedLoading: true,
                useGlobalLeaflet,
              }"
            >
              <template v-if="leafletReady">
                <l-tile-layer :url="url" />
                <!-- Marcador para el dato inicial -->
                <l-marker
                  :lat-lng="[
                    DataGeoespacial?.features[0].geometry.coordinates[1],
                    DataGeoespacial?.features[0].geometry.coordinates[0],
                  ]"
                  :icon="icon"
                >
                  <l-popup
                    >Inicio del Trayecto en:
                    {{ DataGeoespacial?.features[0].properties.name }}
                  </l-popup>
                </l-marker>
                <!-- Marcador para el dato final -->
                <l-marker
                  :lat-lng="[
                    DataGeoespacial?.features[1].geometry.coordinates[1],
                    DataGeoespacial?.features[1].geometry.coordinates[0],
                  ]"
                  :icon="icon"
                >
                  <l-popup
                    >Final del Trayecto:
                    {{ DataGeoespacial?.features[1].properties.name }}
                  </l-popup>
                </l-marker>
                <!-- Agregar línea de ruta -->
                <l-polyline
                  :lat-lngs="getLatLngs(DataGeoespacial)"
                  :color="'blue'"
                  :weight="3"
                />
                <!-- Agrega las Detecciones -->
                <template
                  v-for="(
                    deteccion, index
                  ) in metadatosFiltradosObj.coordinates"
                  :key="index"
                >
                  <l-marker-mod
                    :lat-lng="[
                      metadatosFiltradosObj.coordinates[index][0],
                      metadatosFiltradosObj.coordinates[index][1],
                    ]"
                  >
                    <l-popup-mod>
                      Detecciones:
                      {{ metadatosFiltradosObj.coordinates.length }}
                      <br />
                      Frame: {{ index + 1 }}
                    </l-popup-mod>
                  </l-marker-mod>
                </template>
                <!-- Agrega las marcador circular Dinamico-->
                <template>
                  <l-circle-marker
                    :lat-lng="[
                      DataGeoespacial?.features[2].geometry.coordinates[0][
                        parseInt(timelineValue) + parseInt(inicio)
                      ][1],
                      DataGeoespacial?.features[2].geometry.coordinates[0][
                        parseInt(timelineValue) + parseInt(inicio)
                      ][0],
                    ]"
                    :radius="6"
                    :color="'#0075ff'"
                    :fill-opacity="1"
                  >
                    <l-popup
                      >coordenadas:
                      {{
                        DataGeoespacial?.features[2].geometry.coordinates[0][
                          timelineValue
                        ]
                      }}
                    </l-popup>
                  </l-circle-marker>
                </template>
              </template>
            </l-marker-cluster>
          </l-map>

          <div v-if="model" class="temporal-view">
            <button
              @click="
                inicio = 0;
                final = DataMetadata.frame_video.length;
                actionButtonFinal();
              "
              class="mostrarTodo"
            >
              ↻
            </button>
            <button @click="inicio = timelineValue" class="inicio">[</button>
            <!-- Timeline-->
            <input
              type="range"
              v-model="timelineValue"
              :min="0"
              :max="maxTL"
              @change="TimelineChange"
              class="timelineValue"
            />
            <button
              @click="
                final = parseInt(timelineValue) + parseInt(inicio);
                actionButtonFinal();
              "
              class="final"
            >
              ]
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      class="ContainerTituloTabla"
      style="
        width: 660px;
        height: 35px;
        background-color: rgba(30, 136, 229, 0.2);
        position: relative;
        top: -494px;
        left: 760px;
      "
    >
      <p style="margin-top: 3px; margin-left: 30%">Datos de Detecciones</p>
    </div>

    <div
      class="ContainerTabla"
      style="
        width: 660px;
        height: 466px;
        background-color: white;
        position: relative;
        top: -490px;
        left: 760px;
      "
    >
      <div v-if="hasDataMetadata">
        <!-- Verifica si hay datos Metadata -->
        <table class="custom-table">
          <!-- Tabla personalizada -->
          <thead>
            <tr>
              <!-- Encabezados de la tabla -->
              <th>#</th>
              <th>Señal</th>
              <th>Confianza</th>
              <th>Detalle</th>
            </tr>
          </thead>
          <tbody>
            <!-- Primer for itera sobre el arreglo de  -->
            <template
              v-for="(deteccion, index) in metadatosFiltradosObj.class_name"
              :key="index"
            >
              <!-- If que No permite que se muestren más de 10 filas -->
              <template
                v-if="
                  index < 10 &&
                  currentPage * 10 + index - 10 <
                    metadatosFiltradosObj.class_name.length
                "
              >
                <tr>
                  <td>{{ currentPage * 10 + (index + 1) - 10 }}</td>
                  <td>
                    {{
                      metadatosFiltradosObj.class_name[
                        currentPage * 10 + index - 10
                      ]
                    }}
                  </td>

                  <td>
                    {{
                      parseInt(
                        metadatosFiltradosObj.confidence[
                          currentPage * 10 + index - 10
                        ] * 100
                      )
                    }}%
                  </td>

                  <td>
                    <button
                      type="button"
                      class="custom-button custom-view-button"
                      style="background-color: #1e88e5; color: white"
                      @click="verDetalle = currentPage * 10 + index - 10"
                    >
                      Ver
                    </button>
                  </td>
                </tr>
              </template>
            </template>
          </tbody>
        </table>
      </div>
      <div v-else>Cargando datos...</div>
    </div>

    <div
      class="ContainerPaginacion"
      style="
        width: 660px;
        height: 40px;
        background-color: white;
        position: relative;
        top: -488px;
        left: 760px;
      "
    >
      <div v-if="hasDataMetadata">
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

    <div
      class="ContainerFiltro"
      style="
        width: 660px;
        height: 280px;
        background-color: white;
        position: relative;
        top: -478px;
        left: 760px;
      "
    >
      <div
        class="ContainerTituloFiltro"
        style="background-color: rgba(30, 136, 229, 0.2); position: relative"
      >
        Buscar Objeto
      </div>
      <div
        class="ContainerComboBoxFiltro"
        style="background-color: white; position: relative"
      >
        <div
          v-for="(visible, index) in comboboxCount"
          :key="index"
          style="margin-bottom: 10px"
        >
          <template v-if="visible">
            <select class="CustomSelect" v-model="selectedOptions[index]">
              >
              <option
                v-for="option in comboboxOptions"
                :key="option"
                :value="option"
              >
                {{ option }}
              </option>
            </select>
          </template>
        </div>
        <button
          class="BotonFiltroMas"
          @click="addCombobox"
          v-if="comboboxCount < 2"
        >
          +
        </button>
        <button
          class="BotonFiltroMenos"
          @click="removeCombobox"
          v-if="comboboxCount > 0"
        >
          -
        </button>
      </div>
    </div>

    <div
      class="ContainerDatosDetecciones"
      style="
        width: 895px;
        height: 346px;
        background-color: #eef5f9;
        position: relative;
        top: -825px;
        left: -168px;
      "
    >
      <div
        if="hasDataMetadata"
        class="ContainerImagen"
        style="
          width: 70%;
          height: 100%;
          background-color: white;
          position: relative;
          top: 0px;
          left: 0%;
        "
      >
        <img
          src="/images/img1.png"
          style="
            width: 90%;
            height: 75%;
            position: absolute;
            top: 10%;
            left: 5%;
            border: 1px solid black;
          "
          id="imagen"
          @click="ampliarImagen"
        />
      </div>
      <div
        class="ContainerVerDetalle"
        style="
          width: 30%;
          height: 0px;
          background-color: white;
          position: relative;
          top: -90%;
          left: 70%;
        "
      >
        <div v-if="hasDataMetadata" class="TablaHorizontal">
          <div class="fila">
            <div class="celda">Señal</div>
            <div class="celda">
              {{ metadatosFiltradosObj.class_name[verDetalle] }}
            </div>
          </div>
          <div class="fila">
            <div class="celda">Class ID</div>
            <div class="celda">
              {{ metadatosFiltradosObj.class_id[verDetalle] }}
            </div>
          </div>
          <div class="fila">
            <div class="celda">Confidence</div>
            <div class="celda">
              {{
                parseInt(metadatosFiltradosObj.confidence[verDetalle] * 100)
              }}%
            </div>
          </div>
          <div class="fila">
            <div class="celda">Frame</div>
            <div class="celda">
              {{ metadatosFiltradosObj.frameVideo[verDetalle] }}
            </div>
          </div>
          <div class="fila">
            <div class="celda">Coordenadas:</div>
            <div class="celda">
              {{ metadatosFiltradosObj.coordinates[verDetalle] }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  LIcon,
  LMap,
  LMarker,
  LTileLayer,
  LPopup,
  LPolyline,
  LPolygon,
  LCircleMarker,
  LRectangle,
} from "@vue-leaflet/vue-leaflet/src/lib";
import LMarkerCluster from "~~/components/cluster/components/LMarkerCluster.vue";
import LMarkerMod from "~~/components/cluster/components/LMarkerMod.vue";
import LPopupMod from "~~/components/cluster/components/LPopupMod.vue";
import { useClusterStore } from "~/stores/clusterStore";
import { ref, onMounted, watch } from "vue";
import "leaflet-draw/dist/leaflet.draw.css"; // Toolbar de librería leaflet-draw instalar con npm install leaflet-draw
import "leaflet-draw"; // Toolbar de librería leaflet-draw instalar con npm install leaflet-draw

export default {
  setup() {
    // LOGICA DEL MAPA

    // Logica para obtener la data de la Ruta GPS
    const DataGPSroute = ref([]);

    onMounted(async () => {
      try {
        const response = await fetch("/api/proyecto-vias-4gy5g/gps_routes");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        //console.log("Datos recibidos:", data); // Mensaje de depuración
        DataGPSroute.value = data;
      } catch (error) {
        //console.error("Error al obtener los datos:", error);
      }
    });

    // Logica para obtener la data de las los archivos .geojson
    const DataGeoespacial = ref({ value: null });
    const hasDataGeoespacial = ref(false);

    watch(DataGeoespacial, (newDataGeoespacial) => {
      hasDataGeoespacial.value = newDataGeoespacial !== null;
    });

    onMounted(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 2000); // Espera 2 segundos (2000 milisegundos)
      });
      DataGeoespacial.value = await getDataGeoespacial();
    });

    async function getDataGeoespacial() {
      try {
        let result = await $fetch(`/api/proyecto-vias-4gy5g/geojsons/`);
        return result;
      } catch (error) {
        console.error("Error al obtener las coordenadas:", error);
        return null;
      }
    }

    // LOGICA DE LA TABLA
    // Logica para obtener la data de las los archivos de metadata
    const DataMetadata = ref({ value: null });
    const hasDataMetadata = ref(false);

    watch(DataMetadata, (newDataMetadata) => {
      hasDataMetadata.value = newDataMetadata !== null;
    });

    onMounted(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 2000); // Espera 2 segundos (2000 milisegundos)
      });
      DataMetadata.value = await getDataMetadata();
      const final = DataMetadata.frame_video.length;
    });

    async function getDataMetadata() {
      try {
        let result = await $fetch("/api/proyecto-vias-4gy5g/metadata");
        return result;
      } catch (error) {
        console.error("Error al obtener las coordenadas:", error);
        return null;
      }
    }
    // VARIABLES DEL TEMPLATE
    const bounds = ref(null); //bounds de leaflet
    const model = ref(true); //switch
    const verDetalle = ref(null); //ver detalle

    // ENTREGA ARREGLOS CON DATOS DE SÓLO DETECCIONES
    const deteccionesArray = computed(() => {
      let class_name = [];
      let class_id = [];
      let confidence = [];
      let x1 = [];
      let y1 = [];
      let x2 = [];
      let y2 = [];
      let track_id = [];
      let centerX = [];
      let centerY = [];
      let ratio = [];
      let height = [];
      let frameVideo = [];
      let coordinates = [];

      let i = 0;
      for (
        let frame = 0;
        frame < DataMetadata.value.detections.class_name.length;
        frame++
      ) {
        if (DataMetadata.value.detections.class_name[frame].length > 0) {
          for (
            let detecciones = 0;
            detecciones <
            DataMetadata.value.detections.class_name[frame].length;
            detecciones++
          ) {
            class_name[i] =
              DataMetadata.value.detections.class_name[frame][detecciones];
            class_id[i] =
              DataMetadata.value.detections.class_id[frame][detecciones];
            confidence[i] =
              DataMetadata.value.detections.confidence[frame][detecciones];
            x1[i] =
              DataMetadata.value.detections.detect_box.x1[frame][detecciones];
            y1[i] =
              DataMetadata.value.detections.detect_box.y1[frame][detecciones];
            x2[i] =
              DataMetadata.value.detections.detect_box.x2[frame][detecciones];
            y2[i] =
              DataMetadata.value.detections.detect_box.y2[frame][detecciones];
            track_id[i] =
              DataMetadata.value.detections.track_id[frame][detecciones];
            centerX[i] =
              DataMetadata.value.detections.track_box.centerX[frame][
                detecciones
              ];
            centerY[i] =
              DataMetadata.value.detections.track_box.centerY[frame][
                detecciones
              ];
            ratio[i] =
              DataMetadata.value.detections.track_box.ratio[frame][detecciones];
            height[i] =
              DataMetadata.value.detections.track_box.height[frame][
                detecciones
              ];
            frameVideo[i] = frame + 1;
            coordinates[i] = DataMetadata.value.coordinates[frame];

            i++;
          }
        }
      }
      return {
        class_name,
        class_id,
        confidence,
        x1,
        y1,
        x2,
        y2,
        track_id,
        centerX,
        centerY,
        ratio,
        height,
        frameVideo,
        coordinates,
      };
    });

    // FILTRO  ESPACIAL - TEMPORAL
    let metadatosFiltradosEspTem = computed(() => {
      let class_name = [];
      let class_id = [];
      let confidence = [];
      let x1 = [];
      let y1 = [];
      let x2 = [];
      let y2 = [];
      let track_id = [];
      let centerX = [];
      let centerY = [];
      let ratio = [];
      let height = [];
      let frameVideo = [];
      let coordinates = [];

      let i = 0;

      if (model.value === false || final.value !== 0) {
        for (
          let deteccion = 0;
          deteccion < deteccionesArray.value.coordinates.length;
          deteccion++
        ) {
          if (
            deteccionesArray.value.coordinates[deteccion][0] >=
              bounds.value._southWest.lat &&
            deteccionesArray.value.coordinates[deteccion][0] <=
              bounds.value._northEast.lat &&
            deteccionesArray.value.coordinates[deteccion][1] >=
              bounds.value._southWest.lng &&
            deteccionesArray.value.coordinates[deteccion][1] <=
              bounds.value._northEast.lng
          ) {
            class_name[i] = deteccionesArray.value.class_name[deteccion];
            class_id[i] = deteccionesArray.value.class_id[deteccion];
            confidence[i] = deteccionesArray.value.confidence[deteccion];
            x1[i] = deteccionesArray.value.x1[deteccion];
            y1[i] = deteccionesArray.value.y1[deteccion];
            x2[i] = deteccionesArray.value.x2[deteccion];
            y2[i] = deteccionesArray.value.y2[deteccion];
            track_id[i] = deteccionesArray.value.track_id[deteccion];
            centerX[i] = deteccionesArray.value.centerX[deteccion];
            centerY[i] = deteccionesArray.value.centerY[deteccion];
            ratio[i] = deteccionesArray.value.ratio[deteccion];
            height[i] = deteccionesArray.value.height[deteccion];
            frameVideo[i] = deteccionesArray.value.frameVideo[deteccion];
            coordinates[i] = deteccionesArray.value.coordinates[deteccion];

            i++;
          }
        }
      }
      return {
        class_name,
        class_id,
        confidence,
        x1,
        y1,
        x2,
        y2,
        track_id,
        centerX,
        centerY,
        ratio,
        height,
        frameVideo,
        coordinates,
      };
    });

    // PAGINACION
    const currentPage = ref(1);
    const itemsPerPage = 10;
    const selectedPage = ref(1);

    const totalDetecciones = computed(() => {
      return metadatosFiltradosObj.value.class_name.length;
    });

    const totalPages = computed(() => {
      return Math.ceil(totalDetecciones.value / itemsPerPage);
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

    // LOGICA TIMELINE
    const timelineValue = ref(0);
    const inicio = ref(0);
    const final = ref(0);

    const maxTL = computed(() => {
      let maxTL = 0;
      if (final.value === 0) {
        maxTL = DataMetadata.value.frame_video.length - inicio.value;
      } else {
        maxTL = final.value - inicio.value;
      }
      return maxTL;
    });

    function TimelineChange(event) {}

    // FILTRO POR OBJETO
    const comboboxCount = ref(0);
    const comboboxVisibility = reactive([true]);
    const selectedOptions = ref([]);

    const comboboxOptions = [
      "Pare",
      "Ceda_el_Paso",
      "Siga_de_Frente",
      "No_Pase",
      "Giro_Solamente_a_la_Izquierda",
      "Prohibido_Girar_a_la_Izquierda",
      "Giro_Solamente_a_la_Derecha",
      "Prohibido_Girar_a_la_Derecha",
      "Prohibido_Girar_en_U",
      "Doble_Via",
      "Tres_Carriles(uno_en_contraflujo)",
      "Tres_Carriles(dos_en_contraflujo)",
      "Prohibido_el_Cambio_de_Calzada",
      "Prohibido_Circulacion_de_Vehiculos_Automotores",
      "Vehiculos_Pesados_a_la_Derecha",
      "Prohibido_Circulacion_Vehiculos_de_Carga",
      "Peatones_a_la_Izquierda",
      "Prohibido_Circulacion_de_Peatones",
      "Prohibido_Circulacion_de_Cabalgaduras",
      "Prohibido_Circulacion_de_Bicicletas",
      "Prohibido_Circulacion_de_Motocicletas",
      "Prohibido_Circulacion_de_Maquinaria_Agricola",
      "Prohibido_Circulacion_de_Vehiculos_de_Traccion_Animal",
      "Prohibido_Adelantar",
      "Prohibido_Parquear",
      "Prohibido_Parquear_o_Detenerse",
      "Prohibido_Pitar",
      "Velocidad_Maxima",
      "Peso_Maximo_Total_Permitido",
      "Altura_Maxima_Permitida",
      "Ancho_Maximo_Permitido",
      "Zona_de_Estacionamiento_de_Taxis",
      "Circulacion_con_Luces_Bajas",
      "Reten",
      "Cicloruta",
      "Sentido_Unico_de_Circulacion",
      "Sentido_de_Circulacion_Doble",
      "Paradero",
      "Prohibido_Dejar_o_Recoger_Pasajeros",
      "Zona_de_Cargue_y_Descargue",
      "Prohibido_Cargue_y_Descargue",
      "Espaciamiento",
      "Indicacion_de_Separador_de_Transito_a_la_Izquierda",
      "Indicacion_de_Separador_de_Transito_a_la_Derecha",
      "Delineador_de_Curva",
      "Curva_Peligrosa_a_la_Izquierda",
      "Curva_Peligrosa_a_la_Derecha",
      "Curva_Pronunciada_a_la_Izquierda",
      "Curva_Pronunciada_a_la_Derecha",
      "Curva_y_Contracurva_Cerrada_(primera_es_hacia_la_izquierda)",
      "Curva_y_Contracurva_Cerrada_(primera_es_hacia_la_derecha)",
      "Curvas_Sucesivas_(primera_es_hacia_la_derecha)",
      "Curvas_Sucesivas_(primera_es_hacia_la_izquierda)",
      "Curva_y_Contracurva_Pronunciada_(primera_es_hacia_la_izquierda)",
      "Curva_y_Contracurva_Pronunciada_(primera_es_hacia_la_Derecha)",
      "Interseccion_de_Vias",
      "Via_Lateral_Izquierda",
      "Via_Lateral_Derecha",
      "Bifurcacion_en_T",
      "Bifurcacion_en_Y",
      "Bifurcacion_Izquierda",
      "Bifurcacion_Derecha",
      "Bifurcacion_Escalonada_Izquierda-Derecha",
      "Bifurcacion_Escalonada_Derecha-Izquierda",
      "Glorieta",
      "Incorporacion_de_Transito_(desde_la_Izquierda)",
      "Incorporacion_de_Transito_(desde_la_Derecha)",
      "Semaforo",
      "Superficie_Rizada",
      "Resalto",
      "Depresion",
      "Descenso_Peligroso",
      "Reduccion_Simetrica_de_la_Calzada",
      "Prevencion_de_Pare",
      "Reduccion_Asimetrica_de_la_Calzada_(hacia_la_Derecha)",
      "Reduccion_Asimetrica_de_la_Calzada_(hacia_la_Izquierda)",
      "Ensanche_Simetrico_de_la_Calzada",
      "Prevencion_de_Ceda_el_Paso",
      "Ensanche_Asimetrico_de_la_Calzada_(hacia la Izquierda)",
      "Ensanche_Asimetrico_de_la_Calzada_(hacia la Derecha)",
      "Puente_Angosto",
      "Tunel",
      "Peso_Maximo_Permitido",
      "Circulacion_en_Dos_Sentidos",
      "Flecha_Direccional",
      "Tres_Carriles_(uno_en_contraflujo)",
      "Zona_de_Derrumbe",
      "Tres_Carriles_(dos_en_contraflujo)",
      "Superficie_Deslizante",
      "Maquinaria_Agricola_en_la_Via",
      "Peatones_en_la_Via",
      "Zona_Escolar",
      "Zona_Deportiva",
      "Animales_en_la via",
      "Altura_Libre",
      "Ancho_Libre",
      "Cruce_a_Nivel_con_el_Ferrocarril",
      "Barrera",
      "Paso_a_Nivel",
      "Iniciacion_de_Via_con_Separador(Dos_Sentidos_un_sentido)",
      "Terminacion_de_Via_con_Separador_(Dos_Sentidos_un_sentido)",
      "Final_del_Pavimento",
      "Ciclistas_en_la_Via",
      "Riesgo_de_Accidente",
      "Ruta_Nacional",
      "Poste_de_Referencia",
      "Informacion_Previa_de_Destino",
      "Croquis",
      "Confirmativa_de_Destino",
      "Nomenclatura_Urbana",
      "Geografica",
      "Senal_Transitoria",
      "Senal_Informativa",
      "Senal_Horizontal",
      "Amarilla_a_trazos",
      "Amarilla_continua",
      "Blanca_a_trazos",
      "Blanca_continua",
      "Bache",
      "Grieta",
      "Hundimiento",
    ];
    const addCombobox = () => {
      if (comboboxCount.value < 2) {
        comboboxCount.value++;
        selectedOptions.value.push("");
      }
    };
    const removeCombobox = () => {
      if (comboboxCount.value > 0) {
        comboboxCount.value--;
        selectedOptions.value.pop();
      }
    };
    let metadatosFiltradosObj = computed(() => {
      if (selectedOptions.value.length === 0) {
        return metadatosFiltradosEspTem.value; // Si no hay comboboxes seleccionados, retornar los datos sin filtrar
      } else {
        let filteredData = {
          class_name: [],
          class_id: [],
          confidence: [],
          x1: [],
          y1: [],
          x2: [],
          y2: [],
          track_id: [],
          centerX: [],
          centerY: [],
          ratio: [],
          height: [],
          frameVideo: [],
          coordinates: [],
        };

        for (
          let deteccion = 0;
          deteccion < metadatosFiltradosEspTem.value.coordinates.length;
          deteccion++
        ) {
          if (
            selectedOptions.value.includes(
              metadatosFiltradosEspTem.value.class_name[deteccion]
            )
          ) {
            filteredData.class_name.push(
              metadatosFiltradosEspTem.value.class_name[deteccion]
            );
            filteredData.class_id.push(
              metadatosFiltradosEspTem.value.class_id[deteccion]
            );
            filteredData.confidence.push(
              metadatosFiltradosEspTem.value.confidence[deteccion]
            );
            filteredData.x1.push(metadatosFiltradosEspTem.value.x1[deteccion]);
            filteredData.y1.push(metadatosFiltradosEspTem.value.y1[deteccion]);
            filteredData.x2.push(metadatosFiltradosEspTem.value.x2[deteccion]);
            filteredData.y2.push(metadatosFiltradosEspTem.value.y2[deteccion]);
            filteredData.track_id.push(
              metadatosFiltradosEspTem.value.track_id[deteccion]
            );
            filteredData.centerX.push(
              metadatosFiltradosEspTem.value.centerX[deteccion]
            );
            filteredData.centerY.push(
              metadatosFiltradosEspTem.value.centerY[deteccion]
            );
            filteredData.ratio.push(
              metadatosFiltradosEspTem.value.ratio[deteccion]
            );
            filteredData.height.push(
              metadatosFiltradosEspTem.value.height[deteccion]
            );
            filteredData.frameVideo.push(
              metadatosFiltradosEspTem.value.frameVideo[deteccion]
            );
            filteredData.coordinates.push(
              metadatosFiltradosEspTem.value.coordinates[deteccion]
            );
          }
        }
        console.log(filteredData);
        return filteredData;
      }
    });

    // IMAGEN
    const ampliarImagen = () => {
      const imagen = document.getElementById("imagen");
      if (imagen) {
        if (imagen.requestFullscreen) {
          imagen.requestFullscreen();
        } else if (imagen.mozRequestFullScreen) {
          imagen.mozRequestFullScreen();
        } else if (imagen.webkitRequestFullscreen) {
          imagen.webkitRequestFullscreen();
        } else if (imagen.msRequestFullscreen) {
          imagen.msRequestFullscreen();
        }
      }
    };

    // VUELVE Y CARGA LA PAGINA CUANDO SE NAVEGA HACIA ATRÁS
    window.onpopstate = async () => {
      window.location.reload();
    };

    // RETORNO DE DATOS
    return {
      //Data gps NUEVOO
      DataGPSroute,
      //Data geojson
      DataGeoespacial,
      hasDataGeoespacial,
      //Data Tabla
      DataMetadata,
      hasDataMetadata,
      deteccionesArray,
      metadatosFiltradosEspTem,
      metadatosFiltradosObj,
      //Paginación
      currentPage,
      itemsPerPage,
      selectedPage,
      totalPages,
      previousPage,
      nextPage,
      goToPage,
      totalDetecciones,
      //Timeline
      timelineValue,
      TimelineChange,
      maxTL,
      inicio,
      final,
      //Elementos del template
      bounds,
      model,
      verDetalle,
      //Filtro por objeto
      comboboxCount,
      comboboxOptions,
      comboboxVisibility,
      addCombobox,
      removeCombobox,
      selectedOptions,
      //Imagen
      ampliarImagen,
    };
  },

  components: {
    LIcon,
    LMap,
    LTileLayer,
    LMarker,
    LMarkerCluster,
    LMarkerMod,
    LPopup,
    LPopupMod,
    LPolyline,
    LPolygon,
    LCircleMarker,
  },

  data() {
    return {
      url: "https://{s}.tile.osm.org/{z}/{x}/{y}.png",
      zoom: 10,
      defaultZoom: computed(() => {
        const coordinates =
          this.DataGeoespacial.features[2].geometry.coordinates[0];
        let left = coordinates[0][0];
        let right = coordinates[0][0];
        let top = coordinates[0][1];
        let bottom = coordinates[0][1];

        for (let i = 1; i < coordinates.length; i++) {
          const lng = coordinates[i][0];
          const lat = coordinates[i][1];

          if (lng < left) {
            left = lng;
          }
          if (lng > right) {
            right = lng;
          }
          if (lat > top) {
            top = lat;
          }
          if (lat < bottom) {
            bottom = lat;
          }
        }

        const lat = (top + bottom) / 2;
        const lng = (left + right) / 2;

        const bounds = {
          _southWest: { lat: bottom, lng: left },
          _northEast: { lat: top, lng: right },
        };

        const mapWidth = 800; // Ancho del mapa en píxeles
        const mapHeight = 600; // Alto del mapa en píxeles

        const worldWidth = 360; // Ancho del mundo en grados
        const worldHeight = 180; // Alto del mundo en grados

        const latRatio = mapHeight / worldHeight;
        const lngRatio = mapWidth / worldWidth;

        const latDelta = bounds._northEast.lat - bounds._southWest.lat;
        const lngDelta = bounds._northEast.lng - bounds._southWest.lng;

        const latZoom =
          Math.log(mapHeight / (latDelta * latRatio)) / Math.log(2);
        const lngZoom =
          Math.log(mapWidth / (lngDelta * lngRatio)) / Math.log(2);

        const zoom = Math.min(latZoom, lngZoom) + 1;

        return zoom;
      }),
      center: [4.655475252700296, -74.08338546752931],
      defaultCenter: computed(() => {
        const coordinates =
          this.DataGeoespacial.features[2].geometry.coordinates[0];
        let left = coordinates[0][0];
        let right = coordinates[0][0];
        let top = coordinates[0][1];
        let bottom = coordinates[0][1];

        for (let i = 1; i < coordinates.length; i++) {
          const lng = coordinates[i][0];
          const lat = coordinates[i][1];

          if (lng < left) {
            left = lng;
          }
          if (lng > right) {
            right = lng;
          }
          if (lat > top) {
            top = lat;
          }
          if (lat < bottom) {
            bottom = lat;
          }
        }

        const lat = (top + bottom) / 2;
        const lng = (left + right) / 2;

        return { lat, lng };
      }),
      bounds: {
        _southWest: { lat: 25.32337633272451, lng: -103.18359375000001 },
        _northEast: { lat: -6.141423965030915, lng: -44.12109375 },
      },

      leafletReady: false,
      leafletObject: null,

      useGlobalLeaflet: computed(() => LMap.props.useGlobalLeaflet),

      icon: L.icon({
        iconUrl:
          "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
        iconSize: [25, 40],
        iconAnchor: [16, 18.5],
        popupAnchor: [1, -34],
      }),
    };
  },
  mounted() {
    setTimeout(() => {
      this.final = this.DataMetadata.frame_video.length;
      this.actionButtonFinal(); // Llama al método actionButtonFinal después del retraso de 5 segundos
    }, 5000);
  },
  methods: {
    async onLeafletReady(map) {
      await this.$nextTick();
      this.leafletObject = this.$refs.map.leafletObject;

      //Lógica incidencia del switch en el mapa
      if (this.model === false) {
        map.dragging.enable(); // Habilitar arrastrar
        map.scrollWheelZoom.enable(); // Habilitar hacer zoom
        map.setView(this.defaultCenter, this.defaultZoom);
      } else {
        map.dragging.disable();
        map.scrollWheelZoom.disable();
        map.setView(this.defaultCenter, this.defaultZoom); // Centrar el mapa
      }

      // Lógica de la barra de herramientas
      const drawnItems = new L.FeatureGroup();
      map.addLayer(drawnItems);

      // Lógica de la incidencia del switch en la barra de herramientas
      if (this.model === false) {
        if (!this.drawControl) {
          this.drawControl = new L.Control.Draw({
            draw: {
              polyline: false,
              polygon: {
                shapeOptions: {
                  color: "red",
                  fillColor: "transparent",
                },
              },
              rectangle: false,
              circle: false,
              marker: true,
              circlemarker: false,
            },
            edit: {
              featureGroup: drawnItems,
            },
          });
          map.addControl(this.drawControl);
        }
      } else {
        if (this.drawControl) {
          map.removeControl(this.drawControl);
          this.drawControl = null;
        }
      }

      // map.on("draw:drawstart", function (event) {
      //   // Deshabilitar arrastrar y hacer zoom
      //   map.dragging.disable();
      //   map.scrollWheelZoom.disable();
      // });

      // Logica para tomar datos del polígono y ajustar la vista del mapa
      map.on("draw:created", function (event) {
        let layer = event.layer;
        let coordinates = layer.getLatLngs();

        drawnItems.addLayer(layer); // Agregar el polígono dibujado a la capa de dibujo

        // Obtener el centro del polígono
        const center = layer.getBounds().getCenter();

        // Determinar _southWest y _northEast
        let left = coordinates[0][0].lng;
        let right = coordinates[0][0].lng;
        let top = coordinates[0][0].lat;
        let bottom = coordinates[0][0].lat;
        for (let i = 0; i < coordinates[0].length; i++) {
          const lng = coordinates[0][i].lng;
          const lat = coordinates[0][i].lat;

          if (lng < left) {
            left = lng;
          }
          if (lng > right) {
            right = lng;
          }
          if (lat > top) {
            top = lat;
          }
          if (lat < bottom) {
            bottom = lat;
          }
        }

        const bounds = {
          _southWest: { lat: bottom, lng: left },
          _northEast: { lat: top, lng: right },
        };

        const mapWidth = 800; // Ancho del mapa en píxeles
        const mapHeight = 600; // Alto del mapa en píxeles

        const worldWidth = 360; // Ancho del mundo en grados
        const worldHeight = 180; // Alto del mundo en grados

        const latRatio = mapHeight / worldHeight;
        const lngRatio = mapWidth / worldWidth;

        const latDelta = bounds._northEast.lat - bounds._southWest.lat;
        const lngDelta = bounds._northEast.lng - bounds._southWest.lng;

        const latZoom =
          Math.log(mapHeight / (latDelta * latRatio)) / Math.log(2);
        const lngZoom =
          Math.log(mapWidth / (lngDelta * lngRatio)) / Math.log(2);

        const zoom = Math.min(latZoom, lngZoom) + 2;

        map.setView(center, zoom);
        map.dragging.enable();
        map.scrollWheelZoom.enable();
      });

      // Calcular los límites y actualizar los bounds del mapa
      this.bounds = this.calculateBounds(this.DataGeoespacial);

      // Actualiza la vista del mapa en la vista Temporal
      if (this.model === true && this.final !== 0) {
        const coordinates =
          this.DataGeoespacial.features[2].geometry.coordinates[0];
        let left = coordinates[0][0];
        let right = coordinates[0][0];
        let top = coordinates[0][1];
        let bottom = coordinates[0][1];

        for (let i = this.inicio; i < this.final; i++) {
          const lng = coordinates[i][0];
          const lat = coordinates[i][1];

          if (lng < left) {
            left = lng;
          }
          if (lng > right) {
            right = lng;
          }
          if (lat > top) {
            top = lat;
          }
          if (lat < bottom) {
            bottom = lat;
          }
        }

        const lat = (top + bottom) / 2;
        const lng = (left + right) / 2;

        const bounds = {
          _southWest: { lat: bottom, lng: left },
          _northEast: { lat: top, lng: right },
        };

        const mapWidth = 800; // Ancho del mapa en píxeles
        const mapHeight = 600; // Alto del mapa en píxeles

        const worldWidth = 360; // Ancho del mundo en grados
        const worldHeight = 180; // Alto del mundo en grados

        const latRatio = mapHeight / worldHeight;
        const lngRatio = mapWidth / worldWidth;

        const latDelta = bounds._northEast.lat - bounds._southWest.lat;
        const lngDelta = bounds._northEast.lng - bounds._southWest.lng;

        const latZoom =
          Math.log(mapHeight / (latDelta * latRatio)) / Math.log(2);
        const lngZoom =
          Math.log(mapWidth / (lngDelta * lngRatio)) / Math.log(2);

        const zoom = Math.min(latZoom, lngZoom) + 1;

        const center = [lat, lng];

        // console.log("center", center);

        map.setView(center, zoom);
      }

      this.leafletReady = true;
    },
    getLatLngs(data) {
      const latLngs = [];

      if (data && data.features && data.features.length > 0) {
        const coordinates = data.features[2].geometry.coordinates[0];

        for (let i = 0; i < coordinates.length; i++) {
          const lat = coordinates[i][1];
          const lng = coordinates[i][0];
          latLngs.push([lat, lng]);
        }
      }
      return latLngs;
    },
    calculateBounds(DataGeoespacial) {
      let bounds = null;

      if (
        DataGeoespacial &&
        DataGeoespacial.features &&
        DataGeoespacial.features.length > 0
      ) {
        const coordinates = DataGeoespacial.features[2].geometry.coordinates[0];

        bounds = L.latLngBounds(coordinates);
      }

      return bounds;
    },
    zoomUpdated(zoom) {
      this.zoom = zoom;
    },
    centerUpdated(center) {
      this.center = center;
    },
    boundsUpdated(bounds) {
      this.bounds = bounds;
    },
    async handleSwitchChange() {
      this.leafletReady = false;
      this.leafletObject = null;
      await this.onLeafletReady(this.$refs.map.leafletObject);
    },
    async actionButtonFinal() {
      this.leafletReady = false;
      this.leafletObject = null;
      await this.onLeafletReady(this.$refs.map.leafletObject);
    },
  },
};
</script>

<style scoped>
.custom-switch {
  /* Cambia el color de fondo del switch cuando está activado */
  background-color: transparent; /* Puedes cambiar esto al color que desees */
  position: relative;
  top: 0px; /* Puedes ajustar la posición vertical */
  left: 700px; /* Puedes ajustar la posición horizontal */
}
/* Estilos para Vista Temporal */
.temporal-view {
  font-family: "Poppins", serif; /* Puedes cambiar la fuente */
  color: black; /* Puedes cambiar el color del texto */
}

/* Estilos para Vista Espacial */
.spatial-view {
  font-family: "Poppins", serif; /* Puedes cambiar la fuente */
  color: black; /* Puedes cambiar el color del texto */
  /* Otras propiedades de estilo específicas para Vista Espacial */
}

/* Estilos comunes para el título en ambas vistas Espacial y Temporal */
.view-title {
  font-size: 33px; /* Puedes cambiar el tamaño de la fuente */
  font-weight: normal;
  letter-spacing: 7px;
  /* Otras propiedades de estilo comunes para el título */
}

.timeline {
  transform: translateY(-295%);
  width: 100%;
}

/* Boton busqueda temporal  */

.mostrarTodo {
  position: relative;
  width: 7%;
  border-radius: 50%;
  border: 1px solid #ccc;
  padding: 0px;
  font-size: 30px;
  top: -200px;
  left: -12%;
  font-weight: bold;
  background-color: white;
  color: #1e88e5;
}

.inicio {
  position: relative;
  width: 80px;
  height: 30px;
  border-radius: 50%;
  border: 1px solid #ccc;
  padding: 0px;
  font-size: 15px;
  top: 0px;
  left: -19%;
  font-weight: bold;
  background-color: #1e88e5;
  color: white;
  transform: translateY(-40%);
}

.final {
  position: relative;
  width: 80px;
  height: 30px;
  border-radius: 50%;
  border: 1px solid #ccc;
  padding: 0px;
  font-size: 15px;
  top: -70px;
  left: 100%;
  font-weight: bold;
  background-color: #1e88e5;
  color: white;
}

/* Estilos para la tabla */
.ContainerTituloTabla {
  overflow-y: auto; /* Habilita el desplazamiento vertical */
  font-size: 20px; /* Puedes cambiar el tamaño de la fuente */
  font-weight: normal;
  letter-spacing: 3px;
}

.ContainerTabla {
  overflow-y: auto; /* Habilita el desplazamiento vertical */
}
/* Estilos para la paginación */

.ContainerPaginacion {
  border-radius: 0px;
  text-align: 4px;
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
  right: -75%;
  font-size: 13px;
}
.prev-next {
  position: relative;
  top: -51px;
  left: 95%;
  font-weight: normal;
  font-size: 25px;
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

/* Estilos para los datos de las detecciones */
.ContainerDatosDetecciones {
  overflow-y: unset; /* Habilita el desplazamiento vertical */
}

.TablaHorizontal {
  display: flex;
  flex-direction: column;
  text-align: center;
  font-family: "Poppins", sans-serif;
}

.fila {
  display: flex;
}

.celda {
  flex: 1;
  padding: 15px;
  border: 1px solid #f2f2f2;
  white-space: normal;
  background-color: white;
  font-size: 12px;
}

.celda:first-child {
  font-weight: Bold;
  background-color: #f2f2f2;
  font-size: 12px;
}

.ContainerImagen {
  overflow-y: unset;
  max-width: 70%;
  align-items: center;
}

/* Estilos para los el filtro por objetos*/
.ContainerFiltro {
}
.ContainerTituloFiltro {
  font-family: "Poppins", sans-serif;
  font-weight: 400;
  font-size: 20px;
  text-align: left;
  padding-left: 13px;
  letter-spacing: 5px;
}
.ContainerComboBoxFiltro {
  text-align: center;
  padding-left: 100px;
  padding: 7px;
  margin-bottom: 10px;
}

.CustomSelect {
  position: relative;
  width: 70%;
  height: 30px;
  border-radius: 0px;
  border: 1px solid #dddddd;
  padding: 0px;
  font-size: 12px;
  background-color: white;
  top: 10%;
  left: 1%;
  font-weight: normal;
  font-family: "Poppins", sans-serif;
  text-align: center;
}

.BotonFiltroMenos,
.BotonFiltroMas {
  border: 1px solid black;
  background-color: #f2f2f2;
  width: 30px;
  margin-right: 10px;
}
</style>
