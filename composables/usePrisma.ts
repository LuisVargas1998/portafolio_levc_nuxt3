import { Ref } from "vue";
import { usePaginationStore } from "~/stores/paginationStore"
import { IdataPrisma } from '~/types/interfaces'

export default async () => {

    const paginationStore = usePaginationStore();

    const { data, refresh, error }: {data: Ref<IdataPrisma | null>, refresh:any, error:any} = await useFetch(
        //`http://localhost:8080/results/${paginationStore.getPortalSlug}/${paginationStore.getPage}`
        //`/api/results/${paginationStore.getPortalSlug}/${paginationStore.getPage}`
        () => `/api/results/${paginationStore.getPortalSlug}/${paginationStore.getPage}/${paginationStore.getPerPage}`
    );

    if(error.value){
        throw createError({
            ...error.value,
            statusMessage: `Could not fetch information in ${paginationStore.getPortalSlug}`
        })
    }

    return {data, refresh} as {data: Ref<IdataPrisma | null>, refresh:any};

}