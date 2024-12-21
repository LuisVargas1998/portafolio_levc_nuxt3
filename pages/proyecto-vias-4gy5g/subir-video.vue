<template>
  <div class="container-titulo">
    <div class="content1">Procesar un nuevo video</div>
  </div>
  <div class="container2">
    <!-- Paso 1: Solicitar el nombre del sitio del punto de inicio de la ruta -->
    <div v-if="step === 1" class="step-container">
      <h2>Escriba el nombre del sitio donde inició la ruta</h2>
      <input type="text" v-model="startPoint" class="input-field" />
      <button @click="saveStartPoint" class="button">Guardar</button>
    </div>
    <!-- Paso 2: Solicitar el nombre del sitio del punto de llegada de la ruta -->
    <div v-else-if="step === 2" class="step-container">
      <h2>Escriba el nombre del sitio donde finalizó la ruta</h2>
      <input type="text" v-model="endPoint" class="input-field" />
      <button @click="saveEndPoint" class="button">Guardar</button>
    </div>
    <!-- Paso 3: Solicitar la fecha en que ha sido grabado el video -->
    <div v-else-if="step === 3" class="step-container">
      <h2>Ingrese la fecha en que ha sido grabado el video</h2>
      <input type="date" v-model="recordingDate" class="input-field" />
      <button @click="saveRecordingDate" class="button">Guardar</button>
    </div>
    <!-- Paso 4: Subir archivos de video y GPS -->
    <div v-else class="step-container">
      <h1>Subir video y archivo gps</h1>
      <p>
        Elija el archivo de video y de gps (recuerde subir los dos al mismo
        tiempo)
      </p>
      <input
        type="file"
        ref="fileInput"
        @change="handleFileChange"
        multiple
        class="input-file"
      />
      <button @click="uploadFiles" class="button">Subir</button>
      <!-- Mostrar URLs de los archivos subidos -->
      <div v-if="uploadUrls.length">
        <p>Uploaded files:</p>
        <ul>
          <li v-for="url in uploadUrls" :key="url">
            <a :href="url" target="_blank">{{ url }}</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { post_data_registro_videos } from "~/composables/proyecto-vias-4gy5g/requests_registro_videos";

// Definir variables reactivas
const step = ref(1); // Paso actual del formulario
const startPoint = ref(""); // Punto de inicio de la ruta
const endPoint = ref(""); // Punto de llegada de la ruta
const recordingDate = ref(""); // Fecha de grabación del video
const fileInput = ref(null); // Referencia al input de archivos
const uploadUrls = ref([]); // URLs de los archivos subidos
const router = useRouter(); // Instancia del router de Vue

// Función para guardar el punto de inicio y avanzar al siguiente paso
const saveStartPoint = () => {
  if (startPoint.value) {
    step.value = 2;
  } else {
    alert(
      "Por favor, ingrese el nombre del sitio del punto de inicio de la ruta."
    );
  }
};

// Función para guardar el punto de llegada y avanzar al siguiente paso
const saveEndPoint = () => {
  if (endPoint.value) {
    step.value = 3;
  } else {
    alert(
      "Por favor, ingrese el nombre del sitio del punto de llegada de la ruta."
    );
  }
};

// Función para guardar la fecha de grabación y avanzar al siguiente paso
const saveRecordingDate = () => {
  if (recordingDate.value) {
    step.value = 4;
  } else {
    alert("Por favor, ingrese la fecha en que ha sido grabado el video.");
  }
};

// Función para manejar el cambio de archivos seleccionados
const handleFileChange = (event) => {
  fileInput.value = event.target.files;
};

// Función para normalizar los nombres de los archivos
const normalizeFileName = (name) => {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Eliminar tildes
    .replace(/\s+/g, "_") // Reemplazar espacios por guiones bajos
    .replace(/[.]/g, "_"); // Reemplazar puntos por guiones bajos
};

// Función para subir los archivos seleccionados y enviar los datos al backend
const uploadFiles = async () => {
  try {
    // Verificar si se han seleccionado archivos
    if (!fileInput.value.length) {
      alert("Por favor, seleccione un archivo primero!");
      return;
    }

    // Crear un objeto FormData para enviar los archivos
    const formData = new FormData();
    const startPointLower = normalizeFileName(startPoint.value);
    const endPointLower = normalizeFileName(endPoint.value);

    // Añadir los archivos al FormData con nombres personalizados
    for (let i = 0; i < fileInput.value.length; i++) {
      const file = fileInput.value[i];
      const fileExtension = file.name.split(".").pop();
      const newFileName = `${startPointLower}-${endPointLower}.${fileExtension}`;
      formData.append("files", file, newFileName);
    }

    // Enviar los archivos al backend y a Drive
    const response = await fetch(
      "/api/proyecto-vias-4gy5g/subir-video/upload2googledrive",
      {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      }
    );

    // Verificar si la respuesta es correcta
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    // Obtener las URLs de los archivos subidos
    const data = await response.json();
    uploadUrls.value = data.map((file) => file.webViewLink);

    // Función para crear nuevo registro en la base de datos
    await post_data_registro_videos(
      startPointLower,
      endPointLower,
      recordingDate.value
    );

    // Mostrar mensaje de éxito y redirigir a otra página
    alert("Su archivo se está procesando, no olvide estar revisando");
    router.push("/proyecto-vias-4gy5g/registro-videos-usuario");
  } catch (error) {
    console.error("Error subiendo los archivos", error);
    alert(
      "Un error ha ocurrido mientras se subían los archivos. Por favor inténtelo de nuevo más tarde."
    );
  }
};

// Función para crear nuevo registro en la base de datos
</script>

<style scoped>
.container-titulo {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 7vh;
  background-color: white;
  border-radius: 5px;
}

.content1 {
  text-align: center;
  font-family: "Poppins", sans-serif;
  font-size: 30px;
  padding: 20px;
  font-weight: 1px;
  letter-spacing: 7px;
}

.container2 {
  background-color: white;
  width: 100%; /* Ajusta el ancho del contenedor */
  height: 65vh; /* 650 Ajusta la altura del contenedor */
  border-radius: 10px; /* Establece las esquinas redondeadas */
  margin-top: 10px; /* Establece la separación entre el contenedor y el resto del contenido */
  overflow-y: auto; /* Habilita el desplazamiento vertical */
  text-align: center;
}

/* Estilos para los pasos del formulario */
.step-container {
  margin: 10%;
  font-size: 70%;
}

/* Estilos para los campos de entrada */
.input-field {
  width: 80%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid black;
  border-radius: 5px;
  font-size: 100%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: border-color 0.3s, box-shadow 0.3s;
}

.input-field:focus {
  border-color: #007bff;
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.25);
}

/* Estilos para el botón */
.button {
  background-color: #19485f;
  color: white;
  padding: 10px 20px;
  border: 1px solid black;
  border-radius: 3px;
  cursor: pointer;
  font-size: 100%;
  margin-top: 10px;
  transition: background-color 0.3s, box-shadow 0.3s;
}

.button:hover {
  background-color: #0056b3;
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.25);
}

/* Estilos para el input de archivos */
.input-file {
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 100%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: border-color 0.3s, box-shadow 0.3s;
}

.input-file:focus {
  border-color: #007bff;
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.25);
}
</style>
