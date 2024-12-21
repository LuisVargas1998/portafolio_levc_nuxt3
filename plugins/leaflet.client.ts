import {
    LIcon,
    LMap,
    LMarker,
    LPopup,
    LTileLayer,
    LControl,
} from "@vue-leaflet/vue-leaflet";
import L from "leaflet";
import 'leaflet.markercluster/src';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.component("LMap", LMap);
    nuxtApp.vueApp.component("LTileLayer", LTileLayer);
    nuxtApp.vueApp.component("LMarker", LMarker);
    nuxtApp.vueApp.component("LIcon", LIcon);
    nuxtApp.vueApp.component("LPopup", LPopup);
    nuxtApp.vueApp.component("LControl", LControl);

    return {
        provide: {
            L,
        },
    };
});
