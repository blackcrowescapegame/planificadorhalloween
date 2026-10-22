(function(root){
'use strict';
const C=typeof module!=='undefined'?require('./core.js'):root.PlannerCore;
const FORMAT='halloween-planner-snapshot-v1', MAX_BYTES=3e6;
const ID=/^[a-z0-9-]{8,80}$/i, FILE=/^historial\/[0-9_-]+--[a-z0-9-]+\.json$/i;
function cloneModel(model){return C.validate(structuredClone(model));}
function validateRecord(r){
 if(!r||r.format!==FORMAT||!ID.test(r.id)||typeof r.savedAt!=='string'||!Number.isFinite(Date.parse(r.savedAt))||r.timeZone!=='America/Santiago'||!['save','before-restore','restore'].includes(r.reason))throw Error('Versión de servidor inválida');
 cloneModel(r.model);return r;
}
function parse(text){if(new TextEncoder().encode(text).length>MAX_BYTES)throw Error('La versión supera 3 MB');return validateRecord(JSON.parse(text));}
function filename(r){const parts=new Intl.DateTimeFormat('en-CA',{timeZone:r.timeZone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).formatToParts(new Date(r.savedAt));const p=Object.fromEntries(parts.map(p=>[p.type,p.value]));return `historial/${p.year}-${p.month}-${p.day}_${p.hour}-${p.minute}-${p.second}-${r.savedAt.slice(20,23)}--${r.id}.json`;}
function summary(r,file){return {id:r.id,savedAt:r.savedAt,timeZone:r.timeZone,reason:r.reason,restoredFrom:r.restoredFrom,props:r.model.props.length,cables:r.model.routes.length,file};}
class Store{
 constructor(io,options={}){this.io=io;this.now=options.now||(()=>new Date());this.uuid=options.uuid||(()=>root.crypto.randomUUID());this.queue=Promise.resolve();}
 serial(fn){const next=this.queue.then(fn);this.queue=next.catch(()=>{});return next;}
 async latest(){const text=await this.io.read('actual.json');return text==null?null:parse(text);}
 async list(){const files=(await this.io.list()).filter(f=>FILE.test(f));const versions=[],invalid=[];
  for(const file of files){try{const r=parse(await this.io.read(file));versions.push(summary(r,file));}catch(e){invalid.push(file);}}
  versions.sort((a,b)=>Date.parse(b.savedAt)-Date.parse(a.savedAt)||b.id.localeCompare(a.id));
  let latest=null,currentError=null;try{latest=await this.latest();}catch(e){currentError=e.message;}
  return {versions,invalid,currentError,activeId:latest?.id||null};
 }
 async writeSnapshot(model,reason,restoredFrom=null){
  const r={format:FORMAT,id:this.uuid(),savedAt:this.now().toISOString(),timeZone:'America/Santiago',reason,restoredFrom,model:cloneModel(model)};
  validateRecord(r);const text=JSON.stringify(r,null,2);
  if(new TextEncoder().encode(text).length>MAX_BYTES)throw Error('El montaje supera 3 MB');
  const file=filename(r);if(await this.io.read(file)!=null)throw Error('Ya existe una versión con ese identificador');
  await this.io.write(file,text); // Immutable snapshot is committed before changing the current version.
  await this.io.write('actual.json',text);return r;
 }
 save(model){const snapshot=cloneModel(model);return this.serial(()=>this.writeSnapshot(snapshot,'save'));}
 restore(id,currentModel){if(!ID.test(id))return Promise.reject(Error('Identificador de versión inválido'));const before=cloneModel(currentModel);
  return this.serial(async()=>{const data=await this.list(),v=data.versions.find(v=>v.id===id);if(!v)throw Error('No se encontró esa versión');
   const old=parse(await this.io.read(v.file));
   await this.writeSnapshot(before,'before-restore',id);
   return this.writeSnapshot(old.model,'restore',id);
  });
 }
}
const api={FORMAT,MAX_BYTES,FILE,parse,validateRecord,cloneModel,filename,Store};
if(typeof module!=='undefined')module.exports=api;root.PlannerHistory=api;
})(typeof window!=='undefined'?window:globalThis);
