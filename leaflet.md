# Solución
1. instalar los paquetes "leaflet" y "@vue-leaflet/vue-leaflet"
2. crear el plugin "leaflet.client.js"
```
import {
    LIcon,
    LMap,
    LMarker,
    LPopup,
    LTileLayer,
  } from "@vue-leaflet/vue-leaflet";
  import L from "leaflet";
  
  export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.component("LMap", LMap);
    nuxtApp.vueApp.component("LTileLayer", LTileLayer);
    nuxtApp.vueApp.component("LMarker", LMarker);
    nuxtApp.vueApp.component("LIcon", LIcon);
    nuxtApp.vueApp.component("LPopup", LPopup);
  
    return {
      provide: {
        L,
      },
    };
  });
```
3. Agregar en nuxt.config.ts 
```
css: [
  'leaflet/dist/leaflet.css',
],
```


# Corrección modulo leaflet (Obsoleto)

1. Nos dirijimos a /node_modules/nuxt_leaflet/lib/module.js
    - Agregamos: ```import { addPlugin } from '@nuxt/kit'```
    - Eliminamos los ```this``` dentro del modulo

```
const { resolve } = require('path')
import { addPlugin } from '@nuxt/kit'

module.exports = async function module (moduleOptions) {
  const options = Object.assign({}, moduleOptions)

  // Add leaflet css
  options.css.push('leaflet/dist/leaflet.css')
  
  addPlugin({
    src: resolve(__dirname, 'templates/plugin.js'),
    fileName: 'nuxt-leaflet.js',
    ssr: false,
    options: options
  })
}
```

2. Agregamos en nuxt.config.ts el modulo 
```
['nuxt-leaflet', {css: []}],
```

3. Agregamos en tsconfig.json 
```
"compilerOptions": {
    "types": [
        "node",
        "@nuxt/vue-app",
        "nuxt-leaflet",
    ]}
```

4. Agregamos en nuxt.config.ts
```
    alias: {
    'leaflet': 'leaflet/dist/leaflet-src.js',
  },
 ```

5. Cambiamos ```import Vue from 'vue'``` por  ```import Vue from '../../../vue``` en node_modules/nuxt-leaflet/node_modules/vue2-leaflet/dist/components/LGridLayer.js

6. Cambiamos ```import Vue from 'vue'``` por ```import Vue from '../../node_modules/vue'``` en node_modules/nuxt-leaflet/lib/tempaltes/plugin.js para que tarbeje con el Vue local(vue 2)

7. Importamos los marcadores estaticos de la siguiente manera dentro de node_modules/nuxt-leaflet/lib/tempaltes/plugin.js
```
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
```
  - con el fin de evitar el require dentro de 
```
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl
})
``` 
- Código original (con error)
```
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
})
```

***Se soluciona errores con el servidor, pero los componentes no son cargados correctamente en el frontend***

