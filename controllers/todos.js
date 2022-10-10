const Todo = require('../models/Todo')
const moment = require('moment');

module.exports = {
    getTodos: async (req,res)=>{
        try{
            const todoItems = await Todo.find({userId:req.user.id}).sort({priority: 'asc'})
            const itemsLeft = await Todo.countDocuments({userId:req.user.id,completed: false})
            const overdue = await Todo.find({ userId:req.user.id, date: { $lte: moment().subtract(1, 'days').format("YYYY-MM-DD") } })
            res.render('todos.ejs', {todos: todoItems, left: itemsLeft, user: req.user, overdue: overdue, moment: moment })
        }catch(err){
            console.log(err)
        }
    },
    createTodo: async (req, res)=>{
        try{
            await Todo.create({todo: req.body.todoItem, date: req.body.date, time: req.body.time, priority:req.body.priority, completed: false, userId: req.user.id}) // re-adding date/time
            console.log('Todo has been added!')
            res.redirect('/todos')
        }catch(err){
            console.log(err)
        }
    },
    markComplete: async (req, res)=>{
        try{
            await Todo.findOneAndUpdate({_id:req.body.todoIdFromJSFile},{
                completed: true
            })
            console.log('Marked Complete')
            res.json('Marked Complete')
        }catch(err){
            console.log(err)
        }
    },
    markIncomplete: async (req, res)=>{
        try{
            await Todo.findOneAndUpdate({_id:req.body.todoIdFromJSFile},{
                completed: false
            })
            console.log('Marked Incomplete')
            res.json('Marked Incomplete')
        }catch(err){
            console.log(err)
        }
    },
    getUpdateTodo: async (req,res)=>{
        try{
            const todoItem = await Todo.find({userId:req.user.id, _id: req.params.id})
            res.render("editTodo.ejs", {todo: todoItem[0], user: req.user, moment: moment })
            console.log(todoItem)
        }catch(err){
            console.log(err)
        }
    },
    updateTodo: async(req, res)=>{
        try {
            await Todo.findOneAndUpdate({ _id: req.params.id },{
                $set: { todo: req.body.todoItem, },
              });
            console.log("Todo Updated");
            res.redirect("/todos");
          } catch (err) {
            console.log(err);
          }
     },
    deleteTodo: async (req, res)=>{
        try{
            await Todo.findOneAndDelete({_id:req.params.id})
            console.log('Deleted Todo')
            res.redirect("/todos");
        }catch(err){
            console.log(err)
        }
    }
}    