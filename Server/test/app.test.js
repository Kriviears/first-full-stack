'use strict';

const expect = require('chai').expect;
const request = require('supertest');
const app = require('../app');

describe('GET /books', ()=>{
  it('should return an array of books', ()=>{
    return request(app)
      .get('/books')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res =>{
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.lengthOf.at.least(1);
        const book = res.body[0];
        expect(book).to.include.all.keys('bestsellers_date', 'author', 'description', 'title');
      });
  });

  it('should be 400 if sort is incorrect', ()=>{
    return request(app)
      .get('/books')
      .query({sort: 'MISTAKE'})
      .expect(400, 'Sort must be either \'title\' or \'rank\'');
  });

  it('should sort by title', ()=>{
    return request(app)
      .get('/books')
      .query({sort: 'title'})
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res =>{
        expect(res.body).to.be.an('array');
        let i = 0;
        let sorted = true;
        while(sorted && i < res.body.length - 1){
          sorted = sorted && res.body[i].title < res.body[i + 1].title;
          i++;
        }
        expect(sorted).to.be.true;
      });
  });
});
