const request = require('supertest');
const mongoose = require('mongoose');
const { app, User } = require('../main');

describe('log_in route', () => {
  let agent;

  beforeEach(async () => {
    //on nettoye la collection user avant chaque test
    await User.deleteMany({});
    agent = request.agent(app);
  });

  test('Test for correct log in', async () => {
    //on crée un utilisateur test
    await User.create({ username: 'testuser', password: '123' });

    const res = await agent
      .post('/log_in')
      .send({ username: 'testuser', password: '123' })
      .expect(302); //on attend la redirection vers home

    const home = await agent.get('/');
    expect(home.text).toContain('Bonjour, testuser');
  });

  test('Test for incorrect log in', async () => {
    const res = await agent
      .post('/log_in')
      .send({ username: '', password: '' })
      .expect(200); //on va recharger la page sur erreur

    expect(res.text).toContain('Nom d’utilisateur ou mot de passe incorrect');
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
