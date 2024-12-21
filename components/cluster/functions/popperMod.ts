import { h } from "vue";


/* From component.ts in @vue-leaflet/vue-leaflet/src/functions  */
const componentProps = {
    options: {
      type: Object,
      default: () => ({}),
      custom: true,
    },
  } as const;
  
const setupComponent = (props) => {
    return { options: props.options, methods: {} };
  };

/*   */


export const popperProps = {
  ...componentProps,
  content: {
    type: String,
    default: null,
  },
} as const;

export const setupPopper = (props, leafletRef) => {
  const { options, methods: componentMethods } = setupComponent(props);

  const methods = {
    ...componentMethods,
    setContent(newVal) {
      if (leafletRef.value && newVal !== null && newVal !== undefined) {
        leafletRef.value.setContent(newVal);
      }
    },
  };

  return { options, methods };
};

export const render = (slots) => {
  if (slots.default) {
    return h("div", { ref: "root" }, slots.default());
  }
  return null;
};
