export const isStaticPreview = import.meta.env.MODE === 'pages';

export async function request(path, { signal, method = 'GET', body } = {}) {
  if (isStaticPreview) {
    if (method !== 'GET') throw new Error('This published preview is read-only. Saving requires the backend-enabled workspace.');
    const response = await fetch(`${import.meta.env.BASE_URL}preview/workspace.json`, { signal });
    if (!response.ok) throw new Error('The published workspace snapshot could not be loaded.');
    const snapshot = await response.json();
    if (path === '/projects') return { projects: [snapshot.project] };
    if (path === `/projects/${snapshot.project.id}/snapshot`) return snapshot;
    throw new Error('This project is not included in the published preview.');
  }
  let response;
  try { response = await fetch(`/api${path}`, { method, signal, headers: body ? { 'Content-Type':'application/json' } : {}, body: body ? JSON.stringify(body) : undefined }); }
  catch (error) { if(error.name==='AbortError')throw error;throw new Error('The workspace service is unavailable. Check the connection and retry.'); }
  const type=response.headers.get('content-type') || '';
  if(!type.includes('application/json'))throw new Error('The workspace service is not connected. This app needs its backend; static hosting alone cannot save project data.');
  const result=await response.json();
  if(!response.ok)throw new Error(result.error || 'The request could not be completed.');
  return result;
}
