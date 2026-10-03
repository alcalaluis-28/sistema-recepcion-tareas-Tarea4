exports.handler = async (event) => {

  console.log(
    "Evento recibido:",
    JSON.stringify(event, null, 2)
  );

  const registros = event.Records || [];

  for (const registro of registros) {

    const bucket =
      registro.s3?.bucket?.name;

    const archivo =
      decodeURIComponent(
        registro.s3?.object?.key
          ?.replace(/\+/g, " ")
      );

    const fecha =
      registro.eventTime;

    const accion =
      registro.eventName;

    console.log(
      "=============================="
    );

    console.log(
      "TAREA RECIBIDA CORRECTAMENTE"
    );

    console.log(
      "Archivo:",
      archivo
    );

    console.log(
      "Bucket:",
      bucket
    );

    console.log(
      "Acción:",
      accion
    );

    console.log(
      "Fecha:",
      fecha
    );

    console.log(
      "=============================="
    );
  }

  return {
    statusCode: 200,

    body: JSON.stringify({
      mensaje:
        "Evento de subida procesado correctamente",
    }),
  };
};