const request = require('supertest');
const mongoose = require('mongoose');
const { app, User } = require('../main');

describe('sign_up route', () => {
  let agent;

  beforeEach(async () => {
    //on nettoye la collection User avant chaque test
    await User.deleteMany({});
    agent = request.agent(app);
  });

  test('Creating a new account with new username', async () => {
    const res = await agent
      .post('/sign_up')
      .send({
        nom: 'Gordon',
        prenom: 'Ramsay',
        username: 'GordonR',
        password: 'Password1!',
        email: 'gordon@gmail.com',
      })
      .expect(302); //on est en attente redirection vers home

    const home = await agent.get('/');
    expect(home.text).toContain('Bonjour, GordonR');
  });

  test('Creating a new account with existing username', async () => {
    //on crée un utilisateur existant
    await User.create({ username: 'NicholasD', password: '123' });

    const res = await agent
      .post('/sign_up')
      .send({
        nom: 'Nicholas',
        prenom: 'DiGiovanni',
        username: 'NicholasD',
        password: 'Password1!',
        email: 'Nick@gmail.com',
      })
      .expect(200); //si pas de redirection, message d'erreur

    expect(res.text).toContain('Utilisateur déjà existant');
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
