import { useState } from 'react';
import MemberWorkloadCard from '../MemberWorkloadCard';
import Modal from '../../common/Modal';
import WorkloadTaskList from '../WorkloadTaskList';
import { useMemberTasks } from '../../../hooks/useMemberTasks';

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
  gap: 'var(--space-4)',
};

function MemberTasksModal({ member, onClose }) {
  const { data: tasks, loading, error } = useMemberTasks(member?.id ?? null);

  if (!member) return null;

  return (
    <Modal
      isOpen={!!member}
      onClose={onClose}
      title={`${member.name} — ${member.total_tasks} tasks`}
    >
      <p style={{ margin: '0 0 var(--space-4)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
        {member.role}
        {member.is_overloaded && (
          <span style={{ color: 'var(--color-error)', fontWeight: 'var(--font-weight-semibold)' }}>
            {' '}
            · Overloaded
          </span>
        )}
      </p>
      <WorkloadTaskList tasks={tasks} loading={loading} error={error} />
    </Modal>
  );
}

export default function WorkloadModalVariant({ members }) {
  const [selected, setSelected] = useState(null);

  return (
    <>
      <div style={gridStyle}>
        {members.map((member) => (
          <MemberWorkloadCard
            key={member.id}
            member={member}
            onClick={setSelected}
          />
        ))}
      </div>
      <MemberTasksModal member={selected} onClose={() => setSelected(null)} />
    </>
  );
}
