import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import { adminUsers } from "../../data/homeContent";

function StatusPill({ status }) {
  const tone = status === "Active" ? "bg-[#e9f8ee] text-[#1d7c40]" : "bg-[#fff4dc] text-[#b17616]";
  return <span className={`inline-flex min-w-[112px] justify-center rounded-full px-3 py-2 text-sm font-semibold ${tone}`}>{status}</span>;
}

export default function AdminUsersPage() {
  const [query, setQuery] = useState("");

  const filteredUsers = useMemo(() => {
    return adminUsers.filter((item) => [item.name, item.email, item.role].some((value) => value.toLowerCase().includes(query.toLowerCase())));
  }, [query]);

  return (
    <AdminLayout
      title="User Management"
      description="View team members and account statuses."
      actions={<button className="rounded-[14px] bg-brand-green px-5 py-3 font-semibold text-white">Add User</button>}
    >
      <section className="flex flex-col gap-4 rounded-[24px] border border-[#e8edf3] bg-white p-5 shadow-[0_16px_38px_rgba(15,20,30,0.05)] sm:flex-row sm:items-center">
        <label className="flex flex-1 items-center gap-3 rounded-[16px] border border-[#dde5ef] bg-[#f8fbff] px-4">
          <Search className="h-4 w-4 text-[#748094]" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search users..." className="h-14 w-full border-0 bg-transparent outline-none" />
        </label>
      </section>

      <section className="rounded-[24px] border border-[#e8edf3] bg-white p-5 shadow-[0_16px_38px_rgba(15,20,30,0.05)]">
        <div className="overflow-x-auto">
          <table className="min-w-[760px] w-full border-collapse">
            <thead>
              <tr className="border-b border-[#edf1f6] text-left text-sm uppercase tracking-[0.08em] text-[#707d90]">
                <th className="px-3 py-4">Name</th>
                <th className="px-3 py-4">Email</th>
                <th className="px-3 py-4">Role</th>
                <th className="px-3 py-4">Status</th>
                <th className="px-3 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((item) => (
                <tr key={item.email} className="border-b border-[#edf1f6] text-[#141b24]">
                  <td className="px-3 py-4">{item.name}</td>
                  <td className="px-3 py-4">{item.email}</td>
                  <td className="px-3 py-4">{item.role}</td>
                  <td className="px-3 py-4"><StatusPill status={item.status} /></td>
                  <td className="px-3 py-4"><button className="rounded-[12px] border border-[#d8e0ea] px-4 py-2 font-semibold">Edit</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AdminLayout>
  );
}

