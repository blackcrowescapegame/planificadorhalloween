const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const C = require('../src/core.js');
const root = path.resolve(__dirname, '..'), out = path.join(root, 'output');
const original = C.validate(JSON.parse(fs.readFileSync(path.join(root, 'montajes/Montaje-original.json'), 'utf8')));
const m = structuredClone(original);
const placements = [
  ['Creper', 6.15, 1.65, 'Personaje de 2 m al fondo derecho, próximo al acceso.'],
  ['Sillón', 6.45, 4.85, 'Escena sentada en el sector derecho, adelantada y separada del Creper.'],
  ['Barril', 7.57, 3.95, 'Centrado en la losa que usas como referencia.'],
  ['Demonio', 3.05, 4.80, 'Personaje adelantado a la izquierda, como el personaje que avanza en la foto.'],
  ['Espantapájaros', 9.00, 3.45, 'Sector exterior derecho, sin tapar el barril ni el sillón.'],
  ['Espantapájaros sentado', 1.60, 3.80, 'Escena lateral izquierda, algo más atrás que el demonio.'],
  ['Calabaza', 2.80, 6.15, 'Acompaña al demonio en primer plano izquierdo.'],
  ['Calabaza copia', 1.25, 7.65, 'Remate bajo en el extremo delantero izquierdo.'],
  ['Calabaza copia copia', 7.00, 7.25, 'Remate bajo delantero derecho para equilibrar ambos lados.']
];
assert.equal(original.props.length, placements.length, 'Revisar el inventario antes de regenerar');
placements.forEach(([name, x, y]) => {
  const matches = m.props.filter(p => p.name === name);
  assert.equal(matches.length, 1, 'Prop único: ' + name);
  Object.assign(matches[0], {x, y});
  if (name.startsWith('Calabaza')) Object.assign(matches[0], {h: .30, type: 'pumpkin'});
});
C.validate(m);
assert.deepEqual(m.site, original.site);
assert.deepEqual(m.source, original.source);
assert.deepEqual(m.routes, original.routes);
assert.deepEqual(m.settings, original.settings);
const bounds = p => {
  const cs = C.corners(p);
  return {min: [Math.min(...cs.map(v=>v.x)),Math.min(...cs.map(v=>v.y)),p.z], max: [Math.max(...cs.map(v=>v.x)),Math.max(...cs.map(v=>v.y)),p.z+p.h]};
};
for (const p of m.props) {
  assert.deepEqual(C.warnings(m,p), [], p.name + ': huella fuera del jardín o sobre el sendero');
  const before = original.props.find(q => q.id === p.id);
  for (const key of Object.keys(before).filter(k => !['x','y','h','type'].includes(k))) assert.deepEqual(p[key],before[key],p.name + ': conservar ' + key);
  if (!p.name.startsWith('Calabaza')) assert.equal(p.h,before.h);
}
for (let i=0;i<m.props.length;i++) for (let j=i+1;j<m.props.length;j++) {
  const a=bounds(m.props[i]),b=bounds(m.props[j]);
  assert.ok(!(a.min[0]<b.max[0]&&a.max[0]>b.min[0]&&a.min[1]<b.max[1]&&a.max[1]>b.min[1]), 'Huellas superpuestas');
}
// Sightline check for the upper body from the middle of the access, 2 m outside the site.
// Only the supplied prop bounding boxes are considered; unmeasured foliage is not modeled.
const eye=[m.site.left+m.site.path/2,m.site.depth+2,1.60];
function rayHits(target, box) {
  let lo=.0001, hi=.9999;
  for(let i=0;i<3;i++) {
    const d=target[i]-eye[i];
    if(Math.abs(d)<1e-9) {if(eye[i]<box.min[i]||eye[i]>box.max[i])return false;continue;}
    const a=(box.min[i]-eye[i])/d,b=(box.max[i]-eye[i])/d;
    lo=Math.max(lo,Math.min(a,b));hi=Math.min(hi,Math.max(a,b));
    if(lo>hi)return false;
  }
  return true;
}
const visibility=m.props.map(p=>({name:p.name,blockedBy:m.props.filter(q=>q.id!==p.id&&rayHits([p.x,p.y,p.z+p.h*.8],bounds(q))).map(q=>q.name)}));
assert.ok(visibility.every(v=>v.blockedBy.length===0),'Revisar visibilidad: '+JSON.stringify(visibility));
fs.mkdirSync(out,{recursive:true});
fs.writeFileSync(path.join(out,'Montaje-ajustado.json'),JSON.stringify(m,null,2));
fs.writeFileSync(path.join(out,'Plano-ajustado.svg'),C.svg(m));
fs.writeFileSync(path.join(out,'Modelo-ajustado.obj'),C.obj(m));
fs.writeFileSync(path.join(root,'work/Montaje-ajustado.mesh.json'),JSON.stringify(C.mesh(m)));
const embedded=JSON.stringify(m).replace(/</g,'\\u003c');
let app=fs.readFileSync(path.join(root,'src/app.js'),'utf8');
app=app.replace('let m=C.defaults()', 'let m=C.validate('+embedded+')').replace('yaw=-25,pitch=48','yaw=-8,pitch=28');
assert.ok(app.includes('let m=C.validate('+embedded+')'));
const html=fs.readFileSync(path.join(root,'src/index.html'),'utf8')
  .replace('/* INLINE_CORE */',fs.readFileSync(path.join(root,'src/core.js'),'utf8')).replace('/* INLINE_SERVER_HISTORY */',fs.readFileSync(path.join(root,'src/server-history.js'),'utf8')).replace('/* INLINE_APP */',app)
  .replace('Tu jardín a escala. Ubica props y mide cada cable.','Propuesta ajustada a tu referencia. Nueve props con sus alturas.')
  .replace('<title>Planificador de Halloween</title>','<title>Montaje ajustado de Halloween</title>')
  .replace('max="180" value="-25"','max="180" value="-8"').replace('max="80" value="48"','max="80" value="28"');
fs.writeFileSync(path.join(out,'Planificador-Montaje-ajustado.html'),html);
const f=n=>n.toFixed(2).replace('.',',');
const notes=`# Montaje ajustado\n\nAbre **Planificador-Montaje-ajustado.html**: la propuesta ya está cargada. En **Volúmenes 3D** puedes girarla y revisar las alturas. En el planificador habitual, usa **Abrir montaje** y selecciona **Montaje-ajustado.json**.\n\nEl diseño adapta la composición de la fotografía a los nueve objetos de tu inventario y al terreno de 10,32 × 8,70 m. Los personajes altos se distribuyen al fondo y en los laterales; las calabazas bajas se reparten en primer plano. El sendero conserva sus 1,25 m libres.\n\n## Posiciones propuestas\n\nX se mide desde la izquierda; Y desde la fachada hacia la calle; Z es la altura de la base. Las coordenadas señalan el centro de cada prop. Todas las unidades son metros.\n\n| N.º | Prop | X | Y | Z | Altura | Criterio |\n|---|---|---:|---:|---:|---:|---|\n`+
m.props.map((p,i)=>`| ${i+1} | ${p.name} | ${f(p.x)} | ${f(p.y)} | ${f(p.z)} | ${f(p.h)} | ${placements.find(a=>a[0]===p.name)[3]} |`).join('\n')+
`\n\n## Datos y comprobaciones\n\n- Las tres calabazas se corrigieron de 1,50 a 0,30 m de alto, según tu confirmación. Se conservaron ancho y fondo de 0,30 m.\n- Las otras alturas son las de tu archivo: Creper 2,00 m; barril 0,90 m; sillón, demonio y espantapájaros 1,50 m. Se mantienen bases Z=0, conectores, cable propio, nombres e identificadores.\n- El barril, con huella de 0,50 × 0,60 m, queda centrado en la losa de 0,50 × 0,50 m y sobresale 0,05 m hacia la casa y hacia la calle. La losa sirve como referencia de colocación; confirma la superficie de apoyo del dispositivo real.\n- Ninguna huella sale del terreno, invade el sendero ni se solapa con otra.\n- La línea hacia el 80 % de la altura de cada prop queda despejada desde el centro del sendero, 2 m fuera del jardín y a 1,60 m de altura. Es una comprobación puntual con volúmenes, no una garantía desde toda la calle. No incluye rejas ni vegetación sin medir.\n- La fachada, palmera y altura de los enchufes siguen pendientes. No se dedujeron alturas de la foto.\n- Tu archivo no contenía cables. La propuesta conserva ese estado; añade conexiones y recorridos reales en Cables.\n- La vista 3D y el OBJ muestran volúmenes a escala. La densidad de decoración, luces y figuras colgantes de la foto requiere elementos que no están en el inventario.\n- El HTML de la propuesta usa un guardado de navegador separado del planificador habitual. **Guardar montaje** permite descargar tus cambios.\n- El original se conserva en **../montajes/Montaje-original.json**.\n`;
fs.writeFileSync(path.join(out,'Notas-del-montaje.md'),notes.replace('El HTML de la propuesta usa un guardado de navegador separado del planificador habitual. **Guardar montaje** permite descargar tus cambios.','El montaje y su historial se guardan en el servidor. **Guardar en servidor** crea versiones fechadas y **Versiones** permite restaurarlas. **Guardar montaje** permite descargar un JSON.'));
fs.writeFileSync(path.join(root,'work/verificacion-montaje-ajustado.json'),JSON.stringify({props:m.props.length,calabazasHeight:.3,footprints:'Sin superposición, sendero libre y dentro del jardín',eye,visibility},null,2));
console.log('Propuesta generada: 9 props; huellas y líneas de visión verificadas.');
module.exports=m;
