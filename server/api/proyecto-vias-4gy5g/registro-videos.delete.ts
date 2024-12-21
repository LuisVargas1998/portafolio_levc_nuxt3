// Importa el cliente Prisma
import { PrismaClient } from "@prisma/client";

// Crea una instancia de PrismaClient, que se utiliza para interactuar con la base de datos
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const cuerpo = await readBody(event);
  let borrar_ruta = null;
  let error = null;

  if (cuerpo.id_registro)
    await prisma.registro_videos
      .delete({
        where: {
          id_registro: cuerpo.id_registro,
        },
      })
      .then((response) => {
        borrar_ruta = response;
      })
      .catch(async (e) => {
        error = e;
      });
  if (error)
    return createError({ statusCode: 500, statusMessage: "Server Error" });
  return borrar_ruta;
});
