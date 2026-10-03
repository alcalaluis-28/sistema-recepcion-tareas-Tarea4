const formTarea =
  document.getElementById("formTarea");

const archivoInput =
  document.getElementById("archivo");

const nombreArchivo =
  document.getElementById("nombreArchivo");

const mensaje =
  document.getElementById("mensaje");

const listaTareas =
  document.getElementById("listaTareas");

const btnActualizar =
  document.getElementById("btnActualizar");

const contador =
  document.getElementById("contador");


// =====================================
// CONFIGURACIÓN DEL MODAL
// =====================================

let archivoPendienteEliminar = null;

const modalEliminar =
  new bootstrap.Modal(
    document.getElementById("modalEliminar")
  );

const archivoEliminar =
  document.getElementById("archivoEliminar");

const btnConfirmarEliminar =
  document.getElementById(
    "btnConfirmarEliminar"
  );


// =====================================
// MOSTRAR ARCHIVO SELECCIONADO
// =====================================

archivoInput.addEventListener(
  "change",
  () => {

    const archivo =
      archivoInput.files[0];

    if (archivo) {

      nombreArchivo.textContent =
        archivo.name;

    } else {

      nombreArchivo.textContent =
        "Ningún archivo seleccionado";

    }

  }
);


// =====================================
// SUBIR TAREA
// =====================================

formTarea.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();

    const archivo =
      archivoInput.files[0];


    if (!archivo) {

      mostrarMensaje(
        "Selecciona un archivo.",
        "error"
      );

      return;
    }


    const formData =
      new FormData();

    formData.append(
      "archivo",
      archivo
    );


    mostrarMensaje(
      "Subiendo archivo...",
      "info"
    );


    try {

      const response =
        await fetch(
          "/upload",
          {
            method: "POST",
            body: formData,
          }
        );


      const data =
        await response.json();


      if (data.ok) {

        mostrarMensaje(
          "Tarea recibida correctamente.",
          "success"
        );


        archivoInput.value = "";

        nombreArchivo.textContent =
          "Ningún archivo seleccionado";


        cargarTareas();

      } else {

        mostrarMensaje(
          data.message,
          "error"
        );

      }

    } catch (error) {

      mostrarMensaje(
        "Error de conexión.",
        "error"
      );

    }

  }
);


// =====================================
// CARGAR TAREAS
// =====================================

async function cargarTareas() {

  contador.textContent =
    "Actualizando...";


  try {

    const response =
      await fetch("/files");


    const data =
      await response.json();


    listaTareas.innerHTML = "";


    const archivos =
      data.archivos || [];


    contador.textContent =
      `${archivos.length} archivo${
        archivos.length === 1
          ? ""
          : "s"
      }`;


    if (archivos.length === 0) {

      listaTareas.innerHTML = `
        <div class="empty">

          <div class="empty-icon">
            □
          </div>

          <strong>
            No hay tareas recibidas
          </strong>

        </div>
      `;

      return;
    }


    archivos.forEach(
      (archivo) => {

        crearElementoTarea(
          archivo
        );

      }
    );


  } catch (error) {

    contador.textContent =
      "Error";


    listaTareas.innerHTML = `
      <div class="empty">
        No se pudieron cargar las tareas.
      </div>
    `;

  }

}


// =====================================
// CREAR ELEMENTO
// =====================================

function crearElementoTarea(
  archivo
) {

  const item =
    document.createElement("div");


  item.className =
    "task-item";


  const fecha =
    new Date(
      archivo.fecha
    ).toLocaleString();


  item.innerHTML = `

    <div class="task-data">

      <div class="file-icon">
        ${obtenerIcono(
          archivo.nombre
        )}
      </div>


      <div class="file-info">

        <span class="file-name">
        </span>


        <div class="file-details">

          <span>
            ${fecha}
          </span>

          <span>
            ${formatearTamaño(
              archivo.tamaño
            )}
          </span>

        </div>

      </div>

    </div>


    <div class="actions">

      <button
        class="btn-download"
      >
        Descargar
      </button>


      <button
        class="btn-delete"
      >
        Eliminar
      </button>

    </div>

  `;


  // Nombre del archivo
  item.querySelector(
    ".file-name"
  ).textContent =
    archivo.nombre;


  // Descargar
  item.querySelector(
    ".btn-download"
  ).addEventListener(
    "click",
    () => {

      descargarTarea(
        archivo.nombre
      );

    }
  );


  // Eliminar
  item.querySelector(
    ".btn-delete"
  ).addEventListener(
    "click",
    () => {

      abrirModalEliminar(
        archivo.nombre
      );

    }
  );


  listaTareas.appendChild(
    item
  );

}


// =====================================
// DESCARGAR
// =====================================

function descargarTarea(nombre) {

  const key =
    encodeURIComponent(nombre);


  window.location.href =
    `/files/${key}/download`;

}


// =====================================
// ABRIR MODAL DE ELIMINACIÓN
// =====================================

function abrirModalEliminar(
  nombre
) {

  archivoPendienteEliminar =
    nombre;


  archivoEliminar.textContent =
    nombre;


  modalEliminar.show();

}


// =====================================
// CONFIRMAR ELIMINACIÓN
// =====================================

btnConfirmarEliminar.addEventListener(
  "click",
  async () => {

    if (!archivoPendienteEliminar) {
      return;
    }


    btnConfirmarEliminar.disabled =
      true;


    btnConfirmarEliminar.textContent =
      "Eliminando...";


    try {

      const key =
        encodeURIComponent(
          archivoPendienteEliminar
        );


      const response =
        await fetch(
          `/files/${key}`,
          {
            method: "DELETE",
          }
        );


      const data =
        await response.json();


      if (data.ok) {

        modalEliminar.hide();


        mostrarMensaje(
          "Tarea eliminada correctamente.",
          "success"
        );


        archivoPendienteEliminar =
          null;


        cargarTareas();

      } else {

        mostrarMensaje(
          data.message ||
          "No se pudo eliminar.",
          "error"
        );

      }


    } catch (error) {

      mostrarMensaje(
        "No se pudo eliminar la tarea.",
        "error"
      );


    } finally {

      btnConfirmarEliminar.disabled =
        false;


      btnConfirmarEliminar.textContent =
        "Eliminar tarea";

    }

  }
);


// =====================================
// MENSAJES
// =====================================

function mostrarMensaje(
  texto,
  tipo
) {

  mensaje.textContent =
    texto;


  mensaje.className =
    tipo;

}


// =====================================
// FORMATEAR TAMAÑO
// =====================================

function formatearTamaño(
  bytes
) {

  if (bytes < 1024) {

    return `${bytes} B`;

  }


  if (
    bytes <
    1024 * 1024
  ) {

    return `${(
      bytes / 1024
    ).toFixed(1)} KB`;

  }


  return `${(
    bytes /
    (1024 * 1024)
  ).toFixed(1)} MB`;

}


// =====================================
// TIPO DE ARCHIVO
// =====================================

function obtenerIcono(nombre) {

  const extension =
    nombre
      .split(".")
      .pop()
      .toLowerCase();


  const iconos = {

    pdf: "PDF",

    doc: "W",
    docx: "W",

    xls: "X",
    xlsx: "X",

    txt: "TXT",

    jpg: "IMG",
    jpeg: "IMG",
    png: "IMG",

    zip: "ZIP",

  };


  return (
    iconos[extension] ||
    "FILE"
  );

}


// =====================================
// ACTUALIZAR LISTA
// =====================================

btnActualizar.addEventListener(
  "click",
  cargarTareas
);


// =====================================
// CARGA INICIAL
// =====================================

cargarTareas();