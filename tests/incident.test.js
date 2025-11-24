const request = require('supertest'); //comme pour main.test.js
const { app } = require('../main');

describe('GET /incident', () => {
  beforeAll(() => {
    process.env.NODE_ENV = 'test'; //on met test pour modifier le comportemet de certaines parties du codes pour rendre plus facile sinon c'est galère
  });

  afterAll(() => {
    process.env.NODE_ENV = 'development'; //on remet normal après test
  });

  it('redirige vers /log_in si non connecté', async () => {
    process.env.NODE_ENV = 'development'; 
    const res = await request(app).get('/incident');
    expect(res.statusCode).toBe(302);//on attend un code 302 une redirection
    expect(res.headers.location).toBe('/log_in');//on s'attend a etre redirigé vers login
  });

  it('répond avec 200 si utilisateur connecté (test mode)', async () => {
    process.env.NODE_ENV = 'test';
    const res = await request(app).get('/incident');
    expect(res.statusCode).toBe(200);//on veut un code 200 ici
    expect(res.text).toContain('<title>StreetSOS - Incidents</title>');//on vérifie le titre
    expect(res.text).toContain('Alertez les habitants');//on vérifie que le texte est bien contenu dans la page
  });
});
