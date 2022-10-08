const Budget = require('../models/Budget')
const moment = require('moment');

module.exports = {
    getBudget: async (req,res)=>{
        try{
            const thisBudget = await Budget.find({userId:req.user.id, date: req.params.date })
            let moneyLeft = thisBudget.length < 1 ? 0 :(thisBudget[0].monthBudget - (thisBudget[0].rent + thisBudget[0].utilities + thisBudget[0].car + thisBudget[0].gas + thisBudget[0].food + thisBudget[0].debt + thisBudget[0].subscription + thisBudget[0].savings) );
            const reqDate = req.params.date
            console.log(req.params.date)
            res.render("budget.ejs", {budget: thisBudget[0], user: req.user, left: moneyLeft, reqDate:req.params.date, moment: moment })
        }catch(err){
            console.log(err)
        }
    },
    getCreateBudget: async (req,res)=>{
        res.render("createBudget.ejs", { moment:moment });
    },
    createBudget: async (req, res)=>{
        try{
            await Budget.create({monthBudget: req.body.fullBudget , date: req.body.budgetMonth , rent: req.body.rent , utilities: req.body.utilities , car: req.body.car , gas: req.body.gas , food: req.body.food, debt: req.body.debt , subscription: req.body.subscription , savings: req.body.savings, userId: req.user.id})
            console.log('Budget has been added!')
            res.redirect(`/budget/${moment().format("YYYY-MM")}`)
        }catch(err){
            console.log(err)
        }
    },
    updateBudget: async(req, res)=>{
        console.log(req.body.todoIdFromJSFile)
        try{
            await Budget.findOneAndUpdate({_id:req.body.todoIdFromJSFile}, {
                $set: {
                    todo: req.body.newNote,
                },
            })
            console.log('Updated todo')
            res.json('Updated Todo')
        }catch(err){
            console.log(err)
        }
    },
    deleteBudget: async (req, res)=>{
        console.log(req.body.todoIdFromJSFile)
        try{
            await Budget.findOneAndDelete({_id:req.body.todoIdFromJSFile})
            console.log('Deleted Todo')
            res.json('Deleted It')
        }catch(err){
            console.log(err)
        }
    }
}    