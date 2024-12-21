<template>
    <div>
        <v-container fluid class="text-center background pa-0">
            <div style="text-align: center">
                <v-card>
                    <div class="pa-2 pa-md-2">
                        <h1>Registros de la plataforma {{ paginationStore.getPortalSlug }}</h1>
                    </div>
                </v-card>
            </div>
            <div style="height: 20px"></div>
            <v-card class="my-card">
                <div>
                    <EasyDataTable 
                        v-model:server-options="serverOptions"
                        :server-items-length="serverItemsLength"
                        :loading="loading"
                        :headers="headers"
                        :items="items"
                        buttons-pagination
                    >
                        <!-- <template #loading>
                            <img src="https://i.pinimg.com/originals/94/fd/2b/94fd2bf50097ade743220761f41693d5.gif"
                                style="width: 100px; height: 80px" />
                        </template> -->
                        <!-- <template #header-status="header">
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
            </template> -->

                        <!-- <template #pagination="{ currentPaginationNumber, maxPaginationNumber, isFirstPage, isLastPage }">
                            <button :disabled="isFirstPage" @click="prevPage">
                                prev
                            </button>
                            <button>
                                {{currentPaginationNumber}}
                            </button>
                            <button>
                                {{maxPaginationNumber}}
                            </button>
                            <button :disabled="isLastPage" @click="nextPage">
                                next
                            </button>
                        </template> -->
                    </EasyDataTable>
                </div>
            </v-card>
        </v-container>
    </div>

    <!-- <Table :data="data" />

    <div class="pagination">
        <a @click="prevPage">prev page</a>
        <p> {{paginationStore.getPage}} </p>
        <a @click="nextPage">next page</a>
    </div> -->
</template>

<script setup lang="ts">
import { usePaginationStore } from "~/stores/paginationStore";
import { IdataPrisma } from '~/types/interfaces';
import type { ServerOptions, Item, Header } from "vue3-easy-data-table";
import { ref, Ref } from "vue";

const route = useRoute()
const paginationStore = usePaginationStore();

const { plataformaSlug } = route.params;
paginationStore.setPortalSlug(plataformaSlug);

const items = ref<DetalleRegistro[] | null | undefined>([]);
const loading = ref(false);
const serverItemsLength: Ref<number | null | undefined> = ref(0);
const serverOptions = ref<ServerOptions>({
    page: paginationStore.getPage,
    rowsPerPage: paginationStore.getPerPage,
});

const loadFromServer = async () => {

    loading.value = true;

    paginationStore.setPage(serverOptions.value.page);
    paginationStore.setPerPage(serverOptions.value.rowsPerPage);

    const { data }: { data: Ref<IdataPrisma | null> } = await usePrisma();

    items.value = data.value?.results;
    serverItemsLength.value = data.value?.totalRecords;

    loading.value = false;
};

// initial load
loadFromServer();


const headers = [
    { text: "id", value: "id" },
    { text: "lat", value: "lat" },
    { text: "lon", value: "lon" },
    { text: "link", value: "link" },
    { text: "midinmueble", value: "midinmueble" },
    { text: "rentPrice", value: "rentPrice" },
]

watch(serverOptions, (value) => { loadFromServer(); }, { deep: true });

// async function nextPage() {
//     paginationStore.increment();
//     loadFromServer();
// }

// async function prevPage() {
//     paginationStore.decrement();
//     loadFromServer();
// }
</script>

<style scoped>
.pagination {
    display: flex;
    align-items: center;
    justify-content: space-around;

    width: 200px;
    height: 30px;
}
</style>