const { Shipment } = require("../models");

exports.index = async (req,res)=>{ try{
  const shipments=await Shipment.findAll({ order:[["createdAt","DESC"]] });
  res.render("shipments/index", { shipments, title:"Shipments" });
}catch(e){ req.flash("error",e.message); res.redirect("/dashboard"); } };

exports.create = (req,res)=>res.render("shipments/create", { title:"Create Shipment" });

exports.store = async (req,res)=>{ try{
  const data={...req.body};

  await Shipment.create(data);
  req.flash("success","Shipment created");
  res.redirect("/shipments");
}catch(e){ req.flash("error",e.message); res.redirect("/shipments/create"); } };

exports.show = async (req,res)=>{
  const shipment=await Shipment.findByPk(req.params.id);
  if(!shipment){ req.flash("error","Not found"); return res.redirect("/shipments"); }
  res.render("shipments/show", { shipment, title:"Shipment" });
};

exports.edit = async (req,res)=>{
  const shipment=await Shipment.findByPk(req.params.id);
  if(!shipment){ req.flash("error","Not found"); return res.redirect("/shipments"); }
  res.render("shipments/edit", { shipment, title:"Edit Shipment" });
};

exports.update = async (req,res)=>{ try{
  const shipment=await Shipment.findByPk(req.params.id);
  if(!shipment){ req.flash("error","Not found"); return res.redirect("/shipments"); }
  const data={...req.body};

  await shipment.update(data);
  req.flash("success","Shipment updated");
  res.redirect("/shipments");
}catch(e){ req.flash("error",e.message); res.redirect("/shipments/"+req.params.id+"/edit"); } };

exports.destroy = async (req,res)=>{ try{
  const shipment=await Shipment.findByPk(req.params.id);
  if(shipment) await shipment.destroy();
  req.flash("success","Shipment deleted");
  res.redirect("/shipments");
}catch(e){ req.flash("error",e.message); res.redirect("/shipments"); } };
