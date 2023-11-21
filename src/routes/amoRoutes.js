// amoRoutes.js

const express = require('express');
const amoController = require('../controllers/amoController');

const router = express.Router();

// Определение маршрутов
router.get('/findOrCreateContact', amoController.findOrCreateContact);

module.exports = router;
