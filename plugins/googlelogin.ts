import { createApp } from 'vue'
import vue3GoogleLogin from 'vue3-google-login'

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(vue3GoogleLogin,{
        clientId: '118261251867-un3d666q34jmlur5o11h2sl2evnknocn.apps.googleusercontent.com'
    });
});