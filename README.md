# 📚 Sistema de Recepción de Tareas

Aplicación web desarrollada para la **Tarea 04**, utilizando servicios AWS simulados localmente mediante **Floci y Docker**.

El sistema permite administrar archivos de tareas almacenados en Amazon S3 y demostrar el funcionamiento de eventos automáticos mediante **AWS Lambda** y **EventBridge Scheduler**.

---

## 🎯 Objetivo

Implementar una aplicación que permita gestionar tareas mediante almacenamiento S3 y desarrollar dos procesos automáticos:

🔷 **Actividad 01:** detectar la carga de un archivo en Amazon S3 y ejecutar automáticamente una función Lambda.

🔶 **Actividad 02:** ejecutar automáticamente una rutina programada mediante EventBridge Scheduler y AWS Lambda.

---

## ✨ Funcionalidades

◇ Subir archivos de tareas.  
◇ Listar archivos almacenados.  
◇ Mostrar fecha y tamaño del archivo.  
◇ Descargar tareas.  
◇ Eliminar archivos.  
◇ Detectar automáticamente nuevas cargas en S3.  
◇ Ejecutar funciones Lambda.  
◇ Generar un resumen automático de tareas almacenadas.  
◇ Ejecutar procesos mediante EventBridge Scheduler.  
◇ Consultar resultados mediante logs.

---

## 🛠️ Tecnologías utilizadas

| Tecnología | Uso |
|---|---|
| 🟢 JavaScript | Lógica del proyecto |
| 🟩 Node.js | Entorno de ejecución |
| 📦 Express | Servidor backend |
| 📁 Multer | Gestión de archivos |
| 🌐 HTML5 | Interfaz web |
| 🎨 CSS3 | Diseño de la interfaz |
| ☁️ AWS SDK | Comunicación con servicios AWS |
| ◆ Amazon S3 | Almacenamiento de tareas |
| ⚡ AWS Lambda | Procesamiento automático |
| ⏰ EventBridge Scheduler | Ejecución programada |
| ◆ Floci | Simulación local de servicios AWS |
| 🐳 Docker | Ejecución de Floci |
| ◆ Git / GitHub | Control de versiones |

---

## 📂 Estructura del proyecto

```text
sistema-recepcion-tareas/
│
├── backend/
│   └── server.js
│
├── config/
│   └── s3-notification.json
│
├── frontend/
│   ├── app.js
│   ├── index.html
│   └── style.css
│
├── lambdas/
│   ├── recepcion-tarea/
│   │   └── index.js
│   │
│   └── resumen-tareas/
│       ├── index.js
│       ├── package.json
│       └── package-lock.json
│
├── scripts/
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── GUIA_EJECUCION.md
```

---

# 🔷 ACTIVIDAD 01 — S3 + Lambda

## 📌 Descripción

La primera actividad consiste en detectar automáticamente cuando un archivo es cargado en Amazon S3 y ejecutar una función Lambda.

### Flujo de funcionamiento

```text
Usuario
   ↓
Aplicación Web
   ↓
Backend Node.js
   ↓
Amazon S3
   ↓
Evento s3:ObjectCreated:*
   ↓
Lambda recepcion-tarea
   ↓
Registro en logs
```

---

## 🪣 Bucket utilizado

El bucket utilizado por el proyecto es:

```text
laboratorio-floci
```

Este bucket almacena los archivos enviados desde la aplicación web.

---

## ⚡ Lambda `recepcion-tarea`

La función se encuentra en:

```text
lambdas/recepcion-tarea/index.js
```

Su función principal es recibir el evento generado por S3 y registrar información relacionada con el archivo cargado.

Ejemplo de salida:

```text
==============================
TAREA RECIBIDA CORRECTAMENTE
Archivo: nombre-del-archivo
Bucket: laboratorio-floci
Acción: ObjectCreated:Put
Fecha: fecha-del-evento
==============================
```

---

## 🔗 Evento S3

La configuración del evento se encuentra en:

```text
config/s3-notification.json
```

El evento utilizado es:

```text
s3:ObjectCreated:*
```

Esto permite que la función Lambda se ejecute automáticamente cada vez que se carga un archivo nuevo en el bucket.

---

## ✅ Resultado de la Actividad 01

Se comprobó correctamente:

✔ Carga de archivos desde la aplicación web.  
✔ Almacenamiento de archivos en Amazon S3.  
✔ Generación del evento `ObjectCreated`.  
✔ Ejecución automática de `recepcion-tarea`.  
✔ Registro de la información en los logs.

Resultado:

```text
S3 → Lambda → Notificación
```

✅ **Actividad 01 implementada y probada correctamente.**

---

# 🔶 ACTIVIDAD 02 — Lambda + Scheduler

## 📌 Descripción

La segunda actividad consiste en ejecutar automáticamente una rutina mediante EventBridge Scheduler.

La rutina desarrollada consulta el bucket S3 y cuenta la cantidad de tareas almacenadas.

### Flujo de funcionamiento

```text
EventBridge Scheduler
        ↓
Lambda resumen-tareas
        ↓
Amazon S3
        ↓
Listado de archivos
        ↓
Conteo de tareas
        ↓
Resumen en logs
```

---

## ⚡ Lambda `resumen-tareas`

La función se encuentra en:

```text
lambdas/resumen-tareas/index.js
```

Esta función realiza las siguientes acciones:

◇ Se conecta con Amazon S3.  
◇ Consulta los archivos almacenados.  
◇ Cuenta la cantidad de tareas.  
◇ Registra el resultado en los logs.

Ejemplo:

```text
==============================
RESUMEN AUTOMÁTICO DE TAREAS
Total de tareas: 0
Fecha: 2026-10-03T16:35:41.846Z
Estado: Proceso ejecutado correctamente
==============================
```

---

## ⏰ EventBridge Scheduler

Para las pruebas se creó el Scheduler:

```text
resumen-tareas-programado
```

La expresión utilizada fue:

```text
rate(1 minute)
```

Esto permitió comprobar que la función `resumen-tareas` se ejecutaba automáticamente cada minuto.

---

## ✅ Resultado de la Actividad 02

Se registraron ejecuciones automáticas consecutivas en los logs.

Ejemplo:

```text
16:34:34
RESUMEN AUTOMÁTICO DE TAREAS
Total de tareas: 0
Estado: Proceso ejecutado correctamente
```

Posteriormente:

```text
16:35:41
RESUMEN AUTOMÁTICO DE TAREAS
Total de tareas: 0
Estado: Proceso ejecutado correctamente
```

Esto demuestra que el Scheduler ejecutó correctamente la función Lambda.

Resultado:

```text
Scheduler → Lambda → S3 → Resumen
```

✅ **Actividad 02 implementada y probada correctamente.**

---

## ▶️ Inicio rápido

### 1. Iniciar Floci

```powershell
floci start
```

### 2. Verificar el entorno

```powershell
floci doctor
```

### 3. Instalar dependencias

```powershell
npm install
```

### 4. Ejecutar el servidor

```powershell
node backend/server.js
```

### 5. Abrir la aplicación

```text
http://localhost:3000
```

> 📌 La configuración detallada de AWS CLI, S3, Lambda y Scheduler se encuentra en `GUIA_EJECUCION.md`.

---

## 🧪 Pruebas realizadas

✔ Inicio correcto de Floci.  
✔ Conexión mediante AWS CLI.  
✔ Creación del bucket S3.  
✔ Subida de archivos.  
✔ Listado de tareas.  
✔ Descarga de archivos.  
✔ Eliminación de archivos.  
✔ Evento automático S3 → Lambda.  
✔ Ejecución de `recepcion-tarea`.  
✔ Ejecución manual de `resumen-tareas`.  
✔ Consulta de archivos desde Lambda.  
✔ Creación de EventBridge Scheduler.  
✔ Ejecución automática mediante Scheduler.  
✔ Visualización de resultados en los logs.

---

## 📌 Resultado final

El proyecto integra:

```text
Aplicación Web
      +
Node.js / Express
      +
Amazon S3
      +
AWS Lambda
      +
EventBridge Scheduler
      +
Floci / Docker
```

Se logró implementar correctamente las dos actividades requeridas utilizando servicios AWS simulados en un entorno local.

---

## ✅ Conclusión

El desarrollo del proyecto permitió aplicar conceptos de almacenamiento, eventos y automatización utilizando servicios AWS mediante Floci.

En la **Actividad 01**, se implementó un proceso automático que detecta la carga de archivos en Amazon S3 y ejecuta una función Lambda.

En la **Actividad 02**, se configuró EventBridge Scheduler para ejecutar periódicamente una segunda función Lambda encargada de consultar y resumir las tareas almacenadas.

Además, se desarrolló una aplicación web que permite gestionar los archivos de manera práctica desde el navegador.

---

## 📖 Documentación

La instalación, configuración y ejecución detallada del proyecto se encuentra en:

[📖 Ver guía de ejecución](Guia_Ejecucion.md)

---

## 👨‍💻 Autor

**Luis Alcalá**

📘 Proyecto: **Sistema de Recepción de Tareas**  
📌 Actividad académica: **Tarea 04**