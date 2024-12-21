import { useUserStore } from "~/stores/mystore";

export default defineNuxtRouteMiddleware((to, from) => {
  const userStore = useUserStore();

  if (userStore.isAuthenticated && to.path === "/") {
    return navigateTo("/home");
  }

  if (!userStore.isAuthenticated && to.path !== "/") {
    if (from.path !== "/") {
      return navigateTo(`/?redirectTo=${to.path}`);
    }
  }
});
