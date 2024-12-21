import { PrismaClient } from '@prisma/client';
import { resultDetail_ciencuadras } from '~~/types/tipos'
import { Params, IdataPrisma } from '~/types/interfaces'

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {

  const { idSlug }  = event.context.params;

    const registro = await prisma.results_ciencuadras.findFirst({
        where: {
            midinmueble: idSlug,
        },
        select: {
            ciudad: true,
            contactPhone: true,
            fechaActualizacion: true,
            midinmueble: true,
            jsonResult: {
                select: {
                    area: true,
                    //locality: true,
                    neighborhood: true,
                    rentPrice: true,
                    realEstateType: true, //tipo de predio
                    offerType: true, //ipo de ofeta(qrriendo, ...)
                    url: true,
                    userType: true, //inmobiliaria
                    userName: true, //nombre inmobiliaria
                    rooms: true,
                    baths: true,
                }
            }
        },
    });

    return registro; 

});