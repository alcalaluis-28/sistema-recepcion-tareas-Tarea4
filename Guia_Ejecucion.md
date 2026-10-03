# 📖 Guía de Ejecución

Esta guía explica paso a paso cómo configurar, ejecutar y probar el proyecto **Sistema de Recepción de Tareas** utilizando **Floci, Docker, AWS CLI, Amazon S3, AWS Lambda y EventBridge Scheduler**.

---

## 📌 1. Requisitos previos

Antes de iniciar, se debe contar con las siguientes herramientas instaladas:

◇ Docker Desktop  
◇ Node.js  
◇ npm  
◇ AWS CLI  
◇ Floci  
◇ Git  
◇ Visual Studio Code  

---

## 🐳 2. Iniciar Docker Desktop

Abrir **Docker Desktop** y verificar que se encuentre ejecutándose correctamente.

Floci utiliza Docker para simular los servicios AWS en el entorno local.

---

## 🔧 3. Iniciar Floci

Desde PowerShell, ejecutar:

```powershell
floci start
```

Se debe obtener un resultado similar a:

```text
Floci AWS is ready (http://localhost:4566)
```

---

## ✅ 4. Verificar el estado de Floci

Ejecutar:

```powershell
floci doctor
```

Este comando permite verificar:

◇ Docker instalado.  
◇ Docker activo.  
◇ Puerto 4566 disponible.  
◇ Contenedor Floci ejecutándose.  
◇ Endpoint accesible.  
◇ Configuración de AWS CLI.

Si todo se encuentra correctamente configurado, Floci estará listo para trabajar.

---

## ☁️ 5. Configurar AWS CLI

Cada vez que se abre una nueva terminal de PowerShell, se deben configurar las variables de entorno:

```powershell
$env:AWS_ENDPOINT_URL = 'http://localhost.floci.io:4566'
$env:AWS_ACCESS_KEY_ID = 'test'
$env:AWS_SECRET_ACCESS_KEY = 'test'
$env:AWS_DEFAULT_REGION = 'us-east-1'
$env:AWS_REGION = 'us-east-1'
```

Estas variables permiten que AWS CLI se conecte al entorno local de Floci.

---

## 🔎 6. Verificar conexión con AWS

Ejecutar:

```powershell
aws s3 ls
```

Si la conexión funciona correctamente, se mostrarán los buckets disponibles.

---

## 📦 7. Instalar dependencias del proyecto

Ubicarse en la carpeta principal:

```powershell
cd D:\Proyecto\sistema-recepcion-tareas
```

Instalar las dependencias:

```powershell
npm install
```

Las dependencias principales utilizadas son:

```text
express
multer
dotenv
@aws-sdk/client-s3
```

---

## 🪣 8. Crear el bucket S3

El proyecto utiliza el bucket:

```text
laboratorio-floci
```

Para crearlo:

```powershell
aws s3 mb s3://laboratorio-floci --region us-east-1
```

Verificar:

```powershell
aws s3 ls
```

Debe aparecer:

```text
laboratorio-floci
```

---

## 🌐 9. Ejecutar la aplicación web

Desde la raíz del proyecto:

```powershell
node backend/server.js
```

La aplicación estará disponible en:

```text
http://localhost:3000
```

Desde la interfaz web se pueden realizar las siguientes acciones:

◇ Subir archivos.  
◇ Listar tareas.  
◇ Descargar archivos.  
◇ Eliminar archivos.  
◇ Actualizar la lista de tareas.

---
# 🔷 ACTIVIDAD 01 — S3 + Lambda

## 📌 10. Objetivo

La primera actividad consiste en detectar automáticamente la carga de un archivo en Amazon S3 y ejecutar una función Lambda.

El flujo implementado es:

```text
Aplicación Web
      ↓
Backend Node.js
      ↓
Amazon S3
      ↓
Evento ObjectCreated
      ↓
Lambda recepcion-tarea
      ↓
Registro en logs
```

---

## ⚡ 11. Crear la función Lambda

La función utilizada en esta actividad se encuentra en:

```text
lambdas/recepcion-tarea/index.js
```

Su función es recibir el evento generado por S3 y registrar la información del archivo cargado.

---

## 📦 12. Crear el archivo ZIP

Desde la raíz del proyecto:

```powershell
Compress-Archive `
  -Path .\lambdas\recepcion-tarea\index.js `
  -DestinationPath .\recepcion-tarea.zip `
  -Force
```

Esto genera:

```text
recepcion-tarea.zip
```

---

## ⚡ 13. Crear la Lambda `recepcion-tarea`

Ejecutar:

```powershell
aws lambda create-function `
  --function-name recepcion-tarea `
  --runtime nodejs22.x `
  --region us-east-1 `
  --role arn:aws:iam::000000000000:role/lambda-role `
  --handler index.handler `
  --zip-file fileb://recepcion-tarea.zip
```

Verificar las funciones creadas:

```powershell
aws lambda list-functions
```

Debe aparecer:

```text
recepcion-tarea
```

---

## 🔗 14. Configurar el evento de S3

La configuración se encuentra en:

```text
config/s3-notification.json
```

Contenido:

```json
{
  "LambdaFunctionConfigurations": [
    {
      "Id": "NotificarNuevaTarea",
      "LambdaFunctionArn": "arn:aws:lambda:us-east-1:000000000000:function:recepcion-tarea",
      "Events": [
        "s3:ObjectCreated:*"
      ]
    }
  ]
}
```

Aplicar la configuración:

```powershell
aws s3api put-bucket-notification-configuration `
  --bucket laboratorio-floci `
  --notification-configuration file://config/s3-notification.json `
  --region us-east-1
```

---

## 🔎 15. Verificar la configuración del evento

Ejecutar:

```powershell
aws s3api get-bucket-notification-configuration `
  --bucket laboratorio-floci `
  --region us-east-1
```

Debe mostrarse la asociación entre:

```text
laboratorio-floci
        ↓
s3:ObjectCreated:*
        ↓
recepcion-tarea
```

---

## 🧪 16. Probar la Actividad 01

Iniciar la aplicación:

```powershell
node backend/server.js
```

Abrir:

```text
http://localhost:3000
```

Desde la interfaz web:

1. Seleccionar un archivo.
2. Presionar el botón para subir la tarea.
3. Esperar la confirmación de carga.
4. Verificar que el archivo aparezca en la lista.

---

## 📋 17. Revisar los logs de la Lambda

Ejecutar:

```powershell
aws logs tail /aws/lambda/recepcion-tarea `
  --region us-east-1
```

Durante la prueba se obtuvo un resultado similar a:

```text
==============================
TAREA RECIBIDA CORRECTAMENTE
Archivo: 6 LECTURA - PRIMARIA.docx
Bucket: laboratorio-floci
Acción: ObjectCreated:Put
Fecha: fecha-del-evento
==============================
```

Esto confirma que S3 detectó la carga del archivo y ejecutó automáticamente la función Lambda.

---

## ✅ 18. Resultado de la Actividad 01

Se comprobó correctamente:

✔ Carga del archivo desde la aplicación web.  
✔ Almacenamiento en el bucket `laboratorio-floci`.  
✔ Generación del evento `s3:ObjectCreated:*`.  
✔ Ejecución automática de `recepcion-tarea`.  
✔ Registro de la notificación en los logs.

Resultado final:

```text
S3 → Lambda → Notificación
```

✅ **Actividad 01 completada correctamente.**

---
# 🔶 ACTIVIDAD 02 — Lambda + Scheduler

## 📌 19. Objetivo

La segunda actividad consiste en ejecutar automáticamente una rutina mediante **EventBridge Scheduler** y una función Lambda.

La función desarrollada consulta el bucket S3 y cuenta la cantidad de tareas almacenadas.

El flujo implementado es:

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

## ⚡ 20. Crear la función `resumen-tareas`

La función se encuentra en:

```text
lambdas/resumen-tareas/index.js
```

Su función principal es consultar el bucket:

```text
laboratorio-floci
```

y obtener la cantidad de archivos almacenados.

---

## 📦 21. Instalar dependencias de la Lambda

Ingresar a la carpeta:

```powershell
cd .\lambdas\resumen-tareas
```

Inicializar el proyecto:

```powershell
npm init -y
```

Instalar el cliente de Amazon S3:

```powershell
npm install @aws-sdk/client-s3
```

La carpeta debe contener:

```text
resumen-tareas/
│
├── index.js
├── node_modules/
├── package.json
└── package-lock.json
```

---

## 📦 22. Crear el archivo ZIP

Desde la carpeta:

```text
lambdas/resumen-tareas
```

ejecutar:

```powershell
Compress-Archive `
  -Path .\index.js, .\node_modules, .\package.json, .\package-lock.json `
  -DestinationPath ..\..\resumen-tareas.zip `
  -Force
```

Volver a la raíz del proyecto:

```powershell
cd ..\..
```

El archivo generado será:

```text
resumen-tareas.zip
```

---

## ⚡ 23. Crear la Lambda `resumen-tareas`

Ejecutar:

```powershell
aws lambda create-function `
  --function-name resumen-tareas `
  --runtime nodejs22.x `
  --region us-east-1 `
  --role arn:aws:iam::000000000000:role/lambda-role `
  --handler index.handler `
  --zip-file fileb://resumen-tareas.zip
```

Verificar las funciones:

```powershell
aws lambda list-functions
```

Debe aparecer:

```text
recepcion-tarea
resumen-tareas
```

---

## 🧪 24. Probar manualmente la Lambda

Ejecutar:

```powershell
aws lambda invoke `
  --function-name resumen-tareas `
  --region us-east-1 `
  salida-resumen.json
```

Consultar el resultado:

```powershell
Get-Content .\salida-resumen.json
```

Resultado esperado:

```json
{
  "statusCode": 200,
  "body": "{\"totalTareas\":0,\"mensaje\":\"Resumen generado correctamente\"}"
}
```

El número de tareas dependerá de los archivos almacenados en el bucket.

---

## 📋 25. Revisar los logs

Ejecutar:

```powershell
aws logs tail /aws/lambda/resumen-tareas `
  --since 5m `
  --region us-east-1
```

Ejemplo de resultado:

```text
==============================
RESUMEN AUTOMÁTICO DE TAREAS
Total de tareas: 0
Fecha: 2026-10-03T16:27:08.968Z
Estado: Proceso ejecutado correctamente
==============================
```

Esto confirma que la Lambda puede consultar Amazon S3 correctamente.

---

## ⏰ 26. Crear EventBridge Scheduler

Para realizar la prueba automática se creó un Scheduler llamado:

```text
resumen-tareas-programado
```

con una ejecución cada minuto:

```text
rate(1 minute)
```

Ejecutar:

```powershell
aws scheduler create-schedule `
  --name resumen-tareas-programado `
  --schedule-expression "rate(1 minute)" `
  --flexible-time-window "Mode=OFF" `
  --target "Arn=arn:aws:lambda:us-east-1:000000000000:function:resumen-tareas,RoleArn=arn:aws:iam::000000000000:role/scheduler-role" `
  --region us-east-1
```

---

## 🔎 27. Verificar el Scheduler

Ejecutar:

```powershell
aws scheduler get-schedule `
  --name resumen-tareas-programado `
  --region us-east-1
```

Debe mostrarse información similar a:

```text
Name: resumen-tareas-programado
ScheduleExpression: rate(1 minute)
State: ENABLED
```

---

## ⏱️ 28. Comprobar la ejecución automática

Esperar aproximadamente un minuto y ejecutar:

```powershell
aws logs tail /aws/lambda/resumen-tareas `
  --since 5m `
  --region us-east-1
```

Durante las pruebas se registraron ejecuciones consecutivas:

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

Esto confirma que EventBridge Scheduler está ejecutando automáticamente la función Lambda.

---

## ✅ 29. Resultado de la Actividad 02

Se comprobó correctamente:

✔ Creación de la Lambda `resumen-tareas`.  
✔ Instalación de las dependencias necesarias.  
✔ Consulta del bucket Amazon S3.  
✔ Conteo de las tareas almacenadas.  
✔ Ejecución manual de la Lambda.  
✔ Creación de EventBridge Scheduler.  
✔ Scheduler configurado como `ENABLED`.  
✔ Ejecución automática cada minuto.  
✔ Registro de los resultados en los logs.

Resultado final:

```text
Scheduler → Lambda → S3 → Resumen automático
```

✅ **Actividad 02 completada correctamente.**

---