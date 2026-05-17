import { useState } from 'react';
import WorkloadTaskList from '../WorkloadTaskList';
import { useMemberTasks } from '../../../hooks/useMemberTasks';

const rowHeaderStyle = (overloaded, expanded) => ({
  display: 'grid',
  gridTemplateColumns: '1fr auto auto auto auto 32px',
  alignItems: 'center',
  gap: 'var(--space-4)',
  padding: 'var(--space-4) var(--space-5)',
  background: overloaded ? 'var(--color-error-light)' : 'var(--color-surface)',
  border: overloaded
    ? '2px solid var(--color-error)'
    : expanded
      ? '2px solid var(--color-primary)'
      : '1px solid var(--color-border)',
  borderRadius: 'var(--border-radius-lg)',
  cursor: 'pointer',
  transition: 'border-color var(--transition-fast)',
});

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--space-3)',
};

const expandPanelStyle = {
  marginTop: 'calc(-1 * var(--space-2))',
  marginBottom: 'var(--space-2)',
  padding: 'var(--space-4)',
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderTop: 'none',
  borderRadius: '0 0 var(--border-radius-lg) var(--border-radius-lg)',
};

function ExpandableRow({ member, expanded, onToggle }) {
  const { data: tasks, loading, error } = useMemberTasks(expanded ? member.id : null);

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        style={rowHeaderStyle(member.is_overloaded, expanded)}
        onClick={() => onToggle(member.id)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggle(member.id);
          }
        }}
      >
        <div>
          <div style={{ fontWeight: 'var(--font-weight-semibold)' }}>{member.name}</div>
          <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
            {member.role}
            {member.is_overloaded && (
              <span style={{ marginLeft: 'var(--space-2)', color: 'var(--color-error)', fontWeight: 'var(--font-weight-semibold)' }}>
                · Overloaded
              </span>
            )}
          </div>
        </div>
        <span style={{ fontWeight: 'var(--font-weight-bold)', fontSize: 'var(--font-size-lg)' }}>
          {member.total_tasks}
        </span>
        {['urgent', 'high', 'medium', 'low'].map((p) => (
          <span key={p} style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
            {member.by_priority?.[p] ?? 0} {p}
          </span>
        ))}
        <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-lg)' }}>
          {expanded ? '−' : '+'}
        </span>
      </div>
      {expanded && (
        <div style={expandPanelStyle}>
          <WorkloadTaskList tasks={tasks} loading={loading} error={error} />
        </div>
      )}
    </div>
  );
}

export default function WorkloadExpandableRows({ members }) {
  const [expandedId, setExpandedId] = useState(null);

  const handleToggle = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div style={containerStyle}>
      {members.map((member) => (
        <ExpandableRow
          key={member.id}
          member={member}
          expanded={expandedId === member.id}
          onToggle={handleToggle}
        />
      ))}
    </div>
  );
}
