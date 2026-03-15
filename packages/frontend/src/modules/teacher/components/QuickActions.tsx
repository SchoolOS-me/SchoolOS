import './QuickActions.css';

type Action = {
  id: number;
  label: string;
  description: string;
};

const actions: Action[] = [
  {
    id: 1,
    label: 'Take Attendance',
    description: 'Mark today’s attendance',
  },
  {
    id: 2,
    label: 'Enter Marks',
    description: 'Update student marks',
  },
  {
    id: 3,
    label: 'View Results',
    description: 'Check exam results',
  },
  {
    id: 4,
    label: 'Upload Data',
    description: 'Import via Excel',
  },
];

const QuickActions = () => {
  return (
    <div className="quick-actions">
      <h2 className="quick-actions__title">Quick Actions</h2>

      <div className="quick-actions__grid">
        {actions.map((action) => (
          <div key={action.id} className="quick-actions__card">
            <div className="quick-actions__label">{action.label}</div>
            <div className="quick-actions__description">
              {action.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
