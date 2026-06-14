const API = "http://localhost:3002/api";

export async function getStats() { const r = await fetch(`${API}/stats`); return r.json(); }
export async function getProjects() { const r = await fetch(`${API}/projects`); return r.json(); }
export async function createProject(d) { const r = await fetch(`${API}/projects`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(d) }); return r.json(); }
export async function updateProject(id, d) { const r = await fetch(`${API}/projects/${id}`, { method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify(d) }); return r.json(); }
export async function deleteProject(id) { await fetch(`${API}/projects/${id}`, { method:"DELETE" }); }
export async function getTasks(pid) { const r = await fetch(`${API}/projects/${pid}/tasks`); return r.json(); }
export async function createTask(d) { const r = await fetch(`${API}/tasks`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(d) }); return r.json(); }
export async function updateTask(id, d) { const r = await fetch(`${API}/tasks/${id}`, { method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify(d) }); return r.json(); }
export async function deleteTask(id) { await fetch(`${API}/tasks/${id}`, { method:"DELETE" }); }
