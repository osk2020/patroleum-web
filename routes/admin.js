var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/:_token', function(req, res, next) {
  res.render('/admin/index');
});

module.exports = router;