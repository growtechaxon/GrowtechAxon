const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const zlib = require('zlib');

const ROOT = __dirname;
const IS_RENDER = Boolean(process.env.RENDER || process.env.RENDER_SERVICE_ID);
const FRONTEND = path.join(ROOT, 'frontend');
const BACKEND_ENV = path.join(ROOT, 'backend', '.env');
const FRONT_PORT = Number(process.env.FRONTEND_PORT || 5173);
const API_PORT = Number(process.env.PORT || 5000);
const API_URL = `http://localhost:${API_PORT}`;

const mime = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.xml':'application/xml; charset=utf-8','.txt':'text/plain; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.ico':'image/x-icon'};

function safePath(urlPath){
  const decoded = decodeURIComponent(urlPath.split('?')[0]);
  const candidate = path.resolve(FRONTEND, '.' + path.sep + decoded.replace(/^[/\\]+/, ''));
  const relative = path.relative(FRONTEND, candidate);
  if (relative.startsWith('..') || path.isAbsolute(relative)) return null;
  return candidate;
}
function resolveFile(urlPath){
  let file = safePath(urlPath || '/');
  if (!file) return null;
  if (urlPath === '/' || urlPath.endsWith('/')) {
    file = path.join(file, 'index.html');
    // The admin panel intentionally uses login.html as its entry page.
    if (!fs.existsSync(file) && (urlPath === '/admin/' || urlPath === '/admin')) {
      file = path.join(FRONTEND, 'admin', 'login.html');
    }
  }
  if (fs.existsSync(file) && fs.statSync(file).isFile()) return file;
  if (!path.extname(file) && fs.existsSync(`${file}.html`)) return `${file}.html`;
  return null;
}
const frontendServer = http.createServer((req,res)=>{
  // Same-origin API proxy lets the existing website and backend share one Render Web Service/domain.
  if ((req.url || '').startsWith('/api/')) {
    const proxyReq = http.request({hostname:'127.0.0.1',port:API_PORT,path:req.url,method:req.method,headers:{...req.headers,host:`127.0.0.1:${API_PORT}`}}, proxyRes => {
      res.writeHead(proxyRes.statusCode || 502, proxyRes.headers); proxyRes.pipe(res);
    });
    proxyReq.on('error',()=>{if(!res.headersSent){res.writeHead(502,{'Content-Type':'application/json'});}res.end(JSON.stringify({success:false,message:'API service temporarily unavailable.'}));});
    req.pipe(proxyReq); return;
  }
  if ((req.url || '').split('?')[0] === '/favicon.ico') {
    const icon = path.join(FRONTEND, 'assets', 'images', 'logo.jpeg');
    if (fs.existsSync(icon)) {
      const data = fs.readFileSync(icon);
      res.writeHead(200, {'Content-Type':'image/jpeg','Cache-Control':'public, max-age=86400'});
      return res.end(data);
    }
  }
  const file = resolveFile(req.url);
  if (!file) { res.writeHead(404, {'Content-Type':'text/plain; charset=utf-8'}); return res.end('Not found'); }
  const ext = path.extname(file).toLowerCase();
  const type = mime[ext] || 'application/octet-stream';
  const data = fs.readFileSync(file);
  const accept = String(req.headers['accept-encoding'] || '');
  const headers = {'Content-Type':type,'X-Content-Type-Options':'nosniff','Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=86400'};
  if (accept.includes('gzip') && data.length > 1024 && !type.startsWith('image/')) {
    headers['Content-Encoding']='gzip';
    res.writeHead(200,headers); return zlib.gzip(data,(e,b)=>res.end(e?data:b));
  }
  res.writeHead(200,headers); res.end(data);
});

const child = spawn(process.execPath,[path.join(ROOT,'backend','api-server.js')],{cwd:path.join(ROOT,'backend'),env:{...process.env,PORT:String(API_PORT),FRONTEND_ORIGIN:process.env.FRONTEND_ORIGIN|| (IS_RENDER ? 'https://growtechaxon.in,https://www.growtechaxon.in' : `http://localhost:${FRONT_PORT}`),DOTENV_CONFIG_PATH:BACKEND_ENV},stdio:'inherit'});
child.on('error',e=>console.error('[API] failed to start:',e.message));
child.on('exit',(code,signal)=>{ if(!shuttingDown) console.error(`[API] stopped (${code ?? signal})`); });

let shuttingDown=false;
function shutdown(signal){
  shuttingDown=true;
  console.log(`\nGrowtechAxon: shutting down (${signal})`);
  frontendServer.close(()=>child.kill('SIGTERM'));
  setTimeout(()=>process.exit(0),3000).unref();
}
process.on('SIGINT',()=>shutdown('SIGINT'));
process.on('SIGTERM',()=>shutdown('SIGTERM'));

frontendServer.listen(FRONT_PORT,()=>{
  console.log('\nGrowtechAxon Development Server');
  console.log(`✓ Website:  http://localhost:${FRONT_PORT}`);
  console.log(`✓ Admin:    http://localhost:${FRONT_PORT}/admin/`);
  console.log(`✓ Backend:  ${API_URL}`);
  console.log(`✓ API:      ${API_URL}/api`);
  console.log('');
});
