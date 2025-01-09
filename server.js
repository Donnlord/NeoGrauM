const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

let users = []; // Temporal para guardar usuarios

// Registro
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (users.find(user => user.username === username)) {
        return res.send('El usuario ya existe');
    }
    users.push({ username, password });
    res.send('Registro exitoso');
});

// Inicio de sesión
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username && user.password === password);
    if (!user) {
        return res.send('Usuario o contraseña incorrectos');
    }
    res.send('Inicio de sesión exitoso');
});

app.listen(3000, () => console.log('Servidor ejecutándose en http://localhost:3000'));
