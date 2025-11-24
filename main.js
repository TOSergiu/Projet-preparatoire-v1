const express = require('express'); //node
const path = require('path'); //les chemins voir slide
const mongoose = require('mongoose'); //pour travailler avec mongodb
const bodyParser = require('body-parser'); //on parse les données des requetes
const session = require('express-session');

const app = express(); //pour notre serveur

// Pour éviter d'utiliser la même base de données dans nos tests 
const dbName = process.env.NODE_ENV === 'test' ? 'streetSOS_test' : 'streetSOS';

// connexion à la base mongodb
mongoose.connect(`mongodb://127.0.0.1:27017/${dbName}`)
.then(() => console.log('MongoDB connecté'))
.catch(err => console.error(err));

// Empeche les utilisateurs de poster un accident sans être connecté 
function requireLogin(req, res, next) {
  if (process.env.NODE_ENV === 'test') {
    req.session.username = 'testuser';
    return next();
  }
  if (!req.session.username) {
    return res.redirect('/log_in');
  }
  next();
}


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
app.get('/incident', requireLogin, (req, res) => {
    res.render('incident', { user: req.session.username });
});


app.get('/search',async(req,res)=>{
  let word = req.query.keyword;
  
  function countDocumentWord(keyword,document){
    let word = String(keyword);
    let count = 0;
    let text = "";
    for(let key in document){
      text += String(document[key])+ " ";
    }
    let words = text.split(" ");

    for(let mot of words){
      if(word.toLowerCase() === mot.toLowerCase()){
        count ++;
      }
    }
    return count ;
  }

  function countWord(document){
    let count = 0;
    let text = "";

    for(let key in document){
      text += String(document[key])+ " ";
    }
    let words = text.split(" ");

    for(let mot of words){
      count ++;
    }
    return count ;
  }

  async function countDoc(){
    let doc = await Incident.find({});
    return doc.length;
  }

  async function countCollectionWord(keyword){
    let word = String(keyword);
    let count = 0;

    let docs = await Incident.find({});

    for(let doc of docs){
      let obj = doc.toObject();
      for(let key in obj){
        if(word.toLowerCase()===String(obj[key]).toLowerCase()){
          count ++;
          break;
        }
      }
    }

    return count ;
  }

  
  function TF(keyword,document){
    return(Math.log(1+(countDocumentWord(keyword,document)/countWord(document))));
  }

  async function IDF(keyword){
    let alldocs = await countDoc();
    let allCollectionWords = await countCollectionWord(keyword);
    return(Math.log(alldocs/(allCollectionWords || 1)));
  }


  let txtArray = [];
  let allText = await Incident.find({});
  let idfValue = await IDF(word);
  
  for(let txt of allText){
    let obj = txt.toObject();
    let res = TF(word,obj)*idfValue;

    let objc = { doc: obj, score: res };
    txtArray.push(objc)
  }

  txtArray.sort((a, b) => b.score - a.score);

  let top10 = txtArray.slice(0, 10);
  


  res.render('searchPage',{ top10 });
})


//route post pour ajouter un incident
app.post('/incident', requireLogin, async (req, res) => {
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

// Page
app.get('/sign_up', (req, res) => {
    res.render('sign_up', { user: req.session.username, error: null });
});

const checkUserInput = require('./checkInput.js');

app.post('/sign_up', async (req, res) => {
    const { username, password, nom, prenom, email } = req.body;

    if (!checkUserInput.isValidUsername(username)) {
        return res.render('sign_up', { user: req.session.username, error: 'Le nom d’utilisateur doit avoir au moins 6 caractères' });
    }

    if (!checkUserInput.isValidPassword(password)) {
        return res.render('sign_up', { user: req.session.username, error: 'Mot de passe invalide (7+ chars, majuscule, chiffre, symbole)' });
    }

    if (!checkUserInput.isValidEmail(email)) {
        return res.render('sign_up', { user: req.session.username, error: 'Adresse email invalide' });
    }
    
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.render('sign_up', { user: req.session.username, error: 'Utilisateur déjà existant' });
        }

        const newUser = new User({ username, password, nom, prenom, email });
        await newUser.save();

        req.session.username = username; 
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.render('sign_up', { user: req.session.username, error: 'Erreur lors de la création du compte' });
    }
});


// Page log_in 
app.get('/log_in', (req, res) => {
    res.render('log_in', { user: req.session.username, error: null });
});

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

module.exports = { app, User, Incident};

if (require.main === module) {
    app.listen(3000, () => console.log('Serveur démarré sur http://localhost:3000')); //pour confirmer que le serveur démarre bien
}
