<script setup>
const embeddingsPatches = await mysqlApi("2022-10-31");
const pathimg = ref("");
const minioImg = async function (path) {
  const minioUrl = await minioPlugin(path);
  return minioUrl;
};
definePageMeta({
  //middleware: ["auth"],
});
</script>
<template>
  <div>
    <v-container>
      <v-row justify="center" align-items="start">
        <v-col cols="10" sm="10" md="10">
          <v-card max-width="920">
            <v-table class="d-none d-sm-table">
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-">Fecha</th>
                    <th class="text-left">Track_id</th>
                    <th class="text-left">Genero</th>
                    <th class="text-left">Edad</th>
                    <th class="text-left">Minio Image</th>
                    <th class="text-center">Page Bottons</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="item in embeddingsPatches._embedded.parches"
                    :key="item.fecha"
                  >
                    <td>{{ item.fecha }}</td>
                    <td>{{ item.track_id }}</td>
                    <td>{{ item.genero }}</td>
                    <td>{{ item.edad }}</td>
                    <td>
                      <Image :image-path="item.path_minio" />
                    </td>
                    <td width="17%">
                      <v-row class="ma-4 justify-space-around">
                        <v-btn
                          class="mx-2"
                          fab
                          dark
                          small
                          color="primary"
                          to="/milvuspage"
                        >
                          <v-icon>mdi-account-circle </v-icon>
                        </v-btn>
                        <v-btn
                          class="mx-2"
                          fab
                          dark
                          small
                          color="success"
                          to="/milvuspage"
                        >
                          <v-icon dark>mdi-cloud-upload</v-icon>
                        </v-btn>
                      </v-row>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-table>

            <v-col class="d-sm-none">
              <v-row
                v-for="item in embeddingsPatches._embedded.parches"
                :key="item.fecha"
              >
                <v-col class="text-center">
                  <div class="text-muted">{{ item.fecha }}</div>
                  <div class="text-muted">Track_id:</div>
                  <div>{{ item.track_id }}</div>
                  <div class="text-muted">Genero:</div>
                  <div>{{ item.genero }}</div>
                  <div class="text-muted">Edad:</div>
                  <div>{{ item.edad }}</div>
                  <Image :image-path="item.path_minio" />
                  <div class="text-center">
                    <v-btn fab dark small color="primary" to="/milvuspage">
                      <v-icon>mdi-account-circle </v-icon>
                    </v-btn>
                    <v-btn fab dark small color="success" to="/milvuspage">
                      <v-icon dark>mdi-cloud-upload</v-icon>
                    </v-btn>
                  </div>
                </v-col>
              </v-row>
            </v-col>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style>
.table-image {
  max-width: 30%;
}
.mini-spacer {
  padding-top: 100px;
}
</style>
