const request = require('./index');
const supertest = require('supertest');
const expect = require('chai').expect;

describe("GET /user",_ =>{
    it("Testing route", done =>{
        supertest(request)
            .get('/user')
            .expect(200)
            .expect(response => {
                console.log(response)
            })
            .end(err => {
                if(err) return done(err)
                return done();
            })
    })
})