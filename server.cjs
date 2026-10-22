const http=require('node:http'),fs=require('node:fs/promises'),path=require('node:path'),crypto=require('node:crypto');
const H=require('./src/history-store.js');
function fileIO(directory){
 const resolve=name=>{if(name!=='actual.json'&&!H.FILE.test(name))throw Error('Ruta de guardado inválida');return path.join(directory,...name.split('/'));};
 return {
  async read(name){try{const file=resolve(name);if((await fs.stat(file)).size>H.MAX_BYTES)throw Error('La versión supera 3 MB');return await fs.readFile(file,'utf8');}catch(e){if(e.code==='ENOENT')return null;throw e;}},
  async write(name,text){const file=resolve(name);await fs.mkdir(path.dirname(file),{recursive:true});const temp=file+'.'+crypto.randomUUID()+'.tmp';let fh;try{fh=await fs.open(temp,'wx');await fh.writeFile(text,'utf8');await fh.sync();await fh.close();fh=null;await fs.rename(temp,file);}finally{if(fh)await fh.close();await fs.unlink(temp).catch(e=>{if(e.code!=='ENOENT')throw e;});}},
  async list(){try{return(await fs.readdir(path.join(directory,'historial'))).map(n=>'historial/'+n);}catch(e){if(e.code==='ENOENT')return[];throw e;}}
 };
}
function dataDirectory(root,env=process.env){return env.PLANNER_DATA_DIR||(env.WEBSITE_INSTANCE_ID?path.join(env.HOME||'/home','data','planificadorhalloween'):path.join(root,'montajes','guardado-servidor'));}
function createServer({root=__dirname,directory=dataDirectory(root),localOnly=!process.env.WEBSITE_INSTANCE_ID}={}){
 const token=crypto.randomUUID(),store=new H.Store(fileIO(directory),{uuid:()=>crypto.randomUUID()});
 const send=(res,status,data)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(data));};
 const server=http.createServer(async(req,res)=>{try{
  const host='127.0.0.1:'+server.address().port;
  if(localOnly&&req.headers.host!==host&&req.headers.host!=='localhost:'+server.address().port){send(res,403,{error:'Host local inválido'});return;}
  const url=new URL(req.url,'http://'+host);
  if(url.pathname.startsWith('/api/planner/')){
   const allowedOrigins=new Set(['http://'+req.headers.host,'https://'+req.headers.host]);
   if(req.headers.origin&&!allowedOrigins.has(req.headers.origin)){send(res,403,{error:'Origen no permitido'});return;}
   const route=url.pathname.slice('/api/planner/'.length);
   if(req.method==='GET'&&route==='status'){send(res,200,{app:'planificador-halloween',token,directory});return;}
   if(req.method==='GET'&&route==='current'){send(res,200,{record:await store.latest()});return;}
   if(req.method==='GET'&&route==='versions'){send(res,200,await store.list());return;}
   if(req.method!=='POST'||!['save','restore'].includes(route)){send(res,404,{error:'Operación no encontrada'});return;}
   if(req.headers['x-planner-token']!==token){send(res,403,{error:'Recarga la página local antes de guardar'});return;}
   if(!String(req.headers['content-type']).startsWith('application/json')){send(res,415,{error:'Se requiere un montaje JSON'});return;}
   let size=0;const chunks=[];for await(const chunk of req){size+=chunk.length;if(size>H.MAX_BYTES){send(res,413,{error:'El montaje supera 3 MB'});req.resume();return;}chunks.push(chunk);}
   const body=JSON.parse(Buffer.concat(chunks).toString('utf8'));
   const record=route==='save'?await store.save(body.model):await store.restore(body.id,body.model);
   send(res,200,{record});return;
  }
  if(req.method!=='GET'&&req.method!=='HEAD'){send(res,405,{error:'Método no permitido'});return;}
  const proposal=path.join(root,'output','Planificador-Montaje-ajustado.html');
  const defaultPage=await fs.access(proposal).then(()=>'/Planificador-Montaje-ajustado.html',()=>'/Planificador-Halloween.html');
  const route=url.pathname==='/'||url.pathname==='/index.html'?defaultPage:decodeURIComponent(url.pathname);
  const output=path.join(root,'output'),file=path.resolve(output,'.'+route);
  if(!file.startsWith(output+path.sep)||!['.html','.svg','.png','.obj','.md','.json','.zip'].includes(path.extname(file))){send(res,404,{error:'Archivo no encontrado'});return;}
  const bytes=await fs.readFile(file);const types={'.html':'text/html; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.json':'application/json; charset=utf-8','.md':'text/plain; charset=utf-8'};
  res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(req.method==='HEAD'?undefined:bytes);
 }catch(e){send(res,e.code==='ENOENT'?404:400,{error:e.code==='ENOENT'?'Archivo no encontrado':e.message});}});
 server.requestTimeout=15000;server.headersTimeout=10000;return server;
}
if(require.main===module){
 const port=Number(process.env.PORT||process.env.PLANNER_PORT)||8768;
 const server=createServer();
 function open(){if(!process.argv.includes('--open'))return;const url='http://127.0.0.1:'+port+'/';const {spawn}=require('node:child_process');if(process.platform==='win32'){spawn('cmd.exe',['/c','start','',url],{windowsHide:true,stdio:'ignore'}).unref();}else console.log(url);}
 server.listen(port,process.env.WEBSITE_INSTANCE_ID?'0.0.0.0':'127.0.0.1',()=>{console.log('Planificador iniciado. Los montajes se guardan en '+dataDirectory(__dirname));open();});
 server.on('error',async e=>{if(e.code==='EADDRINUSE'){try{const r=await fetch('http://127.0.0.1:'+port+'/api/planner/status',{signal:AbortSignal.timeout(3000)});if((await r.json()).app==='planificador-halloween'){open();return;}}catch(_){}console.error('El puerto '+port+' está ocupado por otra aplicación.');}else console.error(e.message);process.exitCode=1;});
}
module.exports={createServer,fileIO,dataDirectory};
