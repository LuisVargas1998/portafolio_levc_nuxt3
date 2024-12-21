<template>
    <v-btn small>
        {{msgButton}}
        <v-dialog v-model="dialog" activator="parent" width="auto">
            <v-card>
                <v-card-text>
                    {{msgDialog}}
                </v-card-text>
                <v-card-actions>
                    <v-btn color="primary" block @click="changeQueryMode">Cerrar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-btn>
</template>

<script setup lang="ts">
import { Ref } from "vue";

const mensajesBoton = {
    barrios: {
        msgButton: "Buscar por barrios",
        msgDialog: "Selecione un barrio para buscar"
    },
    geolocalizacion: {
        msgButton: "Buscar por geolocalizacion",
        msgDialog: "Mueva el mapa para buscar"
    }
}

const emit = defineEmits(['queryByBarrios', 'queryByGeolocalization'])

const dialog: Ref<boolean> = ref(false);
const msgButton: Ref<string> = ref(mensajesBoton.barrios.msgButton);
const msgDialog: Ref<string> = ref(mensajesBoton.barrios.msgDialog);
// false -> busqueda por geolacalización activa 
// true -> busqueda por barrios activa
const flag: Ref<boolean> = ref(false);


function changeQueryMode(){

    dialog.value = false;

    flag.value = !flag.value;

    if(flag.value){
        msgButton.value = mensajesBoton.geolocalizacion.msgButton;
        msgDialog.value = mensajesBoton.geolocalizacion.msgDialog;
        emit('queryByBarrios');
    }
    else{
        msgButton.value = mensajesBoton.barrios.msgButton;
        msgDialog.value = mensajesBoton.barrios.msgDialog;
        emit('queryByGeolocalization')
    }
    
}

</script>