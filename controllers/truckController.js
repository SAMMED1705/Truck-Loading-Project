const { Truck } = require("../models");

exports.index = async (req,res)=>{ try{
  const trucks=await Truck.findAll({ order:[["createdAt","DESC"]] });
  res.render("trucks/index", { trucks, title:"Trucks" });
}catch(e){ req.flash("error",e.message); res.redirect("/dashboard"); } };

exports.create = (req,res)=>res.render("trucks/create", { title:"Create Truck" });

exports.store = async (req,res)=>{ try{
  const data={...req.body};
    data.gps_active = req.body.gps_active === "on";
  await Truck.create(data);
  req.flash("success","Truck created");
  res.redirect("/trucks");
}catch(e){ req.flash("error",e.message); res.redirect("/trucks/create"); } };

exports.show = async (req,res)=>{
  const truck=await Truck.findByPk(req.params.id);
  if(!truck){ req.flash("error","Not found"); return res.redirect("/trucks"); }
  res.render("trucks/show", { truck, title:"Truck" });
};

exports.edit = async (req,res)=>{
  const truck=await Truck.findByPk(req.params.id);
  if(!truck){ req.flash("error","Not found"); return res.redirect("/trucks"); }
  res.render("trucks/edit", { truck, title:"Edit Truck" });
};

exports.update = async (req,res)=>{ try{
  const truck=await Truck.findByPk(req.params.id);
  if(!truck){ req.flash("error","Not found"); return res.redirect("/trucks"); }
  const data={...req.body};
    data.gps_active = req.body.gps_active === "on";
  await truck.update(data);
  req.flash("success","Truck updated");
  res.redirect("/trucks");
}catch(e){ req.flash("error",e.message); res.redirect("/trucks/"+req.params.id+"/edit"); } };

exports.destroy = async (req,res)=>{ try{
  const truck=await Truck.findByPk(req.params.id);
  if(truck) await truck.destroy();
  req.flash("success","Truck deleted");
  res.redirect("/trucks");
}catch(e){ req.flash("error",e.message); res.redirect("/trucks"); } };
