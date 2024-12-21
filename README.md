# Ejecutar servicios

Ejecutar:
1. docker build -t frontvivienda .
2. docker run -p 3000:3000 frontvivienda

## Api Geoespacial
Iniciar Api https://git.isipoint.co:7493/proyectovivienda/apigeospatial para proveer a nuxt con los registros

# Info adicional

## Proyecto Nuxt
Instalar Proyecto

```
npm install
```

Ejecutar

```
npm run dev
```

## patch
Aplicar parches de las librerias modificadas 

* Al momento de instalar el proyecto ( ``` npm install ``` ) los parches se aplican automaticamente.

Código para aplicar los parches manualmente:

```bash
npm run postinstall
```

Librerias modificadas:
* @vue-leaflet/vue-leaflet
* leaflet.markercluster
