const express = require('express');
const request = require('supertest');
const authController = require('../../controllers/authController.js');
const authRouter = require('../../routes/authRoutes'); 

jest.mock('../../controllers/authController'); 

const app = express();
app.use(express.json());
app.use('/auth', authRouter);

describe('Auth Router', () => {

    it('POST /auth/register should call authController.register', async () => {
        authController.register.mockImplementation((req, res) => res.status(201).json({ message: 'User registered successfully' }));

        const response = await request(app)
            .post('/auth/register')
            .send({ username: 'testuser', password: 'testpass' });

        expect(authController.register).toHaveBeenCalled();

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('User registered successfully');
    });

    it('POST /auth/login should call authController.login', async () => {
        authController.login.mockImplementation((req, res) => res.status(200).json({ token: 'fake-jwt-token' }));

        const response = await request(app)
            .post('/auth/login')
            .send({ username: 'testuser', password: 'testpass' });

        expect(authController.login).toHaveBeenCalled();
        expect(response.status).toBe(200);
        expect(response.body.token).toBe('fake-jwt-token');
    });

});