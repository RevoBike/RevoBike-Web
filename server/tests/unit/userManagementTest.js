const request = require('supertest');
const app = require('../../server'); // Adjust the path to your server file
const User = require('../../src/models/User');
const mongoose = require('mongoose');

describe('User Management', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    describe('POST /users/admin', () => {
        it('should add a new admin user', async () => {
            const res = await request(app)
                .post('/users/admin')
                .send({
                    name: 'Admin User',
                    email: 'admin@example.com',
                    password: 'password123'
                })
                .set('x-auth-token', 'your_superAdmin_token'); // Replace with a valid superAdmin token

            expect(res.statusCode).toEqual(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('email', 'admin@example.com');
        });

        it('should return an error if email is already in use', async () => {
            await User.create({
                name: 'Existing Admin',
                email: 'existing@example.com',
                password: 'password123',
                role: 'admin'
            });

            const res = await request(app)
                .post('/users/admin')
                .send({
                    name: 'New Admin',
                    email: 'existing@example.com',
                    password: 'password123'
                })
                .set('x-auth-token', 'your_superAdmin_token'); // Replace with a valid superAdmin token

            expect(res.statusCode).toEqual(400);
            expect(res.body.message).toBe('Email already in use');
        });

        it('should return an error if required fields are missing', async () => {
            const res = await request(app)
                .post('/users/admin')
                .send({
                    name: 'Admin User'
                })
                .set('x-auth-token', 'your_superAdmin_token'); // Replace with a valid superAdmin token

            expect(res.statusCode).toEqual(400);
            expect(res.body.message).toBe('Missing required fields');
        });
    });
});
