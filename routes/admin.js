var express = require('express');
var router = express.Router();

var path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  if (Object(req.query).hasOwnProperty("_token"))
  {
    res.render("admin/index");
  }
  else
  {
    res.redirect("/");
  }

});

module.exports = router;