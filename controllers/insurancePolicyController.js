const { InsurancePolicy } = require("../models");

exports.index = async (req,res)=>{ try{
  const insurance_policies=await InsurancePolicy.findAll({ order:[["createdAt","DESC"]] });
  res.render("insurance_policies/index", { insurance_policies, title:"Insurances" });
}catch(e){ req.flash("error",e.message); res.redirect("/dashboard"); } };

exports.create = (req,res)=>res.render("insurance_policies/create", { title:"Create Insurance" });

exports.store = async (req,res)=>{ try{
  const data={...req.body};

  await InsurancePolicy.create(data);
  req.flash("success","Insurance created");
  res.redirect("/insurance_policies");
}catch(e){ req.flash("error",e.message); res.redirect("/insurance_policies/create"); } };

exports.show = async (req,res)=>{
  const insurancePolicy=await InsurancePolicy.findByPk(req.params.id);
  if(!insurancePolicy){ req.flash("error","Not found"); return res.redirect("/insurance_policies"); }
  res.render("insurance_policies/show", { insurancePolicy, title:"Insurance" });
};

exports.edit = async (req,res)=>{
  const insurancePolicy=await InsurancePolicy.findByPk(req.params.id);
  if(!insurancePolicy){ req.flash("error","Not found"); return res.redirect("/insurance_policies"); }
  res.render("insurance_policies/edit", { insurancePolicy, title:"Edit Insurance" });
};

exports.update = async (req,res)=>{ try{
  const insurancePolicy=await InsurancePolicy.findByPk(req.params.id);
  if(!insurancePolicy){ req.flash("error","Not found"); return res.redirect("/insurance_policies"); }
  const data={...req.body};

  await insurancePolicy.update(data);
  req.flash("success","Insurance updated");
  res.redirect("/insurance_policies");
}catch(e){ req.flash("error",e.message); res.redirect("/insurance_policies/"+req.params.id+"/edit"); } };

exports.destroy = async (req,res)=>{ try{
  const insurancePolicy=await InsurancePolicy.findByPk(req.params.id);
  if(insurancePolicy) await insurancePolicy.destroy();
  req.flash("success","Insurance deleted");
  res.redirect("/insurance_policies");
}catch(e){ req.flash("error",e.message); res.redirect("/insurance_policies"); } };
