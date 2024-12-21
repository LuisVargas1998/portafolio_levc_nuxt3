import type L from "leaflet";
import type { PropType } from "vue";

import { popperProps, setupPopper } from "./popperMod";

export const popupProps = {
  ...popperProps,
  latLng: {
    type: [Object, Array] as PropType<L.LatLngExpression>,
    default: () => [],
  },
} as const;

export const setupPopup = (props, leafletRef) => {
  const { options, methods } = setupPopper(props, leafletRef);

  return { options, methods };
};
