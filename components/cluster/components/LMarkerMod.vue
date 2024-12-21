<script lang="ts">
import { onMounted, ref, provide, inject, nextTick } from "vue";
import {
  WINDOW_OR_GLOBAL,
  propsBinder,
  remapEvents,
} from "@vue-leaflet/vue-leaflet/src/utils.js";
import {
  markerProps,
  setupMarker,
} from "../functions/markerMod";
import { render } from "@vue-leaflet/vue-leaflet/src/functions/layer";

import { debounce } from "ts-debounce";
import {
  CanSetParentHtmlInjection,
  SetIconInjection,
  SetParentHtmlInjection,
} from "@vue-leaflet/vue-leaflet/src/types/injectionKeys";

/**
 * Marker component, lets you add and personalize markers on the map
 */
export default {
  name: "LMarkerMod",
  props: markerProps,
  setup(props, context) {
    const leafletRef = ref({});
    const ready = ref(false);

    /**
     * FIX ERROR: fix error in bindPopup
     * inject "false" from cluster to provied this value in the childs node (popupMod)
     */
    const useGlobalLeaflet = inject("useGlobalLeaflet");
    const addLayer = inject("addLayer");
    const removeLayer = inject("removeLayer");

    provide(
      CanSetParentHtmlInjection,
      () => !!leafletObject.value?.getElement()
    );
    provide(SetParentHtmlInjection, (html) => {
      const el =
        isFunction(leafletObject.value?.getElement) &&
        leafletObject.value?.getElement();
      if (!el) return;
      el.innerHTML = html;
    });
    provide(
      SetIconInjection,
      (newIcon) =>
        leafletObject.value?.setIcon && leafletObject.value.setIcon(newIcon)
    );
    // provide("canSetParentHtml", () => !!leafletRef.value.getElement());
    // provide(
    //   "setParentHtml",
    //   (html) => (leafletRef.value.getElement().innerHTML = html)
    // );
    // provide(
    //   "setIcon",
    //   (newIcon) => leafletRef.value.setIcon && leafletRef.value.setIcon(newIcon)
    // );
    const { options, methods } = setupMarker(props, leafletRef, context);
    if (options.icon === undefined) {
      // If the options objection has a property named 'icon', then Leaflet will overwrite
      // the default icon with it for the marker, _even if it is undefined_.
      // This leads to the issue discussed in https://github.com/vue-leaflet/vue-leaflet/issues/130
      delete options.icon;
    }

    onMounted(async () => {
      const { marker, DomEvent } = useGlobalLeaflet
        ? WINDOW_OR_GLOBAL.L
        : await import("leaflet/dist/leaflet-src.esm");
      leafletRef.value = marker(props.latLng, options);

      const listeners = remapEvents(context.attrs);
      DomEvent.on(leafletRef.value, listeners);

      leafletRef.value.on("move", debounce(methods.latLngSync, 100));
      propsBinder(methods, leafletRef.value, props);
      addLayer({
        ...props,
        ...methods,
        leafletObject: leafletRef.value,
      });
      ready.value = true;
      nextTick(() => context.emit("ready", leafletRef.value));
    });

    return { ready, leafletObject: leafletRef };
  },
  
  render() {
    return render(this.ready, this.$slots);
  },
};
</script>
