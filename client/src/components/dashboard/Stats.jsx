const statCardStyle = {
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--border-radius-lg)',
  padding: 'var(--space-6)',
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--space-3)',
  boxShadow: 'var(--shadow-sm)',
};

const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--space-3)',
};

const iconContainerStyle = (bg) => ({
  width: 40,
  height: 40,
  borderRadius: 'var(--border-radius-md)',
  background: bg,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
});

const labelStyle = {
  fontSize: 'var(--font-size-sm)',
  color: 'var(--color-text-secondary)',
  fontWeight: 'var(--font-weight-medium)',
};

const valueStyle = {
  fontSize: 'var(--font-size-3xl)',
  fontWeight: 'var(--font-weight-bold)',
  color: 'var(--color-text)',
  lineHeight: 1.1,
};

function StatIcon({ type, color }) {
  const props = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: 2 };

  if (type === 'tasks') {
    return (
      <svg {...props}>
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
      </svg>
    );
  }
  if (type === 'completed') {
    return (
      <svg {...props}>
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    );
  }
  if (type === 'progress') {
    return (
      <svg {...props}>
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    );
  }
  return (
    <svg {...props}>
      <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
    </svg>
  );
}

export default function Stats({ tasks, projects }) {
  const totalTasks = tasks?.length || 0;
  const completedTasks = tasks?.filter((t) => t.status === 'done').length || 0;
  const inProgress = tasks?.filter((t) => t.status === 'in-progress').length || 0;
  const activeProjects = projects?.filter((p) => p.status === 'active').length || 0;

  const stats = [
    {
      label: 'Total Tasks',
      value: totalTasks,
      icon: 'tasks',
      iconBg: 'var(--color-info-light)',
      iconColor: 'var(--color-info)',
    },
    {
      label: 'Completed Tasks',
      value: completedTasks,
      icon: 'completed',
      iconBg: 'var(--color-success-light)',
      iconColor: 'var(--color-success)',
    },
    {
      label: 'In Progress',
      value: inProgress,
      icon: 'progress',
      iconBg: 'var(--color-warning-light)',
      iconColor: 'var(--color-warning)',
    },
    {
      label: 'Active Projects',
      value: activeProjects,
      icon: 'projects',
      iconBg: 'var(--color-primary-light)',
      iconColor: 'var(--color-primary)',
    },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)' }}>
      {stats.map((stat) => (
        <div key={stat.label} style={statCardStyle}>
          <div style={headerStyle}>
            <div style={iconContainerStyle(stat.iconBg)}>
              <StatIcon type={stat.icon} color={stat.iconColor} />
            </div>
            <span style={labelStyle}>{stat.label}</span>
          </div>
          <span style={valueStyle}>{stat.value}</span>
        </div>
      ))}
    </div>
  );
}
