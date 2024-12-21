<template>
  <div class="container-general">
    <div id="map-wrap" class="map-wrap">
      <l-map
        ref="map"
        :max-zoom="19"
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
            <!-- Pendiente aca -->
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
            </template>
          </l-marker-cluster>
        </template>
      </l-map>
    </div>
    <!-- Descomentar para ver los valores dinamicos de los bounds -->
    <!-- <div>Los bounds son: {{ bounds }}</div> -->
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
} from "@vue-leaflet/vue-leaflet/src/lib";

import LMarkerCluster from "~~/components/cluster/components/LMarkerCluster.vue";
import LMarkerMod from "~~/components/cluster/components/LMarkerMod.vue";
import LPopupMod from "~~/components/cluster/components/LPopupMod.vue";

import { ref, computed, onMounted, nextTick } from "vue";
import { useClusterStore } from "~/stores/clusterStore";
import { get_data_gps_routes } from "~/composables/proyecto-vias-4gy5g/get_gps_routes";
import { get_data_detecciones } from "~/composables/proyecto-vias-4gy5g/get_detecciones";

// GET de datos de rutas GPS
const {
  DataGPSroute_inicio,
  DataGPSroute_final,
  DataGPSroute_ruta,
  hasDataGPSroute,
} = get_data_gps_routes();

// GET de datos de detecciones
//const { DataDetecciones, hasDataDetecciones } = get_data_detecciones();

// LEAFLET

// Configuración inicial del mapa
const url = ref("https://{s}.tile.osm.org/{z}/{x}/{y}.png"); // URL de los tiles
const zoom = ref(5); // Zoom inicial
const centerLat = ref(4.60971); // Latitud inicial
const centerLng = ref(-74.08175); // Longitud inicial
const leafletReady = ref(false); // Indica si Leaflet está listo
const leafletObject = ref(null); // Objeto de Leaflet
const map = ref(null); // Referencia al mapa
const bounds = ref(null); // Referencia reactiva para los bounds del mapa

// Marcadores personalizados // SOLO PARA PRUEBAS
const customMarkers = ref([
  {
    id: 1,
    lat: 4.674385280131108,
    lng: -74.0361047198689,
    popupContent: "Mensaje de prueba 1",
  },
  {
    id: 2,
    lat: 4.674381609121968,
    lng: -74.03610839087804,
    popupContent: "Mensaje de prueba 2",
  },
]);

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

  //Obtener los valores iniciales  de los bounds del mapa
  bounds.value = leafletObject.value.getBounds();
  //console.log("Bounds del mapa:", bounds.value);

  // Añadir listener para el evento moveend.Osea actuliza los valores de los bounds al mover en el mapa
  leafletObject.value.on("moveend", () => {
    bounds.value = leafletObject.value.getBounds();
    //console.log("Bounds actualizados:", bounds.value);
  });
};

// Método para imprimir información del mapa
const imprimir = () => {
  if (leafletObject.value) {
    console.log("Centro del mapa:", leafletObject.value.getCenter());
    console.log("Zoom actual:", leafletObject.value.getZoom());
  }
};

// Añadir más marcadores dinámicamente al mapa
const addMarker = (lat, lng, popupContent) => {
  const newMarker = {
    id: customMarkers.value.length + 1,
    lat,
    lng,
    popupContent,
  };
  customMarkers.value.push(newMarker);
};

// Función para agregar marcadores de con los datos de detecciones //NUEVOOO
const addDetectionMarkers = () => {
  DataDetecciones.value.forEach((detection, index) => {
    const lat = detection.lat;
    const lng = detection.lng;
    addMarker(lat, lng);
  });
};

// Verificar cuando los datos de detecciones estén disponibles// NUEVOOO
// watch(hasDataDetecciones, (newVal) => {
//   if (newVal) {
//     console.log("Datos de detecciones disponibles:", DataDetecciones.value);
//     addDetectionMarkers();
//   }
// });

// Ejemplo de uso en un hook de montaje
onMounted(async () => {
  try {
    // Ejemplo de obtención de datos y añadir marcadores
    let data = await useCountResultsLocalitiesByCity([
      -74.11829863999992, 4.637411584847779,
    ]);
    console.log("Datos de localidades:", data);

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

// Iconos personalizados (para Inicio y Fin de ruta)
onMounted(() => {
  import("leaflet");
});
const iconAnchor = [0, 0];
const iconUrl = `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png`;
const iconSize = [25, 40];
const popupAnchor = [0, -18];

// console.log("mira lo quehay en geoJson", DataGPSroute_ruta.value);

// Verificar cuando los datos del GeoJSON estén disponibles
// watch(hasDataGPSroute, (newVal) => {
//   if (newVal) {
//     console.log("Datos del GeoJSON disponibles:", DataGPSroute_ruta.value);
//     const bounds = getGeoJsonBounds(DataGPSroute_ruta.value);
//     if (bounds) {
//       calculateCenterAndZoom(bounds);
//     }
//   }
// });
</script>

<style scoped>
.container-general {
  background-color: #cccc;
  width: 100%;
  height: 80vh;
  padding: 1px;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
}

.map-wrap {
  height: 70vh; /* 30% de la altura del viewport */
  width: 100%; /* 80% del ancho del viewport */
  margin: 0 auto;
}
</style>
