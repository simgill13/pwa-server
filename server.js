const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const nedb    = require("nedb");
const rest    = require("express-nedb-rest");
const cors    = require("cors");
const app = express();
app.use(bodyParser.json());
const path = require('path');
// const {bar,order} = require('./model');
const {PORT, DATABASE_URL} = require('./config');
// const {ACCOUNT_SID, AUTH_TOKEN} = require('./secret');




const datastore = new nedb({ 
  filename: "mycoffeapp.db",
  autoload: true
});

const restAPI = rest();
restAPI.addDatastore('coffees', datastore);

app.use(cors());
app.use('/', restAPI);
















































let server;
function runServer(databaseUrl=DATABASE_URL, port=PORT) {

  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
     return new Promise((resolve, reject) => {
       console.log('Closing server');
       server.close(err => {
           if (err) {
               return reject(err);
           }
           resolve();
       });
     });
  });
}



if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};


















