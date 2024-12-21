// Importa el cliente Prisma
import { PrismaClient } from "@prisma/client";

// Crea una instancia de PrismaClient, que se utiliza para interactuar con la base de datos
const prisma = new PrismaClient();

// Exporta una función que probablemente se utilice como manejador de eventos
export default defineEventHandler(async () => {
  // Realiza una consulta a la base de datos utilizando Prisma para obtener datos específicos de una ruta con el ID proporcionado

  const id_documentos = await prisma.ides.findUnique({
    where: {
      id: "65910f2a638c3d74ebbf27c4",
    },
  });

  const dataMetadata = await prisma.metadata.findUnique({
    where: {
      id: id_documentos?.id_metadata,
    },
  });

  // 6566eb3710a210a6879f1f00   Ruta 1 Video
  // 6566ed4b10a210a6879f1f01   Marsella - IGG

  // Imprime en la consola el valor de la coordenada en la posición 0 del tercer elemento del array
  //console.log("De geojsons se toma se y se envia la siguiente data: ", dataGeoespacial);

  // Retorna el mismo valor
  return dataMetadata;
});
