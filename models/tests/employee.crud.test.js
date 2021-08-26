const Employee = require('../employee.model');
const expect = require('chai').expect;
const mongoose = require('mongoose');
const MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;

describe('Employee', () => {
  before(async () => {
    try {
      const fakeDB = new MongoMemoryServer();
      const uri = await fakeDB.getUri();
      await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    } catch(err) {
      console.log(err);
    }
  });

  describe('Reading data', () => {
    before(async () => {
      const testEmplOne = new Employee({ firstName: 'FirstName #1', lastName: 'LastName #1', department: 'Department #1' });
      await testEmplOne.save();
      const testEmplTwo = new Employee({ firstName: 'FirstName #2', lastName: 'LastName #2', department: 'Department #2' });
      await testEmplTwo.save();
    });

    after(async () => {
      await Employee.deleteMany();
    });

    it('should return all the data with "find" method', async () => {
      const employees = await Employee.find();
      const expectedLength = 2;
      expect(employees.length).to.be.equal(expectedLength);
    });

    it('should return a proper document by various params with "findOne" method', async () => {
      const employee = await Employee.findOne({ firstName: 'FirstName #1' });
      const expectedDoc = { firstName: 'FirstName #1', lastName: 'LastName #1', department: 'Department #1' };
      expect(employee.firstName).to.be.equal(expectedDoc.firstName);
      expect(employee.lastName).to.be.equal(expectedDoc.lastName);
      expect(employee.department).to.be.equal(expectedDoc.department);
    });
  });

  describe('Creating data', () => {
    after(async () => {
      await Employee.deleteMany();
    });
    
    it('should insert new document with "insertOne" method', async () => {
      const employee = new Employee({ firstName: 'FirstName #3', lastName: 'LastName #3', department: 'Department #3' });
      await employee.save();
      expect(employee.isNew).to.be.false;
    });
  });  

  describe('Updating data', () => {
    beforeEach(async () => {
      const testEmplOne = new Employee({ firstName: 'FirstName #1', lastName: 'LastName #1', department: 'Department #1' });
      await testEmplOne.save();
      const testEmplTwo = new Employee({ firstName: 'FirstName #2', lastName: 'LastName #2', department: 'Department #2' });
      await testEmplTwo.save();
    });

    afterEach(async () => {
      await Employee.deleteMany();
    });

    it('should properly update one document with "updateOne" method', async () => {
      await Employee.updateOne({ firstName: 'FirstName #1' }, { $set: { firstName: '=FirstName #1=' }});
      const updatedEmployee = await Employee.findOne({ firstName: '=FirstName #1=' });
      expect(updatedEmployee).to.not.be.null;
    });

    it('should properly update one document with "save" method', async () => {
      const employee = await Employee.findOne({ lastName: 'LastName #2' });
      employee.lastName = '=LastName #2=';
      await employee.save();
      const updatedEmployee = await Employee.findOne({ lastName: '=LastName #2=' });
      expect(updatedEmployee).to.not.be.null;
    });

    it('should properly update multiple documents with "updateMany" method', async () => {
      await Employee.updateMany({}, { $set: { department: '=Department #1=' }});
      const employees = await Employee.find({ department: '=Department #1=' });
      expect(employees.length).to.be.equal(2);
    });
  
  });
  
  describe('Removing data', () => {
    beforeEach(async () => {
      const testEmplOne = new Employee({ firstName: 'FirstName #1', lastName: 'LastName #1', department: 'Department #1' });
      await testEmplOne.save();
      const testEmplTwo = new Employee({ firstName: 'FirstName #2', lastName: 'LastName #2', department: 'Department #2' });
      await testEmplTwo.save();
    });
    
    afterEach(async () => {
      await Employee.deleteMany();
    });
    
    it('should properly remove one document with "deleteOne" method', async () => {
      await Employee.deleteOne({ firstName: 'FirstName #1' });
      const deletedEmployee = await Employee.findOne({ firstName: 'FirstName #1' });
      expect(deletedEmployee).to.be.equal(null);
    });
  
    it('should properly remove one document with "remove" method', async () => {
      const employee = await Employee.findOne({ lastName: 'LastName #2' });
      await employee.remove();
      const removedEmployee = await Employee.findOne({ lastName: 'LastName #2' });
      expect(removedEmployee).to.be.null;
    });
  
    it('should properly remove multiple documents with "deleteMany" method', async () => {
      await Employee.deleteMany();
      const employees = await Employee.find();
      expect(employees.length).to.be.equal(0);
    });
  });  

});
