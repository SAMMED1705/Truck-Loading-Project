const { Payment } = require("../models");

exports.index = async (req,res)=>{ try{
  const payments=await Payment.findAll({ order:[["createdAt","DESC"]] });
  res.render("payments/index", { payments, title:"Payments" });
}catch(e){ req.flash("error",e.message); res.redirect("/dashboard"); } };

exports.create = (req,res)=>res.render("payments/create", { title:"Create Payment" });

exports.store = async (req,res)=>{ try{
  const data={...req.body};

  await Payment.create(data);
  req.flash("success","Payment created");
  res.redirect("/payments");
}catch(e){ req.flash("error",e.message); res.redirect("/payments/create"); } };

exports.show = async (req,res)=>{
  const payment=await Payment.findByPk(req.params.id);
  if(!payment){ req.flash("error","Not found"); return res.redirect("/payments"); }
  res.render("payments/show", { payment, title:"Payment" });
};

exports.edit = async (req,res)=>{
  const payment=await Payment.findByPk(req.params.id);
  if(!payment){ req.flash("error","Not found"); return res.redirect("/payments"); }
  res.render("payments/edit", { payment, title:"Edit Payment" });
};

exports.update = async (req,res)=>{ try{
  const payment=await Payment.findByPk(req.params.id);
  if(!payment){ req.flash("error","Not found"); return res.redirect("/payments"); }
  const data={...req.body};

  await payment.update(data);
  req.flash("success","Payment updated");
  res.redirect("/payments");
}catch(e){ req.flash("error",e.message); res.redirect("/payments/"+req.params.id+"/edit"); } };

exports.destroy = async (req,res)=>{ try{
  const payment=await Payment.findByPk(req.params.id);
  if(payment) await payment.destroy();
  req.flash("success","Payment deleted");
  res.redirect("/payments");
}catch(e){ req.flash("error",e.message); res.redirect("/payments"); } };
