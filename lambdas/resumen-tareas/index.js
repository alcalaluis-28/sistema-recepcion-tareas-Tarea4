    const {
  S3Client,
  ListObjectsV2Command
} = require("@aws-sdk/client-s3");

// Conexión con S3 local mediante Floci
const s3 = new S3Client({
  region: "us-east-1",
  endpoint: "http://host.docker.internal:4566",
  forcePathStyle: true,
  credentials: {
    accessKeyId: "test",
    secretAccessKey: "test"
  }
});

// Bucket del proyecto
const BUCKET = "laboratorio-floci";

exports.handler = async () => {
  try {

    // Obtener archivos almacenados
    const command = new ListObjectsV2Command({
      Bucket: BUCKET
    });

    const result = await s3.send(command);

    // Contar tareas recibidas
    const total = (result.Contents || []).length;

    // Mostrar resumen en logs
    console.log("==============================");
    console.log("RESUMEN AUTOMÁTICO DE TAREAS");
    console.log("Total de tareas:", total);
    console.log("Fecha:", new Date().toISOString());
    console.log("Estado: Proceso ejecutado correctamente");
    console.log("==============================");

    return {
      statusCode: 200,
      body: JSON.stringify({
        totalTareas: total,
        mensaje: "Resumen generado correctamente"
      })
    };

  } catch (error) {

    // Mostrar error si ocurre un problema
    console.error("Error:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        mensaje: "Error al generar el resumen"
      })
    };
  }
};