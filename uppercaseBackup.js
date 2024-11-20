const express = require('express');
const app = express();
const cors = require('cors');

// CORS
app.use(cors());

app.use(express.json());


app.post('/uppercase', (req, res) => {
    const { inputString } = req.body;

    // Verificar si se ha recibido una cadena de texto
    if (!inputString) {
        return res.status(400).json({ message: 'No input string provided' });
    }

    // Convertir la cadena a mayúsculas e invertir
    const uppercasedString = inputString.toUpperCase();
    const reversedString = uppercasedString.split('').reverse().join('');


    // Enviar la respuesta con la cadena en mayúsculas
    return res.status(200).json({
        original: inputString,
        uppercased: reversedString
    });
});

// Iniciar el servidor en el puerto 5003
const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
    console.log(`Backup service running on port ${PORT}`);
});
