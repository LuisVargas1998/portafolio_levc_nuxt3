// Importa el cliente Prisma
import { PrismaClient } from "@prisma/client";

// Crea una instancia de PrismaClient, que se utiliza para interactuar con la base de datos
const prisma = new PrismaClient();

export default defineEventHandler(async () => {
  // Consulta la base de datos para obtener el id elegido por el usuario
  const id_documentos = await prisma.ides.findUnique({
    where: {
      id: "65910f2a638c3d74ebbf27c4",
    },
  });

  //Consulta la base de datos para obtener el geojson para enviar los datos de ruta
  const dataGeoespacial = await prisma.geojsons.findUnique({
    where: {
      id: id_documentos?.id_geojson,
    },
  });

  //  655d4ea379bde6157aefc6ee    Marsella - IGG
  //  655d4ff479bde6157aefc6f8    Marsella - UD
  //  655d500179bde6157aefc6f9    ruta Video

  //Imprime en la consola el valor de la coordenada en la posición 0 del tercer elemento del array
  // console.log(
  //   "De geojsons se toma se y se envia la siguiente data: ",
  //   dataGeoespacial
  // );

  return dataGeoespacial;
});
