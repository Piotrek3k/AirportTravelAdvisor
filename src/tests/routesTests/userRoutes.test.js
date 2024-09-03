const request = require('supertest');
const express = require('express');
const router = require('../../routes/userRoutes'); 
const authMiddleware = require('../../middleware/authMiddelware.js');
const userController = require('../../controllers/userController.js');
const connection = require('../../../config/dbConfig.js')

jest.mock('../../middleware/authMiddelware.js');
jest.mock('../../controllers/userController.js');

const app = express();
app.use(express.json()); // To parse JSON bodies
app.use('/users', router);

describe('User Router', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });
    afterAll(() => {
        connection.end(err => {
            if (err) {
                console.error('Error closing MySQL connection:', err);
            }
        });
        jest.clearAllMocks();
    });

    it('GET /users should call authMiddleware and userController.getAllUsers', async () => {
        authMiddleware.mockImplementation((req, res, next) => next());
        userController.getAllUsers.mockImplementation((req, res) => res.status(200).json([]));

        const response = await request(app).get('/users');

        expect(authMiddleware).toHaveBeenCalled();
        expect(userController.getAllUsers).toHaveBeenCalled();
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });

    it('GET /users/:id should call authMiddleware and userController.getUserById', async () => {
        authMiddleware.mockImplementation((req, res, next) => next());
        userController.getUserById.mockImplementation((req, res) => res.status(200).json({ id: req.params.id }));

        const response = await request(app).get('/users/123');

        expect(authMiddleware).toHaveBeenCalled();
        expect(userController.getUserById).toHaveBeenCalledWith(expect.any(Object), expect.any(Object), expect.any(Function));
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ id: '123' });
    });

    it('POST /users should call authMiddleware and userController.createUser', async () => {
        authMiddleware.mockImplementation((req, res, next) => next());
        userController.createUser.mockImplementation((req, res) => res.status(201).json({ id: '123' }));

        const response = await request(app)
            .post('/users')
            .send({ name: 'John Doe', email: 'john@example.com' });

        expect(authMiddleware).toHaveBeenCalled();
        expect(userController.createUser).toHaveBeenCalledWith(expect.any(Object), expect.any(Object), expect.any(Function));
        expect(response.status).toBe(201);
        expect(response.body).toEqual({ id: '123' });
    });

    it('PUT /users/:id should call authMiddleware and userController.updateUser', async () => {
        authMiddleware.mockImplementation((req, res, next) => next());
        userController.updateUser.mockImplementation((req, res) => res.status(200).json({ id: req.params.id }));

        const response = await request(app)
            .put('/users/123')
            .send({ name: 'John Smith' });

        expect(authMiddleware).toHaveBeenCalled();
        expect(userController.updateUser).toHaveBeenCalledWith(expect.any(Object), expect.any(Object), expect.any(Function));
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ id: '123' });
    });

    it('DELETE /users/:id should call authMiddleware and userController.deleteUser', async () => {
        authMiddleware.mockImplementation((req, res, next) => next());
        userController.deleteUser.mockImplementation((req, res) => res.status(204).send());

        const response = await request(app).delete('/users/123');

        expect(authMiddleware).toHaveBeenCalled();
        expect(userController.deleteUser).toHaveBeenCalledWith(expect.any(Object), expect.any(Object), expect.any(Function));
        expect(response.status).toBe(204);
    });

});
