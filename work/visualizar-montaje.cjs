const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const C=require('../src/core.js');
const root=path.resolve(__dirname,'..'),out=path.join(root,'output');
const html=fs.readFileSync(path.join(out,'Planificador-Montaje-ajustado.html'),'utf8');
const app=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].at(-1)[1];
class Element {
 constructor(){this.listeners={};this.dataset={};this.style={setProperty(){}};this.classList={toggle(){},add(){}};this.checked=true;this.value='';this.innerHTML='';}
 addEventListener(type,fn){this.listeners[type]=fn;}
 querySelector(){return null;}
 querySelectorAll(){return [];}
 setAttribute(){}
 closest(){return null;}
}
const els=new Map();
const document={querySelector(s){if(s==='dialog[open]')return null;if(!els.has(s))els.set(s,new Element());return els.get(s);},querySelectorAll(){return[];},addEventListener(){}};
const window={PlannerCore:C,innerWidth:1280,getSelection:()=>({toString:()=>''})};
const writes=[],reads=[];
vm.runInNewContext(app,{window,document,localStorage:{getItem(key){reads.push(key);return null;},setItem(...args){writes.push(args);}},CSS:{escape:s=>s},structuredClone,console,URL,Blob,setTimeout,confirm:()=>true});
assert.deepEqual(reads,[]);
assert.deepEqual(writes,[]);
assert.equal(window.HalloweenPlanner.model.props.length,9);
assert.equal(window.HalloweenPlanner.model.props.filter(p=>p.name.startsWith('Calabaza')).every(p=>p.h===.3),true);
for (const p of window.HalloweenPlanner.model.props) {
 const object=C.mesh(window.HalloweenPlanner.model).find(o=>o.name===p.name);
 assert.equal(Math.max(...object.vertices.map(v=>v[1])),p.z+p.h);
}
const plan=els.get('#canvas').innerHTML;
els.get('#view-three').onclick();
els.get('#yaw').oninput({target:{value:-8}});
els.get('#pitch').oninput({target:{value:28}});
const three=els.get('#canvas').innerHTML;
assert.ok(three.includes('Modelo 3D de volúmenes'));
assert.ok(three.includes('Creper')&&three.includes('Sillón'));
fs.writeFileSync(path.join(out,'Vista-3D-ajustada.svg'),three);
const embed=(svg,x,y,w,h)=>svg.replace('<svg ',`<svg x="${x}" y="${y}" `).replace(/width="[^"]*"/,'width="'+w+'"').replace(/height="[^"]*"/,'height="'+h+'"');
// The app's 3D SVG has no size attributes, so add them explicitly to the nested viewport.
const threeEmbedded=three.replace('<svg ', '<svg x="845" y="150" width="860" height="610" ');
const t=(x,y,text,opts='')=>`<text x="${x}" y="${y}" ${opts}>${C.esc(text)}</text>`;
let overview=`<svg xmlns="http://www.w3.org/2000/svg" width="1760" height="1190" viewBox="0 0 1760 1190"><style>text{font:18px Arial,sans-serif;fill:#252a2c}.muted{fill:#596365}.label{font-size:22px}.title{font-size:32px}.mono{font-family:Consolas,monospace}</style><rect width="100%" height="100%" fill="#fafafa"/>`;
overview+=t(40,48,'Montaje ajustado de Halloween','class="title"')+t(40,83,'Nueve props del inventario · Terreno de 10,32 × 8,70 m · Medidas en metros','class="muted"');
overview+=t(40,126,'Planta: casa arriba, calle abajo','class="label"')+t(860,126,'Volúmenes 3D desde el lado de la calle','class="label"');
overview+=embed(plan,30,150,790,650)+threeEmbedded;
overview+=t(870,784,'Calabazas: 0,30 m · Creper: 2,00 m · Barril: 0,90 m','class="muted"');
overview+='<path d="M40 830H1720" stroke="#c9ced0"/>';
overview+=t(40,865,'Ubicación y altura de cada objeto','class="label"');
const m=window.HalloweenPlanner.model;
m.props.forEach((p,i)=>{
 const col=i<5?0:1,row=i<5?i:i-5,x=40+col*880,y=905+row*43;
 overview+=`<rect x="${x}" y="${y-16}" width="13" height="13" fill="${p.color}"/>`;
 overview+=t(x+25,y,p.name)+t(x+445,y,`X ${p.x.toFixed(2)}  Y ${p.y.toFixed(2)}  h ${p.h.toFixed(2)} m`,'class="mono"');
});
overview+=t(40,1150,'Sendero libre: 1,25 m. La palmera y la fachada conservan su altura pendiente.','class="muted"');
overview+='</svg>';
fs.writeFileSync(path.join(out,'Vista-montaje-ajustado.svg'),overview);
const packageRoot=process.env.CODEX_NODE_MODULES;
const sharp=require(require.resolve('sharp',{paths:packageRoot?[packageRoot]:[root]}));
sharp(Buffer.from(overview)).png().toFile(path.join(out,'Vista-montaje-ajustado.png')).then(()=>console.log('PNG generado a partir de los SVG reales del planificador; nueve props y altura de calabazas comprobados.'));
