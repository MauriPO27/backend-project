const express = require('express');
const app = express();

app.use(express.json()); // Middleware para parsear JSON

// Ruta principal para convertir una string a mayúsculas
app.post('/uppercase', (req, res) => {
    const { inputString } = req.body;

    // Verificar si se ha recibido una cadena de texto
    if (!inputString) {
        return res.status(400).json({ message: 'No input string provided' });
    }

    // Convertir la cadena a mayúsculas
    const uppercasedString = inputString.toUpperCase();
    const reversedString = uppercasedString.split('').reverse().join('');


    // Enviar la respuesta con la cadena en mayúsculas
    return res.status(200).json({
        original: inputString,
        uppercased: reversedString
    });
});

// Iniciar el servidor en un puerto diferente
const PORT = process.env.PORT || 5003;  // Este servicio de respaldo se ejecuta en otro puerto
app.listen(PORT, () => {
    console.log(`Backup service running on port ${PORT}`);
});
