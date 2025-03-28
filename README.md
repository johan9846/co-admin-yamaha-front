# 🛍️ Panel Administrativo E-Commerce con React.js  

Este **Panel Administrativo** para la gestión de productos y categorías está desarrollado en **React.js**, proporcionando una experiencia intuitiva y eficiente.  

![Descripción de la imagen](src/assets/admin3.PNG)

## 🚀 Características  

- **Interfaz moderna:** Construida con React.js y estilizada con CSS.  
- **Gestión de productos y categorías:** CRUD completo para productos e imágenes.  
- **Integración con Cloudinary:** Permite subir imágenes y obtener URLs prefirmadas.  

---

## 🛠️ Tecnologías Utilizadas  

### **Frontend**  
- **React.js**: Construcción de una interfaz de usuario moderna y dinámica.  
- **CSS**: Estilización personalizada para mejorar la experiencia del usuario.  
- **Cloudinary**: Servicio para almacenar y gestionar imágenes de productos.  

### **Funcionalidades**  
✔️ Agregar categorías  
✔️ CRUD completo de productos (incluyendo imágenes)  

---

## 📌 Requisitos y Configuración

### **1️⃣ Backend (Obligatorio)**

Este proyecto funciona junto con un **backend** en Node.js, alojado en el siguiente repositorio:
🔗 [co-yamaha-back](https://github.com/johan9846/co-yamaha-back.git)

Para configurarlo, sigue estos pasos:

1. **Clonar el repositorio**

   ```bash
   git clone https://github.com/johan9846/co-yamaha-back.git
   cd co-yamaha-back
   ```

3. **Variables de entorno**
   crear .env y poner

   ```bash
   DATABASE_URL="postgresql://johan22:yamaha@localhost:5433/yamaha_db?schema=public"
   DB_USER=johan22
   DB_NAME=yamaha_db
   DB_PASSWORD=yamaha
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   ```

3. **Levantar la base de datos en Docker**

   ```bash
   docker compose up -d
   ```

4. **Ejecutar la semilla de datos**

   ```bash
   node src/seed/loadDataDb.js
   ```

5. **Levantar el backend**

   ```bash
   npm run dev
   ```
---

### **2️⃣ Frontend**

Para ejecutar el frontend en tu entorno local:

Para ejecutar el frontend en tu entorno local, sigue estos pasos:  

1. **Clonar el repositorio**  

   ```bash
   git clone https://github.com/johan9846/co-admin-yamaha-front.git
   cd co-admin-yamaha-front
   ```

2. **Crear el archivo de variables de entorno**  

   - Crea una carpeta llamada `env` en la raíz del proyecto.  
   - Dentro de `env`, crea un archivo llamado `.env`.  
   - Pega la siguiente variable de entorno en el archivo `.env`:  

   ```bash
   VITE_URL_MASTER_DATA="http://localhost:3000"
   ```

3. **Instalar dependencias**  

   ```bash
   npm install
   ```

4. **Ejecutar el proyecto**  

   ```bash
   npm run dev
   ```

---

🚀 **Ahora puedes gestionar productos y categorías desde el panel administrativo.**


