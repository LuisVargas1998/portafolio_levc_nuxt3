<template>
  <div>
    <v-container fluid class="text-center background pa-0">
      <div>
        <div class="card-container">
          <v-row>
            <v-col md="3" sm="6" cols="12">
              <v-select
                v-model="searchField"
                :items="items2"
                label="Filtrar por"
                outlined
                class="mr-2"
                density="compact"
              ></v-select>
            </v-col>
            <v-col v-if="searchField === 'por Fecha'" md="3" sm="6" cols="12">
              <VueDatePicker
                class="my-datepicker"
                v-model="date"
                :enable-time-picker="false"
              ></VueDatePicker>
            </v-col>
            <v-col
              v-if="
                searchField === 'por Rango de Fechas' ||
                searchField === 'Todos los Filtros'
              "
              md="3"
              sm="6"
              cols="12"
            >
              <VueDatePicker
                class="my-datepicker2"
                v-model="date2"
                :enable-time-picker="false"
              ></VueDatePicker>
            </v-col>
            <v-col
              v-if="
                searchField === 'por Rango de Fechas' ||
                searchField === 'Todos los Filtros'
              "
              md="3"
              sm="6"
              cols="12"
            >
              <VueDatePicker
                class="my-datepicker2"
                v-model="date3"
                :enable-time-picker="false"
              ></VueDatePicker>
            </v-col>
            <v-col
              v-if="
                searchField === 'Edad Genero TrackId' ||
                searchField === 'Todos los Filtros'
              "
              md="2"
              sm="6"
              cols="12"
            >
              <v-text-field
                v-model="trackid"
                label="Track Id"
                density="compact"
              ></v-text-field>
            </v-col>
            <v-col
              v-if="
                searchField === 'Edad Genero TrackId' ||
                searchField === 'Todos los Filtros'
              "
              md="2"
              sm="6"
              cols="12"
            >
              <v-text-field
                v-model="genero"
                label="Genero"
                density="compact"
              ></v-text-field>
            </v-col>
            <v-col
              v-if="
                searchField === 'Edad Genero TrackId' ||
                searchField === 'Todos los Filtros'
              "
              md="2"
              sm="6"
              cols="12"
            >
              <v-text-field
                v-model="edad"
                label="Edad"
                density="compact"
              ></v-text-field>
            </v-col>
          </v-row>
          <div class="d-flex justify-center">
            <v-btn @click="updateTable()" color="secondary"> Filtrar </v-btn>
          </div>
        </div>
        <div style="height: 20px"></div>
        <v-card class="my-card">
          <div>
            <EasyDataTable
              show-index
              :rows-per-page="10"
              border-cell
              buttons-pagination
              :headers="headers"
              :items="items"
              header-text-direction="center"
              body-text-direction="center"
              :filter-options="filterOptions"
              table-class-name="customize-table"
            >
              <template #item-imagen="{ imgpath }">
                <Image :image-path="imgpath" :key="imgpath" />
              </template>
              <template #loading>
                <img
                  src="https://i.pinimg.com/originals/94/fd/2b/94fd2bf50097ade743220761f41693d5.gif"
                  style="width: 100px; height: 80px"
                />
              </template>
              <template #header-fecha="header">
                <div class="filter-column">
                  {{ header.text }}
                  <div class="filter-menu" style="text-align: center">
                    <input
                      v-model="fechaSearchValue"
                      placeholder="Buscar"
                      style="
                        text-align: center;
                        border: 1px solid gray;
                        font-weight: lighter;
                        width: 150px;
                        background-color: #ffffff;
                      "
                    />
                  </div>
                </div>
              </template>
              <template #header-trackId="header">
                <div class="filter-column">
                  {{ header.text }}
                  <div class="filter-menu" style="text-align: center">
                    <input
                      v-model="trackIdSearchValue"
                      placeholder="Buscar"
                      style="
                        text-align: center;
                        border: 1px solid gray;
                        font-weight: lighter;
                        width: 150px;
                        background-color: #ffffff;
                      "
                    />
                  </div>
                </div>
              </template>
              <template #header-genero="header">
                <div class="filter-column">
                  {{ header.text }}
                  <div class="filter-menu" style="text-align: center">
                    <input
                      v-model="generoSearchValue"
                      placeholder="Buscar"
                      style="
                        text-align: center;
                        border: 1px solid gray;
                        font-weight: lighter;
                        width: 80px;
                        background-color: #ffffff;
                      "
                    />
                  </div>
                </div>
              </template>
              <template #header-edad="header">
                <div class="filter-column">
                  {{ header.text }}
                  <div class="filter-menu" style="text-align: center">
                    <input
                      v-model="edadSearchValue"
                      placeholder="Buscar"
                      style="
                        text-align: center;
                        border: 1px solid gray;
                        font-weight: lighter;
                        width: 80px;
                        background-color: #ffffff;
                      "
                    />
                  </div>
                </div>
              </template>
              <template #item-milvus="Item">
                <div class="filter-column">
                  <div class="filter-menu2" style="text-align: center">
                    <v-btn
                      icon="mdi-account-search"
                      color="secondary"
                      @click="sendImage(Item.imgpath)"
                      to="/about"
                    ></v-btn>
                  </div>
                </div>
              </template>
            </EasyDataTable>
          </div>
        </v-card>
      </div>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import type { Header, Item, FilterOption } from "vue3-easy-data-table";
import { ref, computed, onMounted } from "vue";
import {
  getParchesByFecha,
  getParchesByFechaBetween,
  getParchesByFiltros,
} from "~~/composables/embeddingsApi";

import Datepicker from "vuejs3-datepicker";

const date = ref(new Date());
const date2 = ref();
const date3 = ref();

const fechaSearchValue = ref();
const trackIdSearchValue = ref();
const generoSearchValue = ref();
const edadSearchValue = ref();
const trackid = ref();
const genero = ref();
const edad = ref();

function sendImage(image: string) {
  console.log(image);
}

const pageSize = 9;
const currentPage = ref(1);
const page = ref(3);
const searchField = ref();
const searchValue = ref();
const items2 = [
  "por Fecha",
  "por Rango de Fechas",
  "Edad Genero TrackId",
  "Todos los Filtros",
];

const data0 = await getParchesByFecha("2022-10-31", 0, 25);
const data1 = await getParchesByFechaBetween("2022-11-01", "2023-01-31", 0, 5);
const data2 = await getParchesByFiltros("M", "25-37", "none", 0, 5);
const data3 = await getParchesByFiltrosandFecha(
  "2022-11-01",
  "2023-01-31",
  "M",
  "25-37",
  "none",
  0,
  5
);

function convertJson(data: any) {
  const countObj = {
    count: data,
  };
  const countJson = JSON.stringify(countObj);
  const countParsed = JSON.parse(countJson);
  return countParsed.count._value.content;
}

let data = convertJson(data0);

const totalPages = Math.ceil(data.length / pageSize);

let items: Item[] = ref(
  data.map((item: any) => ({
    fecha: item["fecha"],
    trackId: item["track_id"],
    genero: item["genero"],
    edad: item["edad"],
    imgpath: item["path_minio"],
  }))
);

function updateTable() {
  if (searchField.value == "por Fecha") {
    console.log("Updating");
    const fechaIni = date.value.toISOString().substring(0, 10);
    //0 ES LA PAGINA Y 25 EL NUMERO DE ELEMENTOS
    getParchesByFecha(fechaIni, 0, 25).then((result) => {
      const data = convertJson(result);
      const newitems = data.map((item: any) => ({
        fecha: item["fecha"],
        trackId: item["track_id"],
        genero: item["genero"],
        edad: item["edad"],
        imgpath: item["path_minio"],
      }));
      items.value = newitems;
    });
  }

  if (searchField.value == "por Rango de Fechas") {
    console.log("Updating");
    const fechaIni = date2.value.toISOString().substring(0, 10);
    const fechaFin = date3.value.toISOString().substring(0, 10);
    //0 ES LA PAGINA Y 25 EL NUMERO DE ELEMENTOS
    getParchesByFechaBetween(fechaIni, fechaFin, 0, 25).then((result) => {
      const data = convertJson(result);
      const newitems = data.map((item: any) => ({
        fecha: item["fecha"],
        trackId: item["track_id"],
        genero: item["genero"],
        edad: item["edad"],
        imgpath: item["path_minio"],
      }));
      items.value = newitems;
    });
  }

  if (searchField.value == "Edad Genero TrackId") {
    console.log("Updating");
    //0 ES LA PAGINA Y 25 EL NUMERO DE ELEMENTOS
    getParchesByFiltros(genero.value, edad.value, trackid.value, 0, 25).then(
      (result) => {
        const data = convertJson(result);
        const newitems = data.map((item: any) => ({
          fecha: item["fecha"],
          trackId: item["track_id"],
          genero: item["genero"],
          edad: item["edad"],
          imgpath: item["path_minio"],
        }));
        items.value = newitems;
      }
    );
  }

  if (searchField.value == "Todos los Filtros") {
    console.log("Updating");
    const fechaIni = date2.value.toISOString().substring(0, 10);
    const fechaFin = date3.value.toISOString().substring(0, 10);
    //0 ES LA PAGINA Y 25 EL NUMERO DE ELEMENTOS
    getParchesByFiltrosandFecha(
      fechaIni,
      fechaFin,
      genero.value,
      edad.value,
      trackid.value,
      0,
      25
    ).then((result) => {
      const data = convertJson(result);
      const newitems = data.map((item: any) => ({
        fecha: item["fecha"],
        trackId: item["track_id"],
        genero: item["genero"],
        edad: item["edad"],
        imgpath: item["path_minio"],
      }));
      items.value = newitems;
    });
  }
}

const headers: Header[] = [
  {
    text: "Fecha",
    value: "fecha",
    sortable: true,
    width: 200,
  },
  {
    text: "Track_id",
    value: "trackId",
    sortable: true,
    width: 200,
  },
  {
    text: "Genero",
    value: "genero",
    sortable: true,
    width: 100,
  },
  {
    text: "Edad",
    value: "edad",
    sortable: true,
    width: 100,
  },
  {
    text: "Imagen",
    value: "imagen",
    width: 300,
  },
  {
    text: "Similitud",
    value: "milvus",
    width: 100,
  },
];

const filterOptions = computed((): FilterOption[] => {
  const filterOptionsArray: FilterOption[] = [];

  if (fechaSearchValue.value) {
    filterOptionsArray.push({
      field: "fecha",
      comparison: (value, criteria): boolean =>
        value != null &&
        criteria != null &&
        typeof value === "string" &&
        value.includes(`${fechaSearchValue.value}`),
      criteria: fechaSearchValue.value,
    });
  }

  if (trackIdSearchValue.value) {
    filterOptionsArray.push({
      field: "trackId",
      comparison: (value, criteria): boolean =>
        value != null &&
        criteria != null &&
        typeof value === "string" &&
        value.includes(`${trackIdSearchValue.value}`),
      criteria: trackIdSearchValue.value,
    });
  }

  if (generoSearchValue.value) {
    filterOptionsArray.push({
      field: "genero",
      comparison: (value, criteria): boolean =>
        value != null &&
        criteria != null &&
        typeof value === "string" &&
        value.includes(`${generoSearchValue.value}`),
      criteria: generoSearchValue.value,
    });
  }

  if (edadSearchValue.value) {
    filterOptionsArray.push({
      field: "edad",
      comparison: (value, criteria): boolean =>
        value != null &&
        criteria != null &&
        typeof value === "string" &&
        value.includes(`${edadSearchValue.value}`),
      criteria: edadSearchValue.value,
    });
  }

  return filterOptionsArray;
});

definePageMeta({
  //middleware: ["auth"],
});
</script>

<style scoped>
.filter-column {
  align-items: center;
  text-align: center;
  padding: 5px;
}

.filter-header {
  display: block;
  margin-right: 5px;
}

.filter-menu {
  text-align: center;
  padding: 5px;
}

.filter-menu2 {
  text-align: center;
  padding: 15px;
}

.my-card {
  padding: 20px;
}

.customize-table {
  --easy-table-border: 1px solid #445269;
  --easy-table-row-border: 1px solid #445269;
  --easy-table-header-background-color: #bbdefb;
}

.my-datepicker {
  position: relative;
  z-index: 9999;
}

.my-datepicker2 {
  position: relative;
  z-index: 9999;
}

.card-container {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
}
</style>
