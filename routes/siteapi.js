var express = require('express');
var router = express.Router();
var _ = require('lodash');
var request = require('superagent');

var parser = require('../lib/parser');

var User = require('../models/user');

/* サイト内で使用するAPI */

router.get('/auth', ensureAuthenticated, function(req, res){

    res.json({
      message: '',
      auth: true,
      user_name: req.user.username,
      avatar_url: req.user._json.avatar_url,
      display_name: req.user.displayName,
      public_repos: req.user._json.public_repos
    });

});

router.get('/orgs', ensureAuthenticated, function(req, res) {

  request
  .get("https://api.github.com/users/" + req.user.username + "/orgs")
  // .set('Accept', 'application/vnd.github.moondragon+json')
  .set('Authorization', 'token ' + req.user.token)
  .end(function(err, orgs) {

    if (err) throw err;

    res.json({
      auth: true,
      orgs: _.map(orgs.body, function(org) {
        return {
          name: org.login,
          github_id: org.id,
          avatar_url: org.avatar_url
        };
      })
    });

  });

});

router.get('/repos', ensureAuthenticated, function(req, res) {

  var api_route = req.query.owner ? 'orgs/' +  req.query.owner : 'users/' + req.user.username;

  request
  .get("https://api.github.com/" + api_route + "/repos")
  // .set('Accept', 'application/vnd.github.moondragon+json')
  .set('Authorization', 'token ' + req.user.token)
  .end(function(err, repos) {
    if (err) return res.set(500).json({ message: err });
    return res.json({
      auth: true,
      repos: repos.body
    });
  });

});

router.get('/add_repo', ensureAuthenticated, function(req, res) {

  if (! req.body.owner) return res.set(500).json({ message: 'オーナーまたはチーム名がありません' });
  if (! req.body.repo)  return res.set(500).json({ message: 'レポジトリ名がありません' });

  var repository = 'github.com/' + req.body.owner + '/' + req.body.repo;

  parser.enqueueRepo(repository , function (err) {
    if (err) { return res.set(500).json({message: err}); }
    return res.set(200).json({message: 追加しました});
  });

});


function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.json({
    message: 'Welcome to Dr naminG.',
    auth: false
  });
}

module.exports = router;
