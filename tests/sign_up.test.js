const request = require('supertest');
const { app, User } = require('../main');

describe('sign_up route', () => {
    let agent;

    beforeEach(() => {
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
            .expect(302); // Redirige vers la page home

        const home = await agent.get('/');
        expect(home.text).toContain('Bonjour, GordonR');
    });

    test('Creating a new account with existing username', async () => {
        const existing = await User.findOne({ username: 'JoeB' });
        if (!existing) {
            await User.create({ username: 'JoeB', password: '123' });
        }

        const res = await agent
            .post('/sign_up')
            .send({
                nom: 'Joe', 
                prenom: 'Bastianich',
                username: 'JoeB',
                password: 'Password1!',
                email: 'joe@gmail.com',
            })
            .expect(200);

        expect(res.text).toContain('Utilisateur déjà existant');
    });

});
