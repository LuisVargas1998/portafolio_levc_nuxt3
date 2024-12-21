<template>
  <div style="display: none">
      <slot v-if="ready"></slot>
  </div>
</template>

<script>

import { onMounted, ref, provide, nextTick } from "vue";

import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

import {
  layerProps,
  setupLayer,
  render
} from "../functions/layerMod";

import {
  WINDOW_OR_GLOBAL,
  assertInject,
  cancelDebounces,
  isFunction,
  propsBinder,
  remapEvents,
  updateLeafletWrapper
} from "@vue-leaflet/vue-leaflet/src/utils";

import {
  AddLayerInjection,
  CanSetParentHtmlInjection,
  RemoveLayerInjection,
  SetIconInjection,
  SetParentHtmlInjection,
  UseGlobalLeafletInjection,
} from "@vue-leaflet/vue-leaflet/src/types/injectionKeys";

import { useClusterStore } from "~/stores/clusterStore";

//import { MarkerCluster } from "../types";

const props = {
  options: {
    type: Object,
    default() {
      return {};
    },
  },
};


export default {
  name: "LMarkerCluster",

  //revisar
  //props: ['useGlobalLeaflet', 'addLayer'],
  props,

  setup(props, context) {

    const clusterStrore = useClusterStore();

    const leafletObject = ref({});
    const ready = ref(false);

    const useGlobalLeaflet = props.options.useGlobalLeaflet;
    // const useGlobalLeaflet2 = assertInject("UseGlobalLeafletInjection");
    // const useGlobalLeaflet3 = inject(UseGlobalLeafletInjection);

    /**
     * TODO: Implementar la inyección de estas dos funciones(AddLayerInjection, RemoveLayerInjection),  
     * sin necesidad de utilizar pinia (clusterStore) y sin modificar la libreria de @vue-leaflet
     * 
     * Revisar provideLeafletWrapper y updateLeafletWrapper de LMap para
     * una posible refactorizacion
     */

    //Set in utils - @vue-leaflet
    const addLayerToMainMap = clusterStrore.getFunctions[0];
    //const addLayerToMainMap = assertInject(AddLayerInjection);
    const removeLayerFromMainMap = clusterStrore.getFunctions[1];

    // const addLayer = assertInject(AddLayerInjection);
    // const removeLayer = assertInject(RemoveLayerInjection);

    // console.log(AddLayerInjection)
    // const addLayer2 = assertInject(AddLayerInjection);
    // console.log(addLayer2)

    // provide("canSetParentHtml", () => !!leafletObject.value.getElement());
    // provide(
    //   "setParentHtml",
    //   (html) => (leafletObject.value.getElement().innerHTML = html)
    // );
    provide('setIcon', (newIcon) => leafletRef.value.setIcon && leafletRef.value.setIcon(newIcon))
    provide("addLayer", (layer) => {
      // replace the provided addLayer function for child components of MarkerCluster so they add to the cluster rather than the map
      leafletObject.value.addLayer(layer.leafletObject);
    });
    provide("removeLayer", (layer) => {
      leafletObject.value.removeLayer(layer.leafletObject);
    });
    provide("useGlobalLeaflet", useGlobalLeaflet)

    provide(
      CanSetParentHtmlInjection,
      () => !!leafletRef.value.getElement()
    );
    provide(SetParentHtmlInjection, (html) => {
      (html) => (leafletRef.value.getElement().innerHTML = html)
    });
    // //Reemplazamos las funciones proveidas anteriormente
    // provide(AddLayerInjection, (layer) => {
    //   leafletObject.value.addLayer(layer.leafletObject);
    // });
    // provide(RemoveLayerInjection, (layer) => {
    //   leafletObject.value.removeLayer(layer.leafletObject);
    // });

    // let addLayerMod =(layer) => leafletObject.value.addLayer(layer.leafletObject);
    // clusterStrore.setFunctions(addLayerMod);

    // let removeLayerMod =(layer) => leafletObject.value.removeLayer(layer.leafletObject);
    // clusterStrore.setFunctions(removeLayerMod);

    // const methodsMods = {
    //     addLayer(layer) {
    //       //leafletObject.value.addLayer(layer.leafletObject);
    //       leafletObject.value.AddLayerInjection(layer.leafletObject)
    //     },
    //     removeLayer(layer) {
    //       leafletObject.value.RemoveLayerInjection(layer.leafletObject);
    //       }
    //     }

    // clusterStrore.setFunctions(methodsMods.addLayer)

    // updateLeafletWrapper(addLayer, methodsMods.addLayer);
    // updateLeafletWrapper(removeLayer, methodsMods.removeLayer);


    const { methods } = setupLayer(props, leafletObject, context);
    //const { methods } = setupLayer(props, leafletObject, context, (layer) => leafletObject.value.addLayer(layer.leafletObject), (layer) => leafletObject.value.removeLayer(layer.leafletObject));

    onMounted(async () => {
      //const { DomEvent, marker } = await import("leaflet/dist/leaflet-src.esm");

      const { DomEvent, marker } = useGlobalLeaflet
        ? WINDOW_OR_GLOBAL.L
        : await import("leaflet/dist/leaflet-src.esm");

      const { MarkerClusterGroup } = await import(
        "leaflet.markercluster/dist/leaflet.markercluster-src.js"
      );

      leafletObject.value = new MarkerClusterGroup(props.options);

      const listeners = remapEvents(context.attrs);

      leafletObject.value.on(listeners);
      //DomEvent.on(leafletObject.value, listeners);

      propsBinder(methods, leafletObject.value, props);

      addLayerToMainMap({
        ...props,
        ...methods,
        leafletObject: leafletObject.value,
      });
      ready.value = true;
      nextTick(() => context.emit("ready", leafletObject.value));

    });

    //   const eventHandlers = {
    //     moveHandler: debounce(methods.latLngSync),
    //   };



    //   onBeforeUnmount(() => cancelDebounces(eventHandlers));

    //   return { ready, leafletObject };
    // },

    //onBeforeUnmount(() => cancelDebounces(eventHandlers));

    onBeforeUnmount(
      () =>
        leafletObject.value &&
        leafletObject.value._leaflet_id &&
        removeLayerFromMainMap({ leafletObject: leafletObject.value })
    );

    return { ready, leafletObject };
  },

  render() {
    return render(this.ready, this.$slots);
  },
}
</script>


<!-- <script lang="ts">
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import {
inject,
nextTick,
onBeforeUnmount,
onMounted,
provide,
ref,
} from "vue";
import { propsBinder, remapEvents, provideLeafletWrapper } from "@vue-leaflet/vue-leaflet/src/utils";
import {
render,
setupLayer as layerSetup,
} from "@vue-leaflet/vue-leaflet/src/functions/layer";

//import { MarkerClusterGroup } from 'leaflet.markercluster'

const props = {
options: {
    type: Object,
    default() {
        return {};
    },
},
};

//https://codesandbox.io/s/vue-3-leaflet-marker-cluster-poc-fweeu?file=/components/MarkerCluster.vue:0-2600

export default {
name: "MarkerCluster",

props,

// emits: ['ready'],

setup(props, context) {
    const leafletRef = ref({});
    const ready = ref(false);
    const addLayerToMainMap = inject("addLayer");
    //const addLayerToMainMap = L.markerClusterGroup().addLayer;
    //console.log(L.markerClusterGroup().addLayer) //undefined
    const removeLayerFromMainMap = inject("removeLayer");
    //const removeLayerFromMainMap = L.markerClusterGroup().removeLayer;
    //console.log(removeLayerFromMainMap)  //undefined

    provide("canSetParentHtml", () => !!leafletRef.value.getElement());
    provide(
        "setParentHtml",
        (html) => {(leafletRef.value.getElement().innerHTML = html)
        console.log(html)}
    );

    // provide('setIcon', (newIcon) => leafletRef.value.setIcon && leafletRef.value.setIcon(newIcon))
    provide("addLayer", (layer) => {
        // replace the provided addLayer function for child components of MarkerCluster so they add to the cluster rather than the map
        leafletRef.value.addLayer(layer.leafletObject);
        console.log(layer)
    });
    provide("removeLayer", (layer) => {
        leafletRef.value.removeLayer(layer.leafletObject);
    });

    // const {options, methods} = markerSetup(props, leafletRef, context)

    const { methods } = layerSetup(props, leafletRef, context);

    onMounted(async () => {
        const { DomEvent, marker } = await import("leaflet/dist/leaflet-src.esm");

        const { MarkerClusterGroup } = await import(
            "leaflet.markercluster/dist/leaflet.markercluster-src.js"
        );
        leafletRef.value = new MarkerClusterGroup(props.options);

        const listeners = remapEvents(context.attrs);
        DomEvent.on(leafletRef.value, listeners);

        propsBinder(methods, leafletRef.value, props);

        addLayerToMainMap({
            ...props,
            ...methods,
            leafletObject: leafletRef.value,
        });

        ready.value = true;
        nextTick(() => context.emit("ready", leafletRef.value));
    });

    onBeforeUnmount(
        () =>
            leafletRef.value &&
            leafletRef.value._leaflet_id &&
            removeLayerFromMainMap({ leafletObject: leafletRef.value })
    );

    return { ready, leafletObject: leafletRef };
},
render() {
    return render(this.ready, this.$slots);
}
};
</script> -->

<!-- <script>
import { MarkerClusterGroup } from 'leaflet.markercluster'
import { propsBinder } from '@vue-leaflet/vue-leaflet/src/utils'
import { DomEvent } from 'leaflet'
const props = {
options: {
type: Object,
default() { return {}; },
},
};
export default {
props,
data() {
return {
  ready: false,
};
},
mounted() {
this.mapObject = new MarkerClusterGroup(this.options);
DomEvent.on(this.mapObject, this.$attrs);
propsBinder(this, this.mapObject, props);
console.log(this.$props)
this.ready = true;
//console.log(this.$parent)
this.parentContainer = this.findRealParent(this.$parent);
//console.log(this.parentContainer)
this.parentContainer.addLayer(this);
this.$nextTick(() => {
  this.$emit('ready', this.mapObject);
});
},
beforeDestroy() {
this.parentContainer.removeLayer(this);
},
methods: {
addLayer(layer, alreadyAdded) {
  if (!alreadyAdded) {
    this.mapObject.addLayer(layer.mapObject);
  }
},
removeLayer(layer, alreadyRemoved) {
  if (!alreadyRemoved) {
    this.mapObject.removeLayer(layer.mapObject);
  }
},
findRealParent(firstVueParent) {
    let found = false;
    while (firstVueParent && !found) {
        if (firstVueParent.mapObject === undefined) {
          firstVueParent = firstVueParent.$parent;
        } else {
          found = true;
        }
        console.log(firstVueParent, found)
    }
    return firstVueParent;
}
}
};
</script> -->
