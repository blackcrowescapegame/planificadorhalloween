const path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..','deploy'),{createServer}=require('../deploy/server.cjs');
async function check(){
 const server=createServer({root,directory:path.join(__dirname,'qa','package-check-empty'),localOnly:true});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 try{const base='http://127.0.0.1:'+server.address().port;
  const response=await fetch(base+'/');assert.equal(response.status,200);const html=await response.text();
  assert.ok(html.includes('id="server-save"')&&html.includes('id="versions-dialog"'));
  assert.ok(!html.includes('INLINE_')&&!html.includes('localStorage'));
  const scripts=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];assert.equal(scripts.length,3);
  for(const script of scripts)new vm.Script(script[1]);
  assert.equal((await(await fetch(base+'/api/planner/status')).json()).app,'planificador-halloween');
  assert.equal((await(await fetch(base+'/api/planner/current')).json()).record,null);
  console.log('OK paquete Azure: página real, JavaScript compilable, servidor y API funcionan sin datos empaquetados');
 }finally{await new Promise(resolve=>server.close(resolve));}
}
check().catch(e=>{console.error(e);process.exitCode=1;});
