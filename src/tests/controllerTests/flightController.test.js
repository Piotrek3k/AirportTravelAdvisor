const Flight = require('../../models/flightModel');
const flightController = require('../../controllers/flightController');

describe('Flight Controller', () => {
    let req, res;
    
    afterEach(() => {
        jest.clearAllMocks();
    });

    beforeEach(() => {
        req = {
            params: {},
            body: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis()
        };
    });

    describe('getAllFlights', () => {
        it('should return all flights with status 200', () => {
            const mockFlights = [{ id: 1, name: 'Flight A' }, { id: 2, name: 'Flight B' }];
            jest.spyOn(Flight, 'getAll').mockImplementation((callback) => {
                callback(null, mockFlights);
            });

            flightController.getAllFlights(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockFlights);
        });

        it('should return status 500 on error', () => {
            jest.spyOn(Flight, 'getAll').mockImplementation((callback) => {
                callback(new Error('Database error'));
            });

            flightController.getAllFlights(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe('getFlightById', () => {
        it('should return a flight with status 200', () => {
            const mockFlight = { id: 1, name: 'Flight A' };
            req.params.id = 1;
            jest.spyOn(Flight, 'getById').mockImplementation((id, callback) => {
                callback(null, [mockFlight]);
            });

            flightController.getFlightById(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockFlight);
        });

        it('should return status 404 if flight not found', () => {
            req.params.id = 9990;
            jest.spyOn(Flight, 'getById').mockImplementation((id, callback) => {
                callback(null, []);
            });

            flightController.getFlightById(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith('Flight not found');
        });

        it('should return status 500 on error', () => {
            req.params.id = 1;
            jest.spyOn(Flight, 'getById').mockImplementation((id, callback) => {
                callback(new Error('Database error'));
            });

            flightController.getFlightById(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe('createFlight', () => {
        it('should create a flight and return status 201', () => {
            const newFlight = { name: 'Flight C' };
            const mockResult = { insertId: 1 };
            req.body = newFlight;
            jest.spyOn(Flight, 'create').mockImplementation((flight, callback) => {
                callback(null, mockResult);
            });

            flightController.createFlight(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.send).toHaveBeenCalledWith({ id: 1, ...newFlight });
        });

        it('should return status 500 on error', () => {
            req.body = { name: 'Flight C' };
            jest.spyOn(Flight, 'create').mockImplementation((flight, callback) => {
                callback(new Error('Database error'));
            });

            flightController.createFlight(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe('updateFlight', () => {
        it('should update a flight and return status 200', () => {
            const updatedFlight = { name: 'Updated Flight' };
            const mockResult = { affectedRows: 1 };
            req.params.id = 1;
            req.body = updatedFlight;
            jest.spyOn(Flight, 'update').mockImplementation((id, flight, callback) => {
                callback(null, mockResult);
            });

            flightController.updateFlight(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({ id: 1, ...updatedFlight });
        });

        it('should return status 404 if flight not found', () => {
            const updatedFlight = { name: 'Updated Flight' };
            req.params.id = 1;
            req.body = updatedFlight;
            jest.spyOn(Flight, 'update').mockImplementation((id, flight, callback) => {
                callback(null, { affectedRows: 0 });
            });

            flightController.updateFlight(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith({ message: 'Flight not found' });
        });

        it('should return status 500 on error', () => {
            const updatedFlight = { name: 'Updated Flight' };
            req.params.id = 1;
            req.body = updatedFlight;
            jest.spyOn(Flight, 'update').mockImplementation((id, flight, callback) => {
                callback(new Error('Database error'));
            });

            flightController.updateFlight(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe('deleteFlight', () => {
        it('should delete a flight and return status 200', () => {
            req.params.id = 1;
            const mockResult = { affectedRows: 1 };
            jest.spyOn(Flight, 'delete').mockImplementation((id, callback) => {
                callback(null, mockResult);
            });

            flightController.deleteFlight(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({ message: 'Flight deleted successfully' });
        });

        it('should return status 404 if flight not found', () => {
            req.params.id = 1;
            jest.spyOn(Flight, 'delete').mockImplementation((id, callback) => {
                callback(null, { affectedRows: 0 });
            });

            flightController.deleteFlight(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith({ message: 'Flight not found' });
        });

        it('should return status 500 on error', () => {
            req.params.id = 1;
            jest.spyOn(Flight, 'delete').mockImplementation((id, callback) => {
                callback(new Error('Database error'));
            });

            flightController.deleteFlight(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe('findRoute', () => {
        it('should find a route and return status 201', async () => {
            const mockResults = [{ route: 'Route A' }];
            req.body = {
                departure_id: 1,
                arrival_id: 2,
                criteria: 'time',
                targetDate: '2023-08-15'
            };
            jest.spyOn(Flight, 'findRoute').mockResolvedValue(mockResults);

            await flightController.findRoute(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(mockResults);
        });

        it('should return status 500 on error', async () => {
            req.body = {
                departure_id: 1,
                arrival_id: 2,
                criteria: 'time',
                targetDate: '2023-08-15'
            };
            jest.spyOn(Flight, 'findRoute').mockRejectedValue(new Error('Database error'));

            await flightController.findRoute(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith(expect.any(Error));
        });
    });
});
