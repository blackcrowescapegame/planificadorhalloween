const fs=require('fs'),path=require('path');
const base=__dirname,out=path.join(base,'output');fs.mkdirSync(out,{recursive:true});
const core=fs.readFileSync(path.join(base,'src/core.js'),'utf8'),app=fs.readFileSync(path.join(base,'src/app.js'),'utf8');
const html=fs.readFileSync(path.join(base,'src/index.html'),'utf8').replace('/* INLINE_CORE */',core).replace('/* INLINE_APP */',app);
fs.writeFileSync(path.join(out,'Planificador-Halloween.html'),html);
const C=require('./src/core.js'),m=C.defaults();
fs.writeFileSync(path.join(out,'Plano-base.svg'),C.svg(m));fs.writeFileSync(path.join(out,'Modelo-base.obj'),C.obj(m));fs.writeFileSync(path.join(out,'Montaje-base.json'),JSON.stringify(m,null,2));
console.log('Generados: HTML autosuficiente, SVG, OBJ y JSON en '+out);
