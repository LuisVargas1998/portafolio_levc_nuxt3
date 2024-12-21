import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    role: localStorage.getItem('role') || "",
    auth: localStorage.getItem('auth') === 'true' || false,
    logout: false,
    imagenurl: localStorage.getItem('imgurl') || "https://definicion.de/wp-content/uploads/2019/07/perfil-de-usuario.png",
    name: localStorage.getItem('name') || "",
  }),
  getters: {
    isAdmin: (state) => state.role === "admin",
    isSuperAdmin: (state) => state.role === "superadmin",
    isAuthenticated: (state) => state.auth === true,
    isLogOut: (state) => state.logout === true,
  },
});
