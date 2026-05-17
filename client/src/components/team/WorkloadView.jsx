import { useState } from 'react';
import Button from '../common/Button';
import Spinner from '../common/Spinner';
import { useTeamWorkload } from '../../hooks/useTeamWorkload';
import WorkloadExpandableRows from './workload/WorkloadExpandableRows';
import WorkloadSlideOutPanel from './workload/WorkloadSlideOutPanel';
import WorkloadModalVariant from './workload/WorkloadModalVariant';

const VARIANTS = [
  { id: 'expandable', label: 'Expandable Rows' },
  { id: 'panel', label: 'Slide-Out Panel' },
  { id: 'modal', label: 'Modal Deep-Dive' },
];

const tabBarStyle = {
  display: 'flex',
  gap: 'var(--space-2)',
  marginBottom: 'var(--space-2)',
  flexWrap: 'wrap',
};

const tabStyle = (active) => ({
  padding: 'var(--space-2) var(--space-4)',
  borderRadius: 'var(--border-radius-md)',
  border: active ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
  background: active ? 'var(--color-primary-light)' : 'var(--color-surface)',
  color: active ? 'var(--color-primary)' : 'var(--color-text-secondary)',
  fontSize: 'var(--font-size-sm)',
  fontWeight: active ? 'var(--font-weight-semibold)' : 'var(--font-weight-medium)',
  cursor: 'pointer',
});

const errorBannerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 'var(--space-4)',
  padding: 'var(--space-4)',
  marginBottom: 'var(--space-4)',
  background: 'var(--color-error-light)',
  border: '1px solid var(--color-error)',
  borderRadius: 'var(--border-radius-md)',
  color: 'var(--color-error)',
  fontSize: 'var(--font-size-sm)',
};

const noteStyle = {
  fontSize: 'var(--font-size-xs)',
  color: 'var(--color-text-muted)',
  marginBottom: 'var(--space-4)',
};

export default function WorkloadView() {
  const { data: members, loading, error, refetch } = useTeamWorkload();
  const [variant, setVariant] = useState('expandable');
  const [selectedId, setSelectedId] = useState(null);

  const handleVariantChange = (id) => {
    setVariant(id);
    setSelectedId(null);
  };

  const handleSelect = (member) => {
    setSelectedId(member.id);
  };

  if (loading) return <Spinner />;

  if (error) {
    return (
      <div style={errorBannerStyle}>
        <span>Could not load workload data: {error}</span>
        <Button variant="secondary" onClick={refetch}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div style={tabBarStyle}>
        {VARIANTS.map((v) => (
          <button
            key={v.id}
            type="button"
            style={tabStyle(variant === v.id)}
            onClick={() => handleVariantChange(v.id)}
          >
            {v.label}
          </button>
        ))}
      </div>
      <p style={noteStyle}>Counts include completed tasks.</p>

      {variant === 'expandable' && <WorkloadExpandableRows members={members} />}
      {variant === 'panel' && (
        <WorkloadSlideOutPanel
          members={members}
          selectedId={selectedId}
          onSelect={handleSelect}
        />
      )}
      {variant === 'modal' && <WorkloadModalVariant members={members} />}
    </div>
  );
}
