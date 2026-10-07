const { Warehouse } = require("../models");

exports.index = async (req,res)=>{ try{
  const warehouses=await Warehouse.findAll({ order:[["createdAt","DESC"]] });
  res.render("warehouses/index", { warehouses, title:"Warehouses" });
}catch(e){ req.flash("error",e.message); res.redirect("/dashboard"); } };

exports.create = (req,res)=>res.render("warehouses/create", { title:"Create Warehouse" });

exports.store = async (req,res)=>{ try{
  const data={...req.body};

  await Warehouse.create(data);
  req.flash("success","Warehouse created");
  res.redirect("/warehouses");
}catch(e){ req.flash("error",e.message); res.redirect("/warehouses/create"); } };

exports.show = async (req,res)=>{
  const warehouse=await Warehouse.findByPk(req.params.id);
  if(!warehouse){ req.flash("error","Not found"); return res.redirect("/warehouses"); }
  res.render("warehouses/show", { warehouse, title:"Warehouse" });
};

exports.edit = async (req,res)=>{
  const warehouse=await Warehouse.findByPk(req.params.id);
  if(!warehouse){ req.flash("error","Not found"); return res.redirect("/warehouses"); }
  res.render("warehouses/edit", { warehouse, title:"Edit Warehouse" });
};

exports.update = async (req,res)=>{ try{
  const warehouse=await Warehouse.findByPk(req.params.id);
  if(!warehouse){ req.flash("error","Not found"); return res.redirect("/warehouses"); }
  const data={...req.body};

  await warehouse.update(data);
  req.flash("success","Warehouse updated");
  res.redirect("/warehouses");
}catch(e){ req.flash("error",e.message); res.redirect("/warehouses/"+req.params.id+"/edit"); } };

exports.destroy = async (req,res)=>{ try{
  const warehouse=await Warehouse.findByPk(req.params.id);
  if(warehouse) await warehouse.destroy();
  req.flash("success","Warehouse deleted");
  res.redirect("/warehouses");
}catch(e){ req.flash("error",e.message); res.redirect("/warehouses"); } };
