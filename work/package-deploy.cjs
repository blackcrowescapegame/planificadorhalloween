const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),dest=path.join(root,'deploy');
for(const name of ['server.cjs','package.json','src/core.js','src/history-store.js','output/Planificador-Halloween.html','output/Planificador-Montaje-ajustado.html','output/Plano-base.svg']){
 const source=path.join(root,name);if(!fs.existsSync(source)){if(name.includes('Montaje-ajustado'))continue;throw Error('Falta archivo de despliegue: '+name);}const target=path.join(dest,name);fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(source,target);
}
console.log('Paquete Node para Azure generado en deploy. Los datos del servidor no se incluyen.');
