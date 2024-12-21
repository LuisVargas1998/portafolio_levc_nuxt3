// Importa el cliente Prisma
import { PrismaClient } from "@prisma/client";

// Crea una instancia de PrismaClient, que se utiliza para interactuar con la base de datos
const prisma = new PrismaClient();

// Exporta una función que probablemente se utilice como manejador de eventos
export default defineEventHandler(async () => {
  // Realiza una consulta a la base de datos utilizando Prisma para obtener datos específicos de una ruta con el ID proporcionado
  return await prisma.registro_videos.findMany();
});
