import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {

  const { idSlug }  = event.context.params;

    const registro = await prisma.results_metrocuadrado.findFirst({
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
                    marea: true,
                    mnombrecomunbarrio: true,
                    mvalorarriendo: true,
                    mtipoinmueble: {    //tipo predio
                        select: {
                            nombre: true,
                        }
                    },
                    mtiponegocio: true, //tipo negocio
                    link: true,
                    //userType: true,  //inmobiliaria
                    //userName: true,  //nombre de la inmobiliaria
                    mnrocuartos: true,
                    mnrobanos: true,
                }
            }
        },
    });

    return registro; 

});