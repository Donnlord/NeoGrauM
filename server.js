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

// Página de inicio
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Registro
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (users.find(user => user.username === username)) {
        return res.send('El usuario ya existe');
    }
    users.push({ username, password, bio: '', posts: [] });
    currentUser = { username, bio: '', posts: [] }; // Simulamos que el usuario está logueado
    res.redirect('/feed');
});

// Inicio de sesión
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username && user.password === password);
    if (!user) {
        return res.send('Usuario o contraseña incorrectos');
    }
    currentUser = user;
    res.redirect('/feed');
});

// Feed
app.get('/feed', (req, res) => {
    res.render('feed', { posts });
});

// Crear publicación
app.post('/post', (req, res) => {
    const content = req.body.content;
    const newPost = { username: currentUser.username, content, date: new Date() };
    posts.push(newPost);
    res.redirect('/feed');
});

// Perfil
app.get('/profile', (req, res) => {
    res.render('profile', { user: currentUser });
});

// Actualizar perfil
app.post('/updateProfile', (req, res) => {
    const { bio } = req.body;
    currentUser.bio = bio;
    res.redirect('/profile');
});

// Cerrar sesión
app.get('/logout', (req, res) => {
    currentUser = null;
    res.redirect('/');
});

app.listen(3000, () => console.log('Servidor ejecutándose en http://localhost:3000'));
