var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.headers);
  res.render("index");
});

module.exports = router;
