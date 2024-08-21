const Airport = require('../../models/airportModel');
const airportController = require('../../controllers/airportController');

describe('Airport Controller', () => {
    let req, res;

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

    describe('getAllAirports', () => {
        it('should return all airports with status 200', () => {
            const mockAirports = [{ id: 1, name: 'Airport A' }, { id: 2, name: 'Airport B' }];
            jest.spyOn(Airport, 'getAll').mockImplementation((callback) => {
                callback(null, mockAirports);
            });

            airportController.getAllAirports(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockAirports);
        });

        it('should return status 500 on error', () => {
            jest.spyOn(Airport, 'getAll').mockImplementation((callback) => {
                callback(new Error('Database error'));
            });

            airportController.getAllAirports(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe('getAirportById', () => {
        it('should return an airport with status 200', () => {
            const mockAirport = { id: 1, name: 'Airport A' };
            req.params.id = 1;
            jest.spyOn(Airport, 'getById').mockImplementation((id, callback) => {
                callback(null, [mockAirport]);
            });

            airportController.getAirportById(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockAirport);
        });

        it('should return status 404 if airport not found', () => {
            req.params.id = 1;
            jest.spyOn(Airport, 'getById').mockImplementation((id, callback) => {
                callback(null, []);
            });

            airportController.getAirportById(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith({ message: 'Airport not found' });
        });

        it('should return status 500 on error', () => {
            req.params.id = 1;
            jest.spyOn(Airport, 'getById').mockImplementation((id, callback) => {
                callback(new Error('Database error'));
            });

            airportController.getAirportById(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe('createAirport', () => {
        it('should create an airport and return status 201', () => {
            const newAirport = { name: 'Airport C' };
            const mockResult = { insertId: 1 };
            req.body = newAirport;
            jest.spyOn(Airport, 'create').mockImplementation((airport, callback) => {
                callback(null, mockResult);
            });

            airportController.createAirport(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.send).toHaveBeenCalledWith({ id: 1, ...newAirport });
        });

        it('should return status 500 on error', () => {
            req.body = { name: 'Airport C' };
            jest.spyOn(Airport, 'create').mockImplementation((airport, callback) => {
                callback(new Error('Database error'));
            });

            airportController.createAirport(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe('updateAirport', () => {
        it('should update an airport and return status 200', () => {
            const updatedAirport = { name: 'Updated Airport' };
            const mockResult = { affectedRows: 1 };
            req.params.id = 1;
            req.body = updatedAirport;
            jest.spyOn(Airport, 'update').mockImplementation((id, airport, callback) => {
                callback(null, mockResult);
            });

            airportController.updateAirport(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({ id: 1, ...updatedAirport });
        });

        it('should return status 404 if airport not found', () => {
            const updatedAirport = { name: 'Updated Airport' };
            req.params.id = 1;
            req.body = updatedAirport;
            jest.spyOn(Airport, 'update').mockImplementation((id, airport, callback) => {
                callback(null, { affectedRows: 0 });
            });

            airportController.updateAirport(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith({ message: 'Airport not found' });
        });

        it('should return status 500 on error', () => {
            const updatedAirport = { name: 'Updated Airport' };
            req.params.id = 1;
            req.body = updatedAirport;
            jest.spyOn(Airport, 'update').mockImplementation((id, airport, callback) => {
                callback(new Error('Database error'));
            });

            airportController.updateAirport(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe('deleteAirport', () => {
        it('should delete an airport and return status 200', () => {
            req.params.id = 1;
            const mockResult = { affectedRows: 1 };
            jest.spyOn(Airport, 'delete').mockImplementation((id, callback) => {
                callback(null, mockResult);
            });

            airportController.deleteAirport(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({ message: 'Airport deleted successfully' });
        });

        it('should return status 404 if airport not found', () => {
            req.params.id = 1;
            jest.spyOn(Airport, 'delete').mockImplementation((id, callback) => {
                callback(null, { affectedRows: 0 });
            });

            airportController.deleteAirport(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith({ message: 'Airport not found' });
        });

        it('should return status 500 on error', () => {
            req.params.id = 1;
            jest.spyOn(Airport, 'delete').mockImplementation((id, callback) => {
                callback(new Error('Database error'));
            });

            airportController.deleteAirport(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith(expect.any(Error));
        });
    });
});

