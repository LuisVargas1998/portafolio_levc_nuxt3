<script setup lang="ts">
import { ref } from "vue";

const datapi: any = await mysql2Api("0");

const pathimg = ref("");
const minioImg = async function (path: string) {
  const minioUrl = await minioPlugin(path);
  return minioUrl;
};

const pathSearch = datapi._value.path_minio;
const datos = {
  filename: "601.jpg",
  base64data:
    "/9j/4AAQSkZJRgABAQAAAQABAAD//gAkJ0ltYWdlIHJld3JpdHRlbiB3aXRoIEltYWdlTWFnaWNrJ//bAEMAAgEBAQEBAgEBAQICAgICBAMCAgICBQQEAwQGBQYGBgUGBgYHCQgGBwkHBgYICwgJCgoKCgoGCAsMCwoMCQoKCv/bAEMBAgICAgICBQMDBQoHBgcKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCv/AABEIAMQAWAMBIgACEQEDEQH/xAAdAAABBAMBAQAAAAAAAAAAAAAHAAYICQMEBQIB/8QAPRAAAQMDBAECBAMFBgUFAAAAAQIDBAUGEQAHEiEIEzEJFCJBUWFxFSMygZEKFhczQrEYJFKhwSViktHx/8QAHAEAAQUBAQEAAAAAAAAAAAAABQIDBAYHAQAI",
  contenttype: "image/jpg",
};

const data: any = await $fetch("http://0.0.0.0:8008/search2", {
  method: "POST",
  headers: {
    "Content-type": "application/json",
  },
  body: JSON.stringify(datos),
});

const contents = data.res_file;
const details0 = data.result[0].score;
const id0 = data.result[0].id;
const score0 = details0.toFixed(2);

const details1 = data.result[1].score;
const id1 = data.result[1].id;
const score1 = details1.toFixed(2);

const details2 = data.result[2].score;
const id2 = data.result[2].id;
const score2 = details2.toFixed(2);

const details3 = data.result[3].score;
const id3 = data.result[3].id;
const score3 = details3.toFixed(2);

const details4 = data.result[4].score;
const id4 = data.result[4].id;
const score4 = details4.toFixed(2);

const details5 = data.result[5].score;
const id5 = data.result[5].id;
const score5 = details5.toFixed(2);

const array = contents
  .split("'")
  .filter(
    (element: any) =>
      element !== "" && element !== ", " && element !== "[" && element !== "]"
  );
const array1 = array[1].split("/");
const array2 = array[2].split("/");
const array3 = array[3].split("/");
const array4 = array[4].split("/");
const array5 = array[5].split("/");
const path1 =
  "embeddings-igg/" + array1[8] + "_" + array1[9] + "_" + array1[10];
const path2 =
  "embeddings-igg/" + array2[8] + "_" + array2[9] + "_" + array2[10];
const path3 =
  "embeddings-igg/" + array3[8] + "_" + array3[9] + "_" + array3[10];
const path4 =
  "embeddings-igg/" + array4[8] + "_" + array4[9] + "_" + array4[10];
const path5 =
  "embeddings-igg/" + array5[8] + "_" + array5[9] + "_" + array5[10];
console.log(path1);

const selected1 = ref(false);
const selected2 = ref(false);
const selected3 = ref(false);
const selected4 = ref(false);
const selected5 = ref(false);

async function makePostRequest() {
  const dat = [
    {
      id_candidate: id1,
      candidate: pathSearch,
      positive: selected1.value ? 1 : 0,
      query: path1,
      id_query: id0,
      score: score1,
    },
    {
      id_candidate: id2,
      candidate: pathSearch,
      positive: selected2.value ? 1 : 0,
      query: path2,
      id_query: id0,
      score: score2,
    },
    {
      id_candidate: id3,
      candidate: pathSearch,
      positive: selected3.value ? 1 : 0,
      query: path3,
      id_query: id0,
      score: score3,
    },
    {
      id_candidate: id4,
      candidate: pathSearch,
      positive: selected4.value ? 1 : 0,
      query: path4,
      id_query: id0,
      score: score4,
    },
    {
      id_candidate: id5,
      candidate: pathSearch,
      positive: selected5.value ? 1 : 0,
      query: path5,
      id_query: id0,
      score: score5,
    },
  ];
  return await postSimilarQuery(dat);
}

definePageMeta({
  //middleware: ["auth"],
});
</script>

<template>
  <div>
    <v-container fluid>
      <v-row justify="center">
        <v-col cols="10" sm="10" md="10" lg="10">
          <v-card>
            <v-card-text>
              <v-table>
                <thead>
                  <tr>
                    <th class="text-left">Imagen de Consulta</th>
                    <th class="text-left">Similitud 1</th>
                    <th class="text-left">Similitud 2</th>
                    <th class="text-left">Similitud 3</th>
                    <th class="text-left">Similitud 4</th>
                    <th class="text-left">Similitud 5</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <Image :image-path="pathSearch" />
                    </td>
                    <td>
                      <Image :image-path="path1" />
                    </td>
                    <td>
                      <Image :image-path="path2" />
                    </td>
                    <td>
                      <Image :image-path="path3" />
                    </td>
                    <td>
                      <Image :image-path="path4" />
                    </td>
                    <td>
                      <Image :image-path="path5" />
                    </td>
                  </tr>
                  <tr>
                    <td>{{ "ID: " + id0 }}</td>
                    <td>{{ "ID: " + id1 }}</td>
                    <td>{{ "ID: " + id2 }}</td>
                    <td>{{ "ID: " + id3 }}</td>
                    <td>{{ "ID: " + id4 }}</td>
                    <td>{{ "ID: " + id5 }}</td>
                  </tr>
                  <tr>
                    <td>Score</td>
                    <td>{{ score1 }}</td>
                    <td>{{ score2 }}</td>
                    <td>{{ score3 }}</td>
                    <td>{{ score4 }}</td>
                    <td>{{ score5 }}</td>
                  </tr>
                  <tr>
                    <td>Positive</td>
                    <td>
                      <v-checkbox
                        v-model="selected1"
                        color="success"
                        :label="`${selected1.toString()}`"
                      />
                    </td>
                    <td>
                      <v-checkbox
                        v-model="selected2"
                        color="success"
                        :label="`${selected2.toString()}`"
                      />
                    </td>
                    <td>
                      <v-checkbox
                        v-model="selected3"
                        color="success"
                        :label="`${selected3.toString()}`"
                      />
                    </td>
                    <td>
                      <v-checkbox
                        v-model="selected4"
                        color="success"
                        :label="`${selected4.toString()}`"
                      />
                    </td>
                    <td>
                      <v-checkbox
                        v-model="selected5"
                        color="success"
                        :label="`${selected5.toString()}`"
                      />
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-card-text>
          </v-card>
          <div style="margin: 10px"></div>
          <div>
            <v-card>
              <!-- Contenido de la tarjeta -->
              <v-card-actions
                style="
                  display: flex;
                  justify-content: center;
                  align-items: center;
                "
              >
                <v-btn tile color="success" @click="makePostRequest">
                  <v-icon left> mdi-floppy </v-icon>
                  Guardar
                </v-btn>
              </v-card-actions>
            </v-card>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<style>
.table-image {
  max-width: 50%;
}
.mini-spacer2 {
  padding-top: 100px;
}
</style>
