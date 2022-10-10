const Budget = require('../models/Budget')
const moment = require('moment');

module.exports = {
    getBudget: async (req,res)=>{
        try{
            const thisBudget = await Budget.find({userId:req.user.id, date: req.params.date })
            let moneyLeft = thisBudget.length < 1 ? 0 :(thisBudget[0].monthBudget - (thisBudget[0].rent + thisBudget[0].utilities + thisBudget[0].car + thisBudget[0].gas + thisBudget[0].food + thisBudget[0].debt + thisBudget[0].subscription + thisBudget[0].savings) );
            const reqDate = req.params.date
            console.log(req.params.date)
            res.render("budget.ejs", {budget: thisBudget[thisBudget.length-1], user: req.user, left: moneyLeft, reqDate:req.params.date, moment: moment })
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
    getUpdateBudget: async (req,res)=>{
        try{
            const thisBudget = await Budget.find({userId:req.user.id, date: req.params.date })
            const reqDate = req.params.date
            res.render("editBudget.ejs", {budget: thisBudget[thisBudget.length-1], user: req.user, reqDate:req.params.date, moment: moment })
        }catch(err){
            console.log(err)
        }
    },
    updateBudget: async(req, res)=>{
         try {
           await Budget.findOneAndUpdate({ _id: req.params.id },{
               $set: { 
                monthBudget: req.body.fullBudget,
                rent: req.body.rent, 
                utilities: req.body.utilities , 
                car: req.body.car , 
                gas: req.body.gas , 
                food: req.body.food, 
                debt: req.body.debt , 
                subscription: req.body.subscription , 
                savings: req.body.savings, },
             }
           );
           console.log("Budget Updated");
           res.redirect(`/budget/${moment().format("YYYY-MM")}`);
         } catch (err) {
           console.log(err);
         }
    },
    deleteBudget: async (req, res)=>{
        try {
            // Delete post from db
            await Budget.remove({ _id: req.params.id });
            console.log("Deleted Budget");
            res.redirect("/dashboard");
          } catch (err) {
            res.redirect(`/budget/${moment().format("YYYY-MM")}`);
          }
    },
   

        
}    