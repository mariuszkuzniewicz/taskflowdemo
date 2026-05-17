import Badge from '../common/Badge';
import Spinner from '../common/Spinner';
import { formatRelativeDate, isOverdue } from '../../utils/format-date';

const rowStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr auto auto 100px',
  alignItems: 'center',
  gap: 'var(--space-3)',
  padding: 'var(--space-3) var(--space-4)',
  borderBottom: '1px solid var(--color-border-light)',
  fontSize: 'var(--font-size-sm)',
};

export default function WorkloadTaskList({ tasks, loading, error }) {
  if (loading) return <Spinner />;

  if (error) {
    return (
      <p style={{ color: 'var(--color-error)', padding: 'var(--space-4)', fontSize: 'var(--font-size-sm)' }}>
        {error}
      </p>
    );
  }

  if (!tasks?.length) {
    return (
      <p style={{ color: 'var(--color-text-muted)', padding: 'var(--space-4)', fontSize: 'var(--font-size-sm)' }}>
        No tasks assigned
      </p>
    );
  }

  return (
    <div>
      {tasks.map((task) => {
        const overdue = task.status !== 'done' && isOverdue(task.due_date);
        return (
          <div key={task.id} style={rowStyle}>
            <div>
              <div style={{ fontWeight: 'var(--font-weight-medium)' }}>{task.title}</div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                {task.project_name}
              </div>
            </div>
            <Badge value={task.status} />
            <Badge value={task.priority} />
            <div
              style={{
                fontSize: 'var(--font-size-xs)',
                color: overdue ? 'var(--color-error)' : 'var(--color-text-muted)',
                fontWeight: overdue ? 'var(--font-weight-medium)' : 'normal',
                textAlign: 'right',
              }}
            >
              {formatRelativeDate(task.due_date)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
