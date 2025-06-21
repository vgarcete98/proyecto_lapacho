# 🏟️ Proyecto Lapacho – Sistema de Gestión para Club Deportivo Lapacho 🏓

**Proyecto Lapacho** es una aplicación web desarrollada con **Node.js**, **Express** y **PostgreSQL**, diseñada para cubrir las necesidades operativas de un club deportivo. Permite gestionar socios, reservas, torneos y otros aspectos clave de la administración del club.

---

## 🚀 Tecnologías utilizadas

- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [Prisma ORM](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Cloudinary](https://cloudinary.com/)
- [Winston](https://github.com/winstonjs/winston)
- [express-winston](https://github.com/bithavoc/express-winston)
- [node-schedule](https://github.com/node-schedule/node-schedule)
- [Prisma Optimize](https://prisma.ai/solutions/prisma-optimize/)

---

## 📌 Funcionalidades principales

- Gestión de **socios** del club
- Sistema de **reservas** de instalaciones deportivas
- Organización de **torneos** internos
- Administración de **perfiles de usuarios**
- Programación de tareas automáticas
- **Carga de imágenes** a través de Cloudinary
- **Logging estructurado** con Winston

---

## ⚙️ Configuración del entorno

### 1. Clonar el repositorio o bajar el repositorio

bash
git clone https://github.com/vgarcete98/proyecto_lapacho.git
cd proyecto_lapacho

### 2. Configura las siguientes variables de entorno en un archivo .env
# 🔐 Base de datos PostgreSQL
DATABASE_URL="postgresql://usuario:clave@localhost:5432/nombre_base?schema=public"

# 🔑 Claves secretas
SECRET0RPR1VAT3K3Y="clave_para_firmar_tokens"
C0NTR4SEN1A_4DM1N="clave_temporal_para_admin"
ENCRYPTS3CR3TEDK3Y="clave_para_encriptacion"

# 📧 Correo de prueba y clave de aplicación
T3ST_M4IL_CU3NT4="correo@gmail.com"
P4SS_3M4IL="clave_aplicacion"

# 🔍 Prisma Optimize API Key
OPTIMIZE_API_KEY="clave_de_prisma_optimize"

# ☁️ Cloudinary
CLOUDINARY_URL="cloudinary://api_key:api_secret@cloud_name"\


### 3. Instalá las dependencias, configurá la base de datos y ejecutá el servidor:
npm install
npx prisma db push --accept-data-loss
npx prisma generate
npx prisma db seed
npm start

### 4.Estructura referencial del proyecto:

├── prisma/
│   ├── schema.prisma
│   └── seed.js
├── src/
│   ├── controllers/
│   ├── routes/
│   ├── middlewares/
│   ├── helpers/
│   ├──middlewares
├── app.js
├── .env
├── package.json
└── README.md



### 5.Link al sistema demo ( Proximamente se dara de baja ):
https://proyectolapacho.netlify.app/login

### ✍️ Autor
Victor Garcete
Proyecto final de carrera – Sistema de gestión para club deportivo Lapacho
Entregado contra el reloj... pero a tiempo. ⏱️🎓

