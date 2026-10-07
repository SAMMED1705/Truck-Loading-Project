const { Trip } = require("../models");

exports.index = async (req,res)=>{ try{
  const trips=await Trip.findAll({ order:[["createdAt","DESC"]] });
  res.render("trips/index", { trips, title:"Trips" });
}catch(e){ req.flash("error",e.message); res.redirect("/dashboard"); } };

exports.create = (req,res)=>res.render("trips/create", { title:"Create Trip" });

exports.store = async (req,res)=>{ try{
  const data={...req.body};

  await Trip.create(data);
  req.flash("success","Trip created");
  res.redirect("/trips");
}catch(e){ req.flash("error",e.message); res.redirect("/trips/create"); } };

exports.show = async (req,res)=>{
  const trip=await Trip.findByPk(req.params.id);
  if(!trip){ req.flash("error","Not found"); return res.redirect("/trips"); }
  res.render("trips/show", { trip, title:"Trip" });
};

exports.edit = async (req,res)=>{
  const trip=await Trip.findByPk(req.params.id);
  if(!trip){ req.flash("error","Not found"); return res.redirect("/trips"); }
  res.render("trips/edit", { trip, title:"Edit Trip" });
};

exports.update = async (req,res)=>{ try{
  const trip=await Trip.findByPk(req.params.id);
  if(!trip){ req.flash("error","Not found"); return res.redirect("/trips"); }
  const data={...req.body};

  await trip.update(data);
  req.flash("success","Trip updated");
  res.redirect("/trips");
}catch(e){ req.flash("error",e.message); res.redirect("/trips/"+req.params.id+"/edit"); } };

exports.destroy = async (req,res)=>{ try{
  const trip=await Trip.findByPk(req.params.id);
  if(trip) await trip.destroy();
  req.flash("success","Trip deleted");
  res.redirect("/trips");
}catch(e){ req.flash("error",e.message); res.redirect("/trips"); } };
