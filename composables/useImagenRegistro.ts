import { Ref } from "vue";
import { useRegistroStore } from "~~/stores/registroStore"
import { results_metrocuadrado, results_fincaraiz, results_ciencuadras } from '~~/types/tipos'
import {IDatosInmueble} from "~/types/interfaces"

export default async (plataforma: string) => {

    const registroStore = useRegistroStore();

    let ids = {
        metrocuadrado: registroStore.getIdMetrocuadrado,
        ciencuadras: registroStore.getIdCiencuadras,
        fincaraiz: registroStore.getIdFincaraiz,
    }

    //let data: string[] = [];

    const { data } = await useFetch<string[]>(
        () => `/api/results/${plataforma}/imagenes/${ids[plataforma]}`
    );
    
    //return JSON.parse(JSON.stringify(data.value));

    // if(error.value){
    //     throw createError({
    //         ...error.value,
    //         //statusMessage: `Could not fetch information in ${paginationStore.getPortalSlug}`
    //     })
    // }

    return data;

}