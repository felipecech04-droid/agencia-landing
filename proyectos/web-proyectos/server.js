import express from "express";
import cors from "cors";
import Database from "better-sqlite3";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const db = new Database(join(__dirname, "proyectos.db"));
db.pragma("journal_mode = WAL");

db.exec(`CREATE TABLE IF NOT EXISTS proyectos (
  id INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT NOT NULL, descripcion TEXT,
  estado TEXT DEFAULT 'activo', prioridad TEXT DEFAULT 'media',
  fecha_inicio TEXT, fecha_fin TEXT, created_at TEXT DEFAULT (datetime('now'))
)`);
db.exec(`CREATE TABLE IF NOT EXISTS tareas (
  id INTEGER PRIMARY KEY AUTOINCREMENT, proyecto_id INTEGER NOT NULL,
  titulo TEXT NOT NULL, asignado TEXT, estado TEXT DEFAULT 'pendiente',
  prioridad TEXT DEFAULT 'media', created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (proyecto_id) REFERENCES proyectos(id)
)`);

const count = db.prepare("SELECT COUNT(*) as c FROM proyectos").get().c;
if (count === 0) {
  const insP = db.prepare("INSERT INTO proyectos (nombre, descripcion, estado, prioridad) VALUES (?,?,?,?)");
  insP.run("CRM Corporativo", "Plataforma CRM para gestion de clientes", "activo", "alta");
  insP.run("E-commerce App", "Tienda online con React y Node.js", "activo", "alta");
  insP.run("Dashboard Financiero", "Panel de control con graficos financieros", "completado", "media");
  insP.run("App de Delivery", "Aplicacion movil para delivery", "activo", "media");
  insP.run("Sistema de Nominas", "Gestion de nominas y RH", "pausado", "baja");
  const insT = db.prepare("INSERT INTO tareas (proyecto_id, titulo, asignado, estado, prioridad) VALUES (?,?,?,?,?)");
  insT.run(1, "Disenar base de datos", "Carlos", "completado", "alta");
  insT.run(1, "Crear API REST", "Maria", "progreso", "alta");
  insT.run(1, "Desarrollar frontend", "Juan", "pendiente", "media");
  insT.run(1, "Pruebas de integracion", "", "pendiente", "media");
  insT.run(2, "Configurar pasarela de pago", "Maria", "completado", "alta");
  insT.run(2, "Catalogo de productos", "Juan", "progreso", "alta");
  insT.run(2, "Carrito de compras", "", "pendiente", "media");
  insT.run(3, "Disenar dashboard", "Carlos", "completado", "media");
  insT.run(3, "Integrar APIs financieras", "Maria", "completado", "media");
  insT.run(4, "Prototipo de UI", "Juan", "progreso", "media");
  insT.run(4, "Backend de pedidos", "", "pendiente", "alta");
  insT.run(5, "Modulo de empleados", "Carlos", "pendiente", "baja");
}

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/stats", (req, res) => {
  const activos = db.prepare("SELECT COUNT(*) as c FROM proyectos WHERE estado='activo'").get().c;
  const completados = db.prepare("SELECT COUNT(*) as c FROM proyectos WHERE estado='completado'").get().c;
  const tareasPendientes = db.prepare("SELECT COUNT(*) as c FROM tareas WHERE estado='pendiente'").get().c;
  const totalProyectos = db.prepare("SELECT COUNT(*) as c FROM proyectos").get().c;
  res.json({ activos, completados, tareasPendientes, totalProyectos });
});

app.get("/api/projects", (req, res) => {
  const proyectos = db.prepare("SELECT * FROM proyectos ORDER BY created_at DESC").all();
  res.json(proyectos);
});

app.post("/api/projects", (req, res) => {
  const { nombre, descripcion, prioridad } = req.body;
  const r = db.prepare("INSERT INTO proyectos (nombre, descripcion, prioridad) VALUES (?,?,?)").run(nombre, descripcion, prioridad);
  res.json({ id: r.lastInsertRowid });
});

app.put("/api/projects/:id", (req, res) => {
  const { nombre, descripcion, estado, prioridad } = req.body;
  db.prepare("UPDATE proyectos SET nombre=?, descripcion=?, estado=?, prioridad=? WHERE id=?").run(nombre, descripcion, estado, prioridad, req.params.id);
  res.json({ ok: true });
});

app.delete("/api/projects/:id", (req, res) => {
  db.prepare("DELETE FROM tareas WHERE proyecto_id=?").run(req.params.id);
  db.prepare("DELETE FROM proyectos WHERE id=?").run(req.params.id);
  res.json({ ok: true });
});

app.get("/api/projects/:id/tasks", (req, res) => {
  const tareas = db.prepare("SELECT * FROM tareas WHERE proyecto_id=? ORDER BY created_at DESC").all(req.params.id);
  res.json(tareas);
});

app.post("/api/tasks", (req, res) => {
  const { proyecto_id, titulo, asignado, prioridad } = req.body;
  const r = db.prepare("INSERT INTO tareas (proyecto_id, titulo, asignado, prioridad) VALUES (?,?,?,?)").run(proyecto_id, titulo, asignado, prioridad);
  res.json({ id: r.lastInsertRowid });
});

app.put("/api/tasks/:id", (req, res) => {
  const { estado, titulo, asignado } = req.body;
  db.prepare("UPDATE tareas SET estado=COALESCE(?,estado), titulo=COALESCE(?,titulo), asignado=COALESCE(?,asignado) WHERE id=?").run(estado, titulo, asignado, req.params.id);
  res.json({ ok: true });
});

app.delete("/api/tasks/:id", (req, res) => {
  db.prepare("DELETE FROM tareas WHERE id=?").run(req.params.id);
  res.json({ ok: true });
});

app.listen(3002, () => console.log("Forja Proyectos API on :3002"));
