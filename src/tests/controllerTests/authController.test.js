const authController = require('../../controllers/authController');
const User = require('../../models/userModel');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
require('dotenv').config();

jest.mock('bcrypt');
jest.mock('crypto');
jest.mock('../../models/userModel');

beforeAll(() => {
    process.env.SECRET_KEY = 'test_secret_key'; // Mocking SECRET_KEY
});

describe('Auth Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('register', () => {
        test('should hash password and create a new user', async () => {
            const req = {
                body: {
                    username: 'testuser',
                    password: 'password123'
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };

            bcrypt.hash.mockResolvedValue('hashedpassword');
            User.create = jest.fn().mockImplementation((user, callback) => {
                callback(null, { insertId: 1 });
            });

            await authController.register(req, res);

            expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
            expect(User.create).toHaveBeenCalledWith(
                { username: 'testuser', password: 'hashedpassword' },
                expect.any(Function)
            );
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.send).toHaveBeenCalledWith({ id: 1, result: { insertId: 1 } });
        });

        test('should handle errors when creating a new user', async () => {
            const req = {
                body: {
                    username: 'testuser',
                    password: 'password123'
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };

            bcrypt.hash.mockResolvedValue('hashedpassword');
            User.create = jest.fn().mockImplementation((user, callback) => {
                callback(new Error('Database error'), null);
            });

            await authController.register(req, res);

            expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
            expect(User.create).toHaveBeenCalledWith(
                { username: 'testuser', password: 'hashedpassword' },
                expect.any(Function)
            );
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith(new Error('Database error'));
        });
    });

    describe('login', () => {
        let req, res;

        beforeEach(() => {
            req = {
                body: {
                    username: 'testuser',
                    password: 'password123',
                },
            };
            res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
                json: jest.fn(),
            };
        });

        it('should return 500 if there is a database error', async () => {
            const mockError = new Error('Database error');
            User.getByUsername.mockImplementation((username, callback) => {
                callback(mockError, null);
            });

            await authController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith(mockError);
        });

        it('should return 401 if the username is not found', async () => {
            User.getByUsername.mockImplementation((username, callback) => {
                callback(null, []);
            });

            await authController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.send).toHaveBeenCalledWith('Invalid credentials');
        });

        it('should return 401 if the password is incorrect', async () => {
            User.getByUsername.mockImplementation((username, callback) => {
                callback(null, [{ id: 1, username: 'testuser', password_hash: 'wrongpassword' }]);
            });
            bcrypt.compare.mockResolvedValue(false);

            await authController.login(req, res);

            expect(User.getByUsername).toHaveBeenCalledWith('testuser', expect.any(Function));
            expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'wrongpassword');
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.send).toHaveBeenCalledWith('Invalid credentials');
        });

        it('should return a token if the login is successful', async () => {
            User.getByUsername = jest.fn().mockImplementation((username, callback) => {
                callback(null, [{ id: 1, username: 'testuser', password: 'hashedpassword' }]);
            });

            bcrypt.compare.mockResolvedValue(true);

            const mockToken = 'mockToken';
            crypto.createHmac.mockReturnValue({
                update: jest.fn().mockReturnThis(),
                digest: jest.fn().mockReturnValue(Buffer.from(mockToken, 'base64'))
            });

            await authController.login(req, res);

            
            expect(User.getByUsername).toHaveBeenCalledWith('testuser', expect.any(Function));
            expect(res.json).toHaveBeenCalledWith({
                token: expect.any(String),
            });
        });
    });
});
