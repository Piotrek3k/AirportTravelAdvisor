const request = require('supertest');
const express = require('express');
const router = require('../../routes/flightRoutes'); 
const authMiddleware = require('../../middleware/authMiddelware.js');
const flightController = require('../../controllers/flightController.js');
const connection = require('../../../config/dbConfig.js')

jest.mock('../../middleware/authMiddelware.js');
jest.mock('../../controllers/flightController.js');

const app = express();
app.use(express.json()); // To parse JSON bodies
app.use('/flights', router);

describe('Flight Router', () => {

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

    it('GET /flights should call authMiddleware and flightController.getAllFlights', async () => {
        authMiddleware.mockImplementation((req, res, next) => next());
        flightController.getAllFlights.mockImplementation((req, res) => res.status(200).json([]));

        const response = await request(app).get('/flights');

        expect(authMiddleware).toHaveBeenCalled();
        expect(flightController.getAllFlights).toHaveBeenCalled();
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });

    it('GET /flights/:id should call authMiddleware and flightController.getFlightById', async () => {
        authMiddleware.mockImplementation((req, res, next) => next());
        flightController.getFlightById.mockImplementation((req, res) => res.status(200).json({ id: req.params.id }));

        const response = await request(app).get('/flights/123');

        expect(authMiddleware).toHaveBeenCalled();
        expect(flightController.getFlightById).toHaveBeenCalledWith(expect.any(Object), expect.any(Object), expect.any(Function));
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ id: '123' });
    });

    it('POST /flights should call authMiddleware and flightController.createFlight', async () => {
        authMiddleware.mockImplementation((req, res, next) => next());
        flightController.createFlight.mockImplementation((req, res) => res.status(201).json({ id: '123' }));

        const response = await request(app)
            .post('/flights')
            .send({ origin: 'NYC', destination: 'LAX' });

        expect(authMiddleware).toHaveBeenCalled();
        expect(flightController.createFlight).toHaveBeenCalledWith(expect.any(Object), expect.any(Object), expect.any(Function));
        expect(response.status).toBe(201);
        expect(response.body).toEqual({ id: '123' });
    });

    it('PUT /flights/:id should call authMiddleware and flightController.updateFlight', async () => {
        authMiddleware.mockImplementation((req, res, next) => next());
        flightController.updateFlight.mockImplementation((req, res) => res.status(200).json({ id: req.params.id }));

        const response = await request(app)
            .put('/flights/123')
            .send({ destination: 'SFO' });

        expect(authMiddleware).toHaveBeenCalled();
        expect(flightController.updateFlight).toHaveBeenCalledWith(expect.any(Object), expect.any(Object), expect.any(Function));
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ id: '123' });
    });

    it('DELETE /flights/:id should call authMiddleware and flightController.deleteFlight', async () => {
        authMiddleware.mockImplementation((req, res, next) => next());
        flightController.deleteFlight.mockImplementation((req, res) => res.status(204).send());

        const response = await request(app).delete('/flights/123');

        expect(authMiddleware).toHaveBeenCalled();
        expect(flightController.deleteFlight).toHaveBeenCalledWith(expect.any(Object), expect.any(Object), expect.any(Function));
        expect(response.status).toBe(204);
    });

    it('POST /flights/search should call authMiddleware and flightController.findRoute', async () => {
        authMiddleware.mockImplementation((req, res, next) => next());
        flightController.findRoute.mockImplementation((req, res) => res.status(200).json([{ origin: 'NYC', destination: 'LAX' }]));

        const response = await request(app)
            .post('/flights/search')
            .send({ origin: 'NYC', destination: 'LAX' });

        expect(authMiddleware).toHaveBeenCalled();
        expect(flightController.findRoute).toHaveBeenCalledWith(expect.any(Object), expect.any(Object), expect.any(Function));
        expect(response.status).toBe(200);
        expect(response.body).toEqual([{ origin: 'NYC', destination: 'LAX' }]);
    });
});
