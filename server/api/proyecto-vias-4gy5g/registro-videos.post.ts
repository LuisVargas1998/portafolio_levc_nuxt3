// Importa el cliente Prisma
import { PrismaClient } from "@prisma/client";

// Crea una instancia de PrismaClient, que se utiliza para interactuar con la base de datos
const prisma = new PrismaClient();

// Exporta una función que probablemente se utilice como manejador de eventos
export default defineEventHandler(async (event) => {
  const cuerpo = await readBody(event);
  let nueva_ruta = null;

  if (cuerpo.ruta)
    await prisma.registro_videos
      .create({
        data: {
          ruta: cuerpo.ruta,
          fecha_grabacion: new Date(cuerpo.fecha_grabacion),
          id_almacenamiento_video: cuerpo.id_almacenamiento_video,
          id_almacenamiento_archivo: cuerpo.id_almacenamiento_archivo,
          procesado: cuerpo.procesado,
        },
      })
      .then((response) => {
        nueva_ruta = response;
      });
  return {
    nueva_ruta: nueva_ruta,
  };
});

// data: {
//   ruta_name: "Borrar",
//   fecha_video: "2023-06-19",
//   id_ruta: "aasda3sasasd",
//   procesado: false,
// },
