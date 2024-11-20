const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

// CORS
app.use(cors());

app.use(express.json());  // Middleware para parsear JSON

// Ruta principal para convertir una string a mayúsculas
app.post('/uppercase', async (req, res) => {
    const { inputString } = req.body;

    if (!inputString) {
        return res.status(400).json({ message: 'No input string provided' });
    }
    // Verificamos la longitud del texto
    if (inputString.length > 20) {
        // Si la longitud del texto es mayor a 20, redirigimos la solicitud al servicio de respaldo
        try {
            console.log('Texto demasiado largo, redirigiendo al servicio de respaldo...');
            const response = await axios.post('http://localhost:5003/uppercase', { inputString });
            return res.status(200).json(response.data); // Devolvemos la respuesta del servicio de respaldo
        } catch (backupError) {
            // Si el servicio de respaldo también falla, respondemos con un error
            console.error('Error en el servicio de respaldo:', backupError);
            return res.status(500).json({ message: 'Ambos servicios fallaron. Intenta más tarde.' });
        }
    }
    try {
        // Intentamos convertir la cadena a mayúsculas
        const uppercasedString = inputString.toUpperCase();

        // Enviamos la respuesta en caso de éxito
        return res.status(200).json({
            original: inputString,
            uppercased: uppercasedString
        });
    } catch (error) {
        console.error('Error en el servicio principal, redirigiendo al servicio de respaldo:', error);

        // En caso de error, hacemos una solicitud al servicio de respaldo
        try {
            const response = await axios.post('http://localhost:5003/uppercase', { inputString });
            return res.status(200).json(response.data); // Devolvemos la respuesta del servicio de respaldo
        } catch (backupError) {
            // Si el servicio de respaldo también falla, respondemos con un error
            return res.status(500).json({ message: 'Ambos servicios fallaron. Intenta más tarde.' });
        }
    }
});

// Iniciar el servidor en el puerto 5002
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
    console.log(`Primary service running on port ${PORT}`);
});
