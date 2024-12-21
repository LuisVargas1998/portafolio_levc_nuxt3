<script lang="ts" setup>
import { ref } from "vue";
import { useUserStore } from "~/stores/mystore";
import { useDisplay } from "vuetify";
const userStore = useUserStore();

const userprofile = ref([
  {
    title: "My Profile",
    desc: "Account Settings",
  },
  {
    title: "My Inbox",
    desc: "Messages & Emails",
  },
  {
    title: "My Tasks",
    desc: "To-do and Daily Tasks",
  },
]);

const logout = async () =>{
  userStore.logout = true;
  userStore.auth = false;
  console.log(userStore.isLogOut) 
  localStorage.setItem('auth', false.toString());
  localStorage.setItem('role', '');
  localStorage.setItem('name', '');
  localStorage.setItem('imgurl', '');
  return navigateTo('/')
  
}

</script>
<template>
  <v-menu anchor="bottom end" origin="auto" min-width="300">
    <template v-slot:activator="{ props }">
      <v-btn
        v-bind="props"
        class="pa-0 px-1"
        elevation="0"
        color="transparent"
        plain
        :ripple="false"
      >
        <v-avatar size="35">
          <img :src=userStore.imagenurl width="35" alt="Julia" />
        </v-avatar>
      </v-btn>
    </template>

    <v-list class="pa-6" elevation="10" rounded="lg">
      <v-list-item
        class="pa-3 mb-2"
        v-for="(item, i) in userprofile"
        :key="i"
        :value="item"
        :title="item.title"
        :subtitle="item.desc"
        rounded="lg"
      >
      </v-list-item>
      <v-btn
        to="/"
        block
        color="secondary"
        variant="tonal"
        class="mt-4 py-4"
        @click="logout()"
        >Logout</v-btn
      >
    </v-list>
  </v-menu>
</template>
