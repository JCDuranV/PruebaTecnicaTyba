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

La imagen de este proyecto se encuentra en el siguiente link: 
https://hub.docker.com/repository/docker/jcduranv/cats-backend/general

Pasos para ejecutar el proyecto:
- 1. Descargue el archivo llamado docker-compose.yaml que se encuentra en la carpeta /backend de este repositorio y guárdelo en una carpeta vacia. 
- 2. Abra una nueva terminal en la misma ubicación donde guardo el archivo docker-compose.yaml
- 3. Mediante la linea de comandos de la terminal ejecute el siguiente comando:
```bash
docker-compose up 
```
- 4. Al realizar esto, levantara los dos contenedores (backend y base de datos) y podrá probar los endpoints. 
---

# ⚙️ Ejecución local

La API estará disponible en:

http://localhost:3000/api

## 🔌 Endpoints

### 📷 GET /api/cat

Este endpoint btiene una foto de un gato aleatorio la cual es traida desde CATAAS. Adicional a esto, la descarga en formato binario, le calcula un hash SHA256 y la almacena en la base de datos. En caso que la imagén ya se encuentre en la base de datos ( esto lo verifica a través de la comparación hashes ), solo la muestra y actualiza el atributo lastCalledAt. 


### 🔢 GET /api/cat/count

Este endpoint devuelve la cuenta de la cantidad de imágenes únicas almacenadas en la base de datos. 

Al llamar al endpoint, devuelve una respuesta de forma:

```bash
{ "count": 12 }
```

### 🔍 GET /api/cat/verification

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

En caso de que una imagen se repita no se crea un nuevo documento, solo se actualiza lastCalledAt. 

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
# 🔄 CI — Integración Continua

El proyecto implementa un pipeline de Integración Continua mediante GitHub Actions, el cual se ejecuta automáticamente ante cada Pull Request dirigido a la rama main. Este flujo asegura que todo cambio introducido en el código pueda integrarse sin comprometer la calidad del sistema. El pipeline realiza la instalación completa de dependencias, ejecuta un análisis estático del Dockerfile utilizando Hadolint, corre todas las pruebas unitarias y valida que la imagen Docker del backend pueda construirse correctamente. Esto permite detectar errores de forma temprana, estandarizar la calidad del código y garantizar que la aplicación se mantenga en un estado funcional durante todo el ciclo de desarrollo.

🚀 CD — Despliegue Continuo

Cuando se hace push a main:

Se construye la imagen Docker del backend

Se etiqueta como latest

Se sube automáticamente a Docker Hub

Variables usadas:

DOCKERHUB_USERNAME

DOCKERHUB_TOKEN

Esto permite desplegar fácilmente en cualquier plataforma Docker-ready.

🌐 Despliegue

El proyecto puede desplegarse en:

🟩 Render 

Crear servicio web

Seleccionar "Deploy from Dockerfile"

Puerto: 3000



🛡 Buenas Prácticas Implementadas

✔ Arquitectura modular (controllers/routes/services/utils)
✔ Código limpio y mantenible
✔ Duplicados controlados mediante hashing
✔ Integración con CATAAS
✔ Pruebas unitarias efectivas
✔ Docker + Compose
✔ CI/CD profesional
✔ Variables de entorno para DB
✔ Validación, logs y manejo de errores

🙌 Contribuciones

Proyecto desarrollado como parte de una evaluación técnica.
Cualquier mejora o recomendación es bienvenida.


