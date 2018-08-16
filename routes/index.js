var express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;
var assert = require('assert');

var url='mongodb://mokesh:mokesh1234@cluster0-shard-00-00-ctics.mongodb.net:27017,cluster0-shard-00-01-ctics.mongodb.net:27017,cluster0-shard-00-02-ctics.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true';
//var url = 'mongodb://mokesh:mokesh1234@cluster0-shard-00-00-51xl0.mongodb.net:27017,cluster0-shard-00-01-51xl0.mongodb.net:27017,cluster0-shard-00-02-51xl0.mongodb.net:27017/admin?replicaSet=Cluster0-shard-0&ssl=true';
//var url= 'mongodb+srv://mokesh:mokesh1234@cluster0-51xl0.mongodb.net/admin';
//var url = 'mongodb://mokesh:mokesh1234@cluster0-shard-00-00-jahgq.mongodb.net:27017,cluster0-shard-00-01-jahgq.mongodb.net:27017,cluster0-shard-00-02-jahgq.mongodb.net:27017/admin?replicaSet=Cluster0-shard-0&ssl=true';
router.get('/', function(req, res, next) {
  res.render('index');
});
router.get('/get-data', function(req, res, next) {
  var resultArray = [];
  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    var cursor = db.collection('user-data').find();
    cursor.forEach(function(doc, err) {
      assert.equal(null, err);
      resultArray.push(doc);
    }, function() {
      db.close();
      res.render('index', {items: resultArray});
    });
  });
});
router.post('/insert', function(req, res, next) {
var item = {
title: req.body.title,
content: req.body.content,
author: req.body.author
};
mongo.connect(url, function(err, db) {
assert.equal(null, err);
db.collection('user-data').insertOne(item, function(err, result) {
assert.equal(null, err);
console.log('Item inserted');
db.close();
});
});
res.redirect('/');
});
router.post('/update', function(req, res, next) {
var item = {
title: req.body.title,
content: req.body.content,
author: req.body.author
};
var id = req.body.id;
mongo.connect(url, function(err, db) {
assert.equal(null, err);
db.collection('user-data').updateOne({"_id": objectId(id)}, {$set: item}, function(err, result) {
assert.equal(null, err);
console.log('Item updated');
db.close();
});
});
});
router.post('/delete', function(req, res, next) {
  var id = req.body.id;
mongo.connect(url, function(err, db) {
assert.equal(null, err);
db.collection('user-data').deleteOne({"_id": objectId(id)}, function(err, result) {
assert.equal(null, err);
console.log('Item deleted');
db.close();
});
});
});
module.exports = router;
