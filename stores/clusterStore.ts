import { defineStore } from 'pinia'

export const useClusterStore = defineStore('cluster', {
  
    state: () => {
        return {
          names: [],
          functions: [],
        }
    },

    getters: {
        getNames: (state) => state.names,
        getFunctions: (state) => state.functions,
    },

    actions: {
        setNames(name){
            this.names.push(name);
        },
        setFunctions(fun){
            this.functions.push(fun);
        },
        imprimirNames(){
            console.log("msg desde la custerStore")
            this.names.forEach(name => console.log(name));
            this.functions.forEach(fun => console.log(fun));
        },
        // setPortalSlug(portalSlug: string | string[]) {
        //     this.portalSlug = portalSlug;
        // }
    },

})