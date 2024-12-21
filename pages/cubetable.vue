<template>
  <div>
    <v-container fluid class="text-center background pa-0">
      <div style="text-align: center">
        <v-card>
          <div class="pa-2 pa-md-2">
            <h1>Tabla de Datos Cube</h1>
          </div>
        </v-card>
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
            <template #loading>
              <img
                src="https://i.pinimg.com/originals/94/fd/2b/94fd2bf50097ade743220761f41693d5.gif"
                style="width: 100px; height: 80px"
              />
            </template>
            <template #header-status="header">
              <div>
                {{ header.text }}
                <div class="filter-menu" style="text-align: center">
                  <input
                    v-model="statusSearchValue"
                    placeholder="Buscar"
                    style="
                      text-align: center;
                      border: 1px solid gray;
                      font-weight: lighter;
                      background-color: #ffffff;
                    "
                  />
                </div>
              </div>
            </template>
            <template #header-month="header">
              <div>
                {{ header.text }}
                <div class="filter-menu" style="text-align: center">
                  <input
                    v-model="monthSearchValue"
                    placeholder="Buscar"
                    style="
                      text-align: center;
                      border: 1px solid gray;
                      font-weight: lighter;
                      background-color: #ffffff;
                    "
                  />
                </div>
              </div>
            </template>
            <template #header-createdAt="header">
              <div>
                {{ header.text }}
                <div class="filter-menu" style="text-align: center">
                  <input
                    v-model="createdAtSearchValue"
                    placeholder="Buscar"
                    style="
                      text-align: center;
                      border: 1px solid gray;
                      font-weight: lighter;
                      background-color: #ffffff;
                    "
                  />
                </div>
              </div>
            </template>
            <template #header-count="header">
              <div class="filter-column">
                {{ header.text }}
                <div class="filter-menu" style="text-align: center">
                  <input
                    v-model="countSearchValue"
                    placeholder="Buscar"
                    style="
                      text-align: center;
                      border: 1px solid gray;
                      width: 150px;
                      font-weight: lighter;
                      background-color: #ffffff;
                    "
                  />
                </div>
              </div>
            </template>
          </EasyDataTable>
        </div>
      </v-card>
    </v-container>
  </div>
</template>
<script setup lang="ts">
import type { Header, Item, FilterOption } from "vue3-easy-data-table";
import { ref, computed, onMounted } from "vue";

const count = await cubeApi();
const countObj = {
  count: count,
};
const countJson = JSON.stringify(countObj);
const countParsed = JSON.parse(countJson);
const data = countParsed.count._value.results[0].data;

const pageSize = 9;
const currentPage = ref(1);
const page = ref(3);
const searchField = ["status", "month", "createdAt", "count"];
const searchValue = ref();
const items2 = ["status", "month", "createdAt", "count"];

const totalPages = Math.ceil(data.length / pageSize);
const statusSearchValue = ref();
const monthSearchValue = ref();
const createdAtSearchValue = ref();
const countSearchValue = ref();

const filterOptions = computed((): FilterOption[] => {
  const filterOptionsArray: FilterOption[] = [];

  if (statusSearchValue.value) {
    filterOptionsArray.push({
      field: "status",
      comparison: (value, criteria): boolean =>
        value != null &&
        criteria != null &&
        typeof value === "string" &&
        value.includes(`${statusSearchValue.value}`),
      criteria: statusSearchValue.value,
    });
  }

  if (monthSearchValue.value) {
    filterOptionsArray.push({
      field: "month",
      comparison: (value, criteria): boolean =>
        value != null &&
        criteria != null &&
        typeof value === "string" &&
        value.includes(`${monthSearchValue.value}`),
      criteria: monthSearchValue.value,
    });
  }

  if (createdAtSearchValue.value) {
    filterOptionsArray.push({
      field: "createdAt",
      comparison: (value, criteria): boolean =>
        value != null &&
        criteria != null &&
        typeof value === "string" &&
        value.includes(`${createdAtSearchValue.value}`),
      criteria: createdAtSearchValue.value,
    });
  }

  if (countSearchValue.value) {
    filterOptionsArray.push({
      field: "count",
      comparison: (value, criteria): boolean =>
        value != null &&
        criteria != null &&
        typeof value === "string" &&
        value.includes(`${countSearchValue.value}`),
      criteria: countSearchValue.value,
    });
  }

  return filterOptionsArray;
});

const headers: Header[] = [
  {
    text: "Orders status",
    value: "status",
    sortable: true,
    width: 200,
  },
  {
    text: "Orders createdAt month",
    value: "month",
    sortable: true,
    width: 340,
  },
  {
    text: "Orders createdAt",
    value: "createdAt",
    sortable: true,
    width: 340,
  },
  {
    text: "Orders count",
    value: "count",
    sortable: true,
    width: 200,
  },
];

const items: Item[] = data.map((item: any) => ({
  status: item["Orders.status"],
  month: item["Orders.createdAt.month"],
  createdAt: item["Orders.createdAt"],
  count: item["Orders.count"],
}));

definePageMeta({
  // middleware: ["auth"],
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

.my-card {
  padding: 20px;
}
.customize-table {
  --easy-table-border: 1px solid #445269;
  --easy-table-row-border: 1px solid #445269;
  --easy-table-header-background-color: #bbdefb;
}
</style>
