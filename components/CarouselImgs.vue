<template #slides>
            <carousel :items-to-show="1">
                <slide v-for="img in imagenInmueble" :key="img" itemsToShow="1" snapAlign="center">
                    <img :src="img.linkImage" alt="">
                </slide>

                <template #addons>
                <navigation />
                <pagination />
                </template>
            </carousel>
        </template>

<script setup>
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'

const imagenInmueble = await useImagenRegistro();

imagenInmueble.splice(0, 10)

console.log(imagenInmueble)
</script>