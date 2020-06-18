var express = require('express');
var router = express.Router();
var common = require('../middlewares/common');
var path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  if (Object(req.query).hasOwnProperty("_token"))
  {
    if (common.validateToken(req.query._token))
    {
      res.render("admin/index");
    }
    else
    {
      res.redirect("/");
    }
  }
  else
  {
    res.redirect("/");
  }

});

module.exports = router;