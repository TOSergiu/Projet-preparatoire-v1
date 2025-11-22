const express = require('express'); //node
const path = require('path'); //les chemins voir slide
const mongoose = require('mongoose'); //pour travailler avec mongodb
const bodyParser = require('body-parser'); //on parse les données des requetes
const session = require('express-session');

const app = express(); //pour notre serveur

// connexion à la base mongodb
mongoose.connect('mongodb://127.0.0.1:27017/streetSOS')
.then(() => console.log('MongoDB connecté'))
.catch(err => console.error(err));

//sert a définir comment on va décrir comment sera l'incident ici on utilise des string car on remplit du texte pour valider un incident à part pour la date
const incidentSchema = new mongoose.Schema({
  sujet: String,
  temps: String,
  rue: String,
  date: Date,
  codePostal: String,
  ville: String,
  description: String,
  rapportePar: String
});

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    nom: String,
    prenom: String,
    email: String
});

const Incident = mongoose.model('Incident', incidentSchema); //permet d'interagir avec la base de donnée

const User = mongoose.model('User', userSchema);

//voir exemple assistant --> on défini ejs comme app set
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'static')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'propre123',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 3600000 } // 1 hour
}));

//prendre css du fichier static 
app.use(express.static(path.join(__dirname, 'static')));

//home page avec récupération des incidents et on les trie par date du plus récent au plus ancien pour voir les nouveaux incidents
//SI ON A LE TEMPS AJOUTER UNE PAGINATION POUR NE PAS SATURER LA PAGE
app.get('/', async (req, res) => {
  let user = req.session.username || null;
  let currentDate = new Date().toLocaleDateString(); //pour récup la date actuelle

  try {
    const incidents = await Incident.find().sort({ date: -1 }).lean();
    res.render('home', { user, currentDate, incidents });
  } catch (err) {
    console.error(err);
    res.render('home', { user, currentDate, incidents: [] });
  }
});

//on renvoit les pages pour ajouter incident
app.get('/incident', (req, res) => {
  let user = req.session.username || null;
  res.render('incident', { user });
});

//route post pour ajouter un incident
app.post('/incident', async (req, res) => {
  try {
    const { sujet, temps, rue, date, codePostal, ville, description } = req.body; //on remplit l'incident avec toutes les données

    const nouvelIncident = new Incident({
      sujet,
      temps,
      rue,
      date: new Date(date),
      codePostal,
      ville,
      description,
      rapportePar: req.session.username
    });

    await nouvelIncident.save(); //on sauvegarde l'incident
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur lors de l\'enregistrement de l\'incident.'); //si il y a une erreur on renvoie une erreur et on affiche coté client
  }
});

app.get('/sign_up', (req, res) => {
    res.render('sign_up', { user: req.session.username, error: null });
});

app.post('/sign_up', async (req, res) => {
    const { username, password, nom, prenom, email } = req.body;

    if (!username || !password) {
        return res.render('sign_up', { user: req.session.username, error: 'Remplissez tous les champs' });
    }

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.render('sign_up', { user: req.session.username, error: 'Utilisateur déjà existant' });
        }

        const newUser = new User({ username, password, nom, prenom, email });
        await newUser.save();

        req.session.username = username; // log in immediately
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.render('sign_up', { user: req.session.username, error: 'Erreur lors de la création du compte' });
    }
});

// Login page
app.get('/log_in', (req, res) => {
    res.render('log_in', { user: req.session.username, error: null });
});

// Handle Login form
app.post('/log_in', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username, password });
        if (user) {
            req.session.username = username;
            res.redirect('/');
        } else {
            res.render('log_in', { user: req.session.username, error: 'Nom d’utilisateur ou mot de passe incorrect' });
        }
    } catch (err) {
        console.error(err);
        res.render('log_in', { user: req.session.username, error: 'Erreur lors de la connexion' });
    }
});

app.listen(3000, () => {
  console.log('Serveur démarré sur http://localhost:3000'); //pour confirmer que le serveur démarre bien
}); 