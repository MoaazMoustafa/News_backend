// test/userController.test.js

const { expect } = require('chai');
const request = require('supertest');
const app = require('../index');
const User = require('../models/user');

describe('userController', () => {
    describe('POST /users', () => {

        before(async () => {
            const user = new User({
                email: "existinguser@test.com",
                password: "fasdflka;dsjflpadsjfla;ksdfjasdf",
                fullName: "existingUser"
            })
            user.save();
        })

        after(async () => {
            await User.findOneAndDelete({ email: "newuser@test.com" })
            await User.findOneAndDelete({ email: "existinguser@test.com" })
        });

        it('should create a new user with valid username and password', async () => {
            const email = 'newUser@test.com';
            const fullName = 'newUser';
            const password = 'password123';

            const res = await request(app)
                .post('/api/users/signup')
                .send({ email, fullName, password, passwordConfirmation: password });

            expect(res.status).to.equal(201);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('userId');
            expect(res.body).to.have.property('message', "user created successfuly");
        });

        it('should return an error message if email is already taken', async () => {
            const email = 'existinguser@test.com';
            const fullName = 'existingUser';
            const password = 'fasdflka;dsjflpadsjfla;ksdfjasdf';

            const res = await request(app)
                .post('/api/users/signup')
                .send({ email, fullName, password, passwordConfirmation: password });
            expect(res.status).to.equal(422);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('errors');
        });

        it('should return an error message if email or password is missing', async () => {
            const email = '';
            const fullName = 'newUser';
            const password = 'password123';

            const res = await request(app)
                .post('/api/users/signup')
                .send({ email, fullName, password, passwordConfirmation: password });
            expect(res.status).to.equal(422);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('errors').to.be.an('array');
        });
    });
});