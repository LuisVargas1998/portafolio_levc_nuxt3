<script setup lang="ts">
import { ref } from "vue";
import registros from "~~/composables/registros";
import { googleTokenLogin } from "vue3-google-login";
import { useUserStore } from "~/stores/mystore";
const userStore = useUserStore();
const checkbox2 = ref(false);
const show2 = ref(false);
const show3 = ref(false);
const name = ref("");
const email = ref("");
const password = ref("");
const password2 = ref("");
async function makePostRequest() {
  const dat = {
    uname: name.value,
    uemail: email.value,
    upassword: password.value,
    federated: 0,
  };

  if (password.value == password2.value) {
    try {
      const response: any = await registros(dat);
      if (response == "Registro guardado exitosamente") {
        alert("Usted se ha registrado exitosamente");
        userStore.logout = true;
        await navigateTo("/");
      }
    } catch (error: any) {
      const e = error.response._data.message;
      console.error("Error en la petición:", error.response._data.message);
      if (e == "Ya existe una cuenta con ese correo electrónico") {
        alert("Ya existe una cuenta con ese correo electrónico");
      }
    }
  } else {
    alert("Las contraseñas no coinciden");
  }
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
      uname: data.names[0].displayName,
      uemail: data.emailAddresses[0].value,
      idp: "google",
      idptoken: token,
      federated: 1,
    };

    try {
      const response: any = await registros(datPost);
      if (response == "Registro guardado exitosamente") {
        alert("Usted se ha registrado exitosamente");
        userStore.logout = true;
        await navigateTo("/");
      }
    } catch (error: any) {
      const e = error.response._data.message;
      console.error("Error en la petición:", error.response._data.message);
      if (e == "Ya existe una cuenta con ese correo electrónico") {
        alert("Ya existe una cuenta con ese correo electrónico");
      }
    }
  });
};

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
              uname: dataf.name,
              uemail: dataf.email,
              idp: "facebook",
              idptoken: tokenf,
              federated: 1,
            };

            const handleAuthMysql = async () => {
              try {
                const response: any = await registros(datPost);
                if (response == "Registro guardado exitosamente") {
                  alert("Usted se ha registrado exitosamente");
                  userStore.logout = true;
                  await navigateTo("/");
                }
              } catch (error: any) {
                const e = error.response._data.message;
                console.error(
                  "Error en la petición:",
                  error.response._data.message
                );
                if (e == "Ya existe una cuenta con ese correo electrónico") {
                  alert("Ya existe una cuenta con ese correo electrónico");
                }
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
    <div>
      <v-container>
        <v-row justify="center">
          <v-col cols="12" sm="10" md="9" lg="5">
            <v-card class="card-shadow">
              <v-card-text class="card-margin">
                <div class="text-center">
                  <h2 class="ui-title font-weight-bold">Bienvenido</h2>
                  <div style="height: 10px"></div>
                  <p class="text-muted">
                    Registra tus datos. <br />
                    ¿Ya estas registrado?
                    <NuxtLink
                      style="
                        color: blue;
                        display: inline-block;
                        vertical-align: top;
                      "
                      to="/"
                    >
                      Ingresar
                    </NuxtLink>
                  </p>
                </div>
                <div style="height: 30px"></div>
                <v-text-field
                  v-model="name"
                  color="primary"
                  type="input"
                  label="User Name"
                  variant="underlined"
                ></v-text-field>

                <v-text-field
                  v-model="email"
                  color="primary"
                  type="input"
                  label="Email"
                  variant="underlined"
                ></v-text-field>

                <v-text-field
                  color="primary"
                  v-model="password"
                  variant="underlined"
                  :type="show2 ? 'input' : 'password'"
                  label="Password"
                  :append-inner-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append-inner="show2 = !show2"
                >
                </v-text-field>

                <v-text-field
                  v-model="password2"
                  color="primary"
                  variant="underlined"
                  :type="show3 ? 'text' : 'password'"
                  label="Confirm Password"
                  :append-inner-icon="show3 ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append-inner="show3 = !show3"
                >
                </v-text-field>
                <div class="mt-2">
                  <v-btn
                    block
                    class="bg-success mr-5 text-white"
                    elevation="0"
                    @click="makePostRequest"
                  >
                    Registrate</v-btn
                  >
                </div>

                <div style="height: 40px"></div>
                <div class="d-flex align-items-center">
                  <hr
                    style="
                      width: 160px;
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
                      width: 160px;
                      height: 1px;
                      background-color: lightgrey;
                      border: none;
                      margin: 0 10px;
                    "
                  />
                </div>
                <div style="height: 40px"></div>
                <v-row>
                  <v-col>
                    <v-btn @click="loginGoogle" block>
                      <img class="img-size mr-2" src="images/google.svg" />
                      Google
                    </v-btn>
                  </v-col>
                  <v-col>
                    <v-btn @click="logInWithFacebook" block>
                      <img class="img-size2 mr-2" src="images/facebook.svg" />
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
  </div>
</template>

<style>
.card-margin {
  margin: 20px;
}

.img-size {
  width: 30px;
  height: 30px;
}

.img-size2 {
  width: 30px;
  height: 30px;
}

.mini-spacer2 {
  padding-top: 100px;
}
</style>
