import type L from "leaflet";
import { type PropType, type Ref, h, onUnmounted, provide } from "vue";
import { useClusterStore } from "~/stores/clusterStore";

import {
  AddLayerInjection,
  BindPopupInjection,
  BindTooltipInjection,
  RemoveLayerInjection,
  UnbindPopupInjection,
  UnbindTooltipInjection,
} from "@vue-leaflet/vue-leaflet/src/types/injectionKeys";
import { assertInject, isFunction, propsToLeafletOptions } from "@vue-leaflet/vue-leaflet/src/utils";

import type { LayerType } from "@vue-leaflet/vue-leaflet/src/types/enums/LayerType";
import { componentProps, setupComponent } from "@vue-leaflet/vue-leaflet/src/functions/component";

export const layerProps = {
  ...componentProps,
  pane: {
    type: String,
  },
  attribution: {
    type: String,
  },
  name: {
    type: String,
    custom: true,
  },
  layerType: {
    type: String as PropType<LayerType>,
    custom: true,
  },
  visible: {
    type: Boolean,
    custom: true,
    default: true,
  },
} as const;

// TODO: Remove extra {options} definition if @types/leaflet updates to include it on Layer
export const setupLayer = (
  props,
  leafletRef,
  context,
  //provisional
  //addLayer?,
  //removeLayer?,
) => {

  const addLayer = inject("addLayer");
  const removeLayer = inject("removeLayer");

  // Codigo fuente
  // const addLayer = assertInject(AddLayerInjection);
  // const removeLayer = assertInject(RemoveLayerInjection);

  const { options: componentOptions, methods: componentMethods } =
    setupComponent(props);

  const options = propsToLeafletOptions<L.LayerOptions>(
    props,
    layerProps,
    componentOptions
  );

  const addThisLayer = () => addLayer({ leafletObject: leafletRef.value });
  /**
   *  TODO: crear un mejor manejador de errores
   * Lo ideal es utilizar el ciclo de vida de leafleat para deshabilitar esta funcion (como la prop ready) -> posible solucion
   * 
   * Error: al momento de cambiar de pagina o actualizar algo dentro de la pagina, la funcion removeLayer es undefined
   * (ya que se eliminan los marcadores) y esto genera un error.
   */
  const removeThisLayer = () => {
    /** Solucion provisional */
    if (removeLayer == undefined) {
      //console.log("null in removeLayer")
      return null;
    }
    /** */
    removeLayer({ leafletObject: leafletRef.value });
  };

  const methods = {
    ...componentMethods,
    setAttribution(val) {
      removeThisLayer();
      leafletRef.value.options.attribution = val;
      if (props.visible) {
        addThisLayer();
      }
    },
    setName() {
      removeThisLayer();
      if (props.visible) {
        addThisLayer();
      }
    },
    setLayerType() {
      removeThisLayer();
      if (props.visible) {
        addThisLayer();
      }
    },
    setVisible(isVisible) {
      if (leafletRef.value) {
        if (isVisible) {
          addThisLayer();
        } else {
          removeThisLayer();
        }
      }
    },
    bindPopup(leafletObject) {

      if (!leafletRef.value || !isFunction(leafletRef.value.bindPopup)) {
        console.warn(
          "Attempt to bind popup before bindPopup method available on layer."
        );

        return;
      }

      leafletRef.value.bindPopup(leafletObject);
    },
    bindTooltip(leafletObject) {
      if (!leafletRef.value || !isFunction(leafletRef.value.bindTooltip)) {
        console.warn(
          "Attempt to bind tooltip before bindTooltip method available on layer."
        );

        return;
      }

      leafletRef.value.bindTooltip(leafletObject);
    },
    unbindTooltip() {
      if (leafletRef.value) {
        if (isFunction(leafletRef.value.closeTooltip)) {
          leafletRef.value.closeTooltip();
        }
        if (isFunction(leafletRef.value.unbindTooltip)) {
          leafletRef.value.unbindTooltip();
        }
      }
    },
    unbindPopup() {
      if (leafletRef.value) {
        if (isFunction(leafletRef.value.closePopup)) {
          leafletRef.value.closePopup();
        }
        if (isFunction(leafletRef.value.unbindPopup)) {
          leafletRef.value.unbindPopup();
        }
      }
    },
    updateVisibleProp(value) {
      /**
       * Triggers when the visible prop needs to be updated
       * @type {boolean}
       * @property {boolean} value - value of the visible property
       */
      context.emit("update:visible", value);
    },
  };

  provide(BindPopupInjection, methods.bindPopup);
  provide(BindTooltipInjection, methods.bindTooltip);
  provide(UnbindPopupInjection, methods.unbindPopup);
  provide(UnbindTooltipInjection, methods.unbindTooltip);

  onUnmounted(() => {
    methods.unbindPopup();
    methods.unbindTooltip();
    removeThisLayer();
  });


  return { options, methods };
};

export const render = (ready, slots) => {
  if (ready && slots.default) {
    return h("div", { style: { display: "none" } }, slots.default());
  }
};
