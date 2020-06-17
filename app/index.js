const bodyParser = require('body-parser');
const path = require('path');
const config = require('config');
const express = require('express');
const cors = require('cors');
const url = require('url');

let app = express()
    .set('trust proxy', 'loopback')
    .use(cors())
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))
    .use(express.static(path.join(__dirname, 'public')))

module.exports = app;