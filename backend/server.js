const express = require("express");
const multer = require("multer");
const path = require("path");

const {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");

const app = express();

const PORT = 3000;


// Multer mantiene temporalmente
// los archivos en memoria
const upload = multer({
  storage: multer.memoryStorage(),
});


// Conexión con S3 mediante Floci
const s3 = new S3Client({
  region: "us-east-1",

  endpoint:
    "http://localhost.floci.io:4566",

  forcePathStyle: true,

  credentials: {
    accessKeyId: "test",
    secretAccessKey: "test",
  },
});


// Bucket del proyecto
const BUCKET =
  "laboratorio-floci";


app.use(express.json());


// Servir frontend
app.use(
  express.static(
    path.join(
      __dirname,
      "../frontend"
    )
  )
);


// =====================================
// SUBIR ARCHIVO
// =====================================

app.post(
  "/upload",

  upload.single("archivo"),

  async (req, res) => {

    try {

      if (!req.file) {

        return res
          .status(400)
          .json({
            ok: false,

            message:
              "No se seleccionó ningún archivo.",
          });

      }


      const command =
        new PutObjectCommand({

          Bucket: BUCKET,

          Key:
            req.file.originalname,

          Body:
            req.file.buffer,

          ContentType:
            req.file.mimetype,

        });


      await s3.send(command);


      res.json({

        ok: true,

        message:
          "Tarea subida correctamente.",

        archivo:
          req.file.originalname,

      });


    } catch (error) {

      console.error(
        "Error al subir:",
        error
      );


      res.status(500).json({

        ok: false,

        message:
          "Error al subir la tarea.",

      });

    }

  }
);


// =====================================
// LISTAR ARCHIVOS
// =====================================

app.get(
  "/files",

  async (req, res) => {

    try {

      const command =
        new ListObjectsV2Command({

          Bucket: BUCKET,

        });


      const result =
        await s3.send(command);


      const archivos =
        (result.Contents || [])
          .map((item) => ({

            nombre:
              item.Key,

            fecha:
              item.LastModified,

            tamaño:
              item.Size,

          }));


      res.json({

        ok: true,

        archivos,

      });


    } catch (error) {

      console.error(
        "Error al listar:",
        error
      );


      res.status(500).json({

        ok: false,

        message:
          "Error al listar las tareas.",

      });

    }

  }
);


// =====================================
// DESCARGAR ARCHIVO
// =====================================

app.get(
  "/files/:key/download",

  async (req, res) => {

    try {

      const key =
        decodeURIComponent(
          req.params.key
        );


      const command =
        new GetObjectCommand({

          Bucket: BUCKET,

          Key: key,

        });


      const result =
        await s3.send(command);


      res.setHeader(
        "Content-Disposition",

        `attachment; filename="${encodeURIComponent(
          key
        )}"`
      );


      if (result.ContentType) {

        res.setHeader(
          "Content-Type",
          result.ContentType
        );

      }


      result.Body.pipe(res);


    } catch (error) {

      console.error(
        "Error al descargar:",
        error
      );


      res.status(500).json({

        ok: false,

        message:
          "Error al descargar la tarea.",

      });

    }

  }
);


// =====================================
// ELIMINAR ARCHIVO
// =====================================

app.delete(
  "/files/:key",

  async (req, res) => {

    try {

      const key =
        decodeURIComponent(
          req.params.key
        );


      const command =
        new DeleteObjectCommand({

          Bucket: BUCKET,

          Key: key,

        });


      await s3.send(command);


      res.json({

        ok: true,

        message:
          "Tarea eliminada correctamente.",

      });


    } catch (error) {

      console.error(
        "Error al eliminar:",
        error
      );


      res.status(500).json({

        ok: false,

        message:
          "Error al eliminar la tarea.",

      });

    }

  }
);


// =====================================
// INICIAR SERVIDOR
// =====================================

app.listen(
  PORT,
  () => {

    console.log(
      `Servidor iniciado en http://localhost:${PORT}`
    );

    console.log(
      `Bucket configurado: ${BUCKET}`
    );

  }
);