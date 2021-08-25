const Employee = require('../employee.model');
const expect = require('chai').expect;
const mongoose = require('mongoose');

after(() => {
  mongoose.models = {};
});

describe('Employee', () => {
  it('should throw an error if no "firstName", "lastName", "department" arg', () => {
    const empl = new Employee({});
    empl.validate(err => {
      expect(err.errors.firstName).to.exist;
      expect(err.errors.lastName).to.exist;
      expect(err.errors.department).to.exist;
    });
  });

  it('should throw an error if "firstName", "lastName", "department" is not a string', () => {
    const empl = new Employee({ firstName: {}, lastName: [], department: undefined });
    empl.validate(err => {
      expect(err.errors.firstName).to.exist;
      expect(err.errors.lastName).to.exist;
      expect(err.errors.department).to.exist;
    });
  });

  it('should not throw an error if "firstName", "lastName", "department" is okay', () => {
    const empl = new Employee({ firstName: 'Denis', lastName: 'Rodman', department: 'Management' });
    empl.validate(err => {
      expect(err).to.not.exist;
    });
  });
});
