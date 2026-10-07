#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

const stype = f => ({
  STRING:'DataTypes.STRING', TEXT:'DataTypes.TEXT', INTEGER:'DataTypes.INTEGER',
  DECIMAL:'DataTypes.DECIMAL(12,2)', DATE:'DataTypes.DATE', BOOLEAN:'DataTypes.BOOLEAN',
  ENUM:`DataTypes.ENUM(${(f.values||[]).map(v=>`"${v}"`).join(',')})`
}[f.type]||'DataTypes.STRING');

const cam = s => s[0].toLowerCase()+s.slice(1);
const itype = f => ({
  STRING:'text', TEXT:'textarea', INTEGER:'number', DECIMAL:'number',
  DATE:'datetime-local', BOOLEAN:'checkbox', ENUM:'select'
}[f.type]||'text');

// ---- MODEL ----
function model(e){
  const f = e.fields.map(x=>{
    let s=`    ${x.name}: { type: ${stype(x)}`;
    if(x.required) s+=`, allowNull: false`;
    if(x.unique)   s+=`, unique: true`;
    if(x.default!==undefined) s+=`, defaultValue: ${typeof x.default==='string'?`"${x.default}"`:x.default}`;
    return s+` }`;
  }).join(',\n');

  return `const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ${e.name} = sequelize.define("${e.name}", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
${f}
}, { tableName: "${e.table}", timestamps: true, underscored: true });

module.exports = ${e.name};
`;
}

// ---- CONTROLLER ----
function controller(e){
  const v=cam(e.name), t=e.table;
  const bf=e.fields.filter(x=>x.type==='BOOLEAN')
    .map(x=>`    data.${x.name} = req.body.${x.name} === "on";`).join('\n');

  return `const { ${e.name} } = require("../models");

exports.index = async (req,res)=>{ try{
  const ${t}=await ${e.name}.findAll({ order:[["createdAt","DESC"]] });
  res.render("${t}/index", { ${t}, title:"${e.label}s" });
}catch(e){ req.flash("error",e.message); res.redirect("/dashboard"); } };

exports.create = (req,res)=>res.render("${t}/create", { title:"Create ${e.label}" });

exports.store = async (req,res)=>{ try{
  const data={...req.body};
${bf}
  await ${e.name}.create(data);
  req.flash("success","${e.label} created");
  res.redirect("/${t}");
}catch(e){ req.flash("error",e.message); res.redirect("/${t}/create"); } };

exports.show = async (req,res)=>{
  const ${v}=await ${e.name}.findByPk(req.params.id);
  if(!${v}){ req.flash("error","Not found"); return res.redirect("/${t}"); }
  res.render("${t}/show", { ${v}, title:"${e.label}" });
};

exports.edit = async (req,res)=>{
  const ${v}=await ${e.name}.findByPk(req.params.id);
  if(!${v}){ req.flash("error","Not found"); return res.redirect("/${t}"); }
  res.render("${t}/edit", { ${v}, title:"Edit ${e.label}" });
};

exports.update = async (req,res)=>{ try{
  const ${v}=await ${e.name}.findByPk(req.params.id);
  if(!${v}){ req.flash("error","Not found"); return res.redirect("/${t}"); }
  const data={...req.body};
${bf}
  await ${v}.update(data);
  req.flash("success","${e.label} updated");
  res.redirect("/${t}");
}catch(e){ req.flash("error",e.message); res.redirect("/${t}/"+req.params.id+"/edit"); } };

exports.destroy = async (req,res)=>{ try{
  const ${v}=await ${e.name}.findByPk(req.params.id);
  if(${v}) await ${v}.destroy();
  req.flash("success","${e.label} deleted");
  res.redirect("/${t}");
}catch(e){ req.flash("error",e.message); res.redirect("/${t}"); } };
`;
}

// ---- ROUTES ----
function routes(e){
  const t=e.table, c=cam(e.name)+'Controller';
  return `const express = require("express");
const router = express.Router();
const controller = require("../controllers/${c}");
const auth = require("../middleware/auth");

router.get("/", auth, controller.index);
router.get("/create", auth, controller.create);
router.post("/", auth, controller.store);
router.get("/:id", auth, controller.show);
router.get("/:id/edit", auth, controller.edit);
router.put("/:id", auth, controller.update);
router.delete("/:id", auth, controller.destroy);

module.exports = router;
`;
}

// ---- VIEW: index (TABLE) ----
function indexView(e){
  const cols=e.fields.filter(f=>f.list);
  const th=cols.map(c=>`<th>${c.label}</th>`).join('\n            ');
  const td=cols.map(c=>{
    if(c.type==='ENUM') return `<td><span class="badge bg-secondary"><%= item.${c.name} %></span></td>`;
    if(c.type==='BOOLEAN') return `<td><%= item.${c.name}?'Yes':'No' %></td>`;
    if(c.type==='DATE') return `<td><%= item.${c.name}?new Date(item.${c.name}).toLocaleDateString():'-' %></td>`;
    return `<td><%= item.${c.name} ?? '-' %></td>`;
  }).join('\n            ');

  return `<%- include('../partials/header') %>
<%- include('../partials/sidebar') %>

<main class="col-md-10 ms-sm-auto px-md-4 py-4">
  <div class="d-flex justify-content-between align-items-center mb-4">
    <h2><i class="${e.icon}"></i> ${e.label}s</h2>
    <a href="/${e.table}/create" class="btn btn-primary"><i class="bi bi-plus-lg"></i> Add ${e.label}</a>
  </div>
  <%- include('../partials/flash') %>
  <div class="card shadow-sm"><div class="card-body">
    <div class="table-responsive">
      <table class="table table-hover align-middle">
        <thead class="table-light"><tr><th style="width:60px;">#</th>
            ${th}
            <th style="width:180px;">Actions</th></tr></thead>
        <tbody>
          <% if (${e.table}.length === 0) { %>
            <tr><td colspan="50" class="text-center text-muted py-4">No records yet.</td></tr>
          <% } %>
          <% ${e.table}.forEach((item, i) => { %>
            <tr><td><%= i + 1 %></td>
            ${td}
            <td>
              <a href="/${e.table}/<%= item.id %>" class="btn btn-sm btn-outline-info"><i class="bi bi-eye"></i></a>
              <a href="/${e.table}/<%= item.id %>/edit" class="btn btn-sm btn-outline-warning"><i class="bi bi-pencil"></i></a>
              <form action="/${e.table}/<%= item.id %>?_method=DELETE" method="POST" class="d-inline" onsubmit="return confirm('Delete this record?');">
                <button class="btn btn-sm btn-outline-danger"><i class="bi bi-trash"></i></button>
              </form>
            </td></tr>
          <% }); %>
        </tbody>
      </table>
    </div>
  </div></div>
</main>

<%- include('../partials/footer') %>
`;
}

// ---- FORM FIELDS ----
function formFields(e, isEdit){
  const v=cam(e.name);
  return e.fields.map(f=>{
    const val=isEdit?`<%= ${v}.${f.name} ?? '' %>`:'';
    const rq=f.required?'required':'';
    const lbl=`<label class="form-label">${f.label}${f.required?' <span class="text-danger">*</span>':''}</label>`;

    if(f.type==='ENUM'){
      const o=f.values.map(x=>isEdit
        ? `<option value="${x}" <%= ${v}.${f.name} === '${x}' ? 'selected' : '' %>>${x}</option>`
        : `<option value="${x}" ${f.default===x?'selected':''}>${x}</option>`
      ).join('\n              ');
      return `<div class="col-md-6 mb-3">${lbl}
        <select name="${f.name}" class="form-select" ${rq}>
              ${o}
        </select>
      </div>`;
    }

    if(f.type==='BOOLEAN'){
      const c=isEdit?`<%= ${v}.${f.name}?'checked':'' %>`:(f.default?'checked':'');
      return `<div class="col-md-6 mb-3"><div class="form-check mt-4">
        <input type="checkbox" name="${f.name}" class="form-check-input" ${c}>
        <label class="form-check-label">${f.label}</label>
      </div></div>`;
    }

    if(f.type==='TEXT'){
      return `<div class="col-md-12 mb-3">${lbl}
        <textarea name="${f.name}" class="form-control" rows="3" ${rq}>${val}</textarea>
      </div>`;
    }

    const t=itype(f), st=f.type==='DECIMAL'?'step="0.01"':'';
    return `<div class="col-md-6 mb-3">${lbl}
      <input type="${t}" name="${f.name}" class="form-control" ${st} value="${val}" ${rq}>
    </div>`;
  }).join('\n        ');
}

// ---- VIEW: create ----
function createView(e){
  return `<%- include('../partials/header') %>
<%- include('../partials/sidebar') %>

<main class="col-md-10 ms-sm-auto px-md-4 py-4">
  <div class="d-flex justify-content-between align-items-center mb-4">
    <h2><i class="${e.icon}"></i> Create ${e.label}</h2>
    <a href="/${e.table}" class="btn btn-outline-secondary"><i class="bi bi-arrow-left"></i> Back</a>
  </div>
  <%- include('../partials/flash') %>
  <div class="card shadow-sm"><div class="card-body">
    <form action="/${e.table}" method="POST">
      <div class="row">
        ${formFields(e,false)}
      </div>
      <div class="mt-3">
        <button class="btn btn-primary"><i class="bi bi-check-lg"></i> Save</button>
        <a href="/${e.table}" class="btn btn-outline-secondary">Cancel</a>
      </div>
    </form>
  </div></div>
</main>

<%- include('../partials/footer') %>
`;
}

// ---- VIEW: edit ----
function editView(e){
  const v=cam(e.name);
  return `<%- include('../partials/header') %>
<%- include('../partials/sidebar') %>

<main class="col-md-10 ms-sm-auto px-md-4 py-4">
  <div class="d-flex justify-content-between align-items-center mb-4">
    <h2><i class="${e.icon}"></i> Edit ${e.label}</h2>
    <a href="/${e.table}" class="btn btn-outline-secondary"><i class="bi bi-arrow-left"></i> Back</a>
  </div>
  <%- include('../partials/flash') %>
  <div class="card shadow-sm"><div class="card-body">
    <form action="/${e.table}/<%= ${v}.id %>?_method=PUT" method="POST">
      <div class="row">
        ${formFields(e,true)}
      </div>
      <div class="mt-3">
        <button class="btn btn-warning"><i class="bi bi-check-lg"></i> Update</button>
        <a href="/${e.table}" class="btn btn-outline-secondary">Cancel</a>
      </div>
    </form>
  </div></div>
</main>

<%- include('../partials/footer') %>
`;
}

// ---- VIEW: show ----
function showView(e){
  const v=cam(e.name);
  const rows=e.fields.map(f=>`<tr><th style="width:240px;">${f.label}</th><td><%= ${v}.${f.name} ?? '-' %></td></tr>`).join('\n        ');
  return `<%- include('../partials/header') %>
<%- include('../partials/sidebar') %>

<main class="col-md-10 ms-sm-auto px-md-4 py-4">
  <div class="d-flex justify-content-between align-items-center mb-4">
    <h2><i class="${e.icon}"></i> ${e.label} Details</h2>
    <div>
      <a href="/${e.table}/<%= ${v}.id %>/edit" class="btn btn-warning"><i class="bi bi-pencil"></i> Edit</a>
      <a href="/${e.table}" class="btn btn-outline-secondary"><i class="bi bi-arrow-left"></i> Back</a>
    </div>
  </div>
  <%- include('../partials/flash') %>
  <div class="card shadow-sm"><div class="card-body">
    <table class="table table-borderless">
        ${rows}
    </table>
  </div></div>
</main>

<%- include('../partials/footer') %>
`;
}

// ---- WRITE ----
function write(rel, content, force){
  const full=path.join(ROOT, rel);
  if(fs.existsSync(full)&&!force){ console.log(`  skip ${rel}`); return; }
  fs.mkdirSync(path.dirname(full), { recursive:true });
  fs.writeFileSync(full, content);
  console.log(`  + ${rel}`);
}

function generate(e, force){
  console.log(`\n>> ${e.name}`);
  const v=cam(e.name);
  write(`models/${e.name}.js`, model(e), force);
  write(`controllers/${v}Controller.js`, controller(e), force);
  write(`routes/${e.table}Routes.js`, routes(e), force);
  write(`views/${e.table}/index.ejs`, indexView(e), force);
  write(`views/${e.table}/create.ejs`, createView(e), force);
  write(`views/${e.table}/edit.ejs`, editView(e), force);
  write(`views/${e.table}/show.ejs`, showView(e), force);
}

// ---- AUTO-WIRE ----
function wire(entities){
  // models/index.js
  const mi = path.join(ROOT, 'models', 'index.js');
  if(fs.existsSync(mi)){
    let s = fs.readFileSync(mi, 'utf8');
    entities.forEach(e=>{
      const r = `const ${e.name}=require("./${e.name}")(sequelize,DataTypes);`;
      if(!s.includes(r)) s = s.replace(/(\/\/ AUTO-M-START[\s\S]*?)(\n\/\/ AUTO-M-END)/, `$1\n${r}$2`);
      const x = `  ${e.name},`;
      if(!s.includes(x)) s = s.replace(/(\/\/ AUTO-E-START[\s\S]*?)(\n\s*\/\/ AUTO-E-END)/, `$1\n${x}$2`);
    });
    fs.writeFileSync(mi, s);
    console.log('  wired models/index.js');
  }
  // app.js
  const aj = path.join(ROOT, 'app.js');
  if(fs.existsSync(aj)){
    let s = fs.readFileSync(aj, 'utf8');
    entities.forEach(e=>{
      const l = `app.use("/${e.table}",require("./routes/${e.table}Routes"));`;
      if(!s.includes(l)) s = s.replace(/(\/\/ AUTO-R-START[\s\S]*?)(\n\/\/ AUTO-R-END)/, `$1\n${l}$2`);
    });
    fs.writeFileSync(aj, s);
    console.log('  wired app.js');
  }
  // sidebar
  const sb = path.join(ROOT, 'views', 'partials', 'sidebar.ejs');
  if(fs.existsSync(sb)){
    let s = fs.readFileSync(sb, 'utf8');
    entities.forEach(e=>{
      const l = `<li class="nav-item"><a href="/${e.table}" class="nav-link"><i class="bi ${e.icon}"></i> ${e.label}s</a></li>`;
      if(!s.includes(`href="/${e.table}"`)) s = s.replace(/(<!-- AUTO-N-START[\s\S]*?)(\n\s*<!-- AUTO-N-END -->)/, `$1\n${l}$2`);
    });
    fs.writeFileSync(sb, s);
    console.log('  wired sidebar.ejs');
  }
}

// ---- RUN ----
const argv = process.argv.slice(2);
const force = argv.includes('--force');
const names = argv.filter(a=>!a.startsWith('--'));
const registry = require('./entities');
const targets = names.length ? names : Object.keys(registry);
const entities = [];
targets.forEach(n=>{
  if(registry[n]){ generate(registry[n], force); entities.push(registry[n]); }
  else console.log(`Unknown entity: ${n}`);
});
if(entities.length) wire(entities);
console.log('\n✅ Done. Run: npm run dev\n');
