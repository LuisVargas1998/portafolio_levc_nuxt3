import { PrismaClient } from '@prisma/client';
import { resultDetail_ciencuadras } from '~~/types/tipos'
import { Params, IdataPrisma } from '~/types/interfaces'

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {

  const { idSlug }  = event.context.params;

    const registro = await prisma.imageResultDetail_metrocuadrado.findMany({
        where: {
            midinmueble: idSlug,
        },
        select: {
            linkImage: true,
        },
    });

    return registro; 

});