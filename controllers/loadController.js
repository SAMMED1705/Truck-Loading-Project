const { Load } = require("../models");

exports.index = async (req,res)=>{ try{
  const loads=await Load.findAll({ order:[["createdAt","DESC"]] });
  res.render("loads/index", { loads, title:"Loads" });
}catch(e){ req.flash("error",e.message); res.redirect("/dashboard"); } };

exports.create = (req,res)=>res.render("loads/create", { title:"Create Load" });

exports.store = async (req,res)=>{ try{
  const data={...req.body};

  await Load.create(data);
  req.flash("success","Load created");
  res.redirect("/loads");
}catch(e){ req.flash("error",e.message); res.redirect("/loads/create"); } };

exports.show = async (req,res)=>{
  const load=await Load.findByPk(req.params.id);
  if(!load){ req.flash("error","Not found"); return res.redirect("/loads"); }
  res.render("loads/show", { load, title:"Load" });
};

exports.edit = async (req,res)=>{
  const load=await Load.findByPk(req.params.id);
  if(!load){ req.flash("error","Not found"); return res.redirect("/loads"); }
  res.render("loads/edit", { load, title:"Edit Load" });
};

exports.update = async (req,res)=>{ try{
  const load=await Load.findByPk(req.params.id);
  if(!load){ req.flash("error","Not found"); return res.redirect("/loads"); }
  const data={...req.body};

  await load.update(data);
  req.flash("success","Load updated");
  res.redirect("/loads");
}catch(e){ req.flash("error",e.message); res.redirect("/loads/"+req.params.id+"/edit"); } };

exports.destroy = async (req,res)=>{ try{
  const load=await Load.findByPk(req.params.id);
  if(load) await load.destroy();
  req.flash("success","Load deleted");
  res.redirect("/loads");
}catch(e){ req.flash("error",e.message); res.redirect("/loads"); } };
