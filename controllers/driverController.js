const { Driver } = require("../models");

exports.index = async (req,res)=>{ try{
  const drivers=await Driver.findAll({ order:[["createdAt","DESC"]] });
  res.render("drivers/index", { drivers, title:"Drivers" });
}catch(e){ req.flash("error",e.message); res.redirect("/dashboard"); } };

exports.create = (req,res)=>res.render("drivers/create", { title:"Create Driver" });

exports.store = async (req,res)=>{ try{
  const data={...req.body};

  await Driver.create(data);
  req.flash("success","Driver created");
  res.redirect("/drivers");
}catch(e){ req.flash("error",e.message); res.redirect("/drivers/create"); } };

exports.show = async (req,res)=>{
  const driver=await Driver.findByPk(req.params.id);
  if(!driver){ req.flash("error","Not found"); return res.redirect("/drivers"); }
  res.render("drivers/show", { driver, title:"Driver" });
};

exports.edit = async (req,res)=>{
  const driver=await Driver.findByPk(req.params.id);
  if(!driver){ req.flash("error","Not found"); return res.redirect("/drivers"); }
  res.render("drivers/edit", { driver, title:"Edit Driver" });
};

exports.update = async (req,res)=>{ try{
  const driver=await Driver.findByPk(req.params.id);
  if(!driver){ req.flash("error","Not found"); return res.redirect("/drivers"); }
  const data={...req.body};

  await driver.update(data);
  req.flash("success","Driver updated");
  res.redirect("/drivers");
}catch(e){ req.flash("error",e.message); res.redirect("/drivers/"+req.params.id+"/edit"); } };

exports.destroy = async (req,res)=>{ try{
  const driver=await Driver.findByPk(req.params.id);
  if(driver) await driver.destroy();
  req.flash("success","Driver deleted");
  res.redirect("/drivers");
}catch(e){ req.flash("error",e.message); res.redirect("/drivers"); } };
