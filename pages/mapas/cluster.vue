<template>
  <div id="map-wrap" style="height: 100vh">
    <l-map ref="map" :max-zoom="19" :zoom="zoom" :center="{ lat: 51.289404225298256, lng: 9.697202050919614 }"
      :useGlobalLeaflet="false" @ready="onLeafletReady">
      <template v-if="leafletReady">
        <l-tile-layer :url="url" />
        <l-marker-cluster :options="{ showCoverageOnHover: false, chunkedLoading: true, useGlobalLeaflet }">
          <l-marker-mod :lat-lng="[47.7515953048815, 8.757179159967961]" :options="{ useGlobalLeaflet }" @click="imprimir" >
            <l-popup-mod>
                        msg de prueba
            </l-popup-mod>
          </l-marker-mod>
          <l-marker-mod  :lat-lng="[54.379448751829784, 8.890621239746661]" @click="imprimir" >
            <l-popup-mod>
                        msg de prueba
            </l-popup-mod>
          </l-marker-mod>
          <l-marker-mod  :lat-lng="[48.41432462648719, 11.172363685423019]" @click="imprimir" >
            <l-popup-mod>
                        msg de prueba
            </l-popup-mod>
          </l-marker-mod>
          <!-- <l-marker-mod  :lat-lng="[54.34757868763789, 11.410597389004957]" @click="imprimir" />
          <l-marker-mod  :lat-lng="[51.741295879474464, 13.693138753473695]" @click="imprimir" />
          <l-marker-mod  :lat-lng="[53.574845165295145, 6.875185458821902]" @click="imprimir" /> -->
          <!-- <l-layer-group>
            <l-marker :lat-lng="[51.42494690949777, 6.901031944520698]" />
            <l-marker :lat-lng="[51.42494690949777, 6.901031944520698]" />
          </l-layer-group> -->
          <l-marker :lat-lng="[51.42494690949777, 6.901031944520698]">
            <l-popup>
              msg prueba 2
            </l-popup>
          </l-marker>
        </l-marker-cluster>
      </template>
    </l-map>
  </div>
</template>
<script>
import "leaflet/dist/leaflet.css";

import { LMap, LMarker, LTileLayer, LPopup } from "@vue-leaflet/vue-leaflet/src/lib";

import LMarkerCluster from "~~/components/cluster/components/LMarkerCluster.vue";
import LMarkerMod from "~~/components/cluster/components/LMarkerMod.vue";
import LPopupMod from "~~/components/cluster/components/LPopupMod.vue";

import { useClusterStore } from "~/stores/clusterStore";
//import { useCountResultsLocalitiesByCity } from "~/composables"

export default {
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LMarkerCluster,
    LMarkerMod,
    LPopup,
    LPopupMod,
  },

  data() {
    return {
      url: "https://{s}.tile.osm.org/{z}/{x}/{y}.png",
      zoom: 1,

      leafletReady: false,
      leafletObject: null,

      visible: false,

      useGlobalLeaflet: computed(() => LMap.props.useGlobalLeaflet),
    };
  },

  async mounted(){
    let data = await useCountResultsLocalitiesByCity([-74.11829863999992, 4.637411584847779])
    console.log(data)
  },

  methods: {
    async onLeafletReady() {
      await this.$nextTick();
      this.leafletObject = this.$refs.map.leafletObject;
      // console.log(LMap)
      // console.log(this.leafletObject)
      this.leafletReady = true;

      // const clusterStrore = useClusterStore();
      // console.log(clusterStrore.getNames)
      // console.log(clusterStrore.getFunctions)
    },

    imprimir(){
      this.leafletObject = this.$refs.map.leafletObject;
      //console.log(LMap)
      //console.log(this.leafletObject._lastCenter)
      console.log(this.leafletObject.getCenter())
      console.log(this.leafletObject.getZoom())
    },
  },
};
</script>


<!-- <template>
  <div id="map-wrap" style="height: 100vh">
      <l-map ref="map" :max-zoom="19" :zoom="5" :center="{ lat: 51.289404225298256, lng: 9.697202050919614 }" :useGlobalLeaflet="false"
        @ready="onLeafletReady"
      > 
        <template v-if="leafletReady">
          <l-tile-layer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png" />
          <l-marker-cluster
            :options="{ showCoverageOnHover: false, chunkedLoading: true, useGlobalLeaflet }"
          >
            <l-marker :lat-lng="[47.7515953048815, 8.757179159967961]" />
            <l-marker :lat-lng="[54.379448751829784, 8.890621239746661]" />
            <l-marker :lat-lng="[48.41432462648719, 11.172363685423019]" />
            <l-marker :lat-lng="[54.34757868763789, 11.410597389004957]" />
            <l-marker :lat-lng="[51.741295879474464, 13.693138753473695]" />
            <l-marker :lat-lng="[53.574845165295145, 6.875185458821902]" />
            <l-marker :lat-lng="[51.42494690949777, 6.901031944520698]" />
          </l-marker-cluster>
        </template> -->

        <!-- <l-marker-cluster :options="{useGlobalLeaflet}">
        
          <l-marker :lat-lng="[51.42494690949777, 6.901031944520698]" />

        </l-marker-cluster> -->


      <!-- </l-map>
  </div>
</template> -->

<!-- <script>
import "leaflet/dist/leaflet.css";
import { LMap, LMarker, LTileLayer } from "@vue-leaflet/vue-leaflet/src/lib";

import LMarkerCluster from "~~/components/cluster/components/LMarkerCluster.vue";

export default {

  data() {
    return {
      url: "https://{s}.tile.osm.org/{z}/{x}/{y}.png",
      zoom: 1,

      leafletReady: false,
      leafletObject: null,

      visible: false,

      useGlobalLeaflet: computed(() => LMap.props.useGlobalLeaflet),
    };
  },

  mounted(){
    const leafletObject = this.$refs.map;
  },

  methods: {
    async onLeafletReady() {
      await this.$nextTick();
      this.leafletObject = this.$refs.map.leafletObject;
      console.log(this.leafletObject)
      this.leafletReady = true;
    },
  },
}
</script> -->

<!-- <script>

import { LMap, LMarker, LTileLayer } from "@vue-leaflet/vue-leaflet";
import MarkerCluster from "~/components/MarkerCluster.vue";
import L from "leaflet";

//data
// const url = "https://{s}.tile.osm.org/{z}/{x}/{y}.png";
// const zoom = 1;
// const leafletReady = false;
// const leafletObject = null;
// const visible = false;

// let markers = L.markerClusterGroup();
// console.log(markers)
//markers.addLayer(L.marker(getRandomLatLng(map)));
//map.addLayer(markers);


export default {
  components: {
    LMap,
    LTileLayer,
    LMarker,
    MarkerCluster,
  },

  data() {

    // let customicon = icon(Object.assign({},
    //     Icon.Default.prototype.options,
    //     {iconUrl, shadowUrl}
    //   ))

    return {
      url: "https://{s}.tile.osm.org/{z}/{x}/{y}.png",
      zoom: 1,

      leafletReady: false,
      leafletObject: null,

      visible: false,

      //icon: customicon,
        clusterOptions: {},
    };
  },

  mounted() {
      console.log(LMap)
      setTimeout(() => {
        console.log('done')
        this.$nextTick(() =>{
          this.clusterOptions = { disableClusteringAtZoom: 11 }
        });
        this.leafletReady = true;
      }, 5000);
    },

    methods: {
      click: (e) => console.log("clusterclick", e),
      ready: (e) => console.log('ready', e),
    },
};
</script> -->
  