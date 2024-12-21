import { useRegistroStore } from "~~/stores/registroStore";
import { results_metrocuadrado, results_fincaraiz, results_ciencuadras } from '~~/types/tipos';
import {IDatosInmueble} from "~/types/interfaces";

export default async (plataforma: string) => {

    const registroStore = useRegistroStore();

    let ids = {
        metrocuadrado: registroStore.getIdMetrocuadrado,
        ciencuadras: registroStore.getIdCiencuadras,
        fincaraiz: registroStore.getIdFincaraiz,
    }

    let datosInmueble: IDatosInmueble = {
        ciudad: "",
        area: "",
        cuartos: "",
        banos: "",
        barrio: "",
        garajes: "",
        tipoInmuble: "",
        tipoNegocio: "",
        tipoEmpresa: null,
        nombreEmpresa: null,
        precio: "",
        numeroContacto: "",
        links: [],
    }

    const { data } = await useFetch<IDatosInmueble>(
        () => `/api/results/${plataforma}/detalle/${ids[plataforma]}`
    );
        //solucionar con tipado
    //let jsonData = JSON.parse(JSON.stringify(data.value));

    /*if(plataforma !== "metrocuadrado"){
        //console.log(jsonData)

        // for (let key in jsonData){
        //     datosInmueble[key] = jsonData[key];
        // }

        if(jsonData.ciudad != undefined) datosInmueble.ciudad = jsonData.ciudad;
        if(jsonData.jsonResult.marea != undefined) datosInmueble.area = jsonData.jsonResult.marea;
        if(jsonData.jsonResult.mnrocuartos != undefined) datosInmueble.cuartos = jsonData.jsonResult.mnrocuartos;
        if(jsonData.jsonResult.mnrobanos != undefined) datosInmueble.banos = jsonData.jsonResult.mnrobanos;
        if(jsonData.jsonResult.mnombrecomunbarrio != undefined) datosInmueble.barrio = jsonData.jsonResult.mnombrecomunbarrio;
        //datosInmueble.garajes = jsonData.jsonResult.marea;
        if(jsonData.jsonResult.mtipoinmueble.nombre != undefined) datosInmueble.tipoInmuble = jsonData.jsonResult.mtipoinmueble.nombre;
        if(jsonData.jsonResult.mtiponegocio != undefined) datosInmueble.tipoNegocio = jsonData.jsonResult.mtiponegocio;
        //datosInmueble.tipoEmpresa = jsonData.jsonResult.mnombrecomunbarrio;
        //datosInmueble.nombreEmpresa = jsonData.jsonResult.mnombrecomunbarrio;
        if(jsonData.jsonResult.mvalorarriendo != undefined) datosInmueble.precio = jsonData.jsonResult.mvalorarriendo;
        if(jsonData.contactPhone != undefined) datosInmueble.numeroContacto = jsonData.contactPhone;
        if(jsonData.jsonResult.link != undefined) datosInmueble.links.push(jsonData.jsonResult.link);
    }

    if(plataforma !== "ciencuadras"){
        // const { data } = await useFetch(
        //     () => `/api/results/ciencuadras/detalle/${idCiencuadras}`
        // );
        // let jsonData = JSON.parse(JSON.stringify(data.value));

        if(jsonData.ciudad != undefined) datosInmueble.ciudad = jsonData.ciudad;
        if(jsonData.jsonResult.area != undefined) datosInmueble.area = jsonData.jsonResult.area;
        if(jsonData.jsonResult.rooms != undefined) datosInmueble.cuartos = jsonData.jsonResult.rooms;
        if(jsonData.jsonResult.baths != undefined) datosInmueble.banos = jsonData.jsonResult.baths;
        //if(jsonData.jsonResult.mnombrecomunbarrio != undefined) datosInmueble.barrio = jsonData.jsonResult.mnombrecomunbarrio;
        //datosInmueble.garajes = jsonData.jsonResult;
        if(jsonData.jsonResult.realEstateType != undefined) datosInmueble.tipoInmuble = jsonData.jsonResult.realEstateType;
        if(jsonData.jsonResult.offerType != undefined) datosInmueble.tipoNegocio = jsonData.jsonResult.offerType;
        if(jsonData.jsonResult.userType != undefined) datosInmueble.tipoEmpresa = jsonData.jsonResult.userType;
        if(jsonData.jsonResult.userName != undefined) datosInmueble.nombreEmpresa = jsonData.jsonResult.userName;
        if(jsonData.jsonResult.rentPrice != undefined) datosInmueble.precio = jsonData.jsonResult.rentPrice;
        if(jsonData.contactPhone != undefined) datosInmueble.numeroContacto = jsonData.contactPhone;
        if(jsonData.jsonResult.url != undefined) datosInmueble.links.push(jsonData.jsonResult.url);

    }

    if(plataforma !== "fincaraiz"){
        // const { data } = await useFetch(
        //     () => `/api/results/fincaraiz/detalle/${idFincaraiz}`
        // );
        // let jsonData = JSON.parse(JSON.stringify(data.value));

        if(jsonData.ciudad != undefined) datosInmueble.ciudad = jsonData.ciudad;
        if(jsonData.jsonResult.source.listing.area != undefined) datosInmueble.area = jsonData.jsonResult.source.listing.area;
        if(jsonData.jsonResult.source.listing.rooms.name != undefined) datosInmueble.cuartos = jsonData.jsonResult.source.listing.rooms.name;
        if(jsonData.jsonResult.source.listing.baths.name != undefined) datosInmueble.banos = jsonData.jsonResult.source.listing.baths.name;
        //if(jsonData.jsonResult.source.listing.locations.neighbourhoods != undefined) datosInmueble.barrio = jsonData.jsonResult.source.listing.locations.neighbourhoods[-1].name;
        if(jsonData.jsonResult.source.listing.garages != undefined) datosInmueble.garajes = jsonData.jsonResult.source.listing.garages.name;
        if(jsonData.jsonResult.source.listing.property_type.name != undefined) datosInmueble.tipoInmuble = jsonData.jsonResult.source.listing.property_type.name;
        if(jsonData.jsonResult.source.listing.offer.name != undefined) datosInmueble.tipoNegocio = jsonData.jsonResult.source.listing.offer.name ;
        //if(jsonData.jsonResult.source.listing.userType != undefined) datosInmueble.tipoEmpresa = jsonData.jsonResult.source.listing.userType;
        if(jsonData.jsonResult.source.listing.client.company_name != undefined) datosInmueble.nombreEmpresa = jsonData.jsonResult.source.listing.client.company_name;
        if(jsonData.jsonResult.source.listing.price != undefined) datosInmueble.precio = jsonData.jsonResult.source.listing.price;
        //if(jsonData.contactPhone != undefined) datosInmueble.numeroContacto = jsonData.contactPhone;
        //if(jsonData.jsonResult.url != undefined) datosInmueble.links.push(jsonData.jsonResult.url);
    }*/

    // if(error.value){
    //     throw createError({
    //         ...error.value,
    //         //statusMessage: `Could not fetch information in ${paginationStore.getPortalSlug}`
    //     })
    // }

    return data;

}