import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import { adminOrders } from "../../data/homeContent";

function StatusPill({ status }) {
  const tone = status === "Completed" ? "bg-[#e9f8ee] text-[#1d7c40]" : status === "Pending" ? "bg-[#fff4dc] text-[#b17616]" : "bg-[#e7f0fe] text-[#285fa8]";
  return <span className={`inline-flex min-w-[112px] justify-center rounded-full px-3 py-2 text-sm font-semibold ${tone}`}>{status}</span>;
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
      actions={<button className="rounded-[14px] bg-brand-green px-5 py-3 font-semibold text-white">Export</button>}
    >
      <section className="flex flex-col gap-4 rounded-[24px] border border-[#e8edf3] bg-white p-5 shadow-[0_16px_38px_rgba(15,20,30,0.05)] sm:flex-row sm:items-center">
        <label className="flex flex-1 items-center gap-3 rounded-[16px] border border-[#dde5ef] bg-[#f8fbff] px-4">
          <Search className="h-4 w-4 text-[#748094]" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search orders..." className="h-14 w-full border-0 bg-transparent outline-none" />
        </label>
        <select value={status} onChange={(event) => setStatus(event.target.value)} className="h-14 rounded-[16px] border border-[#dde5ef] px-4 outline-none">
          <option>All</option>
          <option>Completed</option>
          <option>Pending</option>
          <option>In Progress</option>
        </select>
      </section>

      <section className="rounded-[24px] border border-[#e8edf3] bg-white p-5 shadow-[0_16px_38px_rgba(15,20,30,0.05)]">
        <div className="overflow-x-auto">
          <table className="min-w-[860px] w-full border-collapse">
            <thead>
              <tr className="border-b border-[#edf1f6] text-left text-sm uppercase tracking-[0.08em] text-[#707d90]">
                <th className="px-3 py-4">Order ID</th>
                <th className="px-3 py-4">Customer</th>
                <th className="px-3 py-4">Service</th>
                <th className="px-3 py-4">Price</th>
                <th className="px-3 py-4">Date</th>
                <th className="px-3 py-4">Status</th>
                <th className="px-3 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((item) => (
                <tr key={item.id} className="border-b border-[#edf1f6] text-[#141b24]">
                  <td className="px-3 py-4">{item.id}</td>
                  <td className="px-3 py-4">{item.customer}</td>
                  <td className="px-3 py-4">{item.service}</td>
                  <td className="px-3 py-4">{item.price}</td>
                  <td className="px-3 py-4">{item.date}</td>
                  <td className="px-3 py-4"><StatusPill status={item.status} /></td>
                  <td className="px-3 py-4"><button className="rounded-[12px] border border-[#d8e0ea] px-4 py-2 font-semibold">View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-5 flex items-center justify-between gap-4 text-sm text-[#617086]">
          <button className="rounded-[12px] border border-[#d8e0ea] px-4 py-2 font-semibold">Prev</button>
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-[10px] bg-[#1d2633] text-white">1</span>
            <span className="grid h-9 w-9 place-items-center rounded-[10px] bg-[#f5f8fc]">2</span>
            <span className="grid h-9 w-9 place-items-center rounded-[10px] bg-[#f5f8fc]">3</span>
          </div>
          <button className="rounded-[12px] border border-[#d8e0ea] px-4 py-2 font-semibold">Next</button>
        </div>
      </section>
    </AdminLayout>
  );
}

