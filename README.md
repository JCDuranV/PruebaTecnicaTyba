# Prueba Técnica DevOps Intern (cats API)
Este proyecto es una API desarrollada como parte de una prueba técnica.  
La API consume imágenes desde **CATAAS (Cat-as-a-Service)**, las almacena en una base de datos **MongoDB**, evita duplicados mediante hashing y expone endpoints para obtener imágenes y métricas.

Incluye:
- Backend con **Node.js + Express**
- Base de datos **MongoDB** en Docker
- **Dockerfile** y **docker-compose**
- Sistema de **deduplicación** de imágenes por hash
- **Tests unitarios** con Jest
- **CI/CD completo** con GitHub Actions
- Publicación automática de imágenes Docker en Docker Hub

---

# ⚙️ Instalación local

Precondiciones:
- Tener instalado y ejecutando docker a la hora de probar el proyecto.

Pasos para ejecutar el proyecto:
- 1. Descargue el archivo docker-compose.yaml que se encuentra en la carpeta /PruebaDocker en este repositorio y guárdelo en una carpeta vacía. 
- 2. Abra la carpeta previamente mencionada y ejecute una nueva terminal en esa ubicación.
- 3. Mediante la linea de comandos de la terminal, ejecute el siguiente comando:
```bash
docker-compose up 
```
- 4. Al realizar esto, levantara los dos contenedores (backend y base de datos) y podrá probar los endpoints. 
- 5. Si todo fue satisfactorio, vera un mensaje como el que se muestra a continuación. 
```bash
Server running on port 3000
MongoDB connected
```
Esto indica que los contenedores están corriendo correctamente.


## Ejecución automática con `run.sh`

Además del archivo `docker-compose.yaml`, el proyecto incluye un script Bash llamado `run.sh` que facilita la gestión del entorno local con un solo comando.

Este script permite:

- Construir y levantar el entorno (backend + MongoDB)
- Detener los contenedores
- Ver logs del backend
- Limpiar volúmenes e imágenes huérfanas
- Reiniciar todo el entorno

### Comandos disponibles

Antes de ejecutarlo, otorgue permisos:

```bash
chmod +x run.sh
```

### Levantar el proyecto

```bash
./run.sh up
```

### Detener contenedores

```bash
./run.sh down
```

### Reiniciar entorno

```bash
./run.sh restart
```

### Ver logs del backend

```bash
./run.sh logs
```

### Limpiar contenedores e imágenes

```bash
./run.sh clean
```

Este método es ideal para desarrolladores o revisores técnicos, ya que automatiza el ciclo completo de trabajo con Docker Compose y acelera la puesta en marcha del entorno.

La imagen de este proyecto se encuentra en el siguiente link: 
[https://hub.docker.com/repository/docker/jcduranv/cats-backend/general](https://hub.docker.com/r/jcduranv/cats-backend)

---

# ⚙️ Ejecución local

La API estará disponible en:

http://localhost:3000/api

## 🔌 Endpoints

### 📷 GET /api/cat

Este endpoint btiene una foto de un gato aleatorio la cual es traida desde CATAAS. Adicional a esto, la descarga en formato binario, le calcula un hash SHA256 y la almacena en la base de datos. En caso que la imagén ya se encuentre en la base de datos ( esto lo verifica a través de la comparación hashes ), solo la muestra y actualiza el atributo lastCalledAt. 


### 🔢 GET /api/count

Este endpoint devuelve la cuenta de la cantidad de imágenes únicas almacenadas en la base de datos. 

Al llamar al endpoint, devuelve una respuesta de forma:

```bash
{ "count": 12 }
```

### 🔍 GET /api/verification

Este endpoint obtiene una imagen específica de CATAAS con id = oK1thExzt01VM4Tc. Esto permite demostrar que las imágenes en la base de datos son únicas y, al momento de acceder a la misma imagen más de una vez, esta no se duplica en la base de datos.

Obtener una imagen fija para verificar que no se dupliquen imágenes repetidas

Llama a una URL fija y específica de CATAAS

Permite validar que no se guardan duplicados

### ❤️ GET /health

Este endpoint valida el correcto funcionamiento del Backend.

---
# 🧠 Lógica de Deduplicación

Cada imagen descargada se convierte a un hash SHA256:

```bash
const hash = crypto.createHash("sha256").update(buffer).digest("hex");
```

Mongo almacena:

```bash
data (buffer)

hash (único)

createdAt

lastCalledAt
```

De esta forma podemos comparar los valores de las distintas imágenes almacenadas y verificar cuando una imagen ya se encuentra almacenada en la base de datos. En caso de que una imagen se repita no se crea un nuevo documento, solo se actualiza lastCalledAt.

---
# 🧪 Pruebas Unitarias

Este proyecto incorpora un conjunto de pruebas unitarias diseñadas para garantizar la calidad, estabilidad y buen funcionamiento del servicio. Las pruebas se desarrollaron con Jest y se enfocan tanto en la lógica interna del sistema como en los controladores expuestos desde la API.

### ✔ generateImageHash

Este test se encarga de generar un identificador único para cada imagen almacenada. Se comprueba que el hash generado sea siempre un string, que sea completamente determinista (es decir, que el mismo buffer produzca exactamente el mismo hash) y que diferencie correctamente entre contenidos distintos, asegurando que imágenes diferentes no colisionen bajo el mismo hash.

### ✔ saveOrUpdateImage

Así mismo, se prueba la función saveOrUpdateImage, pieza clave del sistema de persistencia. Las pruebas verifican que, cuando la imagen no existe en la base de datos, la función cree el registro correspondiente, y que cuando ya existe, actualice el campo lastCalledAt sin duplicar información, manteniendo así la integridad del repositorio de imágenes.

### ✔ getCatImage (con mocks)

Prueba las rutas del controlador, específicamente getCatImage, utilizando mocks controlados para evitar dependencias externas en los tests. Se mockean Axios, Mongoose (findOne, create) y el servicio interno fetchRandomCat. De este modo, se garantiza que el controlador entrega correctamente la imagen como respuesta HTTP cuando todo funciona bien y que maneja adecuadamente los errores devolviendo los códigos y mensajes esperados.

---
# CI / CD

## 🔄 CI — Integración Continua

El proyecto implementa un pipeline de Integración Continua mediante GitHub Actions, el cual se ejecuta automáticamente ante cada Pull Request dirigido a la rama main. Este flujo asegura que todo cambio introducido en el código pueda integrarse sin comprometer la calidad del sistema. El pipeline realiza la instalación completa de dependencias, ejecuta un análisis estático del Dockerfile utilizando Hadolint, corre todas las pruebas unitarias y valida que la imagen Docker del backend pueda construirse correctamente. Esto permite detectar errores de forma temprana, estandarizar la calidad del código y garantizar que la aplicación se mantenga en un estado funcional durante todo el ciclo de desarrollo.

## 🚀 CD — Despliegue Continuo

Además de la integración continua, el proyecto incorpora un mecanismo de Despliegue Continuo que se activa automáticamente cuando se hace push a la rama main. En este proceso, GitHub Actions construye la imagen Docker del backend, la etiqueta como latest y la publica en Docker Hub utilizando las credenciales proporcionadas a través de las variables de entorno DOCKERHUB_USERNAME y DOCKERHUB_TOKEN. Este enfoque permite que la aplicación esté siempre lista para ser desplegada en cualquier plataforma compatible con Docker —incluyendo Render, AWS, DigitalOcean, u otras— facilitando un flujo de entrega moderno, automatizado y altamente reproducible.

---

# 🌐 Despliegue

El proyecto se encuentra completamente desplegado en un entorno público utilizando Render como plataforma de hosting para el backend y MongoDB Atlas como proveedor de base de datos en la nube. Para el backend, se configuró un servicio web en Render que permite que la plataforma construya y ejecute automáticamente la imagen Docker definida en el repositorio. El servicio expone el puerto 3000, cumpliendo con la configuración del contenedor.

En cuanto a la base de datos, se utilizó MongoDB Atlas, donde se creó un cluster gratuito, se configuró un usuario con permisos de lectura y escritura, y se habilitó el acceso desde cualquier IP para facilitar la conexión desde Render. Posteriormente, se generó la cadena de conexión (connection string) y se registró como variable de entorno MONGO_URI dentro del panel de Render, permitiendo que el backend se comunique de forma segura y estable con la base de datos remota.

Esta arquitectura garantiza un despliegue totalmente funcional, reproducible y accesible públicamente, demostrando un flujo completo de infraestructura moderna: contenedores Docker, hosting cloud y una base de datos gestionada en la nube.

### 🔎 Nota importante sobre el tiempo de respuesta

Dado que el backend está desplegado en Render utilizando el plan gratuito, es posible que la primera solicitud tarde algunos segundos en responder. Esto se debe a que:

- Render apaga automáticamente el servicio tras aproximadamente 15 minutos de inactividad.

- La plataforma requiere un breve periodo de "cold start" para volver a activar el contenedor cuando recibe tráfico nuevamente.

Después del primer acceso, el servicio funcionará con total normalidad y sin retrasos significativos.

### URL del proyecto en nube: https://pruebatecnicatyba.onrender.com/api/cat

---
# 🛡 Buenas Prácticas Implementadas

✔ Arquitectura modular (controllers/routes/services/utils)
✔ Código limpio y mantenible
✔ Duplicados controlados mediante hashing
✔ Integración con CATAAS
✔ Pruebas unitarias efectivas
✔ Docker + Compose
✔ CI/CD profesional
✔ Variables de entorno para DB
✔ Validación, logs y manejo de errores

# 🙌 Contribuciones

Proyecto desarrollado como parte de una evaluación técnica.
Cualquier mejora o recomendación es bienvenida.


