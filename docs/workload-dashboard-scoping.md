# Scoping Brief: Team Workload Dashboard

**Input:** `docs/workload-dashboard-notes.md` — replace bare Team page with at-a-glance workload, priority breakdown, overload warnings, optional triage; reuse existing team card look.

---

## What You'd Need to Build

### 1. Workload data API (new server endpoint)

**Suggested:** `GET /api/team/workload` in `server/routes/teams.js`

Returns per-member aggregates, e.g.:

```json
{
  "id": 2,
  "name": "Rachel",
  "total_tasks": 14,
  "by_priority": { "urgent": 3, "high": 5, "medium": 4, "low": 2 },
  "is_overloaded": true
}
```

**Why:** Today `GET /api/team` returns members only; `GET /api/team/:id/tasks` returns one person's tasks. There is no single call that compares workload across the team. Fetching every member's tasks from the client (N+1 requests) works for a demo but doesn't scale and duplicates aggregation logic.

**Overload rule:** Product decision — e.g. `total_tasks > 10` OR `high + urgent > 5`. Implement in SQL (`GROUP BY assignee_id`) or in route handler after query.

### 2. Client hook for workload

**Suggested:** `useTeamWorkload()` in `client/src/hooks/` (or extend `useTeam.js`)

Calls the new endpoint, exposes `data`, `loading`, `error`, `refetch` — same pattern as `useApi` / `useTeam`.

### 3. Enhanced team cards (UI)

**Suggested:** Extend `MemberCard.jsx` or add `MemberWorkloadCard.jsx` in `client/src/components/team/`

Each card shows:

- Existing avatar, name, role (per notes: reuse team cards)
- Task count total + priority breakdown (numbers or small `Badge` pills)
- Overload indicator — border/background using `--color-error` / `--color-warning` tokens, or icon

**Why:** Notes explicitly say not to build something that looks totally different from current team cards.

### 4. Team page layout update

**File:** `client/src/pages/Team.jsx`

Replace or augment `MemberList` with workload-aware grid. Optional summary row at top (team totals, count of overloaded members) — pattern similar to `Stats.jsx` on Dashboard.

### 5. Triage drill-down (v1 vs later)

**If v1:**

- Click member card → `Modal` with list of their tasks
- Reuse `GET /api/team/:id/tasks` (already exists)
- Display with `TaskRow` or simplified task list
- **Reassign:** wire `useTasks().updateTask(id, { assignee_id })` or `api.put` — mutation path exists on Tasks page but not on Team

**If later:** Ship read-only workload view first; triage/reassign in v2.

---

## What Already Exists

| Asset | Location | Reuse for |
|-------|----------|-----------|
| Team member list + grid | `MemberList.jsx`, `MemberCard.jsx` | Card layout, avatar, grid `repeat(auto-fill, minmax(320px, 1fr))` |
| Team data hook | `useTeam.js` → `GET /api/team` | Member identity; pair with workload endpoint |
| Per-member tasks API | `GET /api/team/:id/tasks` in `teams.js` | Drill-down / triage modal without new query shape |
| Task update API | `PUT /api/tasks/:id` in `tasks.js`, `updateTask` in `useTasks.js` | Reassign if triage is in scope |
| Priority/status labels | `Badge.jsx` `colorMap` | Priority breakdown chips |
| KPI card pattern | `Stats.jsx` | Summary metrics styling (stat card inline styles) |
| Modal + list pattern | `Tasks.jsx` + `Modal` + `TaskRow` | Drill-down UX |
| Design tokens | `tokens.css` | Warning/error colors for overload state |
| Task filters by assignee | `GET /api/tasks?assignee_id=` | Alternative to per-member endpoint for drill-down |

---

## Dependencies & Unknowns

1. **Overload definition** — Notes say "way too many high-priority" and "rachel has 14, james has 3" — need thresholds (absolute count vs. relative to team average vs. weighted score).
2. **Unassigned tasks** — Tasks with `assignee_id = null` won't appear on member workload; decide if v1 shows an "Unassigned" bucket.
3. **Done tasks** — Should workload count open tasks only (`status != 'done'`) or all? Affects SQL `WHERE` clause and PM expectations.
4. **Triage scope** — Reassign in-modal requires UX for picking new assignee + error handling; read-only drill-down is much smaller.
5. **No auth** — Reassign assumes mock user can edit any task; fine for practice app, irrelevant for real RBAC discussion.
6. **Performance** — Single aggregated endpoint vs. N+1; for demo size, client-side aggregation from `GET /api/tasks` is possible but couples Team page to full task list.

---

## Where the Difficulty Is

### Straightforward

- **Visual workload on cards** — Extend `MemberCard` with counts and `Badge` components; tokens already define priority colors.
- **Team page swap** — `Team.jsx` is ~20 lines; wiring a new hook and component is low risk.
- **Read-only drill-down** — `GET /api/team/:id/tasks` + `Modal` + task list reuses established patterns from Tasks page.

### Moderate

- **New `GET /api/team/workload` endpoint** — New SQL aggregation (`COUNT`, `GROUP BY`, conditional sums by priority). Not hard, but it's new server surface area and needs overload business rules documented.
- **Summary stats row** — Similar to `Stats.jsx` but different inputs; mostly presentation.

### Complex / conversation-worthy

- **Overload logic that feels right** — Simple numeric threshold is easy; "imbalance should jump out" may need relative comparison (percentile across team) or weighted priority scoring. PM + eng should align before building.
- **Triage + reassign in v1** — Requires modal UX, assignee picker (`teamMembers` dropdown pattern from `TaskForm`), optimistic updates or refetch, and edge cases (reassign away from overloaded person). Uses existing APIs but more UI state than the rest of the feature.
- **Filtering active vs. done tasks** — Wrong default makes the dashboard lie; worth explicit acceptance criteria.

### Suggested phasing

| Phase | Scope |
|-------|--------|
| **v1** | Workload endpoint + enhanced cards + overload styling + optional read-only task modal |
| **v2** | In-dashboard reassign + relative overload / team balance indicators |

---

## PM leverage summary

Walk into refinement saying: *"This reuses `MemberCard` and the team grid; we need one new aggregated endpoint; overload rules are the main product decision; triage can ship read-only first using existing `GET /api/team/:id/tasks`."*

Not: *"Medium effort, 2 sprints."*
