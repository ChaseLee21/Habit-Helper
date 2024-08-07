const { Week, Day } = require('../../models/index');
const moment = require('moment-timezone');

describe('User Controller', () => {
    let chai, expect, request, server, testUser;

    const userData = {
        email: 'testemail123@gmail.com',
        name: 'testuser',
        password: 'Password321!'
    }

    const habitData = {
        name: 'Test Habit',
        description: 'This is a test habit',
        why: 'To test the habit creation',
        goal: 'To complete the habit',
        frequency: 5
    }

    before(async () => {
        chai = await import('chai');
        expect = chai.expect;
        request = (await import('supertest')).default;
        const { serverReady } = require('../../server.js'); // Import the serverReady promise

        // Wait for the server to be initialized
        server = await serverReady;
        if (!server) throw new Error('Server not initialized');
    });

    it('POST /api/users should create a new user and return it', function (done) {
        request(server)
            .post('/api/users')
            .send(userData)
            .expect(201)
            .end(function (err, res) {
                if (err) return done(err);
                testUser = res.body;
                expect(res.body).to.be.an('object');
                expect(testUser.email).to.equal(userData.email);
                expect(testUser.name).to.equal(userData.name);
                expect(testUser.password).to.be.undefined;
                expect(testUser.salt).to.be.undefined;
                done();
            });
    });

    it('POST /api/habits/:userId should create a new habit for the user', function (done) {
        habitData.user = testUser._id;
        request(server)
            .post(`/api/habits/${testUser._id}`)
            .send(habitData)
            .expect(201)
            .end(function (err, res) {
                if (err) return done(err);
                let testHabit = res.body.habit;
                expect(testHabit).to.be.an('object');
                expect(testHabit.name).to.equal(habitData.name);
                expect(testHabit.description).to.equal(habitData.description);
                expect(testHabit.why).to.equal(habitData.why);
                expect(testHabit.goal).to.equal(habitData.goal);
                expect(testHabit.frequency).to.equal(habitData.frequency);
                expect(testHabit.user).to.equal(testUser._id);
                expect(testHabit.streak).to.equal(0);
                expect(testHabit.weeks).to.be.an('array');
                done();
            });
    })

    it('GET /api/users/:id should return back the user', function (done) {
        request(server)
            .get(`/api/users/${testUser._id}`)
            .expect(200)
            .end(async function (err, res) {
                if (err) return done(err);
                try {
                    let user = res.body;
                    expect(user).to.be.an('object');
                    expect(user.email).to.equal(userData.email);
                    expect(user.name).to.equal(userData.name);
                    expect(user.password).to.be.undefined;
                    // changing the endDate of the test habit to a date in the past to test the endOfWeek method in the next test
                    await Week.findOneAndUpdate({ _id: user.habits[0].weeks[0]._id }, { $set: { endDate : '2024-08-04' }}, { new: true })
                    done();
                } catch (error) {
                    done(error);
                }
            });
    });

    it('GET /api/users/:id should invoke habit.endOfWeek method and generate a new week document for the users habit', function (done) {
        request(server)
            .get(`/api/users/${testUser._id}`)
            .expect(200)
            .end(async function (err, res) {
                if (err) return done(err);
                try {
                    let user = res.body;
                    const now = moment.tz('America/Los_Angeles').utc().format('YYYY-MM-DD');
                    let confirmTodayExists = await Day.findOne({ week: user.habits[0].weeks[1]._id, date: now })
                    expect(user).to.be.an('object');
                    expect(user.habits[0].weeks.length).to.equal(2);
                    expect(user.habits[0].weeks[0].endDate).to.equal('2024-08-04');
                    expect(user.habits[0].weeks[1].endDate).to.not.equal('2024-08-04');
                    expect(user.habits[0].weeks[1].endDate).to.be.an('string');
                    expect(moment.tz(user.habits[0].weeks[1].endDate, 'America/Los_Angeles').utc().isAfter(now)).to.be.true;
                    expect(user.habits[0].weeks[1].days.length).to.equal(7);
                    expect(confirmTodayExists).to.be.an('object');
                    expect(confirmTodayExists.date).to.equal(now);
                    done();
                } catch (error) {
                    done(error);
                }
            });
    });

    it('PUT /api/users/:id should update a user and return it', function (done) {
        request(server)
            .put(`/api/users/${testUser._id}`)
            .send({
                email: 'testuser321@gmail.com'
            })
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                let user = res.body.user;
                expect(user).to.be.an('object');
                expect(user.email).to.equal('testuser321@gmail.com');
                expect(user.name).to.equal(userData.name);
                expect(user.password).to.be.undefined;
                done();
            });
    });

    it('DELETE /api/users/:id should delete a user and recieve a 200 response', function (done) {
        request(server)
            .delete(`/api/users/${testUser._id}`)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body).to.be.an('object');
                done();
            });
    });
});