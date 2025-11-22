const express = require('express'); //node
const path = require('path'); //les chemins voir slide
const mongoose = require('mongoose'); //pour travailler avec mongodb
const bodyParser = require('body-parser'); //on parse les données des requetes

const app = express(); //pour notre serveur

// connexion à la base mongodb
mongoose.connect('mongodb://localhost:27017/streetsos')
.then(() => console.log('MongoDB connecté'))
.catch(err => console.log(err));

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

const Incident = mongoose.model('Incident', incidentSchema); //permet d'interagir avec la base de donnée

//voir exemple assistant --> on défini ejs comme app set
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//prendre css du fichier static 
app.use(express.static(path.join(__dirname, 'static')));

//home page avec récupération des incidents et on les trie par date du plus récent au plus ancien pour voir les nouveaux incidents
//SI ON A LE TEMPS AJOUTER UNE PAGINATION POUR NE PAS SATURER LA PAGE
app.get('/', async (req, res) => {
  let user = null;
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
  let user = null;
  res.render('incident', { user });
});

//on renvoit les pages pour s'inscrire
app.get('/signUp', (req, res) => {
  let user = null;
  res.render('sign_up', { user });
});

//on renvoit les pages pour se connecter
app.get('/signIn', (req, res) => {
  let user = null;
  res.render('log_in', { user });
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
      rapportePar: null
    });

    await nouvelIncident.save(); //on sauvegarde l'incident
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur lors de l\'enregistrement de l\'incident.'); //si il y a une erreur on renvoie une erreur et on affiche coté client
  }
});

app.listen(3000, () => {
  console.log('Serveur démarré sur le port 3000'); //pour confirmer que le serveur démarre bien
}); 
