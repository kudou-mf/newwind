var express = require('express');
var router = express.Router();

var url = require('url');
var passport = require('../lib/passports')();

/* auth request */

router.get('/github',
  passport.authenticate('github'),
  function(req, res){
  req.session.callback_uri = req.param('callback_uri') || '';
});

router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect(url.resolve('/', (req.session.callback_uri || '')));
});

module.exports = router;
