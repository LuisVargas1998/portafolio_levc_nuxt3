<template>
  <div class="container-general">
    <div class="content-wrapper">
      <!-- Container Izquierda (2/3 del ancho) -->
      <div class="container_izquierda">
        <!-- Filtro Visual -->
        <div class="container_filtro_visual">Filtro Visual</div>

        <!-- Título Mapa -->
        <div class="container_titulo_mapa">Ruta Mapa</div>

        <!-- Mapa -->
        <div class="container_mapa">Mapa</div>

        <!-- Detalles -->
        <div class="container_detalle">
          <div class="container_imagen">Imagen</div>
          <div class="container_tabla_detalle">Tabla Detalle</div>
        </div>
      </div>

      <!-- Container Derecha (1/3 del ancho) -->
      <div class="container_derecha">
        <!-- Título Tabla -->
        <div class="container_titulo_tabla">Detecciones</div>

        <!-- Tabla -->
        <div class="container_tabla">Tabla</div>

        <!-- Paginación -->
        <div class="container_paginacion">Paginación</div>

        <!-- Título Filtro Objeto -->
        <div class="container_titulo_filtro_objeto">Filtro por Objeto</div>

        <!-- Filtro Objeto -->
        <div class="container_filtro_objeto">Filtro por Objeto</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useDisplay } from "vuetify";

// Puedes usar useDisplay aquí si es necesario
const { mobile } = useDisplay();
</script>

<style scoped>
.container-general {
  background-color: "primary";
  width: 100%;
  height: 80vh;
  padding: 1px;
  box-sizing: border-box;
}

.content-wrapper {
  display: flex;
  width: 100%;
  height: 100%;
}

.container_izquierda {
  background-color: primary; /* Fucsia */
  width: 66.66%;
  display: flex;
  flex-direction: column;
  padding: 10px;
}

.container_derecha {
  background-color: "primary";
  width: 33.33%;
  display: flex;
  flex-direction: column;
  padding: 10px;
}

.container_filtro_visual {
  background-color: #19485f6c;
  height: 10%;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.container_titulo_mapa {
  background-color: #19485f;
  height: 5%;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.container_mapa {
  background-color: #e7e9ed;
  height: 50%;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.container_detalle {
  background-color: #e7e9ed;
  display: flex;
  height: 35%;
}

.container_imagen {
  background-color: #ffff00; /* Amarillo */
  width: 50%;

  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.container_tabla_detalle {
  background-color: #e7e9ed; /* Verde */
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.container_titulo_tabla {
  background-color: #19485f;
  height: 5%;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.container_tabla {
  background-color: #ffffff; /* Azul */
  height: 60%;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.container_paginacion {
  background-color: #ffffff; /* Gris */
  height: 5%;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.container_titulo_filtro_objeto {
  background-color: #19485f;
  height: 5%;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.container_filtro_objeto {
  background-color: #ffffff; /* Azul */
  height: 30%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
