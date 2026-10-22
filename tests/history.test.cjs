const assert=require('node:assert/strict'),C=require('../src/core.js'),H=require('../src/history-store.js');
async function main(){
 const files=new Map();let counter=0,failCurrent=false;
 const io={read:async name=>files.get(name)??null,list:async()=>[...files.keys()],write:async(name,text)=>{if(name==='actual.json'&&failCurrent)throw Error('Disco no disponible');files.set(name,text);}};
 const store=new H.Store(io,{uuid:()=>`version-${++counter}`,now:()=>new Date(1792692000000+counter)});
 const a=C.defaults();C.addProp(a,'pumpkin');const first=await store.save(a);a.props[0].h=1;
 assert.equal(first.model.props[0].h,.45,'El snapshot no cambia al editar el objeto original');
 const second=await store.save(a);assert.equal((await store.latest()).id,second.id);
 const before=structuredClone(a);C.addProp(before,'ghost');
 const restored=await store.restore(first.id,before);assert.deepEqual(restored.model,first.model);
 let list=await store.list();assert.equal(list.versions.length,4);assert.equal(list.activeId,restored.id);
 const previous=list.versions.find(v=>v.reason==='before-restore');assert.deepEqual(H.parse(files.get(previous.file)).model,before);
 assert.ok(list.versions.some(v=>v.id===first.id)&&list.versions.some(v=>v.id===second.id),'Restaurar conserva las versiones originales');
 const current=files.get('actual.json');failCurrent=true;
 await assert.rejects(store.save(a),/Disco/);assert.equal(files.get('actual.json'),current,'Un fallo al actualizar actual conserva la versión previa');
 assert.equal((await store.list()).versions.length,5,'El snapshot completo sigue recuperable después de un fallo');
 failCurrent=false;await Promise.all([store.save(a),store.save(before)]);
 assert.deepEqual((await store.latest()).model,before,'Guardados simultáneos se serializan sin perder snapshots');
 const bad='historial/2026-10-22_14-00-00-000--invalid-version.json';files.set(bad,'{incomplete');
 list=await store.list();assert.deepEqual(list.invalid,[bad]);assert.equal(list.versions.length,7);
 await assert.rejects(store.restore('../../outside',a),/Identificador/);
 await assert.rejects(store.restore('unknown-version',a),/encontró/);
 assert.ok(H.filename(first).startsWith('historial/2026-10-22_'),'Nombre fechado en Santiago');
 console.log('OK historial: snapshots independientes, restauración reversible, fallos de escritura, concurrencia y archivos dañados');
}
main().catch(e=>{console.error(e);process.exitCode=1;});
