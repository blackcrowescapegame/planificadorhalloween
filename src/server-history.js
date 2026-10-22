(function(root){
'use strict';
class ServerHistory{
 constructor(){this.connected=false;this.token=null;this.label='';}
 async request(path,method='GET',body=null){
  if(root.location?.protocol==='file:')throw Error('El guardado en servidor requiere abrir la página desde el servidor, en lugar del archivo HTML.');
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),15000);
  try{const response=await root.fetch('/api/planner/'+path,{method,cache:'no-store',headers:body?{'Content-Type':'application/json','X-Planner-Token':this.token}:{},body:body?JSON.stringify(body):undefined,signal:controller.signal});
   let data;try{data=await response.json();}catch(e){throw Error('Este sitio aún no tiene activo el servidor de versiones.');}
   if(!response.ok)throw Error(data.error||'No se pudo acceder al servidor de versiones');return data;
  }catch(e){if(e.name==='AbortError')throw Error('El servidor no respondió. Intenta guardar nuevamente.');if(e instanceof TypeError)throw Error('No se pudo conectar con el servidor. Tu montaje sigue abierto.');throw e;}finally{clearTimeout(timer);}
 }
 async initialize(){this.connected=false;const status=await this.request('status');if(status.app!=='planificador-halloween')throw Error('Servidor de versiones incompatible');this.token=status.token;this.label=status.directory;this.connected=true;}
 async latest(){return(await this.request('current')).record;}
 async list(){return this.request('versions');}
 async save(model){return(await this.request('save','POST',{model})).record;}
 async restore(id,model){return(await this.request('restore','POST',{id,model})).record;}
}
root.PlannerServerHistory={ServerHistory};
})(typeof window!=='undefined'?window:globalThis);
