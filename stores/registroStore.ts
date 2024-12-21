import { defineStore } from 'pinia'
import { IIds } from '~~/types/interfaces';

export const useRegistroStore = defineStore('regitroStore', {
  
    state: () => {
        return {
            idMetrocuadrado: localStorage.idMetrocuadrado,
            idCiencuadras: localStorage.idCiencuadras,
            idFincaraiz: localStorage.idFincaraiz,
        } as IIds
    },

    getters: {
        getIdMetrocuadrado: (state: IIds) => state.idMetrocuadrado,
        getIdCiencuadras: (state: IIds) => state.idCiencuadras,
        getIdFincaraiz: (state: IIds) => state.idFincaraiz,

        getActivePlataforms: (state: IIds) => {
            let plataformas: string[] = [];

            if(state.idMetrocuadrado !== null) plataformas.push("metrocuadrado");
            if(state.idCiencuadras !== null) plataformas.push("ciencuadras");
            if(state.idFincaraiz !== null) plataformas.push("fincaraiz");

            return plataformas;
        }
    },

    actions: {
        setIdMetrocuadrado(idMetrocuadrado: string) {
            this.idMetrocuadrado = idMetrocuadrado;
            localStorage.idMetrocuadrado = idMetrocuadrado;
        },
        setIdCiencuadras(idCiencuadras: string) {
            this.idCiencuadras = idCiencuadras;
            localStorage.idCiencuadras = idCiencuadras;
        },
        setIdFincaraiz(idFincaraiz: string) {
            this.idFincaraiz = idFincaraiz;
            localStorage.idFincaraiz = idFincaraiz;
        },
    },

})