<template>
    <div id="map-wrap" style="height: 100vh">
            <l-map ref="mapRef" :zoom="initialZoom" :max-zoom="maxZoom" :center="[center.x, center.y]" :useGlobalLeaflet="false" 
            @update:center="updateMapData" @ready="onLeafletReady">
            <l-control
                class="leaflet-control leaflet-demo-control"
                position="topleft">
                <button-query-mode @query-by-barrios="queryByBarrios" @query-by-geolocalization="queryByGeolocalization" />
            </l-control>
            <template v-if="leafletReady">
                <l-tile-layer :url="urlMap"></l-tile-layer>
                <l-geo-json v-for="barrio in geojsonBarrios" :geojson="barrio" 
                    :options="{...geojsonOptions, fillColor: getFillColor(barrio.properties.SCACODIGO)}" 
                    @click="clickQueryByBarrio(barrio)"
                >
                    <l-popup>
                        Barrio: {{ barrio.properties.SCANOMBRE }}
                    </l-popup>
                </l-geo-json>
                
                    <l-marker-cluster :options="{ showCoverageOnHover: false, chunkedLoading: true, useGlobalLeaflet:false }">
                        <template v-if="flagResults" v-for="record in records">
                            <l-marker-mod :lat-lng="record.location" @click="setUrlDetalle(record)">
                                <l-popup-mod>
                                    <template v-for="plataforma in plataformas">
                                        <NuxtLink :to="`/registro/detalle/${plataforma}`" @click="leafletReady=false">
                                            Ver detalle en {{ plataforma }}
                                        </NuxtLink>
                                    </template>
                                </l-popup-mod>
                            </l-marker-mod>
                        </template>
                    </l-marker-cluster>
            </template>
                <template v-if="flagLocalities" v-for="record in records">
                    <l-marker :lat-lng="record.centerOfLocality">
                        <l-popup>
                                {{record.numberOfResults}}
                        </l-popup>
                    </l-marker>
                </template>
            </l-map>
    </div>
</template>

<script lang="ts">
import "leaflet/dist/leaflet.css";
import { Point } from "leaflet";

import { LMap, LMarker, LGeoJson, LTileLayer, LPopup, LControl } from "@vue-leaflet/vue-leaflet/src/lib";

import LMarkerCluster from "~~/components/cluster/components/LMarkerCluster.vue";
import LMarkerMod from "~~/components/cluster/components/LMarkerMod.vue";
import LPopupMod from "~~/components/cluster/components/LPopupMod.vue";

import ButtonQueryMode from "~/components/leafletComponents/ButtonQueryMode.vue"

import useGeojson from "~/composables/useGeojson";
import { useRegistroStore } from "~/stores/registroStore";

import { IFeaturesBarrio, IGeometry, ILocationRegistros, ILocalityWithNumberOfRecords } from "~/types/interfaces"
//import { useCountResultsLocalitiesByCity } from "~/composables"

/**
 * TODO: revisar error, despues de volver de la pagina de detalle, el mapa no carga los markers
 * 
 *  TypeError: Cannot read properties of undefined (reading '_leaflet_pos')
 */

export default defineComponent({
  components: {
    LMap,
    LTileLayer,
    LMarkerCluster,
    LMarkerMod,
    LPopupMod,
    LGeoJson,
    LPopup,
    LMarker,
    LControl,
    ButtonQueryMode
  },

  data() {
    return {
      urlMap: "https://{s}.tile.osm.org/{z}/{x}/{y}.png" as string,
      initialZoom: 12 as number,
      maxZoom: 17 as number,

      leafletReady: false as boolean,
      leafletObject: null as any,
      useGlobalLeaflet: computed(() => LMap.props.useGlobalLeaflet) as any,

      records: null as ILocationRegistros[] | ILocalityWithNumberOfRecords[] | null,

      center: new Point(4.636438478000059, -74.106623303999982) as Point,

      geojsonBarrios: null as IFeaturesBarrio[] | null,
      geojsonOptions: {
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
      },

      //reviasr
      registroStore: useRegistroStore(),

      flagLocalities: false as boolean,
      flagResults: false as boolean,

      // false -> busqueda por geolacalización activa 
      // true -> busqueda por barrios activa
      flagQueryType: false as boolean,

      plataformas: [] as string[],

      path: "/registro/detalle/"
    };
  },

  async mounted(){
    this.geojsonBarrios = await useGeojson();
  },

  methods: {

    getFillColor(color: string){
        return `#${color}`;
    },

    async onLeafletReady() {
      await this.$nextTick();
      this.leafletObject = this.$refs.mapRef.leafletObject;
      this.leafletReady = true;
    },

    area(poly: IGeometry){
        let s = 0.0;
        let ring = poly.coordinates[0];
        for(let i= 0; i < (ring.length-1); i++){
        s += (ring[i][0] * ring[i+1][1] - ring[i+1][0] * ring[i][1]);
        }
        return 0.5 *s;
    },
    centroid(poly: IGeometry){
        let c = [0,0];
        let ring = poly.coordinates[0];
        for(let i= 0; i < (ring.length-1); i++){
        c[0] += (ring[i][0] + ring[i+1][0]) * (ring[i][0]*ring[i+1][1] - ring[i+1][0]*ring[i][1]);
        c[1] += (ring[i][1] + ring[i+1][1]) * (ring[i][0]*ring[i+1][1] - ring[i+1][0]*ring[i][1]);
        }
        let a = this.area(poly);
        c[0] /= a *6;
        c[1] /= a*6;
        return c;
    },

    async clickQueryByBarrio(barrio: IFeaturesBarrio){
        if(this.flagQueryType){
            let centerOfArea = this.centroid(barrio.geometry);
            this.center = new Point(centerOfArea[1], centerOfArea[0]);

            const { data } = await useFetch<ILocationRegistros[]>(
                `http://127.0.0.1:8080/results/results-by-geojson`, 
                {
                    method: 'POST',
                    body: { coordinates: barrio.geometry.coordinates }
                }
            )

            this.records = data.value;
            console.log(this.records)
            
            console.log(this.$refs.mapRef.mapObject)
            this.initialZoom = 13;
        }
    },

    async reqResultsByPoint(point: number[], currentZoom: number){

        if(currentZoom > 17) currentZoom = 17;

        const data = await useResultsByPoint(point, currentZoom);

        this.flagLocalities = false;
        this.flagResults = true;

        this.records = data;
    } ,

    updateMapData(){
        if(!this.flagQueryType){
            let leafletObject = this.$refs.mapRef.leafletObject;
            //revisar
            let currentZoom = leafletObject.getZoom();
            // [lat, lon]
            let centerPoint = [leafletObject.getCenter().lng, leafletObject.getCenter().lat];

            if(currentZoom > 14) this.reqResultsByPoint(centerPoint, currentZoom);
            //if(currentZoom <= 14) this.reqTotalResultsByLocality(centerPoint);
        }
    },

    setUrlDetalle(record: ILocationRegistros){
        //reset ids of record
        // urlDetalle.value = `/registro/detalle?`;

        this.registroStore.setIdMetrocuadrado(record.midinmueble_metrocuadrado);
        this.registroStore.setIdCiencuadras(record.midinmueble_ciencuadras);
        this.registroStore.setIdFincaraiz(record.midinmueble_fincaraiz);

        this.plataformas = this.registroStore.getActivePlataforms;
    },

    async reqTotalResultsByLocality(point: number[]){
        const data = await useCountResultsLocalitiesByCity(point);
        console.log(data.value)

        this.flagLocalities = true;
        this.flagResults = false;

        this.records = data.value;
    },

    queryByBarrios(){
        /**
         * TODO: cambiar los geojson a los barrios
         */
        console.log("queryByBarrios");
        this.flagQueryType = true;
        this.records = null;
    },

    queryByGeolocalization(){
        /**
         * TODO: cambiar los geojson a las localidades
         */
        console.log("queryByGeolocalization");
        this.flagQueryType = false;
        this.records = null;
    },

  },
});
</script>
  
<!-- <script setup lang="ts">
import "leaflet/dist/leaflet.css";
import useGeojson from "~/composables/useGeojson";
import { useRegistroStore } from "~/stores/registroStore";
import { IFeaturesBarrio, IGeometry, ILocationRegistros, ILocalityWithNumberOfRecords } from "~/types/interfaces"
import { LMap, LMarker, LTileLayer, LGeoJson, LPopup } from "@vue-leaflet/vue-leaflet";
import { Point } from "leaflet";
import { Ref } from "vue";

import LMarkerCluster from "~~/components/cluster/components/LMarkerCluster.vue";
import LMarkerMod from "~~/components/cluster/components/LMarkerMod.vue";
import LPopupMod from "~~/components/cluster/components/LPopupMod.vue";


//data of map
const urlMap: string = "http://{s}.tile.osm.org/{z}/{x}/{y}.png";
let initalZoom: Ref<number> = ref(12);
let center: Ref<Point> = ref( new Point(4.636438478000059, -74.106623303999982) );
let records: Ref<ILocationRegistros[] | null> = ref(null);
let x: Ref<number> = ref(0);
const mapRef = ref(null);

let flagResults: Ref<boolean> = ref(false)
let flagLocalities: Ref<boolean> = ref(false)

let useGlobalLeaflet = computed(() => LMap.props.useGlobalLeaflet);
let leafletReady = ref(false);

//let ids: Ref<string[]> = ref([])
//let urlDetalle: Ref<string> = ref("")
const registroStore = useRegistroStore();

// Data de los barrios
const geojsonBarrios = await useGeojson();
const geojsonOptions = {
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.7
}

function getFillColor(color: string){
    return `#${color}`;
}

function area(poly: IGeometry){
    let s = 0.0;
    let ring = poly.coordinates[0];
    for(let i= 0; i < (ring.length-1); i++){
      s += (ring[i][0] * ring[i+1][1] - ring[i+1][0] * ring[i][1]);
    }
    return 0.5 *s;
  }
function centroid(poly: IGeometry){
    let c = [0,0];
    let ring = poly.coordinates[0];
    for(let i= 0; i < (ring.length-1); i++){
      c[0] += (ring[i][0] + ring[i+1][0]) * (ring[i][0]*ring[i+1][1] - ring[i+1][0]*ring[i][1]);
      c[1] += (ring[i][1] + ring[i+1][1]) * (ring[i][0]*ring[i+1][1] - ring[i+1][0]*ring[i][1]);
    }
    let a = area(poly);
    c[0] /= a *6;
    c[1] /= a*6;
    return c;
  }
async function clickPopUp(barrio: IFeaturesBarrio){

    let centerOfArea = centroid(barrio.geometry);
    center.value = new Point(centerOfArea[1], centerOfArea[0]);

    const { data } = await useFetch<ILocationRegistros[]>(
        `http://localhost:8080/results/results-by-geojson`, 
        {
            method: 'POST',
            body: { coordinates: barrio.geometry.coordinates }
        }
    )

    records.value = data.value;

    initalZoom.value = 13;
}
async function reqResultsByPoint(point: number[], currentZoom: number){

    if(currentZoom > 17) currentZoom = 17;

    const data = await useResultsByPoint(point, currentZoom);

    flagLocalities.value = false;
    flagResults.value = true;

    records.value = data;
} 
// async function reqTotalResultsByLocality(point: number[]){

//     const data = await useCountResultsLocalitiesByCity(point);

//     console.log(data)

//     flagLocalities.value = true;
//     flagResults.value = false;

//     records.value = data;
// }

function setUrlDetalle(record: ILocationRegistros){

    //reset ids of record
    // urlDetalle.value = `/registro/detalle?`;

    // if(record["midinmueble_metrocuadrado"] != null) urlDetalle.value += `metrocuadrado=${record.midinmueble_metrocuadrado}&`
    // if(record["midinmueble_ciencuadras"] != null) urlDetalle.value += `ciencuadras=${record.midinmueble_ciencuadras}&`
    // if(record["midinmueble_fincaraiz"] != null) urlDetalle.value   += `fincaraiz=${record.midinmueble_fincaraiz}&`

    if(record["midinmueble_metrocuadrado"] != null) registroStore.setIdMetrocuadrado(record.midinmueble_metrocuadrado);
    if(record["midinmueble_ciencuadras"] != null) registroStore.setIdCiencuadras(record.midinmueble_ciencuadras);
    if(record["midinmueble_fincaraiz"] != null) registroStore.setIdFincaraiz(record.midinmueble_fincaraiz);

}

function updateMapData(){

    let leafletObject = mapRef.value.leafletObject;
    //revisar
    let currentZoom = leafletObject.getZoom();
    // [lat, lon]
    let centerPoint = [leafletObject.getCenter().lng, leafletObject.getCenter().lat];

    if(currentZoom > 13) reqResultsByPoint(centerPoint, 15);
    //if(currentZoom < 14 && currentZoom > 10) reqTotalResultsByLocality(centerPoint);

    console.log(currentZoom)
    console.log(centerPoint)
}


//Leafleat cluster
async function onLeafletReady() {
      await nextTick();
      console.log("msg from nextTock")
      leafletReady.value = true;
    }

</script> -->