import { PrismaClient } from '@prisma/client';
import { resultDetail_metrocuadrado } from '~~/types/tipos';
import { Params, IdataPrisma } from '~/types/interfaces'

const prisma = new PrismaClient();

export default defineEventHandler ( async (event) => {

  const { pageSlug, perPageSlug }: Params | any = event.context.params;

  const page: number = parseInt(pageSlug) * perPageSlug,
        perPage: number = parseInt(perPageSlug);

    // const results: Maybe<resultDetail_metrocuadrado>[] = await prisma.resultDetail_metrocuadrado.findMany({
    //         skip: page*perPage,
    //         take: perPage
    //     })

    // return results; 

    const dbRes = await prisma.$transaction([
        prisma.resultDetail_metrocuadrado.count(),
        prisma.resultDetail_metrocuadrado.findMany({
          skip: page,
        take: perPage
        })
      ])
  
      const totalRecords: number = dbRes[0];
      const results: Maybe<resultDetail_metrocuadrado>[] = dbRes[1];
  
  
      return {totalRecords, results} as IdataPrisma; 
    // .then(async () => {
    //     await prisma.$disconnect()
    //     })
    // .catch(async (e) => {
    //     console.error(e)
    //     await prisma.$disconnect()
    //     process.exit(1)
    //     })

} )