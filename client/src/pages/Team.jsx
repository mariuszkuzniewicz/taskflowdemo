import { useState } from 'react';
import { useTeam } from '../hooks/useTeam';
import MemberList from '../components/team/MemberList';
import WorkloadView from '../components/team/WorkloadView';
import Spinner from '../components/common/Spinner';

const headerRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: 'var(--space-4)',
  flexWrap: 'wrap',
};

const viewToggleStyle = {
  display: 'flex',
  gap: 'var(--space-2)',
};

const viewBtnStyle = (active) => ({
  padding: 'var(--space-2) var(--space-4)',
  borderRadius: 'var(--border-radius-md)',
  border: active ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
  background: active ? 'var(--color-primary)' : 'var(--color-surface)',
  color: active ? '#fff' : 'var(--color-text-secondary)',
  fontSize: 'var(--font-size-sm)',
  fontWeight: 'var(--font-weight-medium)',
  cursor: 'pointer',
});

export default function Team() {
  const [view, setView] = useState('list');
  const { data: members, loading } = useTeam();

  return (
    <div>
      <div className="page-header" style={headerRowStyle}>
        <div>
          <h1>Team</h1>
          <p>
            {view === 'list'
              ? 'Your product team members'
              : 'Capacity planning — spot overload at a glance'}
          </p>
        </div>
        <div style={viewToggleStyle}>
          <button type="button" style={viewBtnStyle(view === 'list')} onClick={() => setView('list')}>
            List
          </button>
          <button type="button" style={viewBtnStyle(view === 'workload')} onClick={() => setView('workload')}>
            Workload
          </button>
        </div>
      </div>

      {view === 'list' && (loading ? <Spinner /> : <MemberList members={members} />)}
      {view === 'workload' && <WorkloadView />}
    </div>
  );
}
