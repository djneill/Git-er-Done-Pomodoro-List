const express = require('express')
const router = express.Router()
const timerController = require('../controllers/timer') 


router.post('/timer', timerController.timer)


module.exports = router