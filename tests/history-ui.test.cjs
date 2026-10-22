const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),C=require('../src/core.js'),H=require('../src/history-store.js');
class Element{
 constructor(){this.listeners={};this.dataset={};this.style={setProperty(){}};this.classList={toggle(){},add(){}};this.checked=true;this.value='';this.innerHTML='';this.textContent='';this.open=false;}
 addEventListener(type,fn){this.listeners[type]=fn;}querySelector(){return null;}querySelectorAll(){return [];}setAttribute(){}closest(){return null;}showModal(){this.open=true;}close(){this.open=false;}
}
async function main(){
 const els=new Map(),files=new Map();let n=0;
 const store=new H.Store({read:async name=>files.get(name)??null,write:async(name,text)=>files.set(name,text),list:async()=>[...files.keys()]},{uuid:()=>`saved-version-${++n}`});
 class ServerHistory{constructor(){this.connected=false;this.label='/home/data/planificadorhalloween';}async initialize(){this.connected=true;}latest(){return store.latest();}list(){return store.list();}save(m){return store.save(m);}restore(id,m){return store.restore(id,m);}}
 const document={querySelector(s){if(s==='dialog[open]')return null;if(!els.has(s))els.set(s,new Element());return els.get(s);},querySelectorAll(){return[];},addEventListener(){}};
 const window={PlannerCore:C,PlannerServerHistory:{ServerHistory},innerWidth:1280,getSelection:()=>({toString:()=>''})};
 const forbidden={getItem(){throw Error('No usar almacenamiento de navegador');},setItem(){throw Error('No usar almacenamiento de navegador');}};
 vm.runInNewContext(fs.readFileSync(require.resolve('../src/app.js'),'utf8'),{window,document,localStorage:forbidden,CSS:{escape:s=>s},structuredClone,console,URL,Blob,setTimeout,Intl,confirm:()=>true});
 await window.HalloweenPlanner.initializeServerHistory();
 const model=C.defaults();C.addProp(model,'pumpkin');window.HalloweenPlanner.setModel(model);
 await els.get('#server-save').onclick();const first=await store.latest();assert.equal(first.model.props.length,1);
 C.addProp(model,'ghost');window.HalloweenPlanner.setModel(model);await els.get('#server-save').onclick();
 els.get('#versions').onclick();await new Promise(resolve=>setTimeout(resolve,0));
 assert.ok(els.get('#versions-list').innerHTML.includes('Restaurar')&&els.get('#versions-list').innerHTML.includes('Actual en servidor'));
 await els.get('#versions-list').listeners.click({target:{closest:()=>({dataset:{restoreVersion:first.id}})}});
 assert.deepEqual(window.HalloweenPlanner.model,first.model);assert.equal((await store.list()).versions.length,4);
 assert.ok(els.get('#feedback').textContent.includes('anterior'));
 assert.equal(els.get('#workspace').inert,false);
 assert.equal(els.get('#server-save').disabled,false);
 assert.equal(typeof els.get('#save').onclick,'function');assert.equal(typeof els.get('#load').onclick,'function');
 assert.equal((await store.latest()).reason,'restore');
 await window.HalloweenPlanner.initializeServerHistory();
 window.HalloweenPlanner.model.props[0].h=1.25;window.HalloweenPlanner.setModel(window.HalloweenPlanner.model);
 assert.ok(els.get('#server-status').textContent.includes('Cambios sin guardar'),'Editar una versión cargada no modifica el estado del último guardado');
 assert.equal((await store.latest()).model.props[0].h,.45,'El JSON en servidor permanece intacto hasta guardar');
 console.log('OK interfaz: guardar, listar, restaurar, conservar descarga/importación y sin localStorage');
}
main().catch(e=>{console.error(e);process.exitCode=1;});
