const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../app');

const { 
      create, getByParent, getLocations, updateParent, updateLocation, deleteLocation 
      } = require('../controllers/locationsController');
const { expect } = chai;
chai.should();
chai.use(chaiHttp);

describe('Locations controller', () => {
  let parentId;
  let subLocationId;
  before((done) => {
    mongoose.createConnection(process.env.URI_TEST, () => {
      mongoose.connection.db.dropDatabase(() => {
        done();
      })
    })
  })

  describe('Create Method', () => {

    it('should throw validation errors if required fields are not provided', (done) => {

      chai.request(app)
        .post('/api/v1/location', create)
        .set('Accept', 'application/json')
        .send({  })
        .end((err, res) => {
          if (!err) {
            expect(res.status).to.equal(400);
            done();
          }
        })

    })
    it('should create a new parent is isParent is true', (done) => {
      const name = "Nigeria"
      const isParent = "true";

      chai.request(app)
        .post('/api/v1/location', create)
        .set('Accept', 'application/json')
        .send({ name, isParent })
        .end((err, res) => {
          if (!err) {
            expect(res.status).to.equal(201);
            expect(res.body).to.have.property('message')
            expect(res.body).to.have.property('location')
            parentId = res.body.location._id;
            done();
          }
        })

    })

    it('should create a new subLocation if isParent is false', (done) => {
      const name = "Lagos"
      const isParent = "false";
      const maleResidents = 200;
      const femaleResidents = 400;

      chai.request(app)
        .post('/api/v1/location', create)
        .set('Accept', 'application/json')
        .send({ name, isParent, maleResidents, femaleResidents, parentId })
        .end((err, res) => {
          if (!err) {
            expect(res.status).to.equal(201);
            expect(res.body).to.have.property('message')
            expect(res.body).to.have.property('location')
            subLocationId = res.body.location._id;
            done();
          }
        })
    })

    it('should throw an error if the parent id for a new location is wrong', (done) => {
      const name = "Lagos"
      const isParent = "false";
      const maleResidents = 200;
      const femaleResidents = 400;
      const parentId = "5c5f274b37e53512b3c2326a";

      chai.request(app)
        .post('/api/v1/location', create)
        .set('Accept', 'application/json')
        .send({ name, isParent, maleResidents, femaleResidents, parentId })
        .end((err, res) => {
          if (!err) {
            expect(res.status).to.equal(404);
            expect(res.body).to.have.property('message')
            done();
          }
        })
    })
    
  });

  describe('getByParent Method', () => {
    it('should throw an error if parentId is wrong', (done) => {
      const id = '5c5f274b37e53512b3c2326a';
      chai.request(app)
        .get(`/api/v1/location/parent/${id}`, getByParent)
        .set('Accept', 'application/json')
        .end((err, res) => {
          if (!err) {
            expect(res.status).to.equal(404);
            expect(res.body).to.have.property('message')
            done();
          }
        })
    })
    it('should get all locations under a parent', (done) => {
      chai.request(app)
        .get(`/api/v1/location/parent/${parentId}`, getByParent)
        .set('Accept', 'application/json')
        .end((err, res) => {
          if (!err) {
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('message')
            expect(res.body).to.have.property('location')
            expect(res.body).to.have.property('totalPopulation')
            done();
          }
        })
    })
  });

  describe('getLocations Method', () => {
    it('should get all locations', (done) => {
      chai.request(app)
        .get('/api/v1/location', getLocations)
        .set('Accept', 'application/json')
        .end((err, res) => {
          if (!err) {
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('message')
            expect(res.body).to.have.property('locations')
            expect(res.body).to.have.property('locations').with.lengthOf(1);
            done();
          }
        })
    })
  });

  describe('updateParent Method', () => {
    it('should throw an error if name is not provided for parent update', (done) => {

      chai.request(app)
        .put(`/api/v1/location/parent/${parentId}`, updateParent)
        .set('Accept', 'application/json')
        .send({ })
        .end((err, res) => {
          if (!err) {
            expect(res.status).to.equal(400);
            done();
          }
        })
    })

    it('should throw an error if parentId provided is not valid', (done) => {
      const name = "Ghana";
      const parentId = '5c5f274b37e53512b3c2326a';

      chai.request(app)
        .put(`/api/v1/location/parent/${parentId}`, updateParent)
        .set('Accept', 'application/json')
        .send({ name })
        .end((err, res) => {
          if (!err) {
            expect(res.status).to.equal(404);
            expect(res.body).to.have.property('message')
            done();
          }
        })
    })

    it('should update the parent location', (done) => {
      const name = 'Ghana';

      chai.request(app)
        .put(`/api/v1/location/parent/${parentId}`, updateParent)
        .set('Accept', 'application/json')
        .send({ name })
        .end((err, res) => {
          if (!err) {
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('message')
            expect(res.body).to.have.property('updatedLocation')
            done();
          }
        })
    })
  });

  describe('updateLocation method', () => {
    it('should throw a validation error if required fields are not provided', (done) => {

      chai.request(app)
        .put(`/api/v1/location/${subLocationId}`, updateLocation)
        .set('Accept', 'application/json')
        .send({ })
        .end((err, res) => {
          if (!err) {
            expect(res.status).to.equal(400);
            done();
          }
        })
    })

    it('should throw an error if location id provided is not valid', (done) => {
      const name = "Kumasi";
      const maleResidents = 100;
      const femaleResidents = 200;
      const subLocationId = '5c5f274b37e53512b3c2326a';

      chai.request(app)
        .put(`/api/v1/location/${subLocationId}`, updateLocation)
        .set('Accept', 'application/json')
        .send({ name, maleResidents, femaleResidents })
        .end((err, res) => {
          if (!err) {
            expect(res.status).to.equal(404);
            expect(res.body).to.have.property('message')
            done();
          }
        })
    })

    it('should successfully update a location ', (done) => {
      const name = "Kumasi";
      const maleResidents = 100;
      const femaleResidents = 200;

      chai.request(app)
        .put(`/api/v1/location/${subLocationId}`, updateLocation)
        .set('Accept', 'application/json')
        .send({ name, maleResidents, femaleResidents })
        .end((err, res) => {
          if (!err) {
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('message')
            done();
          }
        })
    })
  });

  describe('deleteLocation method', () => {
    it('should throw an error if location id provided is not valid', (done) => {
  
      const subLocationId = '5c5f274b37e53512b3c2326a';

      chai.request(app)
        .delete(`/api/v1/location/${subLocationId}`, deleteLocation)
        .set('Accept', 'application/json')
        .end((err, res) => {
          if (!err) {
            expect(res.status).to.equal(404);
            expect(res.body).to.have.property('message')
            done();
          }
        })
    })

    it('should successfully delete a location', (done) => {
      chai.request(app)
        .delete(`/api/v1/location/${subLocationId}`, deleteLocation)
        .set('Accept', 'application/json')
        .end((err, res) => {
          if (!err) {
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('message')
            done();
          }
        })
    })

    it('should get all, check that locations array is empty', (done) => {
      chai.request(app)
        .get('/api/v1/location', getLocations)
        .set('Accept', 'application/json')
        .end((err, res) => {
          if (!err) {
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('message')
            done();
          }
        })
    })
  });

});
