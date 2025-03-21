const express = require('express')
const { getAllReports } = require('../controllers/report.controller')
const router = express.Router()

router.get('/', getAllReports)

module.exports = router
