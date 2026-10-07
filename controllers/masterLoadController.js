const { MasterLoad } = require("../models");

exports.index = async (req,res)=>{ try{
  const master_loads=await MasterLoad.findAll({ order:[["createdAt","DESC"]] });
  res.render("master_loads/index", { master_loads, title:"Master Loads" });
}catch(e){ req.flash("error",e.message); res.redirect("/dashboard"); } };

exports.create = (req,res)=>res.render("master_loads/create", { title:"Create Master Load" });

exports.store = async (req,res)=>{ try{
  const data={...req.body};

  await MasterLoad.create(data);
  req.flash("success","Master Load created");
  res.redirect("/master_loads");
}catch(e){ req.flash("error",e.message); res.redirect("/master_loads/create"); } };

exports.show = async (req,res)=>{
  const masterLoad=await MasterLoad.findByPk(req.params.id);
  if(!masterLoad){ req.flash("error","Not found"); return res.redirect("/master_loads"); }
  res.render("master_loads/show", { masterLoad, title:"Master Load" });
};

exports.edit = async (req,res)=>{
  const masterLoad=await MasterLoad.findByPk(req.params.id);
  if(!masterLoad){ req.flash("error","Not found"); return res.redirect("/master_loads"); }
  res.render("master_loads/edit", { masterLoad, title:"Edit Master Load" });
};

exports.update = async (req,res)=>{ try{
  const masterLoad=await MasterLoad.findByPk(req.params.id);
  if(!masterLoad){ req.flash("error","Not found"); return res.redirect("/master_loads"); }
  const data={...req.body};

  await masterLoad.update(data);
  req.flash("success","Master Load updated");
  res.redirect("/master_loads");
}catch(e){ req.flash("error",e.message); res.redirect("/master_loads/"+req.params.id+"/edit"); } };

exports.destroy = async (req,res)=>{ try{
  const masterLoad=await MasterLoad.findByPk(req.params.id);
  if(masterLoad) await masterLoad.destroy();
  req.flash("success","Master Load deleted");
  res.redirect("/master_loads");
}catch(e){ req.flash("error",e.message); res.redirect("/master_loads"); } };
