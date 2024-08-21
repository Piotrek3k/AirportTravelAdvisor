const db = require('../../../config/dbConfig');
const User = require('../../models/userModel');

// Mock the db.query method
jest.mock('../../../config/dbConfig', () => ({
    query: jest.fn(),
}));

describe('User Model', () => {

    afterEach(() => {
        // Clear all mocks after each test
        jest.clearAllMocks();
    });

    test('getAll should query all users', () => {
        const mockCallback = jest.fn();
        
        User.getAll(mockCallback);

        expect(db.query).toHaveBeenCalledWith('SELECT * FROM users', mockCallback);
    });

    test('getById should query a user by id', () => {
        const mockCallback = jest.fn();
        const mockId = 1;
        
        User.getById(mockId, mockCallback);

        expect(db.query).toHaveBeenCalledWith('SELECT * FROM users WHERE id = ?', [mockId], mockCallback);
    });

    test('getByUsername should query a user by username', () => {
        const mockCallback = jest.fn();
        const mockUsername = 'testuser';
        
        User.getByUsername(mockUsername, mockCallback);

        expect(db.query).toHaveBeenCalledWith('SELECT * FROM users WHERE username = ?', [mockUsername], mockCallback);
    });

    test('create should insert a new user', () => {
        const mockCallback = jest.fn();
        const mockUser = { username: 'testuser', email: 'test@example.com', password: 'hashedpassword' };

        User.create(mockUser, mockCallback);

        const expectedQuery = 'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)';
        const expectedValues = [mockUser.username, mockUser.email, mockUser.password];

        expect(db.query).toHaveBeenCalledWith(expectedQuery, expectedValues, mockCallback);
    });

    test('update should update a user by id', () => {
        const mockCallback = jest.fn();
        const mockId = 1;
        const mockUser = { username: 'updateduser', password: 'newhashedpassword', email: 'updated@example.com', full_name: 'Updated Name' };

        User.update(mockId, mockUser, mockCallback);

        const expectedQuery = 'UPDATE users SET username = ?, password = ?, email = ?, full_name = ? WHERE id = ?';
        const expectedValues = [mockUser.username, mockUser.password, mockUser.email, mockUser.full_name, mockId];

        expect(db.query).toHaveBeenCalledWith(expectedQuery, expectedValues, mockCallback);
    });

    test('delete should delete a user by id', () => {
        const mockCallback = jest.fn();
        const mockId = 1;

        User.delete(mockId, mockCallback);

        expect(db.query).toHaveBeenCalledWith('DELETE FROM users WHERE id = ?', [mockId], mockCallback);
    });
});