const request = require('supertest');
const express = require('express');
const router = require('../../routes/airportRoutes'); 
const authMiddleware = require('../../middleware/authMiddelware.js');
const airportController = require('../../controllers/airportController.js');
const connection = require('../../../config/dbConfig.js')

jest.mock('../../middleware/authMiddelware.js');
jest.mock('../../controllers/airportController.js');

const app = express();
app.use(express.json()); 
app.use('/airports', router);

describe('Airport Router', () => {
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

    it('GET /airports should call authMiddleware and airportController.getAllAirports', async () => {
        authMiddleware.mockImplementation((req, res, next) => next());
        airportController.getAllAirports.mockImplementation((req, res) => res.status(200).json([]));

        const response = await request(app).get('/airports');
        
        expect(authMiddleware).toHaveBeenCalled();
        expect(airportController.getAllAirports).toHaveBeenCalled();
        expect(response.status).toBe(200);
    });

    it('GET /airports/:id should call authMiddleware and airportController.getAirportById', async () => {
        authMiddleware.mockImplementation((req, res, next) => next());
        airportController.getAirportById.mockImplementation((req, res) => res.status(200).json({}));
    
        const response = await request(app).get('/airports/123');
    
        expect(authMiddleware).toHaveBeenCalled();
        expect(airportController.getAirportById).toHaveBeenCalledWith(
            expect.any(Object),  // req is an object
            expect.any(Object),   // res is an object
            expect.any(Function),   // next is a function
        );
        expect(response.status).toBe(200);
    });
    

    it('POST /airports should call authMiddleware and airportController.createAirport', async () => {
        authMiddleware.mockImplementation((req, res, next) => next());
        airportController.createAirport.mockImplementation((req, res) => res.status(201).json({}));

        const response = await request(app).post('/airports').send({ name: 'Test Airport' });

        expect(authMiddleware).toHaveBeenCalled();
        expect(airportController.createAirport).toHaveBeenCalledWith(expect.any(Object), expect.any(Object), expect.any(Function));
        expect(response.status).toBe(201);
    });

    it('PUT /airports/:id should call authMiddleware and airportController.updateAirport', async () => {
        authMiddleware.mockImplementation((req, res, next) => next());
        airportController.updateAirport.mockImplementation((req, res) => res.status(200).json({}));

        const response = await request(app).put('/airports/123').send({ name: 'Updated Airport' });

        expect(authMiddleware).toHaveBeenCalled();
        expect(airportController.updateAirport).toHaveBeenCalledWith(expect.any(Object), expect.any(Object), expect.any(Function));
        expect(response.status).toBe(200);
    });

    it('DELETE /airports/:id should call authMiddleware and airportController.deleteAirport', async () => {
        authMiddleware.mockImplementation((req, res, next) => next());
        airportController.deleteAirport.mockImplementation((req, res) => res.status(200).json({}));

        const response = await request(app).delete('/airports/123');

        expect(authMiddleware).toHaveBeenCalled();
        expect(airportController.deleteAirport).toHaveBeenCalledWith(expect.any(Object), expect.any(Object), expect.any(Function));
        expect(response.status).toBe(200);
    });
});