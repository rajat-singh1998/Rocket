import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import { adminOrders } from "../../data/homeContent";
import "./AdminOrdersPage.css";

function StatusPill({ status }) {
  const toneClass =
    status === "Completed"
      ? "admin-orders__status admin-orders__status--completed"
      : status === "Pending"
        ? "admin-orders__status admin-orders__status--pending"
        : "admin-orders__status admin-orders__status--progress";

  return <span className={toneClass}>{status}</span>;
}

export default function AdminOrdersPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");

  const filteredOrders = useMemo(() => {
    return adminOrders.filter((item) => {
      const matchesQuery = !query || [item.id, item.customer, item.service].some((value) => value.toLowerCase().includes(query.toLowerCase()));
      const matchesStatus = status === "All" || item.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [query, status]);

  return (
    <AdminLayout
      title="Orders Management"
      description="Track order status, customer details, and service activity."
      actions={<button className="admin-orders__action-button">Export</button>}
    >
      <section className="admin-orders__toolbar">
        <label className="admin-orders__search-box">
          <Search size={16} className="admin-orders__search-icon" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search orders..." className="admin-orders__search-input" />
        </label>
        <select value={status} onChange={(event) => setStatus(event.target.value)} className="admin-orders__select">
          <option>All</option>
          <option>Completed</option>
          <option>Pending</option>
          <option>In Progress</option>
        </select>
      </section>

      <section className="admin-orders__table-card">
        <div className="admin-orders__table-wrap">
          <table className="admin-orders__table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Service</th>
                <th>Price</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.customer}</td>
                  <td>{item.service}</td>
                  <td>{item.price}</td>
                  <td>{item.date}</td>
                  <td><StatusPill status={item.status} /></td>
                  <td><button className="admin-orders__table-button">View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="admin-orders__pagination">
          <button className="admin-orders__table-button">Prev</button>
          <div className="admin-orders__pages">
            <span className="admin-orders__page admin-orders__page--active">1</span>
            <span className="admin-orders__page">2</span>
            <span className="admin-orders__page">3</span>
          </div>
          <button className="admin-orders__table-button">Next</button>
        </div>
      </section>
    </AdminLayout>
  );
}
