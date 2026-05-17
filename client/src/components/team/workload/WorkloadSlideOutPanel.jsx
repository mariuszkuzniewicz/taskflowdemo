import MemberWorkloadCard from '../MemberWorkloadCard';
import WorkloadTaskList from '../WorkloadTaskList';
import { useMemberTasks } from '../../../hooks/useMemberTasks';

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
  gap: 'var(--space-4)',
};

const layoutStyle = {
  display: 'flex',
  gap: 'var(--space-4)',
  alignItems: 'flex-start',
};

const panelStyle = {
  width: '400px',
  flexShrink: 0,
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--border-radius-lg)',
  boxShadow: 'var(--shadow-md)',
  maxHeight: 'calc(100vh - 220px)',
  overflow: 'auto',
  position: 'sticky',
  top: 'var(--space-4)',
};

const panelHeaderStyle = {
  padding: 'var(--space-5)',
  borderBottom: '1px solid var(--color-border-light)',
};

const gridWrapStyle = (hasPanel) => ({
  flex: 1,
  minWidth: 0,
  opacity: hasPanel ? 1 : 1,
});

export default function WorkloadSlideOutPanel({ members, selectedId, onSelect }) {
  const selected = members.find((m) => m.id === selectedId) ?? null;
  const { data: tasks, loading, error } = useMemberTasks(selectedId);

  return (
    <div style={layoutStyle}>
      <div style={gridWrapStyle(!!selected)}>
        <div style={gridStyle}>
          {members.map((member) => (
            <MemberWorkloadCard
              key={member.id}
              member={member}
              onClick={onSelect}
              selected={selectedId === member.id}
            />
          ))}
        </div>
      </div>
      {selected && (
        <aside style={panelStyle}>
          <header style={panelHeaderStyle}>
            <h3 style={{ margin: 0, fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)' }}>
              {selected.name}
            </h3>
            <p style={{ margin: 'var(--space-1) 0 0', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
              {selected.role} · {selected.total_tasks} tasks
              {selected.is_overloaded && (
                <span style={{ color: 'var(--color-error)', fontWeight: 'var(--font-weight-semibold)' }}>
                  {' '}
                  · Overloaded
                </span>
              )}
            </p>
          </header>
          <WorkloadTaskList tasks={tasks} loading={loading} error={error} />
        </aside>
      )}
    </div>
  );
}
