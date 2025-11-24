const request = require('supertest');//voir main.test.js c'est la meme
const { app, Incident } = require('../main');  // Importer Incident
const mongoose = require('mongoose');

describe('GET / (home page)', () => {
  beforeEach(async () => {
    await Incident.deleteMany({});
    const count = await Incident.countDocuments();
    console.log("Incidents dans la DB après deleteMany:", count);
  });


  it('répond avec status 200 et affiche le titre', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);//statut 200
    expect(res.text).toContain('<title>StreetSOS - Home</title>');//on vérifie le titre
    expect(res.text).toContain('Bienvenue sur le site StreetSOS!');//on vérifie le message de bienvenue
  });

  it('affiche "Aucun incident signalé" si aucun incident', async () => {
    const res = await request(app).get('/');
    expect(res.text).toMatch(/Aucun incident signalé pour le moment/);//si aucun incident
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});


