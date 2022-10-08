const express = require('express')
const router = express.Router()
const budgetController = require('../controllers/budgets') 
const { ensureAuth } = require('../middleware/auth')

router.get('/:date', ensureAuth, budgetController.getBudget)

router.post('/createBudget', budgetController.createBudget)

router.put('/updateBudget', budgetController.updateBudget)

router.delete('/deleteBudget', budgetController.deleteBudget)

module.exports = router