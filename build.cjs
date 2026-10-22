const fs=require('fs'),path=require('path');
const base=__dirname,out=path.join(base,'output');fs.mkdirSync(out,{recursive:true});
const core=fs.readFileSync(path.join(base,'src/core.js'),'utf8'),app=fs.readFileSync(path.join(base,'src/app.js'),'utf8');
const html=fs.readFileSync(path.join(base,'src/index.html'),'utf8').replace('/* INLINE_CORE */',core).replace('/* INLINE_SERVER_HISTORY */',fs.readFileSync(path.join(base,'src/server-history.js'),'utf8')).replace('/* INLINE_APP */',app);
fs.writeFileSync(path.join(out,'Planificador-Halloween.html'),html);
const C=require('./src/core.js'),m=C.defaults();
fs.writeFileSync(path.join(out,'Plano-base.svg'),C.svg(m));fs.writeFileSync(path.join(out,'Modelo-base.obj'),C.obj(m));fs.writeFileSync(path.join(out,'Montaje-base.json'),JSON.stringify(m,null,2));
console.log('Generados: HTML autosuficiente, SVG, OBJ y JSON en '+out);
if(fs.existsSync(path.join(out,'Montaje-ajustado.json'))){const proposal=C.validate(JSON.parse(fs.readFileSync(path.join(out,'Montaje-ajustado.json'),'utf8')));const embedded=JSON.stringify(proposal).replace(/</g,'\\u003c');const proposalApp=app.replace('let m=C.defaults()', 'let m=C.validate('+embedded+')').replace('yaw=-25,pitch=48','yaw=-8,pitch=28');const proposalHtml=fs.readFileSync(path.join(base,'src/index.html'),'utf8').replace('/* INLINE_CORE */',core).replace('/* INLINE_SERVER_HISTORY */',fs.readFileSync(path.join(base,'src/server-history.js'),'utf8')).replace('/* INLINE_APP */',proposalApp).replace('Tu jardín a escala. Ubica props y mide cada cable.','Propuesta ajustada a tu referencia. Nueve props con sus alturas.');fs.writeFileSync(path.join(out,'Planificador-Montaje-ajustado.html'),proposalHtml);console.log('Actualizado: planificador con propuesta precargada.');}
