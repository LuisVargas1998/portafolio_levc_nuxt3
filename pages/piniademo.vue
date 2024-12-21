<template>
  <div>
    {{ dataFecha }}
  </div>
  <div>
    <br>
  </div>
  <div>
    {{ dataFechabetween  }}
  </div>
  <div>
    <br>
  </div>
  <div>
    {{ dataFiltro }}
  </div>
  <div>
    <br>
  </div>
  <div>
    {{ dataFechayFiltro }}
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import {
  getParchesByFecha,
  getParchesByFechaBetween,
  getParchesByFiltros,
} from "~~/composables/embeddingsApi";

const data0 = await getParchesByFecha("2022-10-31", 0, 5);
const data1 = await getParchesByFechaBetween("2022-11-01","2023-01-31", 0, 5);
const data2 = await getParchesByFiltros("M", "25-37", "none", 0, 5);
const data3 = await getParchesByFiltrosandFecha("2022-11-01","2023-01-31","M", "25-37", "none", 0, 5);

function convertJson(data: any) {
  const countObj = {
    count: data,
  };
  const countJson = JSON.stringify(countObj);
  const countParsed = JSON.parse(countJson);
  return countParsed.count._value.content;
}

const dataFecha = convertJson(data0);
const dataFechabetween = convertJson(data1);
const dataFiltro = convertJson(data2);
const dataFechayFiltro = convertJson(data3);
</script>
<style>
.button {
  color: white;
  min-width: 150px;
  background-color: #000000a1;
  height: 2.5rem;
  border-radius: 2rem;
  font-weight: 400;
  font-size: 0.8rem;
}
</style>