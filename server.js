const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Datos temporales
let users = [];
let posts = [];
let currentUser = null;

// Página de inicio (Login y Registro)
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Procesar el Login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username && user.password === password);
    if (!user) {
        return res.send('Usuario o contraseña incorrectos');
    }
    currentUser = user;
    res.redirect('/feed'); // Redirigir al feed después de iniciar sesión
});

// Procesar el Registro
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (users.find(user => user.username === username)) {
        return res.send('El usuario ya existe');
    }
    users.push({ username, password, bio: '', posts: [] });
    currentUser = { username, bio: '', posts: [] };
    res.redirect('/feed'); // Redirigir al feed después de registrarse
});

// Feed
app.get('/feed', (req, res) => {
    if (!currentUser) {
        return res.redirect('/');
    }
    res.sendFile(__dirname + '/feed.html'); // Página del feed
});

// Cerrar sesión
app.get('/logout', (req, res) => {
    currentUser = null;
    res.redirect('/');
});

// Iniciar servidor
app.listen(3000, () => console.log('Servidor ejecutándose en http://localhost:3000'));
