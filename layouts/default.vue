<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useDisplay } from "vuetify";
import Sidebar from "~~/components/layoutComponents/sidebar/Sidebar.vue";
import Header from "~~/components/layoutComponents/header/Header.vue";
import { useUserStore } from "~/stores/mystore";
const userStore = useUserStore();

useHead({
  title: "MaterialPro Free NuxtJs 3  Dashboard",
});
const drawer = ref(undefined || true);
const innerW = window.innerWidth;

const { mobile, smAndDown } = useDisplay();

onMounted(() => {
  if (innerW < 950) {
    drawer.value = !drawer.value;
  }

  console.log("mobile value " + mobile.value);
});
</script>
<template>
  <div>
    <v-app>
      <!-- ---------------------------------------------- -->
      <!---Header -->
      <!-- ---------------------------------------------- -->
      <v-app-bar elevation="0" color="primary">
        <div class="r-margin2"></div>
        <div class="pe-5">
          <NuxtLink to="/" class="d-flex">
            <img src="/images/logos/white-logo-icon.svg" />
            <img src="/images/logos/white-logo-text.svg" class="pl-3" />
          </NuxtLink>
        </div>
        <div class="r-margin"></div>
        <v-app-bar-nav-icon class="" @click="drawer = !drawer" />
        <v-app-bar-title class="">Menú de Proyectos</v-app-bar-title>
        <v-spacer />
        <!-- ---------------------------------------------- -->
        <!-- User Profile -->
        <!-- ---------------------------------------------- -->
        <v-menu v-if="smAndDown" bottom>
          <template v-slot:activator="{ props }">
            <v-btn icon v-bind="props">
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          <v-list>
            <NuxtLink v-if="userStore.isSuperAdmin" to="/superadmin">
              <v-list-item>
                <v-list-item-title>Super Administracion</v-list-item-title>
              </v-list-item>
            </NuxtLink>
            <NuxtLink
              v-if="userStore.isAdmin || userStore.isSuperAdmin"
              to="/admin"
            >
              <v-list-item>
                <v-list-item-title>Administracion</v-list-item-title>
              </v-list-item>
            </NuxtLink>
            <NuxtLink to="/profile">
              <v-list-item>
                <v-list-item-title>Perfil</v-list-item-title>
              </v-list-item>
            </NuxtLink>
            <NuxtLink to="/about">
              <v-list-item>
                <v-list-item-title>About</v-list-item-title>
              </v-list-item>
            </NuxtLink>
          </v-list>
        </v-menu>
        <div v-else class="d-flex">
          <NuxtLink
            v-if="userStore.isSuperAdmin"
            class="nuxt-link-exact-active"
            to="/superadmin"
          >
            <p>Super Administracion</p>
          </NuxtLink>
          <div class="r-margin2"></div>
          <NuxtLink
            v-if="userStore.isAdmin || userStore.isSuperAdmin"
            class="nuxt-link-exact-active"
            to="/admin"
          >
            <p>Administracion</p>
          </NuxtLink>
          <div class="r-margin2"></div>
          <NuxtLink class="nuxt-link-exact-active" to="/profile">
            <p>Perfil</p>
          </NuxtLink>
          <div class="r-margin2"></div>
          <NuxtLink class="nuxt-link-exact-active" to="/about">
            <p>About</p>
          </NuxtLink>
          <div class="r-margin2"></div>
        </div>

        <Header />
      </v-app-bar>
      <v-main>
        <!-- ---------------------------------------------- -->
        <!---Sidebar -->
        <!-- ---------------------------------------------- -->
        <v-navigation-drawer
          left
          :permanent="mdAndUp"
          elevation="10"
          app
          :temporary="mdAndDown"
          v-model="drawer"
          expand-on-hover
        >
          <Sidebar />
        </v-navigation-drawer>
        <v-container fluid class="page-wrapper">
          <slot />
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>
<style scoped>
.r-margin {
  width: 30px;
}
.r-margin2 {
  width: 30px;
}

.nuxt-link-exact-active {
  text-decoration: none; /* Quitar subrayado */
}

.nuxt-link-exact-active p {
  color: white; /* Heredar color del elemento padre */
}
</style>
