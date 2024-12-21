import { defineStore } from 'pinia'
import { IPagination } from '~~/types/interfaces';

export const usePaginationStore = defineStore('pagination', {
  
    state: () => {
        return {
          page: 1,
          perPage: 10,
          portalSlug: ""
        } as IPagination
    },

    getters: {
        getPage: (state: IPagination) => state.page,
        getPerPage: (state: IPagination) => state.perPage,
        getPortalSlug: (state: IPagination) => state.portalSlug
    },

    actions: {
        increment() {
            // validar el total de registros
             this.page++;
        },
        decrement() {
            if(this.page > 1) this.page--
        },
        setPage(page: number){
            this.page = page;
        },
        setPerPage(perPage: number){
            this.perPage = perPage;
        },
        setPortalSlug(portalSlug: string | string[]) {
            this.portalSlug = portalSlug;
        }
    },

})