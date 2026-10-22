const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),C=require('../src/core.js');
// Runs the actual UI handlers against a disposable document, never the user's browser data.
class ElementStub{
 constructor(){this.listeners={};this.dataset={};this.style={setProperty(){}};this.classList={toggle(){},add(){}};this.checked=true;this.value='';this.innerHTML='';}
 addEventListener(type,fn){this.listeners[type]=fn;}
 querySelector(){return null;}
 querySelectorAll(){return [];}
 setAttribute(){}
 closest(){return null;}
}
const elements=new Map(),documentHandlers={};
const document={querySelector(selector){if(selector==='dialog[open]')return null;if(!elements.has(selector))elements.set(selector,new ElementStub());return elements.get(selector);},querySelectorAll(){return[];},addEventListener(type,fn){documentHandlers[type]=fn;}};
const window={PlannerCore:C,innerWidth:1280,getSelection:()=>({toString:()=>''})};
const context={window,document,localStorage:{getItem(){return null;},setItem(){}},CSS:{escape:s=>s},structuredClone,console,URL,Blob,setTimeout,confirm:()=>true};
vm.runInNewContext(fs.readFileSync(require.resolve('../src/app.js'),'utf8'),context);
const m=C.defaults(),p=C.addProp(m,'pumpkin');Object.assign(p,{rotation:40,w:.7,lead:1.5});window.HalloweenPlanner.setModel(m);
const selection={dataset:{select:p.id},id:''};elements.get('#panel').listeners.click({target:{closest:()=>selection}});
function keypress(key,target=new ElementStub()){let prevented=false;documentHandlers.keydown({key,ctrlKey:true,metaKey:false,altKey:false,shiftKey:false,repeat:false,target,preventDefault(){prevented=true;}});return prevented;}
assert.ok(keypress('c'));assert.ok(keypress('v'));assert.ok(keypress('v'));assert.equal(window.HalloweenPlanner.model.props.length,3);assert.equal(m.props[1].w,.7);assert.equal(m.props[2].lead,1.5);assert.notEqual(m.props[1].id,m.props[2].id);
const input={closest:()=>({tagName:'INPUT'})};assert.equal(keypress('c',input),false);assert.equal(keypress('v',input),false);assert.equal(m.props.length,3);
// A copied snapshot remains stable when its original is subsequently changed.
p.w=1.4;assert.ok(keypress('v'));assert.equal(m.props[3].w,.7);
console.log('OK Ctrl+C / Ctrl+V: pegado repetido, atributos conservados y campos de texto intactos');
