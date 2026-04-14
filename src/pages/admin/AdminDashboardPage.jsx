import { Link } from "react-router-dom";
import AdminLayout from "../../components/layout/AdminLayout";
import { dashboardStats, recentOrders, revenueBars } from "../../data/homeContent";
import "./AdminDashboardPage.css";

function StatusPill({ status }) {
  const toneClass =
    status === "Completed"
      ? "admin-dashboard__status admin-dashboard__status--completed"
      : status === "Pending"
        ? "admin-dashboard__status admin-dashboard__status--pending"
        : "admin-dashboard__status admin-dashboard__status--progress";

  return <span className={toneClass}>{status}</span>;
}

export default function AdminDashboardPage() {
  return (
    <AdminLayout title="Dashboard" description="Overview of orders, users, revenue, and requests.">
      <section className="admin-dashboard__stats-grid">
        {dashboardStats.map((item) => (
          <article key={item.label} className="admin-dashboard__stat-card">
            <p className="admin-dashboard__stat-label">{item.label}</p>
            <p className="admin-dashboard__stat-value">{item.value}</p>
            <p className={`admin-dashboard__stat-change ${item.down ? "admin-dashboard__stat-change--down" : "admin-dashboard__stat-change--up"}`}>{item.change}</p>
          </article>
        ))}
      </section>

      <section className="admin-dashboard__panels-grid">
        <article className="admin-dashboard__panel">
          <div className="admin-dashboard__panel-head">
            <div>
              <h2 className="admin-dashboard__panel-title">Revenue Overview</h2>
              <p className="admin-dashboard__panel-text">Monthly revenue trend across current orders.</p>
            </div>
            <span className="admin-dashboard__year-badge">2026</span>
          </div>

          <div className="admin-dashboard__chart">
            {revenueBars.map((item, index) => (
              <div key={index} className="admin-dashboard__bar" style={{ height: `${item}%` }} />
            ))}
          </div>
        </article>

        <article className="admin-dashboard__panel">
          <div className="admin-dashboard__panel-head">
            <div>
              <h2 className="admin-dashboard__panel-title">Recent Orders</h2>
              <p className="admin-dashboard__panel-text">Latest orders moving through the system.</p>
            </div>
            <Link to="/admin/orders" className="admin-dashboard__view-link">
              View all
            </Link>
          </div>

          <div className="admin-dashboard__orders-list">
            {recentOrders.map((order) => (
              <div key={order.id} className="admin-dashboard__order-row">
                <div>
                  <p className="admin-dashboard__order-id">{order.id}</p>
                  <p className="admin-dashboard__order-meta">{order.customer}</p>
                </div>
                <div>
                  <p className="admin-dashboard__order-service">{order.service}</p>
                  <p className="admin-dashboard__order-meta">{order.amount}</p>
                </div>
                <StatusPill status={order.status} />
              </div>
            ))}
          </div>
        </article>
      </section>
    </AdminLayout>
  );
}
