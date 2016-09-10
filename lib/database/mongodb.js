'use strict';

//import the mongodb native drivers.
const mongodb = require('mongodb');
const config = require('../lib/config');
// Connection URL. This is where your mongodb server is running.
const url = config('MONGODB_URL');

//Need to work with "MongoClient" interface in order to connect to a mongodb server.
const MongoClient = mongodb.MongoClient;

module.exports = {
  MongoClient : MongoClient,
  URL : url
};
