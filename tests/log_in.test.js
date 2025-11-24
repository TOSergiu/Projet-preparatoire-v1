const request = require('supertest');
const { app, User } = require('../main');

describe('log_in route', () => {
    let agent;

    beforeEach(() => {
        agent = request.agent(app);
    });

    test('Test for correct log in', async () => {
        await User.create({ username: 'testuser', password: '123' });

        const res = await agent
            .post('/log_in')
            .send({ username: 'testuser', password: '123' })
            .expect(302); // Redirige vers la page home

        const home = await agent.get('/');
        expect(home.text).toContain('Bonjour, testuser');
    });

    test('Test for incorrect log in', async () => {
        const res = await agent
            .post('/log_in')
            .send({ username: '', password: '' })
            .expect(200); // Recharge la page

        expect(res.text).toContain('Nom d’utilisateur ou mot de passe incorrect');
    });
});
