var Entry = require('../lib/entry');
var entries = require('./entries');
var userName = '';

exports.setUserName = function(username){
  userName = username;
}

exports.getUserName = function(){
  return userName;
}

exports.list = function(req, res, next){
  var page = req.page;
  var username = '';
  if(!req.session.uid) {
      res.redirect('/login');  
  } else {
   username = req.user.name;
   entries.setUserName(username);
  }

  Entry.getRange(0, -1, username, function(err, entries) {
    if (err) return next(err);
    res.render('entries', {
      title: 'Entries',
      entries: entries,
    });
  });
};

exports.form = function(req, res){
  res.render('post', { title: 'Post' });
};

exports.submit = function(req, res, next){
  
  var data = req.body.entry;
  var date = new Date(data.date);
  var distance = parseInt(data.distance, 10);
  var time = parseInt(data.time, 10);
  var speed = (distance/time).toFixed(2);
  
  var entry = new Entry({
    "username": res.locals.user.name,
    "date": date,
    "distance": distance,
    "time": time,
    "speed": speed
  });
  
  entry.save(function(err) {
    if (err) return next(err);
    if (req.remoteUser) {
      res.json({message: 'Entry added.'});
    } else {
      res.redirect('/');
    }
  });
};
