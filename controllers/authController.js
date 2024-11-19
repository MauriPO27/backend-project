const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registrar usuario
const register = (db) => async (req, res) => {
  const { username, email, password } = req.body;

  // Verificar si el usuario ya existe
  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
    if (err) return res.status(500).json({ message: 'Error al verificar el usuario' });
    
    if (result.length > 0) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar nuevo usuario
    db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword], (err) => {
      if (err) return res.status(500).json({ message: 'Error al crear el usuario' });
      return res.status(201).json({ message: 'Usuario creado con éxito' });
    });
  });
};

// Iniciar sesión
const login = (db) => async (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
    if (err) return res.status(500).json({ message: 'Error al verificar las credenciales' });

    if (result.length === 0) {
      return res.status(400).json({ message: 'Credenciales no válidas' });
    }

    const user = result[0];

    // Verificar la contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciales no válidas' });
    }

    // Generar JWT
    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.json({ token });
  });
};

module.exports = { register, login };
