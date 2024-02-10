import UsersTable from "../components/UsersTable";

function AdminDashboard() {
  return (
    <div className="container">
      <h4 className="text-center fw-semibold bg-danger-subtle p-3">
        Admin Dashboard
      </h4>
      <UsersTable />
    </div>
  );
}

export default AdminDashboard;
