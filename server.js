const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const session = require('express-session'); // Manejo de sesiones

// Configuración de middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Configuración de sesiones
app.use(session({
    secret: 'clave-secreta', // Cambia esto por una clave segura
    resave: false,
    saveUninitialized: true
}));

// Datos temporales
let users = [];

// Página de inicio
app.get('/', (req, res) => {
    if (req.session.user) {
        return res.redirect('/feed'); // Si ya está logueado, redirige al feed
    }
    res.sendFile(__dirname + '/index.html');
});

// Página de login
app.get('/login', (req, res) => {
    if (req.session.user) {
        return res.redirect('/feed'); // Si ya está logueado, redirige al feed
    }
    res.sendFile(__dirname + '/login.html');
});

// Página de registro
app.get('/register', (req, res) => {
    if (req.session.user) {
        return res.redirect('/feed'); // Si ya está logueado, redirige al feed
    }
    res.sendFile(__dirname + '/register.html');
});

// Procesar el Login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username && user.password === password);

    if (!user) {
        return res.send(`
            <h2>Credenciales incorrectas</h2>
            <a href="/login">Volver a intentar</a>
        `);
    }

    req.session.user = user; // Guardar usuario en la sesión
    res.redirect('/feed'); // Redirigir al feed
});

// Procesar el Registro
app.post('/register', (req, res) => {
    const { username, password } = req.body;

    if (users.find(user => user.username === username)) {
        return res.send(`
            <h2>El usuario ya existe</h2>
            <a href="/register">Volver a intentar</a>
        `);
    }

    const newUser = { username, password, bio: '', posts: [] };
    users.push(newUser);
    req.session.user = newUser; // Iniciar sesión automáticamente
    res.redirect('/feed'); // Redirigir al feed tras el registro
});

// Página del Feed
app.get('/feed', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login'); // Redirige si no hay sesión
    }
    res.sendFile(__dirname + '/feed.html'); // Muestra la página del feed
});

// Página de búsqueda
app.get('/search', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login'); // Redirige si no hay sesión
    }
    res.sendFile(__dirname + '/search.html'); // Muestra la página de búsqueda
});

// Página de perfil
app.get('/profile', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login'); // Redirige si no hay sesión
    }
    res.sendFile(__dirname + '/profile.html'); // Muestra la página de perfil
});

// Cerrar sesión
app.get('/logout', (req, res) => {
    req.session.destroy(); // Destruye la sesión
    res.redirect('/'); // Redirige al inicio
});

// Iniciar servidor
app.listen(3000, () => console.log('Servidor ejecutándose en http://localhost:3000'));
