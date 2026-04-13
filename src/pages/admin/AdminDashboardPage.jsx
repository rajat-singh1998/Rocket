import AdminLayout from "../../components/layout/AdminLayout";
import { dashboardStats, recentOrders, revenueBars } from "../../data/homeContent";
import { Link } from "react-router-dom";

function StatusPill({ status }) {
  const tone = status === "Completed" ? "bg-[#e9f8ee] text-[#1d7c40]" : status === "Pending" ? "bg-[#fff4dc] text-[#b17616]" : "bg-[#e7f0fe] text-[#285fa8]";

  return <span className={`inline-flex min-w-[110px] justify-center rounded-full px-3 py-2 text-sm font-semibold ${tone}`}>{status}</span>;
}

export default function AdminDashboardPage() {
  return (
    <AdminLayout title="Dashboard" description="Overview of orders, users, revenue, and requests.">
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((item) => (
          <article key={item.label} className="rounded-[24px] border border-[#e8edf3] bg-white p-6 shadow-[0_16px_38px_rgba(15,20,30,0.05)]">
            <p className="text-sm text-[#748094]">{item.label}</p>
            <p className="mt-4 text-[2.4rem] font-semibold tracking-[-0.05em] text-[#141b24]">{item.value}</p>
            <p className={`mt-3 text-sm font-semibold ${item.down ? "text-[#d9485f]" : "text-[#2f9e44]"}`}>{item.change}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-[24px] border border-[#e8edf3] bg-white p-6 shadow-[0_16px_38px_rgba(15,20,30,0.05)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-[1.35rem] font-semibold tracking-[-0.03em] text-[#141b24]">Revenue Overview</h2>
              <p className="mt-2 text-sm text-[#7a8598]">Monthly revenue trend across current orders.</p>
            </div>
            <span className="rounded-full bg-[#eff4fa] px-3 py-2 text-xs font-semibold text-[#4f5f79]">2026</span>
          </div>

          <div className="mt-6 flex h-[310px] items-end gap-3 rounded-[22px] bg-[linear-gradient(180deg,#f8fbff_0%,#eef5fb_100%)] px-5 pb-5 pt-10">
            {revenueBars.map((item, index) => (
              <div key={index} className="flex-1 rounded-t-[14px] bg-[linear-gradient(180deg,rgba(110,175,65,0.86)_0%,rgba(110,175,65,0.28)_100%)]" style={{ height: `${item}%` }} />
            ))}
          </div>
        </article>

        <article className="rounded-[24px] border border-[#e8edf3] bg-white p-6 shadow-[0_16px_38px_rgba(15,20,30,0.05)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-[1.35rem] font-semibold tracking-[-0.03em] text-[#141b24]">Recent Orders</h2>
              <p className="mt-2 text-sm text-[#7a8598]">Latest orders moving through the system.</p>
            </div>
            <Link to="/admin/orders" className="text-sm font-semibold text-brand-green">View all</Link>
          </div>

          <div className="mt-5 grid gap-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="grid gap-3 rounded-[18px] bg-[#f7fafc] p-4 lg:grid-cols-[1fr_1fr_auto] lg:items-center">
                <div>
                  <p className="font-semibold text-[#141b24]">{order.id}</p>
                  <p className="mt-1 text-sm text-[#6d7788]">{order.customer}</p>
                </div>
                <div>
                  <p className="text-sm text-[#141b24]">{order.service}</p>
                  <p className="mt-1 text-sm text-[#6d7788]">{order.amount}</p>
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

