// Separate receiver: exposes no operator API or project data. Put behind HTTPS.
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createStore } from './store.js';
import { createGitHubReceiver } from './github-http.js';
const secret=process.env.QR8_GITHUB_WEBHOOK_SECRET;
if(!secret||secret.length<32)throw new Error('Set a strong QR8_GITHUB_WEBHOOK_SECRET (at least 32 characters) through server-side secret settings.');
const filename=process.env.QR8_DB_PATH||resolve(fileURLToPath(new URL('..',import.meta.url)),'.data/qr8.sqlite');
mkdirSync(dirname(filename),{recursive:true,mode:0o700});
const store=createStore(filename);
const server=createGitHubReceiver(store,secret);
server.listen(Number(process.env.QR8_WEBHOOK_PORT||3002),process.env.QR8_WEBHOOK_HOST||'127.0.0.1',()=>console.log(`GitHub-only receiver ready on ${server.address().address}:${server.address().port}. Operator API is not exposed.`));
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>server.close(()=>{store.close();process.exit(0);}));

server.on('error',error=>{console.error(error.message);store.close();process.exit(1);});
