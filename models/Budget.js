const mongoose = require('mongoose')

const BudgetSchema = new mongoose.Schema({
  monthBudget: {
    type: String,
    required: true,
  },
  date: { 
    type: String,
    required: true, 
  },
  rent: {
    type: Number,
    required: false,
  },
  utilities: {
    type: Number,
    required: false,
  },
  car: {
    type: Number,
    required: false,
  },
  gas: {
    type: Number,
    required: false,
  },
  food: {
    type: Number,
    required: false,
  },
  debt: {
    type: Number,
    required: false,
  },
  subscription: {
    type: Number,
    required: false,
  },
  savings: {
    type: Number,
    required: false,
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
})

module.exports = mongoose.model('Budget', BudgetSchema)
