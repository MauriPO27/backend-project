const express = require('express');
const { register } = require('./controllers'); // Asumiendo que el archivo de registro está en controllers.js
const { login } = require('./controllers');
const cors = require('cors');
const app = express();

// CORS
app.use(cors());

// Middleware para parsear el cuerpo de las solicitudes como JSON
app.use(express.json()); 

// Ruta para registrar un nuevo usuario
app.post('/register', register);

// Ruta para login de usuario
app.post('/login', login);

// Configuración del puerto donde el servidor escuchará
app.listen(5000, () => {
  console.log('Server running on port 5000');
});

