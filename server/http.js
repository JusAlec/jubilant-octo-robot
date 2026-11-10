import { createServer } from 'node:http';
import { AppError } from './store.js';

async function body(req) {
  if (!req.headers['content-type']?.startsWith('application/json')) throw new AppError(415,'Use application/json.');
  let data='';
  for await (const chunk of req) { data+=chunk; if (Buffer.byteLength(data)>32768) throw new AppError(413,'Request too large.'); }
  try { const parsed=JSON.parse(data); if (!parsed || Array.isArray(parsed) || typeof parsed!=='object') throw Error(); return parsed; } catch { throw new AppError(400,'Invalid JSON object.'); }
}
export function createApi(store, { allowedOrigins = ['http://127.0.0.1:5173','http://localhost:5173','http://127.0.0.1:4173','http://localhost:4173'] } = {}) {
  return createServer(async(req,res) => {
    res.setHeader('Content-Type','application/json; charset=utf-8');
    res.setHeader('Cache-Control','no-store');
    res.setHeader('X-Content-Type-Options','nosniff');
    res.setHeader('Content-Security-Policy',"default-src 'none'; frame-ancestors 'none'");
    function send(code,value) { res.writeHead(code); res.end(JSON.stringify(value)); }
    try {
      // Local single-operator API: fail closed on foreign Origin and Host, including DNS rebinding.
      if (!/^((localhost|127\.0\.0\.1)(:\d+)?|\[::1\](:\d+)?)$/.test(req.headers.host || '')) throw new AppError(403,'Local workspace access only.');
      const origin = req.headers.origin;
      if (origin && !allowedOrigins.includes(origin)) throw new AppError(403,'Origin is not allowed.');
      if (req.headers['sec-fetch-site']==='cross-site') throw new AppError(403,'Cross-site access is not allowed.');
      if (!['GET','POST','PATCH'].includes(req.method)) throw new AppError(405,'Method not allowed.');
      const path = new URL(req.url,'http://localhost').pathname;
      if (path==='/api/health' && req.method==='GET') return send(200,{status:'ok',mode:'local-single-operator',storage:'sqlite'});
      if (path==='/api/projects') {
        if(req.method==='GET') return send(200,{projects:store.listProjects()});
        if(req.method==='POST') return send(201,store.createProject(await body(req)));
      }
      const match=path.match(/^\/api\/projects\/([a-zA-Z0-9-]+)(?:\/(snapshot|tasks|artifacts|tickets)(?:\/([a-zA-Z0-9-]+))?)?$/);
      if (!match) throw new AppError(404,'Endpoint not found.');
      const [,projectId,resource,id]=match;
      if(resource==='snapshot' && !id && req.method==='GET') return send(200,store.snapshot(projectId));
      if(resource==='tasks' && !id && req.method==='POST') return send(201,store.createTask(projectId,await body(req)));
      if(resource==='tasks' && id && req.method==='PATCH') return send(200,store.updateTask(projectId,id,await body(req)));
      if(resource==='artifacts' && !id && req.method==='POST') return send(201,store.createArtifact(projectId,await body(req)));
      if(resource==='tickets' && !id && req.method==='POST') return send(201,store.createTicket(projectId,await body(req)));
      throw new AppError(404,'Endpoint not found.');
    } catch(error) {
      if (!(error instanceof AppError)) console.error('API request failed:',error.message);
      send(error.status || 500,{error:error.status ? error.message : 'The workspace could not save this request. Try again.'});
    }
  });
}
