<script setup lang="ts">
import { ref, watch } from "vue";
import sidebarItems from "./sidebarItems";
import subItems from "./subitems";
import { useUserStore } from "~/stores/mystore";
const userStore = useUserStore();

const sidebarMenu = ref(sidebarItems);
const subitems = ref(subItems);
</script>
<template>
  <div>
    <!-- ---------------------------------------------- -->
    <!---Navigation -->
    <!-- ---------------------------------------------- -->
    <div class="scrollnavbar">
      <div class="profile">
        <div class="profile-pic">
          <v-avatar size="45">
            <img :src="userStore.imagenurl" width="50" alt="Julia" />
          </v-avatar>
        </div>
        <div class="profile-name">
          <h5>{{ userStore.name }} {{ userStore.role }}</h5>
        </div>
      </div>
      <v-list v-model:opened="subitems.open" class="pa-4">
        <template v-for="(item, i) in sidebarMenu" :key="i">
          <template v-if="item.subItems">
            <v-list-group :value="item.title">
              <template v-slot:activator="{ props }">
                <v-list-item
                  v-bind="props"
                  :title="item.title"
                  :prepend-icon="item.icon"
                ></v-list-item>
              </template>
              <v-list-item
                class="pa-2 text-right d-flex justify-end"
                v-for="(subItem, j) in item.subItems"
                :key="j"
                :to="subItem.to"
              >
                <div class="d-flex align-items-center" style="flex: 1">
                  <v-list-item-action class="mr-2" style="flex: none">
                    <v-icon class="icon-container">{{ subItem.icon }}</v-icon>
                  </v-list-item-action>
                  <div style="flex: 5; align-items: right">
                    {{ subItem.title }}
                  </div>
                </div>
              </v-list-item>
            </v-list-group>
          </template>
          <template v-else>
            <v-list-item
              :to="item.to"
              :title="item.title"
              :prepend-icon="item.icon"
            ></v-list-item>
          </template>
        </template>
      </v-list>
    </div>
  </div>
</template>
<style scoped>
.icon-container {
    padding-left: 100px; /* ajusta el valor del margen según tus necesidades */
  }
  
</style>