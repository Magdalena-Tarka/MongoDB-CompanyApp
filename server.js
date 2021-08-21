const express = require('express');
const cors = require('cors');
const mongoClient = require('mongodb').MongoClient;

const employeesRoutes = require('./routes/employees.routes');
const departmentsRoutes = require('./routes/departments.routes');
const productsRoutes = require('./routes/products.routes');

mongoClient.connect('mongodb://localhost:27017/', { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
  if(err) {
    console.log(err);
  }
  else {
    console.log('Successfully connected to the database');
    const db = client.db('companyDB');
    const app = express();

    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    app.use((req, res, next) => {
      req.db = db;
      next();
    });

    app.use('/api', employeesRoutes);
    app.use('/api', departmentsRoutes);
    app.use('/api', productsRoutes);

    app.use((req, res) => {
      res.status(404).send({ message: 'Not found...' });
    })

    app.listen('8000', () => {
      console.log('Server is running on port: 8000');
    });  

    // wbudowana funnkcja .each iteruje po otrzymanych data dobra w przypadku dużych danych
    /*db.collection('employees').find({ department: 'IT' }, (err, data) => {
      if(!err) {
        data.each((error, employee) => {
          console.log(employee);
        })
      }    
    });*/

    // Drugą opcją na umożliwienie iteracji jest przekonwertowanie do tablicy za pomocą .toArray,
    // znacząco poprawia toczytelność i możemy korzystać z wbudowanych metdo (forEach, filter),
    // niestety tracimy trochę wydajności, kt oferuje Coursor, bo od razu ładujemy cały zestaw danych.
    // Jeśli wiesz, że you need all data możesz użyć tej motedy.
    /*db.collection('employees').find({ department: 'IT' }).toArray((err, data) => {
      if(!err) {
        console.log(data)
      }
    });*/
  }
});
