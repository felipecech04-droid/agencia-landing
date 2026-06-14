import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3001;

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

const db = new Database(join(__dirname, 'crm.db'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

function seed() {
  const leadCount = db.prepare('SELECT COUNT(*) as c FROM leads').get().c;
  if (leadCount > 0) return;

  const insertLead = db.prepare(
    'INSERT INTO leads (name, email, phone, company, status) VALUES (?, ?, ?, ?, ?)'
  );
  const insertDeal = db.prepare(
    'INSERT INTO deals (lead_id, title, value, stage) VALUES (?, ?, ?, ?)'
  );
  const insertTask = db.prepare(
    'INSERT INTO tasks (lead_id, description, due_date, completed) VALUES (?, ?, ?, ?)'
  );

  const leads = [
    ['Carlos Mendoza', 'carlos@techcorp.com', '555-0101', 'TechCorp', 'qualified'],
    ['Ana Torres', 'ana@innovate.io', '555-0102', 'Innovate.io', 'contacted'],
    ['Luis Rivera', 'luis@buildpro.net', '555-0103', 'BuildPro', 'new'],
    ['Sofia García', 'sofia@datalabs.com', '555-0104', 'DataLabs', 'won'],
    ['Miguel Ángel', 'miguel@cloud9.dev', '555-0105', 'Cloud9 Dev', 'lost'],
    ['Elena Ruiz', 'elena@nexus.com', '555-0106', 'Nexus Solutions', 'qualified'],
    ['Diego Castro', 'diego@fusion.mx', '555-0107', 'Fusion MX', 'contacted'],
    ['Valeria Ortiz', 'valeria@alpha.io', '555-0108', 'Alpha Digital', 'new'],
  ];

  const deals = [
    [1, 'ERP Implementation', 45000, 'negotiation'],
    [1, 'Cloud Migration', 28000, 'prospecting'],
    [2, 'Mobile App Dev', 32000, 'negotiation'],
    [3, 'Website Redesign', 12000, 'prospecting'],
    [4, 'Data Analytics Suite', 55000, 'closed_won'],
    [5, 'DevOps Consulting', 18000, 'closed_lost'],
    [6, 'Cybersecurity Audit', 22000, 'prospecting'],
    [7, 'CRM Integration', 15000, 'negotiation'],
  ];

  const tasks = [
    [1, 'Schedule demo with Carlos', '2026-06-20', 0],
    [1, 'Send proposal document', '2026-06-18', 1],
    [2, 'Follow up on pricing', '2026-06-22', 0],
    [3, 'Initial discovery call', '2026-06-19', 0],
    [4, 'Contract signing', '2026-06-15', 1],
    [6, 'Prepare security questionnaire', '2026-06-25', 0],
    [7, 'Technical requirements meeting', '2026-06-21', 0],
  ];

  const transaction = db.transaction(() => {
    for (const l of leads) insertLead.run(...l);
    for (const d of deals) insertDeal.run(...d);
    for (const t of tasks) insertTask.run(...t);
  });
  transaction();
}

db.exec(`
  CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    status TEXT NOT NULL DEFAULT 'new' CHECK(status IN ('new','contacted','qualified','lost','won')),
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS deals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lead_id INTEGER NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    value REAL NOT NULL DEFAULT 0,
    stage TEXT NOT NULL DEFAULT 'prospecting' CHECK(stage IN ('prospecting','negotiation','closed_won','closed_lost')),
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lead_id INTEGER REFERENCES leads(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    due_date TEXT,
    completed INTEGER NOT NULL DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );
`);

seed();

app.get('/api/leads', (req, res) => {
  const leads = db.prepare('SELECT * FROM leads ORDER BY created_at DESC').all();
  res.json(leads);
});

app.post('/api/leads', (req, res) => {
  const { name, email, phone, company, status } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'Name and email are required' });
  const result = db.prepare(
    'INSERT INTO leads (name, email, phone, company, status) VALUES (?, ?, ?, ?, ?)'
  ).run(name, email, phone || null, company || null, status || 'new');
  const lead = db.prepare('SELECT * FROM leads WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(lead);
});

app.put('/api/leads/:id', (req, res) => {
  const { name, email, phone, company, status } = req.body;
  const existing = db.prepare('SELECT * FROM leads WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Lead not found' });
  db.prepare(
    'UPDATE leads SET name=?, email=?, phone=?, company=?, status=?, updated_at=datetime(\'now\') WHERE id=?'
  ).run(
    name || existing.name,
    email || existing.email,
    phone !== undefined ? phone : existing.phone,
    company !== undefined ? company : existing.company,
    status || existing.status,
    req.params.id
  );
  const lead = db.prepare('SELECT * FROM leads WHERE id = ?').get(req.params.id);
  res.json(lead);
});

app.delete('/api/leads/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM leads WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Lead not found' });
  db.prepare('DELETE FROM leads WHERE id = ?').run(req.params.id);
  res.status(204).send();
});

app.get('/api/deals', (req, res) => {
  const deals = db.prepare(`
    SELECT d.*, l.name as lead_name, l.company as lead_company
    FROM deals d JOIN leads l ON d.lead_id = l.id
    ORDER BY d.created_at DESC
  `).all();
  res.json(deals);
});

app.post('/api/deals', (req, res) => {
  const { lead_id, title, value, stage } = req.body;
  if (!lead_id || !title) return res.status(400).json({ error: 'Lead ID and title are required' });
  const lead = db.prepare('SELECT * FROM leads WHERE id = ?').get(lead_id);
  if (!lead) return res.status(404).json({ error: 'Lead not found' });
  const result = db.prepare(
    'INSERT INTO deals (lead_id, title, value, stage) VALUES (?, ?, ?, ?)'
  ).run(lead_id, title, value || 0, stage || 'prospecting');
  const deal = db.prepare(`
    SELECT d.*, l.name as lead_name, l.company as lead_company
    FROM deals d JOIN leads l ON d.lead_id = l.id WHERE d.id = ?
  `).get(result.lastInsertRowid);
  res.status(201).json(deal);
});

app.put('/api/deals/:id', (req, res) => {
  const { title, value, stage } = req.body;
  const existing = db.prepare('SELECT * FROM deals WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Deal not found' });
  const validStages = ['prospecting', 'negotiation', 'closed_won', 'closed_lost'];
  if (stage && !validStages.includes(stage)) {
    return res.status(400).json({ error: 'Invalid stage' });
  }
  db.prepare(
    'UPDATE deals SET title=?, value=?, stage=?, updated_at=datetime(\'now\') WHERE id=?'
  ).run(
    title || existing.title,
    value !== undefined ? value : existing.value,
    stage || existing.stage,
    req.params.id
  );
  const deal = db.prepare(`
    SELECT d.*, l.name as lead_name, l.company as lead_company
    FROM deals d JOIN leads l ON d.lead_id = l.id WHERE d.id = ?
  `).get(req.params.id);
  res.json(deal);
});

app.get('/api/tasks', (req, res) => {
  let query = `
    SELECT t.*, l.name as lead_name
    FROM tasks t LEFT JOIN leads l ON t.lead_id = l.id
  `;
  if (req.query.lead_id) {
    query += ' WHERE t.lead_id = ?';
    const tasks = db.prepare(query + ' ORDER BY t.created_at DESC').all(req.query.lead_id);
    return res.json(tasks);
  }
  const tasks = db.prepare(query + ' ORDER BY t.created_at DESC').all();
  res.json(tasks);
});

app.post('/api/tasks', (req, res) => {
  const { lead_id, description, due_date } = req.body;
  if (!description) return res.status(400).json({ error: 'Description is required' });
  const result = db.prepare(
    'INSERT INTO tasks (lead_id, description, due_date) VALUES (?, ?, ?)'
  ).run(lead_id || null, description, due_date || null);
  const task = db.prepare(`
    SELECT t.*, l.name as lead_name
    FROM tasks t LEFT JOIN leads l ON t.lead_id = l.id WHERE t.id = ?
  `).get(result.lastInsertRowid);
  res.status(201).json(task);
});

app.put('/api/tasks/:id', (req, res) => {
  const { description, due_date, completed } = req.body;
  const existing = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Task not found' });
  db.prepare(
    'UPDATE tasks SET description=?, due_date=?, completed=? WHERE id=?'
  ).run(
    description || existing.description,
    due_date !== undefined ? due_date : existing.due_date,
    completed !== undefined ? (completed ? 1 : 0) : existing.completed,
    req.params.id
  );
  const task = db.prepare(`
    SELECT t.*, l.name as lead_name
    FROM tasks t LEFT JOIN leads l ON t.lead_id = l.id WHERE t.id = ?
  `).get(req.params.id);
  res.json(task);
});

app.listen(PORT, () => {
  console.log(`Forja CRM API running on http://localhost:${PORT}`);
});
