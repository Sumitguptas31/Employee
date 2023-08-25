// test/user.test.js
const chai = require('chai');
const chaiHttp = require('chai-http');
const route = require('../routes/route');
const employeeController = require('../controllers/employeeController');
chai.use(chaiHttp);
const expect = chai.expect;
const assert = require("assert")
// describe('User Route', () => {
//   it('should get user by ID', async () => {
//     const Id = '64a6b90da24aa3ad0d365262';
//     const response = await chai.request(route).get(`/user/${Id}`);
//     console.log("response",response)
//     expect(response).to.have.status(200);
//     expect(response.body).to.deep.equal({ id: Id, name: 'sumit gupta' });
//   });
// });

describe('User', () => {
        describe('"check function"', () => {
            it('should be a function', async () => {
             expect(employeeController.getUser).to.be.a("function")
            });
            let functions= employeeController.up()
            it('should return a promise', async () => {
                expect(functions.then).to.be.a("function")
                expect(functions.catch).to.be.a("function")
               });
          });
  });
