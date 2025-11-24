const request = require('supertest');//voir main.test.js c'est la meme
const { app } = require('../main');

describe('GET / (home page)', () => {
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
