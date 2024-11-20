const bcrypt = require('bcryptjs');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken'); 

// Crear la conexión a la base de datos MySQL
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',     
    password: '223142', 
    database: 'myapp',  
    port: 3306         
});

// Probar la conexión a la base de datos
pool.getConnection((err, connection) => {
    if (err) {
    console.error('Error al conectar con la base de datos:', err);
    return;
    }
    console.log('Conectado a la base de datos');
    connection.release(); // Libera la conexión después de usarla
});



const register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
      // Verificar si el usuario ya existe en la base de datos
      const [rows] = await pool.promise().query('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length > 0) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
     
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Insertar el nuevo usuario en la base de datos
      await pool.promise().query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword]);
  
      return res.status(201).json({ message: 'User created' });
    } catch (error) {
      console.error(error);  // Registra el error para depuración
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };


// Función de login
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Verificar si el usuario existe en la base de datos
        const [rows] = await pool.promise().query('SELECT * FROM users WHERE email = ?', [email]);
        
        if (rows.length === 0) {
            return res.status(400).json({ message: 'User not found' });
        }

        const user = rows[0];

        // Comparar la contraseña proporcionada con la contraseña almacenada
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Crear un JWT (JSON Web Token) y devolverlo al usuario
        const token = jwt.sign(
            { userId: user.id, username: user.username, email: user.email }, 
            'supersecretkey', 
            { expiresIn: '1h' } 
        );

        return res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = { register, login };
