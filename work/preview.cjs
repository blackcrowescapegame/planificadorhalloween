const http=require('http'),fs=require('fs'),path=require('path');
const root=process.argv[2]?path.resolve(process.argv[2]):path.resolve(__dirname,'../output');
const port=Number(process.argv[3])||8765;
http.createServer((req,res)=>{const name=decodeURIComponent((req.url||'/').split('?')[0]);const file=path.resolve(root,'.'+(name==='/'?'/Planificador-Halloween.html':name));if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}fs.readFile(file,(e,b)=>{if(e){res.writeHead(404);res.end('No encontrado');return;}res.setHeader('Content-Type',file.endsWith('.html')?'text/html; charset=utf-8':file.endsWith('.svg')?'image/svg+xml':'application/octet-stream');res.end(b);});}).listen(port,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:'+port+'/'));
