const User = require('../../models/userModel');
const userController = require('../../controllers/userController');

describe('User Controller', () => {
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

    describe('getAllUsers', () => {
        it('should return all users with status 200', () => {
            const mockUsers = [{ id: 1, name: 'User A' }, { id: 2, name: 'User B' }];
            jest.spyOn(User, 'getAll').mockImplementation((callback) => {
                callback(null, mockUsers);
            });

            userController.getAllUsers(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockUsers);
        });

        it('should return status 500 on error', () => {
            jest.spyOn(User, 'getAll').mockImplementation((callback) => {
                callback(new Error('Database error'));
            });

            userController.getAllUsers(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe('getUserById', () => {
        it('should return a user with status 200', () => {
            const mockUser = { id: 1, name: 'User A' };
            req.params.id = 1;
            jest.spyOn(User, 'getById').mockImplementation((id, callback) => {
                callback(null, [mockUser]);
            });

            userController.getUserById(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockUser);
        });

        it('should return status 404 if user not found', () => {
            req.params.id = 1;
            jest.spyOn(User, 'getById').mockImplementation((id, callback) => {
                callback(null, []);
            });

            userController.getUserById(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith('User not found');
        });

        it('should return status 500 on error', () => {
            req.params.id = 1;
            jest.spyOn(User, 'getById').mockImplementation((id, callback) => {
                callback(new Error('Database error'));
            });

            userController.getUserById(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe('createUser', () => {
        it('should create a user and return status 201', () => {
            const newUser = { name: 'User C' };
            const mockResult = { insertId: 1 };
            req.body = newUser;
            jest.spyOn(User, 'create').mockImplementation((user, callback) => {
                callback(null, mockResult);
            });

            userController.createUser(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.send).toHaveBeenCalledWith({ id: 1, ...newUser });
        });

        it('should return status 500 on error', () => {
            req.body = { name: 'User C' };
            jest.spyOn(User, 'create').mockImplementation((user, callback) => {
                callback(new Error('Database error'));
            });

            userController.createUser(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe('updateUser', () => {
        it('should update a user and return status 200', () => {
            const updatedUser = { name: 'Updated User' };
            const mockResult = { affectedRows: 1 };
            req.params.id = 1;
            req.body = updatedUser;
            jest.spyOn(User, 'update').mockImplementation((id, user, callback) => {
                callback(null, mockResult);
            });

            userController.updateUser(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({ id: 1, ...updatedUser });
        });

        it('should return status 404 if user not found', () => {
            const updatedUser = { name: 'Updated User' };
            req.params.id = 1;
            req.body = updatedUser;
            jest.spyOn(User, 'update').mockImplementation((id, user, callback) => {
                callback(null, { affectedRows: 0 });
            });

            userController.updateUser(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith({ message: 'User not found' });
        });

        it('should return status 500 on error', () => {
            const updatedUser = { name: 'Updated User' };
            req.params.id = 1;
            req.body = updatedUser;
            jest.spyOn(User, 'update').mockImplementation((id, user, callback) => {
                callback(new Error('Database error'));
            });

            userController.updateUser(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe('deleteUser', () => {
        it('should delete a user and return status 200', () => {
            req.params.id = 1;
            const mockResult = { affectedRows: 1 };
            jest.spyOn(User, 'delete').mockImplementation((id, callback) => {
                callback(null, mockResult);
            });

            userController.deleteUser(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({ message: 'User deleted successfully' });
        });

        it('should return status 404 if user not found', () => {
            req.params.id = 1;
            jest.spyOn(User, 'delete').mockImplementation((id, callback) => {
                callback(null, { affectedRows: 0 });
            });

            userController.deleteUser(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith({ message: 'User not found' });
        });

        it('should return status 500 on error', () => {
            req.params.id = 1;
            jest.spyOn(User, 'delete').mockImplementation((id, callback) => {
                callback(new Error('Database error'));
            });

            userController.deleteUser(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith(expect.any(Error));
        });
    });
});
