<script setup lang="ts">
import { ref } from "vue";
import authMysql from "~/composables/authMysql";
import { useUserStore } from "~/stores/mystore";
import { googleTokenLogin } from "vue3-google-login";
const { query } = useRoute();
const userStore = useUserStore();
const date = new Date().toDateString;

const checkbox2 = ref(false);
const show2 = ref(false);
const show3 = ref(true);

const credentials = reactive({
  email: "",
  password: "",
});

//para que no se bloquee el formulario del login al hacer logout,
//recargar la pagina auto
if (userStore.isLogOut) {
  window.location.reload();
}

const loginGoogle = async () => {
  googleTokenLogin().then(async (response) => {
    const token = response.access_token;
    const data: any = await googleAuth(token);
    /*
    console.log("Acces data email", data.emailAddresses[0].value);
    console.log("Acces data names", data.names[0].displayName);
    console.log("Acces data photo", data.photos[0].url);
    */
    const datPost = {
      uemail: data.emailAddresses[0].value,
      idp: "google",
      idptoken: token,
      federated: 1,
    };
    userStore.imagenurl = data.photos[0].url;
    try {
      const response: any = await authMysql(datPost);
      if (response.authenticated) {
        //window.location.href = "/home";
        localStorage.setItem("auth", true.toString());
        userStore.auth = true;
        localStorage.setItem("imgurl", data.photos[0].url);
        userStore.imagenurl = data.photos[0].url;
        localStorage.setItem("name", data.names[0].displayName);
        userStore.name = data.names[0].displayName;
        if (response.roles[0] == "admin" || response.roles[0] == "admin") {
          localStorage.setItem("role", "admin");
          userStore.role = "admin";
        }
        await navigateTo("/home");
      }
    } catch (error) {
      alert("Usuario o contraseña invalidos");
    }
  });
};

async function makePostRequest() {
  const dat = {
    uemail: credentials.email,
    upassword: credentials.password,
    federated: 0,
  };

  try {
    const response: any = await authMysql(dat);
    if (response.authenticated) {
      //window.location.href = "/home";
      localStorage.setItem("auth", true.toString());
      userStore.auth = true;
      localStorage.setItem("name", response.uname);
      userStore.name = response.uname;
      if (response.roles[0] == "admin" || response.roles[0] == "admin") {
        localStorage.setItem("role", "admin");
        userStore.role = "admin";
      }
      await navigateTo("/home");
    }
  } catch (error) {
    alert("Usuario o contraseña invalidos");
  }
}

onMounted(async () => {
  await loadFacebookSDK(document, "script", "facebook-jssdk");
  await initFacebook();
});

const logInWithFacebook = () => {
  return new Promise(async (resolve, reject) => {
    window.FB.login(function (response: any) {
      if (response.authResponse) {
        const tokenf = response.authResponse.accessToken;
        facebookAuth(tokenf)
          .then((dataf: any) => {
            resolve(dataf);
            const datPost = {
              uemail: dataf.email,
              idp: "facebook",
              idptoken: tokenf,
              federated: 1,
            };

            const handleAuthMysql = async () => {
              try {
                const response: any = await authMysql(datPost);
                if (response.authenticated) {
                  //window.location.href = "/home";
                  localStorage.setItem("auth", true.toString());
                  userStore.auth = true;
                  localStorage.setItem("imgurl", dataf.picture.data.url);
                  userStore.imagenurl = dataf.picture.data.url;
                  localStorage.setItem("name", dataf.name);
                  userStore.name = dataf.name;
                  if (
                    response.roles[0] == "admin" ||
                    response.roles[0] == "admin"
                  ) {
                    localStorage.setItem("role", "admin");
                    userStore.role = "admin";
                  }
                  await navigateTo("/home");
                }
              } catch (error) {
                alert("Usuario o contraseña invalidos");
              }
            };

            handleAuthMysql();
          })
          .catch((error) => {
            reject(error);
          });
      } else {
        reject("User cancelled login or did not fully authorize.");
      }
    });
  });
};

const logOut = async () => {
  window.FB.logout(function (response: any) {
    alert("You have logged out!");
  });
};

const initFacebook = async () => {
  window.fbAsyncInit = function () {
    window.FB.init({
      appId: "1331534167404991", //Cambiar
      status: true,
      xfbml: true,
      version: "v2.7",
    });
  };
};

const loadFacebookSDK = async (d: any, s: any, id: any) => {
  var js,
    fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {
    return;
  }
  js = d.createElement(s);
  js.id = id;
  js.src = "https://connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
};
</script>
<template>
  <div>
    <div class="hidden-sm-and-down">
      <div class="mini-spacer"></div>
    </div>
    <v-container>
      <v-row justify="center" no-gutters>
        <v-col v-col cols="10" sm="10" md="8" lg="8">
          <v-card class="card-shadow">
            <v-img src="/images/background/u1.jpg"></v-img>
          </v-card>
        </v-col>
        <v-col cols="10" sm="15" md="8" lg="4">
          <v-card class="card-shadow" key="formKey">
            <v-card-text class="card-margin" key="formKey" style="margin: 14px">
              <div class="text-center">
                <h2 class="ui-title font-weight-bold">Bienvenido</h2>
                <div style="height: 10px"></div>
                <p class="text-muted">
                  Ingresa con tu cuenta. <br />
                  ¿No tienes una aún?
                  <NuxtLink
                    style="
                      color: blue;
                      display: inline-block;
                      vertical-align: top;
                    "
                    to="/registerpage"
                  >
                    Regístrate
                  </NuxtLink>
                </p>
              </div>
              <div style="height: 20px"></div>
              <v-text-field
                :key="date"
                v-model="credentials.email"
                color="primary"
                label="Email"
                variant="underlined"
                counter="25"
              ></v-text-field>
              <v-text-field
                :key="date"
                v-model="credentials.password"
                color="primary"
                counter="25"
                variant="underlined"
                :type="show2 ? 'text' : 'password'"
                label="Contraseña"
                :append-inner-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append-inner="show2 = !show2"
              >
              </v-text-field>

              <div class="d-flex align-items-center">
                <v-checkbox
                  :v-model="checkbox2"
                  class="ml-n2 mt-n2"
                  color="primary"
                  label="Recordar"
                  hide-details
                ></v-checkbox>
                <NuxtLink
                  style="
                    color: blue;
                    display: inline-block;
                    vertical-align: top;
                    margin-top: 9px;
                  "
                  to="/"
                >
                  Recuperar
                </NuxtLink>
              </div>
              <div class="mt-2">
                <v-btn
                  block
                  class="bg-success mr-5 text-white"
                  elevation="0"
                  @click="makePostRequest()"
                >
                  Ingresar</v-btn
                >
              </div>

              <div style="height: 20px"></div>
              <div class="d-flex align-items-center">
                <hr
                  style="
                    width: 140px;
                    height: 1px;
                    background-color: lightgrey;
                    border: none;
                    margin: 0 10px;
                    color: #90a4ae;
                  "
                />
                <p style="margin-top: -10px; color: #90a4ae">O</p>
                <hr
                  style="
                    width: 140px;
                    height: 1px;
                    background-color: lightgrey;
                    border: none;
                    margin: 0 10px;
                  "
                />
              </div>
              <div style="height: 20px"></div>
              <v-row>
                <v-col>
                  <v-btn @click="loginGoogle" block>
                    <img class="img-size mr-2" src="/images/google.svg" />
                    Google
                  </v-btn>
                </v-col>
                <v-col>
                  <v-btn @click="logInWithFacebook" block>
                    <img class="img-size2 mr-2" src="/images/facebook.svg" />
                    Facebook
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style>
.card-margin {
  margin: 10px;
}

.img-size {
  width: 40px;
  height: 40px;
}

.img-size2 {
  width: 30px;
  height: 30px;
}

.mini-spacer {
  padding-top: 150px;
}

.image-container {
  height: 100%;
  object-fit: cover;
}
</style>
