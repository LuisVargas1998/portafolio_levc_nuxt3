// Importa el cliente Prisma
import { PrismaClient } from "@prisma/client";

// Crea una instancia de PrismaClient, que se utiliza para interactuar con la base de datos
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const cuerpo = await readBody(event);
  const ruta_mapa = cuerpo.ruta_mapa;

  let editar_nombreColeccion;

  editar_nombreColeccion = await prisma.variables_de_procesamiento.update({
    where: {
      id: "67664052d7c302ba37ad619c",
    },
    data: {
      ruta_mapa: ruta_mapa,
    },
  });
  // Realiza una consulta a la base de datos utilizando Prisma para obtener datos específicos de una ruta con el ID proporcionado
  return editar_nombreColeccion;
});
