import { PrismaClient } from '@prisma/client';
import { resultDetail_ciencuadras } from '~~/types/tipos'
import { Params, IdataPrisma } from '~/types/interfaces'

const prisma = new PrismaClient();

// const resultDetailCiencuadrasScheme = new mongoose.Schema({
//   midinmueble: String,
//   rentPrice: Number,
//   lat: Number,
//   lon: Number,
//   link: String
// }, {
//   collection: 'resultDetail_ciencuadras'
// });

export default defineEventHandler(async (event) => {

  const { pageSlug, perPageSlug }: Params | any = event.context.params;

  const page: number = parseInt(pageSlug) * perPageSlug,
        perPage: number = parseInt(perPageSlug);

    // const results: Maybe<resultDetail_ciencuadras>[] = await prisma.resultDetail_ciencuadras.findMany({
    //         skip: page*perPage,
    //         take: perPage
    //     })

    const dbRes = await prisma.$transaction([
      prisma.resultDetail_ciencuadras.count(),
      prisma.resultDetail_ciencuadras.findMany({
        skip: page,
        take: perPage
      })
    ])

    const totalRecords: number = dbRes[0];
    const results: Maybe<resultDetail_ciencuadras>[] = dbRes[1];


    return {totalRecords, results} as IdataPrisma; 
  
  // const { pageSlug } = event.context.params;

  // //console.log(pageSlug)

  // let perPage = 10,
  //     page = pageSlug;

  // const config = useRuntimeConfig()
  // await mongoose.connect(config.databaseUrl, { bufferCommands: false, autoIndex: false });

  // const resultDetailCiencuadrasModel = mongoose.model('resultDetail_ciencuadras', resultDetailCiencuadrasScheme);

  // const registrosDetalleCiencuadras: Maybe<resultDetail_ciencuadras>[] = await resultDetailCiencuadrasModel.find()
  //   .limit(perPage)
  //   .skip(perPage * page);

  // //console.log(registrosDetalleCiencuadras);

  // return registrosDetalleCiencuadras;

});