var express = require('express');
var User = require('../lib/user');
var Entry = require('../lib/entry');
var username = '';

exports.auth = express.basicAuth(User.authenticate);

exports.user = function(req, res, next){
  User.get(req.params.id, function(err, user){
    if (err) return next(err);
    if (!user.id) return res.send(404);
    username=user.name;
    res.json(user);
  });
};

exports.entries = function(req, res, next){
  //console.log(req);
//console.log(req.params);
 // User.get(req.params.id, function(err, user){
  //  console.log(user);
  //  username = user.name;
  //});
  username=req.user.name;
  console.log(req);
  Entry.getRange(0, -1, username, function(err, entries){
    if (err) return next(err);

    res.format({
      json: function(){
        res.send(entries);
      },

      xml: function(){
        res.render('entries/xml', { entries: entries });
      }
    });
  });
};
