// Importa el cliente Prisma
import { PrismaClient } from "@prisma/client";

// Crea una instancia de PrismaClient, que se utiliza para interactuar con la base de datos
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const cuerpo = await readBody(event);
  const id_registro = cuerpo.id;
  const ruta_name = cuerpo.ruta_name;
  const fecha_video = cuerpo.fecha_video;
  const id_ruta = cuerpo.id_ruta;
  const procesado = cuerpo.procesado;

  if (!(id && ruta_name))
    return createError({
      statusCode: 400,
      statusMessage: "Missing id or ruta",
    });

  let editar_ruta;

  if (id && ruta_name)
    editar_ruta = await prisma.registro_videos.update({
      where: {
        id_registro: id_registro,
      },
      data: {
        ruta_name: ruta_name,
        fecha_video: fecha_video,
        id_ruta: id_ruta,
        procesado: procesado,
      },
    });
  // Realiza una consulta a la base de datos utilizando Prisma para obtener datos específicos de una ruta con el ID proporcionado
  return editar_ruta;
});
