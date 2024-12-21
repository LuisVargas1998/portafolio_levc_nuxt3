<template>
  <div id="map-wrap" style="height: 100vh">
    <l-map
      ref="map"
      :max-zoom="19"
      :zoom="zoom"
      :center="{ lat: 51.289404225298256, lng: 9.697202050919614 }"
      :useGlobalLeaflet="false"
      @ready="onLeafletReady"
    >
      <template v-if="leafletReady">
        <l-tile-layer :url="url" />
      </template>
    </l-map>
    <input
      type="range"
      v-model="timelineValue"
      min="0"
      max="100"
      @input="onTimelineChange"
      class="timeline"
    />
  </div>
</template>

<script>
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw";

export default {
  data() {
    return {
      leafletReady: false,
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      zoom: 13,
      timelineValue: 0,
    };
  },
  methods: {
    onLeafletReady(map) {
      this.leafletReady = true;

      const drawnItems = new L.FeatureGroup();
      map.addLayer(drawnItems);

      const drawControl = new L.Control.Draw({
        draw: {
          polyline: false,
          polygon: false,
          rectangle: true,
          circle: false,
          marker: false,
        },
        edit: {
          featureGroup: drawnItems,
        },
      });
      map.addControl(drawControl);

      map.on(L.Draw.Event.CREATED, function (event) {
        const layer = event.layer;
        drawnItems.addLayer(layer);
        if (event.layerType === "rectangle") {
          map.fitBounds(layer.getBounds());
        }
      });
    },
    onTimelineChange() {
      // Aquí puedes añadir el código para actualizar tu mapa basado en el valor del timeline
      console.log(this.timelineValue);
    },
  },
};
</script>

<style scoped>
/* Tu código CSS aquí */
.timeline {
  width: 100%;
}
</style>
