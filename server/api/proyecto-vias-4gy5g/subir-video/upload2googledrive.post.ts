import { google } from "googleapis"; //Intalación de googleapis
import { readMultipartFormData } from "h3";
import apikeys from "./credential-vargasluis.igg@gmail.com.json"; //cambiar de credencial cuando sea necesario
import { PassThrough } from "stream";
import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";

config(); // Cargar variables de entorno

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  // Constante con los permisos necesarios para acceder a Google Drive

  // DEFINICIÓN DE CONSTANTES
  const SCOPE = ["https://www.googleapis.com/auth/drive"]; // Permisos para acceder a Google Drive
  const carpetaDriveID = "1B-gPwm73w89TLogeLfkC3OvGZBvpeG3E"; // ID de la carpeta de destino del Drive
  const email = "levc.proyectovias4gy5g@gmail.com"; // Correo electrónico para compartir el archivo

  // //Función para autenticar el cliente con archivo JSON de credenciales GDrive
  // const authorize = async () => {
  //   console.log("client email :", apikeys.client_email);
  //   console.log("private key :", apikeys.private_key);
  //   const jwtClient = new google.auth.JWT(
  //     // Credenciales de la cuenta de servicio
  //     apikeys.client_email,
  //     null,
  //     apikeys.private_key,
  //     SCOPE
  //   );
  //   await jwtClient.authorize();
  //   return jwtClient;
  // };

  // Función para autenticar el cliente con data importada de MongoDB
  const authorize = async (credentials) => {
    const privateKey = credentials.private_key.replace(/\\n/g, "\n"); // Reemplazar \\n con saltos de línea reales si es necesario

    const jwtClient = new google.auth.JWT(
      credentials.client_email,
      null,
      privateKey,
      SCOPE
    );
    await jwtClient.authorize();
    return jwtClient;
  };

  // Función para generar una cadena aleatoria
  const generateRandomString = (length) => {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  // Función para subir un archivo a Google Drive
  const uploadFile = (authClient, fileBuffer, fileName, mimeType) => {
    // Se retorna una promesa para poder esperar a que se complete la subida del archivo
    return new Promise((resolve, reject) => {
      // Inicialización del cliente de Google Drive
      const drive = google.drive({ version: "v3", auth: authClient });

      // Metadatos del archivo a subir
      const fileMetaData = {
        name: fileName,
        parents: [carpetaDriveID],
      };

      const bufferStream = new PassThrough(); // Se crea un stream de lectura
      bufferStream.end(fileBuffer); // Se finaliza el stream

      // Configuración del archivo a subir
      const media = {
        mimeType: mimeType,
        body: bufferStream,
      };

      // Se sube el archivo a Google Drive
      drive.files.create(
        {
          resource: fileMetaData,
          media: media,
          fields: "id, name, webViewLink",
        },
        (error, res) => {
          if (error) {
            reject(error);
          } else {
            resolve(res.data);
          }
        }
      );
    });
  };

  // Función para compartir el archivo con un correo electrónico
  const shareFile = (authClient, fileId, email) => {
    return new Promise((resolve, reject) => {
      const drive = google.drive({ version: "v3", auth: authClient });
      const permissions = {
        type: "user",
        role: "writer",
        emailAddress: email,
      };

      drive.permissions.create(
        {
          resource: permissions,
          fileId: fileId,
          fields: "id",
          sendNotificationEmail: true,
        },
        (error, res) => {
          if (error) {
            reject(error);
          } else {
            resolve(res.data);
          }
        }
      );
    });
  };

  // EJECUCIÓN DE LA LÓGICA PRINCIPAL
  try {
    // Realiza un GET a Mongo (a traves de Prisma) y obtiene la data de credenciales de GDrive
    const cred_GDrive = await prisma.credenciales_GDrive.findUnique({
      where: {
        id: "67971600d235c1b4c2c12f4d",
        // Se está realizando con las credenciales de vargasluis.igg1@gmail.com
      },
    });

    if (!cred_GDrive) {
      return { status: 400, message: "Nombre de la colección no encontrado" };
    }

    // // Autenticación del cliente de Google Drive con archivo JSON de credenciales
    // const authClient = await authorize();
    // Autenticación del cliente de Google Drive con credenciales importadas de MongoDB
    const authClient = await authorize(cred_GDrive);

    // Lectura de los archivos subidos desde el evento
    const files = await readMultipartFormData(event);

    // Subida de los archivos a Google Drive
    const uploadPromises = files.map(async (file) => {
      // Obtener la fecha y hora actual
      const currentDate = new Date();

      // Formatear la fecha y hora actual en una cadena sin caracteres especiales
      const formattedDate = currentDate
        .toISOString() // Convertir la fecha a formato ISO
        .replace(/[-:.TZ]/g, "") // Eliminar caracteres especiales
        .slice(0, 14); // Tomar solo los primeros 14 caracteres (YYYYMMDDHHMMSS)

      // Generar una cadena aleatoria de 20 caracteres
      const randomString = generateRandomString(20);

      // Crear un nombre de archivo único combinando la fecha, cadena aleatoria y nombre original del archivo
      //const fileName = `${formattedDate}_${randomString}_${file.filename}`;
      const fileName = `${file.filename}`; // Nombre original del archivo

      // Subir el archivo a Google Drive
      const uploadedFile = await uploadFile(
        authClient, // Cliente de autenticación
        file.data, // Datos del archivo
        fileName, // Nombre del archivo
        file.mimetype // Tipo MIME del archivo
      );

      // Compartir el archivo subido con un correo electrónico específico
      await shareFile(authClient, uploadedFile.id, email);

      // Devolver el archivo subido
      return uploadedFile;
    });

    // Esperar a que todas las promesas de subida se resuelvan
    const uploadedFiles = await Promise.all(uploadPromises);

    // Devolver los archivos subidos
    return uploadedFiles;
  } catch (error) {
    // Manejar errores y devolver el mensaje de error
    return { error: error.message };
  }
});
