import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {

  const { idSlug }  = event.context.params;

    const registro = await prisma.results_fincaraiz.findFirst({
        where: {
            midinmueble: idSlug,
        },
        select: {
            ciudad: true,
            //contactPhone: true,
            fechaActualizacion: true,
            midinmueble: true,
            jsonResult: {
                select: {
                    source: {
                        select: {
                            listing: {
                                select:{
                                    area: true,
                                    locations: {
                                        select: {
                                            neighbourhoods: true,
                                        }
                                    },
                                    price: true,
                                    property_type: true,   //tipo predio,
                                    offer: true, //tipo negocio
                                    //link: true,
                                    //property_type: true,  //inmobiliaria
                                    client: {
                                        select:{
                                            company_name: true  //nombre de la inmobiliaria
                                        }
                                    },
                                    rooms: {
                                        select: {
                                            name: true,
                                        }
                                    },
                                    baths: {
                                        select: {
                                            name: true,
                                        }
                                    },
                                    garages: {
                                        select: {
                                            name: true,
                                        }
                                    },
                                }
                            },
                        }
                    },
                }
            }
        },
    });

    return registro; 

});