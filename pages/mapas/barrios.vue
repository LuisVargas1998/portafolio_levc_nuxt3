<template>
    <div id="map-wrap" style="height: 100vh">
        <client-only>
            <l-map :zoom=13 :center="[4.6482783,-74.2729649]" :useGlobalLeaflet="false">
                <l-tile-layer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"></l-tile-layer>
                <l-geo-json v-for="barrio in geojsonBarrios" :geojson="barrio" :options="{...geojsonOptions, fillColor: getFillColor(barrio.properties.SCACODIGO)}">
                    <l-popup @click="clickPopUp">
                        Barrio: {{ barrio.properties.SCANOMBRE }}
                    </l-popup>
                </l-geo-json>/>
            </l-map>
        </client-only>
    </div>
</template>
  
<script setup>
import useGeojson from "~/composables/useGeojson";
import { LMap, LTileLayer, LGeoJson, LPopup } from "@vue-leaflet/vue-leaflet";

const geojsonBarrios = useGeojson();

const geojsonOptions = {
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.7
}

function getFillColor(color){
    return `#${color}`;
}

function clickPopUp(){
    console.log("hola mundo")
}

</script>