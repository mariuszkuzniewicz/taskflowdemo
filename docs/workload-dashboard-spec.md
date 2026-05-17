# Feature Spec: Team Workload Dashboard

## Vision

**Primary user:** Product manager / team lead planning capacity across the team.

**Core purpose:** Surface overloaded people at a glance — workload imbalance must jump out before anyone drills into detail.

**Workflow today:** Team page is a static directory (names, roles, avatars). PMs cannot see who is drowning without opening Tasks and filtering by assignee one person at a time.

**Success (30-second stakeholder demo):** Open Team → Workload mode. Rachel Torres is immediately visible as overloaded (warning/error styling). Other members look balanced. No click required to see the problem.

**Variant goal:** Build three interaction models on the same data and acceptance criteria so the PM can evaluate tradeoffs and pick a winner — not debate hypotheticals in a meeting.

---

## Constraints

| Area | Decision |
|------|----------|
| **Scope (v1)** | No task editing, reassign, or status changes from workload views. Drill-down is **read-only** task lists only. |
| **Task inclusion** | **All tasks** count toward workload (including `done`). Document clearly in UI if needed so PMs are not surprised. |
| **Unassigned tasks** | **Ignore** in v1 — no unassigned bucket or pseudo-member card. |
| **Overload rule** | `is_overloaded = true` when `total_tasks > 10` |
| **UI consistency** | **Extend `MemberCard`** look — same grid, avatar, name, role; add counts, priority badges, overload border/background using design tokens. |
| **API** | Single `GET /api/team/workload` — no N+1 client aggregation. |
| **Design** | Use `docs/design-system.md` tokens; inline styles; no external UI libraries. |
| **Auth** | Mock user can view all data (practice app). |

---

## Acceptance Criteria

1. **Workload mode** — Team page exposes a Workload view (toggle or tab from existing List view) showing every team member with total task count and priority breakdown (urgent / high / medium / low).
2. **Overload at a glance** — Members with `total_tasks > 10` use distinct warning/error styling (border, background, or badge) so Rachel Torres is obvious without interaction.
3. **Aggregated API** — `GET /api/team/workload` returns per-member: `id`, `name`, `role`, `total_tasks`, `by_priority`, `is_overloaded`. Counts match seed data.
4. **Three variants, one dataset** — Same workload data powers three tabs: **Expandable Rows**, **Slide-Out Panel**, **Modal Deep-Dive**. Switching tabs does not refetch or change totals.
5. **Read-only drill-down** — Clicking a member in any variant shows their assigned tasks (read-only). No edit, reassign, or delete controls in v1.
6. **Design system compliance** — Colors, spacing, typography, and card patterns match TaskFlow design system and existing team cards.

**Non-negotiable if scope is cut:** #2 — overload visible at a glance.

---

## Edge Cases & Error States

| Scenario | Expected behavior |
|----------|-------------------|
| Member with **zero tasks** | Full card in grid with `0` counts and **neutral** styling (not hidden, not overloaded). |
| **API failure** (500, network) | Error banner on Team workload view + **Retry** action. Rest of app unaffected. |
| **Unassigned tasks** | Excluded from v1 workload view and API aggregates. |
| **Very long names / many tasks** | Card layout does not break grid; task list in drill-down scrolls within variant container. |
| **Loading** | Spinner or skeleton on workload view until first successful fetch. |
| **Member click while loading detail** | Disable interaction or show loading in variant detail area until tasks load. |

---

## Variant Directions

### Variant A: Expandable Rows

**Interaction model:** Team appears as a list/table of rows. Click a row (or expand control) to reveal that member's task list inline below the row without navigating away.

| | |
|--|--|
| **Strongest argument** | Full picture without leaving the list — scan the whole team, expand only who matters. |
| **Biggest risk** | Vertical scroll grows long if multiple rows are expanded; compare-two-people workflow can get noisy. |

### Variant B: Slide-Out Panel

**Interaction model:** Grid/list of member cards remains visible. Click a card → panel slides in from the right with read-only task list; overview stays partially visible.

| | |
|--|--|
| **Strongest argument** | Detail without losing the overview — grid stays visible while inspecting Rachel. |
| **Biggest risk** | Narrow viewports may feel cramped; panel width vs. grid balance needs intentional layout. |

### Variant C: Modal Deep-Dive

**Interaction model:** Click a member card → centered modal with full task list and member summary; backdrop dims the team view.

| | |
|--|--|
| **Strongest argument** | Maximum focus on one person's workload for deep inspection or stakeholder walkthrough. |
| **Biggest risk** | **Context switch** — loses team comparison context; harder to check multiple overloaded people in sequence. |

---

## Implementation Notes (from L2 scoping)

- **Server:** Add `GET /api/team/workload` in `server/routes/teams.js` with SQL `GROUP BY assignee_id`, priority conditional sums, `is_overloaded` flag.
- **Client hook:** `useTeamWorkload()` following `useApi` / `useTeam` patterns.
- **Components:** Extend or wrap `MemberCard.jsx`; variant-specific containers for expand / panel / modal.
- **Drill-down tasks:** Reuse `GET /api/team/:id/tasks` for read-only lists in each variant.
- **Team page:** `Team.jsx` — Workload toggle, variant tabs, wire hook + variants.

---

## Test Plan

### Visual verification

1. Navigate to `http://localhost:5173/team` → enable **Workload** view.
2. Capture screenshot: Rachel Torres shows overload styling; balanced members do not.
3. For each variant tab (Expandable Rows, Slide-Out Panel, Modal Deep-Dive):
   - Click Rachel Torres.
   - Capture screenshot showing read-only task list with no edit controls.

### Functional verification

1. `GET /api/team/workload` returns 200 with correct `total_tasks` and `by_priority` for seed data (Rachel > 10 tasks, `is_overloaded: true`).
2. Switching variant tabs does not change card counts or overload flags.
3. Clicking a non-overloaded member shows their tasks read-only in each variant.
4. Retry button works after simulated API failure.

### Edge case verification

1. Member with zero tasks: card shows zeros, neutral style, not overloaded.
2. API error: error banner + retry; no crash.
3. Confirm unassigned tasks do not appear as a card or in member totals.

---

## Decision Log (interview)

| Phase | Decision | Answer |
|-------|----------|--------|
| Vision | Primary user | Product manager / team lead |
| Vision | Core purpose | Surface overload at a glance |
| Vision | Demo success | Rachel visibly overloaded without clicking |
| Constraints | v1 scope | No task editing; read-only drill-down only |
| Constraints | Task counting | All tasks (including done) |
| Constraints | UI | Extend existing MemberCard |
| Constraints | Unassigned | Ignore in v1 |
| Acceptance | Criteria set | 6 criteria as listed — approved |
| Acceptance | Non-negotiable | #2 Overload at a glance |
| Acceptance | Overload rule | `total_tasks > 10` |
| Edge cases | Zero tasks | Show 0 with neutral full card |
| Edge cases | API error | Error banner + retry |
| Edge cases | Unassigned | Ignore |
| Variant A | Best for | Full picture without leaving list |
| Variant B | Best for | Detail without losing overview |
| Variant C | Biggest risk | Context switch / harder to compare multiple people |
| Test plan | Completeness | Approved as proposed |
