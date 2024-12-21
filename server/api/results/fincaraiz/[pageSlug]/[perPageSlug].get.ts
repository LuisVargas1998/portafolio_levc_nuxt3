import { PrismaClient } from '@prisma/client';
import { resultDetail_fincaraiz} from '~~/types/tipos'
import { Params, IdataPrisma } from '~/types/interfaces'
import type { Item } from "vue3-easy-data-table";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {

  const { pageSlug, perPageSlug }: Params | any = event.context.params;

  const page: number = parseInt(pageSlug) * perPageSlug,
        perPage: number = parseInt(perPageSlug);

    // const results: Maybe<resultDetail_fincaraiz>[] = await prisma.resultDetail_fincaraiz.findMany({
    //         skip: page*perPage,
    //         take: perPage
    //     })

    // return results; 

    const dbRes = await prisma.$transaction([
      prisma.resultDetail_fincaraiz.count(),
      prisma.resultDetail_fincaraiz.findMany({
        skip: page,
        take: perPage
      })
    ])

    const totalRecords: number = dbRes[0];
    const results: Maybe<resultDetail_fincaraiz>[] = dbRes[1];

    // const items: Item[] = []
    // results.map( result => items.push(result) );


    return {totalRecords, results} as IdataPrisma; 

  // const { pageSlug } = event.context.params;

  // //console.log(pageSlug)

  // let page = pageSlug;

  // const res = await fetch(`http://localhost:8080/results/fincaraiz/${page}`);

  // let registrosDetalleCiencuadras: Maybe<resultDetail_fincaraiz> = await res.json();

  // //console.log(registrosDetalleCiencuadras);

  // return registrosDetalleCiencuadras;

});