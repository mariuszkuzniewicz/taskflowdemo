import Badge from '../common/Badge';

const avatarStyle = (color) => ({
  width: '48px',
  height: '48px',
  borderRadius: 'var(--border-radius-full)',
  background: color || 'var(--color-primary)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fff',
  fontWeight: 'var(--font-weight-semibold)',
  fontSize: 'var(--font-size-lg)',
  flexShrink: 0,
});

const priorityKeys = ['urgent', 'high', 'medium', 'low'];

export default function MemberWorkloadCard({ member, onClick, selected }) {
  const initials = member.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const overloaded = member.is_overloaded;

  const cardStyle = {
    background: overloaded ? 'var(--color-error-light)' : 'var(--color-surface)',
    border: overloaded
      ? '2px solid var(--color-error)'
      : selected
        ? '2px solid var(--color-primary)'
        : '1px solid var(--color-border)',
    borderRadius: 'var(--border-radius-lg)',
    padding: 'var(--space-5)',
    display: 'flex',
    alignItems: 'flex-start',
    gap: 'var(--space-4)',
    cursor: onClick ? 'pointer' : 'default',
    transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
    boxShadow: selected ? 'var(--shadow-sm)' : 'none',
  };

  const handleKeyDown = onClick
    ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(member);
        }
      }
    : undefined;

  const content = (
    <>
      <div style={avatarStyle(member.avatar_color)}>{initials}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            flexWrap: 'wrap',
          }}
        >
          <span style={{ fontWeight: 'var(--font-weight-semibold)' }}>{member.name}</span>
          {overloaded && (
            <span
              style={{
                fontSize: 'var(--font-size-xs)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--color-error)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              Overloaded
            </span>
          )}
        </div>
        <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
          {member.role}
        </div>
        <div
          style={{
            marginTop: 'var(--space-3)',
            fontSize: 'var(--font-size-2xl)',
            fontWeight: 'var(--font-weight-bold)',
            color: overloaded ? 'var(--color-error)' : 'var(--color-text)',
            lineHeight: 1.2,
          }}
        >
          {member.total_tasks}
          <span
            style={{
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-normal)',
              color: 'var(--color-text-secondary)',
              marginLeft: 'var(--space-2)',
            }}
          >
            tasks
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'var(--space-2)',
            marginTop: 'var(--space-2)',
          }}
        >
          {priorityKeys.map((key) => {
            const count = member.by_priority?.[key] ?? 0;
            if (count === 0) return null;
            return (
              <span key={key} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Badge value={key} />
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                  {count}
                </span>
              </span>
            );
          })}
          {member.total_tasks === 0 && (
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
              No tasks assigned
            </span>
          )}
        </div>
      </div>
    </>
  );

  if (onClick) {
    return (
      <div
        role="button"
        tabIndex={0}
        style={cardStyle}
        onClick={() => onClick(member)}
        onKeyDown={handleKeyDown}
      >
        {content}
      </div>
    );
  }

  return <div style={cardStyle}>{content}</div>;
}
