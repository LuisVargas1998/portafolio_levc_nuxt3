<template>
  <div>
    <div>
      <v-container>
        <div style="display: flex; justify-content: center">
          <v-btn class="ma-2" color="primary" dark>
            Mostrar
            <v-icon dark right> mdi-checkbox-marked-circle </v-icon>
          </v-btn>
        </div>
      </v-container>
      <div style="margin: 20px"></div>
      <v-row style="padding: 0 30px">
        <v-col :cols="4">
          <v-card style="border-radius: 15px">
            <v-card-title class="font-weight-bold">Users Online</v-card-title>
            <v-divider></v-divider>
            <v-card-text style="padding-left: 10px">
              Contenido ...
            </v-card-text>
          </v-card>
          <div style="margin: 20px"></div>
          <v-card style="border-radius: 15px">
            <v-card-title class="font-weight-bold"
              >Button CLicks (Last Hour)</v-card-title
            >
            <v-divider></v-divider>
            <v-card-text style="padding-left: 10px">
              Contenido ...
            </v-card-text>
          </v-card>
          <div style="margin: 20px"></div>
          <v-card style="border-radius: 15px">
            <v-card-title class="font-weight-bold"
              >Page Views (Last Hour)</v-card-title
            >
            <v-divider></v-divider>
            <v-card-text style="padding-left: 10px">
              Contenido ...
            </v-card-text>
          </v-card>
        </v-col>
        <v-col :cols="15">
          <v-card style="border-radius: 15px">
            <v-card-title class="font-weight-bold"
              >Real-Time Events
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text style="padding-left: 10px">
              Contenido ...
            </v-card-text>
          </v-card>
        </v-col>
        <v-col :cols="12">
          <v-card style="border-radius: 15px">
            <v-card-title class="font-weight-bold"
              >Real-Time Events
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text style="padding-left: 10px">
              Contenido ...
            </v-card-text>
          </v-card>
        </v-col>
        <v-col :cols="4">
          <v-card style="border-radius: 15px">
            <v-card-title class="font-weight-bold"
              >Users Online (Last Day)</v-card-title
            >
            <v-divider></v-divider>
            <v-card-text style="padding-left: 10px">
              Contenido ...
            </v-card-text>
          </v-card>
          <div style="margin: 20px"></div>
          <v-card style="border-radius: 15px">
            <v-card-title class="font-weight-bold"
              >Button CLicks (Last Day)</v-card-title
            >
            <v-divider></v-divider>
            <v-card-text style="padding-left: 10px">
              Contenido ...
            </v-card-text>
          </v-card>
          <div style="margin: 20px"></div>
          <v-card style="border-radius: 15px">
            <v-card-title class="font-weight-bold"
              >Page Views (Last Day)</v-card-title
            >
            <v-divider></v-divider>
            <v-card-text style="padding-left: 10px">
              Contenido ...
            </v-card-text>
          </v-card>
        </v-col>
        <v-col :cols="15">
          <v-card style="border-radius: 15px">
            <v-card-title class="font-weight-bold"
              >Real-Time Events (Last Day)
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text style="padding-left: 10px">
              Contenido ...
            </v-card-text>
          </v-card>
        </v-col>
        <v-col :cols="12">
          <v-card style="border-radius: 15px">
            <v-card-title class="font-weight-bold"
              >Streaming Data Pipeline Architecture</v-card-title
            >
            <v-divider></v-divider>
            <v-card-text style="padding-left: 10px">
              Contenido ...
            </v-card-text>
          </v-card>
        </v-col>
        <div style="margin: 20px"></div>
      </v-row>
    </div>
  </div>
</template>
<script>
definePageMeta({
  //middleware: ["auth"],
});
</script>
