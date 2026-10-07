const { Expense } = require("../models");

exports.index = async (req,res)=>{ try{
  const expenses=await Expense.findAll({ order:[["createdAt","DESC"]] });
  res.render("expenses/index", { expenses, title:"Expenses" });
}catch(e){ req.flash("error",e.message); res.redirect("/dashboard"); } };

exports.create = (req,res)=>res.render("expenses/create", { title:"Create Expense" });

exports.store = async (req,res)=>{ try{
  const data={...req.body};

  await Expense.create(data);
  req.flash("success","Expense created");
  res.redirect("/expenses");
}catch(e){ req.flash("error",e.message); res.redirect("/expenses/create"); } };

exports.show = async (req,res)=>{
  const expense=await Expense.findByPk(req.params.id);
  if(!expense){ req.flash("error","Not found"); return res.redirect("/expenses"); }
  res.render("expenses/show", { expense, title:"Expense" });
};

exports.edit = async (req,res)=>{
  const expense=await Expense.findByPk(req.params.id);
  if(!expense){ req.flash("error","Not found"); return res.redirect("/expenses"); }
  res.render("expenses/edit", { expense, title:"Edit Expense" });
};

exports.update = async (req,res)=>{ try{
  const expense=await Expense.findByPk(req.params.id);
  if(!expense){ req.flash("error","Not found"); return res.redirect("/expenses"); }
  const data={...req.body};

  await expense.update(data);
  req.flash("success","Expense updated");
  res.redirect("/expenses");
}catch(e){ req.flash("error",e.message); res.redirect("/expenses/"+req.params.id+"/edit"); } };

exports.destroy = async (req,res)=>{ try{
  const expense=await Expense.findByPk(req.params.id);
  if(expense) await expense.destroy();
  req.flash("success","Expense deleted");
  res.redirect("/expenses");
}catch(e){ req.flash("error",e.message); res.redirect("/expenses"); } };
