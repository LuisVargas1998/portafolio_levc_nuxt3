<template>
    <v-container fill-height>
        <v-row>
            <v-col>
                <div class="row-container" v-for="(value, key) in datosInmueble">
                    <div>
                        <p>{{ key }}</p>
                    </div>
                    <div>
                        <p>{{ value }}</p>
                    </div>
                </div>
            </v-col>
        </v-row>

        <v-row>
            <v-col>
                <carousel :items-to-show="1">
                    <slide v-for="img in imagenInmueble" :key="img">
                        <img :src="img.linkImage" alt="">
                    </slide>

                    <template #addons>
                    <navigation />
                    <pagination />
                    </template>
                </carousel>
            </v-col>
        </v-row>

    </v-container>
</template>

<script setup lang="ts">
//import 'vue3-carousel/dist/carousel.css'
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'

import {IDatosInmueble} from "~/types/interfaces"

const route = useRoute();
const { plataformaSlug } = route.params;

const datosInmueble: IDatosInmueble = await useDetalleRegistro(plataformaSlug.toString());
const imagenInmueble = await useImagenRegistro(plataformaSlug.toString());

</script>

<style>
.row-container:nth-child(odd){
    background-color: #1e88e5be;
}
.row-container:nth-child(even){
    background-color: #1e88e56e;
}
.row-container{
    display: flex;
    justify-content: space-evenly;
    align-content: center;
}
</style>