const request = require('supertest');  //import de supertest qui permet de simuler des requetes http
const { app, Incident } = require('../main');
const mongoose = require('mongoose');

//on crée un groupe de tests pour la route GET /
describe('GET / (home page)', () => {

  beforeEach(async () => {
    await Incident.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
//on vérifie que la page d'accueil répond correctement
  it('doit répondre avec 200 et afficher le titre', async () => {
    const res = await request(app).get('/');
    //on vérifie que le statut HTTP est 200
    expect(res.statusCode).toBe(200);
    //ici on vérifie que le contenu HTML contient bien le titre de la page home
    expect(res.text).toContain('<title>StreetSOS - Home</title>');
    //on vérifie que le texte de bienvenue est présent dans la page
    expect(res.text).toContain('Bienvenue sur le site StreetSOS!');
  });

  //permet de vérifier que le message "aucun incident" s'affiche quand il n'y a pas d'incident
  it('doit afficher "Aucun incident signalé" quand la liste est vide', async () => {
    const res = await request(app).get('/');
    expect(res.text).toMatch(/Aucun incident signalé pour le moment/);
  });
});

