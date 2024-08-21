const db = require('../../../config/dbConfig');
const Airport = require('../../models/airportModel');

// Mock the db.query method
jest.mock('../../../config/dbConfig', () => ({
    query: jest.fn(),
}));

describe('Airport Model', () => {

    afterEach(() => {
        // Clear all mocks after each test
        jest.clearAllMocks();
    });

    test('getAll should query all airports', () => {
        const mockCallback = jest.fn();
        
        Airport.getAll(mockCallback);

        expect(db.query).toHaveBeenCalledWith('SELECT * FROM airports', mockCallback);
    });

    test('getById should query an airport by id', () => {
        const mockCallback = jest.fn();
        const mockId = 1;
        
        Airport.getById(mockId, mockCallback);

        expect(db.query).toHaveBeenCalledWith('SELECT * FROM airports WHERE id = ?', [mockId], mockCallback);
    });

    test('create should insert a new airport', () => {
        const mockCallback = jest.fn();
        const mockAirport = { code: 'JFK', name: 'John F. Kennedy International', city: 'New York', country: 'USA' };

        Airport.create(mockAirport, mockCallback);

        const expectedQuery = 'INSERT INTO airports (code, name, city, country) VALUES (?, ?, ?, ?)';
        const expectedValues = [mockAirport.code, mockAirport.name, mockAirport.city, mockAirport.country];

        expect(db.query).toHaveBeenCalledWith(expectedQuery, expectedValues, mockCallback);
    });

    test('update should update an airport by id', () => {
        const mockCallback = jest.fn();
        const mockId = 1;
        const mockAirport = { code: 'JFK', name: 'John F. Kennedy International', city: 'New York', country: 'USA' };

        Airport.update(mockId, mockAirport, mockCallback);

        const expectedQuery = 'UPDATE airports SET code = ?, name = ?, city = ?, country = ? WHERE id = ?';
        const expectedValues = [mockAirport.code, mockAirport.name, mockAirport.city, mockAirport.country, mockId];

        expect(db.query).toHaveBeenCalledWith(expectedQuery, expectedValues, mockCallback);
    });

    test('delete should delete an airport by id', () => {
        const mockCallback = jest.fn();
        const mockId = 1;

        Airport.delete(mockId, mockCallback);

        expect(db.query).toHaveBeenCalledWith('DELETE FROM airports WHERE id = ?', [mockId], mockCallback);
    });
});
