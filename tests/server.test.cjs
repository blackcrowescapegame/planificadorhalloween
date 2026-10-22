const assert=require('node:assert/strict'),fs=require('node:fs/promises'),path=require('node:path'),vm=require('node:vm');
const {createServer,dataDirectory}=require('../server.cjs'),C=require('../src/core.js'),H=require('../src/history-store.js');
async function main(){
 const dir=await fs.mkdtemp(path.join(__dirname,'.tmp-versions-'));let server;
 const start=async()=>{server=createServer({directory:dir,localOnly:true});await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));return 'http://127.0.0.1:'+server.address().port;};
 try{
  let base=await start();let token=(await(await fetch(base+'/api/planner/status')).json()).token;
  const call=async(route,body,headers={})=>{const response=await fetch(base+'/api/planner/'+route,{method:body?'POST':'GET',headers:body?{'Content-Type':'application/json','X-Planner-Token':token,...headers}:headers,body:body?JSON.stringify(body):undefined});return {status:response.status,data:await response.json()};};
  assert.equal((await call('current')).data.record,null);
  const a=C.defaults();C.addProp(a,'pumpkin');const one=(await call('save',{model:a})).data.record;
  const b=structuredClone(a);C.addProp(b,'ghost');const two=await call('save',{model:b});assert.equal(two.status,200);
  assert.equal((await call('versions')).data.versions.length,2);
  const unsaved=structuredClone(b);unsaved.props[0].x=9;
  const restored=await call('restore',{id:one.id,model:unsaved});assert.equal(restored.status,200);assert.deepEqual(restored.data.record.model,a);
  let list=(await call('versions')).data;assert.equal(list.versions.length,4);
  const prior=list.versions.find(v=>v.reason==='before-restore');assert.deepEqual(H.parse(await fs.readFile(path.join(dir,prior.file),'utf8')).model,unsaved);
  assert.equal((await call('save',{model:b},{'X-Planner-Token':'wrong'})).status,403);
  assert.equal((await call('save',{model:b},{Origin:'https://other-site.example'})).status,403);
  assert.equal((await call('restore',{id:'../../outside',model:b})).status,400);
  assert.equal((await call('save',{model:{version:999}})).status,400);
  assert.equal((await call('versions')).data.versions.length,4,'Solicitudes rechazadas no escriben archivos');
  await new Promise(resolve=>server.close(resolve));base=await start();token=(await(await fetch(base+'/api/planner/status')).json()).token;
  assert.deepEqual((await call('current')).data.record.model,a,'El montaje sobrevive al reinicio del servidor');
  assert.equal((await call('versions')).data.versions.length,4,'El historial sobrevive al reinicio');
  const clientWindow={location:{protocol:'http:'},fetch:(url,options)=>fetch(base+url,options)};
  vm.runInNewContext(await fs.readFile(path.join(__dirname,'../src/server-history.js'),'utf8'),{window:clientWindow,AbortController,setTimeout,clearTimeout,TypeError});
  const client=new clientWindow.PlannerServerHistory.ServerHistory();await client.initialize();assert.equal(client.connected,true);
  await client.save(b);assert.deepEqual((await client.latest()).model,b);
  await client.restore(one.id,unsaved);assert.deepEqual((await client.latest()).model,a);assert.equal((await client.list()).versions.length,7);
  assert.equal((await fetch(base+'/%2e%2e%2fserver.cjs')).status,404);
  assert.equal(dataDirectory('repo',{WEBSITE_INSTANCE_ID:'azure',HOME:'/home'}),path.join('/home','data','planificadorhalloween'));
  console.log('OK servidor y cliente HTTP: JSON reales, guardado/restauración, reinicio, solicitudes rechazadas y directorio persistente Azure');
 }finally{if(server?.listening)await new Promise(resolve=>server.close(resolve));assert.ok(dir.startsWith(path.join(__dirname,'.tmp-versions-')));await fs.rm(dir,{recursive:true,force:true});}
}
main().catch(e=>{console.error(e);process.exitCode=1;});
