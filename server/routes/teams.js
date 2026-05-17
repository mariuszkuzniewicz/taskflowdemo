import { Router } from 'express';
import getDb from '../db/connection.js';

const router = Router();

// GET /api/team — all team members
router.get('/', (req, res) => {
  const db = getDb();
  const members = db.prepare('SELECT * FROM team_members ORDER BY id').all();
  res.json(members);
});

// GET /api/team/workload — per-member task aggregates
router.get('/workload', (req, res) => {
  const db = getDb();
  const rows = db.prepare(`
    SELECT
      tm.id,
      tm.name,
      tm.role,
      tm.email,
      tm.avatar_color,
      COUNT(t.id) AS total_tasks,
      SUM(CASE WHEN t.priority = 'urgent' THEN 1 ELSE 0 END) AS urgent,
      SUM(CASE WHEN t.priority = 'high' THEN 1 ELSE 0 END) AS high,
      SUM(CASE WHEN t.priority = 'medium' THEN 1 ELSE 0 END) AS medium,
      SUM(CASE WHEN t.priority = 'low' THEN 1 ELSE 0 END) AS low
    FROM team_members tm
    LEFT JOIN tasks t ON t.assignee_id = tm.id
    GROUP BY tm.id
    ORDER BY tm.id
  `).all();

  const workload = rows.map((row) => ({
    id: row.id,
    name: row.name,
    role: row.role,
    email: row.email,
    avatar_color: row.avatar_color,
    total_tasks: row.total_tasks,
    by_priority: {
      urgent: row.urgent,
      high: row.high,
      medium: row.medium,
      low: row.low,
    },
    is_overloaded: row.total_tasks > 10,
  }));

  res.json(workload);
});

// GET /api/team/:id — single team member
router.get('/:id', (req, res) => {
  const db = getDb();
  const member = db.prepare('SELECT * FROM team_members WHERE id = ?').get(req.params.id);
  if (!member) {
    return res.status(404).json({ error: 'Team member not found' });
  }
  res.json(member);
});

// GET /api/team/:id/tasks — tasks assigned to a team member
router.get('/:id/tasks', (req, res) => {
  const db = getDb();
  const member = db.prepare('SELECT * FROM team_members WHERE id = ?').get(req.params.id);
  if (!member) {
    return res.status(404).json({ error: 'Team member not found' });
  }
  const tasks = db.prepare(`
    SELECT t.*, p.name as project_name
    FROM tasks t
    LEFT JOIN projects p ON t.project_id = p.id
    WHERE t.assignee_id = ?
    ORDER BY t.due_date ASC
  `).all(req.params.id);
  res.json(tasks);
});

export default router;
