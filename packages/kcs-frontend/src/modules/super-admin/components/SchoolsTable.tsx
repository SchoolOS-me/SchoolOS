import "./SchoolsTable.css";

type School = {
  id: string;
  name: string;
  adminName: string;
  adminEmail: string;
  subscriptionStatus: "active" | "expired" | "trial";
};

type Props = {
  schools: School[];
};

const SchoolsTable = ({ schools }: Props) => {
  if (schools.length === 0) {
    return (
      <div className="schoolsEmptyState">
        <h3>No schools added yet</h3>
        <p>
          Start by adding a school and assigning an admin to manage it.
        </p>
        <button className="primaryAction">Add School</button>
      </div>
    );
  }

  return (
    <div className="schoolsTableCard">
      <div className="schoolsTableHeader">
        <h2>Schools Management</h2>
        <div className="schoolsTableActions">
          <button type="button" className="tableHeaderButton">
            <span className="tableHeaderIcon" aria-hidden="true">
              <svg viewBox="0 0 24 24" role="presentation">
                <path d="M4 6h16M7 12h10M10 18h4" />
              </svg>
            </span>
            Filter
          </button>
          <button type="button" className="tableHeaderButton">
            <span className="tableHeaderIcon" aria-hidden="true">
              <svg viewBox="0 0 24 24" role="presentation">
                <path d="M12 4v10m0 0l-4-4m4 4l4-4M5 20h14" />
              </svg>
            </span>
            Export
          </button>
        </div>
      </div>
      <div className="schoolsTableWrapper">
        <table className="schoolsTable">
          <thead>
            <tr>
              <th>School Name</th>
              <th>Admin Name</th>
              <th>Admin Email</th>
              <th>Subscription Status</th>
              <th className="align-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {schools.map((school) => (
              <tr key={school.id}>
                <td className="cellStrong">{school.name}</td>
                <td>{school.adminName}</td>
                <td>{school.adminEmail}</td>
                <td>
                  <span
                    className={`subscriptionBadge subscription-${school.subscriptionStatus}`}
                  >
                    {school.subscriptionStatus}
                  </span>
                </td>
                <td className="align-right">
                  <button className="tableAction">Manage</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="schoolsTableFooter">
        <p>Showing 1 to {schools.length} of 124 schools</p>
        <div className="pagination">
          <button type="button" className="paginationButton" disabled>
            <svg viewBox="0 0 24 24" role="presentation">
              <path d="M14 6l-6 6 6 6" />
            </svg>
          </button>
          <button type="button" className="paginationButton">
            <svg viewBox="0 0 24 24" role="presentation">
              <path d="M10 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SchoolsTable;
