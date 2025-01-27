import { MongoClient } from "mongodb";
import { defineEventHandler } from "h3";
import { config } from "dotenv";
import { PrismaClient } from "@prisma/client";

config(); // Cargar variables de entorno

const uri = process.env.DATABASE_URL2;
const client = new MongoClient(uri);
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    // Realiza un GET a Mongo (a traves de Prisma) y obtiener el nombre de la  colección
    // colección que contiene la data de la ruta con las detecciones que se van a mostrar en el mapa
    const dataWeb = await prisma.variables_de_procesamiento.findUnique({
      where: {
        id: "67664052d7c302ba37ad619c",
      },
    });

    if (!dataWeb || !dataWeb.ruta_mapa) {
      return { status: 400, message: "Nombre de la colección no encontrado" };
    }

    const nombreColeccion = dataWeb.ruta_mapa;

    //Realiza un GET a MongoDB y obtener la data de la colección que contiene las detecciones
    await client.connect();
    const database = client.db("data_detections");
    const collection = database.collection(nombreColeccion);

    const documents = await collection.find({}).toArray();

    return { status: 200, data: documents };
  } catch (error) {
    return { status: 500, message: error.message };
  } finally {
    await client.close();
  }
});
