const db = require('../../../config/dbConfig');
const Flight = require('../../models/flightModel');
const Airport = require('../../models/airportModel');

jest.mock('../../../config/dbConfig');

describe('Flight model', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getAll', () => {
        it('should fetch all flights from the database', (done) => {
            const mockFlights = [
                { id: 1, flight_number: 'ABC123' },
                { id: 2, flight_number: 'XYZ456' }
            ];
            db.query.mockImplementation((query, callback) => {
                callback(null, mockFlights);
            });

            Flight.getAll((err, flights) => {
                expect(err).toBeNull();
                expect(flights).toEqual(mockFlights);
                expect(db.query).toHaveBeenCalledWith('SELECT * FROM flights', expect.any(Function));
                done();
            });
        });

        it('should handle database errors', (done) => {
            const mockError = new Error('Database error');
            db.query.mockImplementation((query, callback) => {
                callback(mockError, null);
            });

            Flight.getAll((err, flights) => {
                expect(err).toBe(mockError);
                expect(flights).toBeNull();
                expect(db.query).toHaveBeenCalledWith('SELECT * FROM flights', expect.any(Function));
                done();
            });
        });
    });

    describe('getById', () => {
        it('should fetch a flight by ID', (done) => {
            const mockFlight = { id: 1, flight_number: 'ABC123' };
            db.query.mockImplementation((query, params, callback) => {
                callback(null, [mockFlight]);
            });

            Flight.getById(1, (err, flight) => {
                expect(err).toBeNull();
                expect(flight).toEqual([mockFlight]);
                expect(db.query).toHaveBeenCalledWith('SELECT * FROM flights WHERE id = ?', [1], expect.any(Function));
                done();
            });
        });

        it('should handle database errors', (done) => {
            const mockError = new Error('Database error');
            db.query.mockImplementation((query, params, callback) => {
                callback(mockError, null);
            });

            Flight.getById(1, (err, flight) => {
                expect(err).toBe(mockError);
                expect(flight).toBeNull();
                expect(db.query).toHaveBeenCalledWith('SELECT * FROM flights WHERE id = ?', [1], expect.any(Function));
                done();
            });
        });
    });

    describe('create', () => {
        it('should create a new flight', (done) => {
            const mockFlight = {
                flight_number: 'ABC123',
                airline: 'TestAirline',
                departure_airport_id: 1,
                arrival_airport_id: 2,
                cost: 100,
                departure_time: '2024-08-01 12:00:00',
                arrival_time: '2024-08-01 14:00:00'
            };
            db.query.mockImplementation((query, params, callback) => {
                callback(null, { insertId: 1 });
            });

            Flight.create(mockFlight, (err, result) => {
                expect(err).toBeNull();
                expect(result.insertId).toBe(1);
                expect(db.query).toHaveBeenCalledWith(
                    'INSERT INTO flights (flight_number, airline, departure_airport_id, arrival_airport_id, cost, departure_time, arrival_time) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [
                        mockFlight.flight_number,
                        mockFlight.airline,
                        mockFlight.departure_airport_id,
                        mockFlight.arrival_airport_id,
                        mockFlight.cost,
                        mockFlight.departure_time,
                        mockFlight.arrival_time
                    ],
                    expect.any(Function)
                );
                done();
            });
        });

        it('should handle database errors during flight creation', (done) => {
            const mockError = new Error('Database error');
            db.query.mockImplementation((query, params, callback) => {
                callback(mockError, null);
            });

            Flight.create({}, (err, result) => {
                expect(err).toBe(mockError);
                expect(result).toBeNull();
                done();
            });
        });
    });

    describe('update', () => {
        it('should update a flight by ID', (done) => {
            const mockFlight = {
                flight_number: 'ABC123',
                airline: 'TestAirline',
                departure_airport_id: 1,
                arrival_airport_id: 2,
                cost: 100,
                departure_time: '2024-08-01 12:00:00',
                arrival_time: '2024-08-01 14:00:00'
            };
            db.query.mockImplementation((query, params, callback) => {
                callback(null, { affectedRows: 1 });
            });

            Flight.update(1, mockFlight, (err, result) => {
                expect(err).toBeNull();
                expect(result.affectedRows).toBe(1);
                expect(db.query).toHaveBeenCalledWith(
                    'UPDATE flights SET flight_number = ?, airline = ?, departure_airport_id = ?, arrival_airport_id = ?, cost = ?, departure_time = ?, arrival_time = ? WHERE id = ?',
                    [
                        mockFlight.flight_number,
                        mockFlight.airline,
                        mockFlight.departure_airport_id,
                        mockFlight.arrival_airport_id,
                        mockFlight.cost,
                        mockFlight.departure_time,
                        mockFlight.arrival_time,
                        1
                    ],
                    expect.any(Function)
                );
                done();
            });
        });

        it('should handle database errors during flight update', (done) => {
            const mockError = new Error('Database error');
            db.query.mockImplementation((query, params, callback) => {
                callback(mockError, null);
            });

            Flight.update(1, {}, (err, result) => {
                expect(err).toBe(mockError);
                expect(result).toBeNull();
                done();
            });
        });
    });

    describe('delete', () => {
        it('should delete a flight by ID', (done) => {
            db.query.mockImplementation((query, params, callback) => {
                callback(null, { affectedRows: 1 });
            });

            Flight.delete(1, (err, result) => {
                expect(err).toBeNull();
                expect(result.affectedRows).toBe(1);
                expect(db.query).toHaveBeenCalledWith('DELETE FROM flights WHERE id = ?', [1], expect.any(Function));
                done();
            });
        });

        it('should handle database errors during flight deletion', (done) => {
            const mockError = new Error('Database error');
            db.query.mockImplementation((query, params, callback) => {
                callback(mockError, null);
            });

            Flight.delete(1, (err, result) => {
                expect(err).toBe(mockError);
                expect(result).toBeNull();
                done();
            });
        });
    });

    describe('findRoute', () => {
        it('should find routes based on given criteria', async () => {
            const mockAirports = [
                { id: 1, name: 'Airport A' },
                { id: 2, name: 'Airport B' }
            ];
            const mockFlights = [
                {
                    id: 1, flight_number: 'ABC123', departure_airport_id: 1,
                    arrival_airport_id: 2, cost: 100, departure_time: '2024-08-01 12:00:00', arrival_time: '2024-08-01 14:00:00'
                },
                {
                    id: 2, flight_number: 'XYZ456', departure_airport_id: 1,
                    arrival_airport_id: 2, cost: 150, departure_time: '2024-08-01 15:00:00', arrival_time: '2024-08-01 17:00:00'
                }
            ];

            jest.spyOn(Airport, 'getAll').mockImplementation(callback => callback(null, mockAirports));
            db.query.mockImplementation((query, callback) => {
                callback(null, mockFlights);
            });

            const routes = await Flight.findRoute(1, 2, 1, 0, '2024-08-01');
           
            expect(routes.length).toBe(1);
            expect(routes[0].totalCost).toBe(100);
            expect(routes[0].totalTime).toBe(7200000); // 2 hours in milliseconds

            expect(Airport.getAll).toHaveBeenCalled();
            expect(db.query).toHaveBeenCalledWith('SELECT * FROM flights', expect.any(Function));
        });

        it('should handle errors during route finding', async () => {
            jest.spyOn(Airport, 'getAll').mockImplementation(callback => callback(new Error('Database error'), null));
            
            await expect(Flight.findRoute(1, 2, 1, 'cost', '2024-08-01'))
                .rejects
                .toThrow('Database error');
        });
    });
});